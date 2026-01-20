# TODO.md — Repository Task List

Document Type: Workflow
Last Updated: 2026-01-20
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

### T-001: Replace branding and site identity with placeholders
Priority: P0
Type: TEMPLATE
Owner: AGENT
Status: DONE
Blockers: None
Completed: 2026-01-20 (commit: 9685c51)
Context:
- All references to "Your Dedicated Marketer" / "YD Marketer" / "YD Firms" need generic replacement
- Package name, site name, and all branding should be configurable via environment variables
- Approximately 365+ references found across the codebase
Acceptance Criteria:
- [x] T-001.1: Replace package.json name: "your-dedicated-marketer" → "firm-template"
- [x] T-001.2: Update all "Your Dedicated Marketer" → "Your Firm Name" in:
  - /lib/env.ts (NEXT_PUBLIC_SITE_NAME default)
  - /lib/env.public.ts
  - /lib/blog.ts (default author)
  - /app/api/og/route.tsx
  - All service page metadata
  - /app/layout.tsx metadata and structured data
- [x] T-001.3: Update Footer.tsx: "YD Marketer" → "Your Firm Name" and "YD Firms LLC" → "Your Firm LLC"
- [x] T-001.4: Update testimonials in SocialProof.tsx to use generic client references
- [x] T-001.5: Update ServiceDetailLayout.tsx provider name reference
- [x] T-001.6: Create comprehensive .env.example with SITE_NAME, SITE_TAGLINE, FIRM_LEGAL_NAME placeholders
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
Dependencies: None
Effort: L

---

### T-002: Sanitize homepage content (Hero, ValueProps, CTAs)
Priority: P0
Type: TEMPLATE
Owner: AGENT
Status: DONE
Blockers: None
Completed: 2026-01-20 (commit: 69a7805)
Context:
- Homepage contains marketing-specific value propositions and messaging
- Need to replace with generic professional services messaging
- Must preserve component structure and functionality
Acceptance Criteria:
- [x] T-002.1: Update Hero.tsx:
  - Replace headline with generic: "Your dedicated professional — delivering expert solutions for your business."
  - Replace body copy with generic professional services messaging
  - Keep CTA structure but update button text: "Schedule a Consultation" and "Learn More"
  - Preserve image and layout structure
- [x] T-002.2: Update ValueProps.tsx:
  - Replace three marketing-specific value props with generic professional services benefits
  - Keep component structure and icons
  - Make messaging applicable to any vertical (consulting, legal, accounting, design, etc.)
- [x] T-002.3: Update FinalCTA.tsx with generic call-to-action messaging
- [x] T-002.4: Update CTASection.tsx with generic messaging
- [x] T-002.5: Document recommended customization points in component comments
References:
- /components/Hero.tsx
- /components/ValueProps.tsx
- /components/FinalCTA.tsx
- /components/CTASection.tsx
Dependencies: T-001
Effort: M

---

### T-003: Replace marketing services with generic service placeholders
Priority: P0
Type: TEMPLATE
Owner: AGENT
Status: DONE
Blockers: None
Completed: 2026-01-20 (commit: 70c55c3)
Context:
- Current services are marketing-specific: SEO, Content Marketing, Social Media, Email Marketing, etc.
- Need generic service categories that work for any professional services firm
- Must preserve all routing, component structure, and functionality
- Keep 8 service pages to match current structure
Acceptance Criteria:
- [x] T-003.1: Rename service directories and update routes:
  - /app/services/seo → /app/services/service-1
  - /app/services/content → /app/services/service-2
  - /app/services/social → /app/services/service-3
  - /app/services/email → /app/services/service-4
  - /app/services/strategy → /app/services/service-5
  - /app/services/crm → /app/services/service-6
  - /app/services/funnel → /app/services/service-7
  - /app/services/reporting → /app/services/service-8
- [x] T-003.2: Update each service page.tsx with generic placeholder content:
  - Title: "Service [1-8] | Your Firm Name"
  - Description: Generic professional service description
  - Benefits and features as placeholders: "Key Benefit 1", "Feature A", etc.
  - Keep component structure (ServiceDetailLayout)
- [x] T-003.3: Update ServicesOverview.tsx with generic service cards
- [x] T-003.4: Update /app/services/page.tsx:
  - Replace coreServices array with generic service titles: "Core Service 1", "Core Service 2", etc.
  - Replace supportServices array with generic service titles
  - Keep icon structure and layout
- [x] T-003.5: Update Footer.tsx services links to match new routes
- [x] T-003.6: Update Navigation.tsx if services are linked there
- [x] T-003.7: Update sitemap.ts to reflect new routes
References:
- /app/services/ (all subdirectories)
- /components/ServicesOverview.tsx
- /components/Footer.tsx
- /components/Navigation.tsx
- /app/sitemap.ts
Dependencies: T-001
Effort: XL

---

### T-004: Replace marketing pricing with generic pricing template
Priority: P0
Type: TEMPLATE
Owner: AGENT
Status: DONE
Blockers: None
Completed: 2026-01-20
Context:
- Current pricing tiers are marketing-service specific (Starter $1,500, Growth $3,500, Scale $6,000)
- Features listed are marketing-specific (blog posts, SEO, social media, etc.)
- Need generic pricing structure applicable to any professional services firm
Acceptance Criteria:
- [x] T-004.1: Update /app/pricing/page.tsx:
  - Replace tier names with "Basic", "Professional", "Enterprise"
  - Replace pricing with placeholder "Contact for Pricing" or "$X,XXX/month"
  - Replace marketing-specific features with generic professional service features:
    * "Hours per month", "Response time", "Dedicated support", "Custom solutions", etc.
  - Keep pricing table structure and styling
  - Add comments explaining customization points
- [x] T-004.2: Update FAQ section with industry-agnostic questions:
  - "What's included in each tier?"
  - "Can I change tiers later?"
  - "What's your refund policy?"
- [x] T-004.3: Update CTA messaging to be generic
- [x] T-004.4: Keep all accordion and UI functionality intact
References:
- /app/pricing/page.tsx
Dependencies: T-001
Effort: M

---

### T-005: Remove marketing blog content and create generic examples
Priority: P0
Type: TEMPLATE
Owner: AGENT
Status: DONE
Blockers: None
Completed: 2026-01-20
Context:
- Current blog posts are all marketing-specific:
  - seo-basics-small-business.mdx
  - content-marketing-small-budget.mdx
  - email-marketing-roi.mdx
  - marketing-metrics-that-matter.mdx
  - social-media-strategy-2025.mdx
- Need to replace with generic example blog posts
- Blog infrastructure must remain functional
Acceptance Criteria:
- [x] T-005.1: Remove all 5 marketing-specific blog posts from /content/blog/
- [x] T-005.2: Create 3 generic example blog posts:
  - "example-post-1-industry-insights.mdx" - Generic industry insights template
  - "example-post-2-client-success.mdx" - Generic client success story template
  - "example-post-3-best-practices.mdx" - Generic best practices template
- [x] T-005.3: Update blog posts with:
  - author: "Your Firm Team" (placeholder)
  - category: "Industry Insights", "Client Success", "Best Practices"
  - Generic, reusable content that applies to any vertical
- [x] T-005.4: Ensure blog listing page still works with new posts
- [x] T-005.5: Ensure search index updates correctly
- [x] T-005.6: Verify blog post pages render correctly
References:
- /content/blog/
- /app/blog/page.tsx
- /app/blog/[slug]/page.tsx
- /lib/blog.ts
Dependencies: T-001
Effort: M

---

### T-006: Update navigation and footer to be generic
Priority: P0
Type: TEMPLATE
Owner: AGENT
Status: DONE
Blockers: None
Completed: 2026-01-20 (completed in T-003)
Context:
- Navigation links currently point to marketing-specific services
- Footer contains marketing-specific link labels
- Need to make navigation configurable and generic
Acceptance Criteria:
- [x] T-006.1: Update Navigation.tsx navLinks array:
  - Ensure links point to generic service routes (/services, /pricing, /about, /blog, /contact)
  - Update link labels to be generic
  - Add comments explaining customization
- [x] T-006.2: Update Footer.tsx:
  - Update services section with generic service links (or remove if using generic route)
  - Update company info section to use placeholders
  - Make social links configurable via environment variables or comments
  - Add comment blocks explaining customization points
- [x] T-006.3: Ensure all navigation links resolve correctly after service route changes
- [x] T-006.4: Update robots.ts if it contains any specific references
References:
- /components/Navigation.tsx
- /components/Footer.tsx
- /app/robots.ts
Dependencies: T-003
Effort: M

---

### T-007: Sanitize metadata, SEO, and structured data
Priority: P0
Type: TEMPLATE
Owner: AGENT
Status: DONE
Blockers: None
Completed: 2026-01-20
Type: TEMPLATE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Metadata throughout the site references marketing firm
- Structured data contains marketing-specific information
- OpenGraph images and social metadata need genericization
Acceptance Criteria:
- [x] T-007.1: Update /app/layout.tsx:
  - Update metadata title template: "[Page] | Your Firm Name"
  - Update metadata description to generic professional services
  - Update structured data (Organization, WebSite schemas) with environment variable placeholders
  - Make URL references environment-variable driven
- [x] T-007.2: Update /app/api/og/route.tsx:
  - Replace "Your Dedicated Marketer" with configurable firm name from env
  - Make OG image generation generic
- [x] T-007.3: Review and update all page-specific metadata exports:
  - /app/services/*/page.tsx (use generic service names)
  - /app/pricing/page.tsx
  - /app/blog/page.tsx
- [x] T-007.4: Update /public/manifest.json (if exists) with generic app information
References:
- /app/layout.tsx
- /app/api/og/route.tsx
- All page.tsx files with metadata exports
- /public/manifest.json
Dependencies: T-001, T-003
Effort: M

---

### T-008: Verify all functionality remains intact after sanitization
Priority: P0
Type: QUALITY
Owner: AGENT
Status: DONE
Blockers: None
Completed: 2026-01-20
Context:
- Must confirm NO functionality was lost during sanitization
- All modules, components, and features must work as before
- Only content should change, not capabilities
Acceptance Criteria:
- [x] T-008.1: Run full test suite: `npm run test`
- [x] T-008.2: Run type checking: `npm run type-check`
- [x] T-008.3: Run linting: `npm run lint`
- [x] T-008.4: Build project successfully: `npm run build`
- [x] T-008.5: Verify all pages render correctly:
  - Homepage
  - All 8 service pages
  - Pricing page
  - Blog listing and individual posts
  - Contact page
  - Search functionality
  - 404 page
- [x] T-008.6: Test all interactive features:
  - Navigation (desktop and mobile)
  - Contact form submission
  - Search dialog
  - Mobile menu
- [x] T-008.7: Verify no broken links
- [x] T-008.8: Confirm all environment variables still work correctly
- [x] T-008.9: Test rate limiting still functions
- [x] T-008.10: Document verification results in /docs/SANITIZATION_VERIFICATION.md
References:
- All test suites
- All application pages
- /docs/SANITIZATION_VERIFICATION.md (new)
Dependencies: T-001, T-002, T-003, T-004, T-005, T-006, T-007
Effort: L

---

## 🟠 PHASE 2: TEMPLATE DOCUMENTATION (P1)
> Create comprehensive documentation for template users.
> These tasks help users customize the template for their specific needs.

### T-009: Update README.md for template users
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- README currently describes a marketing firm
- Need to transform it into template documentation
- Should be clear, actionable, and help users get started quickly
Acceptance Criteria:
- [ ] T-009.1: Update README.md title to "Professional Services Firm Template"
- [ ] T-009.2: Update description to emphasize:
  - This is a reusable template for any professional services vertical
  - Production-ready with Diamond Standard quality
  - Easily customizable for law, consulting, accounting, design, etc.
- [ ] T-009.3: Add "Template Features" section highlighting:
  - 8 customizable service pages
  - Configurable branding and content
  - Built-in blog engine
  - Contact form with rate limiting
  - CRM integration ready (Supabase + configurable)
- [ ] T-009.4: Update Quick Start section with template-specific instructions:
  - Fork/clone repository
  - Configure environment variables
  - Customize content
  - Deploy to Cloudflare Pages
- [ ] T-009.5: Add "Customization" section with links to detailed guides
- [ ] T-009.6: Update repository references throughout
- [ ] T-009.7: Add badges for template status
References:
- /README.md
Dependencies: T-008
Effort: M

---

### T-010: Create comprehensive template customization guide
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- Users need clear instructions on how to adapt this template for their specific vertical
- Should cover branding, content, services, and technical configuration
- Multiple audience levels: quick setup vs full customization
Acceptance Criteria:
- [ ] T-010.1: Create /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md with sections:
  - Overview: What this template provides
  - Quick Start: 30-minute basic setup checklist
  - Branding Customization: 
    * Environment variables (SITE_NAME, SITE_TAGLINE, etc.)
    * Logos and favicons
    * Color scheme (Tailwind config)
    * Typography
  - Content Customization:
    * Homepage (Hero, ValueProps)
    * About page (if needed)
    * Services (replacing generic placeholders)
    * Pricing structure
    * Blog content
  - Technical Configuration:
    * Environment variables reference
    * Database setup (Supabase)
    * CRM integration (HubSpot, Salesforce, etc.)
    * Analytics providers
    * Monitoring (Sentry)
  - Deployment:
    * Cloudflare Pages setup
    * Custom domain configuration
    * Environment variables in production
- [ ] T-010.2: Create /docs/PLACEHOLDER_REFERENCE.md:
  - Comprehensive list of all placeholder content locations
  - Priority order for replacements
  - What's required vs optional for launch
- [ ] T-010.3: Add customization checklist to README.md
- [ ] T-010.4: Create example .env file with all required variables clearly documented
References:
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md (new)
- /docs/PLACEHOLDER_REFERENCE.md (new)
- /README.md
- /.env.example
Dependencies: T-009
Effort: L

---

### T-011: Add vertical-specific configuration examples
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- Template will be more useful with concrete examples for different industries
- Users should see how to adapt template for their specific vertical
- Examples make the template more accessible and reduce setup time
Acceptance Criteria:
- [ ] T-011.1: Create /docs/examples/ directory
- [ ] T-011.2: Create /docs/examples/LAW_FIRM_EXAMPLE.md:
  - Example service structure (Corporate Law, Family Law, Estate Planning, Litigation, etc.)
  - Sample pricing structure for legal services
  - Sample blog topics
  - Recommended environment variables
- [ ] T-011.3: Create /docs/examples/CONSULTING_FIRM_EXAMPLE.md:
  - Example service structure (Strategy, Operations, Digital Transformation, Change Management, etc.)
  - Sample pricing (project-based, retainer, etc.)
  - Sample blog topics
- [ ] T-011.4: Create /docs/examples/ACCOUNTING_FIRM_EXAMPLE.md:
  - Example service structure (Tax Preparation, Bookkeeping, Audit, Financial Planning, etc.)
  - Sample pricing structure
  - Sample blog topics
- [ ] T-011.5: Create /docs/examples/DESIGN_AGENCY_EXAMPLE.md:
  - Example service structure (Brand Design, Web Design, UX/UI, Motion Graphics, etc.)
  - Sample pricing (project-based, hourly, retainer)
  - Sample blog topics
- [ ] T-011.6: Reference these examples in TEMPLATE_CUSTOMIZATION_GUIDE.md
- [ ] T-011.7: Add a "Common Verticals" section to README.md with links to examples
References:
- /docs/examples/ (new directory)
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
- /README.md
Dependencies: T-010
Effort: M

---

### T-012: Update governance docs for template purpose
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Blockers: None
Context:
- READMEAI.md, PROJECT_STATUS.md, and other governance docs reference marketing firm
- Need to update to reflect template purpose and current state
- Should maintain governance structure while updating context
Acceptance Criteria:
- [ ] T-012.1: Update READMEAI.md:
  - Update purpose statement to reflect template nature
  - Keep governance structure intact
  - Update any examples to be generic
- [ ] T-012.2: Update PROJECT_STATUS.md:
  - Update current snapshot to reflect template conversion complete
  - Add decision record for template conversion
  - Update phase to "Template Released / Ready for User Customization"
  - Document any new risks or considerations
- [ ] T-012.3: Update AGENTS.md if it contains marketing-specific context
- [ ] T-012.4: Review CODEBASECONSTITUTION.md - likely no changes needed
- [ ] T-012.5: Create /docs/TEMPLATE_ARCHITECTURE.md:
  - Document the architecture decisions
  - Explain the tech stack choices
  - Describe the Diamond Standard implementation
  - Explain why Cloudflare Pages (edge runtime benefits)
References:
- /READMEAI.md
- /PROJECT_STATUS.md
- /AGENTS.md
- /CODEBASECONSTITUTION.md
- /docs/TEMPLATE_ARCHITECTURE.md (new)
Dependencies: T-010
Effort: M

---

### T-013: Create template release checklist
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Blockers: T-008 must be complete
Context:
- Need final verification before template can be released for public use
- Ensures no marketing-specific content slipped through
- Provides confidence for first users
Acceptance Criteria:
- [ ] T-013.1: Create /docs/TEMPLATE_RELEASE_CHECKLIST.md with sections:
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
- [ ] T-013.2: Run comprehensive grep search for remaining marketing-specific terms:
  - "marketing" (should only appear in generic contexts or as example)
  - "marketer"
  - "dedicated marketer"
  - "YD Marketer"
  - "YD Firms"
- [ ] T-013.3: Review package.json for any marketing-specific metadata
- [ ] T-013.4: Review git repository settings (description, topics, etc.)
- [ ] T-013.5: Create GitHub release with template v1.0.0:
  - Release notes explaining template purpose
  - Link to customization guide
  - Quick start instructions
  - Known limitations or considerations
- [ ] T-013.6: Add template badge/shield to README
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
References:
- /docs/CLOUDFLARE_DEPLOYMENT.md
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
- /wrangler.toml
- /.dev.vars.example
Dependencies: T-013
Effort: M

---

### T-015: Create production environment checklist
Priority: P2
Type: INFRASTRUCTURE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Template users need clear guidance on production environment setup
- Should be explicit and verifiable
- Helps prevent deployment issues
Acceptance Criteria:
- [ ] T-015.1: Create /docs/PRODUCTION-ENV-CHECKLIST.md with sections:
  - Required Environment Variables (site will not work without these)
  - Optional Environment Variables (enhance functionality)
  - Development-Only Variables (not needed in production)
- [ ] T-015.2: For each variable, document:
  - Purpose and usage
  - Where to obtain value
  - Example format
  - Security considerations
- [ ] T-015.3: Include verification steps for each variable
- [ ] T-015.4: Add to TEMPLATE_CUSTOMIZATION_GUIDE.md
References:
- /env.example
- /docs/PRODUCTION-ENV-CHECKLIST.md (new)
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: T-014
Effort: S

---

### T-016: Implement privacy + terms pages
Priority: P2
Type: INFRASTRUCTURE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Legal pages must exist for any professional services site
- Footer links currently point to these pages
- Need generic templates that users can customize
Acceptance Criteria:
- [ ] T-016.1: Create /app/privacy/page.tsx with generic privacy policy template
- [ ] T-016.2: Create /app/terms/page.tsx with generic terms of service template
- [ ] T-016.3: Use placeholder text with clear markers: [YOUR FIRM NAME], [YOUR STATE/COUNTRY], etc.
- [ ] T-016.4: Ensure Footer.tsx links resolve without 404s
- [ ] T-016.5: Add basic SEO metadata to privacy/terms pages
- [ ] T-016.6: Add prominent notice that these are templates and must be reviewed by legal counsel
- [ ] T-016.7: Document in TEMPLATE_CUSTOMIZATION_GUIDE.md that legal pages MUST be customized
References:
- /app/privacy/page.tsx (new)
- /app/terms/page.tsx (new)
- /components/Footer.tsx
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: None
Effort: S

---

### T-017: Wire distributed rate limiting with Upstash
Priority: P2
Type: INFRASTRUCTURE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Ensure rate limiting works in multi-instance production
- Already implemented but needs verification and documentation
Acceptance Criteria:
- [ ] T-017.1: Verify limiter uses Upstash when credentials exist
- [ ] T-017.2: Ensure fallback behavior is logged/documented for missing credentials
- [ ] T-017.3: Update docs to explain production vs dev limiter behavior
- [ ] T-017.4: Add to TEMPLATE_CUSTOMIZATION_GUIDE.md deployment section
References:
- /lib/actions.ts
- /lib/env.ts
- /docs/DEPLOYMENT.md
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: None
Effort: S

---

### T-018: Document analytics provider integration
Priority: P2
Type: INFRASTRUCTURE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Template includes analytics integration framework
- Need to document how users can add their own analytics provider
- Should support common providers (Google Analytics, Plausible, Fathom, etc.)
Acceptance Criteria:
- [ ] T-018.1: Document analytics integration in TEMPLATE_CUSTOMIZATION_GUIDE.md
- [ ] T-018.2: Provide examples for common providers:
  - Google Analytics 4
  - Plausible Analytics
  - Fathom Analytics
- [ ] T-018.3: Document CSP header updates needed for each provider
- [ ] T-018.4: Document conversion tracking setup
- [ ] T-018.5: Update /docs/OBSERVABILITY.md with analytics section
References:
- /lib/analytics.ts
- /lib/env.ts
- /docs/OBSERVABILITY.md
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: None
Effort: S

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
- [ ] T-020.1: Document known vulnerabilities in SECURITY.md
- [ ] T-020.2: Check for updates to `@cloudflare/next-on-pages` monthly
- [ ] T-020.3: Document mitigation strategies for template users
- [ ] T-020.4: Set up Dependabot or similar for automated updates
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
Status: READY
Blockers: None
Context:
- Template should meet WCAG 2.1 AA standards minimum
- Already has good accessibility features but needs comprehensive audit
- Should document accessibility features for users
Acceptance Criteria:
- [ ] T-021.1: Run automated accessibility tests (axe-core, pa11y, etc.)
- [ ] T-021.2: Keyboard navigation testing on all pages
- [ ] T-021.3: Screen reader testing (major pages)
- [ ] T-021.4: Document accessibility features in README.md:
  - Keyboard navigation support
  - ARIA labels
  - Focus management
  - Color contrast
  - Semantic HTML
- [ ] T-021.5: Create /docs/ACCESSIBILITY.md with:
  - Current compliance level
  - Known issues (if any)
  - Testing methodology
  - Recommendations for maintaining accessibility
References:
- /docs/ACCESSIBILITY.md
- /README.md
- All components
Dependencies: None
Effort: M

---

## Summary

**Total Tasks**: 21 (T-001 through T-021)
**Estimated Total Effort**: ~3-4 days of focused work

### By Priority
- **P0 (Critical)**: 8 tasks - Template sanitization and core verification
- **P1 (High)**: 5 tasks - Documentation for template users
- **P2 (Medium)**: 4 tasks - Infrastructure and deployment support
- **P3 (Low)**: 4 tasks - Quality improvements and optimizations

### By Phase
- **Phase 1 (Sanitization)**: 8 tasks - Convert marketing firm to generic template
- **Phase 2 (Documentation)**: 5 tasks - Help users customize the template
- **Phase 3 (Infrastructure)**: 4 tasks - Deployment and configuration support
- **Phase 4 (Quality)**: 4 tasks - Performance and accessibility optimization

### What Changes (Content Only)
- Branding: "Your Dedicated Marketer" → Configurable placeholders
- Services: 8 marketing-specific → 8 generic service placeholders
- Blog: 5 marketing posts → 3 generic example posts
- Pricing: Marketing-specific → Generic pricing template
- Components: Marketing messaging → Generic professional services messaging
- Documentation: Marketing context → Template user documentation

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

**Next Steps**: Execute Phase 1 tasks (T-001 through T-008) to complete core template sanitization.
