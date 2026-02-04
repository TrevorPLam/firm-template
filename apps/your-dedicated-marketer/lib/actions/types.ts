// AI-META-BEGIN
// 
// AI-META: Utility functions and helpers
// OWNERSHIP: apps/your-dedicated-marketer
// ENTRYPOINTS: Imported by application code
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Add functions: safe. Modify existing: check all call sites first
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

/**
 * Shared types and interfaces for contact form actions.
 *
 * @module lib/actions/types
 */

import type { SpanAttributes } from '../sentry-server'

export type SanitizedContactData = {
  safeEmail: string
  safeName: string
  safePhone: string
  safeMessage: string
  emailHash: string
  hashedIp: string
  contactSpanAttributes: SpanAttributes
}
