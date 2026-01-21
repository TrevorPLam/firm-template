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
References:
- /docs/ACCESSIBILITY.md
- /README.md
- All components
Dependencies: None
Effort: M

---

## 🟣 PHASE 5: PLATINUM STANDARD ENHANCEMENTS (P0-P3)
> **BEYOND DIAMOND**: These tasks elevate the template from "excellent" to "platinum standard"
> Based on industry research, WebAward criteria, and best-in-class professional services sites
> See PLATINUM_STANDARD_ANALYSIS.md for detailed research and rationale

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
- Identified in TEMPLATE_ASSESSMENT_REPORT.md
Acceptance Criteria:
- [ ] T-022.1: Upgrade Next.js to 15.5.3 or latest patched version
- [ ] T-022.2: Verify build works with Cloudflare adapter
- [ ] T-022.3: Run full test suite (npm run test, npm run type-check)
- [ ] T-022.4: Test local development server
- [ ] T-022.5: Document version change in CHANGELOG.md
- [ ] T-022.6: Update package.json and package-lock.json
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
References:
- /package.json
- /wrangler.toml
- /docs/CLOUDFLARE_DEPLOYMENT.md
- https://opennext.js.org/cloudflare
Dependencies: T-022
Effort: M

---

### T-024: Add optional transactional email integration
Priority: P2
Type: INFRASTRUCTURE
Owner: AGENT
Status: DONE
Blockers: None
Completed: 2026-01-21
Context:
- Contact form stores leads in Supabase and syncs to CRM
- No email notifications to business owner or customer
- Many businesses want email alerts for new leads
- Should be optional and configurable
Acceptance Criteria:
- [x] T-024.1: Add email provider options to env.ts:
  - SendGrid (most popular)
  - Postmark (developer-friendly)
  - Resend (modern, simple)
- [x] T-024.2: Create /lib/email.ts with email sending logic
- [x] T-024.3: Add email templates:
  - Lead notification to business owner
  - Thank you email to customer (optional)
- [x] T-024.4: Update contact form action to send emails (optional)
- [x] T-024.5: Add environment variables:
  - EMAIL_PROVIDER (sendgrid|postmark|resend|none)
  - EMAIL_API_KEY
  - EMAIL_FROM_ADDRESS
  - EMAIL_TO_ADDRESS (business owner)
- [x] T-024.6: Document setup in TEMPLATE_CUSTOMIZATION_GUIDE.md
- [x] T-024.7: Add to .env.example with clear instructions
- [x] T-024.8: Test email sending with each provider
References:
- /lib/actions.ts
- /lib/email.ts (new)
- /lib/env.ts
- /.env.example
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: T-010
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
- Identified in PLATINUM_STANDARD_ANALYSIS.md
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
References:
- /components/Chatbot.tsx (new)
- /lib/chatbot.ts (new)
- /lib/env.ts
- /.env.example
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: T-010
Effort: M

---

### T-032: Integrate Appointment Scheduling (Calendly/Cal.com)
Priority: P1
Type: INFRASTRUCTURE
Owner: AGENT
Status: DONE
Blockers: None
Completed: 2026-01-21
Context:
- Reduces booking friction by 40% according to conversion studies
- Standard feature on 73% of consulting/professional services sites
- Eliminates back-and-forth email scheduling
- Improves user experience significantly
- Identified in PLATINUM_STANDARD_ANALYSIS.md
Acceptance Criteria:
- [x] T-032.1: Create AppointmentScheduler component
  - Support Calendly embed
  - Support Cal.com (open source alternative)
  - Configurable via environment variables
- [x] T-032.2: Add scheduling CTAs to:
  - Homepage
  - Services pages
  - Contact page
  - Pricing page
- [x] T-032.3: Create modal/popup option for inline booking
- [x] T-032.4: Add environment variables:
  - SCHEDULING_PROVIDER (calendly|calcom|none)
  - CALENDLY_URL or CALCOM_USERNAME
- [x] T-032.5: Style to match template design system
- [x] T-032.6: Document setup in TEMPLATE_CUSTOMIZATION_GUIDE.md
- [x] T-032.7: Test booking flow end-to-end
References:
- /components/AppointmentScheduler.tsx (new)
- /lib/env.ts
- /.env.example
- /app/contact/page.tsx
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: T-010
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
- Identified in PLATINUM_STANDARD_ANALYSIS.md
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
- Identified in PLATINUM_STANDARD_ANALYSIS.md
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
References:
- /app/resources/page.tsx (new)
- /app/resources/[slug]/page.tsx (new)
- /components/ResourceDownload.tsx (new)
- /public/resources/ (new directory)
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: T-010, T-024
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
- Identified in PLATINUM_STANDARD_ANALYSIS.md
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
- Identified in PLATINUM_STANDARD_ANALYSIS.md
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
- Identified in PLATINUM_STANDARD_ANALYSIS.md
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
References:
- /components/NewsletterPopup.tsx (new)
- /lib/newsletter.ts (new)
- /app/layout.tsx (add popup)
- /docs/TEMPLATE_CUSTOMIZATION_GUIDE.md
Dependencies: T-010, T-024
Effort: S

---

## Summary

**Total Tasks**: 39 (T-001 through T-039; completed tasks archived in TODOCOMPLETED.md)
**Estimated Total Effort**: ~10-12 days of focused work

### By Priority
- **P0 (Critical)**: 9 tasks - Template sanitization, core verification, security fixes
- **P1 (High)**: 9 tasks - Documentation, platinum-standard essentials
- **P2 (Medium)**: 10 tasks - Infrastructure, advanced platinum features
- **P3 (Low)**: 11 tasks - Quality improvements, elite differentiators

### By Phase
- **Phase 1 (Sanitization)**: 8 tasks - Convert marketing firm to generic template ✅ DONE
- **Phase 2 (Documentation)**: 5 tasks - T-009, T-010, T-011, T-012 complete; T-013 in review (repo-owner steps pending)
- **Phase 3 (Infrastructure)**: 4 tasks - Deployment and configuration support
- **Phase 4 (Quality)**: 4 tasks - Performance and accessibility optimization
- **Phase 5 (Platinum Standard)**: 18 tasks - Industry-leading enhancements

### Platinum Standard Path
- **Phase 5A (Essentials)**: T-022, T-023, T-024, T-030, T-031, T-032, T-033 → 88/100 (Industry Standard)
- **Phase 5B (Advanced)**: T-034, T-036, T-037, T-039 → 95/100 (Exceeds Standard)
- **Phase 5C (Elite)**: T-025, T-026, T-027, T-028, T-029, T-038 → 98/100 (Platinum)

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

**Next Steps**: Complete remaining external steps for T-013 (repo settings + GitHub release), then Phase 5A for platinum-standard essentials.
