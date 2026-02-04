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

import { expect, test } from '@playwright/test'

// Lightweight smoke test to confirm the homepage responds.
// Update the title matcher to align with each app's branding.
test('homepage responds with a title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Firm Template|Firm/i)
})
