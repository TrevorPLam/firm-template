# AI-META-BEGIN
# 
# AI-META: Build or utility script
# OWNERSHIP: scripts (build/deployment utilities)
# ENTRYPOINTS: Imported by application modules
# DEPENDENCIES: internal packages (@repo/*)
# DANGER: None identified
# CHANGE-SAFETY: Review impact on consumers before modifying public API
# TESTS: Run: pnpm test && pnpm type-check
# 
# AI-META-END

#!/bin/bash

###############################################################################
# Client Site Validation Script
#
# Purpose: Validate a provisioned client site for completeness and correctness
#
# Usage: ./validate-client.sh <client-name>
###############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

CLIENT_NAME="$1"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CLIENT_DIR="$REPO_ROOT/apps/$CLIENT_NAME"
THEME_DIR="$REPO_ROOT/packages/tokens/src/themes/$CLIENT_NAME"

ERRORS=0
WARNINGS=0

log_check() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

log_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
    ((WARNINGS++))
}

log_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((ERRORS++))
}

if [[ -z "$CLIENT_NAME" ]]; then
    echo "Usage: $0 <client-name>"
    exit 1
fi

echo "Validating client: $CLIENT_NAME"
echo "================================"
echo ""

# Check client directory exists
log_check "Client directory exists"
if [[ -d "$CLIENT_DIR" ]]; then
    log_pass "Directory found: $CLIENT_DIR"
else
    log_fail "Directory not found: $CLIENT_DIR"
fi

# Check package.json
log_check "package.json configuration"
if [[ -f "$CLIENT_DIR/package.json" ]]; then
    PKG_NAME=$(node -e "console.log(require('$CLIENT_DIR/package.json').name)")
    if [[ "$PKG_NAME" == "@repo/$CLIENT_NAME" ]]; then
        log_pass "Package name correct: $PKG_NAME"
    else
        log_fail "Package name incorrect. Expected: @repo/$CLIENT_NAME, Got: $PKG_NAME"
    fi
else
    log_fail "package.json not found"
fi

# Check theme configuration
log_check "Theme configuration"
if [[ -f "$THEME_DIR/index.ts" ]]; then
    log_pass "Theme file exists: $THEME_DIR/index.ts"
    if grep -q "primary" "$THEME_DIR/index.ts"; then
        log_pass "Theme contains color configuration"
    else
        log_warn "Theme may be missing color configuration"
    fi
else
    log_fail "Theme file not found: $THEME_DIR/index.ts"
fi

# Check environment configuration
log_check "Environment configuration"
if [[ -f "$CLIENT_DIR/.env.example" ]]; then
    log_pass ".env.example exists"
else
    log_warn ".env.example not found (optional)"
fi

# Check README
log_check "Documentation"
if [[ -f "$CLIENT_DIR/README.md" ]]; then
    log_pass "README.md exists"
else
    log_warn "README.md not found"
fi

# Check Next.js config
log_check "Next.js configuration"
if [[ -f "$CLIENT_DIR/next.config.js" ]]; then
    log_pass "next.config.js exists"
else
    log_fail "next.config.js not found"
fi

# Check TypeScript config
log_check "TypeScript configuration"
if [[ -f "$CLIENT_DIR/tsconfig.json" ]]; then
    log_pass "tsconfig.json exists"
else
    log_fail "tsconfig.json not found"
fi

# Check app directory
log_check "App directory structure"
if [[ -d "$CLIENT_DIR/app" ]]; then
    log_pass "app/ directory exists"
else
    log_fail "app/ directory not found"
fi

echo ""
echo "================================"
echo "Validation Summary"
echo "================================"
echo -e "Errors:   ${RED}$ERRORS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"

if [[ $ERRORS -eq 0 ]]; then
    echo -e "${GREEN}✓ Validation passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Validation failed with $ERRORS error(s)${NC}"
    exit 1
fi
