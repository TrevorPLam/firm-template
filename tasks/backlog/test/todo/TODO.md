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
**Batch Type:** test  
**Batch Goal:** Execute testing tasks.  
**Batch Size Target:** 5

---

<!-- Tasks are promoted here from backlog files. Keep only active tasks in this file. -->

## task_begin
### # [id:TASK-20260203-008][type:test][priority:high][component:testing] Implement comprehensive E2E testing with Playwright

**Status:** todo  
**Description:** Create end-to-end test suite covering critical user journeys across all apps including form submissions, navigation, and core functionality.  
**Acceptance Criteria:**

- [ ] Set up Playwright configuration for all apps
- [ ] Create E2E tests for contact forms and scheduling
- [ ] Add navigation and accessibility testing
- [ ] Implement visual regression testing
- [ ] Configure CI pipeline integration with reporting

**Relevant Files:** `playwright.config.ts`, `apps/*/tests/e2e/`, `.github/workflows/`
## task_end

## task_begin
### # [id:TASK-20260203-009][type:test][priority:high][component:testing] Add comprehensive component testing for UI library

**Status:** todo  
**Description:** Create thorough unit and integration tests for all UI components including accessibility, keyboard navigation, and visual testing.  
**Acceptance Criteria:**

- [ ] Test all UI components with Vitest and React Testing Library
- [ ] Add accessibility testing with axe-core
- [ ] Implement visual testing for component variants
- [ ] Test keyboard navigation and ARIA attributes
- [ ] Achieve 90%+ test coverage for UI package

**Relevant Files:** `packages/ui/src/`, `packages/ui/tests/`, `vitest.config.ts`
## task_end

## task_begin
### # [id:TASK-20260203-010][type:test][priority:high][component:testing] Create integration tests for patterns and capabilities

**Status:** todo  
**Description:** Implement integration tests for composed patterns and business capabilities to ensure proper interaction between components and services.  
**Acceptance Criteria:**

- [ ] Test all pattern compositions (Hero, Features, Testimonials, etc.)
- [ ] Add integration tests for lead capture and analytics
- [ ] Test form submissions with mock services
- [ ] Verify integration adapter functionality
- [ ] Add error handling and fallback testing

**Relevant Files:** `packages/patterns/src/`, `packages/capabilities/src/`, `packages/integrations/src/`
## task_end

## task_begin
### # [id:TASK-20260203-030][type:test][priority:high][component:testing] Create visual regression testing and design validation system

**Status:** todo  
**Description:** Implement comprehensive visual regression testing, design token validation, and UI consistency checking across all themes and components.  
**Acceptance Criteria:**

- [ ] Set up visual regression testing framework (Percy/Chromatic)
- [ ] Create design token validation and compliance testing
- [ ] Implement cross-browser and cross-theme testing
- [ ] Add automated UI consistency checking
- [ ] Create visual testing CI/CD integration

**Relevant Files:** `packages/ui/`, `packages/tokens/`, `tests/visual/`, `.github/workflows/`
## task_end

## task_begin
### # [id:TASK-20260203-043][type:test][priority:high][component:testing] Create comprehensive API gateway testing suite

**Status:** todo  
**Description:** Implement thorough testing for API gateway including authentication, rate limiting, caching, and endpoint functionality.  
**Acceptance Criteria:**

- [ ] Create unit tests for authentication and authorization flows
- [ ] Add integration tests for rate limiting and caching middleware
- [ ] Implement security testing for JWT token validation
- [ ] Add performance testing for API endpoint responses
- [ ] Create API contract testing and validation

**Dependencies:** TASK-20260203-015, TASK-20260203-015-A, TASK-20260203-015-B, TASK-20260203-015-C
**Relevant Files:** `services/api-gateway/backend/tests/`, `tests/integration/`, `playwright.config.ts`
## task_end

