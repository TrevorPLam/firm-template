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

#!/bin/bash

###############################################################################
# Infrastructure Health Check Script
#
# Purpose: Perform comprehensive health checks on all infrastructure components
#
# Usage: ./health-check.sh [--verbose] [--json]
###############################################################################

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
VERBOSE=false
JSON_OUTPUT=false
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNING=0

# Parse arguments
for arg in "$@"; do
    case $arg in
        --verbose) VERBOSE=true ;;
        --json) JSON_OUTPUT=true ;;
    esac
done

# Logging functions
log_check() {
    if [[ "$JSON_OUTPUT" == false ]]; then
        echo -e "${BLUE}[CHECK]${NC} $1"
    fi
}

log_pass() {
    ((CHECKS_PASSED++))
    if [[ "$JSON_OUTPUT" == false ]]; then
        echo -e "${GREEN}[PASS]${NC} $1"
    fi
}

log_warn() {
    ((CHECKS_WARNING++))
    if [[ "$JSON_OUTPUT" == false ]]; then
        echo -e "${YELLOW}[WARN]${NC} $1"
    fi
}

log_fail() {
    ((CHECKS_FAILED++))
    if [[ "$JSON_OUTPUT" == false ]]; then
        echo -e "${RED}[FAIL]${NC} $1"
    fi
}

# Health check functions

check_disk_space() {
    log_check "Checking disk space..."
    
    local usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//' || echo "0")
    
    if [[ -z "$usage" ]] || [[ "$usage" == "0" ]]; then
        log_warn "Unable to determine disk usage"
    elif [[ $usage -lt 80 ]]; then
        log_pass "Disk usage: ${usage}% (healthy)"
    elif [[ $usage -lt 90 ]]; then
        log_warn "Disk usage: ${usage}% (warning threshold)"
    else
        log_fail "Disk usage: ${usage}% (critical - cleanup required)"
    fi
}

check_memory() {
    log_check "Checking memory usage..."
    
    if command -v free >/dev/null 2>&1; then
        local mem_usage=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
        
        if [[ $mem_usage -lt 80 ]]; then
            log_pass "Memory usage: ${mem_usage}% (healthy)"
        elif [[ $mem_usage -lt 90 ]]; then
            log_warn "Memory usage: ${mem_usage}% (warning)"
        else
            log_fail "Memory usage: ${mem_usage}% (critical)"
        fi
    else
        log_warn "Memory check unavailable (free command not found)"
    fi
}

check_backup_age() {
    log_check "Checking backup age..."
    
    local backup_dir="scripts/database/backups"
    if [[ -d "$backup_dir" ]]; then
        local latest_backup=$(find "$backup_dir" -name "db-*.dump*" -type f -print0 2>/dev/null | xargs -0 ls -t 2>/dev/null | head -1)
        
        if [[ -n "$latest_backup" ]]; then
            local backup_age=$(($(date +%s) - $(stat -f %m "$latest_backup" 2>/dev/null || stat -c %Y "$latest_backup" 2>/dev/null)))
            local hours_old=$((backup_age / 3600))
            
            if [[ $hours_old -lt 24 ]]; then
                log_pass "Latest backup is ${hours_old} hours old (fresh)"
            elif [[ $hours_old -lt 48 ]]; then
                log_warn "Latest backup is ${hours_old} hours old (aging)"
            else
                log_fail "Latest backup is ${hours_old} hours old (stale - backup needed)"
            fi
        else
            log_fail "No backups found in $backup_dir"
        fi
    else
        log_warn "Backup directory not found: $backup_dir"
    fi
}

# Main execution
echo "==================================="
echo "Infrastructure Health Check"
echo "==================================="
echo "Started: $(date)"
echo ""

# Run all checks
check_disk_space
check_memory
check_backup_age

# Summary
echo ""
echo "==================================="
echo "Health Check Summary"
echo "==================================="

if [[ "$JSON_OUTPUT" == true ]]; then
    cat << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "passed": $CHECKS_PASSED,
  "warnings": $CHECKS_WARNING,
  "failed": $CHECKS_FAILED,
  "status": "$(if [[ $CHECKS_FAILED -eq 0 ]]; then echo "healthy"; else echo "unhealthy"; fi)"
}
EOF
else
    echo -e "Passed:   ${GREEN}$CHECKS_PASSED${NC}"
    echo -e "Warnings: ${YELLOW}$CHECKS_WARNING${NC}"
    echo -e "Failed:   ${RED}$CHECKS_FAILED${NC}"
    echo ""
    
    if [[ $CHECKS_FAILED -eq 0 ]]; then
        echo -e "${GREEN}✓ System is healthy${NC}"
        exit 0
    else
        echo -e "${RED}✗ System has issues requiring attention${NC}"
        exit 1
    fi
fi
