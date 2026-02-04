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

### Unit and Integration Tests
```bash
pnpm test
```

### End-to-End Tests with Playwright

Playwright is included as a workspace devDependency. To install Playwright browsers:

```bash
# Install Playwright browsers (required for first-time setup)
pnpm exec playwright install

# Run all E2E tests
pnpm exec playwright test

# Run E2E tests in UI mode (interactive)
pnpm exec playwright test --ui

# Run specific test file
pnpm exec playwright test tests/e2e/homepage.spec.ts
```

## Reporting

Store reports under `tests/reports` so CI can upload artifacts consistently.
