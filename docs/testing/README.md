---
title: Testing strategy
summary: Unit, integration, and end-to-end testing guidance for the monorepo.
---

# Testing strategy

This template uses a layered testing approach:

- **Unit tests** via Vitest in each app/package.
- **Integration tests** in `tests/integration` with mocks and dockerized services.
- **End-to-end tests** via Playwright in `tests/e2e`.
- **Visual regression** baselines in `tests/visual`.
- **Shared fixtures** in `tests/fixtures`.

## Running tests locally

```bash
pnpm test
pnpm add -D @playwright/test
pnpm exec playwright test
```

## Reporting

Store reports under `tests/reports` so CI can upload artifacts consistently.
