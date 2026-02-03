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
**Batch Goal:** Execute medium-priority CI-CD infrastructure tasks.  
**Batch Size Target:** 5

---

<!-- Tasks are promoted here from backlog files. Keep only active tasks in this file. -->

## task_begin
### # [id:TASK-20260203-024][type:ci][priority:medium][component:infrastructure] Set up database migration and environment management

**Status:** todo  
**Description:** Implement database migration strategy, environment configuration management, and backup/restore procedures for reliable deployments.  
**Acceptance Criteria:**

- [ ] Create database migration framework and scripts
- [ ] Set up environment configuration management
- [ ] Implement backup and restore procedures
- [ ] Add database seeding and test data setup
- [ ] Document environment and database management

**Relevant Files:** `scripts/database/`, `services/api-gateway/backend/`, `.env.example`
## task_end

## task_begin
### # [id:TASK-20260203-025][type:ci][priority:medium][component:testing] Create integration testing infrastructure

**Status:** todo  
**Description:** Build integration testing infrastructure for third-party services, webhooks, and API integrations with proper mocking and monitoring.  
**Acceptance Criteria:**

- [ ] Set up integration testing environment
- [ ] Create webhook testing infrastructure
- [ ] Add third-party service mocking framework
- [ ] Implement integration monitoring and alerting
- [ ] Document integration testing procedures

**Relevant Files:** `packages/integrations/src/`, `tests/integration/`, `docker-compose.test.yml`
## task_end

