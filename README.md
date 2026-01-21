# Professional Services Firm Template

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-orange)
![Diamond Standard](https://img.shields.io/badge/Standard-Diamond-b91c1c)
![Template](https://img.shields.io/badge/Template-Ready-brightgreen)
[![Release Checklist](https://img.shields.io/badge/Release-Checklist-blue)](docs/TEMPLATE_RELEASE_CHECKLIST.md)

**A production-ready, customizable website template for professional services firms.** Built to the "Diamond Standard" for engineering excellence—optimized for speed, SEO, accessibility, and maintainability. Easily adaptable for law firms, consulting agencies, accounting practices, design studios, and more.

> ⚡ **Launch-ready in 2-4 hours** with basic customization  
> 💎 **Diamond Standard quality** - no compromises on performance, security, or accessibility  
> 🎨 **Fully customizable** - replace placeholder content with your firm's branding and services

---

## 🎯 What Is This Template?

This is a **complete, production-ready website template** designed specifically for professional services firms. Instead of starting from scratch or using a generic website builder, you get:

- ✅ **Proven architecture** - Next.js 15 App Router with TypeScript and Tailwind CSS
- ✅ **8 customizable service pages** - Replace placeholders with your offerings
- ✅ **Built-in blog engine** - MDX-powered with full-text search
- ✅ **Contact form ready** - Rate limiting, spam protection, CRM integration, optional email alerts
- ✅ **Diamond Standard quality** - 95+ Lighthouse scores, WCAG accessibility, security best practices
- ✅ **Edge-optimized** - Deploys to Cloudflare Pages for global performance
- ✅ **Fully documented** - Comprehensive customization guides included

**Common Use Cases:**
- Law firms (corporate law, family law, estate planning, litigation)
- Consulting agencies (strategy, operations, digital transformation)
- Accounting practices (tax prep, bookkeeping, audit services)
- Design studios (brand design, web design, UX/UI)
- Any professional services business needing a modern website

### Common Verticals (Example Mappings)
Use the example mappings below to quickly align services, pricing, and blog topics with your vertical:
- [Law Firm Example](docs/examples/LAW_FIRM_EXAMPLE.md)
- [Consulting Firm Example](docs/examples/CONSULTING_FIRM_EXAMPLE.md)
- [Accounting Firm Example](docs/examples/ACCOUNTING_FIRM_EXAMPLE.md)
- [Design Agency Example](docs/examples/DESIGN_AGENCY_EXAMPLE.md)

---

## 💎 The Diamond Standard

This repository adheres to a strict "Diamond Standard" of engineering excellence, ensuring that every deployment is:

*   **Secure by Design**: CSP headers, strict input validation (Zod), and secret scanning.
*   **Edge Native**: Optimized for the Cloudflare Pages Edge Runtime.
*   **Type Safe**: 100% TypeScript coverage with strict mode enabled.
*   **Accessible**: Keyboard-friendly UI with documented a11y validation workflow. See [`docs/ACCESSIBILITY.md`](docs/ACCESSIBILITY.md).
*   **Observable**: Integrated Sentry monitoring and comprehensive logging.
*   **AI-Ready**: Structured specifically for effective collaboration with AI coding agents (`AGENTS.md`, `READMEAI.md`).

## 🚀 Template Features

*   **Next.js App Router**: Utilizing the latest React Server Components architecture (version 15.5.9, compatible with Cloudflare Pages adapter).
*   **Content Engine**: MDX-powered blog with static generation - perfect for thought leadership and SEO.
*   **Client-Side Search**: Zero-latency, pre-indexed search functionality across all content.
*   **Configurable Services**: 8 service page templates ready to customize for your offerings.
*   **Contact Form**: Built-in form with rate limiting, spam protection, CRM integration, and optional email alerts.
*   **Appointment Scheduling**: Optional Calendly or Cal.com embeds for consultation booking.
*   **Video Support**: YouTube/Vimeo embeds, hosted video files, and video testimonial grids.
*   **Performance First**: 
    *   Tailwind CSS for zero-runtime styling.
    *   Automatic image optimization.
    *   Static Site Generation (SSG) for core pages.
    *   Edge deployment for global speed.
*   **Theme Editor (Dev-Only)**:
    *   Preview brand colors, fonts, and logo placement.
    *   Generate Tailwind + CSS variable snippets for fast customization.
*   **Developer Experience**:
    *   100% TypeScript with strict mode.
    *   Vitest for unit testing.
    *   Playwright for E2E testing.
    *   ESLint (Flat Config) & Prettier for code quality.
    *   Dev Container support for consistent environments.

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | [Next.js](https://nextjs.org/) | React meta-framework (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Static typing and reliability |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent, lightweight icons |
| **Validation** | [Zod](https://zod.dev/) | Schema validation for forms/env vars |
| **Testing** | [Vitest](https://vitest.dev/) / [Playwright](https://playwright.dev/) | Unit & End-to-End testing |
| **Deployment** | [Cloudflare Pages](https://pages.cloudflare.com/) | Global edge hosting |
| **Analytics** | [Sentry](https://sentry.io/) | Error tracking and performance monitoring |

## ⚡ Quick Start

### Prerequisites
*   Node.js 20+ (v20-v22 recommended)
*   npm 10+

### Installation

```bash
# Clone or fork this repository
git clone https://github.com/TrevorPLam/firm-template.git

# Enter directory
cd firm-template

# Install dependencies (legacy peer deps required for Cloudflare adapter)
npm install --legacy-peer-deps
```

### Local Development

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` to view the application.

### Customization Quick Start

1. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your firm name, contact info, etc.
   ```

2. **Update Branding**
   - Replace placeholders in `/lib/env.ts` (SITE_NAME, SITE_TAGLINE)
   - Update logo and favicon in `/public/`
   - Customize colors in `tailwind.config.ts`

3. **Customize Services**
   - Edit service pages in `/app/services/service-[1-8]/`
   - Update service descriptions to match your offerings

4. **Add Your Content**
   - Update homepage in `/components/Hero.tsx` and `/components/ValueProps.tsx`
   - Add blog posts to `/content/blog/`
   - Update pricing in `/app/pricing/page.tsx`

5. **Deploy**
   - Follow `/docs/CLOUDFLARE_DEPLOYMENT.md` for Cloudflare Pages setup
   - Or deploy to Vercel, Netlify, or any Next.js-compatible platform

📚 **Full customization guide**: See `/docs/TEMPLATE_CUSTOMIZATION_GUIDE.md`
🧭 **Placeholder reference**: See `/docs/PLACEHOLDER_REFERENCE.md`

### Verification

Run the full suite of "Diamond Standard" checks:

```bash
# Run unit tests
npm run test

# Run type check
npm run type-check

# Run linting
npm run lint

# Run full project audit
./scripts/check.sh

# Run SEO validation (metadata, sitemap, internal links)
npm run audit:seo
```

## 🌍 Deployment

This template is optimized for **Cloudflare Pages** but works with any Next.js-compatible platform.

### Cloudflare Pages (Recommended)

Cloudflare Pages provides:
- Global edge network for fast delivery worldwide
- Zero cold starts
- Built-in analytics
- Generous free tier

**Build Command:** `npm run pages:build`  
**Output Directory:** `.vercel/output/static`

**Environment Variables:**
*   See [`.env.example`](.env.example) for all available variables
*   Most variables have sensible defaults
*   Set `NEXT_PUBLIC_SITE_URL` to your production domain
*   Configure CRM credentials (Supabase, HubSpot, etc.) as needed
*   Optional: enable email alerts with `EMAIL_PROVIDER`, `EMAIL_API_KEY`, and sender/recipient addresses

📚 **Detailed deployment guide**: See [`docs/CLOUDFLARE_DEPLOYMENT.md`](docs/CLOUDFLARE_DEPLOYMENT.md)

### Alternative Platforms

This template also works with:
- **Vercel**: Native Next.js support
- **Netlify**: Use Next.js Runtime
- **Self-hosted**: Standard Next.js deployment

For platform-specific instructions, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 📂 Project Structure

```
├── app/                  # Next.js App Router pages and API routes
│   ├── services/         # 8 customizable service pages
│   ├── pricing/          # Pricing page template
│   ├── blog/             # Blog listing and post pages
│   └── contact/          # Contact form
├── components/           # React components (Atomic design principles)
│   ├── ui/               # Reusable base UI components
│   ├── Hero.tsx          # Homepage hero section (customize here)
│   ├── ValueProps.tsx    # Value propositions (customize here)
│   └── ...               # Other feature-specific components
├── content/              # MDX content sources
│   └── blog/             # Blog posts (replace with your content)
├── docs/                 # Template documentation and customization guides
│   ├── TEMPLATE_CUSTOMIZATION_GUIDE.md  # Start here!
│   ├── PLACEHOLDER_REFERENCE.md         # All placeholder locations
│   ├── TEMPLATE_ARCHITECTURE.md         # Architecture decisions & rationale
│   └── ...                              # Technical documentation
├── lib/                  # Utilities, hooks, and core logic
├── public/               # Static assets (replace with your images/logos)
├── scripts/              # Maintenance and verification scripts
└── tests/                # Test configurations
```

## 📚 Documentation

- **[Template Customization Guide](docs/TEMPLATE_CUSTOMIZATION_GUIDE.md)** - Complete guide to customizing this template
- **[Placeholder Reference](docs/PLACEHOLDER_REFERENCE.md)** - All placeholder content locations and priorities
- **[Deployment Guide](docs/CLOUDFLARE_DEPLOYMENT.md)** - Step-by-step deployment instructions
- **[Diamond Standard](docs/DIAMOND_STANDARD.md)** - Understanding the quality standards
- **[Architecture Overview](docs/TEMPLATE_ARCHITECTURE.md)** - Technical architecture decisions

**Planned (see `TODO.md`):**
- Vertical-specific examples (law firm, consulting, accounting, design)

## 🔧 Customization Checklist

Use this checklist when adapting the template for your firm:

- [ ] **Environment Setup**
  - [ ] Copy `.env.example` to `.env`
  - [ ] Set `NEXT_PUBLIC_SITE_NAME` and `NEXT_PUBLIC_SITE_URL`
  - [ ] Configure CRM credentials (Supabase, HubSpot, etc.)
  - [ ] Optional: configure transactional email alerts

- [ ] **Branding**
  - [ ] Replace logo and favicon in `/public/`
  - [ ] Update color scheme in `tailwind.config.ts`
  - [ ] Customize typography if desired

- [ ] **Content**
  - [ ] Update homepage Hero and ValueProps (`/components/`)
  - [ ] Customize 8 service pages (`/app/services/service-[1-8]/`)
  - [ ] Update pricing structure (`/app/pricing/page.tsx`)
  - [ ] Add your blog posts (`/content/blog/`)
  - [ ] Update About page (create `/app/about/page.tsx` if needed)

- [ ] **Legal**
  - [ ] Customize Privacy Policy (`/app/privacy/page.tsx`)
  - [ ] Customize Terms of Service (`/app/terms/page.tsx`)
  - [ ] Review with legal counsel

- [ ] **Integrations**
  - [ ] Set up Supabase database
  - [ ] Configure CRM integration
  - [ ] Optional: configure email provider (SendGrid, Postmark, Resend)
  - [ ] Set up analytics (Google Analytics, Plausible, etc.)
  - [ ] Configure Sentry for error tracking

- [ ] **Testing & Launch**
  - [ ] Test contact form submission
  - [ ] Verify all service pages
  - [ ] Check mobile responsiveness
  - [ ] Run Lighthouse audit
  - [ ] Deploy to production

📋 **Detailed checklist**: See `/docs/TEMPLATE_CUSTOMIZATION_GUIDE.md`

## 🤖 For AI Coding Assistants

If you are an AI coding assistant working on this template, **YOU MUST READ**:

1.  [`AGENTS.md`](AGENTS.md) - Operational guidelines and cost control.
2.  [`CODEBASECONSTITUTION.md`](CODEBASECONSTITUTION.md) - The supreme laws of the repo.
3.  [`TODO.md`](TODO.md) - The single source of truth for tasks.

**Current Phase**: Template Documentation (see TODO.md Phase 2)  
**Do not deviate from `TODO.md` without human approval.**

## 🙋 Getting Help

- **Customization Questions**: See [`docs/TEMPLATE_CUSTOMIZATION_GUIDE.md`](docs/TEMPLATE_CUSTOMIZATION_GUIDE.md)
- **Technical Issues**: Check existing documentation in `/docs/`
- **Bugs or Feature Requests**: Open an issue on GitHub

## 💡 Why This Template?

Building a professional website from scratch typically costs $10,000-$50,000 and takes weeks or months. This template gives you:

- 🏗️ **Production-ready architecture** - No tech debt, no compromises
- ⚡ **Instant deployment** - Hours, not weeks
- 💎 **Diamond Standard quality** - Performance, security, accessibility built-in
- 🎨 **Fully customizable** - Your brand, your content, your way
- 📈 **SEO optimized** - Structured data, sitemap, fast page loads
- 🔒 **Security first** - CSP headers, rate limiting, input validation
- ♿ **Accessible** - WCAG 2.1 AA compliant
- 📱 **Mobile-first** - PWA-ready with install prompt

## 📜 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---

**Ready to launch your professional services website?**  
Fork this template, customize it for your firm, and deploy to production in hours.

---

*Built with ❤️ using Next.js, TypeScript, and Tailwind CSS*
