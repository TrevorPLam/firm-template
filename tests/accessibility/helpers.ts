// AI-META-BEGIN
// 
// AI-META: Test suite
// OWNERSHIP: root (configuration)
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

/**
 * Accessibility Testing Configuration
 * 
 * This module provides configuration and utilities for automated
 * accessibility testing using axe-core with Playwright.
 * 
 * WCAG 2.1 Level AA Compliance Testing
 */

import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility test fixture with axe-core integration
 */
export const test = base.extend({
  /**
   * Make accessibility testing utilities available in all tests
   */
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('#webpack-dev-server-client-overlay');
    await use(makeAxeBuilder);
  },
});

export { expect };

/**
 * Accessibility test options
 */
export const a11yOptions = {
  detailedReport: true,
  detailedReportOptions: {
    html: true,
  },
};

/**
 * Helper function to run accessibility scan and report violations
 * 
 * @param makeAxeBuilder - Function to create AxeBuilder instance
 * @param context - Test context for better error reporting
 */
export async function checkA11y(
  makeAxeBuilder: () => AxeBuilder,
  context: string = 'page'
): Promise<void> {
  const accessibilityScanResults = await makeAxeBuilder().analyze();

  // Assert no violations
  expect(accessibilityScanResults.violations, 
    `Expected no accessibility violations in ${context}`
  ).toEqual([]);

  // Log passes for visibility
  if (accessibilityScanResults.passes.length > 0) {
    console.log(`✓ ${accessibilityScanResults.passes.length} accessibility checks passed for ${context}`);
  }
}

/**
 * Common WCAG 2.1 rules to test
 */
export const wcagRules = {
  // Level A
  levelA: [
    'area-alt',
    'aria-allowed-attr',
    'aria-required-attr',
    'aria-required-children',
    'aria-required-parent',
    'aria-roles',
    'aria-valid-attr',
    'aria-valid-attr-value',
    'button-name',
    'color-contrast',
    'document-title',
    'form-field-multiple-labels',
    'html-has-lang',
    'html-lang-valid',
    'image-alt',
    'input-button-name',
    'input-image-alt',
    'label',
    'link-name',
    'list',
    'listitem',
    'meta-viewport',
  ],
  
  // Level AA (includes all Level A)
  levelAA: [
    'color-contrast',
    'link-in-text-block',
  ],
};

/**
 * Accessibility test categories
 */
export const a11yCategories = {
  keyboard: 'Keyboard Navigation',
  screenReader: 'Screen Reader Support',
  visual: 'Visual Accessibility',
  semantics: 'Semantic HTML',
  forms: 'Form Accessibility',
};
