# System Overview

## What This Platform Does

This is a **multi-tenant marketing site platform** built on Next.js. The platform enables:
- Creating multiple branded marketing sites from shared components
- Reusable UI primitives, patterns, and capabilities across all client sites
- Client-specific theming via design tokens (no forking of components)
- Integration with third-party services (HubSpot, analytics, CMS) via adapters

**Primary use case**: Deploy distinct marketing websites for different clients/brands while maintaining a single codebase for all shared functionality.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    APPS (Client Sites)                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │ web         │  │ template-site│  │ your-dedicated-    │    │
│  │ (main site) │  │ (starter)    │  │ marketer (client2) │    │
│  └─────────────┘  └──────────────┘  └────────────────────┘    │
└───────────────────────┬─────────────────────────────────────────┘
                        │ composes from
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PACKAGES (Shared)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ tokens   │→ │ ui       │→ │ patterns │→ │ capabilities │   │
│  │ (themes) │  │ (Button, │  │ (Hero,   │  │ (Lead Cap.,  │   │
│  │          │  │  Input)  │  │ Features)│  │  Analytics)  │   │
│  └──────────┘  └──────────┘  └──────────┘  └───────┬──────┘   │
│                                                      │           │
│                                               ┌──────▼──────┐   │
│                                               │ integrations│   │
│                                               │ (HubSpot,   │   │
│                                               │  Analytics) │   │
│                                               └─────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│               SERVICES (Backend APIs)                           │
│  ┌─────────────────────────────────────┐                        │
│  │ api-gateway (Django/Python)         │                        │
│  │ - REST APIs                         │                        │
│  │ - Authentication                    │                        │
│  │ - Database access                   │                        │
│  └─────────────────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

## Major Components

### 1. Apps (Client Sites)
**Location**: `/apps/*`

Each app is a complete Next.js application representing a distinct client site:
- `web/` – Main production site
- `template-site/` – Starter template for new clients
- `your-dedicated-marketer/` – Second client site example

**Characteristics**:
- Uses Next.js 14+ App Router
- Composes pages from patterns + capabilities
- Applies client-specific theme tokens
- No forking of shared packages

### 2. Packages (Platform Foundation)
**Location**: `/packages/*`

Layered packages following strict import rules:

| Package | Purpose | May Import |
|---------|---------|------------|
| `tokens` | Design tokens (colors, spacing, typography) | Nothing |
| `ui` | Primitive components (Button, Input, Card) | tokens |
| `patterns` | Marketing sections (Hero, Features, Pricing) | tokens, ui, capabilities |
| `capabilities` | Business features (Lead Capture, Analytics) | tokens, ui, integrations |
| `integrations` | Third-party adapters (HubSpot, GA) | Nothing |
| `utils` | Shared utilities | Nothing |

**Key principle**: UI/patterns never import integrations directly. Only capabilities talk to external services.

### 3. Services (Backend)
**Location**: `/services/*`

- `api-gateway/` – Django-based REST API gateway
  - Provides backend APIs for apps
  - Handles authentication and authorization
  - Database access layer
  - Separate Python/Django codebase from Next.js apps

## Component Boundaries

### Hard Boundaries (Enforced)
1. **Tokens → UI → Patterns → Apps**: One-way dependency flow
2. **Integrations**: Only imported by capabilities, never by UI/patterns
3. **No forking**: Client sites must not copy/modify shared packages

### Soft Boundaries (By Convention)
1. Apps should prefer Server Components (RSC) by default
2. Third-party scripts centralized in capabilities
3. Styling via CSS variables (tokens), no hardcoded values

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | Next.js 14+ (App Router, React Server Components) |
| Language | TypeScript (primary) |
| Monorepo | pnpm workspaces + Turbo |
| Styling | CSS Variables (tokens) + Tailwind utility classes |
| Testing | Vitest (unit/integration), Playwright (e2e) |
| Backend | Django + Python (api-gateway service) |
| Deployment | Docker Compose (local), containerized services |

## Evidence

**Repository Structure**:
- Root: `/pnpm-workspace.yaml`, `/turbo.json`, `/package.json`
- Apps: `/apps/web/`, `/apps/template-site/`, `/apps/your-dedicated-marketer/`
- Packages: `/packages/tokens/`, `/packages/ui/`, `/packages/patterns/`, etc.
- Services: `/services/api-gateway/`

**Key Files**:
- Platform rules: `/docs/PLATFORM.md`
- Package manifests: `/packages/*/package.json`
- App entry points: `/apps/*/app/layout.tsx`, `/apps/*/app/page.tsx`
- Docker setup: `/docker-compose.yml`

**Build Configuration**:
- Turbo pipeline: `/turbo.json`
- TypeScript: `/tsconfig.base.json`
- Next.js configs: `/apps/*/next.config.js`

## Maintenance Rules

### When to Update This Document

Update this overview when:
1. **New component added** (new package, app, or service) → Update component diagrams
2. **Technology replaced** (e.g., switching from Vitest to Jest) → Update stack table
3. **Architecture principle changes** → Update component boundaries section
4. **New layer introduced** → Update architecture diagram and layering rules

### Evidence Standard

Every claim must link to:
- Actual directories (`/apps/`, `/packages/`)
- Configuration files (`turbo.json`, `package.json`)
- Documentation (`/docs/PLATFORM.md`)

Never document aspirational features. If it doesn't exist in the repo, it doesn't go in the docs.

### Doc Update Workflow

1. Make code change
2. Identify affected architecture docs
3. Update diagrams/tables/links in same PR
4. Verify all links resolve correctly
5. Add "Evidence" section pointing to new files

---

**Next**: [20_RUNTIME_TOPOLOGY.md](20_RUNTIME_TOPOLOGY.md) (What runs where, boot sequence, environments)
