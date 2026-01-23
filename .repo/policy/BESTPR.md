# BESTPR — firm-template Best Practices (Repo-Specific)

**File**: `.repo/policy/BESTPR.md`

## Purpose
Use this guide to ship changes that align with firm-template architecture, workflows, and quality bars. It captures the stack, repo layout, and the checks expected before delivery.

## Repository Map (where to work)
- **app/** — Next.js App Router directory containing routes, pages, layouts, and API routes.
- **components/** — Reusable React components (Layout, ErrorBoundary, Navigation, Footer, etc.).
- **lib/** — Shared utilities, helpers, and business logic (actions, analytics, email, scheduling, etc.).
- **content/** — Content files (blog posts, markdown content).
- **public/** — Static assets (images, icons, fonts).
- **__tests__/** — Test files for components, lib utilities, and app routes.
- **tests/e2e/** — End-to-end tests using Playwright.
- **scripts/** — Project automation and utility scripts.
- **.repo/** — Governance framework, policies, and agent configuration.

## Tech Stack & Core Libraries
- **Framework:** Next.js 15.5.2 with App Router
- **Language:** TypeScript 5.7.2
- **UI Library:** React 19.2.3
- **Styling:** Tailwind CSS 3.4.17
- **Forms:** React Hook Form 7.71.1 with Zod 4.3.5 validation
- **Content:** MDX with next-mdx-remote for blog/content
- **Testing:** Vitest 4.0.17 (unit), Playwright 1.49.0 (e2e), Testing Library
- **Formatting & Linting:** ESLint 9.39.2, Prettier 3.8.0, TypeScript compiler
- **Observability:** Sentry for error tracking
- **Deployment:** Cloudflare Pages (with next-on-pages adapter)

## Delivery Workflow (what to run)
1. **Local checks before PR:**
   - `npm run lint` — Run ESLint
   - `npm run type-check` — TypeScript type checking
   - `npm run test` — Run unit tests (Vitest)
   - `npm run test:e2e` — Run end-to-end tests (Playwright)
   - `npm run build` — Build the application
   - `npm run format:check` — Check code formatting
2. **When touching content:** Update markdown files in `content/` directory.
3. **When touching docs:** Keep documentation organized and update relevant guides as needed.

## Repo-Specific Coding Practices
### Next.js App Router
- Use the App Router structure (`app/` directory) for all routes and pages.
- Create route handlers in `app/api/` for API endpoints.
- Use Server Components by default, Client Components only when needed (interactivity, hooks, browser APIs).
- Use `layout.tsx` for shared layouts and `page.tsx` for route pages.
- Leverage Next.js built-in features: Image optimization, metadata API, server actions.

Example:
```typescript
// app/about/page.tsx
export default function AboutPage() {
  return <div>About content</div>;
}
```

### React Components (TypeScript)
- Prefer existing component patterns in `components/` before introducing new abstractions.
- Use functional components with TypeScript. Use proper type annotations.
- Use React Hook Form with Zod for form validation.
- Keep components focused and reusable.
- Use Server Components when possible, Client Components only when necessary.

Example:
```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

export const ContactForm: React.FC = () => {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });
  // ...
};
```

### Shared Utilities
- Keep shared utilities and helpers in `lib/` directory.
- Use TypeScript for all utilities with proper type definitions.
- Keep business logic separate from UI components.
- Use server actions (`lib/actions.ts`) for server-side operations.

### Testing
- Unit tests in `__tests__/` directory using Vitest and Testing Library.
- E2E tests in `tests/e2e/` using Playwright.
- Test components, utilities, and critical user flows.

## Documentation Expectations
- Follow the documentation structure in `/docs`:
  - `docs/ARCHITECTURE.md` — System architecture and design decisions
  - `docs/ONBOARDING.md` — Getting started guide
  - `docs/DEVELOPMENT.md` — Development workflow and commands
  - `docs/RUNBOOK.md` — Operational procedures
- Root-level guides like `README.md` and `AGENTS.md` should contain high-level navigation or onboarding details.
- When adding new modules or significant features, update relevant architecture documentation.

## Governance Alignment
- Follow the project governance rules in `.repo/policy/CONSTITUTION.md` for PR review, task traceability, verification evidence, and documentation rigor.
- Apply operating principles from `.repo/policy/PRINCIPLES.md` for day-to-day development practices.
- Quality gates in `.repo/policy/QUALITY_GATES.md` define merge requirements and verification checks.
- Security rules in `.repo/policy/SECURITY_BASELINE.md` define security checks, HITL triggers, and forbidden patterns.
- HITL process in `.repo/policy/HITL.md` defines how human-required actions are tracked and managed.
- Module boundaries in `.repo/policy/BOUNDARIES.md` define import rules and enforcement (Principle 13: Respect Boundaries).
- All changes must be traceable to tasks in `.repo/tasks/` (Article 5: Strict Traceability, Principle 25).
- Completed tasks must be archived to `agents/tasks/ARCHIVE.md` after PR merge.
- For risky changes (logins, money flows, user data, security), route to HITL per Article 6 & 8, Principle 10, SECURITY_BASELINE.md triggers, and HITL.md process.
- PRs must include filepaths, verification evidence, and rollback plans per Principles 6, 12, and 17.
- All quality gates must pass before merge (hard gates) or have approved waivers (waiverable gates).
- Never commit secrets (SECURITY_BASELINE.md: absolute prohibition).

---
**Canonical reference:** This document is the single source of truth for repo-specific best practices. Link to it from all AGENTS.md files and governance docs.
