import { test, expect } from '@playwright/test'

test('contact form submission on preview deploy', async ({ page }) => {
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'
  await page.setExtraHTTPHeaders({ 'x-forwarded-for': '203.0.113.120' })
  await page.goto(`${baseUrl}/contact`)

  await page.getByLabel('Name').fill('Preview Tester')
  await page.getByLabel('Email').fill(`preview.${Date.now()}@example.com`)
  await page.getByLabel('Phone').fill('555-000-1234')
  await page.getByLabel('Message').fill(
    'Submitting the contact form in a preview environment should return success.'
  )

  const [response] = await Promise.all([
    page.waitForResponse(
      (request) => request.request().method() === 'POST' && request.ok()
    ),
    page.getByRole('button', { name: /send message/i }).click(),
  ])

  expect(response.ok()).toBe(true)
  await expect(page.getByRole('alert')).toContainText(/thank you for your message/i)
})
