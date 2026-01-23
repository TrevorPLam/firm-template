# Next.js Configuration Documentation

This document describes the Next.js configuration and deployment setup for firm-template.

## Configuration Files

### `next.config.mjs`

The main Next.js configuration file includes:

#### Key Settings

- **React Strict Mode:** Enabled for better development experience
- **Page Extensions:** Supports `.js`, `.jsx`, `.ts`, `.tsx`, `.md`, `.mdx`
- **Image Optimization:** Configured for Cloudflare Pages compatibility
- **Source Maps:** Enabled in production for error tracking
- **TypeScript/ESLint:** Build errors are not ignored (strict mode)

#### MDX Configuration

MDX support is configured with:
- **remark-gfm** - GitHub Flavored Markdown support
- **rehype-slug** - Automatic heading IDs
- **rehype-pretty-code** - Syntax highlighting

#### Sentry Integration

Sentry is configured for error tracking:
- Source maps are hidden in production
- Logger is disabled in production
- Requires environment variables:
  - `SENTRY_ORG`
  - `SENTRY_PROJECT`
  - `SENTRY_AUTH_TOKEN`

#### Bundle Analysis

Optional bundle analysis (when `ANALYZE=true`):
- Uses `@next/bundle-analyzer` if available
- Helps identify large dependencies

### `middleware.ts`

Security middleware that runs on every request:

#### Security Headers

- **Content Security Policy (CSP)** - XSS prevention
- **Strict-Transport-Security (HSTS)** - HTTPS enforcement (production only)
- **X-Frame-Options: DENY** - Clickjacking prevention
- **X-Content-Type-Options: nosniff** - MIME sniffing prevention
- **Permissions-Policy** - Feature restrictions

#### Request Validation

- **Payload Size Limits:** POST requests limited to 1MB
- **Content-Length Validation:** Validates Content-Length headers

#### Environment Differences

- **Development:** CSP allows `unsafe-eval` for Fast Refresh
- **Production:** CSP removes `unsafe-eval`, enables HSTS

See `middleware.ts` for detailed implementation and comments.

## Deployment Configuration

### Cloudflare Pages

The application is configured for Cloudflare Pages deployment:

#### Build Configuration

```bash
npm run pages:build
```

This uses `@cloudflare/next-on-pages` to build Next.js for Cloudflare Pages.

#### Preview Locally

```bash
npm run pages:preview
```

Uses Wrangler to preview the Cloudflare Pages build locally.

#### Configuration Files

- **`wrangler.toml`** - Cloudflare Pages/Wrangler configuration
- **`next.config.mjs`** - Next.js configuration with Cloudflare compatibility

#### Image Optimization

Cloudflare Pages doesn't support Next.js Image Optimization API by default. The configuration:
- Uses `unoptimized: true` when `CLOUDFLARE_BUILD=true`
- Consider using Cloudflare Images or a custom loader for production

### Environment Variables

Required environment variables:

#### Development

- `.env.local` - Local development variables (not committed)

#### Production

- `SENTRY_ORG` - Sentry organization
- `SENTRY_PROJECT` - Sentry project name
- `SENTRY_AUTH_TOKEN` - Sentry authentication token
- `UPSTASH_REDIS_REST_URL` - Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis REST token
- `CLOUDFLARE_BUILD` - Set to `true` for Cloudflare Pages builds

### Build Process

#### Standard Next.js Build

```bash
npm run build
```

Produces:
- `.next/` - Next.js build output
- Optimized production bundle
- Static assets

#### Cloudflare Pages Build

```bash
npm run pages:build
```

Produces:
- `.vercel/output/static/` - Static output for Cloudflare Pages
- Compatible with Cloudflare Pages runtime

#### Post-Build Checks

The `postbuild` script runs `scripts/check-client-secrets.mjs` to verify no secrets are exposed in client-side code.

## Development Configuration

### TypeScript

- **Config:** `tsconfig.json`
- **Strict Mode:** Enabled
- **Type Checking:** Required (build errors not ignored)

### ESLint

- **Config:** `eslint.config.mjs`
- **Preset:** `eslint-config-next`
- **Build Errors:** Not ignored (strict mode)

### Prettier

- **Config:** `.prettierrc` (if exists) or package.json
- **Format Check:** `npm run format:check`
- **Auto-format:** `npm run format`

## Security Configuration

### Security Headers

All security headers are configured in `middleware.ts`. See that file for:
- CSP directives
- HSTS configuration
- Other security headers

### Rate Limiting

Rate limiting is configured using Upstash Rate Limit. See:
- `lib/actions.ts` for implementation
- Environment variables for Upstash configuration

## Monitoring Configuration

### Sentry

Sentry is configured for:
- Error tracking
- Performance monitoring
- Source map uploads

Configuration:
- `sentry.client.config.ts` - Client-side configuration
- `sentry.server.config.ts` - Server-side configuration
- `sentry.edge.config.ts` - Edge runtime configuration

## Troubleshooting

### Build Issues

1. **TypeScript Errors:**
   - Run `npm run type-check` to see all errors
   - Fix type errors before building

2. **ESLint Errors:**
   - Run `npm run lint` to see all errors
   - Fix linting errors before building

3. **Cloudflare Build Issues:**
   - Ensure `CLOUDFLARE_BUILD=true` is set
   - Check `wrangler.toml` configuration
   - Verify `@cloudflare/next-on-pages` is installed

### Runtime Issues

1. **Security Headers Not Applied:**
   - Check `middleware.ts` is in root directory
   - Verify middleware matcher configuration
   - Check middleware is not being bypassed

2. **Sentry Not Working:**
   - Verify environment variables are set
   - Check Sentry configuration files
   - Review Sentry dashboard for errors

## Best Practices

1. **Never commit secrets** - Use environment variables
2. **Keep dependencies updated** - Run `npm audit` regularly
3. **Test builds locally** - Verify before deploying
4. **Monitor error tracking** - Review Sentry regularly
5. **Review security headers** - Keep CSP and other headers updated

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

---

**Last Updated:** 2026-01-23  
**Configuration Version:** Next.js 15.5.2
