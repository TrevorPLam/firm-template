// AI-META-BEGIN
// 
// AI-META: Utility functions and helpers
// OWNERSHIP: packages/utils (shared utilities)
// ENTRYPOINTS: Imported by application code
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Add functions: safe. Modify existing: check all call sites first
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

import { describe, it, expect } from 'vitest'
import { cn } from './index'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', true && 'block')).toBe('base block')
  })

  it('resolves Tailwind conflicts (last wins)', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2')
  })
})
