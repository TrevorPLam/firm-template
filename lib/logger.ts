/**
 * Centralized logging utility with Sentry integration.
 *
 * @module lib/logger
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Centralized logging with automatic Sentry integration.
 * All console logging should go through this module for consistent behavior.
 *
 * **SECURITY CRITICAL**: Automatically sanitizes sensitive data.
 * - Passwords, tokens, API keys → [REDACTED]
 * - See SENSITIVE_KEYS constant for full list
 *
 * **BEHAVIOR BY ENVIRONMENT**:
 * | Env | Info | Warn | Error |
 * |-----|------|------|-------|
 * | development | console.info | console.warn | console.error |
 * | test | console.info | console.warn | console.error |
 * | production | Sentry message | Sentry warning | Sentry exception |
 *
 * **USAGE**:
 * ```typescript
 * import { logInfo, logWarn, logError } from '@/lib/logger'
 *
 * logInfo('User signed up', { email: user.email })
 * logWarn('Rate limit approached', { remaining: 2 })
 * logError('Payment failed', error, { orderId: '123' })
 * ```
 *
 * **AI ITERATION HINTS**:
 * - Adding sensitive field? Add to SENSITIVE_KEYS Set
 * - Never use console.log/error directly — use logger functions
 * - Context objects are sanitized automatically
 * - Error objects preserved for Sentry stack traces
 *
 * **SENTRY INTEGRATION**:
 * - Requires NEXT_PUBLIC_SENTRY_DSN env var
 * - Without DSN: falls back to console in all environments
 * - Errors captured with full context in Sentry dashboard
 *
 * **POTENTIAL IMPROVEMENTS**:
 * - [x] Add structured logging format (JSON) for log aggregation
 * - [x] Add request ID correlation
 * - [x] Add performance timing helpers
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Integrates with Sentry for production error tracking and monitoring.
 * Works on both server and client side.
 */

import * as Sentry from '@sentry/nextjs'

function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

function isTest(): boolean {
  return process.env.NODE_ENV === 'test'
}

type LogLevel = 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

/**
 * Structured log entry for JSON format logging.
 */
interface StructuredLogEntry {
  timestamp: string
  level: LogLevel
  message: string
  requestId?: string
  context?: LogContext
  error?: {
    name: string
    message: string
    stack?: string
  }
}

/**
 * Performance timing helper for measuring operation duration.
 */
export class PerformanceTimer {
  private startTime: number
  private label: string

  constructor(label: string) {
    this.label = label
    this.startTime = Date.now()
  }

  /**
   * End the timer and log the duration.
   * 
   * @param context - Additional context to log
   * @returns Duration in milliseconds
   */
  end(context?: LogContext): number {
    const duration = Date.now() - this.startTime
    logInfo(`${this.label} completed`, {
      duration_ms: duration,
      ...context,
    })
    return duration
  }

  /**
   * Get current elapsed time without ending the timer.
   * 
   * @returns Elapsed time in milliseconds
   */
  elapsed(): number {
    return Date.now() - this.startTime
  }
}

/**
 * Create a performance timer for measuring operation duration.
 * 
 * @param label - Label for the operation
 * @returns PerformanceTimer instance
 * 
 * @example
 * const timer = startTimer('Database query')
 * // ... do work ...
 * timer.end({ query: 'SELECT * FROM users' })
 */
export function startTimer(label: string): PerformanceTimer {
  return new PerformanceTimer(label)
}

/**
 * Global request ID for correlating logs within a request.
 * Set via setRequestId() at the start of a request.
 * 
 * **Note**: In serverless/concurrent environments, consider using AsyncLocalStorage
 * for proper request context isolation. This simple global approach works for
 * single-threaded Node.js but may have race conditions in edge runtimes.
 */
let currentRequestId: string | undefined

/**
 * Set the request ID for log correlation.
 * Should be called at the start of each request.
 * 
 * @param requestId - Unique identifier for the request
 */
export function setRequestId(requestId: string): void {
  currentRequestId = requestId
}

/**
 * Get the current request ID.
 * 
 * @returns Current request ID or undefined
 */
export function getRequestId(): string | undefined {
  return currentRequestId
}

/**
 * Clear the request ID (call at end of request).
 */
export function clearRequestId(): void {
  currentRequestId = undefined
}

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'authorization',
  'cookie',
  'api_key',
  'apikey',
  'secret',
])

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '_')
}

function isSensitiveKey(key: string): boolean {
  const normalized = normalizeKey(key)
  return SENSITIVE_KEYS.has(normalized)
}

function sanitizeValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    // WHY: keep explicit null/undefined values intact for accurate log context.
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item))
  }

  if (typeof value === 'object') {
    if (value instanceof Error || value instanceof Date || value instanceof RegExp) {
      return value
    }

    return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>(
      (acc, [key, entryValue]) => {
        acc[key] = isSensitiveKey(key) ? '[REDACTED]' : sanitizeValue(entryValue)
        return acc
      },
      {},
    )
  }

  return value
}

export function sanitizeLogContext(context?: LogContext): LogContext | undefined {
  if (!context) {
    return context
  }

  return sanitizeValue(context) as LogContext
}

/**
 * Format log entry as JSON string for structured logging.
 * 
 * @param level - Log level
 * @param message - Log message
 * @param error - Optional error object
 * @param context - Optional context data
 * @returns JSON string
 */
function formatStructuredLog(
  level: LogLevel,
  message: string,
  error?: Error | unknown,
  context?: LogContext
): string {
  const entry: StructuredLogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    requestId: currentRequestId,
    context: sanitizeLogContext(context),
  }

  if (error instanceof Error) {
    entry.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  } else if (error) {
    entry.error = {
      name: 'Error',
      message: String(error),
    }
  }

  return JSON.stringify(entry)
}

/**
 * Check if structured logging is enabled.
 * Enabled when STRUCTURED_LOGGING env var is set to 'true'.
 */
function isStructuredLoggingEnabled(): boolean {
  return process.env.STRUCTURED_LOGGING === 'true'
}

/**
 * Log with structured format (JSON).
 * 
 * @param level - Log level
 * @param message - Log message
 * @param error - Optional error object
 * @param context - Optional context data
 */
function logStructured(
  level: LogLevel,
  message: string,
  error?: Error | unknown,
  context?: LogContext
): void {
  const structuredLog = formatStructuredLog(level, message, error, context)
  
  // Use appropriate console method to preserve log level semantics
  // while maintaining JSON structure for log aggregation
  switch (level) {
    case 'info':
      console.info(structuredLog)
      break
    case 'warn':
      console.warn(structuredLog)
      break
    case 'error':
      console.error(structuredLog)
      break
  }
}

/**
 * Check if Sentry is properly configured and available
 */
function isSentryAvailable(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN)
}

/**
 * Log an informational message
 * In production, sends to Sentry
 * If STRUCTURED_LOGGING=true, outputs JSON format
 */
export function logInfo(message: string, context?: LogContext) {
  const sanitizedContext = sanitizeLogContext(context)
  
  if (isStructuredLoggingEnabled()) {
    logStructured('info', message, undefined, sanitizedContext)
    return
  }
  
  if (isDevelopment() || isTest()) {
    console.info('[INFO]', message, sanitizedContext || '')
  } else if (isSentryAvailable()) {
    Sentry.captureMessage(message, { level: 'info', extra: sanitizedContext })
  }
}

/**
 * Log a warning
 * In production, sends to Sentry
 * If STRUCTURED_LOGGING=true, outputs JSON format
 */
export function logWarn(message: string, context?: LogContext) {
  const sanitizedContext = sanitizeLogContext(context)
  
  if (isStructuredLoggingEnabled()) {
    logStructured('warn', message, undefined, sanitizedContext)
    return
  }
  
  if (isDevelopment() || isTest()) {
    console.warn('[WARN]', message, sanitizedContext || '')
  } else if (isSentryAvailable()) {
    Sentry.captureMessage(message, { level: 'warning', extra: sanitizedContext })
  }
}

/**
 * Log an error
 * In production, sends to Sentry with full error details
 * If STRUCTURED_LOGGING=true, outputs JSON format
 */
export function logError(message: string, error?: Error | unknown, context?: LogContext) {
  const sanitizedContext = sanitizeLogContext(context)
  const sanitizedError = error instanceof Error ? error : sanitizeValue(error)
  
  if (isStructuredLoggingEnabled()) {
    logStructured('error', message, error, sanitizedContext)
    return
  }
  
  if (isDevelopment() || isTest()) {
    console.error('[ERROR]', message, sanitizedError, sanitizedContext || '')
  } else if (isSentryAvailable()) {
    if (error instanceof Error) {
      Sentry.captureException(error, { extra: { message, ...sanitizedContext } })
    } else {
      Sentry.captureMessage(message, {
        level: 'error',
        extra: { error: sanitizeValue(error), ...sanitizedContext },
      })
    }
  } else {
    console.error('[ERROR]', message, sanitizedError, sanitizedContext || '')
  }
}

/**
 * Generic log function
 */
export function log(level: LogLevel, message: string, context?: LogContext) {
  switch (level) {
    case 'info':
      logInfo(message, context)
      break
    case 'warn':
      logWarn(message, context)
      break
    case 'error':
      logError(message, undefined, context)
      break
  }
}
