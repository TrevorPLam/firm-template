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
 * Example Accessibility Test Suite
 * 
 * Demonstrates how to use the accessibility testing helpers
 * to validate WCAG 2.1 Level AA compliance.
 * 
 * @see https://www.w3.org/WAI/WCAG21/quickref/
 */

import { test, expect, checkA11y } from './helpers';

test.describe('Accessibility Testing Examples', () => {
  test('should have no accessibility violations on homepage', async ({ page, makeAxeBuilder }) => {
    // Navigate to the page
    await page.goto('http://localhost:3000');

    // Run accessibility scan
    await checkA11y(makeAxeBuilder, 'homepage');
  });

  test('should have accessible navigation', async ({ page, makeAxeBuilder }) => {
    await page.goto('http://localhost:3000');

    // Check navigation specifically
    const accessibilityScanResults = await makeAxeBuilder()
      .include('nav')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Tab through focusable elements
    await page.keyboard.press('Tab');
    
    // Verify first focusable element has focus
    const firstFocusable = await page.locator(':focus').first();
    expect(firstFocusable).toBeTruthy();

    // Test that all interactive elements are keyboard accessible
    const interactiveElements = await page.locator('button, a, input, textarea, select').all();
    
    for (const element of interactiveElements) {
      const isVisible = await element.isVisible();
      if (isVisible) {
        await element.focus();
        const isFocused = await element.evaluate(el => el === document.activeElement);
        expect(isFocused, 'Interactive element should be keyboard focusable').toBe(true);
      }
    }
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check that buttons have accessible names
    const buttons = await page.locator('button').all();
    
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();
      
      expect(
        ariaLabel || textContent?.trim(),
        'Button should have accessible name via aria-label or text content'
      ).toBeTruthy();
    }
  });

  test('should have sufficient color contrast', async ({ page, makeAxeBuilder }) => {
    await page.goto('http://localhost:3000');

    // Run scan specifically for color contrast
    const accessibilityScanResults = await makeAxeBuilder()
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Get all headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    
    let previousLevel = 0;
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const currentLevel = parseInt(tagName.substring(1));
      
      // Heading levels should not skip (e.g., h1 -> h3)
      if (previousLevel > 0) {
        expect(
          currentLevel <= previousLevel + 1,
          `Heading levels should not skip: ${tagName} after h${previousLevel}`
        ).toBe(true);
      }
      
      previousLevel = currentLevel;
    }
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      const role = await img.getAttribute('role');
      
      // Image should have alt text, aria-label, or role="presentation"
      expect(
        alt !== null || ariaLabel || role === 'presentation',
        'Image should have alt text or be marked as presentational'
      ).toBe(true);
    }
  });

  test('should have form labels', async ({ page, makeAxeBuilder }) => {
    await page.goto('http://localhost:3000');

    // Run scan for form labels
    const accessibilityScanResults = await makeAxeBuilder()
      .withRules(['label'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
