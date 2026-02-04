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
**Batch Type:** quality  
**Batch Goal:** Execute quality and performance tasks.  
**Batch Size Target:** 5

---

<!-- Tasks are promoted here from backlog files. Keep only active tasks in this file. -->

## task_begin
### # [id:TASK-20260203-042][type:quality][priority:medium][component:accessibility] Implement comprehensive accessibility testing and compliance

**Status:** todo  
**Description:** Create accessibility testing framework, WCAG compliance monitoring, and inclusive design validation for all client sites.  
**Acceptance Criteria:**

- [ ] Set up automated accessibility testing with axe-core
- [ ] Implement WCAG 2.1 AA compliance monitoring
- [ ] Create accessibility audit reports and remediation
- [ ] Add screen reader and keyboard navigation testing
- [ ] Document accessibility guidelines and best practices

**Dependencies:** TASK-20260203-009
**Relevant Files:** `packages/ui/tests/accessibility/`, `tests/accessibility/`, `docs/accessibility/`
## task_end


