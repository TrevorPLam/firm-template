# P1TODO.md - Repository Task List

Document Type: Workflow
Last Updated: 2026-01-21
Task Truth Source: **P1TODO.md (P1)**
Other priorities: `P0TODO.md`, `P2TODO.md`, `P3TODO.md`.

This file is the single source of truth for P1 tasks. If another document disagrees, the task record in this file wins (unless the Constitution overrides).

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
