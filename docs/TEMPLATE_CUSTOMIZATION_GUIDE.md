# TEMPLATE_CUSTOMIZATION_GUIDE.md — Professional Services Template Setup

Last Updated: 2026-01-21
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
- Client logo placeholders live in `/public/clients/` and are rendered by `/components/ClientLogoShowcase.tsx`.
  - Recommended format: SVG or PNG with transparent background.
  - Suggested size: ~160×80 (the grid scales down responsively).

### Color scheme (Tailwind)
- Update `tailwind.config.ts` brand colors.
- If you prefer CSS variables, keep the token names intact and swap values.

### Typography
- Update fonts in `app/layout.tsx` and `tailwind.config.ts`.

---

## Content Customization
### Homepage
- **Hero**: `/components/Hero.tsx`
- **Client Logos**: `/components/ClientLogoShowcase.tsx` (swap `/public/clients/*` files)
- **Trust Badges**: `/components/TrustBadge.tsx` (replace badge labels and descriptions)
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

### Legal pages (required)
- Privacy Policy: `/app/privacy/page.tsx`
- Terms of Service: `/app/terms/page.tsx`
- Replace every placeholder like `[YOUR FIRM NAME]`, `[YOUR STATE/COUNTRY]`, and `[BILLING TERMS]`.
- **You MUST customize these pages before launch.** Do not publish until legal counsel reviews the final language for your jurisdiction.

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
- [`docs/PRODUCTION-ENV-CHECKLIST.md`](PRODUCTION-ENV-CHECKLIST.md) (production checklist + verification)

### Database (Supabase)
- Follow [`docs/SUPABASE_SETUP.md`](SUPABASE_SETUP.md)
- Required variables:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

### CRM integration (HubSpot)
- Follow [`docs/HUBSPOT_SETUP.md`](HUBSPOT_SETUP.md)
- Required variable: `HUBSPOT_PRIVATE_APP_TOKEN`

### Analytics
- The template ships with a provider-agnostic tracking wrapper in [`lib/analytics.ts`](../lib/analytics.ts).
- Analytics events are recorded via `trackEvent`, `trackFormSubmission`, and `trackCTAClick`.
- Set `NEXT_PUBLIC_ANALYTICS_ID` for the provider you choose (GA4, Plausible, Fathom, etc.).
- Configure Sentry using `NEXT_PUBLIC_SENTRY_DSN` if desired (see `docs/SENTRY-SETUP.md`).

#### Provider setup examples
**Google Analytics 4 (GA4)**
1. Create a GA4 property and copy the Measurement ID (format: `G-XXXXXXX`).
2. Set `NEXT_PUBLIC_ANALYTICS_ID` in `.env`.
3. Add the GA4 script in `app/layout.tsx` using `next/script`.
4. Update CSP allowlists in `middleware.ts`:
   - `script-src`: add `https://www.googletagmanager.com`
   - `connect-src`: add `https://www.google-analytics.com` and `https://www.googletagmanager.com`
   - See `docs/SECURITY-CSP-ANALYTICS.md` for context.

```tsx
// app/layout.tsx (example)
import Script from 'next/script'

{process.env.NEXT_PUBLIC_ANALYTICS_ID ? (
  <>
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_ANALYTICS_ID}`}
      strategy="afterInteractive"
    />
    <Script id="ga4-init" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_ANALYTICS_ID}');
      `}
    </Script>
  </>
) : null}
```

### Dependency updates (Dependabot)
- A starter Dependabot configuration lives in `.github/dependabot.yml`.
- Updates run weekly and group minor + patch updates separately from major upgrades.
- **Auto-merge patch updates (if tests pass):**
  1. Enable GitHub auto-merge on this repository.
  2. Require the repo’s test/lint checks to pass before merging.
  3. Manually enable auto-merge on Dependabot PRs that are *patch* updates only.
- To disable Dependabot, either delete `.github/dependabot.yml` or turn it off in the repo
  settings under **Security → Dependabot**.

**Plausible**
1. Create a Plausible site and copy your domain.
2. Set `NEXT_PUBLIC_ANALYTICS_ID` to the site domain (for reference in docs/ops).
3. Add the Plausible script in `app/layout.tsx`.
4. Update CSP allowlists in `middleware.ts`:
   - `script-src`: add `https://plausible.io`
   - `connect-src`: add `https://plausible.io`
   - See `docs/SECURITY-CSP-ANALYTICS.md` for context.

```tsx
// app/layout.tsx (example)
import Script from 'next/script'

{process.env.NEXT_PUBLIC_ANALYTICS_ID ? (
  <Script
    src="https://plausible.io/js/script.js"
    data-domain={process.env.NEXT_PUBLIC_ANALYTICS_ID}
    strategy="afterInteractive"
  />
) : null}
```

**Fathom (or other providers)**
- Add the provider script in `app/layout.tsx`.
- Extend `trackEvent` in `lib/analytics.ts` to forward events to the provider API.
- Update CSP allowlists for script and connect sources (check provider docs for the exact domains).

#### Conversion tracking setup
- The template does **not** wire analytics events by default.
- Use `trackFormSubmission('contact', true | false)` after contact submissions.
- Use `trackCTAClick('cta text', 'destination')` for CTA buttons and links.
- For custom funnels, call `trackEvent({ action, category, label })` with consistent naming.

#### Verification checklist
- Confirm events fire in the provider’s debug/real-time view.
- In the browser console, ensure no CSP errors are logged.
- Trigger a CTA click or contact form submission and confirm event capture.

### SEO & Search Console
#### SEO checklist (before launch)
- **Meta tags**: Confirm each page exports metadata with a description.
- **Structured data**: Validate JSON-LD schema in `app/layout.tsx` and blog posts.
- **Sitemap**: Keep `app/sitemap.ts` in sync with new routes.
- **robots.txt**: Update `app/robots.ts` if crawl rules change.
- **Internal linking**: Ensure navigation and content link to core pages.

Run the built-in audit before release:
```bash
npm run audit:seo
```

#### OpenGraph & Twitter cards
- Update the global OpenGraph and Twitter metadata in `app/layout.tsx`.
- Customize the OG image by editing `app/api/og/route.tsx` or swapping to a static asset.
- For page-specific OG data, add per-page metadata exports in each `page.tsx`.

#### Structured data templates
Use these as starting points when updating the JSON-LD blocks in `app/layout.tsx`.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Firm Name",
  "url": "https://yourfirm.com",
  "logo": "https://yourfirm.com/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/yourfirm",
    "https://www.facebook.com/yourfirm"
  ]
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Your Firm Name",
  "url": "https://yourfirm.com",
  "telephone": "+1-555-555-5555",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main Street",
    "addressLocality": "City",
    "addressRegion": "State",
    "postalCode": "12345",
    "addressCountry": "US"
  }
}
```

#### Search Console setup (Google)
1. Create a property in Google Search Console for your domain.
2. Verify ownership via DNS or add the verification meta tag to `app/layout.tsx`.
3. Submit your sitemap URL: `https://your-domain.com/sitemap.xml`.
4. Monitor coverage reports and fix any reported crawl issues.

---

## Deployment
### Cloudflare Pages (recommended)
- Follow [`docs/CLOUDFLARE_DEPLOYMENT.md`](CLOUDFLARE_DEPLOYMENT.md).
- Use `npm run pages:build` for the build command.
- Set environment variables in Cloudflare dashboard (same names as `.env.example`).

### Rate limiting (Upstash)
- Production traffic should use distributed rate limiting via Upstash Redis.
- Set **both** `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
- Verify logs show `Initialized distributed rate limiting with Upstash Redis`.
- If those vars are missing, the site uses in-memory limits (not suitable for production).

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
