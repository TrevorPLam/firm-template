# DOCSAUDIT.md — Documentation Audit

Document Type: Audit Runbook
Last Updated: 2026-01-07
Precedence: `CODEBASECONSTITUTION.md` → `READMEAI.md` → `P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md` → this document
Owner: AGENT

Purpose: Keep docs accurate, discoverable, and aligned to governance without losing historical context.

## AGENT execution (runbook)
Inputs to inspect:
- `READMEAI.md` and `DOCS_ROOT.md`
- `docs/` tree (including ARCHIVE/)
- `P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md / TODOCOMPLETED.md`
- `specs/` (non-binding notes)

Execution steps:
1) Identify stale or conflicting docs; mark **UNKNOWN** if unverifiable and create tasks.
2) Ensure navigation files (READMEAI, docs/DOCS_INDEX.md, docs/REPO_MAP.md) link to new/changed docs.
3) Move actionable items into P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md; replace in-doc tasks with task IDs.
4) Confirm archived materials stay under `docs/ARCHIVE/` with links updated.

Stop conditions:
- If doc changes imply behavior changes without validation, create tasks instead of editing blindly.

Required outputs:
- Update/create tasks in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md.
- Append a run summary to this document.

---

## Summary (append-only)
> Append a dated summary after each run. Do not delete old summaries.

### 2026-01-07 — Summary
- Agent: AGENT
- Scope: UNKNOWN (not yet run)
- Findings:
  - (none)
- Tasks created/updated:
  - (none)
- Questions for Trevor:
  - (none)

---

## Legacy guidance (preserved)
- Documentation governance and navigation rules remain in `DOCS_ROOT.md`; consult it for deeper policy details.
