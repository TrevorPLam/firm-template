# Tool Policy

## Purpose

Define safe, reproducible use of CLI/tooling during implementation and verification.

## Allowed Tooling

- `pnpm` scripts defined in the root `package.json`
- Repository-local scripts under `scripts/`
- Standard shell utilities for file inspection/editing

## Required Practices

1. Prefer deterministic commands (`pnpm test`, `pnpm lint`, `pnpm type-check`, `pnpm build`).
2. Run the narrowest verification set that proves a change is correct.
3. Record command results in task notes and archive entries.
4. Avoid destructive commands unless required and documented.

## Prohibited Practices

- Installing global tooling not required by the task.
- Skipping checks without creating a follow-up backlog task.
- Executing commands that expose credentials/secrets in logs.
