# TESTING_STRATEGY.md

Document Type: Reference
Version: 2.1.0
Last Updated: 2026-01-21
Owner: Repository Root
Status: Active

This is a template testing strategy. Real projects should extend it.

## Principles
- Every task must be verifiable.
- Prefer fast, deterministic tests.
- Record verification commands in the task itself.

## Standard commands
- Governance + security + best-effort checks: `make ci`
- Repo-specific checks: define in `repo.manifest.yaml` under `commands.*`

## Coverage expectations
- Coverage thresholds are enforced in `vitest.config.ts` when running `npm run test:coverage`.
- Adjust thresholds only via P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md task with documented rationale.

## Minimum acceptable verification per change
- A runnable command (tests, lint, build, or a smoke check)
- Evidence in the session output (commands + results)

## Audit tooling prerequisites
Use this checklist before running audit scripts so results are deterministic. Why: audits fail fast when
their CLIs or browsers are missing, which can hide real regressions.

### Lighthouse (performance + SEO)
- Install Lighthouse CLI: `npm install -g lighthouse`
- Optional binary override: `LIGHTHOUSE_BIN=/path/to/lighthouse`
- Optional target override: `LIGHTHOUSE_BASE_URL=http://localhost:3000`
- Run command: `npm run audit:lighthouse` (requires a running dev server)

**OS tips + common failures**
- macOS: `brew install lighthouse` (alternative to npm global install).
- Linux CI: if Chrome deps are missing, prefer `npx playwright install --with-deps` before Lighthouse.
- Failure: `Lighthouse CLI not found` → install CLI or set `LIGHTHOUSE_BIN`.
- Failure: `ECONNREFUSED` → start `npm run dev` or update `LIGHTHOUSE_BASE_URL`.

### Accessibility (axe + Playwright)
- Install Playwright browsers: `npx playwright install --with-deps`
- Optional target override: `A11Y_BASE_URL=http://localhost:3000`
- Run command: `npm run audit:a11y` (requires a running dev server)

**OS tips + common failures**
- Linux: `--with-deps` is required for headless Chromium system libs.
- Failure: `Executable doesn't exist` → rerun `npx playwright install`.

### Cross-links
- Observability guidance: `docs/OBSERVABILITY.md`
- Contribution checklist: `docs/CONTRIBUTING.md`

## When to add more
Add coverage when:
- You introduce a new module boundary
- You add external integrations
- You change APIs or data models
