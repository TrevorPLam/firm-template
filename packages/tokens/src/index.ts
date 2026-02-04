// AI-META-BEGIN
// 
// AI-META: Package entry point and public API exports
// OWNERSHIP: packages/tokens
// ENTRYPOINTS: Package entry point, imported by consumers
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

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
