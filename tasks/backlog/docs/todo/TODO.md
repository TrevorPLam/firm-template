# Current Sprints & Active Tasks

<!--
SYSTEM INSTRUCTIONS — TODO.md (agent-enforced)

Purpose: Active work queue. This file MUST contain tasks of a SINGLE batch type.

Canonical workflow + templates live in: TASKS.md

Global Rules:
1) Task blocks MUST be wrapped with:
   ## task_begin
   ## task_end
2) Every task MUST include tags in the title line:
   [id:...][type:...][priority:...][component:...]
3) Batch rules:
   - TODO.md MUST contain only ONE [type:*] at a time.
   - Batch size target: 5 tasks (or fewer if backlog has fewer).
   - Do NOT add tasks manually unless explicitly instructed.
4) Ordering rules:
   - Preserve the order as moved from backlog files.
   - Do NOT reorder unless explicitly instructed.
5) Completion rules:
   - When Status becomes done, MOVE the entire task block to ARCHIVE/ARCHIVE.md.
   - Remove it from TODO.md after archiving.
6) Notes discipline:
   - "Notes & Summary" is for execution logs and final summaries.
   - Keep Notes <= 10 lines. Prefer bullets. No long transcripts.
-->

## 🎯 Current Batch Focus
**Batch Type:** docs  
**Batch Goal:** Execute documentation tasks.  
**Batch Size Target:** 5

---

<!-- Tasks are promoted here from backlog files. Keep only active tasks in this file. -->

## task_begin
### # [id:TASK-20260203-001][type:docs][priority:high][component:documentation] Create comprehensive API documentation for backend services

**Status:** todo  
**Description:** Generate complete API documentation for the API gateway and all backend endpoints to support developer onboarding and integration.  
**Acceptance Criteria:**

- [ ] Document all API endpoints with request/response schemas
- [ ] Include authentication and authorization examples
- [ ] Add integration examples for frontend consumption
- [ ] Generate OpenAPI/Swagger specification
- [ ] Documentation accessible via `/docs` endpoint

**Relevant Files:** `services/api-gateway/backend/`, `docs/`
## task_end

## task_begin
### # [id:TASK-20260203-002][type:docs][priority:high][component:documentation] Add internationalization (i18n) setup and documentation

**Status:** todo  
**Description:** Implement next-intl framework and create comprehensive documentation for multi-language support across all client sites.  
**Acceptance Criteria:**

- [ ] Install and configure next-intl with locale routing
- [ ] Extract all hardcoded strings to translation files
- [ ] Create documentation for i18n workflow
- [ ] Add RTL language support preparation
- [ ] Document content translation process for clients

**Relevant Files:** `apps/*/app/[locale]/`, `packages/*/src/`, `docs/`
## task_end

## task_begin
### # [id:TASK-20260203-003][type:docs][priority:high][component:documentation] Create component library documentation with Storybook

**Status:** todo  
**Description:** Implement Storybook for the UI component library with interactive examples, accessibility documentation, and design token references.  
**Acceptance Criteria:**

- [ ] Set up Storybook with all UI components
- [ ] Add interactive controls and variant examples
- [ ] Document accessibility features and keyboard navigation
- [ ] Include design token references and theme examples
- [ ] Deploy Storybook as documentation site

**Relevant Files:** `packages/ui/`, `.storybook/`, `docs/`
## task_end

## task_begin
### # [id:TASK-20260203-015-D][type:docs][priority:medium][component:documentation] Add API versioning and comprehensive documentation

**Status:** todo  
**Description:** Implement API versioning strategy and generate comprehensive API documentation for all endpoints.  
**Acceptance Criteria:**

- [ ] Implement URL-based API versioning (v1, v2)
- [ ] Add OpenAPI/Swagger specification generation
- [ ] Create interactive API documentation
- [ ] Add API changelog and migration guides
- [ ] Set up API testing documentation and examples

**Dependencies:** TASK-20260203-015-C
**Relevant Files:** `services/api-gateway/backend/docs/`, `services/api-gateway/backend/api/`
## task_end

## task_begin
### # [id:TASK-20260203-019][type:docs][priority:high][component:training] Create comprehensive team training materials and onboarding curriculum

**Status:** todo  
**Description:** Develop structured training materials for new team members covering platform architecture, development workflows, and best practices.  
**Acceptance Criteria:**

- [ ] Create platform architecture overview and tutorials
- [ ] Document development setup and workflows
- [ ] Add coding standards and best practices guide
- [ ] Create client onboarding process documentation
- [ ] Build interactive learning exercises and examples

**Relevant Files:** `docs/training/`, `docs/onboarding/`, `CONTRIBUTING.md`
## task_end

