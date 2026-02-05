# Current Sprints & Active Tasks

<!--
SYSTEM INSTRUCTIONS â€” TODO.md (agent-enforced)

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
   - Preserve the order as moved from BACKLOG.md.
   - Do NOT reorder unless explicitly instructed.
5) Completion rules:
   - When Status becomes done, MOVE the entire task block to ARCHIVE.md.
   - Remove it from TODO.md after archiving.
6) Notes discipline:
   - "Notes & Summary" is for execution logs and final summaries.
   - Keep Notes <= 10 lines. Prefer bullets. No long transcripts.
7) REQUIRED FIELDS (per TASKS.md):
   - **Plan:** Detailed implementation steps (agents follow this during execution)
   - **Estimated Effort:** Time estimate for resource planning
   - **Relevant Documentation:** Links to /docs/ files providing context
   - Tasks promoted from BACKLOG.md without these fields should be rejected
-->

## ðŸŽ¯ Current Batch Focus
**Batch Type:** [type:config][priority:critical]  
**Batch Goal:** Establish governance foundation before broader work proceeds  
**Batch Size Target:** 1 task (only eligible task in backlog group)

---

## task_begin
## 1. # [id:TASK-20260203-001][type:config][priority:critical][component:repo] Create AGENTS governance pack

**Status:** blocked  
**Created:** 2026-02-03  
**Assignee:** @agent

### Description
> Create comprehensive governance pack per PLAN.md requirements. This is the foundation for all other work and must be completed first per PLAN.md "Step 1: Inspect the repository and create governance pack if missing."

### Acceptance Criteria
- [ ] /AGENTS/AGENTS.toon entrypoint created
- [ ] /AGENTS/policies/TOOL_POLICY.md created
- [ ] /AGENTS/policies/SAFETY_POLICY.md created
- [ ] /AGENTS/policies/ARCHITECTURE_RULES.md created
- [ ] /AGENTS/policies/CODING_STANDARDS.md created
- [ ] /AGENTS/tasks/TODO.toon created
- [ ] /AGENTS/tasks/BACKLOG.toon created
- [ ] /AGENTS/tasks/ARCHIVE.toon created
- [ ] Governance pack is enforceable and documented

### Definition of Done
- [ ] Code merged / change complete
- [ ] Checks pass (typecheck/lint/build/tests as applicable)

### Relevant Files
- `/AGENTS/*` (all new)
- `README.md`
- `PLAN.md`

### Relevant Documentation
- `PLAN.md` — Agent governance requirements
- `docs/standards/README.md` — Documentation standards to follow
- `docs/architecture/README.md` — System architecture for ARCHITECTURE_RULES
- `docs/security/00-overview/SECURITY_POLICY.md` — Security policy for SAFETY_POLICY

### Dependencies
- None

### Plan
1. Create `/AGENTS/` directory structure
2. Create AGENTS.toon entrypoint (references PLAN.md)
3. Define TOOL_POLICY (tool usage guidelines)
4. Define SAFETY_POLICY (security, PII, credentials)
5. Define ARCHITECTURE_RULES (from PLAN.md: domain boundaries, no cross-domain reads, workflow orchestration)
6. Define CODING_STANDARDS (TypeScript, testing, documentation)
7. Create task management files (toon format)
8. Link from README.md
9. Validate against PLAN.md checklist

### Estimated Effort
1 week

### Notes & Summary
- [log] Promoted from backlog for the config critical batch.
- [blocker] TASKS_MANAGER role prohibits implementing governance pack files; needs implementing agent role.
## task_end

---
