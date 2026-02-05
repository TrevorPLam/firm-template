# Coding Standards

## Purpose

Define baseline quality standards for code and documentation changes.

## Implementation Standards

1. Follow existing TypeScript and monorepo conventions in each package/app.
2. Keep changes minimal, scoped, and reversible.
3. Add inline commentary only for non-obvious logic and invariants.

## Verification Standards

- Run relevant quality gates for each change (`lint`, `type-check`, `test`, `build` as applicable).
- If full-suite checks are impractical, run targeted checks and document why.

## Documentation Standards

- Update docs whenever contracts, workflows, or developer setup changes.
- Include file/module purpose, inputs/outputs, and invariants in new governance docs.
