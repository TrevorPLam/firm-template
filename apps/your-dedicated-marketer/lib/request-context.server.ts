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

import { AsyncLocalStorage } from 'node:async_hooks'

interface RequestContext {
  requestId?: string
}

const requestContextStore = new AsyncLocalStorage<RequestContext>()

export function runWithRequestId<T>(requestId: string | undefined, fn: () => T): T {
  if (!requestId) {
    return fn()
  }

  return requestContextStore.run({ requestId }, fn)
}

export function getRequestId(): string | undefined {
  return requestContextStore.getStore()?.requestId
}
