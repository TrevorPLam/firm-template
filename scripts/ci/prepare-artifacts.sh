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

# Collects build outputs and test reports for CI artifact uploads.

ARTIFACT_DIR="artifacts"
mkdir -p "$ARTIFACT_DIR"

# Copy build outputs if present.
for dir in apps packages; do
  if [[ -d "$dir" ]]; then
    find "$dir" -maxdepth 3 -type d \( -name dist -o -name .next \) -print0 | while IFS= read -r -d '' build_dir; do
      target="$ARTIFACT_DIR/${build_dir}"
      mkdir -p "$(dirname "$target")"
      cp -R "$build_dir" "$target"
    done
  fi
done

# Copy test reports if present.
if [[ -d tests/reports ]]; then
  cp -R tests/reports "$ARTIFACT_DIR/tests-reports"
fi

echo "Artifacts prepared in ${ARTIFACT_DIR}"
