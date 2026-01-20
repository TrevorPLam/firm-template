# Dependency Management & Security

**Last Updated:** 2026-01-09  
**Related Tasks:** T-104 (Dependency hygiene), T-070 (Transitive vulnerabilities)

## Overview

This document outlines the dependency management strategy, security audit process, and update cadence for the Your Dedicated Marketer project.

## Monthly Dependency Review Process

### 1. Run Security Audit

```bash
# Check for vulnerabilities
npm audit

# Check for outdated packages
npm outdated
```

### 2. Review Audit Results

**Priority Levels:**
- **Critical/High**: Address immediately (security risk)
- **Moderate**: Address within 30 days (potential risk)
- **Low**: Address when convenient (minimal risk)

**Known Issues:**
- Transitive vulnerabilities in `@cloudflare/next-on-pages` (tracked in T-070)
- These are pulled in by the Cloudflare adapter and await upstream fixes

### 3. Update Dependencies

**For Production Dependencies:**
```bash
# Check what would be updated
npm outdated

# Update patch versions (safe)
npm update

# Update specific package (if needed)
npm install package-name@latest
```

**For Dev Dependencies:**
```bash
# Update dev dependencies
npm update --save-dev
```

### 4. Test After Updates

```bash
# Run full test suite
npm run test
npm run type-check
npm run lint
npm run build
```

### 5. Document Changes

- Update `CHANGELOG.md` with dependency updates
- Note any breaking changes or migration steps
- Update this document if process changes

## CI Integration

The CI pipeline (`githubactions/workflows/ci.yml`) runs `npm audit` on every PR and push to main:

- **Audit Level**: Moderate (reports Moderate, High, and Critical)
- **Behavior**: Continues on error (doesn't block merges)
- **Rationale**: Some vulnerabilities are in transitive deps awaiting upstream fixes

## Update Strategy

### Patch Updates (x.y.Z)
- **Frequency**: Monthly
- **Risk**: Low
- **Action**: Run `npm update` and test

### Minor Updates (x.Y.z)
- **Frequency**: Quarterly
- **Risk**: Medium
- **Action**: Review changelog, test thoroughly

### Major Updates (X.y.z)
- **Frequency**: As needed
- **Risk**: High
- **Action**: 
  1. Review breaking changes
  2. Test in feature branch
  3. Update code if needed
  4. Full regression testing

## Security Vulnerabilities

### Current Known Issues

**T-070: Transitive Build-Tool Vulnerabilities**
- **Status**: Blocked (awaiting upstream fixes)
- **Packages**: `path-to-regexp`, `esbuild`, `undici`
- **Source**: `@cloudflare/next-on-pages@1.13.16`
- **Action**: Monitor for adapter updates

### Reporting Vulnerabilities

If you discover a security vulnerability:

1. **Do NOT** create a public issue
2. Contact the maintainer directly
3. Follow responsible disclosure practices
4. Update this document with the issue

## Dependency Categories

### Production Dependencies
- **Framework**: Next.js, React
- **Validation**: Zod
- **Styling**: Tailwind CSS, clsx
- **Content**: MDX, gray-matter
- **Infrastructure**: Sentry, Upstash, Supabase, HubSpot

### Dev Dependencies
- **Build Tools**: TypeScript, ESLint, Prettier
- **Testing**: Vitest, Playwright, Testing Library
- **Deployment**: Cloudflare adapter, Wrangler

## Best Practices

1. **Pin Versions**: Use exact versions (`^` for minor updates only)
2. **Regular Audits**: Run `npm audit` monthly
3. **Update Strategically**: Don't update everything at once
4. **Test Thoroughly**: Always test after dependency updates
5. **Document Changes**: Keep CHANGELOG.md updated

## Automation

### CI Pipeline
- Runs `npm audit` on every PR
- Fails on Critical/High vulnerabilities (if blocking enabled)
- Reports Moderate/Low for review

### Future Enhancements
- Dependabot for automated PRs (if enabled)
- Scheduled monthly audit reports
- Automated security alerts

## References

- [npm audit documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [npm outdated documentation](https://docs.npmjs.com/cli/v8/commands/npm-outdated)
- Task tracking: T-104, T-070
- CI workflow: `.github/workflows/ci.yml`
