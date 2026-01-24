/**
 * Environment variable validation and type-safe access.
 *
 * @module lib/env
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Server-only environment validation. This file MUST import
 * 'server-only' to prevent accidental client-side bundling of secrets.
 *
 * **SECURITY CRITICAL**: This file handles API keys and secrets.
 * - NEVER expose non-NEXT_PUBLIC_ vars to client
 * - NEVER log secret values
 * - ALL secrets validated at startup (fail-fast)
 *
 * **COUNTERPART**: `lib/env.public.ts` for browser-safe NEXT_PUBLIC_* vars
 *
 * **ADDING NEW ENV VARS**:
 * 1. Add to envSchema with Zod validation
 * 2. Add to env.safeParse() call below
 * 3. Add to env.example with placeholder
 * 4. Update scripts/check-client-secrets.mjs forbiddenTokens array
 * 5. Update docs/DEPLOYMENT.md env var list
 *
 * **AI ITERATION HINTS**:
 * - Supabase + HubSpot vars are required for the lead pipeline
 * - Keep server vars here, public vars in env.public.ts (twin pattern)
 * - Use .optional() for vars with graceful fallback, no modifier for required
 *
 * **CURRENT VARS**:
 * | Var | Type | Required | Notes |
 * |-----|------|----------|-------|
 * | NEXT_PUBLIC_SITE_URL | url | defaults | Base URL for meta tags |
 * | NEXT_PUBLIC_SITE_NAME | string | defaults | Site name for branding |
 * | NEXT_PUBLIC_ANALYTICS_ID | string | optional | GA4/Plausible ID |
 * | UPSTASH_REDIS_REST_URL | string | optional* | Rate limiting (required in production) |
 * | UPSTASH_REDIS_REST_TOKEN | string | optional* | Rate limiting (required in production) |
 * | SUPABASE_URL | url | required | Supabase project URL |
 * | SUPABASE_SERVICE_ROLE_KEY | string | required | Server-only service role key |
 * | HUBSPOT_PRIVATE_APP_TOKEN | string | required | HubSpot private app token |
 * | EMAIL_PROVIDER | enum | defaults | Transactional email provider |
 * | EMAIL_API_KEY | string | optional | Transactional email API key |
 * | EMAIL_FROM_ADDRESS | string | optional | Transactional email sender |
 * | EMAIL_TO_ADDRESS | string | optional | Business notification recipient |
 * | EMAIL_SEND_THANK_YOU | boolean | defaults | Send customer thank-you email |
 * | SCHEDULING_PROVIDER | enum | defaults | Appointment scheduling provider |
 * | CALENDLY_URL | url | optional | Calendly scheduling link |
 * | CALCOM_USERNAME | string | optional | Cal.com username |
 *
 * **KNOWN ISSUES**:
 * - [ ] No runtime validation for env changes (restart required)
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **Purpose:**
 * - Validate environment variables at startup
 * - Provide type-safe access to env vars
 * - Fail fast with clear error messages
 * - Document required vs optional variables
 *
 * **Validation:**
 * - Uses Zod for runtime type checking
 * - Validates URLs, emails, enums
 * - Provides defaults for optional variables
 * - Throws on missing required variables
 *
 * **Usage:**
 * ```typescript
 * import { validatedEnv } from './env'
 *
 * // Type-safe access with autocomplete
 * const supabaseUrl = validatedEnv.SUPABASE_URL // string (required)
 * const siteUrl = validatedEnv.NEXT_PUBLIC_SITE_URL // string (required)
 * ```
 *
 * **Variable Categories:**
 * - **Public:** NEXT_PUBLIC_* (exposed to browser, use for non-sensitive config)
 * - **Server-only:** All others (never sent to browser, use for API keys/secrets)
 */

import 'server-only'

import { z } from 'zod'

/**
 * Environment variable schema with validation rules.
 * 
 * **Public Variables (NEXT_PUBLIC_*):**
 * - Exposed to browser (accessible in client components)
 * - Never include secrets or API keys
 * - Used for site URL, analytics IDs, feature flags
 * 
 * **Server-Only Variables:**
 * - Only accessible in server components and API routes
 * - Use for API keys, database credentials, secrets
 * - Never exposed to browser
 * 
 * **Required vs Optional:**
 * - Optional: Has `.optional()` or `.default()` (graceful fallback)
 * - Required: No fallback (throws error if missing)
 * 
 * **Validation Rules:**
 * - URLs validated with `.url()` (must be valid HTTP/HTTPS URL)
 * - Emails validated with `.email()` (must be valid email format)
 * - Enums validated with `.enum()` (must match allowed values)
 */
const envSchema = z.object({
  /**
   * Public site URL (no trailing slash).
   * Used for absolute URLs in sitemap, OG tags, canonical URLs.
   * 
   * @default 'http://localhost:3000' (development)
   * @example 'https://yourdedicatedmarketer.com' (production)
   */
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),

  /**
   * Public site name for branding.
   * Used in page titles, OG tags, meta descriptions.
   * 
   * @default 'Your Firm Name'
   */
  NEXT_PUBLIC_SITE_NAME: z.string().default('Your Firm Name'),

  /**
   * Analytics tracking ID (optional).
   * Used by lib/analytics.ts for event tracking.
   * 
   * @optional
   * @example 'G-XXXXXXXXXX' (Google Analytics)
   * @example 'vercel-analytics' (Vercel Analytics)
   */
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),

  /**
   * Node environment (development, production, test).
   * 
   * @default 'development'
   */
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  /**
   * Upstash Redis REST URL for distributed rate limiting (optional in dev/test).
   * Production requires this to avoid in-memory rate limiting.
   * 
   * @optional
   * @see {@link https://upstash.com/docs/redis/overall/getstarted Upstash Redis}
   */
  UPSTASH_REDIS_REST_URL: z.string().optional(),

  /**
   * Upstash Redis REST token for distributed rate limiting (optional in dev/test).
   * Must be set together with UPSTASH_REDIS_REST_URL (required in production).
   * 
   * @optional
   */
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  /**
   * Supabase project URL (required).
   * Used for server-side lead storage.
   * 
   * @example 'https://xyzcompany.supabase.co'
   */
  SUPABASE_URL: z.string().trim().url(),

  /**
   * Supabase service role key (required, server-only).
   * Grants elevated access; never expose to the client.
   */
  SUPABASE_SERVICE_ROLE_KEY: z.string().trim().min(1),

  /**
   * HubSpot private app token (required, server-only).
   * Used for CRM sync.
   */
  HUBSPOT_PRIVATE_APP_TOKEN: z.string().trim().min(1),

  /**
   * Transactional email provider (optional).
   * If set to "none", email sending is disabled.
   * 
   * @default 'none'
   */
  EMAIL_PROVIDER: z.enum(['sendgrid', 'postmark', 'resend', 'none']).default('none'),

  /**
   * Transactional email API key (required when EMAIL_PROVIDER is not "none").
   * 
   * @optional
   */
  EMAIL_API_KEY: z.string().trim().min(1).optional(),

  /**
   * Transactional email sender address (required when EMAIL_PROVIDER is not "none").
   * 
   * @optional
   */
  EMAIL_FROM_ADDRESS: z.string().trim().email().optional(),

  /**
   * Recipient address for owner notifications (required when EMAIL_PROVIDER is not "none").
   * 
   * @optional
   */
  EMAIL_TO_ADDRESS: z.string().trim().email().optional(),

  /**
   * Send thank-you email to the customer (optional).
   * 
   * @default false
   */
  EMAIL_SEND_THANK_YOU: z.coerce.boolean().default(false),

  /**
   * Appointment scheduling provider (optional).
   * Set to "none" to disable scheduling embeds.
   * 
   * @default 'none'
   */
  SCHEDULING_PROVIDER: z.enum(['calendly', 'calcom', 'none']).default('none'),

  /**
   * Calendly scheduling URL (required when using Calendly).
   * 
   * @optional
   */
  CALENDLY_URL: z.string().trim().optional(),

  /**
   * Cal.com username (required when using Cal.com).
   * 
   * @optional
   */
  CALCOM_USERNAME: z.string().trim().optional(),
})
  .superRefine((data, ctx) => {
    if (data.EMAIL_PROVIDER === 'none') {
      return
    }

    if (!data.EMAIL_API_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'EMAIL_API_KEY is required when EMAIL_PROVIDER is set',
        path: ['EMAIL_API_KEY'],
      })
    }

    if (!data.EMAIL_FROM_ADDRESS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'EMAIL_FROM_ADDRESS is required when EMAIL_PROVIDER is set',
        path: ['EMAIL_FROM_ADDRESS'],
      })
    }

    if (!data.EMAIL_TO_ADDRESS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'EMAIL_TO_ADDRESS is required when EMAIL_PROVIDER is set',
        path: ['EMAIL_TO_ADDRESS'],
      })
    }
  })
  .superRefine((data, ctx) => {
    if (data.SCHEDULING_PROVIDER === 'none') {
      return
    }

    if (data.SCHEDULING_PROVIDER === 'calendly') {
      if (!data.CALENDLY_URL) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CALENDLY_URL is required when SCHEDULING_PROVIDER is calendly',
          path: ['CALENDLY_URL'],
        })
      } else if (!z.string().url().safeParse(data.CALENDLY_URL).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CALENDLY_URL must be a valid URL',
          path: ['CALENDLY_URL'],
        })
      }
    }

    if (data.SCHEDULING_PROVIDER === 'calcom') {
      if (!data.CALCOM_USERNAME?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CALCOM_USERNAME is required when SCHEDULING_PROVIDER is calcom',
          path: ['CALCOM_USERNAME'],
        })
      } else if (data.CALCOM_USERNAME.includes(' ')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CALCOM_USERNAME must not include spaces',
          path: ['CALCOM_USERNAME'],
        })
      }
    }
  })

/**
 * Validate environment variables at module load time.
 * 
 * **Behavior:**
 * - Reads from process.env
 * - Validates against envSchema
 * - Applies defaults for optional variables
 * - Throws descriptive error on validation failure
 * 
 * **Error Handling:**
 * - Logs field-specific errors to console
 * - Throws error to stop application startup
 * - Prevents running with invalid configuration
 * 
 * **Example Error Output:**
 * ```
 * ❌ Invalid environment variables: {
 *   NEXT_PUBLIC_SITE_URL: ['Invalid URL'],
 *   SUPABASE_URL: ['Invalid url']
 * }
 * ```
 */
const env = envSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  NODE_ENV: process.env.NODE_ENV,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  HUBSPOT_PRIVATE_APP_TOKEN: process.env.HUBSPOT_PRIVATE_APP_TOKEN,
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
  EMAIL_API_KEY: process.env.EMAIL_API_KEY,
  EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,
  EMAIL_TO_ADDRESS: process.env.EMAIL_TO_ADDRESS,
  EMAIL_SEND_THANK_YOU: process.env.EMAIL_SEND_THANK_YOU,
  SCHEDULING_PROVIDER: process.env.SCHEDULING_PROVIDER,
  CALENDLY_URL: process.env.CALENDLY_URL,
  CALCOM_USERNAME: process.env.CALCOM_USERNAME,
})

if (!env.success) {
  console.error('❌ Invalid environment variables:', env.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

/**
 * Validated environment variables with type safety.
 * 
 * **Type Safety:**
 * - TypeScript knows which variables are required vs optional
 * - Autocomplete available for all variables
 * - Compile-time checking for typos
 * 
 * **Usage:**
 * ```typescript
 * import { validatedEnv } from './env'
 * 
 * // Required variables (always string)
 * const siteUrl = validatedEnv.NEXT_PUBLIC_SITE_URL
 * 
 * // Required variables (always string)
 * const hubspotToken = validatedEnv.HUBSPOT_PRIVATE_APP_TOKEN
 * ```
 */
export const validatedEnv = env.data

/**
 * Get the base site URL for absolute links and metadata.
 * 
 * **Behavior:**
 * - Uses validated NEXT_PUBLIC_SITE_URL
 * - Defaults to http://localhost:3000 in development
 * 
 * @example
 * ```typescript
 * const baseUrl = getBaseUrl()
 * // Development: http://localhost:3000
 * // Production: https://yourdedicatedmarketer.com
 * ```
 * 
 * @returns Base site URL as a string
 */
export const getBaseUrl = () => validatedEnv.NEXT_PUBLIC_SITE_URL

/**
 * Get current Node environment.
 * 
 * @returns 'development' | 'production' | 'test'
 */
export const getNodeEnvironment = () => process.env.NODE_ENV || validatedEnv.NODE_ENV

/**
 * Check if running in production.
 * 
 * **Use cases:**
 * - Enable production-only features (analytics, Sentry)
 * - Apply production-only headers (HSTS)
 * - Hide dev-only logging
 * 
 * @returns true if NODE_ENV === 'production'
 */
export const isProduction = () => getNodeEnvironment() === 'production'

/**
 * Check if running in development.
 * 
 * **Use cases:**
 * - Enable dev-only logging
 * - Show dev-only UI (debug panels)
 * - Skip external API calls (use mocks)
 * 
 * @returns true if NODE_ENV === 'development'
 */
export const isDevelopment = () => getNodeEnvironment() === 'development'

/**
 * Check if running in test mode.
 * 
 * **Use cases:**
 * - Disable external API calls in tests
 * - Use test-specific configuration
 * - Skip analytics tracking
 * 
 * @returns true if NODE_ENV === 'test'
 */
export const isTest = () => getNodeEnvironment() === 'test'
