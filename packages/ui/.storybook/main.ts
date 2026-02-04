// AI-META-BEGIN
// 
// AI-META: Shared package module
// OWNERSHIP: packages/ui (shared UI components)
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: internal packages (@repo/*), React
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

/**
 * Storybook Main Configuration
 * 
 * This file configures Storybook for the @repo/ui package.
 * It enables React support, TypeScript, and accessibility testing.
 * 
 * @see https://storybook.js.org/docs/react/configure/overview
 */

import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // Story file locations
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  
  // Addons for enhanced functionality
  addons: [
    '@storybook/addon-links',           // Enable linking between stories
    '@storybook/addon-essentials',      // Core addons (controls, actions, etc.)
    '@storybook/addon-interactions',    // Test user interactions
    '@storybook/addon-a11y',            // Accessibility testing (required per acceptance criteria)
  ],
  
  // Framework configuration
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  
  // Documentation configuration
  docs: {
    autodocs: 'tag', // Enable automatic documentation generation
  },
  
  // TypeScript configuration
  typescript: {
    check: false, // Disable type checking in Storybook (handled by workspace)
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => {
        // Filter out props from node_modules
        if (prop.parent) {
          return !prop.parent.fileName.includes('node_modules');
        }
        return true;
      },
    },
  },
  
  // Static directories for assets
  staticDirs: ['../public'],
};

export default config;
