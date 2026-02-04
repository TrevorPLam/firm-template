#!/bin/bash

###############################################################################
# Build Cache Management Script
#
# Purpose: Manage build cache for optimal performance and disk usage
#
# Usage: ./cache-manager.sh [command]
#
# Commands:
#   status     Show cache status and size
#   clean      Clean all build caches
#   clean-old  Clean caches older than N days (default: 30)
#   optimize   Optimize cache by removing unused entries
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CACHE_MAX_AGE_DAYS=30

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

show_cache_status() {
    log_info "Build Cache Status"
    echo ""
    
    cd "$REPO_ROOT"
    
    # Turbo cache
    if [ -d "node_modules/.cache/turbo" ]; then
        TURBO_SIZE=$(du -sh node_modules/.cache/turbo 2>/dev/null | cut -f1)
        TURBO_FILES=$(find node_modules/.cache/turbo -type f 2>/dev/null | wc -l)
        echo "Turbo Cache:"
        echo "  Location: node_modules/.cache/turbo"
        echo "  Size: $TURBO_SIZE"
        echo "  Files: $TURBO_FILES"
    else
        echo "Turbo Cache: Not found"
    fi
    echo ""
    
    # Next.js caches
    NEXT_CACHES=$(find apps -name ".next" -type d 2>/dev/null)
    if [ -n "$NEXT_CACHES" ]; then
        NEXT_SIZE=$(du -sh apps/*/.next 2>/dev/null | awk '{sum+=$1} END {print sum "M"}' || echo "0M")
        echo "Next.js Caches:"
        echo "$NEXT_CACHES" | while read cache; do
            SIZE=$(du -sh "$cache" 2>/dev/null | cut -f1)
            echo "  $cache: $SIZE"
        done
    else
        echo "Next.js Caches: Not found"
    fi
    echo ""
    
    # Package build outputs
    DIST_DIRS=$(find packages -name "dist" -type d 2>/dev/null)
    if [ -n "$DIST_DIRS" ]; then
        echo "Package Build Outputs:"
        echo "$DIST_DIRS" | while read dist; do
            SIZE=$(du -sh "$dist" 2>/dev/null | cut -f1)
            echo "  $dist: $SIZE"
        done
    fi
    echo ""
    
    # Total cache size
    TOTAL_SIZE=$(du -sh node_modules/.cache apps/*/.next packages/*/dist 2>/dev/null | awk '{sum+=$1} END {print sum}' || echo "0")
    log_info "Total Cache Size: ${TOTAL_SIZE}M"
}

clean_all_caches() {
    log_info "Cleaning all build caches..."
    
    cd "$REPO_ROOT"
    
    # Clean Turbo cache
    log_info "Cleaning Turbo cache..."
    rm -rf node_modules/.cache/turbo 2>/dev/null || true
    
    # Clean Next.js caches
    log_info "Cleaning Next.js caches..."
    find apps -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
    find apps -name ".turbo" -type d -exec rm -rf {} + 2>/dev/null || true
    
    # Clean package build outputs
    log_info "Cleaning package build outputs..."
    find packages -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
    find packages -name ".turbo" -type d -exec rm -rf {} + 2>/dev/null || true
    
    log_success "All caches cleaned"
}

clean_old_caches() {
    log_info "Cleaning caches older than $CACHE_MAX_AGE_DAYS days..."
    
    cd "$REPO_ROOT"
    
    # Find and remove old cache files
    find node_modules/.cache -type f -mtime +$CACHE_MAX_AGE_DAYS -delete 2>/dev/null || true
    find apps/*/.next -type f -mtime +$CACHE_MAX_AGE_DAYS -delete 2>/dev/null || true
    
    log_success "Old caches cleaned"
}

optimize_cache() {
    log_info "Optimizing build cache..."
    
    # Remove empty directories
    find node_modules/.cache -type d -empty -delete 2>/dev/null || true
    find apps/*/.next -type d -empty -delete 2>/dev/null || true
    
    # Clean old entries
    clean_old_caches
    
    log_success "Cache optimized"
}

# Main
COMMAND="${1:-status}"

case "$COMMAND" in
    status)
        show_cache_status
        ;;
    clean)
        clean_all_caches
        ;;
    clean-old)
        clean_old_caches
        ;;
    optimize)
        optimize_cache
        ;;
    *)
        echo "Unknown command: $COMMAND"
        echo "Usage: $0 {status|clean|clean-old|optimize}"
        exit 1
        ;;
esac
