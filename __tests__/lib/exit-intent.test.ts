import { describe, expect, it } from 'vitest'
import {
  readExitIntentState,
  shouldShowExitIntent,
  writeExitIntentState,
} from '@/lib/exit-intent'

describe('exit-intent helpers', () => {
  it('test_happy_allows_first_view_when_no_history', () => {
    // Happy path: first-time visitors should be eligible immediately.
    const shouldShow = shouldShowExitIntent({ now: 1000, cooldownMs: 0 })
    expect(shouldShow).toBe(true)
  })

  it('test_edge_blocks_when_within_cooldown', () => {
    // Edge case: a recent display should suppress the popup.
    const shouldShow = shouldShowExitIntent({
      now: 2000,
      lastShownAt: 1500,
      cooldownMs: 1000,
    })

    expect(shouldShow).toBe(false)
  })

  it('test_error_returns_safe_defaults_when_storage_throws', () => {
    // Error case: storage access can throw in privacy modes, so helpers should fail soft.
    const throwingStorage = {
      getItem: () => {
        throw new Error('storage blocked')
      },
      setItem: () => {
        throw new Error('storage blocked')
      },
      removeItem: () => null,
      clear: () => null,
      key: () => null,
      length: 0,
    } as unknown as Storage

    expect(readExitIntentState(throwingStorage, 'key')).toEqual({})
    expect(writeExitIntentState(throwingStorage, 'key', { lastShownAt: 1 })).toBe(false)
  })
})
