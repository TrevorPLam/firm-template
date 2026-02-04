/**
 * Design tokens – single source of styling truth.
 * Themes: default.css, alt.css. Apps import the theme CSS and optionally set data-theme for switching.
 * @see docs/PLATFORM.md
 */

export type TokenNamespace = 'color' | 'typography' | 'spacing' | 'motion' | 'radius' | 'shadow';

/** Theme identifiers for data-theme attribute. */
export type ThemeId = 'default' | 'alt' | 'your-dedicated-marketer';

export const THEME_IDS: ThemeId[] = ['default', 'alt', 'your-dedicated-marketer'];

// Animation and Motion Design Tokens
export * from './animations/motion-tokens';
export * from './animations/presets';

// Advanced Theming System
export * from './themes/advanced';
export * from './themes/migration';

// Token Validation
export * from './validation/token-validator';
