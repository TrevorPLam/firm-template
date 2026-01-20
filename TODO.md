# TODO.md — Repository Task List

Document Type: Workflow
Last Updated: 2026-01-20
Task Truth Source: **TODO.md**

This file is the single source of truth for actionable work. If another document disagrees, the task record in this file wins (unless the Constitution overrides).

## Goals (Generic Firm Template)
- Site: High-performance professional services site template
- Hosting: Cloudflare Pages (GitHub integration)
- Standard: Diamond Standard (performance, accessibility, observability, testing)
- Keep: Sentry, PWA, Search
- Contact flow: Store lead in Supabase (server-only) + sync to CRM (configurable)
- No email sending
- Save suspicious submissions but flag them (suspicious = too many requests)
- Required fields: Name, Email, Phone (configurable)
- UX: Return success even if CRM sync fails (best-effort)

## Task Schema (Required)
- **ID**: `T-###` (unique, sequential)
- **Priority**: `P0 | P1 | P2 | P3`
- **Type**: `SECURITY | RELEASE | DEPENDENCY | DOCS | QUALITY | BUG | FEATURE | CHORE`
- **Owner**: `AGENT | Trevor`
- **Status**: `READY | BLOCKED | IN-PROGRESS | IN-REVIEW | DONE`
- **Blockers**: `None` or a short description of what prevents progress
- **Context**: why the task exists (1–5 bullets)
- **Acceptance Criteria**: verifiable checklist (broken into subtasks T-###.#)
- **References**: file paths and/or links inside this repo
- **Dependencies**: task IDs (if any)
- **Effort**: `XS | S | M | L | XL` (XS = < 30 min, S = < 2 hr, M = < 4 hr, L = < 1 day, XL = > 1 day)

### Priority Meaning
- **P0**: BLOCKS BUILD or causes security/data loss — fix immediately
- **P1**: High impact; do within 7 days
- **P2**: Important but not urgent; do within 30 days
- **P3**: Backlog/tech debt; do when convenient

### Ownership Rule
- **Owner: AGENT** — task can be executed by Codex/Claude Code/Copilot in-repo
- **Owner: Trevor** — requires external actions (provider dashboards, DNS, billing, approvals)

---

## 🔴 PHASE 0: Deployment Infrastructure (P0)
> These MUST be configured before any firm can launch.

---

### T-107: Configure Cloudflare Pages deployment
Priority: P0
Type: RELEASE
Owner: Trevor
Status: READY
Blockers: None
Context:
- Cloudflare Pages configuration complete, needs dashboard setup
- wrangler.toml and deployment docs created
- Build scripts already exist in package.json
Acceptance Criteria:
- [ ] T-107.1: Log in to Cloudflare Dashboard and create Pages project
- [ ] T-107.2: Connect GitHub repository
- [ ] T-107.3: Configure build settings (command: npm run pages:build, output: .vercel/output/static)
- [ ] T-107.4: Set NODE_VERSION=20 and CLOUDFLARE_BUILD=true in environment variables
- [ ] T-107.5: Add all required secrets (UPSTASH_REDIS_REST_TOKEN, SENTRY_AUTH_TOKEN, etc.)
- [ ] T-107.6: Add all required environment variables (UPSTASH_REDIS_REST_URL, SENTRY_DSN, etc.)
- [ ] T-107.7: Trigger first deployment and verify build succeeds
- [ ] T-107.8: Configure custom domain if applicable
References:
- /docs/CLOUDFLARE_DEPLOYMENT.md
- /wrangler.toml
- /.dev.vars.example
Dependencies: None
Effort: M

### T-088: Create production environment checklist
Priority: P0
Type: RELEASE
Owner: Trevor
Status: READY
Blockers: None
Context:
- Production env setup should be explicit and verifiable
Acceptance Criteria:
- [ ] T-088.1: Create /docs/PRODUCTION-ENV-CHECKLIST.md with Required/Dev/Optional sections
- [ ] T-088.2: Copy the final list from /env.example and mark required/optional
- [ ] T-088.3: Confirm each required value is set in Cloudflare Pages
References:
- /env.example
- /docs/PRODUCTION-ENV-CHECKLIST.md
Dependencies: None
Effort: XS

### T-086: Verify contact flow in a deployed environment
Priority: P0
Type: RELEASE
Owner: Trevor
Status: READY
Blockers: Contact pipeline implementation must be complete.
Context:
- Launch readiness requires live verification, not just local testing
Acceptance Criteria:
- [ ] T-086.1: Deploy a preview build (Cloudflare Pages preview or equivalent)
- [ ] T-086.2: Submit three forms (valid, invalid, and rapid-fire spammy)
- [ ] T-086.3: Confirm the lead appears in the chosen destination (DB/CRM)
- [ ] T-086.4: Record results (screenshot or notes) in /docs/LAUNCH-VERIFICATION.md
References:
- /docs/LAUNCH-VERIFICATION.md
Dependencies: None
Effort: XS

### T-106: Run Go/No-Go checklist before launch
Priority: P0
Type: RELEASE
Owner: Trevor
Status: BLOCKED
Blockers: T-086 (contact form verification) and T-089 (privacy/terms pages) must be completed first.
Context:
- Final gate to confirm launch readiness
Acceptance Criteria:
- [ ] T-106.1: Verify contact form works in deployed environment
- [ ] T-106.2: Confirm no missing env vars cause startup risk
- [ ] T-106.3: Confirm Privacy + Terms pages exist and load
- [ ] T-106.4: Confirm CI is installed
- [ ] T-106.5: Complete launch smoke test checklist
- [ ] T-106.6: Confirm rollback steps are documented
- [ ] T-106.7: Confirm monitoring is enabled or intentionally disabled
- [ ] T-106.8: Confirm no broken links
References:
- /docs/LAUNCH-SMOKE-TEST.md
- /docs/ROLLBACK.md
- /docs/LAUNCH-VERIFICATION.md
Dependencies: T-086, T-088, T-089
Effort: XS

## 🟠 PHASE 1: Infrastructure & Core Features (P1)
> Industry-agnostic infrastructure tasks

### T-089: Implement privacy + terms pages and footer links
Priority: P1
Type: FEATURE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Legal pages must exist before any firm launch
- Footer links should not 404
- Content should be generic and customizable
Acceptance Criteria:
- [ ] T-089.1: Create /app/privacy/page.tsx and /app/terms/page.tsx with placeholder content
- [ ] T-089.2: Ensure /components/Footer.tsx links resolve without 404s
- [ ] T-089.3: Add basic SEO metadata to privacy/terms pages
References:
- /app/
- /components/Footer.tsx
Dependencies: None
Effort: S

### T-097: Wire distributed rate limiting with Upstash
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Ensure rate limiting works in multi-instance production
Acceptance Criteria:
- [ ] T-097.1: Ensure limiter uses Upstash when credentials exist
- [ ] T-097.2: Ensure fallback behavior is logged/documented for missing credentials
- [ ] T-097.3: Update docs to explain production vs dev limiter behavior
References:
- /lib/actions.ts
- /lib/env.ts
- /docs/DEPLOYMENT.md
Dependencies: None
Effort: S

### T-098: Install analytics provider and track conversions
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Any professional services site needs visibility into traffic and conversions
Acceptance Criteria:
- [ ] T-098.1: Install provider script and ensure it loads without console errors
- [ ] T-098.2: Track contact form submissions as conversion events
- [ ] T-098.3: Update CSP to allow provider (if needed)
- [ ] T-098.4: Document the implementation in /docs/OBSERVABILITY.md
References:
- /lib/analytics.ts
- /lib/env.ts
- /docs/OBSERVABILITY.md
Dependencies: None
Effort: S

---

## 🟡 PHASE 2: Diamond Standard Quality (P2)
> Accessibility, performance, observability, and testing.

### T-058: Performance baselines + budgets (Lighthouse)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: BLOCKED
Blockers: Lighthouse CLI not installed (install globally or set `LIGHTHOUSE_BIN`).
Context:
- Diamond Standard requires strong Core Web Vitals
- Need baseline measurements before setting strict budgets
Acceptance Criteria:
- [x] T-058.1: Add a local Lighthouse config and script
- [ ] T-058.2: Capture baseline metrics for mobile (home/services/pricing/contact)
- [x] T-058.3: Define budgets as regression guards (not arbitrary hard fails)
- [x] T-058.4: Document targets in `/docs/OBSERVABILITY.md`
References:
- /docs/OBSERVABILITY.md
- /package.json
Dependencies: None
Effort: M

### T-070: Monitor and fix transitive build-tool vulnerabilities
Priority: P2
Type: DEPENDENCY
Owner: AGENT
Status: BLOCKED
Blockers: Await upstream fixes in `@cloudflare/next-on-pages` or Cloudflare runtime updates.
Context:
- npm audit reports High/Moderate issues in `path-to-regexp`, `esbuild`, `undici`.
- These are pulled in by `@cloudflare/next-on-pages`.
- Currently on latest adapter version (1.13.16).
Acceptance Criteria:
- [ ] T-070.1: Check for updates to `@cloudflare/next-on-pages`
- [ ] T-070.2: Attempt `npm update` of transitive deps if possible
References:
- /package.json
Dependencies: None
Effort: S

### T-101: Performance verification baseline (Lighthouse)
Priority: P2
Type: QUALITY
Owner: Trevor
Status: BLOCKED
Blockers: T-058 is BLOCKED (Lighthouse CLI not installed).
Context:
- Capture baseline metrics for key pages
Acceptance Criteria:
- [ ] T-101.1: Run Lighthouse on Home and Contact (mobile)
- [ ] T-101.2: Record Performance/Accessibility/SEO scores in /docs/OBSERVABILITY.md
- [ ] T-101.3: Note top offenders for follow-up fixes
References:
- /docs/OBSERVABILITY.md
Dependencies: T-058
Effort: XS

### T-102: Accessibility validation (keyboard + focus)
Priority: P2
Type: QUALITY
Owner: Trevor
Status: DONE
Blockers: None
Completed: 2026-01-11
Context:
- Confirm no obvious accessibility blockers before scaling
Acceptance Criteria:
- [x] T-102.1: Keyboard-only test (nav, menu, contact form)
- [x] T-102.2: Confirm focus visibility and order
- [x] T-102.3: Record results in /docs/ACCESSIBILITY.md
References:
- /docs/ACCESSIBILITY.md
- /components/Navigation.tsx
Dependencies: None
Effort: XS

---

## 🔵 PHASE 3: TEMPLATE SANITIZATION GAME PLAN (P1)
> **DO NOT EXECUTE** - This is a planning phase to document all changes needed to convert from marketing-specific to generic firm template.
> 
> **Goal**: Strip all "Marketing Firm" content and replace with generic placeholders that can be adopted by any professional services vertical (law, accounting, consulting, design, etc.)
> 
> **Key Principles**:
> - Preserve ALL modules, components, features, and functionality
> - Replace specific content with generic, reusable placeholders
> - Maintain the Diamond Standard (performance, accessibility, observability, testing)
> - Keep all technical infrastructure intact (Sentry, PWA, Search, Contact flow, etc.)

### T-200: Analyze and document all marketing-specific content locations
Priority: P1
Type: DOCS
Owner: AGENT
Status: DONE
Blockers: None
Completed: 2026-01-20
Context:
- Need comprehensive inventory of all marketing-specific content
- This analysis informs all subsequent sanitization tasks
Acceptance Criteria:
- [x] T-200.1: Document all hardcoded "Your Dedicated Marketer" references
- [x] T-200.2: Identify all marketing-specific service pages
- [x] T-200.3: List all marketing-specific blog posts
- [x] T-200.4: Identify marketing-specific component content (Hero, ValueProps, etc.)
- [x] T-200.5: Document marketing-specific configuration and metadata
References:
- Repository-wide analysis completed
Dependencies: None
Effort: M

---

### T-201: Replace branding and site identity with placeholders
Priority: P1
Type: CHORE
Owner: AGENT
Status: READY
Blockers: None
Context:
- All references to "Your Dedicated Marketer" / "YD Marketer" / "YD Firms" need generic replacement
- Package name, site name, and all branding should be configurable
- Approximately 365+ references found across the codebase
Acceptance Criteria:
- [ ] T-201.1: Replace package.json name: "your-dedicated-marketer" → "firm-template"
- [ ] T-201.2: Update all "Your Dedicated Marketer" → "Your Firm Name" in:
  - /lib/env.ts (NEXT_PUBLIC_SITE_NAME default)
  - /lib/env.public.ts
  - /lib/blog.ts (default author)
  - /app/api/og/route.tsx
  - All service page metadata
  - /app/layout.tsx metadata and structured data
- [ ] T-201.3: Update Footer.tsx: "YD Marketer" → "Firm Name" and "YD Firms LLC" → "Firm LLC"
- [ ] T-201.4: Update README.md title and description to be generic
- [ ] T-201.5: Update testimonials in SocialProof.tsx to use generic client references
- [ ] T-201.6: Update ServiceDetailLayout.tsx provider name reference
- [ ] T-201.7: Create .env.example with SITE_NAME, SITE_TAGLINE, FIRM_LEGAL_NAME placeholders
References:
- /package.json
- /lib/env.ts
- /lib/env.public.ts
- /lib/blog.ts
- /app/api/og/route.tsx
- /app/layout.tsx
- /components/Footer.tsx
- /components/SocialProof.tsx
- /components/ServiceDetailLayout.tsx
- /README.md
Dependencies: T-200
Effort: L

---

### T-202: Sanitize homepage content (Hero, ValueProps, CTAs)
Priority: P1
Type: CHORE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Homepage contains marketing-specific value propositions and messaging
- Need to replace with generic professional services messaging
- Must preserve component structure and functionality
Acceptance Criteria:
- [ ] T-202.1: Update Hero.tsx:
  - Replace headline: "Your dedicated marketer — that means I'm part of your team." → "Your dedicated professional — delivering expert solutions for your business."
  - Replace body copy with generic professional services messaging
  - Keep CTA structure but update button text to be generic
  - Preserve image and layout structure
- [ ] T-202.2: Update ValueProps.tsx:
  - Replace three marketing-specific value props with generic professional services benefits
  - Keep component structure and icons
  - Make messaging applicable to any vertical (consulting, legal, accounting, design, etc.)
- [ ] T-202.3: Update FinalCTA.tsx with generic call-to-action messaging
- [ ] T-202.4: Update CTASection.tsx with generic messaging
- [ ] T-202.5: Document recommended customization points in component comments
References:
- /components/Hero.tsx
- /components/ValueProps.tsx
- /components/FinalCTA.tsx
- /components/CTASection.tsx
Dependencies: T-201
Effort: M

---

### T-203: Replace marketing-specific services with generic service placeholders
Priority: P1
Type: CHORE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Current services are marketing-specific: SEO, Content Marketing, Social Media, Email Marketing, etc.
- Need generic service categories that work for any professional services firm
- Must preserve all routing, component structure, and functionality
- Keep 8 service pages to match current structure
Acceptance Criteria:
- [ ] T-203.1: Rename service directories and update routes:
  - /app/services/seo → /app/services/service-1
  - /app/services/content → /app/services/service-2
  - /app/services/social → /app/services/service-3
  - /app/services/email → /app/services/service-4
  - /app/services/strategy → /app/services/service-5
  - /app/services/crm → /app/services/service-6
  - /app/services/funnel → /app/services/service-7
  - /app/services/reporting → /app/services/service-8
- [ ] T-203.2: Update each service page.tsx with generic placeholder content:
  - Title: "Service [1-8] | Your Firm Name"
  - Description: Generic professional service description
  - Benefits and features as placeholders
  - Keep component structure (ServiceDetailLayout)
- [ ] T-203.3: Update ServicesOverview.tsx with generic service cards
- [ ] T-203.4: Update /app/services/page.tsx:
  - Replace coreServices array with generic service titles and descriptions
  - Replace supportServices array with generic service titles and descriptions
  - Keep icon structure and layout
- [ ] T-203.5: Update Footer.tsx services links to match new routes
- [ ] T-203.6: Update Navigation.tsx if services are linked there
- [ ] T-203.7: Create CUSTOMIZATION_GUIDE.md documenting how to replace placeholder services
References:
- /app/services/ (all subdirectories)
- /components/ServicesOverview.tsx
- /components/Footer.tsx
- /components/Navigation.tsx
Dependencies: T-201
Effort: XL

---

### T-204: Replace marketing-specific pricing with generic pricing template
Priority: P1
Type: CHORE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Current pricing tiers are marketing-service specific (Starter $1,500, Growth $3,500, Scale $6,000)
- Features listed are marketing-specific (blog posts, SEO, social media, etc.)
- Need generic pricing structure applicable to any professional services firm
Acceptance Criteria:
- [ ] T-204.1: Update /app/pricing/page.tsx:
  - Replace tier names with "Basic", "Professional", "Enterprise"
  - Replace pricing with placeholder "$X,XXX/month" or "Custom"
  - Replace marketing-specific features with generic professional service features
  - Keep pricing table structure and styling
  - Add comments explaining customization points
- [ ] T-204.2: Update FAQ section with industry-agnostic questions
- [ ] T-204.3: Update CTA messaging to be generic
- [ ] T-204.4: Keep all accordion and UI functionality intact
References:
- /app/pricing/page.tsx
Dependencies: T-201
Effort: M

---

### T-205: Remove or genericize all marketing-specific blog content
Priority: P1
Type: CHORE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Current blog posts are all marketing-specific:
  - seo-basics-small-business.mdx
  - content-marketing-small-budget.mdx
  - email-marketing-roi.mdx
  - marketing-metrics-that-matter.mdx
  - social-media-strategy-2025.mdx
- Need to either remove or replace with generic example blog posts
- Blog infrastructure must remain functional
Acceptance Criteria:
- [ ] T-205.1: Remove all 5 marketing-specific blog posts
- [ ] T-205.2: Create 2-3 generic example blog posts:
  - "example-blog-post-1.mdx" - Generic professional services best practices
  - "example-blog-post-2.mdx" - Generic client success story template
  - "example-blog-post-3.mdx" - Generic industry insights template
- [ ] T-205.3: Update blog posts with placeholder author "Your Firm Team"
- [ ] T-205.4: Ensure blog listing page still works with new posts
- [ ] T-205.5: Ensure search index updates correctly
- [ ] T-205.6: Create BLOG_CUSTOMIZATION.md guide for adding real content
References:
- /content/blog/
- /app/blog/page.tsx
- /app/blog/[slug]/page.tsx
- /lib/blog.ts
Dependencies: T-201
Effort: M

---

### T-206: Update documentation to reflect generic template purpose
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- All documentation currently references marketing firm use case
- Need to update to reflect generic professional services template
- Must update setup and customization guides
Acceptance Criteria:
- [ ] T-206.1: Update README.md:
  - Change title to "Professional Services Firm Template"
  - Update description to emphasize generic, adaptable nature
  - Update feature list to be industry-agnostic
  - Add "Getting Started" section explaining customization process
  - Update repository references (from your-dedicated-marketer to firm-template)
- [ ] T-206.2: Update READMEAI.md:
  - Update example references to be generic
  - Remove marketing-specific context
- [ ] T-206.3: Update TODO.md Goals section (already done in T-201)
- [ ] T-206.4: Create CUSTOMIZATION_GUIDE.md:
  - Document all placeholder locations
  - Provide step-by-step guide for adapting template to specific vertical
  - Include branding, services, pricing, and content customization steps
- [ ] T-206.5: Update DEPLOYMENT.md to reference generic firm name
- [ ] T-206.6: Update HUBSPOT_SETUP.md → CRM_SETUP.md (generic CRM integration guide)
- [ ] T-206.7: Review and update all /docs/ files for marketing-specific references
References:
- /README.md
- /READMEAI.md
- /TODO.md
- /docs/ (all files)
Dependencies: T-201, T-202, T-203, T-204, T-205
Effort: L

---

### T-207: Create comprehensive template customization guide
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- Users need clear instructions on how to adapt this template for their specific vertical
- Should cover branding, content, services, and technical configuration
Acceptance Criteria:
- [ ] T-207.1: Create /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md with sections:
  - Overview: What this template provides
  - Quick Start: 30-minute setup checklist
  - Branding Customization: Logos, colors, typography, site name
  - Service Configuration: How to replace generic services with real offerings
  - Content Customization: Hero, About, Pricing, Blog
  - Technical Configuration: Environment variables, integrations
  - Common Verticals: Examples for law firms, consulting, accounting, design agencies
- [ ] T-207.2: Create /docs/PLACEHOLDER_REFERENCE.md:
  - Comprehensive list of all placeholder content locations
  - What needs to be replaced for production use
  - Priority order for replacements
- [ ] T-207.3: Add customization checklist to README.md
- [ ] T-207.4: Create example .env file with all placeholder variables clearly marked
References:
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md (new)
- /docs/PLACEHOLDER_REFERENCE.md (new)
- /README.md
- /.env.example
Dependencies: T-206
Effort: L

---

### T-208: Update navigation and footer to be generic
Priority: P1
Type: CHORE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Navigation links currently point to marketing-specific services
- Footer contains marketing-specific link labels
- Need to make navigation configurable and generic
Acceptance Criteria:
- [ ] T-208.1: Update Navigation.tsx navLinks array:
  - Ensure links point to generic service routes
  - Update link labels to be generic ("Services", "Pricing", "About", "Blog", "Contact")
  - Add comments explaining customization
- [ ] T-208.2: Update Footer.tsx:
  - Update services section with generic service links
  - Update company info section
  - Make social links configurable via environment variables
  - Add comment blocks explaining customization points
- [ ] T-208.3: Ensure all navigation links resolve correctly after service route changes
- [ ] T-208.4: Update sitemap.ts to reflect generic routes
- [ ] T-208.5: Update robots.ts if it contains any specific references
References:
- /components/Navigation.tsx
- /components/Footer.tsx
- /app/sitemap.ts
- /app/robots.ts
Dependencies: T-203
Effort: M

---

### T-209: Sanitize metadata, SEO, and structured data
Priority: P1
Type: CHORE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Metadata throughout the site references marketing firm
- Structured data contains marketing-specific information
- OpenGraph images and social metadata need genericization
Acceptance Criteria:
- [ ] T-209.1: Update /app/layout.tsx:
  - Update metadata title template: "[Page] | Your Firm Name"
  - Update metadata description to generic professional services
  - Update structured data (Organization, WebSite schemas) with placeholders
  - Make URL references environment-variable driven
- [ ] T-209.2: Update /app/api/og/route.tsx:
  - Replace "Your Dedicated Marketer" with configurable firm name
  - Make OG image generation generic
- [ ] T-209.3: Review and update all page-specific metadata exports:
  - /app/services/*/page.tsx
  - /app/pricing/page.tsx
  - /app/blog/page.tsx
- [ ] T-209.4: Update manifest.json (if exists) with generic app information
References:
- /app/layout.tsx
- /app/api/og/route.tsx
- All page.tsx files with metadata exports
- /public/manifest.json
Dependencies: T-201
Effort: M

---

### T-210: Add configuration examples for common professional services verticals
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- Template will be more useful with concrete examples for different verticals
- Users should see how to adapt template for their specific industry
Acceptance Criteria:
- [ ] T-210.1: Create /docs/examples/LAW_FIRM_EXAMPLE.md:
  - Example service structure for law firm
  - Sample service names (Corporate Law, Family Law, Estate Planning, etc.)
  - Sample pricing structure
  - Sample blog topics
- [ ] T-210.2: Create /docs/examples/CONSULTING_FIRM_EXAMPLE.md:
  - Example service structure for consulting
  - Sample service names (Strategy Consulting, Operations, Digital Transformation, etc.)
- [ ] T-210.3: Create /docs/examples/ACCOUNTING_FIRM_EXAMPLE.md:
  - Example service structure for accounting
  - Sample service names (Tax Preparation, Bookkeeping, Audit Services, etc.)
- [ ] T-210.4: Create /docs/examples/DESIGN_AGENCY_EXAMPLE.md:
  - Example service structure for design agency
  - Sample service names (Brand Design, Web Design, UX/UI, etc.)
- [ ] T-210.5: Reference these examples in TEMPLATE_CUSTOMIZATION_GUIDE.md
References:
- /docs/examples/ (new directory)
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: T-207
Effort: M

---

### T-211: Verify all functionality remains intact after sanitization
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: All sanitization tasks (T-201 through T-210) must be complete
Context:
- Must confirm NO functionality was lost during sanitization
- All modules, components, and features must work as before
- Only content should change, not capabilities
Acceptance Criteria:
- [ ] T-211.1: Run full test suite: `npm run test`
- [ ] T-211.2: Run type checking: `npm run type-check`
- [ ] T-211.3: Run linting: `npm run lint`
- [ ] T-211.4: Build project successfully: `npm run build`
- [ ] T-211.5: Verify all pages render correctly:
  - Homepage
  - All 8 service pages
  - Pricing page
  - Blog listing and individual posts
  - Contact page
  - Privacy and Terms pages
  - Search functionality
  - 404 page
- [ ] T-211.6: Test all interactive features:
  - Navigation (desktop and mobile)
  - Contact form submission
  - Search dialog
  - PWA install prompt
  - Mobile menu
- [ ] T-211.7: Verify no broken links: `npm run test:e2e` (if link checking exists)
- [ ] T-211.8: Confirm all environment variables still work correctly
- [ ] T-211.9: Test rate limiting still functions
- [ ] T-211.10: Verify Sentry integration still works
- [ ] T-211.11: Document any functionality changes in /docs/SANITIZATION_VERIFICATION.md
References:
- All test suites
- All application pages
- /docs/SANITIZATION_VERIFICATION.md (new)
Dependencies: T-201, T-202, T-203, T-204, T-205, T-206, T-207, T-208, T-209, T-210
Effort: L

---

### T-212: Create template release checklist
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Blockers: T-211 must be complete
Context:
- Need final checklist before template can be released for public use
- Ensures no marketing-specific content slipped through
Acceptance Criteria:
- [ ] T-212.1: Create /docs/TEMPLATE_RELEASE_CHECKLIST.md:
  - Verify all branding placeholders are in place
  - Confirm no "Your Dedicated Marketer" references remain
  - Confirm all services are generic
  - Verify all blog posts are generic examples
  - Check all documentation is updated
  - Verify customization guides are complete
  - Test build and deployment
  - Verify all links work
  - Check all images are generic or placeholder
- [ ] T-212.2: Run comprehensive grep search for remaining marketing-specific terms:
  - "marketing" (should only appear in generic contexts)
  - "marketer"
  - "dedicated marketer"
  - "YD Marketer"
  - "YD Firms"
- [ ] T-212.3: Review package.json for any marketing-specific metadata
- [ ] T-212.4: Review git repository description and topics
- [ ] T-212.5: Create GitHub release notes explaining template purpose and customization process
- [ ] T-212.6: Update LICENSE if needed
- [ ] T-212.7: Add template badge/shield to README
References:
- /docs/TEMPLATE_RELEASE_CHECKLIST.md (new)
- Repository-wide
Dependencies: T-211
Effort: M

---

## Summary of Sanitization Tasks

**Total Tasks**: 13 (T-200 through T-212)
**Estimated Total Effort**: ~3-4 days of focused work

**Key Changes**:
1. **Branding**: "Your Dedicated Marketer" → Configurable firm name
2. **Services**: 8 marketing-specific services → 8 generic service placeholders
3. **Content**: All marketing-specific messaging → Generic professional services messaging
4. **Blog**: 5 marketing posts → 2-3 generic example posts
5. **Pricing**: Marketing service pricing → Generic pricing template
6. **Documentation**: Complete customization guides for any vertical

**Preserved Functionality**:
- All components and modules (100%)
- Contact form with rate limiting
- Supabase + CRM integration
- Search functionality
- PWA capabilities
- Blog engine
- Analytics integration
- Sentry monitoring
- Build and deployment infrastructure
- All testing infrastructure
- Diamond Standard compliance

**What Changes**: Content, labels, and marketing-specific messaging
**What Stays**: Architecture, features, components, infrastructure, tooling

---

**IMPORTANT**: The tasks above are PLANNING ONLY. Do not execute them. This game plan documents what needs to be done to convert this marketing firm site into a generic professional services template that can be adopted by any vertical firm (law, consulting, accounting, design, etc.).
