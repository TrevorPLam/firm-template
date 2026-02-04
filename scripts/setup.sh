# AI-META-BEGIN
# 
# AI-META: Build or utility script
# OWNERSHIP: scripts (build/deployment utilities)
# ENTRYPOINTS: Imported by application modules
# DEPENDENCIES: Standard library only
# DANGER: None identified
# CHANGE-SAFETY: Review impact on consumers before modifying public API
# TESTS: Run: pnpm test && pnpm type-check
# 
# AI-META-END

#!/usr/bin/env bash
# filepath: scripts/setup.sh
# purpose: Install repository dependencies in a repeatable way.
# last updated: 2026-01-30
# related tasks: FIRST.md Phase 1 (setup)

set -euo pipefail

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required. Install pnpm@8 before running setup."
  exit 1
fi

echo "==> setup: installing dependencies"
pnpm install --frozen-lockfile
echo "setup complete"
