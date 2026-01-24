import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { 
  logInfo, 
  logWarn, 
  logError, 
  sanitizeLogContext,
  startTimer,
  setRequestId,
  getRequestId,
  clearRequestId,
} from '@/lib/logger'

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureMessage: vi.fn(),
  captureException: vi.fn(),
}))

describe('Logger', () => {
  let consoleInfoSpy: ReturnType<typeof vi.spyOn>
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let consoleLogSpy: ReturnType<typeof vi.spyOn>
  let originalNodeEnv: string | undefined
  let originalSentryDSN: string | undefined
  let originalStructuredLogging: string | undefined

  beforeEach(() => {
    // Save original env vars
    originalNodeEnv = process.env.NODE_ENV
    originalSentryDSN = process.env.NEXT_PUBLIC_SENTRY_DSN
    originalStructuredLogging = process.env.STRUCTURED_LOGGING

    // Clear request ID
    clearRequestId()

    // Create console spies
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore env vars
    process.env.NODE_ENV = originalNodeEnv
    if (originalSentryDSN === undefined) {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN
    } else {
      process.env.NEXT_PUBLIC_SENTRY_DSN = originalSentryDSN
    }
    if (originalStructuredLogging === undefined) {
      delete process.env.STRUCTURED_LOGGING
    } else {
      process.env.STRUCTURED_LOGGING = originalStructuredLogging
    }

    // Restore console methods
    consoleInfoSpy.mockRestore()
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
    consoleLogSpy.mockRestore()
  })

  describe('logInfo', () => {
    it('should log info message in development', () => {
      process.env.NODE_ENV = 'development'

      logInfo('Test info message')

      expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO]', 'Test info message', '')
    })

    it('should log info with context in development', () => {
      process.env.NODE_ENV = 'development'

      logInfo('Test info message', { userId: '123' })

      expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO]', 'Test info message', { userId: '123' })
    })

    it('should not log in production', () => {
      process.env.NODE_ENV = 'production'

      logInfo('Test info message')

      expect(consoleInfoSpy).not.toHaveBeenCalled()
    })
  })

  describe('logWarn', () => {
    it('should log warning message in development', () => {
      process.env.NODE_ENV = 'development'

      logWarn('Test warning message')

      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN]', 'Test warning message', '')
    })

    it('should log warning with context in development', () => {
      process.env.NODE_ENV = 'development'

      logWarn('Test warning message', { code: 'WARN_001' })

      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN]', 'Test warning message', {
        code: 'WARN_001',
      })
    })

    it('should not log in production', () => {
      process.env.NODE_ENV = 'production'

      logWarn('Test warning message')

      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })
  })

  describe('logError', () => {
    it('should log error message in development', () => {
      process.env.NODE_ENV = 'development'

      logError('Test error message')

      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', 'Test error message', undefined, '')
    })

    it('should log error with Error object in development', () => {
      process.env.NODE_ENV = 'development'
      const error = new Error('Test error')

      logError('Test error message', error)

      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', 'Test error message', error, '')
    })

    it('should log error with context in development', () => {
      process.env.NODE_ENV = 'development'
      const error = new Error('Test error')

      logError('Test error message', error, { userId: '123' })

      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', 'Test error message', error, {
        userId: '123',
      })
    })

    it('should not log in production', () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://mock@sentry.io/123'

      logError('Test error message')

      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })
  })

  describe('Edge cases', () => {
    it('should handle undefined context gracefully', () => {
      process.env.NODE_ENV = 'development'

      expect(() => {
        logInfo('Test', undefined)
        logWarn('Test', undefined)
        logError('Test', undefined, undefined)
      }).not.toThrow()
    })

    it('should handle empty strings', () => {
      process.env.NODE_ENV = 'development'

      expect(() => {
        logInfo('')
        logWarn('')
        logError('')
      }).not.toThrow()
    })

    it('should handle special characters in messages', () => {
      process.env.NODE_ENV = 'development'

      const specialMessage = 'Test <script>alert("xss")</script> message'

      logInfo(specialMessage)
      expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO]', specialMessage, '')
    })
  })

  describe('sanitizeLogContext', () => {
    it('should redact sensitive fields', () => {
      const result = sanitizeLogContext({
        password: 'supersecret',
        token: 'token-value',
        authorization: 'Bearer 123',
        cookie: 'session=abc',
        api_key: 'key-value',
        secret: 'shh',
        safe: 'value',
      })

      expect(result).toEqual({
        password: '[REDACTED]',
        token: '[REDACTED]',
        authorization: '[REDACTED]',
        cookie: '[REDACTED]',
        api_key: '[REDACTED]',
        secret: '[REDACTED]',
        safe: 'value',
      })
    })

    it('should redact nested sensitive fields', () => {
      const result = sanitizeLogContext({
        user: {
          name: 'Jane',
          apiKey: 'should-redact',
          meta: {
            token: 'nested-token',
          },
        },
        items: [{ password: 'nested-pass' }],
      })

      expect(result).toEqual({
        user: {
          name: 'Jane',
          apiKey: '[REDACTED]',
          meta: {
            token: '[REDACTED]',
          },
        },
        items: [{ password: '[REDACTED]' }],
      })
    })

    it('should preserve null and undefined values', () => {
      const result = sanitizeLogContext({
        optional: null,
        nested: {
          value: undefined,
        },
      })

      expect(result).toEqual({
        optional: null,
        nested: {
          value: undefined,
        },
      })
    })
  })

  describe('Structured logging', () => {
    it('should output JSON format when STRUCTURED_LOGGING=true', () => {
      process.env.NODE_ENV = 'development'
      process.env.STRUCTURED_LOGGING = 'true'

      logInfo('Test message', { key: 'value' })

      expect(consoleLogSpy).toHaveBeenCalled()
      const logCall = consoleLogSpy.mock.calls[0][0]
      const parsed = JSON.parse(logCall as string)
      
      expect(parsed).toMatchObject({
        level: 'info',
        message: 'Test message',
        context: { key: 'value' },
      })
      expect(parsed.timestamp).toBeDefined()
    })

    it('should include request ID in structured logs', () => {
      process.env.NODE_ENV = 'development'
      process.env.STRUCTURED_LOGGING = 'true'
      setRequestId('req-123')

      logInfo('Test message')

      const logCall = consoleLogSpy.mock.calls[0][0]
      const parsed = JSON.parse(logCall as string)
      
      expect(parsed.requestId).toBe('req-123')
    })

    it('should include error details in structured logs', () => {
      process.env.NODE_ENV = 'development'
      process.env.STRUCTURED_LOGGING = 'true'
      const error = new Error('Test error')

      logError('Error occurred', error)

      const logCall = consoleLogSpy.mock.calls[0][0]
      const parsed = JSON.parse(logCall as string)
      
      expect(parsed.error).toMatchObject({
        name: 'Error',
        message: 'Test error',
      })
      expect(parsed.error.stack).toBeDefined()
    })
  })

  describe('Request ID correlation', () => {
    it('should set and get request ID', () => {
      setRequestId('req-456')
      expect(getRequestId()).toBe('req-456')
    })

    it('should clear request ID', () => {
      setRequestId('req-789')
      clearRequestId()
      expect(getRequestId()).toBeUndefined()
    })
  })

  describe('Performance timing', () => {
    it('should measure elapsed time', async () => {
      const timer = startTimer('Test operation')
      await new Promise(resolve => setTimeout(resolve, 10))
      const elapsed = timer.elapsed()
      
      expect(elapsed).toBeGreaterThanOrEqual(10)
    })

    it('should log duration when timer ends', async () => {
      process.env.NODE_ENV = 'development'
      const timer = startTimer('Test operation')
      await new Promise(resolve => setTimeout(resolve, 10))
      const duration = timer.end({ userId: '123' })
      
      expect(duration).toBeGreaterThanOrEqual(10)
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '[INFO]',
        'Test operation completed',
        expect.objectContaining({
          duration_ms: expect.any(Number),
          userId: '123',
        })
      )
    })
  })
})
