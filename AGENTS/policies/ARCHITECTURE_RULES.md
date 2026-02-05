# Architecture Rules

## Purpose

Define repo-level architectural constraints for implementation work.

## Module Boundaries

- Keep app-specific logic inside `apps/*`.
- Keep reusable capabilities/components inside `packages/*`.
- Keep automation and maintenance scripts inside `scripts/*`.
- Keep external gateway/service logic within `services/*`.

## Cross-Cutting Rules

1. Shared packages must remain framework-agnostic where possible.
2. Integrations in `packages/integrations` must default to safe/no-op behavior unless explicitly enabled.
3. Documentation changes that alter developer workflows must be reflected in `README.md` and `docs/`.

## Workflow Orchestration

- Tasks flow: `AGENTS/tasks/BACKLOG.toon` -> `AGENTS/tasks/TODO.toon` -> `AGENTS/tasks/ARCHIVE.toon`.
- Completed work requires verification evidence and session notes.
