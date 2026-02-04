// AI-META-BEGIN
// 
// AI-META: Configuration file
// OWNERSHIP: root (configuration)
// ENTRYPOINTS: Loaded by build tools at compile time
// DEPENDENCIES: Standard library only
// DANGER: Environment variable access - validate all values
// CHANGE-SAFETY: Config values: safe to modify. Schema/structure: coordinate with team
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

import { defineConfig } from '@playwright/test'

// Central Playwright configuration for template E2E and smoke testing.
// Extend the projects array when new apps are added to the monorepo.
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
  },
  reporter: [['list'], ['html', { outputFolder: 'tests/reports/playwright' }]],
})
