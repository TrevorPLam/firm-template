/**
 * Server actions for contact form submission with rate limiting and lead capture.
 *
 * @module lib/actions/contact-form
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Core server action for contact form. Single entry point for
 * all form submissions. Handles validation → rate-limiting → persistence/sync.
 *
 * **ARCHITECTURE PATTERN**: Server Action (Next.js 14+ pattern)
 * - Called directly from ContactForm.tsx via `submitContactForm(data)`
 * - Runs server-side only (no API route needed)
 * - Returns { success, message, errors? } response object
 *
 * **CURRENT STATE**: Supabase + HubSpot lead pipeline (v1).
 *
 * **KEY DEPENDENCIES**:
 * - `../sanitize.ts` — XSS prevention (escapeHtml, sanitizeEmail, sanitizeName)
 * - `../env.ts` — Server-only env validation (validatedEnv)
 * - `../contact-form-schema.ts` — Zod schema (contactFormSchema)
 * - `@upstash/ratelimit` — Distributed rate limiting (optional)
 *
 * **RATE LIMIT DESIGN**:
 * - Dual limiting: per-email AND per-IP (both must pass)
 * - 3 requests/hour per identifier
 * - IP hashed with SHA-256 before storage (privacy)
 * - Production requires Upstash Redis; in-memory fallback is development-only
 *
 * **AI ITERATION HINTS**:
 * 1. Schema changes: Update contact-form-schema.ts first, then this file
 * 2. New fields: Add to sanitized payload before storage and sync
 * 3. Testing: See __tests__/lib/actions.rate-limit.test.ts for mocking pattern
 *
 * **SECURITY CHECKLIST** (verify after any changes):
 * - [x] All user inputs pass through escapeHtml() before HTML context (verified via tests)
 * - [x] CRM payload uses sanitizeName() / sanitizeEmail() (verified via tests)
 * - [x] No raw IP addresses logged (use hashedIp) (verified via tests)
 * - [x] Errors return generic messages (no internal details) (verified via tests)
 *
 * **KNOWN ISSUES / TECH DEBT**:
 * - [ ] No retry logic for HubSpot sync failures
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **Features:**
 * - Distributed rate limiting via Upstash Redis (required in production; dev-only fallback)
 * - Input sanitization to prevent XSS and injection attacks
 * - IP address hashing for privacy (SHA-256)
 * - Lead storage in Supabase and CRM sync to HubSpot
 *
 * **Security:**
 * - All user inputs sanitized with escapeHtml() before use
 * - IP addresses hashed before storage (never logged in plain text)
 * - Rate limits enforced per email address AND per IP address
 * - Payload size limited by middleware (1MB max)
 *
 * **Error Handling:**
 * - Validation errors return user-friendly messages
 * - Rate limit errors return "try again later" message
 * - Network/API errors logged to Sentry, return generic error message
 */

'use server'
import { headers } from 'next/headers'
import { z } from 'zod'
import { logError, logWarn } from '../logger'
import { escapeHtml, sanitizeEmail, sanitizeName } from '../sanitize'
import { sendContactEmails } from '../email'
import { contactFormSchema, type ContactFormData } from '../contact-form-schema'
import { buildHubSpotProperties, syncHubSpotContact } from './hubspot'
import { checkRateLimit, hashEmail, hashIdentifier } from './rate-limit'
import { insertLead } from './supabase'

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again or email us directly.'

type SanitizedContactData = {
  name: string
  email: string
  phone: string
  message: string
}

function isHoneypotTriggered(data: ContactFormData) {
  return Boolean(data.website)
}

function getSanitizedContactData(validatedData: ContactFormData): SanitizedContactData {
  return {
    name: sanitizeName(validatedData.name),
    email: sanitizeEmail(validatedData.email),
    phone: validatedData.phone ? escapeHtml(validatedData.phone) : '',
    message: escapeHtml(validatedData.message),
  }
}

function buildLeadPayload(data: SanitizedContactData, isSuspicious: boolean) {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    is_suspicious: isSuspicious,
    suspicion_reason: isSuspicious ? 'rate_limit' : null,
    hubspot_sync_status: 'pending',
  }
}

function logRateLimitExceeded(email: string, clientIp: string) {
  logWarn('Rate limit exceeded for contact form', {
    emailHash: hashEmail(email),
    ip: hashIdentifier(clientIp),
  })
}

async function sendContactNotifications(data: SanitizedContactData) {
  const results = await sendContactEmails({
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    message: data.message,
  })

  if (!results.ownerNotification.success) {
    if (results.ownerNotification.provider !== 'none') {
      logWarn('Contact email notification failed', { provider: results.ownerNotification.provider })
    }
  }

  if (results.customerThankYou && !results.customerThankYou.success) {
    if (results.customerThankYou.provider !== 'none') {
      logWarn('Contact thank-you email failed', { provider: results.customerThankYou.provider })
    }
  }
}

async function handleContactSubmission(data: ContactFormData) {
  if (isHoneypotTriggered(data)) {
    logWarn('Honeypot field triggered for contact form submission')
    return {
      success: false,
      message: 'Unable to submit your message. Please try again.',
    }
  }

  const validatedData = contactFormSchema.parse(data)
  const clientIp = await getClientIp()
  const safeData = getSanitizedContactData(validatedData)
  const rateLimitPassed = await checkRateLimit(safeData.email, clientIp)
  if (!rateLimitPassed) {
    // WHY: Block storage + CRM writes for known spam to avoid noise and avoid data retention risk.
    logRateLimitExceeded(safeData.email, clientIp)
    return {
      success: false,
      message: 'Too many submissions. Please try again later.',
    }
  }

  const lead = await insertLead(buildLeadPayload(safeData, false))
  const hubspotProperties = buildHubSpotProperties(safeData)
  await syncHubSpotContact(lead.id, hubspotProperties, safeData.email)

  await sendContactNotifications(safeData)

  return { success: true, message: "Thank you for your message! We'll be in touch soon." }
}

/**
 * Get client IP address from request headers.
 *
 * Checks multiple headers in order of preference:
 * 1. x-forwarded-for (standard proxy header)
 * 2. x-vercel-forwarded-for (Vercel-specific)
 * 3. x-real-ip (nginx)
 * 4. cf-connecting-ip (Cloudflare)
 *
 * If multiple IPs are present (comma-separated), returns the first one.
 *
 * @returns Client IP address or 'unknown' if not available
 */
async function getClientIp(): Promise<string> {
  const requestHeaders = await headers()
  const forwardedFor =
    requestHeaders.get('x-forwarded-for') ||
    requestHeaders.get('x-vercel-forwarded-for') ||
    requestHeaders.get('x-real-ip') ||
    requestHeaders.get('cf-connecting-ip')

  if (!forwardedFor) {
    return 'unknown'
  }

  return forwardedFor.split(',')[0]?.trim() || 'unknown'
}

/**
 * Submit contact form with validation, rate limiting, sanitization, and lead capture.
 *
 * **Flow:**
 * 1. Validate input with Zod schema (contactFormSchema)
 * 2. Check rate limits (email + IP)
 * 3. Sanitize inputs for storage and CRM sync
 * 4. Insert lead into Supabase (required)
 * 5. Attempt HubSpot sync (best-effort)
 * 6. Log result to Sentry (errors) and logger (info/warn)
 *
 * **Rate Limiting:**
 * - 3 requests per hour per email address
 * - 3 requests per hour per IP address
 * - Uses Upstash Redis (distributed) or in-memory fallback
 * - Returns "Too many submissions" message on limit exceeded
 *
 * **Security:**
 * - All inputs sanitized with escapeHtml() to prevent XSS
 * - IP addresses hashed before storage (SHA-256 with salt)
 * - Payload size limited by middleware (1MB max)
 * - Contact data stored in Supabase (server-only access)
 *
 * **Lead Capture:**
 * - Supabase insert is required (fails if not configured)
 * - HubSpot sync is best-effort (failures marked for retry)
 *
 * **Error Handling:**
 * - Validation errors (Zod): Returns field-specific error messages
 * - Rate limit errors: Returns "try again later" message
 * - Network/API errors: Returns generic error, logs to Sentry
 * - Never exposes internal error details to users
 *
 * @param data - Contact form data (validated against contactFormSchema)
 * @returns Success response with message or error response with details
 *
 * @throws Never throws - all errors caught and returned as response objects
 *
 * @example
 * ```typescript
 * const result = await submitContactForm({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   message: 'I need help with SEO',
 *   company: 'Acme Corp', // optional
 * });
 *
 * if (result.success) {
 *   console.log(result.message); // "Thank you for your message!"
 * } else {
 *   console.error(result.message); // User-friendly error message
 *   if (result.errors) {
 *     // Zod validation errors
 *     result.errors.forEach(err => console.error(err.message));
 *   }
 * }
 * ```
 */
export async function submitContactForm(data: ContactFormData) {
  try {
    return await handleContactSubmission(data)
  } catch (error) {
    logError('Contact form submission error', error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Please check your form inputs and try again.',
        errors: error.issues,
      }
    }

    return {
      success: false,
      message: DEFAULT_ERROR_MESSAGE,
    }
  }
}
