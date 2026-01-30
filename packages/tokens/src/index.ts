/**
 * Design tokens – single source of styling truth.
 * Themes: default.css, alt.css. Apps import the theme CSS and optionally set data-theme for switching.
 * @see docs/PLATFORM.md
 */

export type TokenNamespace = 'color' | 'typography' | 'spacing' | 'motion' | 'radius' | 'shadow';

/** Theme identifiers for data-theme attribute. */
export type ThemeId = 'default' | 'alt';

export const THEME_IDS: ThemeId[] = ['default', 'alt'];
