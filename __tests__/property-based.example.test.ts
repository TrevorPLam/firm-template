/**
 * Property-Based Testing Examples
 * 
 * Property-based testing generates thousands of random inputs to test properties
 * of your code. It finds edge cases that manual tests miss.
 * 
 * Learn more: https://github.com/dubzzz/fast-check
 */

import * as fc from 'fast-check'
import { describe, it } from 'vitest'

/**
 * Example 1: Testing a sorting function
 * 
 * Property: After sorting, the array should be in ascending order
 */
describe('Property-Based Testing Examples', () => {
  it('property: array sort maintains length', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const sorted = [...arr].sort((a, b) => a - b)
        return sorted.length === arr.length
      })
    )
  })

  it('property: array sort is idempotent', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const sortedOnce = [...arr].sort((a, b) => a - b)
        const sortedTwice = [...sortedOnce].sort((a, b) => a - b)
        return JSON.stringify(sortedOnce) === JSON.stringify(sortedTwice)
      })
    )
  })

  it('property: array sort maintains elements', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const sorted = [...arr].sort((a, b) => a - b)
        const originalSet = new Set(arr)
        const sortedSet = new Set(sorted)
        return originalSet.size === sortedSet.size &&
               [...originalSet].every(x => sortedSet.has(x))
      })
    )
  })

  /**
   * Example 2: Testing string operations
   * 
   * Property: Reversing a string twice returns the original
   */
  it('property: string reverse is involutive', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        const reversed = str.split('').reverse().join('')
        const doubleReversed = reversed.split('').reverse().join('')
        return doubleReversed === str
      })
    )
  })

  /**
   * Example 3: Testing mathematical operations
   * 
   * Property: Addition is commutative
   */
  it('property: addition is commutative', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        return a + b === b + a
      })
    )
  })

  /**
   * Example 4: Testing with custom generators
   * 
   * Property: Email validation
   */
  it('property: valid email format', () => {
    const emailGenerator = fc.string({ minLength: 1, maxLength: 50 })
      .filter(s => !s.includes(' '))
      .chain(local => 
        fc.string({ minLength: 1, maxLength: 50 })
          .filter(s => !s.includes(' ') && !s.includes('@'))
          .map(domain => `${local}@${domain}.com`)
      )

    fc.assert(
      fc.property(emailGenerator, (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
      })
    )
  })

  /**
   * Example 5: Testing with shrinking
   * 
   * When a property fails, fast-check will "shrink" the input to find
   * the minimal failing case.
   */
  it('property: division by zero should be caught', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer().filter(n => n !== 0), (a, b) => {
        const result = a / b
        return isFinite(result)
      })
    )
  })
})
