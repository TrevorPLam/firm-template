#!/bin/bash

###############################################################################
# Optimized Build Script
#
# Purpose: Build all packages and apps with intelligent caching and parallelization
#
# Usage: ./build-all.sh [options]
#
# Options:
#   --clean        Clean build artifacts before building
#   --cache        Use build cache (default)
#   --no-cache     Disable build cache
#   --parallel N   Build with N parallel jobs (default: 4)
#   --verbose      Show detailed output
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
CLEAN=false
USE_CACHE=true
PARALLEL_JOBS=4
VERBOSE=false
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BUILD_START_TIME=$(date +%s)

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --clean)
            CLEAN=true
            shift
            ;;
        --cache)
            USE_CACHE=true
            shift
            ;;
        --no-cache)
            USE_CACHE=false
            shift
            ;;
        --parallel)
            PARALLEL_JOBS="$2"
            shift 2
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

cd "$REPO_ROOT"

log_info "Starting optimized build..."
log_info "Configuration:"
echo "  Repository: $REPO_ROOT"
echo "  Cache: $([ "$USE_CACHE" = true ] && echo "Enabled" || echo "Disabled")"
echo "  Parallel Jobs: $PARALLEL_JOBS"
echo "  Clean Build: $([ "$CLEAN" = true ] && echo "Yes" || echo "No")"
echo ""

# Clean if requested
if [ "$CLEAN" = true ]; then
    log_info "Cleaning build artifacts..."
    
    # Remove dist/build directories
    find packages apps -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
    find packages apps -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
    find packages apps -name ".turbo" -type d -exec rm -rf {} + 2>/dev/null || true
    
    # Remove node_modules/.cache
    find . -path "*/node_modules/.cache" -type d -exec rm -rf {} + 2>/dev/null || true
    
    log_success "Build artifacts cleaned"
fi

# Check dependencies
log_info "Verifying dependencies..."
if [ ! -d "node_modules" ]; then
    log_warn "node_modules not found, installing dependencies..."
    pnpm install
fi
log_success "Dependencies verified"

# Build with Turbo (uses caching by default)
log_info "Building all packages and applications..."

BUILD_CMD="pnpm build"

if [ "$USE_CACHE" = false ]; then
    BUILD_CMD="$BUILD_CMD --force"
fi

if [ "$VERBOSE" = true ]; then
    BUILD_CMD="$BUILD_CMD --verbose"
fi

# Set concurrency
export TURBO_CONCURRENCY=$PARALLEL_JOBS

# Run build
if $BUILD_CMD; then
    log_success "Build completed successfully"
else
    log_error "Build failed"
    exit 1
fi

# Calculate build time
BUILD_END_TIME=$(date +%s)
BUILD_DURATION=$((BUILD_END_TIME - BUILD_START_TIME))
BUILD_MINUTES=$((BUILD_DURATION / 60))
BUILD_SECONDS=$((BUILD_DURATION % 60))

echo ""
log_success "✓ All builds completed successfully"
echo ""
echo "Build Summary:"
echo "  Duration: ${BUILD_MINUTES}m ${BUILD_SECONDS}s"
echo "  Cache: $([ "$USE_CACHE" = true ] && echo "Enabled" || echo "Disabled")"
echo "  Parallel Jobs: $PARALLEL_JOBS"
echo ""

# Show build sizes
log_info "Build Sizes:"
du -sh apps/*/dist apps/*/.next packages/*/dist 2>/dev/null || log_warn "Could not determine build sizes"
