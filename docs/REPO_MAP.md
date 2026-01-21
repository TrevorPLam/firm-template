# REPO_MAP.md — Architectural Directory & File Map

Document Type: Reference
Version: 2.0.0
Last Updated: 2026-01-02
Owner: Repository Root
Status: Active

Purpose: the “map of the house.” Use this before making structural changes so you don’t put a stove in the bedroom.

---

## 1) The architectural hierarchy
This repository is a governance-first template. The application-specific architecture lives in whatever project you apply this template to.

Hierarchy (what to read first):
1) `CODEBASECONSTITUTION.md`
2) `READMEAI.md`
3) `PROJECT_STATUS.md`
4) `repo.manifest.yaml`
5) `specs/*`
6) `docs/*`

---

## 2) Root directory
- `README.md` → points agents to `READMEAI.md`
- `READMEAI.md` → AI operating console
- `CODEBASECONSTITUTION.md` → highest authority
- `BOOTSTRAP_GUIDE.md` → how to start (human + AI)
- `PROJECT_STATUS.md` → current truth + next step
- `repo.manifest.yaml` → how to run/verify/ship (machine-readable)
- `P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md` → task truth sources
- `SECURITY.md` → reporting + baseline expectations
- `CHANGELOG.md` + `VERSION` → release hygiene

---

## 3) specs/
- `specs/project-spec.md` → what/why
- `specs/technical-plan.md` → how
- `specs/*` → non-binding notes (informational only)

---

## 4) docs/
- `docs/CONTEXT_MAP.md` → short routing table (where to edit)
- `docs/TESTING_STRATEGY.md` → verification expectations
- `docs/INTEGRATION_MAP.md` → external dependencies + contracts
- `docs/SECURITY_BASELINE.md` → secrets/auth/data rules
- `docs/OBSERVABILITY.md` → logging/metrics/tracing conventions
- `docs/DEPLOYMENT.md` → how to ship/run in environments
- `docs/AI_COST_POLICY.md` → session guard rails
- `docs/adr/*` → decision log

---

## 5) scripts/
- `scripts/bootstrap.sh` → initialize hooks + optional TODO.generated.md
- `scripts/sync-todo.sh` → generate TODO.generated.md from non-binding specs notes when present
- `scripts/ai-audit.sh` → governance gate
- `scripts/security-scan.sh` → secrets hygiene
- `scripts/check.sh` → best-effort checks
- `scripts/validate-enhancements.sh` → validate template consistency
- `scripts/new-repo.sh` → stamp this template into another repo

---

## 6) Tool-specific determinism entrypoints
- Copilot: `.github/copilot-instructions.md`
- Cursor: `.cursor/rules/00-governance/RULE.md`
- Claude: `CLAUDE.md`
- Aider (optional): `.aider.conf.yml`

---

## 7) CI + hooks
- Local: `.githooks/pre-commit`
- CI: `githubactions/workflows (disabled by default)/governance-ci.yml`
