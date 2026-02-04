// AI-META-BEGIN
// 
// AI-META: Security utilities and middleware
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Imported by application code
// DEPENDENCIES: Upstash Redis (rate limiting)
// DANGER: XSS prevention - must sanitize all user input; Environment variable access - validate all values
// CHANGE-SAFETY: Add functions: safe. Modify existing: check all call sites first
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

/**
 * Advanced Security Headers Middleware
 * 
 * Implements OWASP Top 10 security headers and best practices:
 * - Content Security Policy (CSP)
 * - X-Frame-Options
 * - X-Content-Type-Options
 * - Referrer-Policy
 * - Permissions-Policy
 * - Strict-Transport-Security (HSTS)
 * 
 * Usage in Next.js middleware.ts:
 * ```ts
 * import { securityHeaders } from '@/lib/security-headers'
 * 
 * export function middleware(request: NextRequest) {
 *   const response = NextResponse.next()
 *   Object.entries(securityHeaders).forEach(([key, value]) => {
 *     response.headers.set(key, value)
 *   })
 *   return response
 * }
 * ```
 */

export const securityHeaders = {
  // Content Security Policy - Prevents XSS attacks
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval in dev
    "style-src 'self' 'unsafe-inline'", // Tailwind requires unsafe-inline
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.sentry.io https://*.upstash.io",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-src 'none'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join('; '),

  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Feature Policy - Restrict browser features
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()', // Disable FLoC
  ].join(', '),

  // Force HTTPS (only in production)
  ...(process.env.NODE_ENV === 'production' && {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  }),

  // Additional security headers
  'X-DNS-Prefetch-Control': 'on',
  'X-Download-Options': 'noopen',
  'X-Permitted-Cross-Domain-Policies': 'none',
} as Record<string, string>

/**
 * Get security headers for a specific environment
 */
export function getSecurityHeaders(env: 'development' | 'production' = 'production') {
  const headers = { ...securityHeaders }

  // Relax CSP in development for better DX
  if (env === 'development') {
    headers['Content-Security-Policy'] = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' http://localhost:* ws://localhost:*",
    ].join('; ')
  }

  return headers
}
