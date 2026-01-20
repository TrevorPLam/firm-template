# TEMPLATE_CUSTOMIZATION_GUIDE.md — Professional Services Template Setup

Last Updated: 2026-01-20
Status: Active

Goal: Provide a clear, end-to-end path for customizing this template without changing its underlying functionality.

---

## Overview
This guide walks you through the minimum configuration needed to launch, then deeper customization for branding, content, and integrations. Use it alongside the placeholder inventory in [`PLACEHOLDER_REFERENCE.md`](PLACEHOLDER_REFERENCE.md).

**Audience**
- **Quick Setup**: Launch a working site with basic branding and contact flow.
- **Full Customization**: Replace all placeholders, tailor services, and connect analytics + CRM.

---

## Quick Start (30-minute checklist)
> AI note: Keep the structure and components intact; only replace placeholder content.

1. **Copy environment variables**
   ```bash
   cp .env.example .env.local
   ```
2. **Fill required variables** in `.env.local`:
   - `NEXT_PUBLIC_SITE_NAME`
   - `NEXT_PUBLIC_SITE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `HUBSPOT_PRIVATE_APP_TOKEN`
3. **Update branding assets**:
   - Replace logos + favicon in `/public/`
4. **Replace the hero + value props**:
   - `/components/Hero.tsx`
   - `/components/ValueProps.tsx`
5. **Customize service pages**:
   - `/app/services/service-[1-8]/page.tsx`
6. **Deploy**:
   - Follow [`docs/CLOUDFLARE_DEPLOYMENT.md`](CLOUDFLARE_DEPLOYMENT.md)

---

## Branding Customization
### Environment variables (primary)
- `NEXT_PUBLIC_SITE_NAME` (display name)
- `NEXT_PUBLIC_SITE_TAGLINE` (hero/metadata tagline)
- `FIRM_LEGAL_NAME` (footer legal entity name)

> Tip: See `.env.example` for all variables and required values.

### Logos and favicons
- Replace files in `/public/`:
  - `logo.svg` (or your current logo file)
  - `favicon.ico`
  - PWA icons (see `docs/PWA-ICONS.md`)

### Color scheme (Tailwind)
- Update `tailwind.config.ts` brand colors.
- If you prefer CSS variables, keep the token names intact and swap values.

### Typography
- Update fonts in `app/layout.tsx` and `tailwind.config.ts`.

---

## Content Customization
### Homepage
- **Hero**: `/components/Hero.tsx`
- **Value Props**: `/components/ValueProps.tsx`
- **CTA Sections**: `/components/CTASection.tsx`, `/components/FinalCTA.tsx`

### Services
- Service pages live in `/app/services/service-[1-8]/page.tsx`.
- Replace:
  - Titles + descriptions
  - Key benefits and feature lists

### About / Team (optional)
- `/app/about/page.tsx` (placeholder copy)
- Add `/app/team` pages if you need team bios (planned task; see `TODO.md`)

### Pricing
- `/app/pricing/page.tsx` contains generic tiers.
- Adjust pricing labels, scopes, and FAQs to match your model.

### Blog
- Replace example posts in `/content/blog/` with your own.
- Keep frontmatter fields intact (`title`, `description`, `date`, `author`, `category`).

### Contact
- `/app/contact/page.tsx` handles the form.
- The form submission logic is in `/lib/actions.ts`.

---

## Vertical Examples (Common Firm Types)
Use these examples as structured mappings for services, pricing, and blog topics. Each example keeps the same routes and component structure.

- [Law Firm Example](examples/LAW_FIRM_EXAMPLE.md)
- [Consulting Firm Example](examples/CONSULTING_FIRM_EXAMPLE.md)
- [Accounting Firm Example](examples/ACCOUNTING_FIRM_EXAMPLE.md)
- [Design Agency Example](examples/DESIGN_AGENCY_EXAMPLE.md)

> AI note: Treat these as copy/structure guides; do not change route structure when applying them.

**How to apply an example (copy-only workflow)**
1. Map your top eight services to the existing `/app/services/service-[1-8]/` routes.
2. Replace the pricing tiers and FAQs with your vertical-specific model.
3. Swap blog topics in `/content/blog/` to match your expertise.
4. Update hero, value props, and CTAs to use vertical-intake language.
5. Re-run tests and perform mobile QA from the checklist below.

---

## Technical Configuration
### Environment variables reference
- `.env.example` (recommended baseline)
- `env.example` (annotated reference)

### Database (Supabase)
- Follow [`docs/SUPABASE_SETUP.md`](SUPABASE_SETUP.md)
- Required variables:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

### CRM integration (HubSpot)
- Follow [`docs/HUBSPOT_SETUP.md`](HUBSPOT_SETUP.md)
- Required variable: `HUBSPOT_PRIVATE_APP_TOKEN`

### Analytics
- Set `NEXT_PUBLIC_ANALYTICS_ID` for your provider (GA4, Plausible, etc.).
- Configure Sentry using `NEXT_PUBLIC_SENTRY_DSN` if desired (see `docs/SENTRY-SETUP.md`).

---

## Deployment
### Cloudflare Pages (recommended)
- Follow [`docs/CLOUDFLARE_DEPLOYMENT.md`](CLOUDFLARE_DEPLOYMENT.md).
- Use `npm run pages:build` for the build command.
- Set environment variables in Cloudflare dashboard (same names as `.env.example`).

### Custom domain
- Update `NEXT_PUBLIC_SITE_URL` to your production domain.
- Verify the sitemap and metadata reflect the updated URL.

---

## QA Checklist (Before Launch)
> AI note: Preserve functionality; only content should change.

- [ ] Run unit tests: `npm run test`
- [ ] Run E2E tests: `npm run test:e2e`
- [ ] Run linting: `npm run lint`
- [ ] Run type checking: `npm run type-check`
- [ ] Confirm homepage + all service pages render correctly
- [ ] Verify contact form submissions reach Supabase + CRM
- [ ] Check mobile navigation and CTA buttons

---

## Related References
- [`PLACEHOLDER_REFERENCE.md`](PLACEHOLDER_REFERENCE.md)
- [`docs/DIAMOND_STANDARD.md`](DIAMOND_STANDARD.md)
- [`docs/TESTING_STRATEGY.md`](TESTING_STRATEGY.md)
