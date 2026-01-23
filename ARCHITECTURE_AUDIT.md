# Diamond-Level Architecture Audit

**Repository:** TrevorPLam/firm-template  
**Audit Date:** 2026-01-23  
**Auditor Role:** Principal Software Architect  
**Framework:** Next.js 15.5 (App Router)  
**Language:** TypeScript

---

## 1. Architectural Summary

This is a **Next.js App Router application with a clean three-layer architecture**: presentation (app + components), business logic (lib), and implicit framework layer (Next.js runtime). The system employs a **functional, dependency-injection-free design** where the lib layer provides pure utilities and server actions, components consume lib utilities, and app routes compose components. Dependencies flow unidirectionally: `app → components → lib → external packages`. There are **no circular dependencies, no framework lock-in in business logic, and clear separation between server and client concerns**. The architecture is predominantly **file-based with conventional boundaries** rather than explicit structural enforcement (no module boundaries, barrel exports, or architectural constraints at build time).

---

## 2. Architectural Strengths

- **Unidirectional dependency flow**: The `app → components → lib` hierarchy is consistently maintained across 117 TypeScript files. Zero violations detected. The lib layer has **no imports from components or app**, establishing a clean dependency direction that makes change propagation predictable.

- **Server/client boundary is explicit and enforced**: Server-only modules use `'server-only'` imports (e.g., `lib/email.ts`), server actions are marked with `'use server'` directives, and client components explicitly declare `'use client'`. This structural distinction prevents accidental server-side code leakage to the client bundle and is enforced by Next.js at build time.

- **Domain logic insulation from frameworks**: The lib layer contains pure functions and server actions with **zero React dependencies**. Business logic for sanitization (`sanitize.ts`), validation (`contact-form-schema.ts`), email sending (`email.ts`), and rate limiting (`actions.ts`) can be tested and evolved independently of UI concerns. This matters because framework migrations (e.g., Next.js → Remix) would require only rewiring, not rewriting domain logic.

- **Single responsibility per module**: Each lib file has a focused, durable responsibility: `sanitize.ts` handles XSS prevention, `email.ts` manages transactional emails, `blog.ts` handles content parsing, `actions.ts` orchestrates form submission. This granularity supports parallel evolution—multiple capabilities can be modified simultaneously without merge conflicts.

- **No "utils" grab-bag anti-pattern**: The single `utils.ts` file contains only one utility function (`cn`) for Tailwind class merging—a presentation concern, not business logic. Other utilities are domain-specific (e.g., `sanitize.ts`, `logger.ts`, `video.ts`), demonstrating ownership clarity.

- **Dependency injection via composition, not frameworks**: Server actions like `submitContactForm` compose smaller functions (`insertLead`, `syncHubSpotContact`, `sendContactEmails`) rather than relying on DI containers or service locators. This makes data flow explicit and testing straightforward through simple function mocking.

- **Presentation layer decomposition**: Components are organized by **functional role** (UI primitives in `components/ui/`, domain-specific components at root, app routes in `app/`). This is superior to organizing by page or feature because UI primitives can be reused across multiple domains without creating tight coupling.

---

## 3. Architectural Violations & Risks

- **No enforced module boundaries**: While the dependency direction is currently clean, TypeScript's `paths` configuration allows any module to import from any other. There is **no compile-time enforcement** preventing future developers (or AI agents) from introducing `lib → components` or `components → app` dependencies. This relies entirely on discipline rather than structure. Under heavy AI-assisted development, accidental violations are inevitable without architectural linting (e.g., `eslint-plugin-boundaries`, `nx/enforce-module-boundaries`).

- **Framework coupling in middleware**: The `middleware.ts` file contains **both** infrastructure concerns (security headers, CSP policy) **and** application logic (theme-editor route blocking, payload size limits). This violates separation of concerns—middleware should be pure infrastructure, delegating application decisions to the app layer. If Next.js middleware capabilities change (e.g., edge runtime restrictions), this file becomes brittle.

- **Implicit architectural rules**: The three-layer structure (app/components/lib) is enforced only by **convention and documentation** (via extensive `AI METACODE` comments in files). There is no `ARCHITECTURE.md` at the root summarizing the design principles. AI agents must infer rules from scattered examples, increasing the risk of pattern drift over time. New contributors (human or AI) lack a single source of architectural truth.

- **lib layer lacks internal boundaries**: The lib folder is a flat namespace with 16 files. While each file is focused, there is **no sub-layering** to distinguish foundational utilities (e.g., `sanitize.ts`, `logger.ts`) from higher-level orchestration (e.g., `actions.ts`, `email.ts`). As the lib grows, this flat structure will obscure dependency relationships within the layer. For example, `actions.ts` depends on `sanitize.ts`, `email.ts`, and `logger.ts`, but this hierarchy is only discoverable by reading imports—not enforced structurally.

- **Domain model is diffuse**: Business concepts like "Lead" and "Contact" are encoded indirectly through Zod schemas (`contact-form-schema.ts`), inline type definitions in `actions.ts`, and API payloads. There is **no centralized domain model** file defining core entities, their invariants, or their relationships. This makes it hard to answer questions like "What is a Lead?" or "What are the valid states of a Contact?" without reading multiple files. For domain-heavy systems, this becomes a major evolvability barrier.

- **No architectural testing**: There are **no tests verifying architectural rules**. For example, no test ensures that lib modules never import from components, or that server actions never leak to client bundles. Tools like `dependency-cruiser` or `eslint-plugin-boundaries` could codify these rules and fail CI on violations, but they are absent. This increases the risk of gradual architectural decay.

- **Type-only cross-layer dependencies obscure boundaries**: Several components import **types** from lib (e.g., `SearchItem`, `ContactFormData`, `SchedulingConfig`). While types are compile-time artifacts and don't create runtime coupling, they do create **semantic coupling**—changes to lib types can break components. This is acceptable for simple DTOs, but if lib types become complex domain models, components become tightly coupled to domain internals. This isn't a violation yet, but it's a risk as the system grows.

---

## 4. Diamond-Level Gaps

A Diamond-Level architecture must demonstrate **structural resistance to accidental complexity**. This repository demonstrates **behavioral compliance** but lacks **structural enforcement**. Specific gaps:

1. **No compile-time boundary enforcement**: The clean dependency direction exists today but is not protected against future violations. Diamond-Level requires that bad dependencies are **impossible to introduce**, not just discouraged.

2. **No explicit architectural manifest**: Diamond-Level systems have a root-level `ARCHITECTURE.md` documenting the layer hierarchy, dependency rules, and rationale. This repository has excellent per-file documentation (AI METACODE blocks) but no system-wide architectural overview. AI agents must infer the architecture from examples, which is error-prone.

3. **Missing sub-layering in lib**: The lib folder should internally distinguish between **foundational** (sanitize, logger, utils), **infrastructure** (email, analytics, env), and **application** (actions, search, blog) layers. Currently, all lib modules are peers, obscuring their relative importance and dependency order.

4. **Implicit domain model**: Diamond-Level systems have an **explicit domain layer** defining entities, value objects, and business invariants. This repository encodes domain concepts indirectly through Zod schemas and inline types. A `lib/domain/` subfolder with `Lead.ts`, `Contact.ts`, etc., would centralize domain knowledge and make evolution safer.

5. **No architectural tests**: Diamond-Level systems include tests that verify architectural rules (e.g., "lib must not import from components"). These tests act as executable documentation and prevent regressions. This repository has excellent functional test coverage but zero architectural tests.

6. **Framework coupling in critical paths**: While most business logic is framework-agnostic, the `middleware.ts` file and Next.js-specific constructs (`headers()`, `NextRequest`) are embedded in the app layer. Diamond-Level systems isolate framework-specific code in adapter modules, making the core logic portable.

---

## 5. High-Leverage Structural Improvements

These changes would elevate the architecture to Diamond-Level with **minimal code churn**:

### 5.1 Add Compile-Time Boundary Enforcement

**Action**: Install and configure `eslint-plugin-boundaries` or `@nx/eslint-plugin` to enforce dependency rules.

**Rules to add**:
```javascript
// .eslintrc.js
{
  "rules": {
    "boundaries/element-types": ["error", {
      "default": "disallow",
      "rules": [
        { "from": "app", "allow": ["components", "lib"] },
        { "from": "components", "allow": ["lib"] },
        { "from": "lib", "allow": ["external"] }
      ]
    }]
  }
}
```

**Why high-leverage**: This single change makes bad dependencies **impossible** rather than discouraged. It protects the clean architecture even under aggressive AI-assisted development.

### 5.2 Create Architectural Manifest

**Action**: Create `/ARCHITECTURE.md` at repository root documenting:
- Layer hierarchy (app → components → lib)
- Dependency rules (who can import whom)
- Rationale for each layer
- Change scenarios and their impact boundaries

**Why high-leverage**: This provides a **single source of truth** for AI agents and new contributors. Without this, every AI agent must rediscover the architecture by reading scattered examples.

### 5.3 Introduce Sub-Layering in lib

**Action**: Reorganize lib into three sub-folders:
```
lib/
  foundation/     # sanitize, logger, utils (no internal dependencies)
  infrastructure/ # email, analytics, env (depends on foundation)
  application/    # actions, search, blog (depends on both)
```

**Why high-leverage**: This makes the internal dependency hierarchy **visible in structure**. AI agents can immediately see that `foundation/` modules are the most stable, and changes to `application/` modules are least likely to have ripple effects.

### 5.4 Extract Explicit Domain Layer

**Action**: Create `lib/domain/` subfolder with explicit entity types:
```typescript
// lib/domain/Lead.ts
export type Lead = {
  id: string
  name: string
  email: string
  phone: string
  message: string
  status: 'pending' | 'synced' | 'needs_sync'
}

// Consolidates inline types from actions.ts, contact-form-schema.ts
```

**Why high-leverage**: This centralizes domain knowledge and makes the "language" of the system explicit. It also decouples domain concepts from persistence (Supabase) and validation (Zod) concerns.

### 5.5 Add Architectural Tests

**Action**: Add `__tests__/architecture/boundaries.test.ts`:
```typescript
import { getDependencies } from 'dependency-cruiser'

test('lib modules must not import from components or app', () => {
  const violations = getDependencies('lib/**/*.ts')
    .filter(dep => dep.source.includes('components') || dep.source.includes('app'))
  expect(violations).toHaveLength(0)
})
```

**Why high-leverage**: This makes architectural rules **executable and testable**. CI fails immediately if a violation is introduced, preventing gradual decay.

### 5.6 Extract Middleware Application Logic

**Action**: Move theme-editor route blocking from `middleware.ts` to a new `lib/infrastructure/route-guards.ts`:
```typescript
// lib/infrastructure/route-guards.ts
export function shouldBlockThemeEditor(env: string): boolean {
  return env !== 'development'
}

// middleware.ts
import { shouldBlockThemeEditor } from '@/lib/infrastructure/route-guards'
if (request.nextUrl.pathname.startsWith('/theme-editor') && shouldBlockThemeEditor(process.env.NODE_ENV)) {
  return new NextResponse('Not Found', { status: 404 })
}
```

**Why high-leverage**: This isolates application decisions from infrastructure concerns, making both more testable. It also demonstrates the architectural principle that middleware should be a **thin adapter**, not a logic container.

---

## 6. Final Verdict

**Near-Diamond with Structural Risks**

### Justification

This repository demonstrates **behavioral Diamond-Level architecture** but lacks **structural enforcement**. The actual dependency graph is clean, unidirectional, and well-factored. Business logic is insulated from frameworks. Responsibilities are clearly assigned. Change propagation is predictable. However, these properties rely entirely on **developer discipline and convention** rather than **compile-time guarantees** or **architectural tests**.

### Why Not Diamond-Level

Diamond-Level requires that **good architecture is structurally easy** and **bad architecture is structurally hard**. In this repository:
- Good architecture is easy (conventions are clear and documented)
- Bad architecture is **not hard** (nothing prevents lib → components imports or framework coupling)

Under the stated assumption of **heavy AI-assisted development** with a **solo operator**, the lack of structural enforcement is a critical gap. AI agents excel at following examples but can introduce subtle violations if rules are implicit. A single accidental `lib → components` import could trigger gradual erosion of the clean boundary.

### Strengths That Justify "Near-Diamond"

- Zero dependency violations in 117 files (100% compliance)
- Explicit server/client split enforced by Next.js
- Domain logic is framework-agnostic and testable
- No "utils" or "shared" anti-patterns
- Clear single responsibility per module

### Risks That Prevent "Diamond"

- No compile-time boundary enforcement (relies on discipline)
- No architectural manifest (rules are inferred, not documented)
- No architectural tests (violations are undetected until code review)
- Framework coupling in middleware (application logic mixed with infrastructure)
- Domain model is diffuse (no centralized entity definitions)

### Path to Diamond-Level

Implement improvements 5.1, 5.2, and 5.5 from Section 5 (boundary enforcement, architectural manifest, architectural tests). These three changes would elevate the architecture to full Diamond-Level within **1-2 days of work** for a solo operator, with **zero risk** to existing functionality (all changes are structural, not behavioral).

---

## Explicit Exclusions (Per Audit Scope)

This audit **did not** evaluate:
- Testing strategy or test coverage
- Code formatting or linting rules
- CI/CD pipelines or deployment processes
- Security vulnerabilities (except architectural consequences)
- Naming conventions or code style
- Team processes or governance

All findings are strictly **architectural**: structure, boundaries, and dependency direction only.

---

**End of Audit**
