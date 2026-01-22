# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Added `npm run check:npm-registry` to diagnose registry connectivity and proxy issues before running dependency commands
- Added a contact form honeypot field to block bot submissions
- Added repeatable accessibility and Lighthouse audit scripts for local QA
- Added `npm run audit:seo` for metadata, sitemap, and internal link validation
- Added Playwright coverage for contact submission success, rate limiting, and search empty states
- Added unit tests for Hero, ValueProps, ServicesOverview, and SocialProof sections
- Added client logo showcase and trust badge sections to the homepage
- Added Article and Service structured data on blog posts and service pages for richer SEO signals
- Added template privacy policy and terms of service pages with placeholder guidance
- Added Dependabot configuration for weekly dependency updates with grouped minor/patch and separate major updates
- Added optional transactional email notifications for the contact form (SendGrid/Postmark/Resend)
- Added a dev-only theme editor to preview tokens and generate Tailwind/CSS snippets
- Added optional appointment scheduling embeds with Calendly or Cal.com across core pages
- Added video embeds for hero, about, and service pages plus a reusable video testimonial grid
- Added a configurable exit-intent popup for re-engaging visitors before they leave

### Security
- Added hashed IP + email rate limiting for contact form submissions
- Enforced rate limits before storing leads to prevent spam records

### Fixed
- Restored in-memory rate limiting logic and JSDoc formatting in `lib/actions.ts`
- Added contact form error boundary fallback and accessibility improvements for decorative icons
- Guarded search index generation in the root layout to avoid rendering failures
- Added safe fallback UI when blog listings fail to load due to malformed MDX (T-050)

### Documentation
- Expanded middleware security header docs and environment helper documentation
- Clarified sanitize utility usage guidance
- Documented accessibility standards, Lighthouse baselines, and Sentry performance instrumentation
- Added SEO checklist, structured data templates, and Search Console guidance to the customization guide
- Documented Vitest coverage threshold expectations in the testing strategy
- Consolidated Cloudflare Pages deployment guidance, added mobile smoke test checklist, and archived legacy roadmaps
- Added template customization guide, placeholder reference, and architecture overview documentation
- Updated README, READMEAI, and project status to reflect template documentation phase
- Added vertical-specific customization examples and linked them from the customization guide and README
- Expanded vertical examples with copy-only implementation steps and FAQ/CTA guidance
- Added a template release checklist and linked badge in the README
- Added a quality-assurance review section and refreshed audit counts in the release checklist
- Documented legal page customization requirements in the template guide
- Documented production versus development rate limiting behavior and verification steps
- Documented analytics provider setup, CSP requirements, and conversion tracking guidance
- Added a production environment checklist and linked it from the template customization guide
- Refreshed accessibility documentation and linked the validation workflow from the README
- Documented client logos and trust badges across the customization guide and vertical examples
- Documented how to enable, auto-merge (patch-only), or disable Dependabot updates
- Documented transactional email notification setup and optional thank-you emails
- Documented video embed customization steps and added video notes to vertical examples
- Documented exit-intent popup configuration in the customization guide
- Documented monitoring guidance for transitive build-tool vulnerabilities
- Documented template versioning policy and release note examples

### Changed
- Removed deprecated `api` and `sentry` keys from `next.config.mjs`
- Documented npm as the canonical package manager and lockfile
- Updated pre-commit TypeScript hook to use npm instead of pnpm
- Hardened Sentry source map handling for production builds
- Added Vitest coverage thresholds to enforce minimum unit coverage

### Dependencies
- Aligned `@next/mdx` to the Next.js 14.x line
- Moved `@types/mdx` to devDependencies
- Removed `pnpm-lock.yaml` in favor of `package-lock.json`
- Planned `@vitest/coverage-v8` addition for coverage reporting (install + lockfile regeneration pending registry access)

## [2026.01.05] - 2026-01-05

### Added
- Added `/feed.xml` RSS feed generation, linked in the primary navigation, and surfaced in the sitemap
- Added distributed rate limiting support with Upstash Redis and new environment configuration
- Added a post-build client bundle scan to prevent accidental secret exposure
- Added Lighthouse performance budgets configuration

### Changed
- Removed deprecated next-pwa integration while preserving basic PWA assets
- Expanded deployment, security, and documentation guides to reflect the latest platform changes

### Security
- Added Sentry event sanitization and logger redaction for PII and sensitive fields
- Enforced 1MB request payload limits in middleware and API configuration

### Dependencies
- Pinned security-critical dependencies (Next.js, Sentry, Resend, Zod)
- Upgraded eslint-config-next and added Upstash rate limiting dependencies

## [2026.01.03] - 2026-01-03

### Documentation
- Completed comprehensive dependency health review
- Added dependency update policy to DEPENDENCY_HEALTH.md
- Documented MDX architecture decision (ADR-004)
- Documented clsx + tailwind-merge utility pattern (ADR-005)
- Created comprehensive security review framework in SECURITY_REVIEW.md
- Added 10 security enhancement tasks to P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md (T-001 through T-010)
- Added dependency evaluation task for next-pwa (T-DEP-001)
- Created TODO_COMPLETED.md to track completed tasks
- Enhanced CODE_AUDIT.md with audit execution framework
- Created DOCS_ROOT.md as documentation index
- Created RELEASE_CHECKLIST.md for safe, repeatable releases

### Quality
- Established Architecture Decision Records (ADR) system in DECISIONS.md
- Documented dependency health policies and review process
- Added security hardening tasks covering PII redaction, logging, rate limiting, and CSRF protection

## [0.1.0] - 2024-12-26

### Added
- Initial release of Your Dedicated Marketer marketing website
- Next.js 14 App Router with static site generation
- Blog functionality with MDX support
- Contact form with email integration via Resend
- Responsive design with Tailwind CSS
- Error tracking with Sentry
- PWA support with next-pwa
- Testing infrastructure (Vitest + Playwright)
- Security headers and CORS configuration

### Security
- Implemented rate limiting for contact form
- Added security headers via middleware
- Configured Sentry error tracking
- Input validation with Zod schemas

---

## Changelog Guidelines

### When to Update
- Add entries when dependency changes affect user-facing behavior
- Document breaking changes immediately
- Record security patches and vulnerability fixes
- Note major feature additions or architectural changes

### Categories
- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security fixes or improvements
- **Dependencies** - Significant dependency updates

### Dependency Changes
Per DEPENDENCY_HEALTH.md:
- Document dependency additions with justification
- Note dependency removals and what replaced them
- Record major version upgrades with impact summary
- Link to related P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md or DECISIONS.md entries

### Versioning Policy
Use Semantic Versioning with template-specific guidance:
- **Major (X.0.0)**: Breaking changes (removed configs, renamed env vars, layout/API contract changes).
- **Minor (0.X.0)**: Backward-compatible feature additions or new template capabilities.
- **Patch (0.0.X)**: Backward-compatible fixes, docs-only changes, or dependency updates without user action.

### Changelog Update Requirements
- Update the `[Unreleased]` section in the same PR as the change.
- Keep entries grouped by category (Added/Changed/Fixed/Security/Dependencies/Documentation).
- Include the task ID or decision record when available.
- Preserve existing entries; do not rewrite history.

### Release Notes Examples
**Minor release (feature additions):**
```
## [1.2.0] - 2026-02-10

### Added
- Added client logo showcase component with placeholder assets (T-031)
- Added appointment scheduling embeds with Calendly/Cal.com support (T-032)

### Documentation
- Added configuration steps for scheduling provider setup
```

**Patch release (fix/docs/deps):**
```
## [1.2.1] - 2026-02-18

### Fixed
- Fixed mobile navigation focus restoration (T-049)

### Documentation
- Clarified release checklist verification steps (T-148)

### Dependencies
- Updated Next.js to patched version (T-022)
```
