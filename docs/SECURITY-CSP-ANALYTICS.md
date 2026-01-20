# CSP Updates for Analytics Integration

**Created:** 2026-01-09  
**Related Task:** T-100 (Security cleanup after launch integrations)  
**Status:** Documentation for future T-098 (Analytics integration)

## Overview

When analytics is integrated (T-098), the Content Security Policy (CSP) in `middleware.ts` will need to be updated to allow analytics provider scripts and connections.

## Current CSP Restrictions

The current CSP blocks external connections:
- `connect-src 'self'` - Only allows same-origin API calls
- `script-src 'self' 'unsafe-inline'` - Only allows same-origin scripts

## Required CSP Updates

### Google Analytics 4 (GA4)

If using GA4, add to CSP:

```typescript
// In middleware.ts, update CSP:
"script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
"connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com",
```

**Domains needed:**
- `https://www.googletagmanager.com` - For gtag.js script
- `https://www.google-analytics.com` - For analytics data collection

### Plausible Analytics

If using Plausible, add to CSP:

```typescript
// In middleware.ts, update CSP:
"script-src 'self' 'unsafe-inline' https://plausible.io",
"connect-src 'self' https://plausible.io",
```

**Domain needed:**
- `https://plausible.io` - For Plausible script and data collection

## Implementation Steps

1. **Choose analytics provider** (T-064)
2. **Install analytics** (T-098)
3. **Update CSP in middleware.ts** with appropriate domains
4. **Test CSP** - Check browser console for violations
5. **Verify analytics tracking** works correctly

## Testing CSP Changes

After updating CSP:

1. Open browser DevTools → Console
2. Look for CSP violation errors
3. Test analytics events (form submissions, page views)
4. Verify analytics dashboard receives data

## Security Notes

- Only add specific domains (not wildcards like `https://*`)
- Test in production-like environment before deploying
- Monitor CSP violations in Sentry (if enabled)
- Consider using nonce-based CSP in future (requires SSR changes)

## References

- Current CSP: `middleware.ts` lines 160-173
- Analytics implementation: `lib/analytics.ts`
- Task tracking: T-098 (Install analytics provider)
