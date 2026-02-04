#!/bin/bash
# Check for potential secrets and sensitive data in the codebase

set -e

echo "🔍 Checking for potential secrets in codebase..."

# Common patterns to check for
PATTERNS=(
  "password\s*=\s*['\"].*['\"]"
  "api[_-]?key\s*=\s*['\"].*['\"]"
  "secret\s*=\s*['\"].*['\"]"
  "token\s*=\s*['\"].*['\"]"
  "private[_-]?key\s*=\s*['\"].*['\"]"
  "aws[_-]?access[_-]?key"
  "AKIA[0-9A-Z]{16}"  # AWS Access Key pattern
)

# Files to exclude
EXCLUDE_PATTERNS="node_modules|.git|pnpm-lock.yaml|.next|dist|build|coverage"

FOUND_ISSUES=0

for pattern in "${PATTERNS[@]}"; do
  # Search for pattern, excluding common false positives
  RESULTS=$(grep -rniE "$pattern" . \
    --exclude-dir={node_modules,.git,.next,dist,build,coverage} \
    --exclude="*.lock" \
    --exclude="pnpm-lock.yaml" \
    --exclude="*.log" \
    --exclude="check-secrets.sh" \
    2>/dev/null || true)
  
  if [ -n "$RESULTS" ]; then
    echo "⚠️  Found potential secret pattern: $pattern"
    echo "$RESULTS" | head -5  # Show first 5 matches
    FOUND_ISSUES=$((FOUND_ISSUES + 1))
  fi
done

if [ $FOUND_ISSUES -gt 0 ]; then
  echo ""
  echo "❌ Found $FOUND_ISSUES potential secret patterns!"
  echo "Please review the above matches and ensure no actual secrets are committed."
  echo "Consider using environment variables or secret management tools."
  exit 1
else
  echo "✅ No obvious secrets detected in codebase"
  exit 0
fi
