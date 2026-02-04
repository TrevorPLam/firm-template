// AI-META-BEGIN
// 
// AI-META: Utility functions and helpers
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Imported by application code
// DEPENDENCIES: Upstash Redis (rate limiting)
// DANGER: Credential handling; Rate limiting - misconfiguration can lead to DoS
// CHANGE-SAFETY: Add functions: safe. Modify existing: check all call sites first
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

import { createHash } from 'crypto'
import { logError, logInfo, logWarn } from '../logger'
import { validatedEnv } from '../env'

/**
 * Rate limiting configuration.
 * - 3 requests per hour per email address
 * - 3 requests per hour per IP address
 */
const RATE_LIMIT_MAX_REQUESTS = 3
const RATE_LIMIT_WINDOW = '1 h' // 1 hour

/**
 * Rate limiter interface for distributed (Upstash) rate limiting.
 */
type RateLimiter = {
  limit: (identifier: string) => Promise<{ success: boolean }>
}

/**
 * Rate limiter instance (null = not initialized, false = fallback to in-memory).
 */
let rateLimiter: RateLimiter | null | false = null

/**
 * In-memory rate limit tracking (development-only fallback).
 * Maps identifier to request count and reset timestamp.
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

/**
 * Salts for hashing to prevent rainbow table attacks.
 */
const IP_HASH_SALT = 'contact_form_ip'
const EMAIL_HASH_SALT = 'contact_form_email'

/**
 * Hash an identifier (email or IP) for privacy and storage.
 *
 * Uses SHA-256 with salt to prevent rainbow table attacks.
 * IP addresses are NEVER stored or logged in plain text.
 *
 * @param value - The value to hash (email or IP address)
 * @returns Hex-encoded SHA-256 hash
 */
export function hashIdentifier(value: string, salt = IP_HASH_SALT): string {
  return createHash('sha256').update(`${salt}:${value}`).digest('hex')
}

export function hashEmail(value: string): string {
  return hashIdentifier(value, EMAIL_HASH_SALT)
}

/**
 * Initialize rate limiter with Upstash Redis (distributed) or fallback to in-memory.
 *
 * **Distributed (Production):**
 * - Uses Upstash Redis for multi-instance rate limiting
 * - Sliding window algorithm (3 requests per hour)
 * - Analytics enabled for monitoring
 *
 * **In-Memory (Development Only):**
 * - Uses Map for single-instance rate limiting
 * - Not suitable for production (does not sync across instances)
 * - Used only when UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set
 *
 * @returns RateLimiter instance or null for in-memory fallback
 */
async function getRateLimiter() {
  if (rateLimiter !== null) {
    return rateLimiter
  }

  const isProduction = validatedEnv.NODE_ENV === 'production'
  const hasUpstashConfig =
    Boolean(validatedEnv.UPSTASH_REDIS_REST_URL) &&
    Boolean(validatedEnv.UPSTASH_REDIS_REST_TOKEN)

  if (!hasUpstashConfig && isProduction) {
    throw new Error(
      'Upstash Redis is required in production. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.'
    )
  }

  // Check if Upstash credentials are configured
  if (hasUpstashConfig) {
    try {
      const { Ratelimit } = await import('@upstash/ratelimit')
      const { Redis } = await import('@upstash/redis')

      const redis = new Redis({
        url: validatedEnv.UPSTASH_REDIS_REST_URL,
        token: validatedEnv.UPSTASH_REDIS_REST_TOKEN,
      })

      rateLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW),
        analytics: true,
        prefix: 'contact_form',
      })

      logInfo('Initialized distributed rate limiting with Upstash Redis')
      return rateLimiter
    } catch (error) {
      if (isProduction) {
        logError('Failed to initialize Upstash rate limiter in production', error)
        throw new Error('Failed to initialize Upstash Redis rate limiter in production.', { cause: error })
      }

      logError('Failed to initialize Upstash rate limiter, falling back to in-memory', error)
    }
  } else if (!isProduction) {
    logWarn(
      'Upstash Redis not configured, using in-memory rate limiting (development only)'
    )
  }

  // Return null to indicate fallback to in-memory
  rateLimiter = false // Sentinel value to prevent re-initialization attempts
  return null
}

/**
 * Check rate limit using in-memory storage (development-only fallback).
 *
 * **Algorithm:**
 * - Fixed window: 1 hour sliding
 * - Automatically cleans up expired entries
 * - Stores count and reset timestamp per identifier
 *
 * **Limitations:**
 * - NOT suitable for production (single-instance only)
 * - Does not sync across multiple server instances
 * - Memory usage grows with unique identifiers (auto-cleaned on expiry)
 *
 * @param identifier - Unique identifier (email:xxx or ip:hash)
 * @returns true if request allowed, false if rate limit exceeded
 */
function checkRateLimitInMemory(identifier: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(identifier)

  // Clean up expired entries
  if (limit && now > limit.resetAt) {
    rateLimitMap.delete(identifier)
  }

  const existing = rateLimitMap.get(identifier)
  if (!existing) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + 60 * 60 * 1000 }) // 1 hour
    return true
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  existing.count++
  return true
}

/**
 * Check rate limits for both email and IP address.
 *
 * **Dual Rate Limiting:**
 * - Enforces limits per email address (prevents single user spam)
 * - Enforces limits per IP address (prevents distributed attacks)
 * - BOTH limits must pass for request to be allowed
 *
 * **Implementation:**
 * - Uses Upstash Redis (required in production)
 * - Falls back to in-memory only in development/test
 *
 * @param email - User's email address (not hashed for email-based limiting)
 * @param clientIp - Client IP address (hashed before storage)
 * @returns true if both limits pass, false if either limit exceeded
 */
export async function checkRateLimit(email: string, clientIp: string): Promise<boolean> {
  const limiter = await getRateLimiter()
  const emailIdentifier = `email:${email}`
  const ipIdentifier = `ip:${hashIdentifier(clientIp)}`

  if (limiter) {
    // Use Upstash distributed rate limiting
    const emailLimit = await limiter.limit(emailIdentifier)
    if (!emailLimit.success) {
      return false
    }

    const ipLimit = await limiter.limit(ipIdentifier)
    return ipLimit.success
  } else {
    // Fall back to in-memory rate limiting
    const emailAllowed = checkRateLimitInMemory(emailIdentifier)
    if (!emailAllowed) {
      return false
    }

    return checkRateLimitInMemory(ipIdentifier)
  }
}
