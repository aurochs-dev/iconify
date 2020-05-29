import { RedundancyConfig } from '@cyberalien/redundancy';

/**
 * API config
 */
export interface IconifyAPIConfig extends RedundancyConfig {
	// Root path, after domain name and before prefix
	path: string;

	// URL length limit
	maxURL: number;
}

export type PartialIconifyAPIConfig = Partial<IconifyAPIConfig>;

/**
 * Create full API configuration from partial data
 */
function createConfig(
	source: PartialIconifyAPIConfig
): IconifyAPIConfig | null {
	if (!source.resources) {
		return null;
	}

	const result: IconifyAPIConfig = {
		// API hosts
		resources: source.resources,

		// Root path
		path: source.path === void 0 ? '/' : source.path,

		// URL length limit
		maxURL: source.maxURL ? source.maxURL : 500,

		// Timeout before next host is used.
		rotate: source.rotate ? source.rotate : 750,

		// Timeout to retry same host.
		timeout: source.timeout ? source.timeout : 5000,

		// Number of attempts for each host.
		limit: source.limit ? source.limit : 2,

		// Randomise default API end point.
		random: source.random === true,

		// Start index
		index: source.index ? source.index : 0,
	};

	return result;
}

/**
 * Local storage
 */
const configStorage: Record<string, IconifyAPIConfig> = Object.create(null);

/**
 * Redundancy for API servers.
 *
 * API should have very high uptime because of implemented redundancy at server level, but
 * sometimes bad things happen. On internet 100% uptime is not possible.
 *
 * There could be routing problems. Server might go down for whatever reason, but it takes
 * few minutes to detect that downtime, so during those few minutes API might not be accessible.
 *
 * This script has some redundancy to mitigate possible network issues.
 *
 * If one host cannot be reached in 'rotate' (750 by default) ms, script will try to retrieve
 * data from different host. Hosts have different configurations, pointing to different
 * API servers hosted at different providers.
 */
const fallBackAPISources = [
	'https://api.simplesvg.com',
	'https://api.unisvg.com',
];

// Shuffle fallback API
const fallBackAPI: string[] = [];
while (fallBackAPISources.length > 0) {
	if (fallBackAPISources.length === 1) {
		fallBackAPI.push(fallBackAPISources.shift() as string);
	} else {
		// Get first or last item
		if (Math.random() > 0.5) {
			fallBackAPI.push(fallBackAPISources.shift() as string);
		} else {
			fallBackAPI.push(fallBackAPISources.pop() as string);
		}
	}
}

// Add default API
configStorage[''] = createConfig({
	resources: ['https://api.iconify.design'].concat(fallBackAPI),
}) as IconifyAPIConfig;

/**
 * Add custom config for provider
 */
export function setAPIConfig(
	provider: string,
	customConfig: PartialIconifyAPIConfig
): void {
	const config = createConfig(customConfig);
	if (config === null) {
		return;
	}
	configStorage[provider] = config;
}

/**
 * Get API configuration
 */
export function getAPIConfig(provider: string): IconifyAPIConfig | undefined {
	return configStorage[provider];
}
