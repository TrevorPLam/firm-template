# Firm Platform

A production-ready platform for building multiple marketing sites with shared foundations and client-specific theming.

## Overview

This repo implements a **baked-in client architecture** where adding a new client is primarily "new theme + content config + thin app wrapper". The platform provides reusable UI primitives, patterns, and capabilities while keeping client-specific work isolated.

## Installation

```bash
# Install dependencies
pnpm install
```

Use Node.js `20.x` (`.nvmrc` provided), then copy `.env.example` to `.env` and fill in values for local development (required for apps using Supabase/HubSpot; see [CONTRIBUTING.md](CONTRIBUTING.md)).

## Usage

```bash
# Run development server (all apps)
pnpm dev

# Run specific app
pnpm --filter @repo/web dev
pnpm --filter @repo/template-site dev

# Build all packages
pnpm build

# Run linter
pnpm lint

# Type check
pnpm type-check
```

## Project Structure

This repo is structured as a **platform for many marketing sites**. See [docs/PLATFORM.md](docs/PLATFORM.md) and [docs/archive/CLIENT_SITES.md](docs/archive/CLIENT_SITES.md).

- **apps/**
  - `web/` – Main Next.js app
  - `template-site/` – Template site for new client onboarding
  - `your-dedicated-marketer/` – Second client site (dedicated marketer theme)
- **packages/**
  - `tokens/` – Design tokens and themes (CSS variables, default + alt themes)
  - `ui/` – Primitives (Button, Input, Card, Typography, etc.)
  - `patterns/` – Composed sections (Hero, Features, Testimonials, Pricing, FAQ, Contact)
  - `capabilities/` – Business features (Lead Capture, Analytics with disabled-by-default integrations)
  - `integrations/` – Provider adapters (no-op by default, HubSpot/Analytics ready)
  - `utils/` – Shared utilities
  - `config/` – TypeScript configs
- **docs/** – Platform guidelines, definition of done, client model, integrations
- **services/api-gateway/** – API gateway service

## Platform Status

✅ **Refactoring Complete** - All phases implemented (see [docs/PLATFORM.md](docs/PLATFORM.md)):

- **Phase 1 (Tokens):** CSS variables with semantic naming, default + alt themes, Tailwind integration
- **Phase 2 (UI Primitives):** Complete component library using tokens only
- **Phase 3 (Patterns):** All marketing sections (Hero, Features, Testimonials, Pricing, FAQ, Contact)
- **Phase 4 (Capabilities):** Lead Capture and Analytics with integration adapters
- **Phase 5 (Integrations):** No-op adapters disabled by default, ready for HubSpot/Analytics

## Adding New Clients

1. Copy `apps/template-site` → `apps/client-<name>`
2. Add theme in `packages/tokens/themes/<client>/`
3. Configure content and integrations per client
4. Compose pages using patterns + capabilities

See [docs/archive/CLIENT_SITES.md](docs/archive/CLIENT_SITES.md) for complete guide.

## Governance

Agent governance policies and task lifecycle templates live under [`AGENTS/`](AGENTS/AGENTS.toon).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

Proprietary - See [LICENSE](LICENSE) for details.
