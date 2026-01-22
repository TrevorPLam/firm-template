# P3TODO.md - Repository Task List

Document Type: Workflow
Last Updated: 2026-01-21
Task Truth Source: **P3TODO.md (P3)**
Other priorities: `P0TODO.md`, `P1TODO.md`, `P2TODO.md`.

This file is the single source of truth for P3 tasks. If another document disagrees, the task record in this file wins (unless the Constitution overrides).

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


## 🔵 PHASE 4: QUALITY & OPTIMIZATION (P3)
> Quality improvements and optimizations.
> These enhance the template but are not required for initial release.
### T-019: Performance baselines + budgets (Lighthouse)
Priority: P3
Type: QUALITY
Owner: AGENT
Status: BLOCKED
Blockers: Lighthouse CLI not installed (install globally or set `LIGHTHOUSE_BIN`).
Context:
- Diamond Standard requires strong Core Web Vitals
- Need baseline measurements before setting strict budgets
- Helps template users understand performance expectations
Acceptance Criteria:
- [ ] T-019.1: Document how to run Lighthouse audits
- [ ] T-019.2: Capture baseline metrics for key pages (home, services, pricing, contact)
- [ ] T-019.3: Define performance budgets as regression guards
- [ ] T-019.4: Document targets in /docs/OBSERVABILITY.md
- [ ] T-019.5: Add performance optimization tips to TEMPLATE_CUSTOMIZATION_GUIDE.md
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-019: Performance baselines + budgets (Lighthouse) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: Blocker: Lighthouse CLI not installed (install globally or set `LIGHTHOUSE_BIN`)..
References:
- /docs/OBSERVABILITY.md
- /.lighthouserc.json
- /package.json
Dependencies: None
Effort: M

---

### T-020: Monitor and fix transitive build-tool vulnerabilities
Priority: P3
Type: DEPENDENCY
Owner: AGENT
Status: BLOCKED
Blockers: Await upstream fixes in `@cloudflare/next-on-pages` or Cloudflare runtime updates.
Context:
- npm audit reports High/Moderate issues in transitive dependencies
- These are pulled in by `@cloudflare/next-on-pages`
- Currently on latest adapter version
- Not blocking template release but should be monitored
Acceptance Criteria:
- [x] T-020.1: Document known vulnerabilities in SECURITY.md
- [ ] T-020.2: Check for updates to `@cloudflare/next-on-pages` monthly
- [x] T-020.3: Document mitigation strategies for template users
- [ ] T-020.4: Set up Dependabot or similar for automated updates
Prompt Scaffold:
- Role: Dependency maintenance engineer.
- Goal: Complete T-020: Monitor and fix transitive build-tool vulnerabilities per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: Blocker: Await upstream fixes in `@cloudflare/next-on-pages` or Cloudflare runtime updates..
References:
- /package.json
- /SECURITY.md
Dependencies: None
Effort: S

---

### T-021: Accessibility validation and improvements
Priority: P3
Type: QUALITY
Owner: AGENT
Status: IN-REVIEW
Blockers: npm registry returns 403 for package downloads in this environment
Context:
- Template should meet WCAG 2.1 AA standards minimum
- Already has good accessibility features but needs comprehensive audit
- Should document accessibility features for users
Acceptance Criteria:
- [ ] T-021.1: Run automated accessibility tests (axe-core, pa11y, etc.)
- [ ] T-021.2: Keyboard navigation testing on all pages
- [ ] T-021.3: Screen reader testing (major pages)
- [x] T-021.4: Document accessibility features in README.md:
  - Keyboard navigation support
  - ARIA labels
  - Focus management
  - Color contrast
  - Semantic HTML
- [x] T-021.5: Create /docs/ACCESSIBILITY.md with:
  - Current compliance level
  - Known issues (if any)
  - Testing methodology
  - Recommendations for maintaining accessibility
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-021: Accessibility validation and improvements per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: Blocker: npm registry returns 403 for package downloads in this environment.
References:
- /docs/ACCESSIBILITY.md
- /README.md
- All components
Dependencies: None
Effort: M

---

### T-025: Create interactive CLI setup wizard
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Currently users must manually edit .env and files
- Interactive CLI would make setup faster and less error-prone
- Ask questions and generate config automatically
- Similar to "create-next-app" experience
Acceptance Criteria:
- [ ] T-025.1: Create /scripts/setup.js with inquirer.js
- [ ] T-025.2: CLI should ask for:
  - Firm name and tagline
  - Industry/vertical (law, consulting, accounting, design, other)
  - Contact information
  - Whether to enable optional features (analytics, email, etc.)
- [ ] T-025.3: Generate .env.local from answers
- [ ] T-025.4: Optionally customize:
  - Hero messaging based on vertical
  - Service names based on vertical
  - Color scheme (basic preset options)
- [ ] T-025.5: Add npm script: npm run setup
- [ ] T-025.6: Document in README.md Quick Start section
- [ ] T-025.7: Test wizard end-to-end
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-025: Create interactive CLI setup wizard per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /scripts/setup.js (new)
- /package.json
- /README.md
Dependencies: T-010, T-011
Effort: L

---

### T-028: Configure automated dependency updates
Priority: P3
Type: INFRASTRUCTURE
Owner: AGENT
Status: IN-REVIEW
Blockers: Manual Dependabot trigger requires repo-owner access
Context:
- Dependencies should be kept up-to-date automatically
- Dependabot or Renovate Bot can automate this
- Reduces maintenance burden for template users
Acceptance Criteria:
- [x] T-028.1: Create .github/dependabot.yml configuration:
  - Check npm dependencies weekly
  - Group minor/patch updates
  - Separate major updates
  - Auto-merge patch updates (if tests pass)
- [x] T-028.2: Document Dependabot in TEMPLATE_CUSTOMIZATION_GUIDE.md
- [x] T-028.3: Add instructions for disabling if desired
- [ ] T-028.4: Test by manually triggering Dependabot (requires repo-owner access)
- [x] T-028.5: Update SECURITY.md with dependency update policy
Prompt Scaffold:
- Role: Platform engineer.
- Goal: Complete T-028: Configure automated dependency updates per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: Blocker: Manual Dependabot trigger requires repo-owner access.
References:
- /.github/dependabot.yml (new)
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
- /SECURITY.md
Dependencies: None
Effort: XS

---

### T-029: Add component showcase (Storybook)
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Template has 20+ reusable components
- No visual catalog or documentation for components
- Storybook would help users understand component API
- Useful for development and testing
Acceptance Criteria:
- [ ] T-029.1: Install Storybook for Next.js
- [ ] T-029.2: Create stories for UI components:
  - Button, Card, Input, Textarea, Select
  - Accordion, Container, Section
- [ ] T-029.3: Create stories for feature components:
  - Hero, ValueProps, CTASection
  - ContactForm, SearchDialog
- [ ] T-029.4: Add Storybook npm scripts:
  - npm run storybook (dev)
  - npm run build-storybook (production)
- [ ] T-029.5: Document Storybook in TEMPLATE_CUSTOMIZATION_GUIDE.md
- [ ] T-029.6: Optional: Deploy Storybook to GitHub Pages
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-029: Add component showcase (Storybook) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /.storybook/ (new)
- /components/**/*.stories.tsx (new)
- /package.json
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: None
Effort: M

---

### T-038: Build Interactive ROI Calculator
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Unique differentiator (only 23% of sites have this)
- High engagement (2-3x time on page)
- Generates qualified leads
- Industry-specific tool adds value
- Identified in docs/ARCHIVE/2026/PLATINUM_STANDARD_ANALYSIS.md
Acceptance Criteria:
- [ ] T-038.1: Create ROICalculator component framework
  - Form inputs for key variables
  - Real-time calculation
  - Visual results display (charts/graphs)
  - Export/email results option
- [ ] T-038.2: Create generic calculator template:
  - Cost savings calculator
  - ROI timeline calculator
  - Investment return calculator
- [ ] T-038.3: Create industry-specific examples:
  - Law firm: "Settlement Value Calculator"
  - Consulting: "Project Cost Estimator"
  - Accounting: "Tax Savings Calculator"
- [ ] T-038.4: Add calculator page: /app/calculator/page.tsx
- [ ] T-038.5: Integrate lead capture (email to get results)
- [ ] T-038.6: Document calculator customization
- [ ] T-038.7: Add to vertical examples
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-038: Build Interactive ROI Calculator per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /app/calculator/page.tsx (new)
- /components/ROICalculator.tsx (new)
- /lib/calculator.ts (new)
- /docs/examples/ (add to vertical examples)
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: T-010, T-011
Effort: L

---

### T-154: Integrate Video Testimonials on Homepage
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Video testimonials improve credibility for trust-first firms
- Component exists but is not surfaced in the homepage experience
Acceptance Criteria:
- [ ] T-154.1: Add `VideoTestimonial` to homepage or case studies page
- [ ] T-154.2: Provide placeholder testimonial data for the component
- [ ] T-154.3: Document usage in `docs/TEMPLATE_CUSTOMIZATION_GUIDE.md`
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-154: Integrate Video Testimonials on Homepage per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /components/VideoTestimonial.tsx
- /app/page.tsx
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: T-035
Effort: XS

---

### T-073: Remove unused Tailwind classes (Phase 3 low)
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Phase 3 low: unused Tailwind classes in config
Acceptance Criteria:
- [ ] T-073.1: Remove unused classes from Tailwind config
- [ ] T-073.2: Verify styles unchanged via lint/build
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-073: Remove unused Tailwind classes (Phase 3 low) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /tailwind.config.ts
- /WRONG.md
Dependencies: None
Effort: XS

---

### T-074: Remove unused env vars from .env.example (Phase 3 low)
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Phase 3 low: .env.example lists unused variables
Acceptance Criteria:
- [ ] T-074.1: Remove unused env vars or wire them into code
- [ ] T-074.2: Keep .env.example aligned with `lib/env.ts` and `lib/env.public.ts`
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-074: Remove unused env vars from .env.example (Phase 3 low) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /.env.example
- /lib/env.ts
- /lib/env.public.ts
- /WRONG.md
Dependencies: None
Effort: XS

---

### T-083: Remove console.log statements in production code (Phase 2 low)
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: console.log statements should use logger
Acceptance Criteria:
- [ ] T-083.1: Replace console.log with logger helpers
- [ ] T-083.2: Ensure no console output in production paths
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-083: Remove console.log statements in production code (Phase 2 low) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/logger.ts
- /WRONG.md
Dependencies: None
Effort: XS

---

### T-084: Remove commented-out code blocks (Phase 2 low)
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: commented-out code in components/ should be removed
Acceptance Criteria:
- [ ] T-084.1: Remove commented-out blocks or convert to TODOs
- [ ] T-084.2: Confirm no behavior changes
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-084: Remove commented-out code blocks (Phase 2 low) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /components/
- /WRONG.md
Dependencies: None
Effort: XS

---

### T-109: Recalculate TODO effort estimate after audit tasks
Priority: P3
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- Estimated total effort is now **UNKNOWN** after adding audit remediation tasks
Acceptance Criteria:
- [ ] T-109.1: Recalculate total effort based on task list
- [ ] T-109.2: Update TODO summary estimate with a validated range
Prompt Scaffold:
- Role: Documentation specialist.
- Goal: Complete T-109: Recalculate TODO effort estimate after audit tasks per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md
Dependencies: None
Effort: XS

---
### T-118: Add performance/load testing baseline (Phase 9)
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Phase 9: no performance or load tests
Acceptance Criteria:
- [ ] T-118.1: Define minimal load test plan for contact + search flows
- [ ] T-118.2: Document how to run performance tests
- [ ] T-118.3: Identify target scenarios and fixtures for coverage.
- [ ] T-118.4: Implement tests and wire them into existing scripts.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-118: Add performance/load testing baseline (Phase 9) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /docs/TESTING_STRATEGY.md
- /WRONG.md
Dependencies: None
Effort: M

---

### T-120: Generate API documentation for public modules (Doc debt)
Priority: P3
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Phase 5: API documentation could be generated
Acceptance Criteria:
- [ ] T-120.1: Define API doc generation approach (TypeDoc or manual)
- [ ] T-120.2: Produce initial API docs for public modules
- [ ] T-120.3: Define scope and affected files before changes.
- [ ] T-120.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Documentation specialist.
- Goal: Complete T-120: Generate API documentation for public modules (Doc debt) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /docs/
- /lib/
- /WRONG.md
Dependencies: None
Effort: M

---

### T-211: Review docs for inline TODO/checklist leakage (Doc hygiene sweep)
Priority: P3
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- Documentation contains checklists and TODO-style items that may be actionable tasks
- Governance rules require executable tasks to live in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md
- Recent audits note historical task leakage in docs that should be reconciled
Acceptance Criteria:
- [ ] T-211.1: Review the following docs for actionable TODOs or open checklists and note items that should become tasks:
  - /docs/ops/IMPROVEMENTS-SUMMARY.md
  - /docs/ops/SMOKE_TEST.md
  - /docs/LAUNCH-SMOKE-TEST.md
  - /docs/ROLLBACK.md
  - /docs/SENTRY-SETUP.md
  - /docs/SUPABASE_SETUP.md
  - /docs/HUBSPOT_SETUP.md
  - /docs/SECURITY-CSP-ANALYTICS.md
  - /docs/TEMPLATE_RELEASE_CHECKLIST.md
  - /docs/PRIVACY_POLICY_TEMPLATE.md
- [ ] T-211.2: For any actionable items, create or update tasks in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md with file paths and acceptance criteria.
- [ ] T-211.3: Replace executable directives in docs with “Tracked in TODO: T-###” where appropriate, preserving context.
Prompt Scaffold:
- Role: Documentation specialist.
- Goal: Complete T-211: Review docs for inline TODO/checklist leakage per Acceptance Criteria.
- Non-Goals: Do not rewrite operational runbook checklists unless they are truly project tasks; avoid changing product behavior.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for the list of docs to review.
- Validation: Confirm tasks are created/updated and docs point to T-### entries.
- Output Format: Update referenced docs and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md.
- Uncertainty: If a checklist item is ambiguous, mark **UNKNOWN** and add a question in the task context.
References:
- /DOCSAUDIT.md
- /docs/DOCS_INDEX.md
- /docs/ops/IMPROVEMENTS-SUMMARY.md
- /docs/ops/SMOKE_TEST.md
- /docs/LAUNCH-SMOKE-TEST.md
- /docs/ROLLBACK.md
- /docs/SENTRY-SETUP.md
- /docs/SUPABASE_SETUP.md
- /docs/HUBSPOT_SETUP.md
- /docs/SECURITY-CSP-ANALYTICS.md
- /docs/TEMPLATE_RELEASE_CHECKLIST.md
- /docs/PRIVACY_POLICY_TEMPLATE.md
Dependencies: None
Effort: S
