import { expect, test } from '@playwright/test'

// Lightweight smoke test to confirm the homepage responds.
// Update the title matcher to align with each app's branding.
test('homepage responds with a title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Firm Template|Firm/i)
})
