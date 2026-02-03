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
**Batch Type:** devex  
**Batch Goal:** Execute developer experience improvements.  
**Batch Size Target:** 5

---

<!-- Tasks are promoted here from backlog files. Keep only active tasks in this file. -->

## task_begin
### # [id:TASK-20260203-011][type:devex][priority:medium][component:monitoring] Implement application performance monitoring (APM)

**Status:** todo  
**Description:** Add comprehensive APM integration with performance tracking, error monitoring, and business metrics collection for production insights.  
**Acceptance Criteria:**

- [ ] Integrate APM solution (DataDog/New Relic/Sentry APM)
- [ ] Set up performance tracking for core user journeys
- [ ] Configure custom business metrics and dashboards
- [ ] Add alerting rules for critical issues
- [ ] Document monitoring and alerting procedures

**Relevant Files:** `apps/*/lib/monitoring/`, `packages/capabilities/src/`, `.env.example`
## task_end

## task_begin
### # [id:TASK-20260203-012][type:devex][priority:medium][component:performance] Add real user monitoring (RUM) for production insights

**Status:** todo  
**Description:** Implement real user monitoring to track Core Web Vitals, user behavior, and performance metrics in production environments.  
**Acceptance Criteria:**

- [ ] Add RUM SDK integration with privacy compliance
- [ ] Track Core Web Vitals and performance metrics
- [ ] Monitor user journey completion rates
- [ ] Create performance dashboards and reports
- [ ] Configure performance budget alerts

**Relevant Files:** `apps/*/components/analytics/`, `packages/capabilities/src/analytics.ts`
## task_end

## task_begin
### # [id:TASK-20260203-034][type:devex][priority:medium][component:productivity] Create developer productivity and velocity optimization tools

**Status:** todo  
**Description:** Implement developer productivity tools, velocity tracking, and optimization frameworks to improve development efficiency and team collaboration.  
**Acceptance Criteria:**

- [ ] Set up developer velocity tracking and metrics
- [ ] Create productivity optimization tools and automation
- [ ] Implement team collaboration and communication tools
- [ ] Add code review optimization and quality gates
- [ ] Create developer experience monitoring and feedback

**Relevant Files:** `scripts/automation/`, `tools/`, `docs/development/`, `.github/`
## task_end

