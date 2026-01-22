# P0TODO.md - Repository Task List

Document Type: Workflow
Last Updated: 2026-01-22
Task Truth Source: **P0TODO.md (P0)**
Other priorities: `P1TODO.md`, `P2TODO.md`, `P3TODO.md`.

This file is the single source of truth for P0 tasks. If another document disagrees, the task record in this file wins (unless the Constitution overrides).

## Goals (Generic Firm Template)
**PRIMARY GOAL**: Convert this repository from a marketing firm-specific implementation into a reusable professional services firm template that can be adopted by any vertical (law, accounting, consulting, design agencies, etc.).

**Template Characteristics**:
- Site: High-performance professional services site template
- Hosting: Cloudflare Pages (GitHub integration)
- Standard: Diamond Standard (performance, accessibility, observability, testing)
- Features: Sentry, PWA, Search, Contact flow with Supabase + CRM sync (configurable)
- Architecture: Next.js 15 App Router, TypeScript, Tailwind CSS, MDX blog engine
- Deployment: Cloudflare Pages with Edge Runtime optimization

## Task Schema (Required)
- **ID**: `T-###` (unique, sequential, starting from T-001)
- **Priority**: `P0 | P1 | P2 | P3`
- **Type**: `TEMPLATE | DOCS | INFRASTRUCTURE | QUALITY | DEPENDENCY | SECURITY`
- **Owner**: `AGENT | Trevor`
- **Status**: `READY | BLOCKED | IN-PROGRESS | IN-REVIEW | DONE`
- **Blockers**: `None` or a short description of what prevents progress
- **Context**: why the task exists (1–5 bullets)
- **Acceptance Criteria**: verifiable checklist (broken into subtasks T-###.#)
- **References**: file paths and/or links inside this repo
- **Dependencies**: task IDs (if any)
- **Effort**: `XS | S | M | L | XL` (XS = < 30 min, S = < 2 hr, M = < 4 hr, L = < 1 day, XL = > 1 day)

## Prompt Scaffold (Required for AGENT-owned tasks)
Use this scaffold inside each task so agents can work from this file without a custom prompt.

- **Role**: Who the agent should act as (e.g., senior engineer, docs editor).
- **Goal**: What "done" means in one sentence.
- **Non-Goals**: Explicit exclusions to prevent scope creep.
- **Context**: Relevant files, prior decisions, and why the task exists.
- **Constraints**: Tooling, style, security, and architecture rules to follow.
- **Examples**: Expected input/output or format examples when applicable.
- **Validation**: Exact verification steps (tests, lint, build, manual checks).
- **Output Format**: Required response format or artifacts.
- **Uncertainty**: If details are missing, mark **UNKNOWN** and cite what was checked.

### Task Prompt Template (paste into each task)
Role:
Goal:
Non-Goals:
Context:
Constraints:
Examples:
Validation:
Output Format:
Uncertainty:

### Priority Meaning
- **P0**: CRITICAL - Template cannot be released without this; blocks all adoption
- **P1**: HIGH - Important for template quality and usability; complete within 7 days
- **P2**: MEDIUM - Enhances template but not required for initial release; complete within 30 days
- **P3**: LOW - Nice to have; backlog/tech debt; do when convenient

### Type Definitions
- **TEMPLATE**: Converting marketing-specific content to generic placeholders
- **DOCS**: Documentation updates for template users
- **INFRASTRUCTURE**: Technical setup and deployment configuration
- **QUALITY**: Testing, performance, accessibility improvements
- **DEPENDENCY**: Package updates and vulnerability fixes
- **SECURITY**: Security issues and fixes

### Ownership Rule
- **Owner: AGENT** — task can be executed by AI coding agents in-repo
- **Owner: Trevor** — requires external actions (provider dashboards, DNS, billing, approvals)

---


## 🟣 PHASE 5: PLATINUM STANDARD ENHANCEMENTS (P0-P3)
> **BEYOND DIAMOND**: These tasks elevate the template from "excellent" to "platinum standard"
> Based on industry research, WebAward criteria, and best-in-class professional services sites
> See docs/ARCHIVE/2026/PLATINUM_STANDARD_ANALYSIS.md for detailed research and rationale

### T-022: Upgrade Next.js to patch CVE-2025-66478
Priority: P0
Type: SECURITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Next.js 15.5.2 has security vulnerability CVE-2025-66478
- Must upgrade to patched version before template release
- Critical security issue blocks production use
- Identified in docs/ARCHIVE/2026/TEMPLATE_ASSESSMENT_REPORT.md
- Identified in WRONG.md SEC-006 / Dep1.2
- Identified in PERFECT.md P0-003
Acceptance Criteria:
- [ ] T-022.1: Upgrade Next.js to 15.5.3 or latest patched version
- [ ] T-022.2: Verify build works with Cloudflare adapter
- [ ] T-022.3: Run full test suite (npm run test, npm run type-check)
- [ ] T-022.4: Test local development server
- [ ] T-022.5: Document version change in CHANGELOG.md
- [ ] T-022.6: Update package.json and package-lock.json
Prompt Scaffold:
- Role: Security engineer.
- Goal: Complete T-022: Upgrade Next.js to patch CVE-2025-66478 per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: Next.js 15.5.2 has security vulnerability CVE-2025-66478; Must upgrade to patched version before template release.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/package.json, /CHANGELOG.md).
- Validation: Run and/or verify: npm run test, npm run type-check; satisfy all checklist items.
- Output Format: Update referenced files (/package.json, /CHANGELOG.md) and record task status if required.
- Uncertainty: None.
References:
- /package.json
- /CHANGELOG.md
- https://nextjs.org/blog/CVE-2025-66478
Dependencies: None
Effort: S
---

## 🟤 PHASE 6: AUDIT REMEDIATION (WRONG.md)
> Remediate issues identified in `WRONG.md` (baseline + deep sweep).

### T-040: Fix rate limiter race condition (WRONG #001)
Priority: P0
Type: SECURITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md #001/C001: rate limiter singleton can initialize multiple times
- Concurrent requests can create multiple limiter instances and inconsistent enforcement
Acceptance Criteria:
- [ ] T-040.1: Implement Promise-based singleton initialization in `lib/actions.ts`
- [ ] T-040.2: Add test or concurrency simulation verifying single instance initialization
Prompt Scaffold:
- Role: Security engineer.
- Goal: Complete T-040: Fix rate limiter race condition (WRONG #001) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md #001/C001: rate limiter singleton can initialize multiple times; Concurrent requests can create multiple limiter instances and inconsistent enforcement.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/lib/actions.ts, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/lib/actions.ts, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /lib/actions.ts
- /WRONG.md
Dependencies: None
Effort: S
---



### T-043: Fix HubSpot sync error swallowing (BUG #003 / #006)
Priority: P0
Type: SECURITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md BUG #003/#006: HubSpot sync failures are swallowed and status updates can fail silently
- Leads can be stuck in pending state with no visibility or recovery path
Acceptance Criteria:
- [ ] T-043.1: Persist sync failure state with error details when CRM sync fails
- [ ] T-043.2: Return a safe warning or status indicator to callers when sync fails
Prompt Scaffold:
- Role: Security engineer.
- Goal: Complete T-043: Fix HubSpot sync error swallowing (BUG #003 / #006) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md BUG #003/#006: HubSpot sync failures are swallowed and status updates can fail silently; Leads can be stuck in pending state with no visibility or recovery path.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/lib/actions.ts, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/lib/actions.ts, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /lib/actions.ts
- /WRONG.md
Dependencies: None
Effort: S
---

### T-044: Remediate MDX XSS vulnerability (BUG #008)
Priority: P0
Type: SECURITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md BUG #008: MDX rendering allows script injection without sanitization
Acceptance Criteria:
- [ ] T-044.1: Add MDX sanitization (e.g., `rehype-sanitize`) with a strict allowlist
- [ ] T-044.2: Audit current MDX content for unsafe nodes/scripts
- [ ] T-044.3: Define scope and affected files before changes.
- [ ] T-044.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Security engineer.
- Goal: Complete T-044: Remediate MDX XSS vulnerability (BUG #008) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md BUG #008: MDX rendering allows script injection without sanitization.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/components/BlogPostContent.tsx, /content/blog/, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/components/BlogPostContent.tsx, /content/blog/, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /components/BlogPostContent.tsx
- /content/blog/
- /WRONG.md
Dependencies: None
Effort: M
---
### T-045: Prevent header injection in HubSpot name fields (BUG #011)
Priority: P0
Type: SECURITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md BUG #011: first/last names are sent to HubSpot without newline sanitization
Acceptance Criteria:
- [ ] T-045.1: Sanitize first/last names to strip CR/LF and control chars
- [ ] T-045.2: Add tests covering CR/LF injection attempts
Prompt Scaffold:
- Role: Security engineer.
- Goal: Complete T-045: Prevent header injection in HubSpot name fields (BUG #011) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md BUG #011: first/last names are sent to HubSpot without newline sanitization.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/lib/actions.ts, /lib/sanitize.ts, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/lib/actions.ts, /lib/sanitize.ts, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /lib/actions.ts
- /lib/sanitize.ts
- /WRONG.md
Dependencies: None
Effort: XS
---

### T-046: Prevent path traversal in blog loader (SEC-001)
Priority: P0
Type: SECURITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md SEC-001: slug-based path building allows path traversal
Acceptance Criteria:
- [ ] T-046.1: Validate slugs with a strict allowlist before reading files
- [ ] T-046.2: Add tests for traversal payloads returning undefined/404
Prompt Scaffold:
- Role: Security engineer.
- Goal: Complete T-046: Prevent path traversal in blog loader (SEC-001) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md SEC-001: slug-based path building allows path traversal.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/lib/blog.ts, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/lib/blog.ts, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /lib/blog.ts
- /WRONG.md
Dependencies: None
Effort: XS
---

## 🟢 PHASE 7: PERFECT.md CLEANUP & QUALITY (P0-P2)
> Tasks migrated from `PERFECT.md` to align with P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md as the task truth sources.
### T-121: Fix failing tests after sanitization (PERFECT P0-001)
Priority: P0
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- PERFECT.md P0-001: 8 tests failing due to outdated marketing content expectations
- Overlaps with placeholder test updates already tracked
Acceptance Criteria:
- [ ] T-121.1: Update test expectations to generic template content
- [ ] T-121.2: Run `npm test` with all tests passing
- [ ] T-121.3: Identify target scenarios and fixtures for coverage.
- [ ] T-121.4: Implement tests and wire them into existing scripts.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-121: Fix failing tests after sanitization (PERFECT P0-001) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: PERFECT.md P0-001: 8 tests failing due to outdated marketing content expectations; Overlaps with placeholder test updates already tracked.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; Dependencies: T-103; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/__tests__/components/HomePage.test.tsx, /__tests__/components/MarketingSections.test.tsx, /__tests__/components/pages/pages.test.tsx).
- Validation: Run and/or verify: npm test; satisfy all checklist items.
- Output Format: Update referenced files (/__tests__/components/HomePage.test.tsx, /__tests__/components/MarketingSections.test.tsx, /__tests__/components/pages/pages.test.tsx) and record task status if required.
- Uncertainty: None.
References:
- /__tests__/components/HomePage.test.tsx
- /__tests__/components/MarketingSections.test.tsx
- /__tests__/components/pages/pages.test.tsx
- /__tests__/lib/actions.rate-limit.test.ts
- /PERFECT.md
Dependencies: T-103
Effort: M
---
### T-122: Resolve linting warnings (PERFECT P0-002)
Priority: P0
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- PERFECT.md P0-002: 8 lint warnings (eslint ignore, ts-ignore usage, unused params/imports)
Acceptance Criteria:
- [ ] T-122.1: Address all listed lint warnings in PERFECT.md
- [ ] T-122.2: Run `npm run lint` with 0 warnings/errors
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-122: Resolve linting warnings (PERFECT P0-002) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: PERFECT.md P0-002: 8 lint warnings (eslint ignore, ts-ignore usage, unused params/imports).
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; Dependencies: T-114, T-080; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/eslint.config.mjs, /.eslintignore, /next.config.mjs).
- Validation: Run and/or verify: npm run lint; satisfy all checklist items.
- Output Format: Update referenced files (/eslint.config.mjs, /.eslintignore, /next.config.mjs) and record task status if required.
- Uncertainty: None.
References:
- /eslint.config.mjs
- /.eslintignore
- /next.config.mjs
- /sentry.client.config.ts
- /sentry.edge.config.ts
- /sentry.server.config.ts
- /vitest.setup.tsx
- /PERFECT.md
Dependencies: T-114, T-080
Effort: S
---

### T-123: Run security audit & document findings (PERFECT P0-004)
Priority: P0
Type: SECURITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- PERFECT.md P0-004: 18 npm vulnerabilities and deprecated adapter need assessment
Acceptance Criteria:
- [ ] T-123.1: Run `npm audit` and record findings by severity
- [ ] T-123.2: Document mitigations in `docs/SECURITY_AUDIT_RESULTS.md`
- [ ] T-123.3: Address critical/high issues or document rationale
- [ ] T-123.4: Define scope and checklist for the audit targets.
Prompt Scaffold:
- Role: Security engineer.
- Goal: Complete T-123: Run security audit & document findings (PERFECT P0-004) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: PERFECT.md P0-004: 18 npm vulnerabilities and deprecated adapter need assessment.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; Dependencies: T-115; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/SECURITY.md, /SECURITYAUDIT.md, /docs/SECURITY_AUDIT_RESULTS.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/SECURITY.md, /SECURITYAUDIT.md, /docs/SECURITY_AUDIT_RESULTS.md) and record task status if required.
- Uncertainty: None.
References:
- /SECURITY.md
- /SECURITYAUDIT.md
- /docs/SECURITY_AUDIT_RESULTS.md
- /PERFECT.md
Dependencies: T-115
Effort: M
---
### T-124: Establish test coverage baseline (PERFECT P0-005)
Priority: P0
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- PERFECT.md P0-005: coverage baseline is unknown
Acceptance Criteria:
- [ ] T-124.1: Run `npm run test:coverage` and capture metrics
- [ ] T-124.2: Identify files below 50% coverage
- [ ] T-124.3: Document baseline in `docs/COVERAGE_BASELINE.md`
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-124: Establish test coverage baseline (PERFECT P0-005) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: PERFECT.md P0-005: coverage baseline is unknown.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/vitest.config.ts, /docs/COVERAGE_BASELINE.md, /PERFECT.md).
- Validation: Run and/or verify: npm run test:coverage; satisfy all checklist items.
- Output Format: Update referenced files (/vitest.config.ts, /docs/COVERAGE_BASELINE.md, /PERFECT.md) and record task status if required.
- Uncertainty: None.
References:
- /vitest.config.ts
- /docs/COVERAGE_BASELINE.md
- /PERFECT.md
Dependencies: None
Effort: S
---
### T-140: Final code review gate (PERFECT P5-001)
Priority: P0
Type: QUALITY
Owner: AGENT
Status: BLOCKED
Blockers: All prior PERFECT phases complete
Context:
- PERFECT.md P5-001: final code review required before completion
Acceptance Criteria:
- [ ] T-140.1: Request code review
- [ ] T-140.2: Address feedback and document decisions
- [ ] T-140.3: Define scope and checklist for the audit targets.
- [ ] T-140.4: Record findings and create follow-up tasks for any issues.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-140: Final code review gate (PERFECT P5-001) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: PERFECT.md P5-001: final code review required before completion.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; Dependencies: T-121, T-122, T-123, T-124, T-125, T-126, T-127, T-128, T-129, T-130, T-131, T-132, T-133, T-134, T-135, T-136, T-137, T-138, T-139; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/PERFECT.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/PERFECT.md) and record task status if required.
- Uncertainty: Blocker: All prior PERFECT phases complete.
References:
- /PERFECT.md
Dependencies: T-121, T-122, T-123, T-124, T-125, T-126, T-127, T-128, T-129, T-130, T-131, T-132, T-133, T-134, T-135, T-136, T-137, T-138, T-139
Effort: L
---
### T-141: Final security scan gate (PERFECT P5-002)
Priority: P0
Type: SECURITY
Owner: AGENT
Status: BLOCKED
Blockers: All code changes complete
Context:
- PERFECT.md P5-002: run codeql_checker and resolve findings
Acceptance Criteria:
- [ ] T-141.1: Run codeql_checker and remediate findings
- [ ] T-141.2: Document security scan results
- [ ] T-141.3: Define scope and checklist for the audit targets.
- [ ] T-141.4: Record findings and create follow-up tasks for any issues.
Prompt Scaffold:
- Role: Security engineer.
- Goal: Complete T-141: Final security scan gate (PERFECT P5-002) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: PERFECT.md P5-002: run codeql_checker and resolve findings.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; Dependencies: T-123; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/PERFECT.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/PERFECT.md) and record task status if required.
- Uncertainty: Blocker: All code changes complete.
References:
- /PERFECT.md
Dependencies: T-123
Effort: M
---
### T-142: Performance validation gate (PERFECT P5-003)
Priority: P0
Type: QUALITY
Owner: AGENT
Status: BLOCKED
Blockers: All changes complete
Context:
- PERFECT.md P5-003: run Lighthouse audits and check Core Web Vitals
Acceptance Criteria:
- [ ] T-142.1: Run Lighthouse audits on key pages
- [ ] T-142.2: Document performance results
- [ ] T-142.3: Define scope and checklist for the audit targets.
- [ ] T-142.4: Record findings and create follow-up tasks for any issues.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-142: Performance validation gate (PERFECT P5-003) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: PERFECT.md P5-003: run Lighthouse audits and check Core Web Vitals.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; Dependencies: T-019; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/.lighthouserc.json, /scripts/lighthouse-audit.mjs, /PERFECT.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/.lighthouserc.json, /scripts/lighthouse-audit.mjs, /PERFECT.md) and record task status if required.
- Uncertainty: Blocker: All changes complete.
References:
- /.lighthouserc.json
- /scripts/lighthouse-audit.mjs
- /PERFECT.md
Dependencies: T-019
Effort: M
---
### T-143: Final validation gate (PERFECT P5-004)
Priority: P0
Type: QUALITY
Owner: AGENT
Status: BLOCKED
Blockers: All prior PERFECT gates complete
Context:
- PERFECT.md P5-004: ensure tests/lint/type-check/security/coverage pass
Acceptance Criteria:
- [ ] T-143.1: Verify tests, lint, type-check, build, and coverage targets
- [ ] T-143.2: Confirm documentation is complete
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-143: Final validation gate (PERFECT P5-004) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: PERFECT.md P5-004: ensure tests/lint/type-check/security/coverage pass.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; Dependencies: T-140, T-141, T-142; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/PERFECT.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/PERFECT.md) and record task status if required.
- Uncertainty: Blocker: All prior PERFECT gates complete.
References:
- /PERFECT.md
Dependencies: T-140, T-141, T-142
Effort: S
