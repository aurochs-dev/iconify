import type { IconifyIcon } from '@iconify/types';
import type { IconifyIconCustomisations as RawIconCustomisations } from '@iconify/utils/lib/customisations';

export { RawIconCustomisations };

/**
 * Icon render mode
 *
 * 'style' = 'bg' or 'mask', depending on icon content
 * 'bg' = inline style using `background`
 * 'mask' = inline style using `mask`
 * 'inline' = inline SVG.
 */
export type IconifyRenderMode = 'style' | 'bg' | 'mask' | 'inline';

// Allow rotation to be string
/**
 * Icon customisations
 */
export type IconifyIconCustomisations = RawIconCustomisations & {
	rotate?: string | number;
};

/**
 * Callback for when icon has been loaded (only triggered for icons loaded from API)
 */
export type IconifyIconOnLoad = (name: string) => void;

/**
 * Icon properties
 */
export interface IconifyIconProps extends IconifyIconCustomisations {
	// Icon object
	icon: IconifyIcon | string;

	// Render mode
	mode?: IconifyRenderMode;

	// Style
	color?: string;

	// Shorthand properties
	flip?: string;
	align?: string;
}

/**
 * Properties for element that are mentioned in render.ts
 */
interface IconifyElementProps {
	// Unique id, used as base for ids for shapes. Use it to get consistent ids for server side rendering
	id?: string;

	// Style
	style?: unknown;

	// Callback to call when icon data has been loaded. Used only for icons loaded from API
	onLoad?: IconifyIconOnLoad;
}

/**
 * Mix of icon properties and HTMLElement properties
 */
export type IconProps = IconifyElementProps & IconifyIconProps;
