import { test, expect } from '@playwright/test'

// E2E sanity check: pricing page renders its core content for release readiness.
test('pricing page shows headline and tier cards', async ({ page }) => {
  await page.goto('/pricing')

  const headline = page.getByRole('heading', { name: /simple, transparent pricing/i })
  await expect(headline).toBeVisible()

  await expect(page.getByRole('heading', { name: /basic/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /professional/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /enterprise/i })).toBeVisible()
})
