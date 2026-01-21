# BESTPR.md — Token-Optimized Best Practices Guide

**Document Type:** Reference  
**Version:** 1.1.0  
**Last Updated:** 2026-01-21  
**Status:** Active  
**Authority:** Canonical best practices reference (subordinate to CODEBASECONSTITUTION.md)

---

## Purpose

This document provides a **token-optimized**, repo-specific guide of best practices to help AI agents ship quality, complementary code the first time, every time. It consolidates critical patterns, conventions, and requirements from across the codebase into a single, authoritative reference.

**Target Audience:** AI agents and developers working in this repository.

---

## 🎯 Quick Reference

### Tech Stack at a Glance
- **Framework:** Next.js 15.5 (App Router, Server Components, Static Site Generation)
- **Language:** TypeScript 5.7 (strict mode, no explicit `any`)
- **Styling:** Tailwind CSS 3.4 (design tokens only, no arbitrary values)
- **Forms:** react-hook-form + Zod validation
- **Testing:** Vitest (unit) + Playwright (E2E)
- **Deployment:** Cloudflare Pages (edge runtime)
- **Observability:** Sentry (error tracking)

### Repository Authority Chain
1. `CODEBASECONSTITUTION.md` (highest authority)
2. `READMEAI.md` (operational guidance)
3. `BESTPR.md` (this file - best practices)
4. `AGENTS.md` (agent instructions)
5. `P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md` (task truth sources)
6. `repo.manifest.yaml` (verification commands)

**Key Files to Know:**
- `CODEBASECONSTITUTION.md` - Non-negotiable rules
- `READMEAI.md` - How agents should work (modes, task flow)
- `P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md` - Active tasks (single source of truth (by priority))
- `TODOCOMPLETED.md` - Completed tasks archive
- `PROJECT_STATUS.md` - Current state + next immediate step
- `repo.manifest.yaml` - Verification commands (type-check, lint, test)
- `.env.example` - ALL environment variables documented

---

## 🔒 Security Non-Negotiables

### Secret Management
```typescript
// ✅ ALWAYS: Server-only secrets
import 'server-only'  // Prevents client bundling
const SECRET_KEY = process.env.SECRET_KEY

// ✅ ALWAYS: Public vars with NEXT_PUBLIC_ prefix
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

// ❌ NEVER: Hardcode secrets in source code
```

**Rules:**
- ALL secrets go in `lib/env.ts` with Zod validation
- Public vars go in `lib/env.public.ts`
- Use `.env.example` as the template (committed)
- Use `.env.local` for local overrides (never committed)
- Post-build script `check-client-secrets.mjs` catches leaks

**Required Environment Variables:**
```bash
# Site Configuration (public)
NEXT_PUBLIC_SITE_URL        # Production URL (https://yourfirm.com)
NEXT_PUBLIC_SITE_NAME       # Firm name

# Database (server-only, REQUIRED)
SUPABASE_URL                # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY   # Service role key (NOT anon key)

# CRM Integration (server-only, REQUIRED)
HUBSPOT_PRIVATE_APP_TOKEN   # HubSpot API token

# Optional (graceful fallback if missing)
UPSTASH_REDIS_REST_URL      # Rate limiting (falls back to in-memory)
UPSTASH_REDIS_REST_TOKEN
NEXT_PUBLIC_ANALYTICS_ID    # Analytics tracking
NEXT_PUBLIC_SENTRY_DSN      # Error monitoring
```

**Accessing Environment Variables:**
```typescript
// Server-side (lib/env.ts)
import { env } from '@/lib/env'
const apiKey = env.SUPABASE_SERVICE_ROLE_KEY  // ✅ Type-safe, validated

// Client-side (lib/env.public.ts)
import { publicEnv } from '@/lib/env.public'
const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL  // ✅ Type-safe

// ❌ NEVER access process.env directly in components/pages
const bad = process.env.NEXT_PUBLIC_SITE_URL  // ❌ Not validated
```

### Input Sanitization
```typescript
import { escapeHtml, sanitizeEmail, sanitizeName } from '@/lib/sanitize'

// ✅ ALWAYS: Sanitize before storage/display
const safeName = sanitizeName(userInput)
const safeEmail = sanitizeEmail(userInput)
const safeHtml = escapeHtml(userInput)

// ❌ NEVER: Use raw user input
```

**Rules:**
- ALL user input MUST pass through `sanitize.ts`
- Use Zod schemas for validation BEFORE sanitization
- Rate limit all public endpoints (Upstash Redis or in-memory)

### Error Handling
```typescript
import { logError } from '@/lib/logger'

try {
  // risky operation
} catch (error) {
  logError('operation-name', error)  // Logs to Sentry with PII filtering
  return { success: false, message: 'Generic user-facing message' }
}

// ❌ NEVER: console.error(error) or throw without logging
// ❌ NEVER: Expose internal error details to users
```

---

## 📁 File Structure & Organization

### Directory Layout
```
firm-template/
├── app/               # Next.js pages (server components by default)
├── components/        # React components (server + client)
│   └── ui/           # Reusable UI primitives
├── lib/              # Business logic & utilities (server-only)
├── content/          # MDX blog posts (processed at build time)
├── __tests__/        # Unit tests (mirrors source structure)
├── tests/            # E2E tests (Playwright)
├── public/           # Static assets
├── docs/             # Documentation
├── scripts/          # Build utilities
└── githubactions/    # CI/CD workflows (disabled by default)
```

### File Naming Conventions
- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Tests: `component-name.test.tsx` (mirrors source)
- Routes: `page.tsx`, `layout.tsx` (Next.js convention)

### Path Aliases
- `@/` maps to repository root
- Example: `import { cn } from '@/lib/utils'`

---

## ⚛️ Component Patterns

### Server Components (Default)
```typescript
// app/about/page.tsx - NO 'use client' directive
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Firm Template',
  description: 'Learn about our firm...',
}

export default function AboutPage() {
  // Can use async/await for data
  return <div>Server-rendered content</div>
}
```

**When to use:**
- Static content, layouts, data display
- Better performance (no JS to client)
- Can access server-only modules

### Client Components
```typescript
'use client'  // ← REQUIRED at top of file

import { useState } from 'react'

export default function InteractiveForm() {
  const [value, setValue] = useState('')
  return <input onChange={(e) => setValue(e.target.value)} />
}
```

**When to use:**
- Forms with state
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, window)
- React hooks (useState, useEffect)

**Current client components:**
- Navigation, ContactForm, SearchDialog, Breadcrumbs, ErrorBoundary, InstallPrompt

### Component Structure
```typescript
/**
 * ComponentName — Brief description
 * 
 * @example
 * <ComponentName prop="value" />
 */

interface ComponentNameProps {
  /** Description of prop */
  required: string
  optional?: boolean
  children?: React.ReactNode
}

export default function ComponentName({ 
  required, 
  optional = false 
}: ComponentNameProps) {
  return <div>{/* Implementation */}</div>
}
```

**Rules:**
- Export default (not named exports)
- TypeScript interfaces for all props
- JSDoc for complex components
- Use existing UI components from `components/ui/` before creating new ones

---

## 🎨 Styling Patterns

### Tailwind CSS Best Practices
```typescript
// ✅ Use design tokens from tailwind.config.ts
<div className="bg-charcoal text-off-white p-4">

// ✅ Conditional classes with cn() utility
import { cn } from '@/lib/utils'
<div className={cn('base-class', isActive && 'active-class')}>

// ❌ NEVER use arbitrary values
<div className="bg-[#123456]">  // ← WRONG

// ❌ NEVER use inline styles
<div style={{ color: '#123' }}>  // ← WRONG
```

**Design Tokens:**
- Colors: `charcoal`, `off-white`, `slate`, `teal`
- Spacing: Tailwind defaults
- Typography: Defined in `tailwind.config.ts`

**Why no arbitrary values?**
- Maintains design consistency
- Easier to theme/rebrand
- Smaller CSS bundle

---

## 📝 Form Handling Pattern

### 1. Define Zod Schema
```typescript
// lib/contact-form-schema.ts
import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name too short').max(100),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message too short'),
  website: z.string().max(0, 'Honeypot must be empty'),  // Bot trap
})

export type ContactFormData = z.infer<typeof contactFormSchema>
```

### 2. Create Server Action
```typescript
// lib/actions.ts
'use server'
import 'server-only'

export async function submitContactForm(data: ContactFormData) {
  try {
    // 1. Validate with Zod
    const validated = contactFormSchema.parse(data)
    
    // 2. Rate limit check
    const rateLimitOk = await checkRateLimit(validated.email)
    if (!rateLimitOk) {
      return { success: false, message: 'Too many requests' }
    }
    
    // 3. Sanitize inputs
    const safe = {
      name: sanitizeName(validated.name),
      email: sanitizeEmail(validated.email),
      message: escapeHtml(validated.message),
    }
    
    // 4. Store/sync
    // await storeInSupabase(safe)
    // await syncToHubSpot(safe)
    
    return { success: true, message: 'Message sent!' }
  } catch (error) {
    logError('submitContactForm', error)
    return { success: false, message: 'Something went wrong' }
  }
}
```

### 3. Build Client Form
```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema } from '@/lib/contact-form-schema'

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(contactFormSchema),
  })
  
  const onSubmit = async (data) => {
    const result = await submitContactForm(data)
    // Handle result
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      {/* Honeypot field (hidden) */}
      <input {...register('website')} className="sr-only" tabIndex={-1} />
    </form>
  )
}
```

---

## 🧪 Testing Patterns

### Test File Structure
```
__tests__/
├── components/     # Mirror components/
├── lib/            # Mirror lib/
└── app/            # Mirror app/
```

### Unit Test Template
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    render(<ComponentName />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const user = userEvent.setup()
    render(<ComponentName />)
    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument()
    })
  })
})
```

### Mocking Server Actions
```typescript
vi.mock('@/lib/actions', async () => {
  const actual = await vi.importActual<typeof import('@/lib/actions')>('@/lib/actions')
  return {
    ...actual,  // Keep schema exports
    submitContactForm: vi.fn(),  // Mock only the handler
  }
})
```

### Test Requirements
- **Coverage thresholds:** 40% branches, 45% functions, 50% lines
- **Run tests:** `npm test` (watch mode)
- **Run coverage:** `npm run test:coverage`
- **E2E tests:** `npm run test:e2e`

---

## 🔧 Configuration Management

### Environment Variables (Twin Pattern)

**Server-Only Secrets** (`lib/env.ts`):
```typescript
import 'server-only'
import { z } from 'zod'

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  HUBSPOT_ACCESS_TOKEN: z.string().optional(),
})

export const env = envSchema.parse(process.env)
```

**Public Variables** (`lib/env.public.ts`):
```typescript
import { z } from 'zod'

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_NAME: z.string().default('Firm Template'),
})

export const publicEnv = publicEnvSchema.parse(process.env)
```

**Rules:**
- Required vars: No `.optional()` or `.default()`
- Optional vars: Use `.optional()` or `.default(value)`
- Fail fast: Missing required vars = build error
- Template: `.env.example` documents ALL variables

---

## 🚀 Build & Deployment

### Local Development
```bash
npm run dev              # Start dev server (localhost:3000)
npm run type-check       # TypeScript validation
npm run lint             # ESLint
npm run format           # Prettier auto-fix
npm run test             # Vitest (watch mode)
```

### Production Build
```bash
npm run build            # Next.js production build
npm run postbuild        # Security check (auto-runs after build)
npm run start            # Run production build locally
```

### Cloudflare Pages Deployment
```bash
npm run pages:build      # Build for Cloudflare
npm run pages:preview    # Preview locally with wrangler
wrangler pages deploy .vercel/output/static  # Deploy
```

**Build Configuration:**
- Static Site Generation (SSG) - all pages pre-rendered
- Image optimization disabled (`unoptimized: true`)
- MDX support enabled
- Source maps enabled for debugging
- No runtime dependencies

---

## 🌐 Next.js-Specific Patterns

### Middleware (Security Layer)
```typescript
// middleware.ts - Runs on EVERY request
export function middleware(request: NextRequest) {
  // 1. Payload size check (DoS prevention)
  // 2. Security headers (CSP, X-Frame-Options, etc.)
  // 3. HSTS in production only
}

// Matcher config (excludes static assets)
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

**Critical Rules:**
- Middleware runs on ALL routes except static assets
- Security headers MUST include CSP (Content Security Policy)
- POST requests limited to 1MB (MAX_BODY_SIZE_BYTES)
- HSTS only in production (breaks localhost)
- When adding external scripts/APIs, update CSP directives

**CSP Directives to Update:**
- Adding analytics? Update `script-src` and `connect-src`
- Adding external images? Update `img-src`
- Adding fonts? Update `font-src`

### Force-Static Routes (Cloudflare Edge)
```typescript
// app/search/page.tsx
export const dynamic = 'force-static'  // REQUIRED for fs usage

// Routes using lib/blog.ts (which uses fs) MUST be force-static
```

**When to use `force-static`:**
- Route uses filesystem access (`fs` module)
- Route uses `lib/blog.ts` or `lib/search.ts`
- Examples: `/search`, `/blog/feed.xml`

**Why?** Cloudflare Edge Runtime doesn't support `fs` at request time. Must pre-render at build time.

### Sitemap & Search Sync Pattern
```typescript
// CRITICAL: When adding a page, update BOTH files

// 1. app/sitemap.ts - Add to staticPages array
{
  url: `${baseUrl}/new-page`,
  lastModified: new Date(),
  changeFrequency: 'monthly' as const,
  priority: 0.8,
}

// 2. lib/search.ts - Add to staticPages array
{
  id: 'page-new-page',
  title: 'New Page',
  description: 'Description for search',
  href: '/new-page',
  type: 'Page',
  tags: ['relevant', 'keywords'],
}
```

**Rules:**
- ALL pages must be in both sitemap.ts AND search.ts
- Blog posts auto-included (don't manually add)
- Service pages numbered 1-8 (service-1, service-2, etc.)
- Test search after adding pages

### Metadata Pattern (SEO)
```typescript
// Static metadata
export const metadata: Metadata = {
  title: 'Page Title | Firm Name',
  description: 'SEO description (max ~160 chars)',
  openGraph: {
    title: 'Page Title',
    description: 'OG description',
    images: ['/og-image.jpg'],
  },
}

// Dynamic metadata (e.g., blog posts)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(await params.slug)
  if (!post) return { title: 'Not Found' }
  
  return {
    title: `${post.title} | Firm Name`,
    description: post.description,
  }
}
```

**Rules:**
- Every page MUST export metadata
- Include site name in title for branding
- OG tags improve social sharing
- Structured data (JSON-LD) for rich snippets

---

## 📚 Data & Content Patterns

### Blog Posts (MDX)
```markdown
---
title: "Post Title"
description: "SEO description"
date: "2026-01-20"
author: "Author Name"
tags: ["tag1", "tag2"]
---

Content goes here...
```

**Processing:**
- Files: `content/blog/*.mdx`
- Parser: `lib/blog.ts` (gray-matter + reading-time)
- Generation: `generateStaticParams()` in `app/blog/[slug]/page.tsx`
- Search: Auto-indexed for full-text search

### Static Data Loading
```typescript
// lib/blog.ts
export function getAllPosts() {
  // Reads from file system at build time
  // Returns array of post metadata
}

export function getPostBySlug(slug: string) {
  // Returns single post with full content
}
```

**Rules:**
- NO client-side data fetching
- NO database queries at runtime
- All data resolved at build time

---

## 🛠 Code Quality & Conventions

### TypeScript
```typescript
// ✅ Strict mode enabled (tsconfig.json)
// ✅ Use explicit types for exports
export function processData(input: string): ProcessedData {
  // ...
}

// ⚠️ Avoid 'any' (ESLint warns)
// ⚠️ Avoid 'ts-ignore' (ESLint warns)
```

### Import Order (Prettier enforced)
```typescript
// 1. React/Next
import { useState } from 'react'
import { notFound } from 'next/navigation'

// 2. External packages
import { z } from 'zod'

// 3. Internal (use @ alias)
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
```

### Code Formatting (Prettier)
- No semicolons
- Single quotes
- 2-space indentation
- 100 character line limit
- Arrow functions without parens for single arg

### Error Handling Pattern
```typescript
try {
  // Operation
} catch (error) {
  logError('context-string', error)  // Logs to Sentry
  return { success: false, message: 'Generic message' }
}

// ❌ NEVER throw unhandled errors
// ❌ NEVER expose internal errors to users
```

---

## 📖 Documentation Standards

### File Headers (Complex Files)
```typescript
/**
 * ═══════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════
 * 
 * **FILE PURPOSE**: What this file does
 * **KEY DEPENDENCIES**: What it needs
 * **SECURITY NOTES**: Critical security considerations
 * **ITERATION HINTS**: How to extend safely
 */
```

### JSDoc for Public APIs
```typescript
/**
 * Processes user input and stores in database
 * 
 * @param data - Validated form data
 * @returns Success/error response
 * @throws Never throws (returns error response instead)
 * 
 * @example
 * const result = await submitContactForm({ name: 'John', email: 'john@example.com' })
 */
```

### AI METACODE Headers (Complex Files)
```typescript
/**
 * ═══════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════
 * 
 * **FILE PURPOSE**: What this file does and why it exists
 * **KEY DEPENDENCIES**: What it needs to function
 * **SECURITY NOTES**: Critical security considerations
 * **ITERATION HINTS**: How to extend safely
 * **KNOWN ISSUES**: Tech debt or TODOs
 * **EDGE RUNTIME**: Cloudflare-specific constraints
 * 
 * ═══════════════════════════════════════════════════════════════
 */
```

**When to add AI METACODE:**
- Security-critical files (`lib/actions.ts`, `lib/sanitize.ts`, `middleware.ts`)
- Complex business logic (`lib/search.ts`, `lib/blog.ts`)
- Files with edge runtime constraints
- Files with non-obvious iteration patterns

**Examples in codebase:**
- `middleware.ts` - Security headers + CSP configuration
- `lib/search.ts` - Static pages must be manually added
- `lib/actions.ts` - Rate limiting + sanitization flow

### AGENTS.md Files
- Required in: `app/`, `components/`, `lib/`, `__tests__/`, `content/`
- Purpose: Provide context for AI agents
- Contents: Purpose, patterns, conventions, do's and don'ts
- Update when adding new modules/patterns

---

## 🚫 Common Pitfalls (What NOT to Do)

### Security
- ❌ Commit secrets to git
- ❌ Use raw user input without sanitization
- ❌ Log sensitive data (IPs, emails, tokens)
- ❌ Expose internal error messages to users
- ❌ Access process.env directly (use lib/env.ts or lib/env.public.ts)
- ❌ Import server-only modules in client components

### Architecture
- ❌ Add `'use client'` to pages unnecessarily (default is server)
- ❌ Use client-side data fetching (breaks SSG)
- ❌ Import `lib/env.ts` in client components (will fail build)
- ❌ Create API routes for static data (no database)
- ❌ Use `fs` in routes without `export const dynamic = 'force-static'`
- ❌ Forget to add pages to BOTH sitemap.ts AND search.ts

### Styling
- ❌ Use arbitrary Tailwind values (`bg-[#123]`)
- ❌ Use inline styles (`style={{ ... }}`)
- ❌ Use CSS modules
- ❌ Create new color values outside tailwind.config.ts
- ❌ Use `!important` (indicates design system issue)

### Testing
- ❌ Skip tests for new features
- ❌ Mock entire modules (mock only what's needed)
- ❌ Write brittle tests (test behavior, not implementation)
- ❌ Commit failing tests (fix or skip with `test.skip()`)

### Code Organization
- ❌ Create utility files in random locations
- ❌ Mix server and client code in same file
- ❌ Use default exports for utilities (only for components)
- ❌ Forget to update AGENTS.md when adding new patterns

### Cloudflare-Specific
- ❌ Use Node.js-specific APIs at request time (`fs`, `path`, `crypto`)
- ❌ Assume Vercel-specific features work (Image Optimization API)
- ❌ Forget `unoptimized: true` for images

---

## 🐛 Debugging & Troubleshooting

### Build Errors

**"Module not found: Can't resolve 'server-only'"**
```bash
# Install missing dependency
npm install server-only
```

**"Middleware must export middleware function"**
- Check middleware.ts exports `export function middleware()`
- Verify matcher config is exported

**"Dynamic code evaluation not allowed"**
- Remove `eval()` or `Function()` calls
- Check CSP allows necessary scripts in middleware.ts

### TypeScript Errors

**"JSX element implicitly has type 'any'"**
- Install @types/react: `npm install --save-dev @types/react`
- Check tsconfig.json includes `"jsx": "preserve"`

**"Cannot find module '@/...' or its corresponding type declarations"**
- Check tsconfig.json has path alias: `"paths": { "@/*": ["./*"] }`
- Restart TypeScript server in IDE

### Runtime Errors

**"NEXT_PUBLIC_SITE_URL is not defined"**
- Copy `.env.example` to `.env.local`
- Set required environment variables
- Restart dev server

**"Rate limit storage unavailable"**
- Expected in development without Upstash Redis
- Falls back to in-memory (single instance only)
- Add UPSTASH_REDIS_REST_URL for production

**"Supabase client not initialized"**
- Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
- Verify Zod validation passed in lib/env.ts

### Cloudflare Deployment Errors

**"Build failed: fs.readFileSync is not defined"**
- Add `export const dynamic = 'force-static'` to route
- Verify route uses fs only at build time

**"Image optimization not available"**
- Expected with Cloudflare Pages
- Verify `unoptimized: true` in next.config.mjs

**"Middleware error: Response body locked"**
- Don't read request body in middleware
- Payload size check uses headers only

---

## 🚫 Common Pitfalls (What NOT to Do)

### Security
- ❌ Commit secrets to git
- ❌ Use raw user input without sanitization
- ❌ Log sensitive data (IPs, emails, tokens)
- ❌ Expose internal error messages to users

### Architecture
- ❌ Add `'use client'` to pages unnecessarily
- ❌ Use client-side data fetching (breaks SSG)
- ❌ Import server-only modules in client components
- ❌ Create API routes for data (no database)

### Styling
- ❌ Use arbitrary Tailwind values (`bg-[#123]`)
- ❌ Use inline styles
- ❌ Use CSS modules
- ❌ Create new color values outside tailwind.config.ts

### Testing
- ❌ Skip tests for new features
- ❌ Mock entire modules (mock only what's needed)
- ❌ Write brittle tests (test behavior, not implementation)

### Code Organization
- ❌ Create utility files in random locations
- ❌ Mix server and client code in same file
- ❌ Use default exports for utilities (only for components)

---

## 🎯 Checklist for New Features

### Adding a Page
- [ ] Create `app/path/page.tsx` (server component by default)
- [ ] Export `metadata` const for SEO
- [ ] Add to `app/sitemap.ts` (staticPages array)
- [ ] Add to `lib/search.ts` (staticPages array) for searchability
- [ ] Update navigation if needed (components/Navigation.tsx)
- [ ] Test locally & mobile responsiveness
- [ ] Validate TypeScript with `npm run type-check`

### Adding a Dynamic Route  
- [ ] Create `app/path/[param]/page.tsx`
- [ ] Export `generateStaticParams()` for SSG pre-rendering
- [ ] Export `generateMetadata()` for dynamic SEO
- [ ] Add to sitemap (dynamic or static entries)
- [ ] Test with multiple param values
- [ ] Verify all routes pre-render at build time

### Adding a Page with File System Access
- [ ] Create page in `app/`
- [ ] Add `export const dynamic = 'force-static'` at top of file
- [ ] Verify uses only build-time data (no request-time fs)
- [ ] Test build succeeds: `npm run build`
- [ ] Test with Cloudflare adapter: `npm run pages:build`

### Adding a Component
- [ ] Create in `components/` or `components/ui/`
- [ ] Add `'use client'` only if interactive
- [ ] TypeScript interface for props
- [ ] JSDoc documentation
- [ ] Test in `__tests__/components/`
- [ ] Update `components/AGENTS.md` if significant

### Adding a Form Field
- [ ] Update Zod schema in `lib/contact-form-schema.ts`
- [ ] Add `register()` in component
- [ ] Sanitize in `lib/actions.ts`
- [ ] Update test in `__tests__/components/`
- [ ] Test validation edge cases

### Adding Environment Variable
- [ ] Add to `.env.example` with comment
- [ ] Add Zod schema in `lib/env.ts` or `lib/env.public.ts`
- [ ] Use `.url()`, `.email()`, `.min()` validators
- [ ] Test locally with `npm run type-check`
- [ ] Document in relevant AGENTS.md

### Pre-Deployment Checklist
- [ ] All environment variables set in Cloudflare
- [ ] `npm run build` succeeds locally
- [ ] `npm run test:coverage` meets thresholds
- [ ] `postbuild` secret scan passes
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Test deployed site in preview

---

## 📋 Governance & Task Management

### Authority Order
1. **CODEBASECONSTITUTION.md** - Non-negotiable rules
2. **READMEAI.md** - Operational modes and task flow
3. **P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md** - Active tasks (task truth sources)
4. **BESTPR.md** - This file (best practices)
5. **AGENTS.md** - Agent-specific instructions
6. **specs/** - Non-binding notes

### Core Principles (from Constitution)
- **Truth:** Never invent facts; use **UNKNOWN** + cite checked files
- **Clarify:** Ask before implementing ambiguous requirements
- **Small diffs:** Reversible changes preferred
- **Verify:** Tests/lint/build required for all changes
- **Continuity:** Keep PROJECT_STATUS.md and CHANGELOG.md accurate

### Cost Control
- GitHub Actions OFF by default (see `githubactions/README.md`)
- Automation requiring spend needs explicit approval
- Prefer local scripts over paid services

### Task Workflow
1. Check `P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md` for current phase and tasks
2. Implement ONE task (or small linked set)
3. Run verification (tests/lint/build)
4. Update `PROJECT_STATUS.md` with progress
5. Move completed tasks to `TODOCOMPLETED.md`

---

## 🔍 Quick Lookup Tables

### Critical Files
| File | Purpose | When to Check |
|------|---------|---------------|
| `lib/env.ts` | Server secrets | Adding env vars |
| `lib/sanitize.ts` | Input safety | Processing user input |
| `lib/actions.ts` | Server actions | Adding forms/APIs |
| `tailwind.config.ts` | Design tokens | Adding styles |
| `package.json` | Dependencies | Adding packages |
| `.env.example` | Env template | Configuring deployment |

### Scripts Reference
| Command | Purpose | When to Run |
|---------|---------|-------------|
| `npm run dev` | Dev server | Local development |
| `npm run build` | Production build | Before deployment |
| `npm run lint` | ESLint check | Before commit |
| `npm run format` | Auto-format | Before commit |
| `npm test` | Unit tests | After code changes |
| `npm run test:coverage` | Coverage report | Before PR |
| `npm run test:e2e` | E2E tests | Before deployment |
| `npm run type-check` | TypeScript validation | After type changes |

### Key Dependencies
| Package | Purpose | Version |
|---------|---------|---------|
| next | Framework | 15.5.2 |
| react | UI library | 19.2.3 |
| typescript | Type safety | 5.7.2 |
| tailwindcss | Styling | 3.4.17 |
| zod | Validation | 4.3.5 |
| vitest | Testing | 4.0.16 |
| @sentry/nextjs | Observability | 10.32.1 |

---

## 💡 Tips for AI Agents

### Before Making Changes
1. Read `CODEBASECONSTITUTION.md` (non-negotiables)
2. Check `P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md` for current task/phase
3. Review this file (BESTPR.md) for patterns
4. Check relevant `AGENTS.md` for directory-specific rules

### While Coding
1. Use existing patterns (don't reinvent)
2. Keep changes minimal and surgical
3. Follow security non-negotiables
4. Write tests alongside code
5. Document complex logic

### Before Committing
1. Run `npm run type-check`
2. Run `npm run lint`
3. Run `npm test` (relevant tests)
4. Verify no secrets in code
5. Update relevant AGENTS.md if patterns changed

### When Stuck
1. Check if pattern exists in codebase (use grep/glob)
2. Review similar files for guidance
3. Ask for clarification (don't guess)
4. Mark uncertain assumptions with **UNKNOWN**

---

## 📞 Support & Resources

### Documentation Map
- **Start:** `READMEAI.md` (entry point)
- **Rules:** `CODEBASECONSTITUTION.md` (governance)
- **Tasks:** `P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md` (what to work on)
- **Best Practices:** This file (how to work)
- **Architecture:** `docs/TEMPLATE_ARCHITECTURE.md`
- **Testing:** `docs/TESTING_STRATEGY.md`
- **Security:** `docs/SECURITY_BASELINE.md`
- **Deployment:** `docs/CLOUDFLARE_DEPLOYMENT.md`

### Getting Help
1. Check relevant AGENTS.md in working directory
2. Search docs/ for detailed guides
3. Review similar implementations in codebase
4. Ask specific questions with context

---

**Version History:**
- 1.0.0 (2026-01-21): Initial creation with comprehensive patterns

**Maintenance:**
- Update when new patterns emerge
- Review quarterly for accuracy
- Keep synchronized with CODEBASECONSTITUTION.md
