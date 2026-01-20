# PROJECT_STATUS.md — Working Status & Decisions

Document Type: Operations
Canonical Status: Canonical
Owner: Trevor
Audience: Humans + agents
Last Updated: 2026-01-20

## Purpose
A lightweight place to record the current state of the project, major decisions, and open questions.
This is not a task list; tasks belong in `TODO.md`.

## Current snapshot
- Phase: **Template Sanitization Phase** - Converting marketing firm to generic professional services template
- Environment: Next.js 15.5.2, TypeScript, Tailwind CSS, Cloudflare Pages Adapter Installed
- Status: Template conversion game plan complete; ready to execute Phase 1 tasks (T-001 through T-008)
- Last known "green" state: Build passes locally, all tests passing
- Key risks: 
    - Next.js 15.x lock-in: `@cloudflare/next-on-pages` has peer dependency conflicts with Next.js 16
    - Edge Runtime limitations: `fs` usage requires explicitly marking some routes as `force-static`
    - Template must maintain 100% functionality during sanitization
- Testing posture: E2E coverage for contact submission, rate limiting, and search; Vitest unit tests configured

## Current Focus
**PRIMARY GOAL**: Convert this repository from a marketing firm-specific implementation into a reusable professional services template.

**Progress**:
- ✅ Analysis complete: 365+ marketing-specific references identified
- ✅ Game plan created: 21 tasks organized into 4 phases
- ✅ TODO.md restructured: Sanitization tasks prioritized as P0
- ✅ README.md updated: Now reflects template purpose and usage
- 🔄 **NEXT**: Execute Phase 1 (T-001 through T-008) - Core template sanitization

**Target Audience**: Any professional services firm (law, consulting, accounting, design, etc.)

## Decisions (append-only)
Use this format:

- Date: 2026-01-20
  - Decision: Restructure TODO.md with sanitization as Phase 1 (P0 priority)
  - Why: Template conversion is the primary goal; all other work should happen after sanitization is complete
  - Alternatives considered: Mixing sanitization with infrastructure tasks (rejected - too confusing)
  - Trade-offs: Delays infrastructure improvements but ensures focused, complete conversion
  - Follow-up: Execute T-001 through T-008 to complete core sanitization

- Date: 2026-01-20
  - Decision: Renumber all tasks starting from T-001
  - Why: Clean slate for template-focused roadmap; old task numbers referenced marketing-specific work
  - Alternatives considered: Keep old numbering (rejected - confusing for template users)
  - Trade-offs: Breaks references to old task IDs in git history (acceptable)
  - Follow-up: Archive old TODO.md for historical reference

- Date: 2026-01-07
  - Decision: Downgrade to Next.js 15.5.2 and ESLint 9.
  - Why: `@cloudflare/next-on-pages` adapter did not strictly support Next.js 16, causing peer dependency install failures and runtime build issues.
  - Alternatives considered: Forcing peer deps (failed at runtime), Custom build adapter (too high effort).
  - Trade-offs: Cannot use Next.js 16 features until Cloudflare adapter updates.
  - Follow-up (task IDs in TODO.md): Monitor Cloudflare adapter updates (T-020)

- Date: 2026-01-07
  - Decision: Use manual `archive/eslint.config.mjs` style configuration.
  - Why: The `next lint` CLI command was broken in the mixed version environment (Next 15 + new ESLint).
  - Alternatives considered: Fixing `next lint`.
  - Trade-offs: Usage of `eslint .` instead of `next lint` in scripts.

- Date: 2026-01-07
  - Decision: Mark `feed.xml` and `search` routes as `dynamic = 'force-static'`.
  - Why: They use `fs` (via `lib/blog.ts`) which is not available in the Cloudflare Edge Runtime unless pre-rendered at build time.
  - Follow-up (task IDs in TODO.md): N/A

## Open questions
- Q: Should we create example implementations for specific verticals (law firm, consulting firm)?
  - Context: Would help users understand customization better
  - Needed input: User feedback on which verticals are most common
  - Task ID: T-011 (planned)
