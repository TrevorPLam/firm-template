# READMEAI.md — AI Operating Console (Root)

Document Type: Governance
Version: 3.2.0
Last Updated: 2026-01-20
Status: Active

Purpose: Make work in this repo deterministic, auditable, and agent-executable while staying readable for a non-coder owner.

**TEMPLATE STATUS**: Template sanitization is complete. Current focus is documentation and customization guidance (TODO.md Phase 2).

## Start here (required read order)
1) `CODEBASECONSTITUTION.md` (non-negotiable rules)
2) `AGENTS.md` (how agents must behave)
3) `BESTPR.md` (best practices - **REQUIRED before coding**)
4) `TODO.md` (task truth source - **currently focused on template documentation**)
5) Runbooks (use when instructed):
   - `CODEAUDIT.md`
   - `SECURITYAUDIT.md`
   - `DEPENDENCYAUDIT.md`
   - `RELEASEAUDIT.md`
   - `DOCSAUDIT.md`
6) `repo.manifest.yaml` (how to run/verify this repo)
7) `PROJECT_STATUS.md` (current state + next step)

## Current Priority: Template Documentation
**FOCUS**: Execute TODO.md Phase 2 (Tasks T-009 through T-013) to document customization, governance updates, and release readiness.

**DO NOT**:
- Add marketing-specific features
- Make assumptions about the target vertical
- Deviate from the template conversion game plan

**DO**:
- Replace marketing content with generic placeholders
- Preserve 100% of existing functionality
- Make content configurable via environment variables
- Document customization points for template users

## Task truth model
- **Authoritative**: `TODO.md`
- **Archive**: `TODOCOMPLETED.md`
- **Non-binding notes**: `specs/` (may contain ideas; must be converted into tasks to be actionable)
- Optional helper: `scripts/sync-todo.sh` generates `TODO.generated.md` (informational only)

## Modes
- **Planner**: propose plan + questions; no code edits
- **Builder**: implement exactly one task (or a small, linked set) from TODO.md Phase 2
- **Auditor**: inspect + create tasks; do not refactor blindly
- **Status-Sync**: update `PROJECT_STATUS.md` and move completed tasks to `TODOCOMPLETED.md`
- **Emergency**: stop-the-bleed (secrets/auth/payment)

**Current Mode Recommended**: Builder (for documentation tasks T-009 through T-013)

## Verification (minimum)
- Prefer existing repo commands (see `repo.manifest.yaml`).
- If commands are missing, record **UNKNOWN** and create a task to add them.
- For UI changes: verify **mobile** behavior explicitly.

## GitHub Actions (cost control)
GitHub Actions are stored under `githubactions/` and are **disabled by default**.
See `githubactions/README.md` to enable/disable.

## Documentation rule
If you change behavior, update the relevant docs and/or tasks so agents don’t drift.
