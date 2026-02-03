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
**Batch Type:** ci  
**Batch Goal:** Execute top-priority CI-CD automation tasks.  
**Batch Size Target:** 5

---

<!-- Tasks are promoted here from backlog files. Keep only active tasks in this file. -->

## task_begin
### # [id:TASK-20260203-006][type:ci][priority:high][component:automation] Create GitHub Actions CI pipeline foundation

**Status:** todo  
**Description:** Implement core CI pipeline with linting, type-checking, testing, and building for automated quality gates.  
**Acceptance Criteria:**

- [ ] Create GitHub Actions workflow for lint, type-check, test, build
- [ ] Add security scanning and dependency checks
- [ ] Configure test coverage reporting and thresholds
- [ ] Set up build artifact management
- [ ] Configure branch protection and required status checks

**Relevant Files:** `.github/workflows/ci.yml`, `scripts/`, `package.json`
## task_end

## task_begin
### # [id:TASK-20260203-007][type:ci][priority:high][component:automation] Set up testing infrastructure and frameworks

**Status:** todo  
**Description:** Implement testing frameworks, configuration, and infrastructure for unit, integration, and E2E testing across all packages.  
**Acceptance Criteria:**

- [ ] Set up Playwright for E2E testing across all apps
- [ ] Configure Vitest for unit and integration testing
- [ ] Add visual regression testing framework
- [ ] Create test data management and fixtures
- [ ] Set up test environment configuration

**Relevant Files:** `playwright.config.ts`, `vitest.config.ts`, `apps/*/tests/`, `packages/*/tests/`
## task_end

## task_begin
### # [id:TASK-20260203-023][type:ci][priority:high][component:automation] Implement automated deployment and environment promotion

**Status:** todo  
**Description:** Build deployment pipeline with staging environments, automated testing, and controlled production promotion.  
**Acceptance Criteria:**

- [ ] Create staging environment deployment workflow
- [ ] Add automated smoke tests for deployments
- [ ] Implement blue-green deployment strategy
- [ ] Configure rollback mechanisms
- [ ] Document deployment and promotion procedures

**Relevant Files:** `.github/workflows/deploy-`, `scripts/deploy/`, `docker-compose.yml`
## task_end

