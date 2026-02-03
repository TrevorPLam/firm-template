---
title: End-to-end testing
summary: Playwright setup for critical user journeys.
---

# End-to-end testing (Playwright)

Use this folder for Playwright specs that exercise critical user journeys. The
configuration lives in `playwright.config.ts` at the repo root.

## Quick start

```bash
pnpm exec playwright install
pnpm exec playwright test
```

## Conventions

- Keep specs focused on critical flows (lead capture, scheduling, navigation).
- Use the `PLAYWRIGHT_BASE_URL` environment variable for deployed environments.
- Store artifacts in `tests/reports/playwright`.
