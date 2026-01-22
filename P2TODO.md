# P2TODO.md - Repository Task List

Document Type: Workflow
Last Updated: 2026-01-21
Task Truth Source: **P2TODO.md (P2)**
Other priorities: `P0TODO.md`, `P1TODO.md`, `P3TODO.md`.

This file is the single source of truth for P2 tasks. If another document disagrees, the task record in this file wins (unless the Constitution overrides).

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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /docs/CLOUDFLARE_DEPLOYMENT.md
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
- /wrangler.toml
- /.dev.vars.example
Dependencies: T-013
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /app/blog/
- /app/services/
- /components/Breadcrumbs.tsx
- /docs/OBSERVABILITY.md
Dependencies: None
Effort: M

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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /package.json
- /wrangler.toml
- /docs/CLOUDFLARE_DEPLOYMENT.md
- https://opennext.js.org/cloudflare
Dependencies: T-022
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/actions.ts
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/
- /components/
- /WRONG.md
- /BESTPR.md
Dependencies: None
Effort: S

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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /lib/blog.ts
- /WRONG.md
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /.eslintignore
- /eslint.config.mjs
- /WRONG.md
Dependencies: None
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /__tests__/
- /lib/actions.ts
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /tests/
- /middleware.ts
- /WRONG.md
Dependencies: None
Effort: S

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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /tests/
- /playwright.config.ts
- /PERFECT.md
Dependencies: T-105, T-106
Effort: M

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
- Inconsistent references cause confusion about task truth sources
- sync-todo helper should be clear about optional inputs
Acceptance Criteria:
- [ ] T-144.1: Decide on a canonical non-binding tasks note file (or remove references entirely)
- [ ] T-144.2: Align `scripts/sync-todo.sh` input path and header text with the chosen file
- [ ] T-144.3: Update docs to match (ENHANCEMENT_SUMMARY, GOVERNANCE_HEALTH, REPO_MAP)
- [ ] T-144.4: Update `scripts/README.md` and `scripts/AGENTS.md` if paths or behavior changed
- [ ] T-144.5: Keep `P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md` as the task truth sources in all docs
Prompt Scaffold:
- Role: Documentation specialist.
- Goal: Complete T-144: Reconcile non-binding tasks source references per Acceptance Criteria.
- Non-Goals: Avoid changes outside Acceptance Criteria and References.
- Context: Use the Context section for rationale and the References list for files.
- Constraints: Follow CODEBASECONSTITUTION.md, READMEAI.md, BESTPR.md; keep diffs minimal; do not introduce secrets.
- Examples: See Acceptance Criteria for required sections, commands, or outputs.
- Validation: Satisfy all Acceptance Criteria items; run any listed commands.
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
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
- Output Format: Update referenced files and record outcomes in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md/related docs.
- Uncertainty: None.
References:
- /CHANGELOG.md
- /docs/TEMPLATE_RELEASE_CHECKLIST.md
- /docs/CONTRIBUTING.md
Dependencies: T-013
Effort: M
