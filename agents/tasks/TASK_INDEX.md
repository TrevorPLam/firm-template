# TASK INDEX

<!--
SYSTEM INSTRUCTIONS — TASK_INDEX.md (agent-enforced)

Purpose: Central registry mapping every task's ID to its current location.

Rules:
1) Every task MUST have an entry here.
2) On task creation → append new entry.
3) When moving tasks → update `status` + `location`.
4) When completing → set status=done, location=ARCHIVE.md, add completed date.
5) Strict boundaries:
   ## index_entry_begin
   ## index_entry_end
6) Entries MUST remain in chronological order.
7) Allowed statuses: todo | in-progress | blocked | done
8) Allowed locations: BACKLOG.md | TODO.md | ARCHIVE.md
-->

## 🗂 Task Registry

---

## index_entry_begin
[id:TASK-20260131-001]  
type: alignment  
priority: critical  
component: documentation  
status: done  
location: ARCHIVE.md  
created: 2026-01-31  
completed: 2026-01-31  
title: Fix broken documentation links
## index_entry_end

---

## index_entry_begin
[id:TASK-20260131-002]  
type: alignment  
priority: medium  
component: frontend  
status: done  
location: ARCHIVE.md  
created: 2026-01-31  
completed: 2026-01-31  
title: Fix apps/web page comment typo
## index_entry_end

---

## index_entry_begin
[id:TASK-20260131-003]  
type: alignment  
priority: critical  
component: platform  
status: in-progress  
location: TODO.md  
created: 2026-01-31  
title: Align your-dedicated-marketer with platform
## index_entry_end

---

## index_entry_begin
[id:TASK-20260131-004]  
type: alignment  
priority: high  
component: validation  
status: done  
location: ARCHIVE.md  
created: 2026-01-31  
completed: 2026-01-31  
title: Validation workflow fail on errors
## index_entry_end

---

## index_entry_begin
[id:TASK-20260131-005]  
type: alignment  
priority: medium  
component: documentation  
status: done  
location: ARCHIVE.md  
created: 2026-01-31  
completed: 2026-01-31  
title: Section 3 env copy instruction
## index_entry_end

---

## index_entry_begin
[id:TASK-20260131-006]  
type: alignment  
priority: medium  
component: validation  
status: done  
location: ARCHIVE.md  
created: 2026-01-31  
completed: 2026-01-31  
title: Section 1 root file count
## index_entry_end

---

## index_entry_begin
[id:TASK-20260131-007]  
type: alignment  
priority: high  
component: testing  
status: done  
location: ARCHIVE.md  
created: 2026-01-31  
completed: 2026-01-31  
title: Add real tests for apps
## index_entry_end

---

## index_entry_begin
[id:TASK-20260131-008]  
type: alignment  
priority: medium  
component: documentation  
status: done  
location: ARCHIVE.md  
created: 2026-01-31  
completed: 2026-01-31  
title: Create docs referenced by AGENTS.toon
## index_entry_end

---

## index_entry_begin
[id:TASK-20260131-001]  
type: security  
priority: high  
component: documentation  
status: done  
location: ARCHIVE.md  
created: 2026-01-31  
completed: 2026-01-31  
title: Replace security@example.com in SECURITY.md
## index_entry_end

---

## index_entry_begin
[id:TASK-20260131-002]  
type: improvement  
priority: medium  
component: testing  
status: todo  
location: BACKLOG.md  
created: 2026-01-31  
title: Section 6 coverage and e2e
## index_entry_end

---

## index_entry_begin
[id:TASK-20260131-003]  
type: improvement  
priority: medium  
component: configuration  
status: todo  
location: BACKLOG.md  
created: 2026-01-31  
title: Shared env schema or doc
## index_entry_end

---

## index_entry_begin
[id:TASK-20260131-004]  
type: improvement  
priority: medium  
component: ci  
status: todo  
location: BACKLOG.md  
created: 2026-01-31  
title: CI install efficiency
## index_entry_end

---

## index_entry_begin
[id:TASK-20260131-005]  
type: documentation  
priority: medium  
component: documentation  
status: done  
location: ARCHIVE.md  
created: 2026-01-31  
completed: 2026-01-31  
title: Add your-dedicated-marketer to root README
## index_entry_end

---

## index_entry_begin
[id:TASK-20260131-006]  
type: alignment  
priority: low  
component: configuration  
status: done  
location: ARCHIVE.md  
created: 2026-01-31  
completed: 2026-01-31  
title: Optional Section 0 and 2 alignment fields
## index_entry_end

---

## index_entry_begin
[id:TASK-20260131-007]  
type: improvement  
priority: medium  
component: frontend  
status: todo  
location: BACKLOG.md  
created: 2026-01-31  
title: Token class migration for your-dedicated-marketer
## index_entry_end

---

## Template for New Index Entries

## index_entry_begin
[id:TASK-YYYYMMDD-XXX]  
type: <feature|bug|chore|documentation|etc>  
priority: <critical|high|medium|low>  
component: <backend|api|ui|etc>  
status: todo  
location: BACKLOG.md  
created: YYYY-MM-DD  
title: New Task Title Goes Here  
## index_entry_end

---
