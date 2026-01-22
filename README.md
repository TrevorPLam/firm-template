# Professional Services Firm Template

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-orange)
![Diamond Standard](https://img.shields.io/badge/Standard-Diamond-b91c1c)
![Template](https://img.shields.io/badge/Template-Ready-brightgreen)
[![Release Checklist](https://img.shields.io/badge/Release-Checklist-blue)](docs/TEMPLATE_RELEASE_CHECKLIST.md)

**A production-ready, customizable website template for professional services firms.** Built on Next.js 15 App Router with TypeScript and Tailwind CSS. Designed for Cloudflare Pages and optimized for fast, secure, accessible delivery.

**Highlights**
- ✅ **Template-first content** with placeholders and vertical examples
- ✅ **MDX blog + full-text search** for thought leadership and SEO
- ✅ **Contact flow** with validation, rate limiting, and optional CRM/email integrations
- ✅ **Security and governance** baked in (CSP headers, sanitization, audit runbooks)

---

## Table of Contents
- [Scope & Fit](#scope--fit)
- [What You Get](#what-you-get)
- [Architecture & Constraints](#architecture--constraints)
- [Quick Start](#quick-start)
- [Configuration & Customization](#configuration--customization)
- [Verification & Quality Gates](#verification--quality-gates)
- [Deployment](#deployment)
- [Documentation Map](#documentation-map)
- [Governance for Contributors](#governance-for-contributors)
- [License](#license)

---

## Scope & Fit

**Best for:** law firms, consultancies, accounting practices, design studios, and other professional services businesses that want a modern, high-performance site without starting from scratch.

**Not a fit for:** multi-tenant SaaS products, dynamic user dashboards, or complex backend workflows (this template is optimized for static content + optional form integrations).

### Example Verticals (Reference Mappings)
- [Law Firm Example](docs/examples/LAW_FIRM_EXAMPLE.md)
- [Consulting Firm Example](docs/examples/CONSULTING_FIRM_EXAMPLE.md)
- [Accounting Firm Example](docs/examples/ACCOUNTING_FIRM_EXAMPLE.md)
- [Design Agency Example](docs/examples/DESIGN_AGENCY_EXAMPLE.md)

---

## What You Get

### Core Features
- **Next.js App Router** with React Server Components by default
- **8 service page templates** for structured offerings
- **MDX blog engine** with static generation
- **Client-side search** with pre-indexed content
- **Contact form** with validation, rate limiting, and spam protection
- **SEO foundations** (metadata, sitemap, robots, structured data)
- **Optional scheduling embeds** (Calendly or Cal.com)
- **Video support** (YouTube/Vimeo embeds and hosted files)
- **Theme editor (dev-only)** for previewing brand tokens

### Diamond Standard Commitments
This repo follows the Diamond Standard for quality and governance. See the full standard here: [docs/DIAMOND_STANDARD.md](docs/DIAMOND_STANDARD.md).

---

## Architecture & Constraints

**Stack overview**
- Framework: Next.js 15.5 (App Router)
- Language: TypeScript 5 (strict)
- Styling: Tailwind CSS (design tokens only)
- Hosting target: Cloudflare Pages (Edge Runtime)
- Observability: Sentry

**Key constraints to know**
- **Edge runtime compatibility:** avoid Node-only APIs at request time.
- **Static-first content:** blog/search are generated at build time.
- **Image handling:** Cloudflare Pages uses unoptimized images in build mode (see `next.config.mjs`).

---

## Quick Start

### Prerequisites
- Node.js 20+ (v20–v22 recommended)
- npm 10+

### Install

```bash
# Clone or fork this repository
git clone https://github.com/TrevorPLam/firm-template.git

# Enter directory
cd firm-template

# Install dependencies
npm install
```

If you hit Cloudflare adapter peer-dependency issues, retry with:

```bash
npm install --legacy-peer-deps
```

### Local Development

```bash
npm run dev
```

Visit `http://localhost:3000` to view the application.

---

## Configuration & Customization

### 1) Environment Configuration
Copy the template and set values in your local environment file:

```bash
cp .env.example .env.local
```

See `.env.example` for required variables (site name, URL, CRM keys, analytics, etc.).

### 2) Branding & Layout
- **Hero + Value Props:** `components/Hero.tsx`, `components/ValueProps.tsx`
- **Navigation + Footer:** `components/Navigation.tsx`, `components/Footer.tsx`
- **Logo + Icons:** `public/` assets
- **Theme tokens:** `tailwind.config.ts`

### 3) Services & Pages
- **Services:** `app/services/service-[1-8]/page.tsx`
- **Pricing:** `app/pricing/page.tsx`
- **About:** `app/about/page.tsx`
- **Contact:** `app/contact/page.tsx`

### 4) Content
- **Blog posts:** `content/blog/*.mdx`
- **Search index:** auto-generated during build

### 5) Forms & Integrations
- **Contact form:** `components/ContactForm.tsx`
- **Server actions + integrations:** `lib/actions.ts`
- **Validation schemas:** `lib/contact-form-schema.ts`

For detailed instructions, start here:
- **Customization guide:** [docs/TEMPLATE_CUSTOMIZATION_GUIDE.md](docs/TEMPLATE_CUSTOMIZATION_GUIDE.md)
- **Placeholder reference:** [docs/PLACEHOLDER_REFERENCE.md](docs/PLACEHOLDER_REFERENCE.md)

---

## Verification & Quality Gates

Run these commands before release:

```bash
# Unit tests
npm run test

# Type check
npm run type-check

# Linting
npm run lint

# Security + audit scripts
./scripts/check.sh
./scripts/security-scan.sh
```

Additional audits (optional but recommended):

```bash
npm run audit:seo
npm run audit:a11y
npm run audit:lighthouse
```

---

## Deployment

**Cloudflare Pages (recommended)**

- **Build command:** `npm run pages:build`
- **Output directory:** `.vercel/output/static`

Docs: [docs/CLOUDFLARE_DEPLOYMENT.md](docs/CLOUDFLARE_DEPLOYMENT.md)

**Other platforms**
- Vercel, Netlify, or any Next.js-compatible host
- See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying)

---

## Documentation Map

- **Start here:** [docs/TEMPLATE_CUSTOMIZATION_GUIDE.md](docs/TEMPLATE_CUSTOMIZATION_GUIDE.md)
- **Placeholder inventory:** [docs/PLACEHOLDER_REFERENCE.md](docs/PLACEHOLDER_REFERENCE.md)
- **Architecture overview:** [docs/TEMPLATE_ARCHITECTURE.md](docs/TEMPLATE_ARCHITECTURE.md)
- **Diamond Standard:** [docs/DIAMOND_STANDARD.md](docs/DIAMOND_STANDARD.md)
- **Testing strategy:** [docs/TESTING_STRATEGY.md](docs/TESTING_STRATEGY.md)
- **Security baseline:** [docs/SECURITY_BASELINE.md](docs/SECURITY_BASELINE.md)

---

## Governance for Contributors

If you are modifying code or documentation, **read these first**:
1. [CODEBASECONSTITUTION.md](CODEBASECONSTITUTION.md)
2. [READMEAI.md](READMEAI.md)
3. [BESTPR.md](BESTPR.md)
4. [P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md](P0TODO.md)

GitHub Actions are stored under `githubactions/` and are **off by default**.

---

## License

This project is licensed under the MIT License. See `LICENSE` for details.
