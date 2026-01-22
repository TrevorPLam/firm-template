# scripts/AGENTS.md — Build & Utility Scripts

Last Updated: 2026-01-21
Applies To: Any agent working in scripts/

## Required Reading
**⚠️ Before coding:** See `/BESTPR.md` for comprehensive best practices including:
- Build and deployment patterns
- Security non-negotiables (especially for check-client-secrets.mjs)
- Configuration management

## Purpose
This folder contains build-time scripts, validation tools, and utilities for development and deployment workflows.

---

## Scripts Overview

### Security & Validation
| Script | Purpose | When to Run |
|--------|---------|-------------|
| `check-client-secrets.mjs` | Scans for leaked secrets in client bundle | Auto-runs after `npm run build` (postbuild) |
| `security-scan.sh` | Runs security checks | On-demand or in CI |
| `npm-registry-check.mjs` | Validates npm package integrity | Before dependency updates |

### Quality & Coverage
| Script | Purpose | When to Run |
|--------|---------|-------------|
| `ensure-vitest-coverage.mjs` | Enforces coverage thresholds | Before `npm run test:coverage` |
| `check-todo-comments.mjs` | Finds TODO/FIXME comments | On-demand or in CI |
| `a11y-audit.mjs` | Accessibility audit | Before deployment |
| `lighthouse-audit.mjs` | Performance audit | Before deployment |
| `seo-audit.mjs` | SEO validation checks (metadata, sitemap, links) | Before release or SEO updates |

### Workflow & Operations
| Script | Purpose | When to Run |
|--------|---------|-------------|
| `bootstrap.sh` | Initial repo setup | Once after cloning |
| `check.sh` | Run all checks (type, lint, test) | Before commits |
| `sync-todo.sh` | Generate TODO.generated.md from `specs/project-tasks.md` (optional, non-binding) | On-demand |
| `validate-enhancements.sh` | Validates enhancement proposals | When reviewing changes |
| `health-dashboard.sh` | System health report | On-demand monitoring |
| `cost-tracker.sh` | Track infrastructure costs | Weekly/monthly |
| `new-repo.sh` | Create new repo from template | When forking template |

### Audit Tools (AI-Assisted)
| Script | Purpose | When to Run |
|--------|---------|-------------|
| `ai-audit.sh` | AI-powered code review | Before major releases |

---

## Rules for Scripts

### DO
- Use Node.js (`.mjs`) for cross-platform scripts
- Use Bash (`.sh`) only when necessary for shell operations
- Include error handling and clear exit codes
- Log progress for long-running scripts
- Document all required environment variables

### DO NOT
- Commit secrets or API keys
- Modify production databases directly
- Run destructive operations without confirmation
- Use platform-specific commands without fallbacks

---

## Adding a New Script

1. **Choose language**: Node.js (`.mjs`) for portability, Bash (`.sh`) for shell ops
2. **Add to README.md**: Document purpose, usage, and dependencies
3. **Add to package.json**: If intended for `npm run` invocation
4. **Test locally**: Verify on clean checkout
5. **Update this file**: Add to the appropriate table above

---

## Script Dependencies

Most scripts use:
- Node.js built-in modules (fs, path, etc.)
- Packages already in package.json (no additional deps)

If adding external dependencies:
- Add to `devDependencies` in package.json
- Document in script header comment
- Ensure compatibility with CI environment

---

## Security Notes

**check-client-secrets.mjs** is CRITICAL:
- Runs after every production build
- Scans `.next/` for accidentally bundled secrets
- Fails build if secrets detected
- Uses regex patterns for common secret formats
- Never modify this script without security review

---

## Reference

For detailed script documentation, see `scripts/README.md`.
