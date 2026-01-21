# TODO.md — Repository Task List

Document Type: Workflow
Last Updated: 2026-01-21
Task Truth Source: **TODO.md**

This file is the single source of truth for actionable work. If another document disagrees, the task record in this file wins (unless the Constitution overrides).

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
Use this scaffold inside each task so agents can work from `TODO.md` without a custom prompt.

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

## 🔴 PHASE 1: TEMPLATE SANITIZATION (P0)
> **CRITICAL PRIORITY**: These tasks convert the marketing firm into a generic template.
> All marketing-specific content must be replaced with configurable placeholders.
> **DO NOT PROCEED** to other phases until sanitization is complete.

Phase 1 tasks are complete and archived in `TODOCOMPLETED.md`.

## 🟠 PHASE 2: TEMPLATE DOCUMENTATION (P1)
> Create comprehensive documentation for template users.
> These tasks help users customize the template for their specific needs.

### T-013: Create template release checklist
Priority: P1
Type: DOCS
Owner: AGENT
Status: IN-REVIEW
Blockers: Requires repo-owner access for GitHub settings and release creation
Context:
- Need final verification before template can be released for public use
- Ensures no marketing-specific content slipped through
- Provides confidence for first users
Acceptance Criteria:
- [x] T-013.1: Create /docs/TEMPLATE_RELEASE_CHECKLIST.md with sections:
  - Pre-Release Verification:
    * All branding placeholders are in place
    * No "Your Dedicated Marketer" references remain (except in history/changelog)
    * All services are generic
    * All blog posts are generic examples
    * Documentation is complete and accurate
    * Customization guides exist and are comprehensive
  - Technical Verification:
    * Build succeeds: `npm run build`
    * Tests pass: `npm run test`
    * Type checking passes: `npm run type-check`
    * Linting passes: `npm run lint`
    * No broken links
    * All pages render correctly
    * All interactive features work
  - Content Verification:
    * All images are generic or placeholder
    * All metadata is generic
    * All structured data uses placeholders
    * Environment variables are documented
  - Release Preparation:
    * Repository description updated
    * Topics/tags appropriate for template
    * LICENSE file appropriate
    * Security policy in place
    * Contributing guidelines (if accepting contributions)
- [x] T-013.2: Run comprehensive grep search for remaining marketing-specific terms:
  - "marketing" (should only appear in generic contexts or as example)
  - "marketer"
  - "dedicated marketer"
  - "YD Marketer"
  - "YD Firms"
- [x] T-013.3: Review package.json for any marketing-specific metadata
- [ ] T-013.4: Review git repository settings (description, topics, etc.)
- [ ] T-013.5: Create GitHub release with template v1.0.0:
  - Release notes explaining template purpose
  - Link to customization guide
  - Quick start instructions
  - Known limitations or considerations
- [x] T-013.6: Add template badge/shield to README
Prompt Scaffold:
- Role: Documentation specialist.
- Goal: Complete T-013: Create template release checklist per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: Need final verification before template can be released for public use; Ensures no marketing-specific content slipped through.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; Dependencies: T-008, T-009, T-010, T-011, T-012; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/docs/TEMPLATE_RELEASE_CHECKLIST.md (new)).
- Validation: Run and/or verify: npm run build, npm run lint, npm run test, npm run type-check; satisfy all checklist items.
- Output Format: Update referenced files (/docs/TEMPLATE_RELEASE_CHECKLIST.md (new)) and record task status if required.
- Uncertainty: Blocker: Requires repo-owner access for GitHub settings and release creation.
References:
- /docs/TEMPLATE_RELEASE_CHECKLIST.md (new)
- Repository-wide
- GitHub repository settings
Dependencies: T-008, T-009, T-010, T-011, T-012
Effort: M
---

## 🟡 PHASE 3: INFRASTRUCTURE & DEPLOYMENT (P2)
> Infrastructure tasks that support template deployment and operation.
> Can be done after template release but improve the deployment experience.

### T-014: Configure Cloudflare Pages deployment
Priority: P2
Type: INFRASTRUCTURE
Owner: Trevor
Status: READY
Blockers: None
Context:
- Cloudflare Pages configuration complete, needs dashboard setup
- wrangler.toml and deployment docs created
- Build scripts already exist in package.json
- This is environment-specific and will need to be done by each template user
Acceptance Criteria:
- [ ] T-014.1: Document Cloudflare Pages setup in TEMPLATE_CUSTOMIZATION_GUIDE.md
- [ ] T-014.2: Provide step-by-step instructions:
  - Log in to Cloudflare Dashboard and create Pages project
  - Connect GitHub repository
  - Configure build settings (command: npm run pages:build, output: .vercel/output/static)
  - Set NODE_VERSION=20 and CLOUDFLARE_BUILD=true in environment variables
  - Add required secrets (UPSTASH_REDIS_REST_TOKEN, SENTRY_AUTH_TOKEN, etc.)
  - Add required environment variables (UPSTASH_REDIS_REST_URL, SENTRY_DSN, etc.)
  - Trigger first deployment and verify build succeeds
  - Configure custom domain if applicable
- [ ] T-014.3: Create deployment troubleshooting section
- [ ] T-014.4: Define scope and affected files before changes.
Prompt Scaffold:
- Role: Platform engineer.
- Goal: Complete T-014: Configure Cloudflare Pages deployment per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /docs/CLOUDFLARE_DEPLOYMENT.md
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
- /wrangler.toml
- /.dev.vars.example
Dependencies: T-013
Effort: M

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
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: Blocker: npm registry returns 403 for package downloads in this environment.
References:
- /docs/ACCESSIBILITY.md
- /README.md
- All components
Dependencies: None
Effort: M

---

### T-146: Validate structured data with Rich Results Test
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Structured data updates were made but external validation was not run
- Rich Results Test is required to confirm schema correctness
- Ensures template users start with verified SEO metadata
Acceptance Criteria:
- [ ] T-146.1: Run Rich Results Test on a blog post page (Article schema)
- [ ] T-146.2: Run Rich Results Test on a service page (Service schema)
- [ ] T-146.3: Run Rich Results Test on a page with breadcrumbs
- [ ] T-146.4: Record results and issues in /docs/SEO_VALIDATION.md
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-146: Validate structured data with Rich Results Test per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /app/blog/
- /app/services/
- /components/Breadcrumbs.tsx
- /docs/OBSERVABILITY.md
Dependencies: None
Effort: M

---

### T-147: Document audit tooling prerequisites
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit tasks are blocked without Lighthouse/axe/pa11y setup
- Contributors need a single source of truth for tooling installs
- Reduces friction for quality and accessibility audits
Acceptance Criteria:
- [ ] T-147.1: Document required tooling installs and versions
- [ ] T-147.2: Add environment variable examples (e.g., LIGHTHOUSE_BIN)
- [ ] T-147.3: Note OS-specific install tips and common failures
- [ ] T-147.4: Cross-link from testing docs and runbooks
Prompt Scaffold:
- Role: Documentation specialist.
- Goal: Complete T-147: Document audit tooling prerequisites per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /docs/TESTING_STRATEGY.md
- /docs/CONTRIBUTING.md
- /docs/OBSERVABILITY.md
Dependencies: None
Effort: M

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

### T-023: Migrate from @cloudflare/next-on-pages to OpenNext
Priority: P2
Type: INFRASTRUCTURE
Owner: AGENT
Status: READY
Blockers: None
Context:
- @cloudflare/next-on-pages is deprecated (npm shows deprecation warning)
- Recommended migration path is OpenNext: https://opennext.js.org/cloudflare
- Will resolve critical npm vulnerability
- Current adapter still works but won't receive updates
- Identified in WRONG.md Dep1.1
Acceptance Criteria:
- [ ] T-023.1: Research OpenNext adapter for Cloudflare
- [ ] T-023.2: Install OpenNext dependencies
- [ ] T-023.3: Update build configuration (package.json scripts)
- [ ] T-023.4: Update deployment documentation
- [ ] T-023.5: Test local build: npm run pages:build
- [ ] T-023.6: Test local preview: npm run pages:preview
- [ ] T-023.7: Verify all pages work correctly
- [ ] T-023.8: Update wrangler.toml if needed
- [ ] T-023.9: Document migration in CHANGELOG.md
Prompt Scaffold:
- Role: Platform engineer.
- Goal: Complete T-023: Migrate from @cloudflare/next-on-pages to OpenNext per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /package.json
- /wrangler.toml
- /docs/CLOUDFLARE_DEPLOYMENT.md
- https://opennext.js.org/cloudflare
Dependencies: T-022
Effort: M

---

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
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /.storybook/ (new)
- /components/**/*.stories.tsx (new)
- /package.json
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: None
Effort: M

---

### T-030: Implement AI Chatbot Integration
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- 67% of B2B professional services sites have AI chat in 2026
- Increases lead capture by 15-30% according to industry data
- Provides 24/7 instant engagement
- Qualifies leads automatically
- Critical differentiator for modern professional services
- Identified in docs/ARCHIVE/2026/PLATINUM_STANDARD_ANALYSIS.md
Acceptance Criteria:
- [ ] T-030.1: Research and select chatbot provider (Intercom, Drift, Tidio, or custom)
- [ ] T-030.2: Create chatbot component wrapper for React integration
- [ ] T-030.3: Design conversation flows for common inquiries:
  - Service information requests
  - Pricing questions
  - Appointment scheduling
  - Contact information collection
- [ ] T-030.4: Integrate with contact form/CRM pipeline
- [ ] T-030.5: Add chatbot to all public pages (configurable)
- [ ] T-030.6: Document configuration in TEMPLATE_CUSTOMIZATION_GUIDE.md
- [ ] T-030.7: Add environment variables for API keys
- [ ] T-030.8: Test conversation flows and lead capture
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-030: Implement AI Chatbot Integration per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: 67% of B2B professional services sites have AI chat in 2026; Increases lead capture by 15-30% according to industry data.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; Dependencies: T-010; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/components/Chatbot.tsx (new), /lib/chatbot.ts (new), /lib/env.ts).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/components/Chatbot.tsx (new), /lib/chatbot.ts (new), /lib/env.ts) and record task status if required.
- Uncertainty: None.
References:
- /components/Chatbot.tsx (new)
- /lib/chatbot.ts (new)
- /lib/env.ts
- /.env.example
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: T-010
Effort: M
---

### T-031: Add Client Logo Showcase & Trust Badge Component
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Social proof increases conversion by 25% on average
- Client logos are standard on 82% of professional services sites
- Builds immediate credibility and trust
- WebAward criterion: demonstrate authority and expertise
- Identified in docs/ARCHIVE/2026/PLATINUM_STANDARD_ANALYSIS.md
Acceptance Criteria:
- [ ] T-031.1: Create ClientLogoShowcase component
  - Configurable logo grid (3-4 columns, responsive)
  - Grayscale filter with color on hover
  - Lazy loading for images
- [ ] T-031.2: Create TrustBadge component for certifications/awards
  - Displays badges with tooltips
  - Configurable positioning
- [ ] T-031.3: Add placeholder logos to /public/clients/
- [ ] T-031.4: Integrate on homepage below hero section
- [ ] T-031.5: Document logo requirements (size, format) in customization guide
- [ ] T-031.6: Add to vertical examples (law firm shows bar association, etc.)
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-031: Add Client Logo Showcase & Trust Badge Component per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: Social proof increases conversion by 25% on average; Client logos are standard on 82% of professional services sites.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; Dependencies: T-010, T-011; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/components/ClientLogoShowcase.tsx (new), /components/TrustBadge.tsx (new), /public/clients/ (new directory)).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/components/ClientLogoShowcase.tsx (new), /components/TrustBadge.tsx (new), /public/clients/ (new directory)) and record task status if required.
- Uncertainty: None.
References:
- /components/ClientLogoShowcase.tsx (new)
- /components/TrustBadge.tsx (new)
- /public/clients/ (new directory)
- /app/page.tsx
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: T-010, T-011
Effort: S
---

---

### T-033: Add A/B Testing Framework
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Enables continuous optimization (2-5% monthly improvement)
- Standard on 58% of high-performing marketing sites
- Data-driven decision making
- WebAward criterion: innovation and optimization
- Identified in docs/ARCHIVE/2026/PLATINUM_STANDARD_ANALYSIS.md
Acceptance Criteria:
- [ ] T-033.1: Research and select A/B testing solution:
  - Vercel Analytics (if deploying to Vercel)
  - PostHog (open source, privacy-friendly)
  - Google Optimize alternative
- [ ] T-033.2: Create A/B test wrapper component
- [ ] T-033.3: Document how to run experiments:
  - Hero headline variants
  - CTA button text/color
  - Pricing display options
  - Form field variations
- [ ] T-033.4: Add example A/B tests to demonstrate:
  - Homepage hero test
  - Contact form variation
- [ ] T-033.5: Integrate with analytics pipeline
- [ ] T-033.6: Document in TEMPLATE_CUSTOMIZATION_GUIDE.md
- [ ] T-033.7: Add to OBSERVABILITY.md for monitoring
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-033: Add A/B Testing Framework per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: Enables continuous optimization (2-5% monthly improvement); Standard on 58% of high-performing marketing sites.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; Dependencies: T-010; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/components/ABTest.tsx (new), /lib/analytics.ts, /lib/abtest.ts (new)).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/components/ABTest.tsx (new), /lib/analytics.ts, /lib/abtest.ts (new)) and record task status if required.
- Uncertainty: None.
References:
- /components/ABTest.tsx (new)
- /lib/analytics.ts
- /lib/abtest.ts (new)
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
- /docs/OBSERVABILITY.md
Dependencies: T-010
Effort: M
---

### T-034: Create Resource Library with Lead Magnets
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Gated content generates 20% more leads than contact forms alone
- 78% of professional services firms offer downloadable resources
- Builds email list for nurture campaigns
- Demonstrates expertise and thought leadership
- Identified in docs/ARCHIVE/2026/PLATINUM_STANDARD_ANALYSIS.md
Acceptance Criteria:
- [ ] T-034.1: Create /app/resources/page.tsx - library listing
- [ ] T-034.2: Create resource download component with email gate
- [ ] T-034.3: Add resource categories:
  - Guides & eBooks
  - Templates & Checklists
  - Case Studies
  - Whitepapers
- [ ] T-034.4: Create 3 example resources (PDF placeholders):
  - "Industry Guide 2026"
  - "Service Selection Checklist"
  - "ROI Calculation Template"
- [ ] T-034.5: Integrate download tracking with CRM
- [ ] T-034.6: Add resource CTAs throughout site
- [ ] T-034.7: Document resource creation process in docs
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-034: Create Resource Library with Lead Magnets per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /app/resources/page.tsx (new)
- /app/resources/[slug]/page.tsx (new)
- /components/ResourceDownload.tsx (new)
- /public/resources/ (new directory)
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: T-010, T-024
Effort: M

---

### T-035: Add Video Content Support
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Video increases engagement by 35% according to marketing research
- 89% of professional services sites use video content
- Trust-building through visual storytelling
- Supports testimonials, case studies, team introductions
- Identified in docs/ARCHIVE/2026/PLATINUM_STANDARD_ANALYSIS.md
Acceptance Criteria:
- [ ] T-035.1: Create VideoPlayer component
  - Support YouTube embed
  - Support Vimeo embed
  - Support direct video file (with native HTML5 player)
  - Responsive sizing
  - Lazy loading
- [ ] T-035.2: Create VideoTestimonial component
  - Grid layout for multiple testimonials
  - Play on hover option
  - Full-screen mode
- [ ] T-035.3: Add video support to blog posts (MDX)
- [ ] T-035.4: Create example video embeds:
  - Hero section video option
  - About page team video
  - Service explainer video
- [ ] T-035.5: Document video hosting options and setup
- [ ] T-035.6: Add to vertical examples
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-035: Add Video Content Support per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /components/VideoPlayer.tsx (new)
- /components/VideoTestimonial.tsx (new)
- /components/Hero.tsx (update for video option)
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: T-010, T-011
Effort: S

---

### T-036: Implement Exit-Intent Popup System
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Recovers 10-15% of abandoning visitors
- Standard on 61% of lead-generation sites
- Non-intrusive when implemented correctly
- Provides last-chance conversion opportunity
- Identified in docs/ARCHIVE/2026/PLATINUM_STANDARD_ANALYSIS.md
Acceptance Criteria:
- [ ] T-036.1: Create ExitIntentPopup component
  - Detect mouse leaving viewport
  - Show once per session (cookie/localStorage)
  - Responsive design
  - Easy dismiss
- [ ] T-036.2: Create popup content variants:
  - Newsletter signup offer
  - Resource download offer
  - Consultation booking offer
  - Contact form simplified
- [ ] T-036.3: Add configuration options:
  - Delay before showing (e.g., 5 seconds on page)
  - Pages to show/hide
  - Popup frequency (once per session/day/week)
- [ ] T-036.4: Integrate with analytics to track effectiveness
- [ ] T-036.5: Document configuration in customization guide
- [ ] T-036.6: Test on mobile (disable or adapt)
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-036: Implement Exit-Intent Popup System per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /components/ExitIntentPopup.tsx (new)
- /lib/exit-intent.ts (new)
- /app/layout.tsx (add popup)
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: T-010
Effort: M

---

### T-037: Create Team Member Profiles Section
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Humanizes the firm and builds trust
- 91% of professional services sites have team pages
- Critical for relationship-based businesses
- WebAward criterion: demonstrate expertise
- Identified in docs/ARCHIVE/2026/PLATINUM_STANDARD_ANALYSIS.md
Acceptance Criteria:
- [ ] T-037.1: Create /app/team/page.tsx - team listing
- [ ] T-037.2: Create /app/team/[slug]/page.tsx - individual profiles
- [ ] T-037.3: Create TeamMember component for grid display
  - Photo (with hover effect)
  - Name and title
  - Brief bio
  - Credentials/certifications
  - Social links (LinkedIn, etc.)
- [ ] T-037.4: Create team member content schema:
  - MDX files in /content/team/
  - Frontmatter: name, title, photo, bio, credentials, social
- [ ] T-037.5: Add 3-4 example team members (placeholders)
- [ ] T-037.6: Link team page from navigation
- [ ] T-037.7: Add team section to homepage
- [ ] T-037.8: Document in customization guide
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-037: Create Team Member Profiles Section per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /app/team/page.tsx (new)
- /app/team/[slug]/page.tsx (new)
- /components/TeamMember.tsx (new)
- /content/team/ (new directory)
- /lib/team.ts (new - similar to blog.ts)
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: T-010, T-011
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
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
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

### T-039: Add Newsletter Popup & Lead Magnet Incentive
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Increases newsletter signups by 50% vs footer form alone
- Standard on 68% of professional services sites
- Builds marketing email list
- Can offer lead magnet incentive
- Identified in docs/ARCHIVE/2026/PLATINUM_STANDARD_ANALYSIS.md
Acceptance Criteria:
- [ ] T-039.1: Create NewsletterPopup component
  - Timed trigger (e.g., after 30 seconds)
  - Scroll trigger option (e.g., 50% page scroll)
  - Exit-intent trigger option
  - Mobile-friendly design
- [ ] T-039.2: Add incentive options:
  - "Get our weekly industry insights"
  - "Download our free guide"
  - "Join 1,000+ professionals"
- [ ] T-039.3: Integrate with email service (from T-024)
- [ ] T-039.4: Add configuration:
  - Show frequency (once per session/week)
  - Delay timing
  - Pages to show/hide
- [ ] T-039.5: A/B test different incentive messages
- [ ] T-039.6: Track conversion rate in analytics
- [ ] T-039.7: Document in customization guide
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-039: Add Newsletter Popup & Lead Magnet Incentive per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /components/NewsletterPopup.tsx (new)
- /lib/newsletter.ts (new)
- /app/layout.tsx (add popup)
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: T-010, T-024
Effort: S

---

### T-149: Add Case Studies Library (Trust & Outcomes)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Trust-based firms rely on outcomes and proof to win consultations
- Case studies provide structured credibility beyond testimonials
- Supports SEO with long-form, outcome-focused content
Acceptance Criteria:
- [ ] T-149.1: Create `/app/case-studies/page.tsx` listing page
- [ ] T-149.2: Create `/app/case-studies/[slug]/page.tsx` detail page
- [ ] T-149.3: Add `components/CaseStudyCard.tsx` and `components/CaseStudyDetail.tsx`
- [ ] T-149.4: Add MDX content source in `/content/case-studies/` with 2-3 placeholders
- [ ] T-149.5: Create `lib/case-studies.ts` loader (patterned after `lib/blog.ts`)
- [ ] T-149.6: Add Case Study structured data (Article or CreativeWork schema)
- [ ] T-149.7: Add routes to `app/sitemap.ts` and `lib/search.ts`
- [ ] T-149.8: Document customization steps in `docs/TEMPLATE_CUSTOMIZATION_GUIDE.md`
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-149: Add Case Studies Library (Trust & Outcomes) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /app/case-studies/page.tsx (new)
- /app/case-studies/[slug]/page.tsx (new)
- /components/CaseStudyCard.tsx (new)
- /components/CaseStudyDetail.tsx (new)
- /content/case-studies/ (new directory)
- /lib/case-studies.ts (new)
- /app/sitemap.ts
- /lib/search.ts
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: None
Effort: M

---

### T-150: Add FAQ / Knowledge Base Hub
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Professional services sites benefit from a centralized FAQ hub
- Reduces consultation friction and supports SEO
- Complements service-level FAQ schema
Acceptance Criteria:
- [ ] T-150.1: Create `/app/faq/page.tsx` with searchable FAQ sections
- [ ] T-150.2: Add `components/FAQSection.tsx` for reusable FAQ blocks
- [ ] T-150.3: Create data source in `/content/faq/` or `lib/faq.ts`
- [ ] T-150.4: Add FAQPage structured data for the hub
- [ ] T-150.5: Add route to `app/sitemap.ts` and `lib/search.ts`
- [ ] T-150.6: Optionally add FAQ link to Navigation (documented)
- [ ] T-150.7: Document customization steps in `docs/TEMPLATE_CUSTOMIZATION_GUIDE.md`
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-150: Add FAQ / Knowledge Base Hub per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /app/faq/page.tsx (new)
- /components/FAQSection.tsx (new)
- /content/faq/ (new directory)
- /lib/faq.ts (new)
- /app/sitemap.ts
- /lib/search.ts
- /components/Navigation.tsx
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: None
Effort: M

---

### T-151: Add Multi-Step / Conditional Intake Form
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Trust-based firms often need more qualification than a single-step form
- Multi-step intake improves completion rates for longer forms
- Conditional fields improve relevance per service type
Acceptance Criteria:
- [ ] T-151.1: Add multi-step flow and progress UI to `components/ContactForm.tsx`
- [ ] T-151.2: Add conditional fields (service type, budget, timeline) in schema
- [ ] T-151.3: Update `lib/contact-form-schema.ts` and server action handling
- [ ] T-151.4: Update tests in `__tests__/components/ContactForm.test.tsx`
- [ ] T-151.5: Document new fields and behavior in `docs/TEMPLATE_CUSTOMIZATION_GUIDE.md`
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-151: Add Multi-Step / Conditional Intake Form per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /components/ContactForm.tsx
- /lib/contact-form-schema.ts
- /lib/actions.ts
- /__tests__/components/ContactForm.test.tsx
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: None
Effort: M

---

### T-152: Wire Analytics for CTAs and Form Submissions
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Analytics helpers exist but are not wired into conversion points
- CTA and form tracking are required for optimization
- Supports trust-based firms tracking consultation conversions
Acceptance Criteria:
- [ ] T-152.1: Call `trackFormSubmission` on contact form success/failure
- [ ] T-152.2: Call `trackCTAClick` on primary CTA buttons (Hero, CTASection, FinalCTA)
- [ ] T-152.3: Track scheduling CTA usage in `AppointmentScheduler`
- [ ] T-152.4: Track exit-intent primary action in `ExitIntentPopup`
- [ ] T-152.5: Update `docs/OBSERVABILITY.md` with event wiring guidance
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-152: Wire Analytics for CTAs and Form Submissions per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: Analytics helpers exist but are not wired into conversion points; CTA and form tracking are required for optimization.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; Dependencies: T-059; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/components/ContactForm.tsx, /components/Hero.tsx, /components/CTASection.tsx).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/components/ContactForm.tsx, /components/Hero.tsx, /components/CTASection.tsx) and record task status if required.
- Uncertainty: None.
References:
- /components/ContactForm.tsx
- /components/Hero.tsx
- /components/CTASection.tsx
- /components/FinalCTA.tsx
- /components/AppointmentScheduler.tsx
- /components/ExitIntentPopup.tsx
- /lib/analytics.ts
- /docs/OBSERVABILITY.md
Dependencies: T-059
Effort: S
---

### T-153: Add Local SEO / Location Support (Optional)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Many law/accounting firms serve specific regions and need local SEO
- Location pages build trust and improve search visibility
- Supports LocalBusiness schema for search engines
Acceptance Criteria:
- [ ] T-153.1: Create `/app/locations/page.tsx` with office listings
- [ ] T-153.2: Create `/app/locations/[slug]/page.tsx` with map + contact details
- [ ] T-153.3: Add location data source in `/content/locations/` or `lib/locations.ts`
- [ ] T-153.4: Update LocalBusiness structured data in `app/layout.tsx` to use env values
- [ ] T-153.5: Add required env vars to `.env.example` and `lib/env.public.ts`
- [ ] T-153.6: Add routes to `app/sitemap.ts` and `lib/search.ts`
- [ ] T-153.7: Document setup in `docs/TEMPLATE_CUSTOMIZATION_GUIDE.md`
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-153: Add Local SEO / Location Support (Optional) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /app/locations/page.tsx (new)
- /app/locations/[slug]/page.tsx (new)
- /content/locations/ (new directory)
- /lib/locations.ts (new)
- /app/layout.tsx
- /.env.example
- /lib/env.public.ts
- /app/sitemap.ts
- /lib/search.ts
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: T-075, T-088
Effort: M

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
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /components/VideoTestimonial.tsx
- /app/page.tsx
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: T-035
Effort: XS

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

### T-041: Guard root layout search index build (WRONG #014)
Priority: P0
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md #014: unhandled error from `getSearchIndex()` can crash entire app
Acceptance Criteria:
- [ ] T-041.1: Add try/catch fallback around `getSearchIndex()` in `app/layout.tsx`
- [ ] T-041.2: Log error via logger and keep navigation functional with empty items
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-041: Guard root layout search index build (WRONG #014) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md #014: unhandled error from `getSearchIndex()` can crash entire app.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/app/layout.tsx, /lib/search.ts, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/app/layout.tsx, /lib/search.ts, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /app/layout.tsx
- /lib/search.ts
- /WRONG.md
Dependencies: None
Effort: XS
---

### T-042: Enforce rate limit before database insert (WRONG #002 / SEC-002)
Priority: P0
Type: SECURITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md #002/SEC-002: leads are inserted before rate limit check, enabling spam
Acceptance Criteria:
- [ ] T-042.1: Move rate limit enforcement before `insertLead()` in `lib/actions.ts`
- [ ] T-042.2: Add test for rate-limited submissions not writing records
Prompt Scaffold:
- Role: Security engineer.
- Goal: Complete T-042: Enforce rate limit before database insert (WRONG #002 / SEC-002) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md #002/SEC-002: leads are inserted before rate limit check, enabling spam.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/lib/actions.ts, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/lib/actions.ts, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /lib/actions.ts
- /WRONG.md
Dependencies: None
Effort: XS
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

### T-047: Validate Content-Length header in middleware (WRONG #003 / SEC-001)
Priority: P1
Type: SECURITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md #003/S001: malformed Content-Length can bypass size checks
Acceptance Criteria:
- [ ] T-047.1: Reject missing/invalid/negative Content-Length values
- [ ] T-047.2: Add tests for invalid header values and oversized payloads
Prompt Scaffold:
- Role: Security engineer.
- Goal: Complete T-047: Validate Content-Length header in middleware (WRONG #003 / SEC-001) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md #003/S001: malformed Content-Length can bypass size checks.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/middleware.ts, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/middleware.ts, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /middleware.ts
- /WRONG.md
Dependencies: None
Effort: S
---

### T-048: Add explicit null handling in logger sanitize (WRONG #004)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md #004: sanitizeValue relies on implicit null handling
Acceptance Criteria:
- [ ] T-048.1: Handle null/undefined explicitly in `sanitizeValue`
- [ ] T-048.2: Add unit test for null log context values
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-048: Add explicit null handling in logger sanitize (WRONG #004) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md #004: sanitizeValue relies on implicit null handling.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/lib/logger.ts, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/lib/logger.ts, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /lib/logger.ts
- /WRONG.md
Dependencies: None
Effort: XS
---

### T-049: Fix mobile menu focus management (WRONG #010)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md #010: focus restoration uses stale refs on menu close
Acceptance Criteria:
- [ ] T-049.1: Capture focus before opening and restore on close if element exists
- [ ] T-049.2: Add E2E test for keyboard focus restoration
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-049: Fix mobile menu focus management (WRONG #010) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md #010: focus restoration uses stale refs on menu close.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/components/Navigation.tsx, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/components/Navigation.tsx, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /components/Navigation.tsx
- /WRONG.md
Dependencies: None
Effort: S
---

### T-050: Add error handling to blog listing page (WRONG #015)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md #015: blog listing crashes on malformed MDX/frontmatter
Acceptance Criteria:
- [ ] T-050.1: Wrap `getAllPosts()`/`getAllCategories()` in try/catch with fallback UI
- [ ] T-050.2: Add test for malformed MDX returning safe UI
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-050: Add error handling to blog listing page (WRONG #015) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md #015: blog listing crashes on malformed MDX/frontmatter.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/app/blog/page.tsx, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/app/blog/page.tsx, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /app/blog/page.tsx
- /WRONG.md
Dependencies: None
Effort: XS
---

### T-051: Fix metadata handling for missing blog posts (WRONG #016)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md #016: `generateMetadata()` returns 200 metadata for missing posts
Acceptance Criteria:
- [ ] T-051.1: Return noindex metadata for missing posts
- [ ] T-051.2: Verify `notFound()` still triggers 404 in page render
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-051: Fix metadata handling for missing blog posts (WRONG #016) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md #016: `generateMetadata()` returns 200 metadata for missing posts.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/app/blog/[slug]/page.tsx, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/app/blog/[slug]/page.tsx, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /app/blog/[slug]/page.tsx
- /WRONG.md
Dependencies: None
Effort: XS
---

### T-052: Add Suspense fallback on search page (WRONG #017)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md #017: Suspense without fallback yields blank UI
Acceptance Criteria:
- [ ] T-052.1: Provide a loading fallback in `app/search/page.tsx`
- [ ] T-052.2: Add UI test asserting fallback renders on slow load
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-052: Add Suspense fallback on search page (WRONG #017) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md #017: Suspense without fallback yields blank UI.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/app/search/page.tsx, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/app/search/page.tsx, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /app/search/page.tsx
- /WRONG.md
Dependencies: None
Effort: XS
---

### T-053: Replace index keys in SocialProof lists (WRONG #019)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md #019: React key anti-pattern risks state corruption
Acceptance Criteria:
- [ ] T-053.1: Use stable unique keys for testimonials and metrics
- [ ] T-053.2: Add test or lint rule to prevent index keys in mapped UI
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-053: Replace index keys in SocialProof lists (WRONG #019) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md #019: React key anti-pattern risks state corruption.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/components/SocialProof.tsx, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/components/SocialProof.tsx, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /components/SocialProof.tsx
- /WRONG.md
Dependencies: None
Effort: XS
---

### T-054: Clean up InstallPrompt timeout (WRONG #020)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md #020: timeout not cleared in effect cleanup
Acceptance Criteria:
- [ ] T-054.1: Store and clear timeout in effect cleanup
- [ ] T-054.2: Add test to ensure no setState after unmount
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-054: Clean up InstallPrompt timeout (WRONG #020) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md #020: timeout not cleared in effect cleanup.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/components/InstallPrompt.tsx, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/components/InstallPrompt.tsx, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /components/InstallPrompt.tsx
- /WRONG.md
Dependencies: None
Effort: XS
---

### T-055: Announce search keyboard shortcut to screen readers (WRONG #021)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md #021: aria-label does not mention Cmd/Ctrl+K shortcut
Acceptance Criteria:
- [ ] T-055.1: Update aria-label to include shortcut hint
- [ ] T-055.2: Verify with a11y snapshot or test
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-055: Announce search keyboard shortcut to screen readers (WRONG #021) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md #021: aria-label does not mention Cmd/Ctrl+K shortcut.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/components/SearchDialog.tsx, /components/Navigation.tsx, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/components/SearchDialog.tsx, /components/Navigation.tsx, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /components/SearchDialog.tsx
- /components/Navigation.tsx
- /WRONG.md
Dependencies: None
Effort: XS
---

### T-056: Refactor Navigation god component (Q001)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Q001: `Navigation.tsx` mixes multiple responsibilities
Acceptance Criteria:
- [ ] T-056.1: Extract mobile menu into separate component
- [ ] T-056.2: Extract focus management and path normalization into hooks/utils
- [ ] T-056.3: Define scope and affected files before changes.
- [ ] T-056.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-056: Refactor Navigation god component (Q001) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md Q001: `Navigation.tsx` mixes multiple responsibilities.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/components/Navigation.tsx, /lib/utils.ts, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/components/Navigation.tsx, /lib/utils.ts, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /components/Navigation.tsx
- /lib/utils.ts
- /WRONG.md
Dependencies: None
Effort: M
---
### T-057: Auto-generate static pages list for search (Q002)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Q002: hardcoded static pages array in `lib/search.ts`
Acceptance Criteria:
- [ ] T-057.1: Generate static pages list from filesystem or metadata at build time
- [ ] T-057.2: Remove manual duplication with `app/sitemap.ts`
- [ ] T-057.3: Define scope and affected files before changes.
- [ ] T-057.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-057: Auto-generate static pages list for search (Q002) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md Q002: hardcoded static pages array in `lib/search.ts`.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/lib/search.ts, /app/sitemap.ts, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/lib/search.ts, /app/sitemap.ts, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /lib/search.ts
- /app/sitemap.ts
- /WRONG.md
Dependencies: None
Effort: M
---
### T-058: Centralize validation logic for contact flow (Q003)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Q003: validation logic duplicated across client/server
Acceptance Criteria:
- [ ] T-058.1: Consolidate validation in `lib/contact-form-schema.ts`
- [ ] T-058.2: Reuse single schema on client and server
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-058: Centralize validation logic for contact flow (Q003) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md Q003: validation logic duplicated across client/server.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/lib/contact-form-schema.ts, /components/ContactForm.tsx, /lib/actions.ts).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/lib/contact-form-schema.ts, /components/ContactForm.tsx, /lib/actions.ts) and record task status if required.
- Uncertainty: None.
References:
- /lib/contact-form-schema.ts
- /components/ContactForm.tsx
- /lib/actions.ts
- /WRONG.md
Dependencies: None
Effort: S
---

### T-059: Implement analytics provider selection (I001 / D1.1)
Priority: P1
Type: INFRASTRUCTURE
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md I001/D1.1: analytics provider is stubbed; no real tracking
Acceptance Criteria:
- [ ] T-059.1: Add provider selection with env validation
- [ ] T-059.2: Implement GA4 or Plausible adapter and tests
- [ ] T-059.3: Define scope and affected files before changes.
- [ ] T-059.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Platform engineer.
- Goal: Complete T-059: Implement analytics provider selection (I001 / D1.1) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md I001/D1.1: analytics provider is stubbed; no real tracking.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/lib/analytics.ts, /lib/env.public.ts, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/lib/analytics.ts, /lib/env.public.ts, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /lib/analytics.ts
- /lib/env.public.ts
- /WRONG.md
Dependencies: None
Effort: M
---
### T-060: Add HubSpot retry logic (Phase 4 checklist)
Priority: P1
Type: INFRASTRUCTURE
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Phase 4: HubSpot sync lacks retry queue
Acceptance Criteria:
- [ ] T-060.1: Implement retry mechanism for failed CRM sync
- [ ] T-060.2: Record retry attempts and final failure state
- [ ] T-060.3: Define retry strategy (attempt count, backoff, terminal failure)
- [ ] T-060.4: Add verification (unit/integration) for retry and final failure states
Prompt Scaffold:
- Role: Platform engineer.
- Goal: Complete T-060: Add HubSpot retry logic (Phase 4 checklist) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md Phase 4: HubSpot sync lacks retry queue.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; Dependencies: T-043; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/lib/actions.ts, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/lib/actions.ts, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /lib/actions.ts
- /WRONG.md
Dependencies: T-043
Effort: M
---
### T-061: Add error boundaries in critical paths (D1.3)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md D1.3: missing error boundaries for routes and CRM failures
Acceptance Criteria:
- [ ] T-061.1: Add error boundary for critical pages/components
- [ ] T-061.2: Ensure failures degrade gracefully with user-safe UI
- [ ] T-061.3: Define scope and affected files before changes.
- [ ] T-061.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-061: Add error boundaries in critical paths (D1.3) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md D1.3: missing error boundaries for routes and CRM failures.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/app/, /components/, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/app/, /components/, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /app/
- /components/
- /WRONG.md
Dependencies: None
Effort: M
---
### T-062: Decouple search index from blog module (A001)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md A001: tight coupling between `lib/search.ts` and `lib/blog.ts`
Acceptance Criteria:
- [ ] T-062.1: Introduce content registry or interface for search sources
- [ ] T-062.2: Update search indexing to use registry
- [ ] T-062.3: Define scope and affected files before changes.
- [ ] T-062.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-062: Decouple search index from blog module (A001) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md A001: tight coupling between `lib/search.ts` and `lib/blog.ts`.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/lib/search.ts, /lib/blog.ts, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/lib/search.ts, /lib/blog.ts, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /lib/search.ts
- /lib/blog.ts
- /WRONG.md
Dependencies: None
Effort: M
---
### T-063: Increase critical path test coverage (T1.1)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md T1.1: critical paths have low coverage (rate limit, CRM sync, blog parsing)
Acceptance Criteria:
- [ ] T-063.1: Add tests for rate limiter concurrency and Upstash init
- [ ] T-063.2: Add tests for HubSpot timeout and malformed MDX handling
- [ ] T-063.3: Identify target scenarios and fixtures for coverage.
- [ ] T-063.4: Implement tests and wire them into existing scripts.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-063: Increase critical path test coverage (T1.1) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md T1.1: critical paths have low coverage (rate limit, CRM sync, blog parsing).
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/__tests__/, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/__tests__/, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /__tests__/
- /WRONG.md
Dependencies: None
Effort: L
---
### T-064: Add cleanup to in-memory rate limiter (WRONG #005)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md #005: in-memory rate limiter Map grows without cleanup
Acceptance Criteria:
- [ ] T-064.1: Add periodic cleanup or TTL cache
- [ ] T-064.2: Document fallback limitations in code
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-064: Add cleanup to in-memory rate limiter (WRONG #005) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/actions.ts
- /WRONG.md
Dependencies: None
Effort: S

---

### T-065: Add SearchDialog backdrop click to close (WRONG #011)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md #011: modal lacks backdrop click handler
Acceptance Criteria:
- [ ] T-065.1: Close dialog when backdrop is clicked
- [ ] T-065.2: Ensure clicks inside modal do not close
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-065: Add SearchDialog backdrop click to close (WRONG #011) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /components/SearchDialog.tsx
- /WRONG.md
Dependencies: None
Effort: XS

---

### T-066: Add focus indicator for SearchDialog container (WRONG #013)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md #013: focusable dialog container has no visible focus state
Acceptance Criteria:
- [ ] T-066.1: Make dialog focusable and apply visible focus styles
- [ ] T-066.2: Ensure focus shifts to dialog on open
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-066: Add focus indicator for SearchDialog container (WRONG #013) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /components/SearchDialog.tsx
- /WRONG.md
Dependencies: None
Effort: XS

---

### T-067: Log Sentry client load failures (WRONG #012)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md #012: Sentry functions silently fail without warning
Acceptance Criteria:
- [ ] T-067.1: Log or report failure when Sentry import fails
- [ ] T-067.2: Ensure callers can detect failure or fallback safely
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-067: Log Sentry client load failures (WRONG #012) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/sentry-client.ts
- /WRONG.md
Dependencies: None
Effort: XS

---

### T-068: Add error handling for BlogPostContent dynamic import (WRONG #018)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md #018: dynamic import has loading state but no error handling
Acceptance Criteria:
- [ ] T-068.1: Add error boundary or fallback for BlogPostContent import failures
- [ ] T-068.2: Provide user-visible error state when content fails to load
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-068: Add error handling for BlogPostContent dynamic import (WRONG #018) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /app/blog/[slug]/page.tsx
- /components/BlogPostContent.tsx
- /WRONG.md
Dependencies: None
Effort: S

---

### T-069: Standardize blog module return values (WRONG #009)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md #009: `getAllPosts()` and `getPostBySlug()` return inconsistent fallbacks
Acceptance Criteria:
- [ ] T-069.1: Document or standardize return patterns in `lib/blog.ts`
- [ ] T-069.2: Add tests verifying consistent behavior
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-069: Standardize blog module return values (WRONG #009) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/blog.ts
- /WRONG.md
Dependencies: None
Effort: XS

---

### T-070: Remove unused analytics params and dead helpers (D001 + Deep Sweep)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md D001 + Deep Sweep: unused params and dead tracking helpers in analytics
Acceptance Criteria:
- [ ] T-070.1: Remove unused params (`_location`, `_destination`)
- [ ] T-070.2: Remove or implement dead helpers (trackPageView, trackOutboundLink, trackDownload, trackScrollDepth, trackTimeOnPage)
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-070: Remove unused analytics params and dead helpers (D001 + Deep Sweep) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/analytics.ts
- /WRONG.md
Dependencies: None
Effort: S

---

### T-071: Remove unused error variables in catch blocks (D002)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md D002: catch blocks declare unused `error` variables
Acceptance Criteria:
- [ ] T-071.1: Replace unused `error` with `catch {}` or use the value
- [ ] T-071.2: Ensure logger captures real error details where needed
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-071: Remove unused error variables in catch blocks (D002) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/
- /components/
- /WRONG.md
Dependencies: None
Effort: XS

---

### T-072: Remove orphaned RateLimiter type (D003)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md D003: RateLimiter type definition is unused/inlineable
Acceptance Criteria:
- [ ] T-072.1: Remove or inline unused type definition
- [ ] T-072.2: Confirm TypeScript build passes
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-072: Remove orphaned RateLimiter type (D003) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/actions.ts
- /WRONG.md
Dependencies: None
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
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /.env.example
- /lib/env.ts
- /lib/env.public.ts
- /WRONG.md
Dependencies: None
Effort: XS

---

### T-075: Move social URLs to env vars (WRONG #008 / CF001)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md #008/CF001: structured data uses hardcoded social URLs
Acceptance Criteria:
- [ ] T-075.1: Add env vars for social URLs in `lib/env.public.ts` and `.env.example`
- [ ] T-075.2: Update structured data to use env values with safe filtering
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-075: Move social URLs to env vars (WRONG #008 / CF001) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /app/layout.tsx
- /lib/env.public.ts
- /.env.example
- /WRONG.md
Dependencies: None
Effort: S

---

### T-076: Replace rate-limit magic numbers with config (Phase 2 / Phase 10)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: magic numbers in rate limit logic and config
Acceptance Criteria:
- [ ] T-076.1: Move rate limit constants to config/env with validation
- [ ] T-076.2: Update usage across `lib/actions.ts`
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-076: Replace rate-limit magic numbers with config (Phase 2 / Phase 10) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/actions.ts
- /lib/env.ts
- /WRONG.md
Dependencies: None
Effort: S

---

### T-077: Reduce long functions (Phase 2 medium)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: long functions like `submitContactForm` reduce maintainability
Acceptance Criteria:
- [ ] T-077.1: Extract smaller helpers from `submitContactForm`
- [ ] T-077.2: Keep behavior unchanged with tests
- [ ] T-077.3: Define scope and affected files before changes.
- [ ] T-077.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-077: Reduce long functions (Phase 2 medium) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/actions.ts
- /WRONG.md
Dependencies: None
Effort: M

---
### T-078: Reduce deep nesting in components (Phase 2 medium)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: deep nesting makes components harder to maintain
Acceptance Criteria:
- [ ] T-078.1: Refactor nested JSX into subcomponents/helpers
- [ ] T-078.2: Verify UI behavior unchanged
- [ ] T-078.3: Define scope and affected files before changes.
- [ ] T-078.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-078: Reduce deep nesting in components (Phase 2 medium) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /components/
- /WRONG.md
Dependencies: None
Effort: M

---
### T-079: Standardize component file naming (Phase 2 medium)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: inconsistent naming conventions across components
Acceptance Criteria:
- [ ] T-079.1: Align naming conventions with BESTPR.md
- [ ] T-079.2: Update imports to match renamed files
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-079: Standardize component file naming (Phase 2 medium) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /components/
- /BESTPR.md
- /WRONG.md
Dependencies: None
Effort: S

---

### T-080: Remove unused imports (Phase 2 medium)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: unused imports in multiple files
Acceptance Criteria:
- [ ] T-080.1: Remove unused imports and ensure lint passes
- [ ] T-080.2: Confirm no build or test regressions
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-080: Remove unused imports (Phase 2 medium) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /app/
- /components/
- /lib/
- /WRONG.md
Dependencies: None
Effort: XS

---

### T-081: Simplify complex conditions (Phase 2 medium)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: complex if conditions reduce readability
Acceptance Criteria:
- [ ] T-081.1: Extract boolean helpers for complex conditions
- [ ] T-081.2: Keep behavior identical with unit tests
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-081: Simplify complex conditions (Phase 2 medium) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/
- /components/
- /WRONG.md
Dependencies: None
Effort: S

---

### T-082: Add missing JSDoc for exported functions (Phase 2 medium)
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: documentation gaps for exported APIs
Acceptance Criteria:
- [ ] T-082.1: Add JSDoc for exported functions lacking docs
- [ ] T-082.2: Ensure new docs match existing style in BESTPR.md
Prompt Scaffold:
- Role: Documentation specialist.
- Goal: Complete T-082: Add missing JSDoc for exported functions (Phase 2 medium) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/
- /components/
- /WRONG.md
- /BESTPR.md
Dependencies: None
Effort: S

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
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /components/
- /WRONG.md
Dependencies: None
Effort: XS

---

### T-085: Add request ID correlation for logging (Phase 4 medium)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: logs lack request ID correlation
Acceptance Criteria:
- [ ] T-085.1: Generate/request ID and attach to log context
- [ ] T-085.2: Document request ID usage in logger helpers
- [ ] T-085.3: Define scope and affected files before changes.
- [ ] T-085.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-085: Add request ID correlation for logging (Phase 4 medium) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/logger.ts
- /middleware.ts
- /WRONG.md
Dependencies: None
Effort: M

---
### T-086: Validate Supabase/HubSpot config at startup (Phase 10 medium)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: credentials not validated at startup
Acceptance Criteria:
- [ ] T-086.1: Add startup validation for required server env vars
- [ ] T-086.2: Ensure missing vars fail fast with clear errors
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-086: Validate Supabase/HubSpot config at startup (Phase 10 medium) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/env.ts
- /WRONG.md
Dependencies: None
Effort: S

---

### T-087: Add env drift checks across environments (Phase 10 medium)
Priority: P2
Type: INFRASTRUCTURE
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: no automated check for env parity across dev/staging/prod
Acceptance Criteria:
- [ ] T-087.1: Add script or doc for verifying env parity
- [ ] T-087.2: Document usage in relevant docs
- [ ] T-087.3: Define scope and affected files before changes.
- [ ] T-087.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Platform engineer.
- Goal: Complete T-087: Add env drift checks across environments (Phase 10 medium) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /scripts/
- /docs/
- /WRONG.md
Dependencies: None
Effort: M

---
### T-088: Move structured data contact email to env var (Phase 10 medium)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: structured data uses hardcoded contact email
Acceptance Criteria:
- [ ] T-088.1: Add env var for contact email and use in structured data
- [ ] T-088.2: Update `.env.example` accordingly
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-088: Move structured data contact email to env var (Phase 10 medium) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /app/layout.tsx
- /lib/env.public.ts
- /.env.example
- /WRONG.md
Dependencies: None
Effort: XS

---

### T-089: Add client-side search analytics (Phase 4 checklist)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: search analytics not implemented
Acceptance Criteria:
- [ ] T-089.1: Track search queries/events client-side
- [ ] T-089.2: Respect privacy settings and opt-outs
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-089: Add client-side search analytics (Phase 4 checklist) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /components/SearchDialog.tsx
- /lib/analytics.ts
- /WRONG.md
Dependencies: T-059
Effort: S

---

### T-090: Add frontmatter validation for blog posts (Phase 4 checklist)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: frontmatter validation not implemented
Acceptance Criteria:
- [ ] T-090.1: Validate required fields in blog frontmatter with Zod
- [ ] T-090.2: Fail gracefully with clear error messages
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-090: Add frontmatter validation for blog posts (Phase 4 checklist) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/blog.ts
- /content/blog/
- /WRONG.md
Dependencies: None
Effort: S

---

### T-091: Add blog post caching in dev builds (Phase 4 checklist)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: blog content not cached for dev performance
Acceptance Criteria:
- [ ] T-091.1: Implement dev-only caching layer for blog reads
- [ ] T-091.2: Ensure production behavior unchanged
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-091: Add blog post caching in dev builds (Phase 4 checklist) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/blog.ts
- /WRONG.md
Dependencies: None
Effort: S

---

### T-092: Add fuzzy search support (Phase 4 checklist)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: fuzzy search not implemented
Acceptance Criteria:
- [ ] T-092.1: Add fuzzy matching for search queries
- [ ] T-092.2: Document behavior and performance impact
- [ ] T-092.3: Choose fuzzy matching approach and configure thresholds
- [ ] T-092.4: Add tests/examples covering fuzzy matches and ranking
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-092: Add fuzzy search support (Phase 4 checklist) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/search.ts
- /components/SearchDialog.tsx
- /WRONG.md
Dependencies: None
Effort: M

---
### T-093: Fix success message disappearing on navigation (Phase 4 medium #009)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Phase 4 medium #009: success message disappears on navigation
Acceptance Criteria:
- [ ] T-093.1: Identify affected component and persist success state across navigation
- [ ] T-093.2: Add regression test for the success message
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-093: Fix success message disappearing on navigation (Phase 4 medium #009) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /components/ContactForm.tsx
- /WRONG.md
Dependencies: None
Effort: S

---

### T-094: Implement nonce-based CSP (SEC-004 / Phase 4 checklist)
Priority: P2
Type: SECURITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md SEC-004: CSP uses 'unsafe-inline'
Acceptance Criteria:
- [ ] T-094.1: Add nonce-based CSP headers in middleware
- [ ] T-094.2: Update scripts/styles to use nonce safely
- [ ] T-094.3: Thread nonce through rendering paths that inject scripts/styles
- [ ] T-094.4: Verify CSP headers and update SECURITY docs with the nonce pattern
Prompt Scaffold:
- Role: Security engineer.
- Goal: Complete T-094: Implement nonce-based CSP (SEC-004 / Phase 4 checklist) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /middleware.ts
- /WRONG.md
Dependencies: None
Effort: M

---
### T-095: Strengthen IP hash salt (SEC-003)
Priority: P2
Type: SECURITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md SEC-003: hardcoded salt weakens hashing
Acceptance Criteria:
- [ ] T-095.1: Use environment-provided salt with safe fallback
- [ ] T-095.2: Document new env var in `.env.example`
Prompt Scaffold:
- Role: Security engineer.
- Goal: Complete T-095: Strengthen IP hash salt (SEC-003) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/actions.ts
- /.env.example
- /WRONG.md
Dependencies: None
Effort: S

---

### T-096: Sanitize error responses (SEC-005)
Priority: P2
Type: SECURITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md SEC-005: error responses may expose internal details
Acceptance Criteria:
- [ ] T-096.1: Replace user-facing errors with generic messages
- [ ] T-096.2: Ensure detailed errors are logged server-side only
Prompt Scaffold:
- Role: Security engineer.
- Goal: Complete T-096: Sanitize error responses (SEC-005) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/actions.ts
- /WRONG.md
Dependencies: None
Effort: S

---

### T-097: Update Zod to latest supported version (SEC-007)
Priority: P2
Type: DEPENDENCY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md SEC-007: Zod version is behind latest
Acceptance Criteria:
- [ ] T-097.1: Update Zod to latest version and run tests
- [ ] T-097.2: Update CHANGELOG.md if version changes
Prompt Scaffold:
- Role: Dependency maintenance engineer.
- Goal: Complete T-097: Update Zod to latest supported version (SEC-007) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /package.json
- /package-lock.json
- /CHANGELOG.md
- /WRONG.md
Dependencies: None
Effort: XS

---

### T-098: Add pre-commit secret scanning (S003)
Priority: P2
Type: SECURITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md S003: client secret scan runs only post-build
Acceptance Criteria:
- [ ] T-098.1: Add pre-commit hook or CI step to run secret scan
- [ ] T-098.2: Document setup in developer docs
Prompt Scaffold:
- Role: Security engineer.
- Goal: Complete T-098: Add pre-commit secret scanning (S003) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /scripts/check-client-secrets.mjs
- /docs/
- /WRONG.md
Dependencies: None
Effort: S

---

### T-099: Add CRM/Supabase abstraction layer (Architecture)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: direct API calls in actions.ts make layering brittle
Acceptance Criteria:
- [ ] T-099.1: Introduce repository/service layer for Supabase and HubSpot
- [ ] T-099.2: Update `lib/actions.ts` to use the new layer
- [ ] T-099.3: Define scope and affected files before changes.
- [ ] T-099.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-099: Add CRM/Supabase abstraction layer (Architecture) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/actions.ts
- /lib/
- /WRONG.md
Dependencies: None
Effort: M

---
### T-100: Reduce direct lib imports from components (Architecture)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: components import `lib/` directly, bypassing layers
Acceptance Criteria:
- [ ] T-100.1: Introduce intermediate interfaces where needed
- [ ] T-100.2: Update components to use the new interfaces
- [ ] T-100.3: Define scope and affected files before changes.
- [ ] T-100.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-100: Reduce direct lib imports from components (Architecture) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /components/
- /lib/
- /WRONG.md
Dependencies: None
Effort: M

---
### T-101: Guard env/logger circular dependency risk (Architecture)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md: env/logger circular dependency risk
Acceptance Criteria:
- [ ] T-101.1: Audit imports between env and logger modules
- [ ] T-101.2: Add guard or refactor to prevent circular dependency
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-101: Guard env/logger circular dependency risk (Architecture) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/env.ts
- /lib/logger.ts
- /WRONG.md
Dependencies: None
Effort: S

---

### T-102: Add analytics setup documentation (Do1.1)
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Do1.1: missing analytics setup guide
Acceptance Criteria:
- [ ] T-102.1: Create `docs/ANALYTICS_SETUP.md` with GA4/Plausible options
- [ ] T-102.2: Link guide from README or customization docs
- [ ] T-102.3: Define scope and affected files before changes.
- [ ] T-102.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Documentation specialist.
- Goal: Complete T-102: Add analytics setup documentation (Do1.1) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /docs/
- /README.md
- /WRONG.md
Dependencies: T-059
Effort: M

---
### T-103: Update brittle tests for placeholder content (T1.2)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md T1.2: tests expect old marketing content
Acceptance Criteria:
- [ ] T-103.1: Update tests to use placeholder-driven assertions
- [ ] T-103.2: Ensure tests pass with current template content
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-103: Update brittle tests for placeholder content (T1.2) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /__tests__/
- /WRONG.md
Dependencies: None
Effort: S

---

### T-104: Add integration tests for contact/blog/search (Phase 9)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Phase 9: missing integration tests for critical paths
Acceptance Criteria:
- [ ] T-104.1: Add integration tests for contact form submission flow
- [ ] T-104.2: Add integration tests for blog parsing and search indexing
- [ ] T-104.3: Identify target scenarios and fixtures for coverage.
- [ ] T-104.4: Implement tests and wire them into existing scripts.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-104: Add integration tests for contact/blog/search (Phase 9) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /__tests__/
- /tests/
- /WRONG.md
Dependencies: None
Effort: L

---
### T-105: Add E2E tests for mobile menu, form, and PWA (Phase 9)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Phase 9: E2E coverage is limited
Acceptance Criteria:
- [ ] T-105.1: Add E2E tests for mobile menu keyboard navigation
- [ ] T-105.2: Add E2E tests for form submission and PWA prompt
- [ ] T-105.3: Identify target scenarios and fixtures for coverage.
- [ ] T-105.4: Implement tests and wire them into existing scripts.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-105: Add E2E tests for mobile menu, form, and PWA (Phase 9) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /tests/
- /WRONG.md
Dependencies: None
Effort: L

---
### T-106: Add automated accessibility tests (Phase 9)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Phase 9: no automated a11y testing
Acceptance Criteria:
- [ ] T-106.1: Add axe-core or similar to E2E suite
- [ ] T-106.2: Document a11y test workflow
- [ ] T-106.3: Identify target scenarios and fixtures for coverage.
- [ ] T-106.4: Implement tests and wire them into existing scripts.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-106: Add automated accessibility tests (Phase 9) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /tests/
- /docs/ACCESSIBILITY.md
- /WRONG.md
Dependencies: None
Effort: M

---
### T-107: Improve test quality (Phase 9)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Phase 9: tests over-mock, lack negative cases, potential flakiness
Acceptance Criteria:
- [ ] T-107.1: Reduce over-mocking and add negative-path tests
- [ ] T-107.2: Stabilize async tests with proper waits/timeouts
- [ ] T-107.3: Identify target scenarios and fixtures for coverage.
- [ ] T-107.4: Implement tests and wire them into existing scripts.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-107: Improve test quality (Phase 9) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /__tests__/
- /tests/
- /WRONG.md
Dependencies: None
Effort: M

---
### T-108: Remove dead getPostsByCategory helper (Deep Sweep)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Deep Sweep: `getPostsByCategory()` is unused
Acceptance Criteria:
- [ ] T-108.1: Remove the unused helper or add a real caller
- [ ] T-108.2: Ensure blog build still succeeds
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-108: Remove dead getPostsByCategory helper (Deep Sweep) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/blog.ts
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
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /TODO.md
Dependencies: None
Effort: XS

---

### T-110: Consolidate duplicate search logic (Deep Sweep Q001)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Deep Sweep Q001: SearchDialog and SearchPage duplicate search logic
Acceptance Criteria:
- [ ] T-110.1: Extract shared search logic into a common helper or hook
- [ ] T-110.2: Update SearchDialog and SearchPage to use shared logic
- [ ] T-110.3: Add regression checks for search behavior parity
- [ ] T-110.4: Document the shared helper usage and extension points
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-110: Consolidate duplicate search logic (Deep Sweep Q001) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /components/SearchDialog.tsx
- /components/SearchPage.tsx
- /lib/search.ts
- /WRONG.md
Dependencies: None
Effort: M

---
### T-111: Reduce ServiceDetailLayout size/complexity (Deep Sweep Q004)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Deep Sweep Q004: ServiceDetailLayout is a large component
Acceptance Criteria:
- [ ] T-111.1: Extract repeated sections into subcomponents
- [ ] T-111.2: Keep layout rendering behavior unchanged
- [ ] T-111.3: Add regression coverage for the extracted sections
- [ ] T-111.4: Document the new subcomponent responsibilities
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-111: Reduce ServiceDetailLayout size/complexity (Deep Sweep Q004) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /components/ServiceDetailLayout.tsx
- /WRONG.md
Dependencies: None
Effort: M

---
### T-112: Reduce Navigation ↔ SearchDialog coupling (Deep Sweep Q005)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Deep Sweep Q005: tight coupling between Navigation and SearchDialog
Acceptance Criteria:
- [ ] T-112.1: Introduce a shared interface or helper for search trigger behavior
- [ ] T-112.2: Update Navigation and SearchDialog to use the shared interface
- [ ] T-112.3: Add verification for keyboard shortcut and open/close behavior
- [ ] T-112.4: Document the new interface and expected usage
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-112: Reduce Navigation ↔ SearchDialog coupling (Deep Sweep Q005) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /components/Navigation.tsx
- /components/SearchDialog.tsx
- /WRONG.md
Dependencies: None
Effort: M

---
### T-113: Add stricter contact form schema validation (C1.2)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md C1.2: message length, phone format, and website protocol lack validation
Acceptance Criteria:
- [ ] T-113.1: Add max length for message and company fields
- [ ] T-113.2: Add phone format validation and website protocol validation
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-113: Add stricter contact form schema validation (C1.2) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/contact-form-schema.ts
- /WRONG.md
Dependencies: None
Effort: S

---

### T-114: Reduce ESLint suppressions and migrate ignore config (C1.3)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md C1.3: overly broad ESLint suppressions and deprecated .eslintignore usage
Acceptance Criteria:
- [ ] T-114.1: Replace .eslintignore usage with eslint config exclusions
- [ ] T-114.2: Remove unnecessary @ts-expect-error or unused param suppressions
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-114: Reduce ESLint suppressions and migrate ignore config (C1.3) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /.eslintignore
- /eslint.config.mjs
- /WRONG.md
Dependencies: None
Effort: S

---

### T-115: Resolve remaining npm audit vulnerabilities (Dep1.2)
Priority: P1
Type: DEPENDENCY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Dep1.2: high-severity transitive vulnerabilities (glob, etc.)
Acceptance Criteria:
- [ ] T-115.1: Run npm audit and document remaining vulnerabilities
- [ ] T-115.2: Upgrade or pin dependencies to resolve high-severity issues
Prompt Scaffold:
- Role: Dependency maintenance engineer.
- Goal: Complete T-115: Resolve remaining npm audit vulnerabilities (Dep1.2) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: WRONG.md Dep1.2: high-severity transitive vulnerabilities (glob, etc.).
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; Dependencies: T-022; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/package.json, /package-lock.json, /WRONG.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/package.json, /package-lock.json, /WRONG.md) and record task status if required.
- Uncertainty: None.
References:
- /package.json
- /package-lock.json
- /WRONG.md
Dependencies: T-022
Effort: S
---

### T-116: Track test coverage in CI (Phase 5 test debt)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Phase 5: coverage not tracked in CI
Acceptance Criteria:
- [ ] T-116.1: Add CI or local script to capture coverage thresholds
- [ ] T-116.2: Document coverage workflow in README or testing docs
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-116: Track test coverage in CI (Phase 5 test debt) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /docs/TESTING_STRATEGY.md
- /repo.manifest.yaml
- /WRONG.md
Dependencies: None
Effort: S

---

### T-117: Add contract tests for external APIs (Phase 9)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Phase 9: no contract tests for external APIs (Supabase/HubSpot)
Acceptance Criteria:
- [ ] T-117.1: Add contract tests or mocks validating request/response shapes
- [ ] T-117.2: Document test approach for external APIs
- [ ] T-117.3: Identify target scenarios and fixtures for coverage.
- [ ] T-117.4: Implement tests and wire them into existing scripts.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-117: Add contract tests for external APIs (Phase 9) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /__tests__/
- /lib/actions.ts
- /WRONG.md
Dependencies: None
Effort: M

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
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /docs/TESTING_STRATEGY.md
- /WRONG.md
Dependencies: None
Effort: M

---
### T-119: Add E2E coverage for middleware security headers (Phase 9)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md Phase 9: no E2E verification of middleware security headers
Acceptance Criteria:
- [ ] T-119.1: Add E2E test asserting security headers on key routes
- [ ] T-119.2: Document expected header values in tests
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-119: Add E2E coverage for middleware security headers (Phase 9) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /tests/
- /middleware.ts
- /WRONG.md
Dependencies: None
Effort: S

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
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /docs/
- /lib/
- /WRONG.md
Dependencies: None
Effort: M

---

## 🟢 PHASE 7: PERFECT.md CLEANUP & QUALITY (P0-P2)
> Tasks migrated from `PERFECT.md` to align with TODO.md as the task truth source.
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

### T-125: Dead code elimination sweep (PERFECT P1-001)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- PERFECT.md P1-001: remove unused imports, dead functions, and commented blocks
Acceptance Criteria:
- [ ] T-125.1: Identify unused imports/functions and unreachable code
- [ ] T-125.2: Remove or document dead code in `docs/DEAD_CODE_ANALYSIS.md`
- [ ] T-125.3: Ensure tests/build still pass
- [ ] T-125.4: Define scope and checklist for the audit targets.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-125: Dead code elimination sweep (PERFECT P1-001) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: PERFECT.md P1-001: remove unused imports, dead functions, and commented blocks.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; Dependencies: T-070, T-071, T-072, T-108, T-073, T-084; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/app/, /components/, /lib/).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/app/, /components/, /lib/) and record task status if required.
- Uncertainty: None.
References:
- /app/
- /components/
- /lib/
- /docs/DEAD_CODE_ANALYSIS.md
- /PERFECT.md
Dependencies: T-070, T-071, T-072, T-108, T-073, T-084
Effort: L
---
### T-126: TODO/FIXME resolution audit (PERFECT P1-002)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- PERFECT.md P1-002: identify TODO/FIXME/HACK/XXX notes and classify
Acceptance Criteria:
- [ ] T-126.1: Run `scripts/check-todo-comments.mjs`
- [ ] T-126.2: Document findings in `docs/TODO_FIXME_AUDIT.md`
- [ ] T-126.3: Create follow-on tasks for P0/P1 findings
- [ ] T-126.4: Define scope and checklist for the audit targets.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-126: TODO/FIXME resolution audit (PERFECT P1-002) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: PERFECT.md P1-002: identify TODO/FIXME/HACK/XXX notes and classify.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/scripts/check-todo-comments.mjs, /docs/TODO_FIXME_AUDIT.md, /PERFECT.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/scripts/check-todo-comments.mjs, /docs/TODO_FIXME_AUDIT.md, /PERFECT.md) and record task status if required.
- Uncertainty: None.
References:
- /scripts/check-todo-comments.mjs
- /docs/TODO_FIXME_AUDIT.md
- /PERFECT.md
Dependencies: None
Effort: M
---
### T-127: Error handling consistency audit (PERFECT P1-003)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- PERFECT.md P1-003: audit error handling across API routes, server actions, and client boundaries
Acceptance Criteria:
- [ ] T-127.1: Audit `/app/api/` and server actions for consistent handling
- [ ] T-127.2: Verify error boundaries and Sentry capture
- [ ] T-127.3: Document patterns in `docs/ERROR_HANDLING_GUIDE.md`
- [ ] T-127.4: Define scope and checklist for the audit targets.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-127: Error handling consistency audit (PERFECT P1-003) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: PERFECT.md P1-003: audit error handling across API routes, server actions, and client boundaries.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; Dependencies: T-061, T-067, T-068, T-096; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/app/api/, /lib/actions.ts, /lib/logger.ts).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/app/api/, /lib/actions.ts, /lib/logger.ts) and record task status if required.
- Uncertainty: None.
References:
- /app/api/
- /lib/actions.ts
- /lib/logger.ts
- /lib/sentry-*.ts
- /docs/ERROR_HANDLING_GUIDE.md
- /PERFECT.md
Dependencies: T-061, T-067, T-068, T-096
Effort: L
---
### T-128: Type safety enhancement sweep (PERFECT P1-004)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- PERFECT.md P1-004: remove implicit any and improve type definitions
Acceptance Criteria:
- [ ] T-128.1: Identify implicit any/unsafe casts and add types
- [ ] T-128.2: Document improvements in `docs/TYPE_SAFETY_IMPROVEMENTS.md`
- [ ] T-128.3: Type-check passes with no implicit any
- [ ] T-128.4: Define scope and checklist for the audit targets.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-128: Type safety enhancement sweep (PERFECT P1-004) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: PERFECT.md P1-004: remove implicit any and improve type definitions.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/tsconfig.json, /docs/TYPE_SAFETY_IMPROVEMENTS.md, /PERFECT.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/tsconfig.json, /docs/TYPE_SAFETY_IMPROVEMENTS.md, /PERFECT.md) and record task status if required.
- Uncertainty: None.
References:
- /tsconfig.json
- /docs/TYPE_SAFETY_IMPROVEMENTS.md
- /PERFECT.md
Dependencies: None
Effort: M
---
### T-129: Extract magic numbers and strings (PERFECT P1-005)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- PERFECT.md P1-005: extract hardcoded numbers/strings to constants
Acceptance Criteria:
- [ ] T-129.1: Inventory magic numbers/strings and extract to constants
- [ ] T-129.2: Document in `docs/CONSTANTS_REFACTOR.md`
- [ ] T-129.3: Define scope and affected files before changes.
- [ ] T-129.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-129: Extract magic numbers and strings (PERFECT P1-005) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: PERFECT.md P1-005: extract hardcoded numbers/strings to constants.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; Dependencies: T-076; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/lib/, /docs/CONSTANTS_REFACTOR.md, /PERFECT.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/lib/, /docs/CONSTANTS_REFACTOR.md, /PERFECT.md) and record task status if required.
- Uncertainty: None.
References:
- /lib/
- /docs/CONSTANTS_REFACTOR.md
- /PERFECT.md
Dependencies: T-076
Effort: M
---
### T-130: Add file-level documentation headers (PERFECT P2-001)
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- PERFECT.md P2-001: add headers to all source/test files
Acceptance Criteria:
- [ ] T-130.1: Add headers to `/app`, `/components`, `/lib`, and tests
- [ ] T-130.2: Document standards in `docs/DOCUMENTATION_STANDARDS.md`
- [ ] T-130.3: Define scope and affected files before changes.
- [ ] T-130.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Documentation specialist.
- Goal: Complete T-130: Add file-level documentation headers (PERFECT P2-001) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: PERFECT.md P2-001: add headers to all source/test files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/docs/DOCUMENTATION_STANDARDS.md, /PERFECT.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/docs/DOCUMENTATION_STANDARDS.md, /PERFECT.md) and record task status if required.
- Uncertainty: None.
References:
- /docs/DOCUMENTATION_STANDARDS.md
- /PERFECT.md
Dependencies: None
Effort: XL
---
### T-131: Document public APIs with JSDoc (PERFECT P2-002)
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- PERFECT.md P2-002: document all exported functions/components
Acceptance Criteria:
- [ ] T-131.1: Add JSDoc to exported APIs in `/lib` and `/components`
- [ ] T-131.2: Ensure IDE renders docs correctly
- [ ] T-131.3: Define scope and affected files before changes.
- [ ] T-131.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Documentation specialist.
- Goal: Complete T-131: Document public APIs with JSDoc (PERFECT P2-002) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: PERFECT.md P2-002: document all exported functions/components.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; Dependencies: T-120; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/lib/, /components/, /PERFECT.md).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/lib/, /components/, /PERFECT.md) and record task status if required.
- Uncertainty: None.
References:
- /lib/
- /components/
- /PERFECT.md
Dependencies: T-120
Effort: L
---
### T-132: Add inline comments for complex logic (PERFECT P2-003)
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- PERFECT.md P2-003: explain complex algorithms, edge cases, and assumptions
Acceptance Criteria:
- [ ] T-132.1: Review functions >20 lines and add rationale comments
- [ ] T-132.2: Avoid over-commenting; focus on "why"
- [ ] T-132.3: Define scope and affected files before changes.
- [ ] T-132.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Documentation specialist.
- Goal: Complete T-132: Add inline comments for complex logic (PERFECT P2-003) per Acceptance Criteria.
- Non-Goals: Do not modify files outside References; avoid scope beyond Acceptance Criteria.
- Context: PERFECT.md P2-003: explain complex algorithms, edge cases, and assumptions.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: Use the structures and sections explicitly listed in Acceptance Criteria and referenced docs (/app/, /components/, /lib/).
- Validation: Satisfy all checklist items and acceptance criteria outputs.
- Output Format: Update referenced files (/app/, /components/, /lib/) and record task status if required.
- Uncertainty: None.
References:
- /app/
- /components/
- /lib/
- /PERFECT.md
Dependencies: None
Effort: M
---
### T-133: Code duplication analysis (PERFECT P3-001)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- PERFECT.md P3-001: identify and refactor duplicated logic
Acceptance Criteria:
- [ ] T-133.1: Document duplication in `docs/DUPLICATION_ANALYSIS.md`
- [ ] T-133.2: Extract shared utilities and refactor duplicates
- [ ] T-133.3: Define scope and checklist for the audit targets.
- [ ] T-133.4: Record findings and create follow-up tasks for any issues.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-133: Code duplication analysis (PERFECT P3-001) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /docs/DUPLICATION_ANALYSIS.md
- /PERFECT.md
Dependencies: None
Effort: L

---
### T-134: Reduce cyclomatic complexity (PERFECT P3-002)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- PERFECT.md P3-002: target average cyclomatic complexity < 10
Acceptance Criteria:
- [ ] T-134.1: Measure function complexity and identify >20
- [ ] T-134.2: Refactor complex functions with docs
- [ ] T-134.3: Define scope and affected files before changes.
- [ ] T-134.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-134: Reduce cyclomatic complexity (PERFECT P3-002) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /docs/
- /PERFECT.md
Dependencies: None
Effort: L

---
### T-135: Simplify large components (PERFECT P3-003)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- PERFECT.md P3-003: split components >300 lines and extract hooks
Acceptance Criteria:
- [ ] T-135.1: Identify large components and split into subcomponents
- [ ] T-135.2: Preserve behavior and update tests
- [ ] T-135.3: Define scope and affected files before changes.
- [ ] T-135.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-135: Simplify large components (PERFECT P3-003) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /components/
- /app/
- /PERFECT.md
Dependencies: T-056, T-111, T-078
Effort: M

---
### T-136: Organize utility functions in lib (PERFECT P3-004)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- PERFECT.md P3-004: reorganize `/lib` utilities for discoverability
Acceptance Criteria:
- [ ] T-136.1: Group utilities and add index exports
- [ ] T-136.2: Update imports across codebase
- [ ] T-136.3: Define scope and affected files before changes.
- [ ] T-136.4: Add verification steps (tests or manual checklist) and record results.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-136: Organize utility functions in lib (PERFECT P3-004) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/
- /PERFECT.md
Dependencies: None
Effort: M

---
### T-137: Increase test coverage to 90%+ (PERFECT P4-001)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: BLOCKED
Blockers: Requires coverage baseline (T-124)
Context:
- PERFECT.md P4-001: raise coverage to Diamond Standard target
Acceptance Criteria:
- [ ] T-137.1: Identify files below 50% coverage
- [ ] T-137.2: Add unit/integration tests to reach 90%+
- [ ] T-137.3: Document results in `docs/TEST_COVERAGE_REPORT.md`
- [ ] T-137.4: Identify target scenarios and fixtures for coverage.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-137: Increase test coverage to 90%+ (PERFECT P4-001) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: Blocker: Requires coverage baseline (T-124).
References:
- /__tests__/
- /vitest.config.ts
- /docs/TEST_COVERAGE_REPORT.md
- /PERFECT.md
Dependencies: T-124
Effort: XL

---
### T-138: Edge case testing sweep (PERFECT P4-002)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- PERFECT.md P4-002: add boundary and error-path tests
Acceptance Criteria:
- [ ] T-138.1: Add edge case tests for validation and error paths
- [ ] T-138.2: Document edge cases in test names
- [ ] T-138.3: Define scope and checklist for the audit targets.
- [ ] T-138.4: Record findings and create follow-up tasks for any issues.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-138: Edge case testing sweep (PERFECT P4-002) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /__tests__/
- /PERFECT.md
Dependencies: None
Effort: L

---
### T-139: Enhance E2E testing coverage (PERFECT P4-003)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- PERFECT.md P4-003: expand Playwright coverage and a11y checks
Acceptance Criteria:
- [ ] T-139.1: Audit existing E2E tests and add critical flows
- [ ] T-139.2: Include accessibility checks and responsive assertions
- [ ] T-139.3: Identify target scenarios and fixtures for coverage.
- [ ] T-139.4: Implement tests and wire them into existing scripts.
Prompt Scaffold:
- Role: Quality engineer.
- Goal: Complete T-139: Enhance E2E testing coverage (PERFECT P4-003) per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /tests/
- /playwright.config.ts
- /PERFECT.md
Dependencies: T-105, T-106
Effort: M

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
---

## 🟤 PHASE 8: GOVERNANCE & DOCS HYGIENE (P2)
> Documentation accuracy and template consistency improvements.

### T-144: Reconcile non-binding tasks source references
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- Docs and scripts reference a non-binding specs task file that does not exist
- Inconsistent references cause confusion about task truth source
- sync-todo helper should be clear about optional inputs
Acceptance Criteria:
- [ ] T-144.1: Decide on a canonical non-binding tasks note file (or remove references entirely)
- [ ] T-144.2: Align `scripts/sync-todo.sh` input path and header text with the chosen file
- [ ] T-144.3: Update docs to match (ENHANCEMENT_SUMMARY, GOVERNANCE_HEALTH, REPO_MAP)
- [ ] T-144.4: Update `scripts/README.md` and `scripts/AGENTS.md` if paths or behavior changed
- [ ] T-144.5: Keep `TODO.md` as the task truth source in all docs
Prompt Scaffold:
- Role: Documentation specialist.
- Goal: Complete T-144: Reconcile non-binding tasks source references per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /scripts/sync-todo.sh
- /scripts/README.md
- /scripts/AGENTS.md
- /docs/ENHANCEMENT_SUMMARY.md
- /docs/GOVERNANCE_HEALTH.md
- /docs/REPO_MAP.md
- /specs/
Dependencies: None
Effort: S

---

### T-145: Sanitize remaining marketing-branding in docs
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- Several docs still reference "Your Dedicated Marketer" and marketing-specific branding
- This conflicts with the template's generic positioning
- Some of these docs may be historical and should be archived instead
Acceptance Criteria:
- [ ] T-145.1: Update or archive branding-specific docs (start-here, product, architecture)
- [ ] T-145.2: Replace brand references with template-safe placeholders
- [ ] T-145.3: Update any cross-references if files are archived
- [ ] T-145.4: Run a repo-wide search for "Your Dedicated Marketer"/"YD Marketer" and ensure only archived docs remain
Prompt Scaffold:
- Role: Documentation specialist.
- Goal: Complete T-145: Sanitize remaining marketing-branding in docs per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /docs/start-here/README.md
- /docs/product/CONTENT-STRATEGY.md
- /docs/product/SERVICES.md
- /docs/architecture/DESIGN-SYSTEM.md
- /docs/architecture/CODEBASE-ANALYSIS.md
Dependencies: None
Effort: M

---

### T-148: Define template versioning and changelog policy
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- Release tasks exist but versioning/changelog rules are not explicit
- Template users need clear guidance on semantic versioning and change communication
- Prevents inconsistent release notes across future updates
Acceptance Criteria:
- [ ] T-148.1: Define semantic versioning rules (breaking/feature/fix)
- [ ] T-148.2: Document changelog update requirements and format
- [ ] T-148.3: Add versioning guidance to release checklist and CONTRIBUTING
- [ ] T-148.4: Add examples of release notes for minor/patch releases
Prompt Scaffold:
- Role: Documentation specialist.
- Goal: Complete T-148: Define template versioning and changelog policy per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in TODO.md/related docs.
- Uncertainty: None.
References:
- /CHANGELOG.md
- /docs/TEMPLATE_RELEASE_CHECKLIST.md
- /docs/CONTRIBUTING.md
Dependencies: T-013
Effort: M

---

## Summary

**Total Tasks**: 154 (T-001 through T-154; completed tasks archived in TODOCOMPLETED.md)
**Active Tasks**: 134 (all tasks listed in this file)
**Estimated Total Effort**: **UNKNOWN** (audit remediation tasks added; update estimate)

### By Priority
- **P0 (Critical)**: 16 tasks - Security fixes and release blockers
- **P1 (High)**: 31 tasks - Documentation, platinum-standard essentials, audit fixes
- **P2 (Medium)**: 72 tasks - Infrastructure, quality improvements, audit fixes
- **P3 (Low)**: 15 tasks - Cleanup and backlog items

### By Phase
- **Phase 1 (Sanitization)**: 0 active tasks - Complete and archived in TODOCOMPLETED.md
- **Phase 2 (Documentation)**: 1 task - T-013 in review (repo-owner steps pending)
- **Phase 3 (Infrastructure)**: 1 task - Cloudflare Pages setup guidance
- **Phase 4 (Quality)**: 5 tasks - Performance, accessibility, and validation tooling
- **Phase 5 (Platinum Standard)**: 20 tasks - Industry-leading enhancements
- **Phase 6 (Audit Remediation)**: 81 tasks - WRONG.md findings remediation
- **Phase 7 (Perfect Cleanup)**: 23 tasks - PERFECT.md open items
- **Phase 8 (Governance & Docs Hygiene)**: 3 tasks - Documentation accuracy, branding cleanup, release policy

### Platinum Standard Path
- **Phase 5A (Essentials)**: T-022, T-023, T-024, T-030, T-031, T-032, T-033 → 88/100 (Industry Standard)
- **Phase 5B (Advanced)**: T-034, T-035, T-036, T-037, T-039 → 95/100 (Exceeds Standard)
- **Phase 5C (Elite)**: T-025, T-026, T-027, T-028, T-029, T-038 → 98/100 (Platinum)
- **Phase 5D (Trust & Conversion Extensions)**: T-149, T-150, T-151, T-152, T-153, T-154 → 99/100 (Trust-First)

### What Changes (Content Only)
- Branding: "Your Dedicated Marketer" → Configurable placeholders
- Services: 8 marketing-specific → 8 generic service placeholders
- Blog: 5 marketing posts → 3 generic example posts
- Pricing: Marketing-specific → Generic pricing template
- Components: Marketing messaging → Generic professional services messaging
- Documentation: Marketing context → Template user documentation

### What Adds (Platinum Enhancements)
- AI Features: Chatbot, personalization, A/B testing
- Trust Building: Client logos, team profiles, video testimonials
- Conversion Tools: Exit-intent, newsletter popups, appointment scheduling
- Content: Resource library, video support, ROI calculators
- Developer Experience: CLI wizard, theme editor, Storybook, Dependabot

### What Stays (100% Functionality)
- All components and modules
- All routing and architecture patterns
- Contact form with rate limiting (Upstash)
- Supabase + CRM integration capability
- Search functionality
- PWA capabilities
- Blog engine
- Analytics integration framework
- Sentry monitoring
- Build and deployment infrastructure
- Testing infrastructure
- Diamond Standard compliance
- All UI components and styling system
- All technical features and capabilities

---

**Next Steps**: Complete remaining external steps for T-013, then address Phase 6 P0 security fixes (T-040–T-046) before starting Phase 5A.


