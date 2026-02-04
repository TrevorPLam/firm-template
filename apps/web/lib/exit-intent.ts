// AI-META-BEGIN
// 
// AI-META: Utility functions and helpers
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Imported by application code
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Add functions: safe. Modify existing: check all call sites first
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

export type ExitIntentFrequency = 'session' | 'day' | 'week'

export interface ExitIntentState {
  lastShownAt?: number
}

export const DEFAULT_EXIT_INTENT_STORAGE_KEY = 'firm-template:exit-intent'

const DAY_IN_MS = 24 * 60 * 60 * 1000

export const exitIntentCooldownMs = (frequency: ExitIntentFrequency): number => {
  if (frequency === 'day') {
    return DAY_IN_MS
  }

  if (frequency === 'week') {
    return 7 * DAY_IN_MS
  }

  // For session frequency, we rely on sessionStorage and effectively block re-shows.
  return Number.MAX_SAFE_INTEGER
}

export const getExitIntentStorage = (
  frequency: ExitIntentFrequency
): Storage | null => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return frequency === 'session' ? window.sessionStorage : window.localStorage
  } catch (error) {
    // Storage can throw in private mode or when blocked, so treat it as unavailable.
    return null
  }
}

export const readExitIntentState = (
  storage: Storage | null,
  storageKey: string
): ExitIntentState => {
  if (!storage) {
    return {}
  }

  try {
    const raw = storage.getItem(storageKey)
    if (!raw) {
      return {}
    }

    const parsed = JSON.parse(raw) as ExitIntentState
    return typeof parsed.lastShownAt === 'number' ? parsed : {}
  } catch (error) {
    // Corrupt JSON or storage access shouldn't block the UI; just reset state.
    return {}
  }
}

export const writeExitIntentState = (
  storage: Storage | null,
  storageKey: string,
  state: ExitIntentState
): boolean => {
  if (!storage) {
    return false
  }

  try {
    storage.setItem(storageKey, JSON.stringify(state))
    return true
  } catch (error) {
    // Storage quota or privacy modes can fail; treat as non-fatal.
    return false
  }
}

export const shouldShowExitIntent = ({
  now,
  lastShownAt,
  cooldownMs,
}: {
  now: number
  lastShownAt?: number
  cooldownMs: number
}): boolean => {
  if (!lastShownAt) {
    return true
  }

  return now - lastShownAt >= cooldownMs
}

export const isTouchDevice = ({
  windowRef,
  navigatorRef,
}: {
  windowRef?: Window | null
  navigatorRef?: Navigator | null
} = {}): boolean => {
  const safeWindow = windowRef ?? (typeof window === 'undefined' ? null : window)
  const safeNavigator =
    navigatorRef ?? (typeof navigator === 'undefined' ? null : navigator)

  if (!safeWindow || !safeNavigator) {
    return false
  }

  // Touch heuristics are imperfect, but they avoid exit-intent on mobile where it feels intrusive.
  return 'ontouchstart' in safeWindow || safeNavigator.maxTouchPoints > 0
}
