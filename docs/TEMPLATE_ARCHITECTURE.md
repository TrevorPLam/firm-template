# TEMPLATE_ARCHITECTURE.md — Architecture & Rationale

Last Updated: 2026-01-20
Status: Active

Goal: Explain the technical architecture, key decisions, and how the "Diamond Standard" is implemented.

---

## Architecture overview
- **Framework**: Next.js App Router (React Server Components)
- **Language**: TypeScript with strict typing
- **Styling**: Tailwind CSS utility-first styling
- **Content**: MDX-driven blog engine
- **Deployment**: Cloudflare Pages (edge runtime optimization)

---

## Key decisions (and why)
### 1) Next.js App Router + TypeScript
- Enables server-first rendering, composable layouts, and strong type safety.
- Keeps the template extensible without sacrificing performance.

### 2) Tailwind CSS
- Zero-runtime styling and consistent design tokens.
- Fast iteration for template adopters who need to swap colors/typography quickly.

### 3) MDX content engine
- Markdown + React components for flexible long-form content.
- Ideal for thought leadership content that needs structure plus interactivity.

### 4) Cloudflare Pages deployment
- Global edge performance and fast cold starts.
- Cost-efficient, simple CI/CD integration.

---

## Diamond Standard implementation
The Diamond Standard focuses on reliability, security, and observability:
- **Security**: CSP headers, input validation, secret scanning.
- **Performance**: Static rendering where possible, edge deployment.
- **Testing**: Unit tests (Vitest) + E2E tests (Playwright).
- **Observability**: Sentry-ready monitoring hooks.

---

## Extensibility map
> AI note: extend by adding new content sources or pages; avoid changing core infrastructure.

- **New services**: Add service pages in `/app/services/`.
- **New content types**: Add new MDX collections in `/content/`.
- **New integrations**: Add env variables and wire into `/lib/` utilities.

---

## Related docs
- [`docs/DIAMOND_STANDARD.md`](DIAMOND_STANDARD.md)
- [`docs/TESTING_STRATEGY.md`](TESTING_STRATEGY.md)
- [`docs/CLOUDFLARE_DEPLOYMENT.md`](CLOUDFLARE_DEPLOYMENT.md)
