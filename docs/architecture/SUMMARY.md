# Architecture Documentation Summary

## Documentation Tree

```
docs/
├── architecture/                    # ← START HERE
│   ├── 00_INDEX.md                 # Navigation front door
│   ├── 10_OVERVIEW.md              # What the platform does, high-level components
│   ├── 20_RUNTIME_TOPOLOGY.md      # What runs where, boot sequence, environments
│   ├── 30_MODULES_AND_DEPENDENCIES.md  # Module map, import rules
│   ├── 40_KEY_FLOWS.md             # Critical user journeys (6 flows)
│   └── 90_GLOSSARY.md              # Terms, acronyms, conventions
├── data/
│   └── 00_INDEX.md                 # Storage, schema, migrations, invariants
├── api/
│   ├── 00_INDEX.md                 # API organization, auth, errors, versioning
│   └── README.md                   # Detailed API reference (pre-existing)
├── integrations/
│   ├── 00_INDEX.md                 # Third-party providers, secrets handling
│   └── ai-api.md                   # AI integration guide (pre-existing)
└── adr/
    └── README.md                   # ADR template (updated with arch link)
```

## Key Architecture Insights

### 1. Multi-Tenant Marketing Platform
- **Purpose**: Create multiple branded marketing sites from shared components
- **Model**: "Baked-in client architecture" - clients are apps, not forks
- **Tech Stack**: Next.js 14 (App Router), TypeScript, pnpm monorepo, Turbo

### 2. Strict Layering (No Cycles)
```
tokens → ui → patterns → apps
              ↓
         capabilities
              ↓
         integrations (isolated)
```
**Hard Rule**: UI/patterns never import integrations directly. Only capabilities talk to external services.

### 3. Theme System
- Design tokens enable client-specific branding without forking components
- CSS variables as single source of truth
- No hardcoded colors, spacing, or fonts in components

### 4. Integration Philosophy
- **No-op by default**: All integrations disabled unless explicitly configured
- **Adapter pattern**: Integration code isolated in `/packages/integrations`
- **Config-driven**: Enable via environment variables (`.env`)

### 5. Runtime Components
- **Frontend**: Next.js apps (Node.js, ports 3000+)
- **Backend**: Django API Gateway (Python, port 8000)
- **Database**: PostgreSQL (external), Supabase (optional), CMS (optional)

### 6. Key Flows Documented
1. **Page Load**: SSR → patterns → UI → tokens → hydration → analytics
2. **Lead Capture**: Form → API route → capability → integration → HubSpot/Supabase
3. **Theme Switching**: New app → client theme → shared patterns (no forking)
4. **Analytics Tracking**: Component → capability → integration → GA/Segment
5. **API Gateway Request**: App → Django API → database → JSON response
6. **Build/Deployment**: CI → install → lint → test → build → deploy

### 7. Module Organization (Monorepo)
- **Apps** (`/apps/*`): Client sites (web, template-site, your-dedicated-marketer)
- **Packages** (`/packages/*`): Platform foundation (tokens, ui, patterns, capabilities, integrations)
- **Services** (`/services/*`): Backend (api-gateway)
- **Docs** (`/docs/*`): Architecture, API, integrations, security
- **Turbo**: Orchestrates builds in dependency order, respects layer boundaries

### 8. Security Invariants
- No sensitive data in logs (redaction enforced)
- Multi-tenant scoping required on all data access
- No auth bypass in production
- HTTPS-only in production, JWT authentication

### 9. Data Storage Patterns
- **PostgreSQL** (API Gateway): Backend data, user accounts
- **Supabase**: Lead submissions, client-specific tables
- **CMS**: Marketing content (Sanity, Contentful)
- **Redis** (Upstash): Rate limiting, session caching

### 10. Testing Strategy
- **Unit/Integration**: Vitest (per-package)
- **E2E**: Playwright (platform-wide)
- **Type Safety**: TypeScript strict mode
- **Linting**: ESLint + Prettier

## Evidence-Based Documentation

Every claim in the architecture docs is traceable to:
- **Configuration files**: `package.json`, `turbo.json`, `tsconfig.json`, `.env.example`
- **Source code**: Package directories, app structures, component files
- **Existing docs**: `PLATFORM.md`, `SECURITY.md`, `CONTRIBUTING.md`

**No aspirational features documented** - only what exists in the repository today.

## Documentation Maintenance Rules

### When to Update Architecture Docs

| Change Type | Update This |
|-------------|-------------|
| New package added | `30_MODULES_AND_DEPENDENCIES.md`, `10_OVERVIEW.md` (diagram) |
| New app created | `10_OVERVIEW.md`, `20_RUNTIME_TOPOLOGY.md` (ports) |
| New service added | `10_OVERVIEW.md`, `20_RUNTIME_TOPOLOGY.md` |
| Technology replaced | `10_OVERVIEW.md` (stack table) |
| New critical flow | `40_KEY_FLOWS.md` (add flow) |
| New integration | `docs/integrations/00_INDEX.md` |
| API endpoint added | `docs/api/00_INDEX.md`, `docs/api/endpoints.md` |
| Data model changed | `docs/data/00_INDEX.md` |
| New term/acronym | `90_GLOSSARY.md` |
| Major architectural decision | Create ADR in `docs/adr/` |

### Update Workflow

1. **Make code change**
2. **Identify affected docs** (use table above)
3. **Update docs in same PR** (code + docs together)
4. **Add "Evidence" section** pointing to new files
5. **Verify all links** resolve correctly
6. **Update "Last Updated" date** if present

### Evidence Standard (Mandatory)

Every doc section must include:
- **Links to directories**: `/apps/`, `/packages/tokens/`
- **Links to configs**: `/turbo.json`, `/.env.example`
- **Links to key files**: Entry points, manifests, schemas

**Never document without evidence**. If it doesn't exist in repo, it doesn't go in docs.

### Doc Update Commands

```bash
# Before updating docs, verify current state
ls -la apps/
ls -la packages/
cat package.json
cat turbo.json

# After updating docs, verify links
cd docs/architecture
# Check all .md links point to real files
grep -r "\.md" . | grep -v "Binary"

# Verify directory references
grep -r "/apps/" . | grep -v "Binary"
grep -r "/packages/" . | grep -v "Binary"
```

### Quality Checklist

Before committing doc changes:
- [ ] All internal links resolve (no 404s)
- [ ] All code references point to real files
- [ ] Diagrams match current architecture
- [ ] No aspirational/future features documented
- [ ] "Evidence" section present with file links
- [ ] Glossary updated with new terms
- [ ] Cross-references added where relevant

## Navigation Guide

### For New Developers (First Time)
1. Read: [architecture/00_INDEX.md](00_INDEX.md) (this file)
2. Read: [architecture/10_OVERVIEW.md](10_OVERVIEW.md) (what is this?)
3. Read: [architecture/20_RUNTIME_TOPOLOGY.md](20_RUNTIME_TOPOLOGY.md) (how to run it?)
4. Read: [architecture/30_MODULES_AND_DEPENDENCIES.md](30_MODULES_AND_DEPENDENCIES.md) (how is it organized?)
5. Skim: [architecture/40_KEY_FLOWS.md](40_KEY_FLOWS.md) (what are the critical paths?)
6. Reference: [architecture/90_GLOSSARY.md](90_GLOSSARY.md) (lookup terms as needed)

### For Feature Development
- **UI changes**: [30_MODULES_AND_DEPENDENCIES.md](30_MODULES_AND_DEPENDENCIES.md) (layering rules)
- **New integration**: [integrations/00_INDEX.md](../integrations/00_INDEX.md) (adapter pattern)
- **API work**: [api/00_INDEX.md](../api/00_INDEX.md) (endpoints, auth)
- **Data changes**: [data/00_INDEX.md](../data/00_INDEX.md) (schema, migrations)

### For Operations/Deployment
- **Environment setup**: [20_RUNTIME_TOPOLOGY.md](20_RUNTIME_TOPOLOGY.md) (ports, env vars)
- **Build process**: [40_KEY_FLOWS.md](40_KEY_FLOWS.md#flow-6-build-and-deployment) (CI/CD)
- **Health checks**: [20_RUNTIME_TOPOLOGY.md](20_RUNTIME_TOPOLOGY.md#health-checks-and-monitoring) (monitoring)

### For Architecture Decisions
- **Platform principles**: [../../docs/PLATFORM.md](../../docs/PLATFORM.md)
- **Security guidelines**: [../../docs/SECURITY.md](../../docs/SECURITY.md)
- **ADR template**: [adr/README.md](../adr/README.md) (document decisions)

## Related Documentation

- **Platform Principles**: [/docs/PLATFORM.md](/docs/PLATFORM.md)
- **Security**: [/docs/SECURITY.md](/docs/SECURITY.md)
- **Contributing**: [/CONTRIBUTING.md](/CONTRIBUTING.md)
- **README**: [/README.md](/README.md)
- **Changelog**: [/CHANGELOG.md](/CHANGELOG.md)

## Statistics

- **Total architecture docs**: 6 core files + 3 deep-dive indexes + 1 ADR update
- **Total lines**: ~2200 lines of documentation
- **Coverage**: Platform overview, runtime, modules, flows, glossary, data, API, integrations, ADRs
- **Evidence links**: 100+ references to actual files/directories
- **Diagrams**: 4 ASCII diagrams (architecture, runtime, module layers, flows)

---

**Created**: 2026-02-04  
**Repository**: firm-template  
**Purpose**: Enable smart beginners to navigate, modify, and extend the platform safely

**Entry Point**: [architecture/00_INDEX.md](00_INDEX.md)
