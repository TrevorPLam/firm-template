// AI-META-BEGIN
// 
// AI-META: Shared package module
// OWNERSHIP: packages/ui (shared UI components)
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: React
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

/**
 * Storybook Preview Configuration
 * 
 * This file configures the global settings for all stories,
 * including parameters, decorators, and default args.
 * 
 * @see https://storybook.js.org/docs/react/configure/overview#configure-story-rendering
 */

import type { Preview } from '@storybook/react';

const preview: Preview = {
  // Global parameters for all stories
  parameters: {
    // Configure actions addon
    actions: { argTypesRegex: '^on[A-Z].*' },
    
    // Configure controls addon
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    
    // Accessibility addon configuration
    a11y: {
      // Configure axe-core options
      config: {
        rules: [
          {
            // Ensure color contrast meets WCAG AA standards
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
    
    // Layout configuration
    layout: 'centered', // Center stories by default
    
    // Background configuration
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
      ],
    },
  },
  
  // Global arg types for all stories
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
