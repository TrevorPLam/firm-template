# Build Infrastructure and Optimization

**Status:** Production Ready  
**Version:** 1.0  
**Last Updated:** 2026-02-04

## Overview

The firm-template uses an optimized build infrastructure leveraging Turborepo for intelligent caching, parallel builds, and efficient dependency management.

## Build Commands

```bash
# Build all
pnpm build

# Optimized build with caching
./scripts/build/build-all.sh

# Clean build
./scripts/build/build-all.sh --clean

# Parallel build
./scripts/build/build-all.sh --parallel 8
```

## Cache Management

```bash
# Check cache status
./scripts/build/cache-manager.sh status

# Clean caches
./scripts/build/cache-manager.sh clean

# Optimize cache
./scripts/build/cache-manager.sh optimize
```

## Build Optimization

1. **Turborepo caching**: Reuses unchanged outputs
2. **Parallel execution**: Multiple packages simultaneously
3. **Incremental builds**: Only rebuilds what changed
4. **Remote caching**: Share cache across team/CI

## Performance

| Build Type | Cold | Cached |
|------------|------|--------|
| Full Build | 3-5min | 30-60s |
| Single Package | 15-30s | 5-10s |

## Best Practices

- Use watch mode in development
- Clear cache when switching branches
- Always clean build for production
- Monitor and optimize bundle sizes

---

**Maintained by:** Platform Engineering Team
