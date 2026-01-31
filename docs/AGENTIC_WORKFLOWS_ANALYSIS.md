# Agentic Workflows Analysis Across Repos

**Scope:** firm-template, studio, aios, **OS**  
**Date:** 2026-01-30

---

## 1. Issues

### 1.1 Fixed

- **firm-template `.github/AGENTS.md`** — Paths used uppercase `AGENTS/` (e.g. `AGENTS/AGENTS.toon`). Corrected to lowercase `agents/` to match repo layout and studio/aios.

### 1.2 Alignment actions (2026-01-30)

| Action | Repo(s) | Done |
|--------|---------|------|
| Add **verify_gate** + **blast radius** good practice to AGENTS.toon | OS | Yes |
| Add **6th good practice** (critical paths) to AGENTS.toon | firm-template, studio | Yes |
| Add **.cursorrules** (verify, protected paths, plan-first) | firm-template, studio | Yes |
| Add **root AGENTS.md** with protected paths section | firm-template | Yes (created) |
| Add **protected paths** section to root AGENTS.md | studio | Yes |
| Add **review process** to Copilot instructions (1 review, split large PRs) | firm-template, studio | Yes |
| Add **.github/ISSUE_TEMPLATE/** (config, bug_report, feature_request) | aios | Yes |

### 1.3 Perfect alignment (repo-specific preserved) — 2026-01-30

| Change | Repo(s) | Repo-specific note |
|--------|---------|--------------------|
| Root **AGENTS.md** same section order: Rules → Protected paths → How to test → Key files | All four | OS: added full Protected paths section; studio/aios/OS: added `agents/hitl/` to Key files |
| **Copilot** same structure: Branch naming (agent/chore), Protected paths (scripts/.../protected-paths.txt), Tests, Review process | aios | aios aligned to firm-template/studio/OS; branch naming agent/chore |
| **agents/AGENTS.md** present in all | studio, aios, OS | Thin pointer (canonical = AGENTS.toon; see root AGENTS.md). firm-template keeps fuller agents/AGENTS.md |
| **file_patterns** in AGENTS.toon include .cursorrules + .github/copilot-instructions.md | firm-template, studio, aios | OS already had 8 entries (incl. scripts/setup.sh, verify.sh) |
| **.github/AGENTS.md** Related Files include agents/hitl/ | All four | Same line added |
| **.cursorrules** same structure: # Cursor Rules for &lt;Repo&gt;, Project, Commands, Rules, Style | All four | aios: restructured to match; OS: removed filepath comment, added H1; aios Style keeps TypeScript/React/absolute imports (repo-specific) |
| **Protected paths** in root AGENTS.md | All four | Lists are repo-specific (e.g. aios has services/api-gateway/; OS has services/api-gateway/) |

### 1.4 Open (unchanged)

| Issue | Repo(s) | Detail |
|-------|---------|--------|
| **pnpm version vs CI** | firm-template, studio | `package.json` has `packageManager: "pnpm@8.15.0"` (firm) or `pnpm@8.0.0` (studio); `.github/workflows/ci.yml` uses `version: 10.0.0`. Align either packageManager or CI. |
| **Reusable workflow pnpm** | aios | `reusable-turbo-setup.yml` uses pnpm `8.15.0`; root `package.json` has `pnpm@10.0.0`. CI main workflow uses 10.0.0; reusable uses 8.15.0. |
| **validation-optimized.yml** | aios | Uses `pnpm markdown-link-check` and `pnpm prettier`; confirm these scripts exist in root `package.json` or add/adapt. |
| **Broken-link strictness** | firm-template vs aios | firm-template `validation.yml` fails the job on broken markdown links; aios version only warns. Decide one policy and align. |

---

## 2. Diffs Between Repos

### 2.1 Agent entrypoints and docs

| Item | firm-template | studio | aios | OS |
|------|---------------|--------|------|-----|
| Root `AGENTS.md` | Full (repo intro, commands, rules, TOON pointer) | Full | Full + **protected paths** list | Full + **protected paths** ref |
| `agents/AGENTS.md` | Yes | No | No | No |
| `agents/CLAUDE.md` | Yes | No | No | No (root CLAUDE.md only) |
| `agents/INDEX.toon` | Lists AGENTS.md, CLAUDE.md | No CLAUDE in agents/ | No CLAUDE in agents/ | No CLAUDE in agents/ |
| `agents/AGENTS.md` | Full (template) | **Yes (pointer)** | **Yes (pointer)** | **Yes (pointer)** |
| `.github/AGENTS.md` | TOON pointer + hitl/ | Same | Same | Same |
| **Root AGENTS.md** | Yes, same section order | Yes | Yes | Yes |
| `.cursorrules` | Yes, same structure | Yes | Yes (aligned) | Yes |

### 2.2 AGENTS.toon

- **meta.repo / scope:** Repo name and workspace scope differ (e.g. aios has `apps/*; packages/*; services/*; tools/*`; OS has `apps/*; packages/*; services/*`).
- **repo_map_code:** firm-template 1 (web); studio 2 (web, contracts); aios 4 (mobile + web, contracts); OS 2 (web, contracts).
- **core_principles_must_follow:** All four have **6** (include verify_gate). **OS** was aligned (verify_gate added).
- **core_principles_good_practices:** All four have **6** rules (critical paths + blast radius). firm-template and studio had 6th rule added; **OS** had blast radius good practice added.
- **repo_contract.verify_rule:** OS extends with **secret scan + dependency scan** (verify runs secret scan + lint + typecheck + tests + build + dependency scan).
- **file_patterns:** OS adds scripts/setup.sh, scripts/verify.sh, .cursorrules, .github/copilot-instructions.md.
- **commands.verify context:** aios "Per change" vs firm/studio/OS "Before PRs" (cosmetic).

### 2.3 GitHub workflows

| Workflow | firm-template | studio | aios | OS |
|----------|---------------|--------|------|-----|
| `ci.yml` | Verify only (pnpm 10) | Same | Same | **Single CI:** governance-drift (paths-filter + governance-approved), verify (pnpm 8.15, Node, Go, Python, security tools, **blast radius inline**, verify.sh, SBOM, artifacts), backend-check (Django) |
| `validation.yml` | Standalone jobs | Same | Uses reusable-turbo-setup, needs, 4-core; broken links = warning; alignment-standards | Present |
| `validation-optimized.yml` | — | — | **Only in aios** | — |
| `reusable-*.yml` | — | — | reusable-turbo-setup (Turbo/pnpm cache) | **reusable-setup** (Node/Go/Python/security-tools options) |
| `blast-radius.yml` | Separate workflow | Same | Same | **Inline in ci.yml** (no separate file) |
| `governance-drift.yml` | Separate | Same | Same | **Inline in ci.yml** (governance-drift job) |
| `security.yml` / `codeql-analysis.yml` | Present | Present | Present | codeql only (no security.yml listed) |
| `performance-monitoring.yml` | — | — | — | **Only in OS** |

### 2.4 Copilot instructions (`.github/copilot-instructions.md`)

- **firm-template & studio:** Branch naming `agent/<short-task>` or `chore/<short-task>`; PR requirements and protected paths reference `scripts/security/protected-paths.txt`.
- **aios:** Branch naming `feature/`, `fix/`, `chore/`; protected paths listed inline; adds **review process**: at least 1 human review, large PRs (>200 lines) should be split.

### 2.5 Agents/tasks and OS-only agent automation

- **aios** has `agents/tasks/REPORT_TASKS.toon`; firm-template and studio do not.
- HITL and task templates (BUG, FEATURE, HITL-*) are aligned across repos.
- **OS only:** `agents/intelligence/` (task-prioritizer.js, workflow-intelligence.js), `agents/memory/agent-memory.js`, `agents/metrics/collect.js`, `agents/sync/tasks.js`, `agents/validate/workflow.js`, `agents/WORKFLOW_STANDARDIZATION.toon`, and task templates **BUG-WORKFLOW.toon**, **FEATURE-WORKFLOW.toon**, **DOCS-WORKFLOW.toon**, **SECURITY-WORKFLOW.toon**. Scripts: `scripts/automation/sync-workflows.sh`, `scripts/metrics/`, etc. OS has the most **executable** agent tooling (JS scripts + TOON workflow schemas).

### 2.6 Cursor / IDE rules

- **aios** has `.cursorrules` with verify command, style, planning, protected paths, and patterns.
- **OS** has `.cursorrules` with setup/verify commands, protected paths ref, plan-first for 200+ lines or 3+ files, style (scripts/, docs/).
- firm-template and studio rely on AGENTS.md/AGENTS.toon and Copilot instructions only.

---

## 3. Best Practices to Reuse

1. **TOON as canonical agent format** — All three use `agents/AGENTS.toon` plus TODO/BACKLOG/ARCHIVE and INDEX.toon. Low-token, consistent structure; keep as standard.
2. **Unified contract** — `make setup` / `make verify`, same role (“Autonomous Agent for Solo Founder”), same core principles (no_guessing, safety_first, no_secrets, evidence, traceability, verify_gate). Reuse in new repos.
3. **HITL** — Shared hitl/ layout and templates (HITL-EXT, HITL-PROT, HITL-SEC, HITL-UNK), same triggers and “Blocked → HITL → next task” flow. Good baseline for human gates.
4. **Blast radius** — All use `blast-radius.yml` + `scripts/security/check-blast-radius.sh` and `protected-paths-approved` label. Reuse pattern everywhere.
5. **aios reusable Turbo setup** — `reusable-turbo-setup.yml` with pnpm/Turbo/node_modules caching and optional turbo cache. Consider adopting in firm-template/studio for faster CI once pnpm versions are aligned.
6. **Explicit protected paths for agents** — aios encodes protected paths in AGENTS.toon and .cursorrules. Reduces agent mistakes; worth adding to firm-template/studio.
7. **aios Copilot review rules** — “At least 1 human review” and “split large PRs” improve safety; consider adding to firm-template and studio.
8. **firm-template agents/ completeness** — `agents/AGENTS.md`, `agents/CLAUDE.md`, and INDEX.toon that lists them make the template the clearest “source of truth” for new clones; keep and replicate in studio/aios if you want parity.

---

## 4. OS-specific summary

- **OS** shares the same agent contract (TOON, make setup/verify, role, HITL). After alignment:
  - **AGENTS.toon** now has 6 must-follow (verify_gate added) and 5 good-practices (blast radius added). verify_rule includes secret + dependency scan; file_patterns reference setup.sh, verify.sh, .cursorrules, copilot-instructions.
  - **CI** is a single `ci.yml` with governance-drift, verify (multi-stack: Node, Go, Python, security tools, blast radius, SBOM, artifacts), and backend-check; no separate blast-radius or governance-drift workflows. Uses **reusable-setup.yml** (Node/Go/Python/security options) and has **performance-monitoring.yml**.
  - **agents/** includes executable tooling: intelligence/, memory/, metrics/, sync/, validate/, WORKFLOW_STANDARDIZATION.toon, and BUG/FEATURE/DOCS/SECURITY-WORKFLOW.toon templates. Most automation-rich of the four repos.
  - **Issue/PR templates:** Most complete (bug_report, feature_request, security_issue, config; PULL_REQUEST_TEMPLATE with bugfix, feature, hotfix).
- **Gap (resolved):** OS core principles now include verify_gate and blast radius good practice.

## 5. Summary

- **Fixed:** firm-template `.github/AGENTS.md` paths (AGENTS/ → agents/).
- **Alignment done:** OS AGENTS.toon (verify_gate + blast radius); firm-template & studio (.cursorrules, 6th good practice, root AGENTS.md protected paths, Copilot review process); aios (ISSUE_TEMPLATE added).
- **To fix (optional):** Align pnpm version (packageManager vs CI and reusable workflow); validate validation-optimized scripts; unify broken-link behavior.
- **Diffs:** aios adds reusable Turbo workflows, validation-optimized, REPORT_TASKS.toon, stricter Copilot review; firm-template has richest agents/ docs; **OS** has single consolidated CI, executable agent scripts, workflow TOON schemas, and richest issue/PR templates.
- **Bests:** TOON + unified make contract + HITL + blast radius everywhere; aios leads on CI reuse and explicit protected paths; firm-template on agent doc completeness; **OS** on agent automation (scripts + workflow schemas) and issue/PR template coverage.
