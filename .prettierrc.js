// AI-META-BEGIN
// 
// AI-META: Application module
// OWNERSHIP: root (configuration)
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

/**
 * Prettier configuration for monorepo
 * Ensures consistent code formatting across all packages
 */
module.exports = {
  // Print width
  printWidth: 80,

  // Tab width
  tabWidth: 2,

  // Use spaces instead of tabs
  useTabs: false,

  // Semicolons
  semi: true,

  // Single quotes
  singleQuote: false,

  // Quote props only when needed
  quoteProps: "as-needed",

  // JSX single quotes
  jsxSingleQuote: false,

  // Trailing commas
  trailingComma: "all",

  // Bracket spacing
  bracketSpacing: true,

  // JSX bracket same line
  bracketSameLine: false,

  // Arrow function parentheses
  arrowParens: "always",

  // End of line
  endOfLine: "lf",

  // Embedded language formatting
  embeddedLanguageFormatting: "auto",
};
