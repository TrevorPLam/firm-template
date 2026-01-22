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

---

## 🟣 PHASE 8: VISUAL UI/UX EDITOR (P1)
> Client-facing visual editor for customizing colors, fonts, images, videos, and layouts
> Enables non-technical users to customize the template without coding
> Based on research of industry best practices (Webflow, TinaCMS, Builder.io)

### T-200: Research Visual UI/UX Editor Architecture
Priority: P1
Type: DOCS
Owner: AGENT
Status: DONE
Blockers: None
Context:
- Client-facing UI/UX editor portal needed for non-technical users
- Users need ability to customize colors, fonts, images, videos, layouts
- Research completed on industry best practices and technical approaches
- TinaCMS, Plasmic, Builder.io, and dotCMS evaluated as potential solutions
- Design token management and CDN integration patterns analyzed
Acceptance Criteria:
- [x] T-200.1: Research no-code/low-code visual editor best practices
- [x] T-200.2: Evaluate headless CMS solutions (TinaCMS, Plasmic, Builder.io)
- [x] T-200.3: Research authentication and authorization patterns for enterprise
- [x] T-200.4: Analyze media management and CDN integration approaches
- [x] T-200.5: Review design token management systems
- [x] T-200.6: Document findings and recommendations
Prompt Scaffold:
- Role: Technical architect.
- Goal: Complete T-200: Research Visual UI/UX Editor Architecture per Acceptance Criteria.
- Non-Goals: Do not implement the feature, only research and document.
- Context: Professional services template needs client-facing customization portal for non-developers.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; focus on industry-standard solutions.
- Examples: Webflow, WordPress Gutenberg, Builder.io, TinaCMS, Plasmic.
- Validation: Document comprehensive findings with citations.
- Output Format: Research documented in task notes and architecture decision records.
- Uncertainty: None.
References:
- Research sources: Industry blogs, vendor documentation, security guidelines
Dependencies: None
Effort: M
---

### T-201: Design Visual UI/UX Editor System Architecture
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- Based on T-200 research findings
- Need to define technical approach for client-facing customization portal
- Must support color/font/image/video editing without coding
- Integration with existing Next.js 15 + Tailwind CSS + design token system
- Security and multi-tenancy considerations for enterprise use
Acceptance Criteria:
- [ ] T-201.1: Define scope of customizable elements (colors, fonts, images, videos, layouts)
- [ ] T-201.2: Choose technical approach (headless CMS vs custom builder vs hybrid)
- [ ] T-201.3: Design authentication/authorization model (RBAC with roles: Admin, Editor, Viewer)
- [ ] T-201.4: Design design token persistence strategy (database vs config files)
- [ ] T-201.5: Design preview and deployment workflow
- [ ] T-201.6: Define security requirements (input validation, CSRF protection, rate limiting)
- [ ] T-201.7: Design media management approach (upload, CDN, optimization)
- [ ] T-201.8: Document architecture in `/docs/VISUAL_EDITOR_ARCHITECTURE.md`
Prompt Scaffold:
- Role: Technical architect.
- Goal: Complete T-201: Design Visual UI/UX Editor System Architecture per Acceptance Criteria.
- Non-Goals: Do not implement, only design and document architecture.
- Context: Building on T-200 research to create detailed system design.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; must integrate with existing stack.
- Examples: Use existing theme-editor as reference; follow Tailwind design token patterns.
- Validation: Architecture document reviewed and approved.
- Output Format: Create `/docs/VISUAL_EDITOR_ARCHITECTURE.md` with detailed design.
- Uncertainty: None.
References:
- /docs/VISUAL_EDITOR_ARCHITECTURE.md (new)
- /app/theme-editor/theme-editor-client.tsx (reference)
- /tailwind.config.ts
- /lib/env.ts
- /lib/env.public.ts
Dependencies: T-200
Effort: L
---

### T-202: Implement Authentication System for Visual Editor
Priority: P1
Type: INFRASTRUCTURE
Owner: AGENT
Status: READY
Blockers: T-201 architecture design must be complete
Context:
- Visual editor requires secure authentication for client access
- Need RBAC with roles: Admin (full access), Editor (content/design), Viewer (read-only)
- Should integrate with NextAuth.js or similar for production-ready auth
- Must support password-based auth with MFA option
- Session management and token expiration required
Acceptance Criteria:
- [ ] T-202.1: Install and configure NextAuth.js or similar auth solution
- [ ] T-202.2: Implement user model with roles (Admin, Editor, Viewer)
- [ ] T-202.3: Create login/logout pages and API routes
- [ ] T-202.4: Implement session management with secure tokens
- [ ] T-202.5: Add middleware to protect editor routes
- [ ] T-202.6: Implement RBAC authorization checks
- [ ] T-202.7: Add audit logging for authentication events
- [ ] T-202.8: Document authentication setup in `/docs/VISUAL_EDITOR_AUTH.md`
- [ ] T-202.9: Add required env vars to `.env.example`
- [ ] T-202.10: Write tests for authentication flows
Prompt Scaffold:
- Role: Security engineer.
- Goal: Complete T-202: Implement Authentication System for Visual Editor per Acceptance Criteria.
- Non-Goals: Do not implement the editor UI, only authentication infrastructure.
- Context: Secure access control required before building editor features.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md security best practices; use industry-standard auth libraries.
- Examples: NextAuth.js with credential provider, Auth0, Clerk.
- Validation: Authentication tests pass; manual testing of login/logout flows.
- Output Format: Authentication system implemented and documented.
- Uncertainty: None.
References:
- /docs/VISUAL_EDITOR_AUTH.md (new)
- /app/editor-auth/ (new directory)
- /lib/auth.ts (new)
- /middleware.ts
- /.env.example
- /package.json
Dependencies: T-201
Effort: L
---

### T-203: Implement Design Token Management API
Priority: P1
Type: INFRASTRUCTURE
Owner: AGENT
Status: READY
Blockers: T-201 architecture design must be complete
Context:
- Visual editor needs API to read/write design tokens (colors, fonts, spacing)
- Tokens should persist to database or config files
- Must support preview mode (unsaved changes) and publish workflow
- Should validate token values (color format, font availability, etc.)
Acceptance Criteria:
- [ ] T-203.1: Create database schema or config structure for design tokens
- [ ] T-203.2: Implement API routes for CRUD operations on tokens:
  - GET /api/editor/tokens (read current tokens)
  - PUT /api/editor/tokens (update tokens with validation)
  - POST /api/editor/tokens/preview (create preview session)
  - POST /api/editor/tokens/publish (publish changes to production)
- [ ] T-203.3: Add token validation (color format, font names, value ranges)
- [ ] T-203.4: Implement version history/rollback capability
- [ ] T-203.5: Add authorization checks (Editor role required)
- [ ] T-203.6: Write integration tests for API endpoints
- [ ] T-203.7: Document API in `/docs/VISUAL_EDITOR_API.md`
Prompt Scaffold:
- Role: Backend engineer.
- Goal: Complete T-203: Implement Design Token Management API per Acceptance Criteria.
- Non-Goals: Do not build UI, only backend API.
- Context: API layer for managing design tokens used by visual editor.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; validate all inputs; require authentication.
- Examples: RESTful API with JSON responses; Zod validation schemas.
- Validation: API tests pass; manual testing with curl/Postman.
- Output Format: API routes implemented and documented.
- Uncertainty: None.
References:
- /app/api/editor/ (new directory)
- /lib/design-tokens.ts (new)
- /docs/VISUAL_EDITOR_API.md (new)
- /lib/env.ts
Dependencies: T-201, T-202
Effort: L
---

### T-204: Implement Media Upload and Management API
Priority: P1
Type: INFRASTRUCTURE
Owner: AGENT
Status: READY
Blockers: T-201 architecture design must be complete
Context:
- Visual editor needs ability to upload and manage images and videos
- Should integrate with cloud storage (Cloudflare R2, AWS S3, or similar)
- Need automatic image optimization and resizing
- CDN integration for fast delivery
- File type validation and size limits for security
Acceptance Criteria:
- [ ] T-204.1: Choose and configure cloud storage provider (Cloudflare R2 recommended)
- [ ] T-204.2: Implement API routes for media management:
  - POST /api/editor/media/upload (upload with validation)
  - GET /api/editor/media (list media library)
  - DELETE /api/editor/media/:id (delete file)
  - GET /api/editor/media/:id/metadata (get file details)
- [ ] T-204.3: Add file type validation (images: jpg, png, webp, svg; videos: mp4, webm)
- [ ] T-204.4: Implement file size limits (images: 5MB, videos: 50MB)
- [ ] T-204.5: Add image optimization (automatic WebP conversion, resizing)
- [ ] T-204.6: Configure CDN for media delivery
- [ ] T-204.7: Add authorization checks (Editor role required)
- [ ] T-204.8: Implement virus scanning for uploads (ClamAV or cloud service)
- [ ] T-204.9: Write integration tests for upload API
- [ ] T-204.10: Document media API in `/docs/VISUAL_EDITOR_API.md`
- [ ] T-204.11: Add required env vars to `.env.example`
Prompt Scaffold:
- Role: Backend engineer.
- Goal: Complete T-204: Implement Media Upload and Management API per Acceptance Criteria.
- Non-Goals: Do not build UI, only backend API and storage integration.
- Context: Secure media management required for visual editor functionality.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md security practices; validate all uploads; enforce size limits.
- Examples: Multipart form uploads, signed URLs for downloads, CDN integration.
- Validation: Upload tests pass; manual testing with various file types and sizes.
- Output Format: Media API implemented and documented.
- Uncertainty: None.
References:
- /app/api/editor/media/ (new directory)
- /lib/media-storage.ts (new)
- /lib/image-optimization.ts (new)
- /docs/VISUAL_EDITOR_API.md
- /.env.example
Dependencies: T-201, T-202
Effort: XL
---

### T-205: Build Visual Editor UI - Color & Font Customization
Priority: P1
Type: FEATURE
Owner: AGENT
Status: READY
Blockers: T-203 must be complete
Context:
- First phase of visual editor UI focuses on color and font customization
- Expand existing theme-editor into full production-ready editor
- Need live preview of changes before publishing
- Should show before/after comparison
Acceptance Criteria:
- [ ] T-205.1: Create `/app/editor/page.tsx` as main editor interface (protected route)
- [ ] T-205.2: Build color picker component with palette management
- [ ] T-205.3: Build font selector with preview of available fonts
- [ ] T-205.4: Implement live preview panel showing changes in real-time
- [ ] T-205.5: Add before/after comparison toggle
- [ ] T-205.6: Integrate with design token API (T-203)
- [ ] T-205.7: Add save/publish workflow with confirmation
- [ ] T-205.8: Add reset to defaults option
- [ ] T-205.9: Implement responsive design for mobile editing
- [ ] T-205.10: Add keyboard shortcuts for common actions
- [ ] T-205.11: Write component tests for editor UI
- [ ] T-205.12: Document editor usage in `/docs/VISUAL_EDITOR_USER_GUIDE.md`
Prompt Scaffold:
- Role: Frontend engineer.
- Goal: Complete T-205: Build Visual Editor UI - Color & Font Customization per Acceptance Criteria.
- Non-Goals: Do not implement image/video/layout editing yet (separate tasks).
- Context: Production-ready visual editor for color and font customization.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; use existing design system; ensure accessibility.
- Examples: Reference /app/theme-editor/theme-editor-client.tsx for patterns.
- Validation: UI tests pass; manual testing on desktop and mobile; accessibility audit.
- Output Format: Editor UI implemented and documented.
- Uncertainty: None.
References:
- /app/editor/page.tsx (new)
- /components/editor/ (new directory)
- /app/theme-editor/theme-editor-client.tsx (reference)
- /docs/VISUAL_EDITOR_USER_GUIDE.md (new)
Dependencies: T-202, T-203
Effort: XL
---

### T-206: Build Visual Editor UI - Image & Video Management
Priority: P1
Type: FEATURE
Owner: AGENT
Status: READY
Blockers: T-204, T-205 must be complete
Context:
- Second phase of visual editor UI adds image and video management
- Drag-and-drop upload with preview
- Image cropping and basic editing tools
- Video thumbnail generation and preview
Acceptance Criteria:
- [ ] T-206.1: Add media library panel to editor interface
- [ ] T-206.2: Implement drag-and-drop upload with progress indication
- [ ] T-206.3: Build image preview and metadata display
- [ ] T-206.4: Add image cropping tool for hero images and thumbnails
- [ ] T-206.5: Implement video thumbnail generation
- [ ] T-206.6: Add video preview player
- [ ] T-206.7: Build media search and filtering (by type, date, tags)
- [ ] T-206.8: Add bulk delete and organize functionality
- [ ] T-206.9: Integrate with media API (T-204)
- [ ] T-206.10: Add accessibility features (alt text editor, captions)
- [ ] T-206.11: Write component tests for media UI
- [ ] T-206.12: Document media management in `/docs/VISUAL_EDITOR_USER_GUIDE.md`
Prompt Scaffold:
- Role: Frontend engineer.
- Goal: Complete T-206: Build Visual Editor UI - Image & Video Management per Acceptance Criteria.
- Non-Goals: Do not implement layout editing yet (separate task).
- Context: Media management interface for visual editor.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; optimize for performance; ensure accessibility.
- Examples: Similar to WordPress media library, Webflow assets panel.
- Validation: UI tests pass; manual testing of upload/preview/delete flows.
- Output Format: Media management UI implemented and documented.
- Uncertainty: None.
References:
- /app/editor/page.tsx
- /components/editor/MediaLibrary.tsx (new)
- /docs/VISUAL_EDITOR_USER_GUIDE.md
Dependencies: T-204, T-205
Effort: XL
---

### T-207: Build Visual Editor UI - Layout & Component Customization
Priority: P1
Type: FEATURE
Owner: AGENT
Status: READY
Blockers: T-205, T-206 must be complete
Context:
- Third phase of visual editor adds layout and component customization
- Visual drag-and-drop interface for rearranging sections
- Component visibility toggles
- Text content editing for hero, value props, services
Acceptance Criteria:
- [ ] T-207.1: Build page structure editor showing all sections/components
- [ ] T-207.2: Implement drag-and-drop reordering of sections
- [ ] T-207.3: Add visibility toggles for optional components
- [ ] T-207.4: Build text content editor with rich text support
- [ ] T-207.5: Add component preset selector (templates for sections)
- [ ] T-207.6: Implement undo/redo functionality
- [ ] T-207.7: Add save draft vs publish workflow
- [ ] T-207.8: Build mobile preview mode
- [ ] T-207.9: Add component-level help text and tooltips
- [ ] T-207.10: Write component tests for layout editor
- [ ] T-207.11: Document layout customization in `/docs/VISUAL_EDITOR_USER_GUIDE.md`
Prompt Scaffold:
- Role: Frontend engineer.
- Goal: Complete T-207: Build Visual Editor UI - Layout & Component Customization per Acceptance Criteria.
- Non-Goals: Do not implement advanced interactions or animations (future enhancement).
- Context: Layout editing interface for visual editor.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; maintain component integrity; preserve accessibility.
- Examples: Similar to Webflow Designer, Builder.io interface.
- Validation: UI tests pass; manual testing of drag-and-drop and text editing.
- Output Format: Layout editor UI implemented and documented.
- Uncertainty: None.
References:
- /app/editor/page.tsx
- /components/editor/LayoutEditor.tsx (new)
- /docs/VISUAL_EDITOR_USER_GUIDE.md
Dependencies: T-205, T-206
Effort: XL
---

### T-208: Implement Visual Editor Deployment Pipeline
Priority: P1
Type: INFRASTRUCTURE
Owner: AGENT
Status: READY
Blockers: T-203, T-204, T-205, T-206, T-207 must be complete
Context:
- Visual editor changes need safe deployment workflow
- Preview environment for testing changes before going live
- One-click publish to production
- Rollback capability for emergencies
Acceptance Criteria:
- [ ] T-208.1: Create preview environment with unique URLs per draft
- [ ] T-208.2: Implement publish workflow that updates production config
- [ ] T-208.3: Add version control for published changes
- [ ] T-208.4: Build rollback interface to revert to previous versions
- [ ] T-208.5: Add deployment status tracking and notifications
- [ ] T-208.6: Implement cache invalidation after publish
- [ ] T-208.7: Add pre-publish validation checks (broken links, missing images)
- [ ] T-208.8: Create deployment history view with diffs
- [ ] T-208.9: Add scheduled publishing option
- [ ] T-208.10: Write integration tests for deployment pipeline
- [ ] T-208.11: Document deployment workflow in `/docs/VISUAL_EDITOR_DEPLOYMENT.md`
Prompt Scaffold:
- Role: DevOps engineer.
- Goal: Complete T-208: Implement Visual Editor Deployment Pipeline per Acceptance Criteria.
- Non-Goals: Do not implement CI/CD for code changes (existing GitHub Actions).
- Context: Safe deployment workflow for visual editor changes.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; ensure zero-downtime deployments; maintain audit trail.
- Examples: Vercel preview deployments, Netlify deploy previews.
- Validation: Deployment tests pass; manual testing of preview/publish/rollback flows.
- Output Format: Deployment pipeline implemented and documented.
- Uncertainty: None.
References:
- /app/api/editor/deploy/ (new directory)
- /lib/deployment.ts (new)
- /docs/VISUAL_EDITOR_DEPLOYMENT.md (new)
Dependencies: T-203, T-204, T-205, T-206, T-207
Effort: XL
---

### T-209: Create Visual Editor User Documentation
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Blockers: T-205, T-206, T-207 must be complete
Context:
- Non-technical users need comprehensive documentation
- Step-by-step guides for common customization tasks
- Video tutorials and screenshots for key workflows
- Troubleshooting guide for common issues
Acceptance Criteria:
- [ ] T-209.1: Write getting started guide in `/docs/VISUAL_EDITOR_QUICKSTART.md`
- [ ] T-209.2: Create customization guides for each feature area:
  - Colors and branding
  - Typography and fonts
  - Images and media
  - Video content
  - Layout and sections
- [ ] T-209.3: Document common workflows with screenshots
- [ ] T-209.4: Create troubleshooting guide with solutions to common issues
- [ ] T-209.5: Write best practices guide for design consistency
- [ ] T-209.6: Document accessibility considerations for editors
- [ ] T-209.7: Create video tutorial scripts (for future recording)
- [ ] T-209.8: Add FAQ section for visual editor
- [ ] T-209.9: Update main README.md to link to visual editor docs
Prompt Scaffold:
- Role: Technical writer.
- Goal: Complete T-209: Create Visual Editor User Documentation per Acceptance Criteria.
- Non-Goals: Do not create developer documentation (separate from user docs).
- Context: Comprehensive user-facing documentation for visual editor.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; write for non-technical audience; use clear screenshots.
- Examples: Similar to WordPress Gutenberg docs, Webflow University.
- Validation: Docs reviewed for clarity and completeness; tested with non-technical users.
- Output Format: User documentation created and linked from main docs.
- Uncertainty: None.
References:
- /docs/VISUAL_EDITOR_QUICKSTART.md (new)
- /docs/VISUAL_EDITOR_USER_GUIDE.md
- /docs/VISUAL_EDITOR_BEST_PRACTICES.md (new)
- /docs/VISUAL_EDITOR_TROUBLESHOOTING.md (new)
- /docs/VISUAL_EDITOR_FAQ.md (new)
- /README.md
Dependencies: T-205, T-206, T-207
Effort: L
---

### T-210: Security Audit for Visual Editor
Priority: P1
Type: SECURITY
Owner: AGENT
Status: READY
Blockers: All visual editor implementation tasks must be complete
Context:
- Visual editor exposes significant attack surface
- Must audit authentication, authorization, input validation
- File upload security particularly critical
- Need to verify CSRF protection, XSS prevention, injection attacks
Acceptance Criteria:
- [ ] T-210.1: Audit authentication implementation for vulnerabilities
- [ ] T-210.2: Review authorization checks for privilege escalation risks
- [ ] T-210.3: Test file upload for malicious file detection
- [ ] T-210.4: Verify input validation for all editor API endpoints
- [ ] T-210.5: Test for XSS vulnerabilities in preview/publish workflows
- [ ] T-210.6: Verify CSRF protection on state-changing operations
- [ ] T-210.7: Test for SQL/NoSQL injection in database operations
- [ ] T-210.8: Review rate limiting for editor API endpoints
- [ ] T-210.9: Test session management for fixation/hijacking
- [ ] T-210.10: Run automated security scanners (OWASP ZAP, Burp Suite)
- [ ] T-210.11: Document security findings in `/docs/VISUAL_EDITOR_SECURITY_AUDIT.md`
- [ ] T-210.12: Remediate any critical or high vulnerabilities found
Prompt Scaffold:
- Role: Security engineer.
- Goal: Complete T-210: Security Audit for Visual Editor per Acceptance Criteria.
- Non-Goals: Do not implement new features, only audit and fix security issues.
- Context: Comprehensive security review of visual editor before production release.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; use industry-standard security testing tools; document all findings.
- Examples: OWASP Top 10 testing, penetration testing methodologies.
- Validation: Security audit complete; critical vulnerabilities remediated; report documented.
- Output Format: Security audit report and remediation plan.
- Uncertainty: None.
References:
- /docs/VISUAL_EDITOR_SECURITY_AUDIT.md (new)
- /app/api/editor/
- /app/editor/
- /lib/auth.ts
- /lib/design-tokens.ts
- /lib/media-storage.ts
Dependencies: T-202, T-203, T-204, T-205, T-206, T-207, T-208
Effort: L
---
