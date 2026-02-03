# Task Management System

<!--
SYSTEM INSTRUCTIONS — TASKS.md (agent-enforced)

Purpose: Central workflow documentation and canonical templates for the distributed task management system.

Structure:
- Tasks are distributed across category-specific backlog folders
- Active work happens in category-specific TODO folders  
- Completed tasks are archived in category-specific ARCHIVE folders
- TASK_INDEX.md serves as the central registry

Key Principles:
1) Distributed organization by category (business, docs, infra, etc.)
2) Clear lifecycle: backlog → todo → archive
3) Single source of truth in TASK_INDEX.md
4) Consistent templates and procedures across all categories
-->

## 🏗️ System Architecture

### Directory Structure
```
tasks/
├── TASK_INDEX.md              # Central registry (master index)
├── TASKS.md                   # This file (workflow & templates)
└── backlog/                   # Task pool by category
    ├── business/              # Business & operations tasks
    ├── ci-high/               # High-priority CI/CD tasks  
    ├── ci-medium/             # Medium-priority CI/CD tasks
    ├── config/                # Configuration tasks
    ├── devex/                 # Developer experience tasks
    ├── docs/                  # Documentation tasks
    ├── infra/                 # Infrastructure tasks
    ├── innovation/            # Innovation & R&D tasks
    ├── quality/               # Quality & testing tasks
    ├── security/              # Security tasks
    └── test/                  # Testing tasks
        └── todo/              # Active work queue
            ├── TODO.md        # Active tasks (max 5 per batch)
            └── ARCHIVE/       # Completed tasks
                └── ARCHIVE.md # Task history (append-only)
```

## 🔄 Task Lifecycle Workflow

### 1. Task Creation
- **Location**: `backlog/{category}/TASK-{YYYYMMDD}-{NNN}.md`
- **Registry**: Add entry to `TASK_INDEX.md` with `status: todo`
- **Template**: Use standard task template

### 2. Task Promotion (Backlog → Active)
- **Trigger**: When ready to work on task
- **Action**: Move task content from backlog file to `backlog/{category}/todo/TODO.md`
- **Registry**: Update `TASK_INDEX.md` location to `backlog/{category}/todo/TODO.md`
- **Rules**: Max 5 active tasks per category, single type per TODO.md

### 3. Task Completion (Active → Archive)
- **Trigger**: When task is completed
- **Action**: Move task from TODO.md to `backlog/{category}/todo/ARCHIVE/ARCHIVE.md`
- **Registry**: Update `TASK_INDEX.md` to `status: done, location: backlog/{category}/todo/ARCHIVE/ARCHIVE.md`
- **Requirements**: Add completion date, assignee, and final summary

## 📝 Canonical Templates

### Task Template (for backlog files)
```markdown
### # [id:TASK-YYYYMMDD-NNN][type:{type}][priority:{priority}][component:{component}] {Task Title}

**Status:** todo  
**Description:** {Clear description of what needs to be done}  
**Acceptance Criteria:**

- [ ] {Specific, measurable criteria}
- [ ] {Another criterion}
- [ ] {Final criterion}

**Relevant Files:** `{file paths or directories}`
```

### TODO.md Template (Active Work Queue)
```markdown
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
   - Preserve the order as moved from backlog.
   - Do NOT reorder unless explicitly instructed.
5) Completion rules:
   - When Status becomes done, MOVE the entire task block to ARCHIVE.md.
   - Remove it from TODO.md after archiving.
6) Notes discipline:
   - "Notes & Summary" is for execution logs and final summaries.
   - Keep Notes <= 10 lines. Prefer bullets. No long transcripts.
-->

## 🎯 Current Batch Focus
**Batch Type:** (none)  
**Batch Goal:** (set when promoting from backlog)  
**Batch Size Target:** 5

---

<!-- Tasks are promoted here from backlog. Keep only active tasks in this file. -->

<!-- (empty) -->
```

### ARCHIVE.md Template (Completed Tasks)
```markdown
# Task Archive

<!--
SYSTEM INSTRUCTIONS — ARCHIVE.md (agent-enforced)

Purpose: Append-only history of completed tasks.

Canonical workflow + templates live in: TASKS.md

Rules:
1) APPEND-ONLY — agent MUST append new completed tasks at bottom.
2) NEVER modify existing archived tasks (no rewrites, no reformatting).
3) Each archived task MUST be a full task block from TODO.md.
4) Required:
   **Status:** done
   **Completed:** YYYY-MM-DD
   **Assignee:** @agent
5) Final Summary <= 8 lines.
-->

## ✅ Completed Tasks (Chronological)

---

<!-- No completed tasks yet for this project. Append completed task blocks below. -->
```

## 📊 TASK_INDEX.md Rules

### Registry Format
```markdown
## index_entry_begin
[id:TASK-YYYYMMDD-NNN]
type: {category}
priority: {high|medium|low}
component: {specific component}
status: {todo|in-progress|blocked|done}
location: {actual file path}
created: YYYY-MM-DD
title: {Task title}
## index_entry_end
```

### Location Values
- **Backlog**: `backlog/{category}/TASK-{YYYYMMDD}-{NNN}.md`
- **Active**: `backlog/{category}/todo/TODO.md`
- **Archive**: `backlog/{category}/todo/ARCHIVE/ARCHIVE.md`

### Registry Rules
1. Every task MUST have an entry
2. Entries MUST remain in chronological order
3. Update location when moving tasks
4. Set status=done and add completion date when archiving
5. Use strict `## index_entry_begin` / `## index_entry_end` boundaries

## 🎯 Batch Management

### Batch Types by Category
- **business**: Business operations, scaling, client management
- **docs**: Documentation, guides, training materials
- **infra**: Infrastructure, deployment, monitoring
- **security**: Security, compliance, authentication
- **test**: Testing, QA, validation
- **ci-high**: High-priority CI/CD and automation
- **ci-medium**: Medium-priority CI/CD and infrastructure
- **config**: Configuration, settings, feature flags
- **devex**: Developer experience, tooling, productivity
- **quality**: Code quality, performance, design
- **innovation**: R&D, experimental features, new tech

### Batch Promotion Rules
1. Single type per TODO.md file
2. Maximum 5 active tasks per batch
3. Preserve order from backlog
4. Clear batch goal and focus
5. Update TASK_INDEX.md when promoting

## 🔧 Operational Procedures

### Daily Workflow
1. **Review**: Check active batches in each TODO.md
2. **Update**: Move completed tasks to ARCHIVE.md
3. **Promote**: Add new tasks from backlog if batch size < 5
4. **Registry**: Update TASK_INDEX.md with all movements
5. **Archive**: Ensure completed tasks have proper summaries

### Task Movement Checklist
- [ ] Update source file (remove from backlog/TODO)
- [ ] Update destination file (add to TODO/ARCHIVE)
- [ ] Update TASK_INDEX.md location and status
- [ ] Add completion date for archived tasks
- [ ] Verify all references are consistent

### Quality Assurance
- Verify task IDs are unique and follow format
- Ensure all required fields are present
- Check that locations match actual file paths
- Confirm archive entries are append-only
- Validate batch size limits

---

**Last Updated**: 2026-02-03  
**System Version**: 1.0  
**Maintainer**: @agent
