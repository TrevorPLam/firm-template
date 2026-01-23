# Analysis: Incorrect Information in agentic.json

**Date:** 2026-01-23  
**Purpose:** Identify all incorrect information in `agentic.json` that doesn't match firm-template's actual structure

## Summary

The `agentic.json` file contains extensive references to a Django + React (UBOS) repository structure, but firm-template is actually a **Next.js 15.5.2** application. This document catalogs all incorrect information.

---

## Critical Issues

### 1. BESTPR.md Content (Lines 212-229)

**Location:** `agentic.json` → `categories.policy_governance.files[1].content`

**Issues:**
- ❌ References "UBOS" instead of "firm-template"
- ❌ Describes Django 4.2 + Python 3.11 + PostgreSQL backend
- ❌ References `backend/modules/`, `backend/api/`, `backend/config/` structure
- ❌ References `frontend/src/` with Vite 5.4
- ❌ References TanStack React Query 5.90 (not used in Next.js)
- ❌ References React Router DOM 6.30 (Next.js uses App Router)
- ❌ References `make lint`, `make typecheck`, `make test` commands
- ❌ References `make -C backend openapi` for OpenAPI schema
- ❌ References Django REST Framework viewsets and FirmScopedMixin
- ❌ References pytest for backend testing
- ❌ References ruff, black, mypy for Python formatting

**Should be:**
- ✅ Next.js 15.5.2 with App Router
- ✅ TypeScript 5.7.2
- ✅ React 19.2.3
- ✅ Tailwind CSS 3.4.17
- ✅ React Hook Form + Zod validation
- ✅ `npm run lint`, `npm run type-check`, `npm run test`
- ✅ Vitest for unit tests, Playwright for e2e
- ✅ ESLint + Prettier for formatting

---

### 2. Agent Context Files - Backend References

**Location:** Multiple `.agent-context.json` files in `agentic.json`

**Files with issues:**
- `backend/.agent-context.json` (line ~1400)
- `backend/modules/core/.agent-context.json` (line ~1450)
- `backend/modules/firm/.agent-context.json` (line ~1459)
- `backend/modules/clients/.agent-context.json` (line ~1468)
- `backend/modules/crm/.agent-context.json` (line ~1477)
- `backend/modules/finance/.agent-context.json` (line ~1486)
- `backend/modules/projects/.agent-context.json` (line ~1495)
- `backend/api/clients/.agent-context.json`

**Issues:**
- ❌ All reference Django patterns (models.Model, viewsets.ModelViewSet)
- ❌ All reference FirmScopedMixin (Django-specific)
- ❌ All reference `python manage.py makemigrations`
- ❌ All reference backend/modules structure that doesn't exist in firm-template
- ❌ Reference Django serializers, viewsets, migrations
- ❌ Reference firm-scoped multi-tenancy (Django concept)

**Note:** firm-template does NOT have a Django backend. The `backend/` directory exists but is empty/placeholder. The actual application is a Next.js monorepo.

---

### 3. Agent Context Files - Frontend References

**Location:** 
- `frontend/.agent-context.json` (line ~1415)
- `frontend/src/components/.agent-context.json` (line ~1432)
- `frontend/src/api/.agent-context.json` (line ~1441)

**Issues:**
- ❌ References "React/TypeScript frontend application built with Vite"
- ❌ References `frontend/src/components/`, `frontend/src/pages/`, `frontend/src/api/`
- ❌ References TanStack React Query for API data fetching
- ❌ References React Router (`App.tsx or router configuration`)
- ❌ References `frontend/e2e/` and `frontend/tests/` directories

**Should be:**
- ✅ Next.js App Router structure
- ✅ Main app code in root: `app/`, `components/`, `lib/`
- ✅ Next.js built-in routing (no React Router)
- ✅ Server Components by default, Client Components when needed
- ✅ Tests in `__tests__/` and `tests/e2e/`

---

### 4. Commands in rules.json Content

**Location:** `agentic.json` → `categories.agent_framework.files[0].content` → `commands` section

**Issues:**
- ❌ `"setup": "make setup"` - should be `"npm install"`
- ❌ `"lint": "make lint"` - should be `"npm run lint"`
- ❌ `"test": "make test"` - should be `"npm run test"`
- ❌ `"verify": "make verify"` - should use npm scripts
- ❌ `"backend.migrate": "make -C backend migrate"` - doesn't exist (no Django)
- ❌ `"backend.openapi": "make -C backend openapi"` - doesn't exist (no Django)
- ❌ `"frontend.test": "make -C frontend test"` - should be `"npm run test"`
- ❌ `"frontend.e2e": "make -C frontend e2e"` - should be `"npm run test:e2e"`

---

### 5. AGENTS.md Content

**Location:** `agentic.json` → `categories.agent_framework.files[1].content`

**Issues:**
- ❌ Line ~305: References "For Django modules, see `.repo/policy/BOUNDARIES.md` for UBOS-specific rules"
- ❌ References backend/frontend folder guides that don't exist

---

### 6. Makefile Content

**Location:** `agentic.json` → `categories.cicd_integration.files[0].content`

**Issues:**
- ❌ References `make -C backend setup`, `make -C frontend setup`
- ❌ References `make -C backend lint`, `make -C frontend lint`
- ❌ References `make -C backend test`, `make -C frontend test`
- ❌ References `make -C backend openapi`
- ❌ Assumes backend/ and frontend/ subdirectories with their own Makefiles

**Note:** The actual Makefile in firm-template has been updated to wrap npm scripts, but the content in agentic.json is outdated.

---

### 7. Example Task Packets

**Location:** `agentic.json` → `categories.templates_schemas.files[4-6].content`

**Issues:**
- ❌ `example_task_packet.json` (line ~683): References Django JWT authentication
- ❌ `example_task_packet_api_change.json` (line ~692): References Django ViewSet, Django transactions
- ❌ `example_task_packet_cross_module.json`: References `backend/modules/projects/models.py`, `backend/modules/finance/models.py`

**Should be:** Next.js API routes, Server Actions, or external API integration examples

---

### 8. Tech Stack References

**Location:** Throughout `agentic.json`

**Incorrect references:**
- ❌ Django 4.2 + Python 3.11 + PostgreSQL 15
- ❌ Vite 5.4 (Next.js uses its own bundler)
- ❌ React Router DOM 6.30 (Next.js uses App Router)
- ❌ TanStack React Query 5.90 (not used in this Next.js app)
- ❌ ReactFlow 11.10 (not in package.json)
- ❌ pytest (Python testing framework)
- ❌ ruff, black, mypy (Python tools)

**Correct stack:**
- ✅ Next.js 15.5.2
- ✅ TypeScript 5.7.2
- ✅ React 19.2.3
- ✅ Tailwind CSS 3.4.17
- ✅ React Hook Form 7.71.1 + Zod 4.3.5
- ✅ Vitest 4.0.17
- ✅ Playwright 1.49.0
- ✅ ESLint 9.39.2 + Prettier 3.8.0

---

### 9. Project Structure References

**Location:** Throughout `agentic.json`

**Incorrect structure references:**
- ❌ `backend/modules/` - doesn't exist in firm-template
- ❌ `backend/api/` - doesn't exist (Next.js uses `app/api/`)
- ❌ `backend/config/` - doesn't exist
- ❌ `frontend/src/` - doesn't exist (main code is in root)
- ❌ `frontend/src/pages/` - doesn't exist (Next.js uses `app/`)
- ❌ `frontend/src/components/` - should be `components/` (root level)
- ❌ `frontend/src/api/` - doesn't exist
- ❌ `tests/` - should be `__tests__/` and `tests/e2e/`

**Correct structure:**
- ✅ `app/` - Next.js App Router routes and pages
- ✅ `components/` - React components (root level)
- ✅ `lib/` - Utilities and business logic (root level)
- ✅ `content/` - Content files
- ✅ `public/` - Static assets
- ✅ `__tests__/` - Unit tests
- ✅ `tests/e2e/` - E2E tests
- ✅ `scripts/` - Automation scripts

---

## Impact Assessment

### High Impact (Breaks Functionality)
1. **Commands in rules.json** - Agents will try to run non-existent `make` commands
2. **BESTPR.md content** - Agents will follow wrong architecture patterns
3. **Agent context files** - Agents will look for non-existent directories and patterns

### Medium Impact (Confusion/Misguidance)
1. **Tech stack references** - Agents may suggest wrong libraries/tools
2. **Project structure** - Agents may create files in wrong locations
3. **Example task packets** - Agents may follow wrong patterns

### Low Impact (Documentation Only)
1. **Metadata descriptions** - Incorrect but doesn't affect execution
2. **Key contents summaries** - Misleading but not critical

---

## Recommendations

### Immediate Actions
1. **Update agentic.json** - This is the source of truth for injection. Update all incorrect content.
2. **Re-inject** - After updating agentic.json, re-run injection to update all files.
3. **Verify** - Check that all injected files match firm-template's actual structure.

### Files to Update in agentic.json
1. BESTPR.md content (line ~229)
2. All backend agent context files (lines ~1400-1500)
3. All frontend agent context files (lines ~1415-1448)
4. rules.json commands section (line ~183-200)
5. AGENTS.md content (line ~305)
6. Makefile content (line ~1586)
7. Example task packets (lines ~683, ~692, ~1503)
8. All tech stack references throughout

---

## Verification Checklist

After updating agentic.json and re-injecting, verify:

- [ ] BESTPR.md references "firm-template" not "UBOS"
- [ ] BESTPR.md describes Next.js structure, not Django
- [ ] All commands use `npm run` not `make`
- [ ] No references to Django, FirmScopedMixin, or Python
- [ ] No references to Vite, React Router, or TanStack React Query
- [ ] Agent context files reference correct directory structure
- [ ] Example task packets use Next.js patterns
- [ ] Tech stack matches package.json

---

**Note:** The actual injected files in `.repo/` have been manually corrected, but `agentic.json` still contains the original incorrect content. This means if you re-inject, it will overwrite the corrections.
