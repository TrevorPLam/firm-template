// AI-META-BEGIN
// 
// AI-META: Utility functions and helpers
// OWNERSHIP: apps/your-dedicated-marketer
// ENTRYPOINTS: Imported by application code
// DEPENDENCIES: Standard library only
// DANGER: Environment variable access - validate all values
// CHANGE-SAFETY: Add functions: safe. Modify existing: check all call sites first
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

import * as Sentry from '@sentry/nextjs'

export type SpanAttributeValue = string | number | boolean
export type SpanAttributes = Record<string, SpanAttributeValue | undefined>

type SpanOptions = {
  name: string
  op?: string
  attributes?: SpanAttributes
}

function isSentryTracingEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN) && typeof Sentry.startSpan === 'function'
}

export async function withServerSpan<T>(
  options: SpanOptions,
  callback: () => Promise<T>,
): Promise<T> {
  if (!isSentryTracingEnabled()) {
    return callback()
  }

  return Sentry.startSpan(
    {
      name: options.name,
      op: options.op,
      attributes: options.attributes,
    },
    async () => callback(),
  )
}
