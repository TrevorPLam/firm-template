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
set -euo pipefail

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
python3 "$repo_root/scripts/generate-index-toon.py" "$repo_root"
