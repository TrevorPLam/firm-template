# Firm Template

Next.js template for professional services.

## Installation

```bash
# Install dependencies
pnpm install
```

## Usage

```bash
# Run development server
pnpm dev

# Build all packages
pnpm build

# Run linter
pnpm lint

# Type check
pnpm type-check
```

## Project Structure

This repo is structured as a **platform for many marketing sites**. See [docs/PLATFORM.md](docs/PLATFORM.md) and [docs/CLIENT_SITES.md](docs/CLIENT_SITES.md).

- **apps/**
  - `web/` – Main Next.js app (template site; target: rename to `template-site`; new clients as `client-<name>`)
- **packages/**
  - `tokens/` – Design tokens and themes (single source of styling truth)
  - `ui/` – Primitives (Button, Input, Card, etc.)
  - `patterns/` – Composed sections (hero, pricing, testimonials; scaffolded)
  - `capabilities/` – Business features (lead capture, analytics; scaffolded)
  - `integrations/` – Provider adapters, OFF by default (scaffolded)
  - `utils/` – Shared utilities
  - `config/` – TypeScript configs
- **docs/** – Platform guidelines, definition of done, client model, integrations
- **services/api-gateway/** – API gateway service

## Refactor status

Per [REFACTOR.md](REFACTOR.md):

- **Done:** Scaffolding. **Phase 1 (tokens):** Token source, Tailwind → tokens, theme switcher. **Phase 2 (primitives):** Link, Typography, Stack, Grid; all primitives token-ified. **Phase 3 (patterns):** Hero, Features, Testimonials, Pricing, FAQ, Contact in `@repo/patterns`; homepage, pricing, contact pages use patterns.
- **Next:** Phase 4–5 (capabilities: lead capture, analytics). First client site as `apps/client-*` when ready.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

Proprietary - See [LICENSE](LICENSE) for details.
