# PRODUCTION-ENV-CHECKLIST.md — Production Environment Checklist

Last Updated: 2026-01-21
Status: Active

Purpose: Ensure production deployments have the correct environment variables configured, with clear verification steps for each value.

---

## Required Environment Variables
These variables are required for the contact pipeline to work in production.

| Variable | Purpose | Where to obtain | Example format | Security considerations | Verification steps |
| --- | --- | --- | --- | --- | --- |
| `SUPABASE_URL` | Connects the app to your Supabase project. | Supabase project settings → API. | `https://xyzcompany.supabase.co` | Server-side only; never expose in client bundles. | Submit a contact form and confirm a record appears in Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | Grants server-side access for secure writes to Supabase. | Supabase project settings → API (service role key). | `eyJhbGciOiJIUzI1...` | Treat as a secret; rotate if exposed. | Trigger a contact form submission and confirm no auth errors in logs. |
| `HUBSPOT_PRIVATE_APP_TOKEN` | Enables CRM sync for leads. | HubSpot → Settings → Integrations → Private Apps. | `pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` | Secret token; never commit to git. | Submit a form and verify the contact appears in HubSpot. |

---

## Optional Environment Variables
Optional variables enhance production readiness but are not strictly required.

| Variable | Purpose | Where to obtain | Example format | Security considerations | Verification steps |
| --- | --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Base URL for metadata, sitemap, and OG tags. | Your production domain. | `https://yourfirm.com` | Public value; safe to expose. | Visit `/sitemap.xml` and confirm canonical URLs match the domain. |
| `NEXT_PUBLIC_SITE_NAME` | Display name used in metadata and UI. | Internal branding decision. | `Your Firm Name` | Public value; safe to expose. | Confirm the site header/footer show the updated name. |
| `NEXT_PUBLIC_SITE_TAGLINE` | Tagline for hero copy and metadata. | Internal branding decision. | `Expert solutions for your business` | Public value; safe to expose. | Confirm hero and metadata reflect the new tagline. |
| `NEXT_PUBLIC_ANALYTICS_ID` | Enables analytics tracking (provider-specific). | Analytics provider dashboard. | `G-XXXXXXX` | Public value; safe to expose. | Trigger a page view and verify events in provider real-time view. |
| `UPSTASH_REDIS_REST_URL` | Enables distributed rate limiting. | Upstash Redis database settings. | `https://xxxx-redis.upstash.io` | Server-side secret; keep private. | Check logs for `Initialized distributed rate limiting with Upstash Redis`. |
| `UPSTASH_REDIS_REST_TOKEN` | Auth token for Upstash Redis. | Upstash Redis database settings. | `AXXXXXX...` | Server-side secret; keep private. | Confirm rate limiting uses Redis (no fallback log). |
| `EMAIL_PROVIDER` | Selects transactional email provider. | SendGrid/Postmark/Resend dashboard. | `sendgrid` | Server-side value; keep private. | Submit contact form and confirm owner notification email sends. |
| `EMAIL_API_KEY` | Auth key for email provider. | Email provider settings. | `SG.xxxxx` | Server-side secret; keep private. | Submit contact form and confirm email provider accepts request. |
| `EMAIL_FROM_ADDRESS` | Sender address for notifications. | Email provider configuration. | `notifications@yourfirm.com` | Server-side value; keep private. | Verify the From address in received emails. |
| `EMAIL_TO_ADDRESS` | Owner inbox for contact alerts. | Internal decision. | `owner@yourfirm.com` | Server-side value; keep private. | Confirm the notification arrives in the correct inbox. |
| `EMAIL_SEND_THANK_YOU` | Sends a thank-you email to the customer. | Internal decision. | `true` | Server-side value; keep private. | Submit a contact form and confirm the customer receives the thank-you email. |
| `SCHEDULING_PROVIDER` | Enables appointment scheduling embeds. | Calendly or Cal.com account. | `calendly` | Server-side value; keep private. | Confirm the scheduling CTA appears on the homepage. |
| `CALENDLY_URL` | Calendly scheduling link. | Calendly scheduling settings. | `https://calendly.com/your-firm/intro` | Server-side value; keep private. | Click the scheduling CTA and verify the Calendly embed loads. |
| `CALCOM_USERNAME` | Cal.com username for booking. | Cal.com account settings. | `your-firm` | Server-side value; keep private. | Click the scheduling CTA and verify the Cal.com embed loads. |
| `SENTRY_AUTH_TOKEN` | Uploads source maps/releases. | Sentry account settings. | `sntrys_...` | Server-side secret; keep private. | Run a production build and confirm Sentry release upload. |
| `SENTRY_ORG` | Identifies your Sentry organization. | Sentry organization settings. | `your-org-slug` | Server-side value; keep private. | Confirm release creation uses the correct org. |
| `SENTRY_PROJECT` | Identifies your Sentry project. | Sentry project settings. | `your-project-slug` | Server-side value; keep private. | Confirm release creation uses the correct project. |
| `SENTRY_ENVIRONMENT` | Labels errors by environment. | Internal decision. | `production` | Server-side value; ok to expose in logs. | Trigger an error and confirm it appears under the correct environment. |
| `NEXT_PUBLIC_SENTRY_DSN` | Enables client-side error reporting. | Sentry project settings. | `https://xxxx@o0.ingest.sentry.io/0` | Public value; safe to expose. | Trigger a client error and confirm it appears in Sentry. |

---

## Development-Only Variables
These values are helpful for local development and are not required in production.

| Variable | Purpose | Where to obtain | Example format | Security considerations | Verification steps |
| --- | --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SENTRY_DEBUG` | Enables verbose Sentry logging in development. | Local developer choice. | `true` | Public value; avoid enabling in production. | Start the dev server and confirm Sentry debug logs appear. |
| `NODE_ENV` | Forces a local environment override. | Local developer choice. | `development` | Do not override in production platforms. | Confirm `process.env.NODE_ENV` resolves to `development` locally. |

---

## Notes
- Keep all secrets in your deployment platform’s environment variable settings.
- Use `.env.local` for local development; it is ignored by git.
- If any required variable is missing, halt deployment until the issue is resolved.
