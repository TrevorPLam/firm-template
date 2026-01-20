# Production Environment Checklist

**Purpose**: Verify all required environment variables are set in Cloudflare Pages before launch.

**Last Updated**: 2026-01-11

**Platform**: Cloudflare Pages

---

## ✅ Required Variables (Must be set)

These variables MUST be configured in Cloudflare Pages for the site to function correctly in production.

### Public Configuration
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://yourdedicatedmarketer.com` (your actual domain)
- [ ] `NEXT_PUBLIC_SITE_NAME` = `Your Dedicated Marketer`

### Analytics (Required per T-084 launch scope)
- [ ] `NEXT_PUBLIC_ANALYTICS_ID` = `G-JY4DRX7FVC` (Google Analytics 4)

### Lead Capture Pipeline (v1 scope)
- [ ] `SUPABASE_URL` = `https://[your-project].supabase.co`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = `[service-role-key-from-supabase]`
- [ ] `HUBSPOT_PRIVATE_APP_TOKEN` = `[private-app-token-from-hubspot]`

### Rate Limiting (Production recommended)
- [ ] `UPSTASH_REDIS_REST_URL` = `https://[your-instance].upstash.io`
- [ ] `UPSTASH_REDIS_REST_TOKEN` = `[token-from-upstash]`

---

## ⚪ Optional Variables (Can be omitted)

These variables have defaults or graceful fallbacks. Set them if you want to override defaults.

### Error Tracking (Optional)
- [ ] `NEXT_PUBLIC_SENTRY_DSN` = `https://[your-dsn]@sentry.io/[project]` (optional)
- [ ] `SENTRY_AUTH_TOKEN` = *(only for source maps upload)*
- [ ] `SENTRY_ORG` = *(only for source maps upload)*
- [ ] `SENTRY_PROJECT` = *(only for source maps upload)*
- [ ] `SENTRY_ENVIRONMENT` = `production` (optional)

### Runtime (Auto-detected)
- [ ] `NODE_ENV` = *(automatically set by Cloudflare Pages to "production")*

---

## 🔧 Verification Steps

### 1. Access Cloudflare Pages Dashboard
1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **your-dedicated-marketer**
3. Go to **Settings** → **Environment Variables**

### 2. Verify Required Variables
For each required variable listed above:
- [ ] Confirm the variable name is spelled correctly (case-sensitive)
- [ ] Confirm the value is set and not empty
- [ ] Confirm sensitive values (API keys, tokens) are not accidentally public

### 3. Test Deployment
- [ ] Trigger a new deployment (push to main or manual deploy)
- [ ] Check build logs for any "Missing required environment variable" errors
- [ ] Verify site starts without errors
- [ ] Test contact form submission (should save to Supabase and sync to HubSpot)

### 4. Security Validation
- [ ] Confirm no NEXT_PUBLIC_ prefixed variables contain secrets
- [ ] Confirm all server-only variables (no prefix) are properly hidden from browser
- [ ] Run `scripts/check-client-secrets.mjs` locally to verify no leaks

---

## 🚨 Common Issues

### Issue: "Missing required environment variable"
**Cause**: Variable not set or misspelled in Cloudflare Pages
**Fix**: Double-check spelling and value in Cloudflare Pages Settings → Environment Variables

### Issue: Contact form fails with "Internal error"
**Cause**: Supabase or HubSpot credentials invalid or missing
**Fix**: 
1. Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Supabase dashboard
2. Verify `HUBSPOT_PRIVATE_APP_TOKEN` has correct permissions (contacts.write)
3. Check Sentry for detailed error logs

### Issue: Rate limiting not working across instances
**Cause**: Upstash Redis credentials not set (falling back to in-memory)
**Fix**: Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

---

## 📋 Pre-Launch Checklist

Before marking this task complete:

- [ ] All **Required** variables are set in Cloudflare Pages
- [ ] A test deployment succeeds without environment variable errors
- [ ] Contact form submission works in the deployed environment
- [ ] No secrets are exposed in browser DevTools (Network/Application tabs)
- [ ] Screenshot or note confirms all variables are configured

---

## Notes

- This checklist reflects the **v1 launch scope** defined in [LAUNCH-SCOPE-V1.md](LAUNCH-SCOPE-V1.md)
- Future env vars (not needed for v1) are marked as optional or omitted
- See [env.example](/env.example) for detailed descriptions of each variable
- See [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment procedures
