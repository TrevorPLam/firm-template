# Key Flows

This document describes the critical user journeys and data flows in the platform. Each flow includes trigger, steps, modules touched, failure modes, and validation tips.

## Flow 1: Page Load (Primary User Journey)

**Trigger**: User navigates to a marketing site page (e.g., `https://example.com/`)

**Steps**:
1. Browser sends HTTP request to Next.js app
2. Next.js Server Component renders page using patterns
3. Patterns compose UI primitives
4. Server returns HTML with inline CSS (tokens)
5. Browser hydrates React components
6. Analytics capability tracks page view (if enabled)

**Modules Touched**:
```
apps/web/app/page.tsx (entry)
  → @repo/patterns (Hero, Features, etc.)
    → @repo/ui (Button, Card, Typography)
      → @repo/tokens (CSS variables)
  → @repo/capabilities/analytics (page view tracking)
    → @repo/integrations (analytics adapter)
```

**Failure Modes**:
- **Missing tokens**: UI components fail to render with correct styles
  - Symptom: Unstyled components, missing colors
  - Solution: Verify `@repo/tokens` is built and imported correctly
- **Analytics error**: Analytics fails silently (no-op by default)
  - Symptom: No analytics events sent
  - Solution: Check analytics capability config and integration keys

**Validation**:
```bash
# Build and run locally
pnpm build
pnpm --filter @repo/web dev

# Visit http://localhost:3000
# Verify: page loads, styles applied, no console errors

# Check analytics (if enabled)
# Browser DevTools → Network → filter by analytics domain
```

**Evidence**:
- App entry: `/apps/web/app/page.tsx`, `/apps/web/app/layout.tsx`
- Patterns: `/packages/patterns/src/Hero.tsx`, `/packages/patterns/src/Features.tsx`
- Analytics: `/packages/capabilities/src/analytics.ts`

---

## Flow 2: Lead Capture (Form Submission)

**Trigger**: User fills out and submits a lead capture form (e.g., contact form, newsletter signup)

**Steps**:
1. User enters data in form (from `@repo/patterns/Contact`)
2. Client-side validation (React Hook Form)
3. Form submits to Next.js API route (`/app/api/leads/route.ts`)
4. API route calls `@repo/capabilities/lead-capture`
5. Lead capture capability calls integration adapter (HubSpot or Supabase)
6. Integration adapter sends data to external service
7. API returns success/error response
8. UI shows confirmation or error message

**Modules Touched**:
```
apps/web/app/api/leads/route.ts (API endpoint)
  → @repo/capabilities/lead-capture
    → @repo/integrations (HubSpot/Supabase adapter)
  → External API (HubSpot/Supabase)
```

**Client-side**:
```
@repo/patterns/Contact.tsx (form UI)
  → @repo/ui (Input, Button)
  → API fetch to /api/leads
```

**Failure Modes**:
- **Missing API keys**: Integration adapter fails
  - Symptom: 500 error, "Integration not configured"
  - Solution: Add required env vars (HUBSPOT_PRIVATE_APP_TOKEN, SUPABASE_URL, etc.)
- **Rate limiting**: Too many submissions
  - Symptom: 429 error, "Rate limit exceeded"
  - Solution: Check Upstash Redis config (UPSTASH_REDIS_REST_URL)
- **Validation errors**: Invalid email/phone format
  - Symptom: 400 error, validation message
  - Solution: User corrects input and resubmits

**Validation**:
```bash
# Ensure env vars are set
cat .env | grep HUBSPOT
cat .env | grep SUPABASE

# Start app
pnpm --filter @repo/web dev

# Test form submission
# 1. Fill out contact form at /contact
# 2. Submit form
# 3. Check API logs for success/error
# 4. Verify lead appears in HubSpot/Supabase
```

**Evidence**:
- API route: `/apps/web/app/api/leads/route.ts` (or similar)
- Lead capture: `/packages/capabilities/src/lead-capture.ts`
- Contact pattern: `/packages/patterns/src/Contact.tsx`
- Integrations: `/packages/integrations/src/index.ts`
- Env template: `/.env.example` (HUBSPOT_*, SUPABASE_*)

---

## Flow 3: Theme Switching (Client Site Customization)

**Trigger**: New client site needs unique branding/theme

**Steps**:
1. Create new theme token pack in `/packages/tokens/themes/<client>/`
2. Define color palette, typography, spacing overrides
3. Create new app in `/apps/<client-name>/`
4. Import client-specific theme in app layout
5. Compose pages using shared patterns (no forking)
6. Build and deploy app with theme applied

**Modules Touched**:
```
apps/<client-name>/app/layout.tsx
  → @repo/tokens/themes/<client>
  → @repo/patterns (reused, no changes)
    → @repo/ui (reused, no changes)
```

**Failure Modes**:
- **Theme not loaded**: App uses default theme instead of client theme
  - Symptom: Wrong colors/fonts applied
  - Solution: Verify theme import in layout.tsx, CSS variables applied
- **Forked components**: Client copied and modified shared packages
  - Symptom: Changes don't propagate to other sites
  - Solution: Move customization to theme tokens or app-level wrapper

**Validation**:
```bash
# Build client app
pnpm --filter @repo/<client-name> build

# Run locally
pnpm --filter @repo/<client-name> dev

# Verify:
# 1. Colors match client brand
# 2. Typography uses client fonts
# 3. No forked components in app code
```

**Evidence**:
- Theme tokens: `/packages/tokens/themes/` (default, alt, etc.)
- Client sites: `/apps/template-site/`, `/apps/your-dedicated-marketer/`
- Client site guide: `/docs/archive/CLIENT_SITES.md`

---

## Flow 4: Analytics Event Tracking

**Trigger**: User interacts with tracked elements (button clicks, page views, form submissions)

**Steps**:
1. Component triggers analytics event (e.g., `trackEvent('button_click')`)
2. Analytics capability checks if analytics enabled (config)
3. If enabled, calls integration adapter (Google Analytics, Segment, etc.)
4. Adapter sends event to external analytics service
5. Event logged in analytics dashboard

**Modules Touched**:
```
apps/web/components/* or @repo/patterns/*
  → @repo/capabilities/analytics (useAnalytics hook)
    → @repo/integrations (GA/Segment adapter)
  → External API (Google Analytics/Segment)
```

**Failure Modes**:
- **Analytics disabled**: No events sent (expected behavior)
  - Symptom: No analytics data
  - Solution: Enable analytics in `.env` (NEXT_PUBLIC_ANALYTICS_ID)
- **Ad blockers**: Analytics requests blocked by browser
  - Symptom: Events not reaching analytics service
  - Solution: User-level issue, no fix needed (respect privacy)
- **Integration error**: Invalid tracking ID
  - Symptom: Console warnings, no data in dashboard
  - Solution: Verify tracking ID in `.env`

**Validation**:
```bash
# Enable analytics
echo "NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX" >> .env

# Start app
pnpm --filter @repo/web dev

# Test tracking
# 1. Open browser DevTools → Network
# 2. Perform tracked action (click button, submit form)
# 3. Verify analytics request sent (filter by analytics domain)
# 4. Check analytics dashboard for event
```

**Evidence**:
- Analytics capability: `/packages/capabilities/src/analytics.ts`
- Integration adapters: `/packages/integrations/src/index.ts`
- Env template: `/.env.example` (NEXT_PUBLIC_ANALYTICS_ID)

---

## Flow 5: API Gateway Request (Backend Data Access)

**Trigger**: App needs data from backend (e.g., user profile, content)

**Steps**:
1. Next.js app sends HTTP request to API gateway (`http://localhost:8000/api/...`)
2. API gateway receives request (Django)
3. Authentication/authorization checks (if required)
4. Business logic in Django views/viewsets
5. Database query via Django ORM
6. JSON response sent back to app
7. App renders data in UI

**Modules Touched**:
```
apps/web/lib/api-client.ts (fetch wrapper)
  → services/api-gateway/backend/api/ (Django views)
    → Database (PostgreSQL)
  ← JSON response
```

**Failure Modes**:
- **API gateway not running**: Connection refused
  - Symptom: `ECONNREFUSED` error in app logs
  - Solution: Start API gateway (`docker-compose up api-gateway`)
- **Authentication failure**: Missing/invalid token
  - Symptom: 401 Unauthorized
  - Solution: Verify auth token in request headers
- **Database connection error**: API gateway can't connect to DB
  - Symptom: 500 error, "Database unavailable"
  - Solution: Check DATABASE_URL in `.env`, ensure DB is running

**Validation**:
```bash
# Start API gateway
docker-compose up api-gateway

# Or manually (if not using Docker)
cd services/api-gateway/backend
python manage.py runserver 0.0.0.0:8000

# Test API directly
curl http://localhost:8000/api/<endpoint>

# Start app and test integration
pnpm --filter @repo/web dev
# Verify app can fetch data from API
```

**Evidence**:
- API gateway: `/services/api-gateway/backend/`
- Docker compose: `/docker-compose.yml` (api-gateway service)
- API docs: `/docs/api/` (endpoints, authentication, etc.)

---

## Flow 6: Build and Deployment

**Trigger**: Code changes pushed to repository, triggering CI/CD pipeline

**Steps**:
1. CI pipeline starts (GitHub Actions or similar)
2. Install dependencies (`pnpm install`)
3. Type check all packages (`pnpm type-check`)
4. Lint all packages (`pnpm lint`)
5. Run tests (`pnpm test`)
6. Build all packages (`pnpm build`)
7. Build Docker images (if configured)
8. Deploy to staging/production environment
9. Health checks verify deployment success

**Modules Touched**:
```
CI Pipeline
  → pnpm install (all workspaces)
  → turbo run type-check (all packages)
  → turbo run lint (all packages)
  → turbo run test (all packages)
  → turbo run build (all packages)
  → Docker build (apps, services)
  → Deploy
```

**Failure Modes**:
- **Type errors**: TypeScript compilation fails
  - Symptom: `tsc` errors in CI logs
  - Solution: Fix type errors, run `pnpm type-check` locally
- **Lint errors**: Code style violations
  - Symptom: ESLint/Prettier errors
  - Solution: Fix lint errors, run `pnpm lint` locally
- **Test failures**: Unit/integration tests fail
  - Symptom: Test errors in CI logs
  - Solution: Fix failing tests, run `pnpm test` locally
- **Build failures**: Build step fails (missing dependencies, config errors)
  - Symptom: Build errors in CI logs
  - Solution: Check build logs, verify dependencies and configs

**Validation**:
```bash
# Simulate CI pipeline locally
pnpm install
pnpm type-check
pnpm lint
pnpm test
pnpm build

# All commands should exit with code 0 (success)
```

**Evidence**:
- CI config: `/.github/workflows/` (if exists)
- Build pipeline: `/turbo.json`
- Package scripts: `/package.json`, `/packages/*/package.json`
- Docker config: `/docker-compose.yml`

---

## Common Validation Commands

### Pre-Deployment Checklist
```bash
# 1. Install dependencies
pnpm install

# 2. Type check
pnpm type-check

# 3. Lint
pnpm lint

# 4. Run tests
pnpm test

# 5. Build
pnpm build

# 6. Start locally and smoke test
pnpm dev
# Visit http://localhost:3000
# Test critical flows (page load, form submission)

# 7. Check for security vulnerabilities
pnpm audit
```

### Post-Deployment Verification
```bash
# Check health endpoints
curl https://example.com/
curl https://api.example.com/health

# Check analytics events (in browser DevTools)
# Check lead submissions (in HubSpot/Supabase)
# Check logs for errors
```

**Evidence**: Root `/package.json` (scripts), `/turbo.json` (pipeline)

---

**Next**: [90_GLOSSARY.md](90_GLOSSARY.md) (Terms and acronyms)
