# Glossary

## Architecture Terms

| Term | Definition |
|------|------------|
| **App Router** | Next.js 13+ routing system using `/app` directory (vs. Pages Router using `/pages`) |
| **Client Site** | A distinct marketing website for a specific client/brand, built from shared platform packages |
| **Design Tokens** | Centralized design values (colors, spacing, typography) used across all components |
| **Layering** | Architectural principle where packages depend on lower layers only (no cycles) |
| **Monorepo** | Single repository containing multiple packages/apps with shared dependencies |
| **Pattern** | Pre-composed marketing section (Hero, Features, Pricing) built from UI primitives |
| **Primitive** | Basic UI component (Button, Input, Card) that cannot be decomposed further |
| **Server Components (RSC)** | React components that render only on the server, reducing client bundle size |
| **Workspace** | pnpm concept for linking local packages together without publishing to npm |

## Platform-Specific Terms

| Term | Definition |
|------|------------|
| **Capability** | Business feature module (Lead Capture, Analytics) that may use integrations |
| **Integration** | Adapter for third-party service (HubSpot, Google Analytics) - disabled by default |
| **Theme Pack** | Set of design tokens for a specific client brand (colors, fonts, spacing overrides) |
| **Baked-in Client Architecture** | Model where client sites are apps (not forks) that select themes and compose patterns |
| **No-op Adapter** | Integration implementation that does nothing (default state, enabled via config) |
| **Forking** | Copying and modifying shared packages (forbidden in this platform) |

## Technology Acronyms

| Acronym | Full Name | Usage |
|---------|-----------|-------|
| **ADR** | Architecture Decision Record | Documentation of significant architectural decisions |
| **API** | Application Programming Interface | Backend endpoints, REST APIs |
| **CI/CD** | Continuous Integration / Continuous Deployment | Automated build and deployment pipelines |
| **CSS** | Cascading Style Sheets | Styling language; tokens export as CSS variables |
| **CMS** | Content Management System | External content provider (Sanity, Contentful, etc.) |
| **DB** | Database | Data storage (PostgreSQL in this platform) |
| **E2E** | End-to-End | Full-system tests (Playwright) |
| **ESM** | ECMAScript Modules | Modern JavaScript module system (import/export) |
| **GA** | Google Analytics | Web analytics service |
| **HMR** | Hot Module Replacement | Live reload without full page refresh (dev mode) |
| **HTTP** | Hypertext Transfer Protocol | Web communication protocol |
| **ISR** | Incremental Static Regeneration | Next.js feature for updating static pages without rebuild |
| **JSON** | JavaScript Object Notation | Data interchange format |
| **ORM** | Object-Relational Mapping | Database abstraction (Django ORM) |
| **PWA** | Progressive Web App | Web app with native-like features (offline, install) |
| **REST** | Representational State Transfer | API architectural style (HTTP methods) |
| **RSC** | React Server Components | React components that render on server only |
| **SEO** | Search Engine Optimization | Techniques for improving search rankings |
| **SSG** | Static Site Generation | Pre-rendering pages at build time |
| **SSR** | Server-Side Rendering | Rendering pages on-demand at request time |
| **WASM** | WebAssembly | Binary instruction format for web (high performance) |
| **WSGI** | Web Server Gateway Interface | Python web server standard (for Django) |

## Domain Language

| Term | Definition |
|------|------------|
| **Lead** | Prospective customer who submitted contact information via form |
| **Lead Capture** | Process of collecting user contact information (email, phone, etc.) |
| **Marketing Site** | Public-facing website promoting products/services (not a SaaS app) |
| **Client Onboarding** | Process of creating a new client site (copy template, apply theme) |
| **Page View** | Analytics event when user loads a page |
| **Conversion** | User completes desired action (form submission, purchase, etc.) |
| **A/B Test** | Experiment comparing two versions of a page/feature |
| **Hero Section** | Large banner at top of page (headline, CTA, image) |
| **CTA** | Call-to-Action (button/link prompting user to take action) |
| **Social Proof** | Testimonials, reviews, client logos demonstrating credibility |

## Package Names

| Package Name | Nickname | Purpose |
|--------------|----------|---------|
| `@repo/web` | "web" | Main production marketing site |
| `@repo/template-site` | "template" | Starter template for new clients |
| `@repo/your-dedicated-marketer` | "YDM" | Second client site example |
| `@repo/tokens` | "tokens" | Design tokens (colors, spacing, typography) |
| `@repo/ui` | "ui" | UI primitives (Button, Input, Card) |
| `@repo/patterns` | "patterns" | Marketing sections (Hero, Features, Pricing) |
| `@repo/capabilities` | "capabilities" | Business features (Lead Capture, Analytics) |
| `@repo/integrations` | "integrations" | Third-party adapters (HubSpot, GA) |
| `@repo/utils` | "utils" | Shared utilities |
| `@repo/wasm` | "wasm" | WebAssembly modules |
| `@repo/config` | "config" | Shared configs (TypeScript, Prettier) |

## File/Directory Conventions

| Path Pattern | Meaning |
|--------------|---------|
| `/apps/*` | Client site applications (Next.js) |
| `/packages/*` | Shared platform packages |
| `/services/*` | Backend services (api-gateway) |
| `/docs/*` | Documentation (you are here) |
| `/scripts/*` | Build and automation scripts |
| `/tests/*` | End-to-end tests |
| `/app/page.tsx` | Next.js App Router page component |
| `/app/layout.tsx` | Next.js App Router layout component |
| `/app/api/*/route.ts` | Next.js API route handler |
| `package.json` | npm package manifest (dependencies, scripts) |
| `tsconfig.json` | TypeScript configuration |
| `next.config.js` | Next.js configuration |
| `.env` | Environment variables (local, never committed) |
| `.env.example` | Environment variable template (committed) |

## Environment Variables

| Variable Prefix | Scope | Example |
|-----------------|-------|---------|
| `NEXT_PUBLIC_*` | Browser + Server | `NEXT_PUBLIC_SITE_URL` |
| `SUPABASE_*` | Server-only | `SUPABASE_SERVICE_ROLE_KEY` |
| `HUBSPOT_*` | Server-only | `HUBSPOT_PRIVATE_APP_TOKEN` |
| `DATABASE_*` | Server-only | `DATABASE_URL` |
| `AI_*` | Server-only | `AI_API_KEY` |
| `EMAIL_*` | Server-only | `EMAIL_API_KEY` |

**Rule**: `NEXT_PUBLIC_*` variables are exposed to the browser. All others are server-only.

## Common Commands

| Command | Purpose |
|---------|---------|
| `pnpm install` | Install all dependencies (monorepo-wide) |
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Lint all packages |
| `pnpm type-check` | Type check all packages |
| `pnpm test` | Run all tests |
| `pnpm --filter @repo/web dev` | Start specific app (web) in dev mode |
| `docker-compose up` | Start all services (apps + api-gateway) |
| `turbo run build` | Build all packages via Turbo (respects cache) |

## Workflow Terms

| Term | Definition |
|------|------------|
| **Workspace Protocol** | pnpm syntax for referencing local packages (`workspace:*`) |
| **Turbo Cache** | Build output cache for faster rebuilds |
| **Dependency Graph** | Tree of package dependencies (enforced by Turbo) |
| **Pipeline** | Sequence of build tasks (lint → type-check → build → test) |
| **Hot Reload** | Automatic browser refresh when code changes (dev mode) |
| **Hydration** | Process of attaching React to server-rendered HTML |
| **Code Splitting** | Breaking JS bundle into smaller chunks for faster loading |
| **Tree Shaking** | Removing unused code from production bundle |

## Related Documentation

For deeper dives, see:
- **Architecture**: [00_INDEX.md](00_INDEX.md)
- **Platform rules**: [../PLATFORM.md](../PLATFORM.md)
- **API docs**: [../api/README.md](../api/README.md)
- **Security**: [../SECURITY.md](../SECURITY.md)
- **Contributing**: [../../CONTRIBUTING.md](../../CONTRIBUTING.md)

---

**Back to**: [00_INDEX.md](00_INDEX.md) (Architecture documentation index)
