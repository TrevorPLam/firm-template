# Modules and Dependencies

## Module Map by Folder

This platform is a **pnpm monorepo** with workspaces. All packages follow strict layering rules.

### Directory Structure

```
firm-template/
├── apps/                    # Client site applications
│   ├── web/                 # Main production site (@repo/web)
│   ├── template-site/       # Starter template (@repo/template-site)
│   └── your-dedicated-marketer/  # Client 2 example (@repo/your-dedicated-marketer)
├── packages/                # Shared platform packages
│   ├── tokens/              # Design tokens (@repo/tokens)
│   ├── ui/                  # UI primitives (@repo/ui)
│   ├── patterns/            # Marketing sections (@repo/patterns)
│   ├── capabilities/        # Business features (@repo/capabilities)
│   ├── integrations/        # Third-party adapters (@repo/integrations)
│   ├── utils/               # Shared utilities (@repo/utils)
│   ├── wasm/                # WebAssembly modules (@repo/wasm)
│   └── config/              # Shared configs (@repo/config)
├── services/                # Backend services
│   └── api-gateway/         # Django REST API
├── docs/                    # Documentation
├── scripts/                 # Build/automation scripts
└── tests/                   # End-to-end tests
```

## Package Details

### Apps (Client Sites)

Each app is a **Next.js 14+** application with App Router.

| Package | Path | Purpose | Dependencies |
|---------|------|---------|--------------|
| `@repo/web` | `/apps/web` | Main production marketing site | tokens, ui, patterns, capabilities, utils |
| `@repo/template-site` | `/apps/template-site` | Starter template for new clients | tokens, ui, patterns, capabilities, utils |
| `@repo/your-dedicated-marketer` | `/apps/your-dedicated-marketer` | Second client site | tokens, ui, patterns, capabilities, utils |

**Characteristics**:
- Each app has own `package.json`, `next.config.js`, `tsconfig.json`
- Pages in `/app` directory (App Router)
- Components in `/components` directory
- App-specific content/config (not shared)

**Evidence**:
- App manifests: `/apps/*/package.json`
- App router: `/apps/*/app/`
- Next.js configs: `/apps/*/next.config.js`

### Packages (Platform Foundation)

Platform packages follow **strict layering** (see [Dependency Rules](#dependency-rules)).

#### 1. `@repo/tokens` (Layer 0)
**Path**: `/packages/tokens`  
**Purpose**: Design tokens (colors, spacing, typography, themes)  
**May Import**: Nothing  
**Exported**: CSS variables, theme objects, Tailwind config helpers

```ts
// Example usage
import { colors, spacing } from '@repo/tokens';
```

**Evidence**: `/packages/tokens/package.json`, `/packages/tokens/src/`

#### 2. `@repo/ui` (Layer 1)
**Path**: `/packages/ui`  
**Purpose**: Primitive UI components (Button, Input, Card, Typography)  
**May Import**: `tokens`  
**Exported**: React components (accessible, token-styled)

```ts
// Example usage
import { Button, Card } from '@repo/ui';
```

**Evidence**: `/packages/ui/package.json`, `/packages/ui/src/`

#### 3. `@repo/patterns` (Layer 2)
**Path**: `/packages/patterns`  
**Purpose**: Composed marketing sections (Hero, Features, Testimonials, Pricing, FAQ, Contact)  
**May Import**: `tokens`, `ui`, `capabilities`  
**Exported**: Marketing section components

```ts
// Example usage
import { Hero, Features, Pricing } from '@repo/patterns';
```

**Evidence**: `/packages/patterns/package.json`, `/packages/patterns/src/`

**Key Files**:
- Hero: `/packages/patterns/src/Hero.tsx`
- Features: `/packages/patterns/src/Features.tsx`
- Testimonials: `/packages/patterns/src/Testimonials.tsx`
- Pricing: `/packages/patterns/src/Pricing.tsx`
- FAQ: `/packages/patterns/src/FAQ.tsx`
- Contact: `/packages/patterns/src/Contact.tsx`

#### 4. `@repo/capabilities` (Layer 2)
**Path**: `/packages/capabilities`  
**Purpose**: Business features (Lead Capture, Analytics, AI, CMS, PWA, WASM)  
**May Import**: `tokens`, `ui`, `integrations`  
**Exported**: Feature modules and hooks

```ts
// Example usage
import { LeadCapture, useAnalytics } from '@repo/capabilities';
```

**Evidence**: `/packages/capabilities/package.json`, `/packages/capabilities/src/`

**Key Capabilities**:
- Lead Capture: `/packages/capabilities/src/lead-capture.ts`
- Analytics: `/packages/capabilities/src/analytics.ts`
- AI: `/packages/capabilities/src/ai/`
- CMS: `/packages/capabilities/src/cms/`
- PWA: `/packages/capabilities/src/pwa/`
- WASM: `/packages/capabilities/src/wasm/`
- Blockchain: `/packages/capabilities/src/blockchain/`
- Realtime: `/packages/capabilities/src/realtime/`
- Voice: `/packages/capabilities/src/voice/`
- Performance: `/packages/capabilities/src/performance/`
- Images: `/packages/capabilities/src/images/`
- Client Success: `/packages/capabilities/src/client-success/`
- Financial: `/packages/capabilities/src/financial/`

#### 5. `@repo/integrations` (Isolated)
**Path**: `/packages/integrations`  
**Purpose**: Third-party provider adapters (HubSpot, Analytics, etc.)  
**May Import**: Nothing (isolated)  
**Exported**: Integration adapters (no-op by default)

```ts
// Example usage (via capabilities only)
import { hubspotAdapter } from '@repo/integrations';
```

**Evidence**: `/packages/integrations/package.json`, `/packages/integrations/src/`

**Critical Rule**: Integrations should ONLY be imported by `capabilities`, never by `ui`, `patterns`, or apps directly.

#### 6. `@repo/utils` (Isolated)
**Path**: `/packages/utils`  
**Purpose**: Shared utility functions  
**May Import**: Nothing (isolated)  
**Exported**: Helper functions, types

```ts
// Example usage
import { formatDate, debounce } from '@repo/utils';
```

**Evidence**: `/packages/utils/package.json`, `/packages/utils/src/`

#### 7. `@repo/wasm` (Isolated)
**Path**: `/packages/wasm`  
**Purpose**: WebAssembly modules and loaders  
**May Import**: Nothing (isolated)  
**Exported**: WASM modules, loaders

**Evidence**: `/packages/wasm/package.json`, `/packages/wasm/src/`

#### 8. `@repo/config` (Isolated)
**Path**: `/packages/config`  
**Purpose**: Shared TypeScript, Prettier, ESLint configs  
**May Import**: Nothing (isolated)  
**Exported**: Config files

**Evidence**: `/packages/config/package.json`

### Services

#### `api-gateway`
**Path**: `/services/api-gateway`  
**Technology**: Django (Python)  
**Purpose**: Backend REST APIs, authentication, database access  
**Not a JS package**: Separate Python ecosystem

**Evidence**: `/services/api-gateway/backend/`, `/docker-compose.yml`

## Dependency Rules

### Hard Rules (Enforced via TypeScript)

**Layering Flow**:
```
tokens → ui → patterns → apps
                ↓
           capabilities
                ↓
          integrations
```

| Package | May Import |
|---------|------------|
| `tokens` | Nothing |
| `ui` | `tokens` |
| `patterns` | `tokens`, `ui`, `capabilities` |
| `capabilities` | `tokens`, `ui`, `integrations` |
| `integrations` | Nothing (isolated) |
| `utils` | Nothing (isolated) |
| `wasm` | Nothing (isolated) |
| `apps` | All packages |

**❌ Forbidden Imports**:
- `ui` must NOT import `patterns`, `capabilities`, or `integrations`
- `patterns` must NOT import `integrations` (only via `capabilities`)
- `integrations` must NOT import anything (adapter pattern)
- Apps must NOT import `integrations` directly (only via `capabilities`)

### Soft Rules (Conventions)

1. **Server Components First**: Next.js apps default to Server Components (RSC)
2. **Client Boundary**: Use `"use client"` directive only when needed (interactivity)
3. **No Hardcoded Styles**: All styling via tokens (CSS variables)
4. **No Forking**: Client sites must not copy/modify shared packages

### Circular Dependency Prevention

**Rule**: Do NOT create cycles. Turbo will fail to build if cycles exist.

**Example violations**:
- `ui` imports `patterns`, `patterns` imports `ui` ❌
- `capabilities` imports `apps`, `apps` imports `capabilities` ❌

**Validation**:
```bash
# Turbo checks for cycles during build
pnpm build
# If cycles exist, build will fail with error
```

**Evidence**: `/turbo.json` (pipeline with `dependsOn: ["^build"]`)

## Monorepo Tooling

### pnpm Workspaces
**Config**: `/pnpm-workspace.yaml`

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**Workspace protocol**: Packages reference each other via `workspace:*` in `package.json`:

```json
{
  "dependencies": {
    "@repo/tokens": "workspace:*",
    "@repo/ui": "workspace:*"
  }
}
```

**Evidence**: `/pnpm-workspace.yaml`, `/packages/*/package.json` (workspace refs)

### Turbo (Build Orchestration)
**Config**: `/turbo.json`

**Pipeline tasks**:
- `build`: Builds packages in dependency order (`dependsOn: ["^build"]`)
- `dev`: Starts dev servers (no cache, persistent)
- `lint`: Lints packages
- `type-check`: Runs TypeScript compiler
- `test`: Runs tests (depends on build)

**Caching**: Turbo caches build outputs for faster rebuilds.

**Evidence**: `/turbo.json`, root `/package.json` (Turbo scripts)

### TypeScript Configuration
**Base Config**: `/tsconfig.base.json`  
**Extends**: Each package has own `tsconfig.json` that extends base

**Path Mapping**:
```json
{
  "compilerOptions": {
    "paths": {
      "@repo/*": ["./packages/*/src"]
    }
  }
}
```

**Evidence**: `/tsconfig.base.json`, `/packages/*/tsconfig.json`, `/apps/*/tsconfig.json`

## Testing Strategy

### Unit/Integration Tests
- **Framework**: Vitest
- **Location**: Each package has own tests
- **Run**: `pnpm test` (runs all), `pnpm --filter @repo/ui test` (specific package)

### E2E Tests
- **Framework**: Playwright
- **Location**: `/tests/`
- **Config**: `/playwright.config.ts`
- **Run**: `pnpm test:e2e` (if configured)

**Evidence**: `/playwright.config.ts`, `/tests/`, `/packages/*/vitest.config.ts` (if exists)

## Adding New Packages

### Checklist
1. Create directory: `/packages/<name>/`
2. Add `package.json` with `"name": "@repo/<name>"`
3. Add to `pnpm-workspace.yaml` (already includes `packages/*`)
4. Set up `tsconfig.json` extending base
5. Add `src/index.ts` with exports
6. Verify layering rules: only import allowed dependencies
7. Add to Turbo pipeline if needed
8. Run `pnpm install` to link workspace

### Example: Adding New Package
```bash
mkdir -p packages/my-package/src
cd packages/my-package

# Create package.json
cat > package.json <<EOF
{
  "name": "@repo/my-package",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "dependencies": {
    "@repo/tokens": "workspace:*"
  }
}
EOF

# Create index
echo "export const myFunction = () => 'hello';" > src/index.ts

# Install
cd ../..
pnpm install
```

**Evidence**: Existing package structure in `/packages/*/`

## Do Not Create Cycles

**Violation Detection**: Turbo will fail at build time if cycles exist.

**If build fails**:
1. Check `turbo.json` pipeline dependencies
2. Review `package.json` dependencies in each package
3. Remove circular imports
4. Rebuild: `pnpm build`

**Evidence**: `/turbo.json` (`dependsOn` chain enforces acyclic graph)

---

**Next**: [40_KEY_FLOWS.md](40_KEY_FLOWS.md) (Critical user journeys and data flows)
