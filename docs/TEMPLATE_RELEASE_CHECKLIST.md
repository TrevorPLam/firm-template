# TEMPLATE_RELEASE_CHECKLIST.md — Template Release Verification

Last Updated: 2026-01-20
Status: Active

Goal: Provide a repeatable, auditable checklist for confirming the template is ready for public release.

> **AI note:** Treat this as a release gate. Record dates/initials for each completed item and keep evidence (logs, screenshots, links) alongside the release notes.

---

## Pre-Release Verification
- [ ] All branding placeholders are in place (no firm-specific names in UI copy).
- [ ] No "Your Dedicated Marketer" references remain **outside** archive/history docs.
- [ ] All service pages use generic placeholders.
- [ ] All blog posts are generic examples.
- [ ] Documentation is complete and accurate for customization and deployment.
- [ ] Customization guides exist and are comprehensive.

## Technical Verification
- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npm run test`
- [ ] Type checking passes: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] E2E tests pass: `npm run test:e2e`
- [ ] No broken links (manual click-through or automated link checker).
- [ ] All pages render correctly (home, services, pricing, blog, contact, 404).
- [ ] Interactive features work (nav, mobile menu, search, contact form, rate limiting).

## Content Verification
- [ ] All images are generic or placeholders.
- [ ] All metadata is generic and environment-variable driven.
- [ ] Structured data uses placeholders for firm name, URL, and logos.
- [ ] Environment variables are documented in `.env.example` and guides.

## Release Preparation
- [ ] Repository description updated to reflect template positioning.
- [ ] Topics/tags updated for template discovery (e.g., `nextjs`, `template`, `professional-services`).
- [ ] LICENSE file reviewed for template distribution.
- [ ] Security policy in place (`SECURITY.md`).
- [ ] Contributing guidelines present if accepting contributions.
- [ ] GitHub release created for v1.0.0 with:
  - [ ] Release notes explaining template purpose
  - [ ] Link to customization guide
  - [ ] Quick start instructions
  - [ ] Known limitations or considerations

---

## Verification Log (Latest)
> Update this section each time you re-run the checks.

**Date:** 2026-01-20

**Marketing-term scan (manual audit)**
- Command: `rg -o "marketing" --stats` → 140 matches across 31 files (mostly docs, tests, and archived references).
- Command: `rg -o "marketer" --stats` → 43 matches across 24 files (docs, tests, and deployment references).
- Command: `rg -oi "dedicated marketer" --stats` → 54 matches across 24 files (archive/history + placeholder references).
- Command: `rg -n "YD Marketer"` → Matches in docs/tests and design system documentation.
- Command: `rg -n "YD Firms"` → Matches in archived docs and TODO references.

**Package metadata review**
- `package.json` name is `firm-template` and has no marketing-specific description fields.

**External checks (manual, repo-owner action required)**
- GitHub repo description and topics updated.
- Release `v1.0.0` published with release notes and links.

---

## Notes & Evidence
- Add links to test logs, build artifacts, screenshots, or release URLs here.
- If any check fails, create a TODO task with file paths and acceptance criteria.
