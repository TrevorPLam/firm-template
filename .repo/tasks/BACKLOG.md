# 📋 Task Backlog

> **Prioritized Queue** — All open tasks ordered by priority (P0 highest → P3 lowest).

---

## Workflow Instructions

### Adding New Tasks:
1. Use the standard task format (see template below)
2. Assign appropriate priority: P0 (Critical) | P1 (High) | P2 (Medium) | P3 (Low)
3. Insert task in correct priority order (P0 tasks at top)
4. Include clear acceptance criteria

### Promoting Tasks:
1. When `TODO.md` is empty, move the TOP task from this file to `TODO.md`
2. Update status from `Pending` to `In Progress`
3. Remove the task from this file

### Task Format Template:
```markdown
### [TASK-XXX] Task Title
- **Priority:** P0 | P1 | P2 | P3
- **Status:** Pending
- **Created:** YYYY-MM-DD
- **Context:** Brief description of why this task matters

#### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

#### Notes
- Any relevant context or links
```

---

## Priority Legend
| Priority | Meaning | SLA |
|----------|---------|-----|
| **P0** | Critical / Blocking | Immediate |
| **P1** | High / Important | This week |
| **P2** | Medium / Should do | This month |
| **P3** | Low / Nice to have | When possible |

---

## P0 — Critical

## P1 — High

### [TASK-018] Add Analytics Tracking to Contact Form
- **Priority:** P1
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Contact form doesn't track successful submissions for analytics. Task T-064 referenced but not implemented.

#### Acceptance Criteria
- [ ] Integrate analytics tracking in `components/ContactForm.tsx`
- [ ] Track event on successful form submission
- [ ] Use `lib/analytics.ts` or integrate GA4/Plausible directly
- [ ] Track event: `contact_form_submitted` with metadata (source page, etc.)
- [ ] Ensure sensitive user data is not sent to analytics
- [ ] Add unit test to verify analytics event is triggered

#### Notes
- File: `components/ContactForm.tsx:53` (comment indicates missing)
- Related: Task T-064 pending (analytics provider selection)
- Impact: Medium - Missing conversion tracking

---

### [TASK-004] Create .github/copilot-instructions.md
- **Priority:** P1
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Context engineering file for GitHub Copilot and VS Code AI features.

#### Acceptance Criteria
- [ ] Document product vision and architecture principles
- [ ] Include contribution guidelines for AI
- [ ] Reference supporting docs (ARCHITECTURE.md, PRODUCT.md)
- [ ] Test with Copilot to verify context is picked up

#### Notes
- Part of the VS Code context engineering workflow standard

---

### [TASK-005] Create PRODUCT.md
- **Priority:** P1
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Product vision document giving AI context about WHY features exist.

#### Acceptance Criteria
- [ ] Define firm-template product vision and mission
- [ ] Document target users (service firms)
- [ ] List key features and their business value
- [ ] Include product roadmap priorities

#### Notes
- AI agents need product context to make good decisions

---

### [TASK-006] Expand docs/ARCHITECTURE.md
- **Priority:** P1
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Current file is 14 lines. Needs comprehensive system documentation.

#### Acceptance Criteria
- [ ] Add Mermaid diagrams for system architecture
- [ ] Document module ownership and boundaries
- [ ] Explain data flow and integration patterns
- [ ] Include decision rationale for key choices

#### Notes
- Critical for AI to understand system structure

---

## P2 — Medium

### [TASK-019] Improve Search Index Generation
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Search index uses hardcoded `staticPages` array requiring manual updates. Should auto-generate from filesystem or route metadata.

#### Acceptance Criteria
- [ ] Auto-generate `staticPages` from `app/` filesystem scan or route metadata
- [ ] Sync with sitemap generation (`app/sitemap.ts`)
- [ ] Add caching strategy for search index in development mode
- [ ] Ensure search index is still generated correctly at build time
- [ ] Add unit tests for improved search index generation

#### Notes
- File: `lib/search.ts:100-149`
- Impact: Medium - Maintenance burden
- Effort: Medium

---

### [TASK-020] Expand E2E Test Coverage
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** E2E test coverage is limited (only 3 test files). Missing critical user flows.

#### Acceptance Criteria
- [ ] Add Playwright tests for blog navigation (listing, individual posts)
- [ ] Add Playwright tests for search functionality
- [ ] Add Playwright tests for all service pages
- [ ] Add Playwright tests for common error scenarios (404 page)
- [ ] Add Playwright tests for mobile menu interactions
- [ ] Add Playwright tests for PWA installation prompt

#### Notes
- Directory: `tests/e2e/`
- Current: Only 3 test files (contact-submit, critical-flows, home)
- Impact: Medium - Quality assurance
- Effort: High

---

### [TASK-021] Add Error Boundaries for Async Operations
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** While global ErrorBoundary exists, components performing async operations may not have specific error boundaries, leading to degraded UX.

#### Acceptance Criteria
- [ ] Identify components that perform async data fetching
- [ ] Wrap these components or their async logic with local error boundaries
- [ ] Provide specific fallback UI for these local error boundaries
- [ ] Ensure errors are logged correctly to Sentry
- [ ] Document the strategy for handling async errors in components

#### Notes
- Files: Various components
- Impact: Medium - User experience
- Effort: Medium

---

### [TASK-022] Add Retry Logic for HubSpot Sync Failures
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** HubSpot sync in `lib/actions.ts` has no retry logic. Network failures or temporary API issues cause permanent failures.

#### Acceptance Criteria
- [ ] Add retry logic with exponential backoff for HubSpot API calls
- [ ] Implement maximum retry attempts (e.g., 3 retries)
- [ ] Log retry attempts and final failures
- [ ] Consider implementing a queue for failed syncs
- [ ] Add unit tests for retry logic

#### Notes
- File: `lib/actions.ts:331-381`
- Impact: Medium - Data consistency
- Effort: Medium

---

### [TASK-023] Add Caching for Blog Posts in Development
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Blog posts are re-read from filesystem on every request in development mode, leading to unnecessary I/O and slower dev experience.

#### Acceptance Criteria
- [ ] Implement in-memory caching mechanism for blog posts in `lib/blog.ts`
- [ ] Ensure cache is only active in development mode
- [ ] Implement cache invalidation strategy (watch for file changes or time-based expiry)
- [ ] Verify that caching improves development server response times
- [ ] Ensure production builds are not affected

#### Notes
- File: `lib/blog.ts:160-172`
- Impact: Low - Development experience
- Effort: Low

---

### [TASK-007] Create docs/adr/ Folder with ADR Template
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Architecture Decision Records document WHY decisions were made.

#### Acceptance Criteria
- [ ] Create `docs/adr/` directory
- [ ] Add ADR template (ADR-000-template.md)
- [ ] Create first ADR for multi-tenancy model
- [ ] Document ADR process in docs/architecture/decisions/

#### Notes
- ADRs help AI understand historical context

---

### [TASK-008] Enable OpenAPI Drift Detection in CI
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** OpenAPI check job is disabled (`if: false`) in CI workflow.

#### Acceptance Criteria
- [ ] Fix blocking issues preventing OpenAPI generation
- [ ] Enable the `openapi-check` job
- [ ] Ensure schema drift fails CI
- [ ] Document OpenAPI workflow in CONTRIBUTING.md

#### Notes
- Committed OpenAPI artifact is single source of truth for API

---

### [TASK-009] Add Worker Runtime for Job Queue
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Job queue models exist but no worker process to execute them.

#### Acceptance Criteria
- [ ] Create management command or worker process
- [ ] Add worker service to docker-compose.yml
- [ ] Document worker scaling strategy
- [ ] Add health checks for worker

#### Notes
- Per ANALYSIS.md: jobs modeled in DB but can't run
- backend/modules/jobs/models.py defines JobQueue/DLQ

---

## P3 — Low

### [TASK-024] Extract Mobile Menu into Separate Component
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** `Navigation.tsx` is overly complex (296 lines) due to mixing desktop navigation, mobile menu logic, and search integration.

#### Acceptance Criteria
- [ ] Create new `MobileMenu.tsx` component
- [ ] Move all mobile menu-specific state, logic, and JSX from `Navigation.tsx`
- [ ] Ensure `MobileMenu.tsx` receives necessary props (navLinks, searchItems, isOpen, onClose)
- [ ] Update `Navigation.tsx` to render `MobileMenu.tsx` conditionally
- [ ] Verify mobile menu functionality remains unchanged
- [ ] Add unit tests for `MobileMenu.tsx`

#### Notes
- File: `components/Navigation.tsx` (296 lines)
- Impact: Low - Code organization
- Effort: Low

---

### [TASK-025] Add Focus Trap for Modal Dialogs
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Modal dialogs (AppointmentScheduler, SearchDialog) don't trap focus, which is an accessibility improvement.

#### Acceptance Criteria
- [ ] Add focus trap to `AppointmentScheduler` modal dialog
- [ ] Add focus trap to `SearchDialog` modal
- [ ] Ensure focus returns to trigger element when modal closes
- [ ] Test with keyboard navigation
- [ ] Verify accessibility compliance

#### Notes
- Files: `components/AppointmentScheduler.tsx:49-91`, `components/SearchDialog.tsx`
- Impact: Low - Accessibility compliance
- Effort: Low

---

### [TASK-026] Add Structured Logging Format
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Logger module doesn't support structured logging (JSON) for log aggregation tools.

#### Acceptance Criteria
- [ ] Add structured logging format (JSON) option to `lib/logger.ts`
- [ ] Add request ID correlation for tracing
- [ ] Add performance timing helpers
- [ ] Maintain backward compatibility with current logging
- [ ] Document structured logging usage

#### Notes
- File: `lib/logger.ts:71-88, 136-179`
- Impact: Low - Observability and debugging
- Effort: Low

---

### [TASK-027] Improve CSP with Nonce-Based Strategy
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Current CSP uses `unsafe-inline` for scripts and styles. Nonce-based CSP would provide stronger security.

#### Acceptance Criteria
- [ ] Research and implement nonce-based CSP strategy compatible with Next.js 15
- [ ] Modify `middleware.ts` to generate and inject unique nonce for each request
- [ ] Update `app/layout.tsx` and relevant components to include nonce in script/style tags
- [ ] Ensure all inline scripts and styles are either removed or correctly attributed with nonce
- [ ] Verify application functions correctly with new CSP

#### Notes
- File: `middleware.ts:189-192`
- Impact: Low - Security (defense in depth)
- Effort: High - Requires SSR changes

---

### [TASK-028] Add Component Documentation Standards
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** While AI metacode comments exist, a more formal standard for component-level documentation would improve developer experience.

#### Acceptance Criteria
- [ ] Define clear documentation standard or template for React components
- [ ] Apply this standard to at least 5 key components in `components/` directory
- [ ] Consider adding Storybook setup for interactive component documentation (optional)
- [ ] Update `CONTRIBUTING.md` with guidelines for component documentation

#### Notes
- Directory: `components/`
- Impact: Low - Developer experience
- Effort: Low

---

### [TASK-029] Improve Test Organization and Mock Data Management
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Test organization could be improved by co-locating tests with source files and centralizing mock data.

#### Acceptance Criteria
- [ ] Explore options for co-locating unit tests (e.g., `Component.test.tsx` next to `Component.tsx`)
- [ ] Create dedicated `__mocks__/` or `tests/mock-data/` directory for centralized mock data
- [ ] Refactor existing tests to use new mock data structure
- [ ] Document the new test organization and mock data patterns in `CONTRIBUTING.md`

#### Notes
- Directory: `__tests__/`
- Impact: Low - Maintainability
- Effort: Low

---

### [TASK-030] Add Security Checklist Verification
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Security checklist in `lib/actions.ts` comments should be verified and automated if possible.

#### Acceptance Criteria
- [ ] Verify all user inputs pass through `escapeHtml()` before HTML context
- [ ] Verify CRM payload uses `sanitizeName()` / `sanitizeEmail()`
- [ ] Verify no raw IP addresses logged (use hashedIp)
- [ ] Verify errors return generic messages (no internal details)
- [ ] Create automated tests or lint rules to enforce these checks

#### Notes
- File: `lib/actions.ts` (security checklist in comments)
- Impact: Low - Security audit
- Effort: Low

---

### [TASK-010] Add Observability Stack (OpenTelemetry/Prometheus)
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Logging and Sentry exist but no metrics/tracing.

#### Acceptance Criteria
- [ ] Add OpenTelemetry instrumentation
- [ ] Configure Prometheus metrics endpoint
- [ ] Create basic Grafana dashboards-as-code
- [ ] Document observability in RUNBOOK.md

#### Notes
- Per ANALYSIS.md: observability incomplete

---

### [TASK-011] Add SBOM Generation to CI
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Supply chain security best practice.

#### Acceptance Criteria
- [ ] Add SBOM generation step to CI
- [ ] Choose format (SPDX or CycloneDX)
- [ ] Store SBOM artifact with releases
- [ ] Document in SECURITY.md

#### Notes
- Required for enterprise security compliance

---

## P0 — Critical (DIAMOND.md Priority Gaps)

---

### [TASK-033] Create Release Automation Workflow
- **Priority:** P0
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Semantic versioning and automated releases are missing. Manual releases are error-prone.

#### Acceptance Criteria
- [ ] Create `.github/workflows/release.yml` using semantic-release
- [ ] Configure automated changelog generation
- [ ] Configure automated Git tagging
- [ ] Configure automated npm package publishing (if applicable)
- [ ] Test release workflow on a test branch

#### Notes
- Per DIAMOND.md Priority Gaps (line 31)
- semantic-release automates version bumping and changelog

---

### [TASK-034] Create Production Deployment Automation
- **Priority:** P0
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Production deployment is not automated. Manual deployments are risky and slow.

#### Acceptance Criteria
- [ ] Create production deployment workflow for Cloudflare Pages
- [ ] Configure deployment triggers (tags, main branch)
- [ ] Add deployment verification steps
- [ ] Add rollback capability
- [ ] Document deployment process

#### Notes
- Per DIAMOND.md Priority Gaps (line 32)
- Cloudflare Pages deployment should be automated
- Should include smoke tests post-deployment

---

## P1 — High (DIAMOND.md Fundamentals)

### [TASK-035] Verify Branch Protection Settings
- **Priority:** P1
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** DIAMOND.md indicates branch protection needs verification. This is a fundamental security requirement.

#### Acceptance Criteria
- [ ] Verify branch protection is enabled for main/master branch
- [ ] Verify branch deletion prevention is enabled
- [ ] Verify CODEOWNERS file exists and is configured
- [ ] Verify required status checks are configured
- [ ] Document branch protection settings

#### Notes
- Per DIAMOND.md Phase 2.1 (lines 118-121)
- Requires GitHub repository settings verification
- Fundamental security requirement

---

### [TASK-036] Verify Documentation Files (README, CONTRIBUTING, SECURITY.md)
- **Priority:** P1
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** DIAMOND.md indicates documentation files need verification. These are fundamental requirements.

#### Acceptance Criteria
- [ ] Verify README.md is comprehensive and up-to-date
- [ ] Verify CONTRIBUTING.md exists and is complete
- [ ] Verify SECURITY.md exists with vulnerability reporting process
- [ ] Verify all documentation links are valid
- [ ] Update any outdated information

#### Notes
- Per DIAMOND.md Priority Gaps (line 34)
- Per DIAMOND.md Phase 20.1 (lines 710-712)
- Fundamental documentation requirements

---

### [TASK-037] Implement Threat Modeling and Security Architecture Review
- **Priority:** P1
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** DIAMOND.md Phase 1.1 identifies threat modeling as a fundamental requirement that is missing.

#### Acceptance Criteria
- [ ] Conduct systematic threat identification and analysis
- [ ] Document security-focused architecture design
- [ ] Create comprehensive attack surface mapping
- [ ] Perform risk assessment and prioritization
- [ ] Document security requirements
- [ ] Create web application threat model for Next.js app

#### Notes
- Per DIAMOND.md Phase 1.1 (lines 70-80)
- Fundamental security requirement
- Should be documented in `docs/security/threat-model.md`

---

## P1 — High (CODEBASE_ANALYSIS.md Additional Issues)

### [TASK-038] Fix Blog Post Image Path Assumption
- **Priority:** P1
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Blog post structured data assumes image exists at `/blog/${post.slug}.jpg` without verification, leading to invalid structured data if image is missing.

#### Acceptance Criteria
- [ ] Check if image exists before including in structured data
- [ ] Provide fallback to default OG image (`/og-image.jpg`) if blog image missing
- [ ] Or make image optional in frontmatter
- [ ] Update `app/blog/[slug]/page.tsx:57` to handle missing images

#### Notes
- File: `app/blog/[slug]/page.tsx:57`
- Impact: Low - SEO (invalid structured data)
- Per CODEBASE_ANALYSIS.md Issue 5

---

### [TASK-039] Fix Footer Hardcoded Links
- **Priority:** P1
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Footer component contains hardcoded service links and placeholder social media links that should be configurable or auto-generated.

#### Acceptance Criteria
- [ ] Generate service links from filesystem scan or route metadata
- [ ] Move social links to environment variables or config
- [ ] Add validation to ensure links are updated before production
- [ ] Update `components/Footer.tsx:8-32`

#### Notes
- File: `components/Footer.tsx:8-32`
- Impact: Medium - Maintenance burden
- Per CODEBASE_ANALYSIS.md Issue 7

---

### [TASK-040] Fix Sitemap Manual Maintenance
- **Priority:** P1
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Sitemap generation uses hardcoded array of static pages, requiring manual updates when new pages are added.

#### Acceptance Criteria
- [ ] Auto-generate static pages from filesystem scan or route metadata
- [ ] Sync with search index generation
- [ ] Update `app/sitemap.ts:10-113`

#### Notes
- File: `app/sitemap.ts:10-113`
- Impact: Low - Maintenance burden
- Per CODEBASE_ANALYSIS.md Issue 11
- Related to TASK-019 (Search Index Generation)

---

## P2 — Medium (CODEBASE_ANALYSIS.md Additional Issues)

### [TASK-041] Add About Page Placeholder Validation
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** About page contains placeholder video IDs and testimonial data with no validation or warning if not updated before deployment.

#### Acceptance Criteria
- [ ] Add development-only warnings if placeholder values detected
- [ ] Document clearly in README that these need customization
- [ ] Consider making video/testimonials optional (hide if not configured)
- [ ] Update `app/about/page.tsx:8-31`

#### Notes
- File: `app/about/page.tsx:8-31`
- Impact: Low - Template customization
- Per CODEBASE_ANALYSIS.md Issue 7

---

### [TASK-042] Add About Page Stats Configuration
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** About page displays hardcoded statistics that should be configurable or pulled from a data source.

#### Acceptance Criteria
- [ ] Move stats to config object or environment variables
- [ ] Or make stats optional (hide section if not provided)
- [ ] Consider pulling from analytics/CRM if available
- [ ] Update `app/about/page.tsx:289-303`

#### Notes
- File: `app/about/page.tsx:289-303`
- Impact: Low - Content accuracy
- Per CODEBASE_ANALYSIS.md Issue 8

---

### [TASK-043] Add Pricing Page Structured Data for Offers
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Pricing page has FAQ structured data but missing Offer structured data for pricing tiers, which could improve SEO.

#### Acceptance Criteria
- [ ] Add `Offer` structured data for each pricing tier
- [ ] Include price, currency, availability in structured data
- [ ] Link to service pages in offers
- [ ] Update `app/pricing/page.tsx`

#### Notes
- File: `app/pricing/page.tsx`
- Impact: Low - SEO opportunity
- Per CODEBASE_ANALYSIS.md Issue 10

---

### [TASK-044] Improve Breadcrumbs Label Generation
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Breadcrumbs use `titleize()` which may not match actual page titles. No way to override labels for specific routes.

#### Acceptance Criteria
- [ ] Consider using page metadata for breadcrumb labels
- [ ] Or add a mapping object for custom labels
- [ ] Update `components/Breadcrumbs.tsx:10-15, 33-50`

#### Notes
- File: `components/Breadcrumbs.tsx:10-15, 33-50`
- Impact: Low - SEO and UX
- Per CODEBASE_ANALYSIS.md Issue 8

---

### [TASK-045] Add Video Module Validation
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Video module doesn't validate video ID format or check if video exists/accessible.

#### Acceptance Criteria
- [ ] Add video ID format validation (e.g., YouTube IDs are 11 characters)
- [ ] Consider adding video existence check (optional, may be slow)
- [ ] Update `lib/video.ts:32-54`

#### Notes
- File: `lib/video.ts:32-54`
- Impact: Low - Data quality
- Per CODEBASE_ANALYSIS.md Issue 13

---

### [TASK-046] Improve Exit Intent Module Touch Detection
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Exit intent module uses heuristic-based touch detection which may have false positives. No analytics tracking.

#### Acceptance Criteria
- [ ] Consider more robust touch detection
- [ ] Add analytics tracking for exit intent triggers
- [ ] Update `lib/exit-intent.ts:24-77, 95-112`

#### Notes
- File: `lib/exit-intent.ts:24-77, 95-112`
- Impact: Low - UX and analytics
- Per CODEBASE_ANALYSIS.md Issue 14

---

### [TASK-047] Add Service Pages Placeholder Validation
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** All 8 service pages have identical placeholder content with no validation that content is customized.

#### Acceptance Criteria
- [ ] Document clearly that service pages need customization
- [ ] Consider adding development warnings if placeholder content detected
- [ ] Update service pages: `app/services/service-*/page.tsx`

#### Notes
- Files: `app/services/service-*/page.tsx`
- Impact: Low - Template customization
- Per CODEBASE_ANALYSIS.md Issue 15

---

### [TASK-049] Improve SearchDialog with Fuzzy Search
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** SearchDialog uses simple substring match. Could be improved with fuzzy matching and search analytics.

#### Acceptance Criteria
- [ ] Consider adding fuzzy search library (Fuse.js) for better matching
- [ ] Add search analytics tracking (trackSearchQuery from analytics.ts)
- [ ] Add search result ranking/scoring
- [ ] Update `components/SearchDialog.tsx:22-34`

#### Notes
- File: `components/SearchDialog.tsx:22-34`
- Impact: Medium - Search quality
- Per CODEBASE_ANALYSIS.md Issue 5

---

### [TASK-050] Add Email Retry Logic
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Email module has no retry logic for failed sends, no rate limiting, and no HTML email support.

#### Acceptance Criteria
- [ ] Add retry logic with exponential backoff
- [ ] Consider adding HTML email support
- [ ] Add email template system for better formatting
- [ ] Update `lib/email.ts:108-160`

#### Notes
- File: `lib/email.ts:108-160`
- Impact: Medium - Email delivery reliability
- Per CODEBASE_ANALYSIS.md Issue 5

---

### [TASK-051] Add Scheduling Analytics Tracking
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Scheduling module has no analytics tracking for scheduling interactions and no embed URL validation.

#### Acceptance Criteria
- [ ] Add embed URL validation (check if URL is accessible)
- [ ] Add analytics tracking for scheduling interactions
- [ ] Update `lib/scheduling.ts:19-31, 56-86`

#### Notes
- File: `lib/scheduling.ts:19-31, 56-86`
- Impact: Low - Analytics and data quality
- Per CODEBASE_ANALYSIS.md Issue 8

---

### [TASK-053] Improve OG Image Route Branding
- **Priority:** P2
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** OG image generation route has hardcoded branding in image template.

#### Acceptance Criteria
- [ ] Make branding configurable (firm name, colors)
- [ ] Consider adding rate limiting if abuse detected
- [ ] Update `app/api/og/route.tsx:26-40, 48-102`

#### Notes
- File: `app/api/og/route.tsx:26-40, 48-102`
- Impact: Low - Branding consistency
- Per CODEBASE_ANALYSIS.md Issue 10

---

## P3 — Low (Additional Improvements)

### [TASK-054] Add Hero Component Media Type Configuration
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Hero component has hardcoded switch between image and video media types.

#### Acceptance Criteria
- [ ] Make configurable via `NEXT_PUBLIC_HERO_MEDIA_TYPE` env var
- [ ] Or pass as prop from page component
- [ ] Update `components/Hero.tsx:47`

#### Notes
- File: `components/Hero.tsx:47`
- Impact: Low - Template customization
- Per CODEBASE_ANALYSIS.md Issue 6

---

### [TASK-055] Add Blog Post Navigation Helpers
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Blog module doesn't provide prev/next post navigation helpers.

#### Acceptance Criteria
- [ ] Add `getPrevPost(slug)` helper function
- [ ] Add `getNextPost(slug)` helper function
- [ ] Update blog post page to use these helpers
- [ ] Update `lib/blog.ts`

#### Notes
- Per CODEBASE_ANALYSIS.md Extracted Todos (line 62)
- Impact: Low - UX improvement
- Effort: Low

---

### [TASK-056] Add Case Studies to Search Index
- **Priority:** P3
- **Status:** Pending
- **Created:** 2026-01-23
- **Context:** Search index doesn't include case studies if they exist.

#### Acceptance Criteria
- [ ] Add case studies to search index if they exist
- [ ] Update `lib/search.ts`

#### Notes
- Per CODEBASE_ANALYSIS.md Extracted Todos (line 70)
- Impact: Low - Feature completeness
- Effort: Low
