# Current Sprints & Active Tasks

<!--
SYSTEM INSTRUCTIONS — TODO.md (agent-enforced)

Purpose: Active work queue. This file MUST contain tasks of a SINGLE batch type.

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
-->

## 🎯 Current Batch Focus
**Batch Type:** [type:alignment]  
**Batch Goal:** Platform alignment tasks for your-dedicated-marketer  
**Batch Size Target:** 5

---

## task_begin
## 1. # [id:TASK-20260131-003][type:alignment][priority:critical][component:platform] Align your-dedicated-marketer with platform

**Status:** in-progress  
**Created:** 2026-01-31  
**Assignee:** @agent

### Description
> App uses custom Hero and hardcoded colors (white slate-800); no @repo/patterns; no middleware. Bring to platform baseline.

### Acceptance Criteria
- [ ] Use @repo/patterns Hero (thin wrapper with content)
- [ ] Replace white/slate-800 with token classes (e.g. background-alt foreground-muted)
- [ ] Add middleware.ts ported from web (security headers payload limit)
- [ ] Document or remove any intentional deviations

### Definition of Done
- [ ] Unit tests passed
- [ ] Linting/Formatting checks passed
- [ ] Documentation updated
- [ ] No new errors introduced

### Relevant Files
- `apps/your-dedicated-marketer/components/Hero.tsx`
- `apps/your-dedicated-marketer/middleware.ts`
- Component files with hardcoded colors (41 instances)

### Dependencies
- None

### Plan
1. Migrate remaining hardcoded color classes to design tokens
2. Verify middleware functionality
3. Document any intentional deviations
4. Final testing and validation

### Notes & Summary
- [log] Hero now uses @repo/patterns
- [log] middleware exists
- [summary] Remaining work is token class migration (41 instances of hardcoded colors in components)
## task_end

---
