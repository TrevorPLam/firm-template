# AGENTS.md — Agent Instructions (Root)

Last Updated: 2026-01-21
Applies To: Any coding/documentation agent operating in this repo

## Authority order
1) `CODEBASECONSTITUTION.md`
2) `READMEAI.md`
3) `BESTPR.md` (best practices - READ THIS FIRST when coding)
4) `TODO.md`
5) Audit runbooks (`CODEAUDIT.md`, `SECURITYAUDIT.md`, etc.)
6) `specs/` (non-binding notes)

## Non-negotiables
- Do not invent facts about the repo. Use **UNKNOWN** + cite what you checked.
- If requirements are ambiguous, ask questions before implementing.
- `TODO.md` is the task truth source. Do not auto-edit it except to add/update tasks.
- Secrets must never be committed.

## Output expectations
- Prefer small, reversible diffs.
- Every change must include verification (tests/lint/build or observable behavior).
- When you create tasks, include exact file paths and acceptance criteria.

## Cost control
- Assume GitHub Actions are OFF by default. See `githubactions/README.md`.
- Prefer local scripts and manual checks over paid services.

## Best Practices Reference
**⚠️ REQUIRED READING:** Before making any code changes, consult `BESTPR.md` for:
- Security non-negotiables (secrets, sanitization, error handling)
- Component patterns (server vs client)
- Styling conventions (Tailwind design tokens only)
- Form handling (Zod + react-hook-form)
- Testing patterns (Vitest + Playwright)
- Configuration management (environment variables)
- Common pitfalls and what NOT to do

`BESTPR.md` is a token-optimized, repo-specific guide designed to help you ship quality code the first time, every time.
