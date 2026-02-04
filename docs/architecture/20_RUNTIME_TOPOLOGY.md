# Runtime Topology

## What Runs Where

This platform consists of **frontend apps** (Next.js) and a **backend service** (Django API gateway).

### Runtime Components

```
┌──────────────────────────────────────────────────────────┐
│                    Production                            │
│  ┌────────────────┐  ┌────────────────┐                 │
│  │ Next.js Apps   │  │ API Gateway    │                 │
│  │ (Node.js)      │  │ (Django/Python)│                 │
│  │ Port: 3000+    │  │ Port: 8000     │                 │
│  └────────────────┘  └────────────────┘                 │
│         │                     │                          │
│         └─────────┬───────────┘                          │
│                   ▼                                      │
│          ┌─────────────────┐                            │
│          │ Database (Ext.) │                            │
│          │ (PostgreSQL)    │                            │
│          └─────────────────┘                            │
└──────────────────────────────────────────────────────────┘
```

| Component | Runtime | Port(s) | Purpose |
|-----------|---------|---------|---------|
| Next.js Apps | Node.js | 3000 (web), 3001+ (other apps) | Marketing sites (SSR + static) |
| API Gateway | Python/Django | 8000 | Backend REST APIs, auth, DB access |
| Database | PostgreSQL | 5432 (external) | Data persistence |

## Environments

### Local Development

**Requirements**:
- Node.js 18+
- pnpm 8.15+
- Python 3.11+ (for api-gateway)
- Docker + Docker Compose (optional, for containerized dev)

**Setup**:
```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env
# Edit .env with local values (Supabase, HubSpot, etc.)

# Start all apps (dev mode)
pnpm dev

# Or start specific app
pnpm --filter @repo/web dev
pnpm --filter @repo/template-site dev
```

**With Docker Compose**:
```bash
docker-compose up
# Runs: web (3000), api-gateway (8000)
```

**Environment Variables**:
- Source: `.env` (never committed, copied from `.env.example`)
- Public vars: `NEXT_PUBLIC_*` (exposed to browser)
- Private vars: API keys, database URLs (server-only)
- Required for full functionality: Supabase, HubSpot tokens (see `.env.example`)

**Evidence**:
- Docker config: `/docker-compose.yml`
- Env template: `/.env.example`
- Root package.json: `/package.json` (scripts: `dev`, `build`, `lint`)

### Production/Staging

**Deployment Method**: Containerized via Docker

Each app/service has:
- `Dockerfile` (if exists) or buildpack-based deployment
- Environment-specific `.env` files (not in repo, managed externally)
- CI/CD pipelines (see `/docs/ci/`)

**Production Considerations**:
1. **SSR + Static**: Next.js apps can deploy as static export OR SSR (with Node.js runtime)
2. **API Gateway**: Django service requires Python runtime + PostgreSQL connection
3. **Environment vars**: Managed via deployment platform (Vercel, AWS, etc.)
4. **Secrets**: Never in code; use environment variables or secret managers

**Evidence**:
- Docker files: `/apps/web/Dockerfile` (if exists), `/services/api-gateway/backend/Dockerfile` (if exists)
- CI config: `/.github/workflows/*`
- Deployment docs: `/docs/deployment/`

## Boot Sequence

### Next.js Apps

1. **Build time**:
   - TypeScript compilation
   - Next.js page generation (SSG/ISR)
   - CSS bundling (tokens → Tailwind)
   - Package dependencies resolved via Turbo

2. **Runtime (server start)**:
   - Load environment variables (`.env`)
   - Initialize Next.js server
   - Register API routes (`/app/api/*`)
   - SSR on-demand for dynamic pages

3. **Client hydration**:
   - Load React bundles
   - Hydrate server-rendered HTML
   - Initialize client-side JS (analytics, PWA, etc.)

**Entry Points**:
- Root layout: `/apps/*/app/layout.tsx`
- Home page: `/apps/*/app/page.tsx`
- API routes: `/apps/*/app/api/*/route.ts`
- Middleware: `/apps/*/middleware.ts` (if exists)

**Evidence**:
- App router: `/apps/web/app/` (all pages/layouts)
- API routes: `/apps/web/app/api/`
- Next.js config: `/apps/web/next.config.js`

### API Gateway (Django)

1. **Startup**:
   - Load Django settings (`config.settings`)
   - Connect to database (PostgreSQL via `DATABASE_URL`)
   - Register API endpoints
   - Start WSGI/ASGI server (port 8000)

2. **Request handling**:
   - URL routing via Django URLconf
   - Authentication/authorization checks
   - Business logic in views/viewsets
   - Database queries via ORM
   - JSON response

**Entry Points**:
- Django management: `/services/api-gateway/backend/manage.py` (if exists)
- Settings: `/services/api-gateway/backend/config/settings.py` (if exists)
- API modules: `/services/api-gateway/backend/api/` (if exists)
- URL routing: `/services/api-gateway/backend/api/urls.py` (if exists)

**Evidence**:
- Backend structure: `/services/api-gateway/backend/`
- Requirements: `/services/api-gateway/backend/requirements*.txt` (if exists)
- Docker compose: `/docker-compose.yml` (api-gateway service)

## Process Management

### Development
- **Next.js**: Automatic reload via `next dev` (HMR)
- **API Gateway**: Django dev server with auto-reload
- **Turbo**: Orchestrates parallel builds/dev servers

### Production
- **Next.js**: Process manager (PM2, systemd, or platform-managed)
- **API Gateway**: WSGI server (Gunicorn) + reverse proxy (Nginx)
- **Container orchestration**: Docker Compose or Kubernetes

## Networking

### Port Assignments

| Service | Development Port | Production Port |
|---------|------------------|-----------------|
| web (main) | 3000 | 80/443 (via proxy) |
| template-site | 3001 | 80/443 (via proxy) |
| your-dedicated-marketer | 3002 | 80/443 (via proxy) |
| api-gateway | 8000 | 8000 (internal) or 80/443 (via proxy) |

### Inter-Service Communication

- **Apps → API Gateway**: HTTP REST calls (port 8000 in dev, routed in prod)
- **Apps → External APIs**: Direct HTTPS (HubSpot, Supabase, analytics)
- **API Gateway → Database**: PostgreSQL protocol (port 5432)

**Evidence**:
- Docker compose networking: `/docker-compose.yml` (ports, depends_on)
- API client config: `/apps/*/lib/api-client.ts` (if exists)

## Health Checks and Monitoring

### Availability Checks
- Next.js: `GET /` (200 OK)
- API Gateway: `GET /health` or root endpoint (Django default)

### Monitoring Integration
- See `/docs/monitoring/` for detailed monitoring setup
- Analytics capabilities: `/packages/capabilities/src/analytics.ts`

## Failure Modes

### Common Issues

1. **Missing environment variables**:
   - Symptom: App fails to start, "Missing required env var" error
   - Solution: Verify `.env` file exists and contains required values
   - Evidence: `/.env.example` (list of required vars)

2. **Port conflicts**:
   - Symptom: `EADDRINUSE` error (port already in use)
   - Solution: Stop other processes on ports 3000, 8000, etc.
   - Evidence: `/docker-compose.yml` (port mappings)

3. **Database connection failure**:
   - Symptom: API Gateway can't connect to DB
   - Solution: Check `DATABASE_URL` in `.env`, ensure DB is running
   - Evidence: `/.env.example` (DATABASE_URL configuration)

4. **Build failures**:
   - Symptom: `pnpm build` fails with TypeScript or dependency errors
   - Solution: Run `pnpm install`, check `/turbo.json` pipeline config
   - Evidence: `/turbo.json`, `/tsconfig.base.json`

## Validation Tips

### Verify Local Setup
```bash
# Check all services are running
docker-compose ps

# Check Next.js app
curl http://localhost:3000

# Check API Gateway
curl http://localhost:8000

# Run full build
pnpm build

# Type check
pnpm type-check

# Lint
pnpm lint
```

### Verify Production Deployment
- Check health endpoints return 200
- Verify environment variables are set correctly
- Check logs for startup errors
- Test critical flows (see [40_KEY_FLOWS.md](40_KEY_FLOWS.md))

**Evidence**:
- Build scripts: `/package.json`, `/turbo.json`
- Health check endpoints: `/apps/*/app/api/health/*` (if exists)

---

**Next**: [30_MODULES_AND_DEPENDENCIES.md](30_MODULES_AND_DEPENDENCIES.md) (Package structure and import rules)
