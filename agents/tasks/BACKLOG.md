# Project Backlog

<!--
SYSTEM INSTRUCTIONS — BACKLOG.md (agent-enforced)

Purpose: Storage of unscheduled tasks. Agent replenishes TODO.md from here.

Global Rules:
1) All tasks MUST follow this header format:
   ### # [id:...][type:...][priority:...][component:...] Title
2) Task blocks MUST be wrapped with:
   ## task_begin
   ## task_end
3) Grouping rules (for deterministic batching):
   - Tasks are grouped using:
     ## group_begin [type:X][priority:Y]
     ## group_end
   - When replenishing TODO.md:
     a) Select ONE group only (single type).
     b) Take up to 5 tasks in listed order.
     c) MOVE tasks to TODO.md (copy then delete from source).
4) Agent MUST NOT rewrite task content except to:
   - normalize formatting
   - fix obvious tag typos
   - add missing fields if absent
5) Do NOT reorder tasks inside a group.
-->

## group_begin [type:improvement][priority:medium]
## 🚀 Improvements (Unscheduled) — Medium

## task_begin
### # [id:TASK-20260131-002][type:improvement][priority:medium][component:testing] Section 6 coverage and e2e
**Status:** todo  
**Description:** P1 coverage thresholds and e2e not required for aligned; add over time.  
**Acceptance Criteria:**  
- [ ] Add coverage thresholds (e.g. 80/60)  
- [ ] Add e2e where critical  
- [ ] Document in docs/testing.md  
**Relevant Files:** `docs/testing.md`
## task_end

---

## task_begin
### # [id:TASK-20260131-003][type:improvement][priority:medium][component:configuration] Shared env schema or doc
**Status:** todo  
**Description:** Env validation duplicated across web and your-dedicated-marketer; drift risk.  
**Acceptance Criteria:**  
- [ ] Single source of truth: shared package or doc listing all env vars and validation rules  
- [ ] Apps extend or reference  
## task_end

---

## task_begin
### # [id:TASK-20260131-004][type:improvement][priority:medium][component:ci] CI install efficiency
**Status:** todo  
**Description:** CI runs four jobs each with full checkout and pnpm install; 4x install cost.  
**Acceptance Criteria:**  
- [ ] Single job or composite with cache  
- [ ] Or reuse install artifact across build lint test security  
**Relevant Files:** `.github/workflows/ci.yml`  
## task_end

---

## task_begin
### # [id:TASK-20260131-007][type:improvement][priority:medium][component:frontend] Token class migration for your-dedicated-marketer
**Status:** todo  
**Description:** 41 instances of hardcoded colors remain in your-dedicated-marketer components.  
**Acceptance Criteria:**  
- [ ] Migrate all hardcoded color classes to use design tokens from @repo/tokens  
## task_end

---
## group_end
