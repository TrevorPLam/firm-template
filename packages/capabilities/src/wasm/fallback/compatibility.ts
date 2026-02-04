/**
 * Browser compatibility detection and JavaScript fallbacks
 */

import type { CompatibilityInfo, FallbackStrategy } from '../types'

/**
 * Detect WebAssembly and feature support
 */
export function detectWasmSupport(): CompatibilityInfo {
  const info: CompatibilityInfo = {
    wasmSupported: false,
    streamingSupported: false,
    simdSupported: false,
    threadsSupported: false,
    memory64Supported: false,
  }

  // Check basic WebAssembly support
  if (typeof WebAssembly === 'undefined') {
    return info
  }

  info.wasmSupported = true

  // Check streaming compilation
  info.streamingSupported = typeof WebAssembly.instantiateStreaming === 'function'

  // Check SIMD support
  try {
    const simdTest = new Uint8Array([
      0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65,
      0, 253, 15, 253, 98, 11,
    ])
    info.simdSupported = WebAssembly.validate(simdTest)
  } catch {
    info.simdSupported = false
  }

  // Check threads support
  info.threadsSupported =
    typeof SharedArrayBuffer !== 'undefined' &&
    typeof Atomics !== 'undefined' &&
    // Check if cross-origin isolation is enabled
    typeof crossOriginIsolated !== 'undefined' &&
    crossOriginIsolated

  // Detect browser
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  info.browser = detectBrowser(userAgent)
  info.version = detectBrowserVersion(userAgent)

  return info
}

/**
 * Detect browser from user agent
 */
function detectBrowser(userAgent: string): string {
  if (userAgent.includes('Firefox')) return 'firefox'
  if (userAgent.includes('Chrome')) return 'chrome'
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'safari'
  if (userAgent.includes('Edge')) return 'edge'
  if (userAgent.includes('Opera')) return 'opera'
  return 'unknown'
}

/**
 * Detect browser version
 */
function detectBrowserVersion(userAgent: string): string {
  const match =
    userAgent.match(/(?:Firefox|Chrome|Safari|Edge|Opera)[/\s](\d+)/) ?? []
  return match[1] ?? 'unknown'
}

/**
 * Check if WASM should be used based on compatibility and strategy
 */
export function shouldUseWasm(
  compatibility: CompatibilityInfo,
  strategy: FallbackStrategy = 'auto'
): boolean {
  switch (strategy) {
    case 'always-wasm':
      if (!compatibility.wasmSupported) {
        throw new Error('WebAssembly not supported but always-wasm strategy selected')
      }
      return true

    case 'always-js':
      return false

    case 'prefer-wasm':
      return compatibility.wasmSupported

    case 'auto':
    default:
      // Auto mode uses WASM if supported and browser is known to work well
      return (
        compatibility.wasmSupported &&
        isWellSupportedBrowser(compatibility.browser ?? '', compatibility.version ?? '')
      )
  }
}

/**
 * Check if browser has good WASM support
 */
function isWellSupportedBrowser(browser: string, version: string): boolean {
  const versionNum = parseInt(version, 10)

  if (isNaN(versionNum)) {
    return false
  }

  // Minimum versions with good WASM support
  const minimumVersions: Record<string, number> = {
    chrome: 69,
    firefox: 62,
    safari: 14,
    edge: 79,
    opera: 56,
  }

  const minVersion = minimumVersions[browser]
  return minVersion !== undefined && versionNum >= minVersion
}

/**
 * Get a human-readable compatibility report
 */
export function getCompatibilityReport(info: CompatibilityInfo): string {
  const lines: string[] = ['WebAssembly Compatibility Report:', '']

  lines.push(`Browser: ${info.browser ?? 'unknown'} ${info.version ?? ''}`)
  lines.push(`WebAssembly: ${info.wasmSupported ? '✓' : '✗'}`)
  lines.push(`Streaming: ${info.streamingSupported ? '✓' : '✗'}`)
  lines.push(`SIMD: ${info.simdSupported ? '✓' : '✗'}`)
  lines.push(`Threads: ${info.threadsSupported ? '✓' : '✗'}`)
  lines.push(`Memory64: ${info.memory64Supported ? '✓' : '✗'}`)

  return lines.join('\n')
}

/**
 * Global compatibility info (cached)
 */
let cachedCompatibility: CompatibilityInfo | undefined

/**
 * Get cached compatibility info
 */
export function getCompatibility(): CompatibilityInfo {
  if (!cachedCompatibility) {
    cachedCompatibility = detectWasmSupport()
  }
  return cachedCompatibility
}

/**
 * Feature flags based on compatibility
 */
export interface FeatureFlags {
  /** Can use WASM */
  canUseWasm: boolean
  /** Can use streaming compilation */
  canUseStreaming: boolean
  /** Can use SIMD instructions */
  canUseSIMD: boolean
  /** Can use threads */
  canUseThreads: boolean
  /** Recommended implementation */
  recommendedImpl: 'wasm' | 'js'
}

/**
 * Get feature flags for current environment
 */
export function getFeatureFlags(strategy: FallbackStrategy = 'auto'): FeatureFlags {
  const compat = getCompatibility()
  const useWasm = shouldUseWasm(compat, strategy)

  return {
    canUseWasm: compat.wasmSupported,
    canUseStreaming: compat.streamingSupported,
    canUseSIMD: compat.simdSupported,
    canUseThreads: compat.threadsSupported,
    recommendedImpl: useWasm ? 'wasm' : 'js',
  }
}

/**
 * Polyfill for missing features
 */
export function setupPolyfills(): void {
  // Add TextEncoder/TextDecoder polyfill for older browsers
  if (typeof TextEncoder === 'undefined') {
    console.warn('TextEncoder not available, WASM text operations may fail')
  }

  // Add performance.now polyfill
  if (typeof performance === 'undefined') {
    ;(globalThis as any).performance = {
      now: () => Date.now(),
    }
  }
}
