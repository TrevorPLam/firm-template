# OBSERVABILITY.md

Last Updated: 2026-01-21

Applies to repos that run services (API, worker, cron, etc.). For libraries/CLI, keep logging conventions only.

## Logging (required)
- Structured logs (JSON) for services.
- Include a correlation/request id on every request.
- Never log secrets or full PII.

## Metrics (recommended)
- Request count, latency, error rate
- Queue depth (workers)
- CPU/memory (if containerized)

## Tracing (optional)
- Add distributed tracing when there are multiple services or external dependencies.

## Analytics (optional)
- Tracking helpers live in [`lib/analytics.ts`](../lib/analytics.ts) and are provider-agnostic.
- No analytics events are wired by default; add event calls where needed.
- Provider setup requires:
  - Adding the provider script in `app/layout.tsx`
  - Setting `NEXT_PUBLIC_ANALYTICS_ID`
  - Updating CSP allowlists in `middleware.ts` (see `docs/SECURITY-CSP-ANALYTICS.md`)

### Conversion tracking checklist
- Contact form: call `trackFormSubmission('contact', true | false)` after submit.
- CTA buttons: call `trackCTAClick('cta text', 'destination')`.
- Custom events: use `trackEvent({ action, category, label })` with consistent naming.
- Verify events using the provider’s real-time/debug tools and check for CSP errors.

## Error handling
- Fail fast on configuration errors.
- Use consistent error codes/messages.
- Add alerting later; start with good logs now.

## Performance baselines (Lighthouse)

### Audit tooling prerequisites
Why: audits rely on external CLIs/browsers, so missing installs can mask real regressions.

- Lighthouse CLI: `npm install -g lighthouse`
- Playwright browsers (for a11y audits): `npx playwright install --with-deps`
- Base URL overrides:
  - `LIGHTHOUSE_BASE_URL=http://localhost:3000`
  - `A11Y_BASE_URL=http://localhost:3000`
- Optional binary override: `LIGHTHOUSE_BIN=/path/to/lighthouse`

Common failures:
- `Lighthouse CLI not found` → install CLI or set `LIGHTHOUSE_BIN`.
- `Executable doesn't exist` (Playwright) → run `npx playwright install --with-deps`.
- `ECONNREFUSED` → ensure `npm run dev` is running or update the base URL.

Run mobile Lighthouse audits locally against the running site:

```bash
npm run audit:lighthouse
```

This writes JSON reports under `reports/lighthouse/` (ignored by git) and a `mobile-summary.json` file you can copy into the baselines table below.

### Mobile baseline metrics (core pages)

| Page | Performance | Accessibility | Best Practices | SEO | LCP (ms) | FCP (ms) | CLS | TBT (ms) | Speed Index (ms) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home (`/`) | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** |
| Services (`/services`) | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** |
| Pricing (`/pricing`) | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** |
| Contact (`/contact`) | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** |

**Note:** Lighthouse CLI is required to capture baselines. If it is unavailable in the environment, run `npm run audit:lighthouse` locally and replace the **UNKNOWN** values above.

### Regression budgets

Budgets are configured in `.github/lighthouse/budget.json` and treated as **regression guards**, not hard, arbitrary goals. Update budgets only after capturing a new baseline and agreeing to the trade-offs.

## Sentry instrumentation

- Contact form submissions emit a dedicated performance span (`contact_form.submit`) to track client-side latency.
- Use Sentry traces for user-facing actions; avoid attaching PII to span attributes.
