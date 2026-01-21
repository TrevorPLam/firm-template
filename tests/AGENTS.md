# tests/AGENTS.md — End-to-End Tests

Last Updated: 2026-01-21
Applies To: Any agent working in tests/

## Required Reading
**⚠️ Before coding:** See `/BESTPR.md` for comprehensive best practices including:
- E2E testing patterns (Playwright)
- Test structure conventions
- When to add E2E vs unit tests

## Purpose
This folder contains end-to-end (E2E) tests using Playwright. These tests validate critical user flows in a real browser environment.

---

## Folder Structure

```
tests/
├── AGENTS.md          # This file
└── e2e/               # E2E test specs
    ├── home.spec.ts   # Homepage tests
    └── critical-flows.spec.ts  # Core user journeys
```

---

## E2E vs Unit Tests

### Use E2E Tests For:
- Critical user flows (contact form submission, search)
- Navigation and routing
- Integration between multiple components
- Browser-specific behavior
- Mobile responsiveness

### Use Unit Tests For:
- Individual component behavior
- Utility functions
- Form validation logic
- Error handling
- Edge cases

**Location:** Unit tests live in `__tests__/` (Vitest), E2E tests live in `tests/e2e/` (Playwright)

---

## Running E2E Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run with UI (see browser)
npx playwright test --ui

# Run specific test file
npx playwright test tests/e2e/home.spec.ts

# Debug mode
npx playwright test --debug

# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=webkit  # Safari
npx playwright test --project=firefox
```

---

## Test Structure

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should do expected behavior', async ({ page }) => {
    // Navigate
    await page.goto('/')
    
    // Interact
    await page.click('button[type="submit"]')
    
    // Assert
    await expect(page.locator('.success-message')).toBeVisible()
  })
})
```

---

## Current Test Coverage

### Critical Flows (critical-flows.spec.ts)
- ✅ Contact form submission with valid data
- ✅ Contact form validation errors
- ✅ Rate limiting enforcement
- ✅ Navigation menu (desktop and mobile)
- ✅ Search functionality

### Page Tests (home.spec.ts)
- ✅ Homepage loads and renders
- ✅ Hero section visible
- ✅ Services section visible
- ✅ Mobile responsiveness

---

## Playwright Configuration

Config: `playwright.config.ts` (root)

Key settings:
- **Browsers:** Chromium, Firefox, WebKit
- **Timeout:** 30 seconds per test
- **Retries:** 2 on CI, 0 locally
- **Screenshots:** On failure
- **Videos:** On failure (CI only)
- **Base URL:** http://localhost:3000 (requires dev server)

---

## Best Practices

### DO
- Test user-facing behavior, not implementation
- Use semantic locators (`getByRole`, `getByLabel`)
- Wait for elements with `expect().toBeVisible()`
- Test mobile viewport for responsive behavior
- Clean up state between tests

### DO NOT
- Test internal APIs directly (use page interactions)
- Use brittle selectors (CSS classes that might change)
- Create tests that depend on each other
- Leave tests failing (fix or skip with `test.skip()`)

---

## Locator Strategies

Prefer in this order:
1. **Role-based:** `page.getByRole('button', { name: 'Submit' })`
2. **Label-based:** `page.getByLabel('Email Address')`
3. **Text-based:** `page.getByText('Success message')`
4. **Test ID:** `page.getByTestId('contact-form')`
5. **CSS (last resort):** `page.locator('.some-class')`

---

## Adding a New E2E Test

1. **Identify critical flow**: What user behavior needs validation?
2. **Create test file**: `tests/e2e/feature-name.spec.ts`
3. **Write test**: Follow structure above
4. **Run locally**: `npm run dev` then `npx playwright test`
5. **Verify across browsers**: Test on chromium, firefox, webkit
6. **Update this file**: Add to "Current Test Coverage" section

---

## Debugging Failed Tests

```bash
# Run with UI (interactive debugging)
npx playwright test --ui

# Run in debug mode (step through)
npx playwright test --debug

# Generate trace (detailed timeline)
npx playwright test --trace on

# View trace file
npx playwright show-trace trace.zip
```

---

## CI/CD Integration

E2E tests run in GitHub Actions (when enabled):
- Runs on push to main and PRs
- Tests against production build
- Uploads screenshots/videos on failure
- Reports results to PR comments

**Note:** GitHub Actions are OFF by default. See `githubactions/README.md`.

---

## Mobile Testing

Test responsive behavior:
```typescript
test('mobile navigation works', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 })
  
  // Test mobile-specific UI
  await page.click('[aria-label="Open menu"]')
  await expect(page.locator('nav')).toBeVisible()
})
```

---

## Reference

- Playwright docs: https://playwright.dev
- Config file: `playwright.config.ts`
- Unit tests: `__tests__/` (Vitest)
