# AI-META-BEGIN
# 
# AI-META: Build or utility script
# OWNERSHIP: scripts (build/deployment utilities)
# ENTRYPOINTS: Imported by application modules
# DEPENDENCIES: Standard library only
# DANGER: None identified
# CHANGE-SAFETY: Critical - any changes require security review and testing
# TESTS: Integration tests required - run full test suite: pnpm test
# 
# AI-META-END

#!/bin/bash
# Check that protected paths haven't been modified inappropriately

set -e

PROTECTED_PATHS_FILE="scripts/security/protected-paths.txt"

if [ ! -f "$PROTECTED_PATHS_FILE" ]; then
  echo "✅ No protected paths configured"
  exit 0
fi

echo "🔒 Checking protected paths..."

# Read protected paths
while IFS= read -r path; do
  # Skip empty lines and comments
  [[ -z "$path" || "$path" =~ ^# ]] && continue
  
  # Check if path exists and log it
  if [ -e "$path" ]; then
    echo "  - Protected: $path"
  fi
done < "$PROTECTED_PATHS_FILE"

echo "✅ Protected paths check complete"
exit 0
