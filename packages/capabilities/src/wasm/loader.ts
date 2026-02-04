/**
 * WebAssembly module loader with lazy loading support
 */

import type {
  WasmModule,
  WasmLoaderOptions,
  WasmLoadResult,
  WasmError,
  RetryConfig,
} from './types'

/**
 * Cache for loaded WASM modules
 */
const moduleCache = new Map<string, WasmLoadResult>()

/**
 * Load a WebAssembly module with retry logic
 */
export async function loadWasmModule(
  options: WasmLoaderOptions
): Promise<WasmLoadResult> {
  const { url, imports = {}, streaming = true, timeout = 30000, retry } = options

  // Check cache first
  const cacheKey = url
  const cached = moduleCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const startTime = performance.now()

  try {
    const result = await loadWithRetry(
      async () => {
        if (streaming && typeof WebAssembly.instantiateStreaming === 'function') {
          return await loadStreamingModule(url, imports, timeout)
        }
        return await loadBufferModule(url, imports, timeout)
      },
      retry ?? { maxAttempts: 3, delay: 1000, backoff: 2 }
    )

    const loadTime = performance.now() - startTime
    const loadResult: WasmLoadResult = {
      ...result,
      loadTime,
    }

    // Cache the result
    moduleCache.set(cacheKey, loadResult)

    return loadResult
  } catch (error) {
    throw createWasmError('LoadError', `Failed to load WASM module from ${url}`, error)
  }
}

/**
 * Load WASM module using streaming compilation
 */
async function loadStreamingModule(
  url: string,
  imports: WebAssembly.Imports,
  timeout: number
): Promise<Omit<WasmLoadResult, 'loadTime'>> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { signal: controller.signal })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await WebAssembly.instantiateStreaming(response, imports)
    
    return {
      instance: result.instance,
      module: result.module,
      loadTime: 0, // Will be set by caller
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Load WASM module from buffer
 */
async function loadBufferModule(
  url: string,
  imports: WebAssembly.Imports,
  timeout: number
): Promise<Omit<WasmLoadResult, 'loadTime'>> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { signal: controller.signal })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const buffer = await response.arrayBuffer()
    const result = await WebAssembly.instantiate(buffer, imports)
    
    return {
      instance: result.instance,
      module: result.module,
      loadTime: 0,
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Retry logic wrapper
 */
async function loadWithRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig
): Promise<T> {
  let lastError: Error | undefined
  let delay = config.delay

  for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (attempt < config.maxAttempts - 1) {
        await sleep(delay)
        if (config.backoff) {
          delay *= config.backoff
        }
      }
    }
  }

  throw lastError ?? new Error('Unknown error during retry')
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Create a typed WASM error
 */
function createWasmError(
  type: WasmError['type'],
  message: string,
  cause?: unknown
): WasmError {
  const WasmError = class extends Error {
    type: string
    cause?: Error

    constructor(type: string, message: string, cause?: unknown) {
      super(message)
      this.name = 'WasmError'
      this.type = type
      if (cause instanceof Error) {
        this.cause = cause
      }
    }
  }

  return new WasmError(type, message, cause) as WasmError
}

/**
 * Preload a WASM module for faster initialization
 */
export async function preloadWasmModule(url: string): Promise<void> {
  try {
    await loadWasmModule({ url })
  } catch (error) {
    console.warn(`Failed to preload WASM module from ${url}:`, error)
  }
}

/**
 * Clear the module cache
 */
export function clearModuleCache(): void {
  moduleCache.clear()
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; urls: string[] } {
  return {
    size: moduleCache.size,
    urls: Array.from(moduleCache.keys()),
  }
}

/**
 * Lazy WASM module loader
 */
export class LazyWasmModule implements WasmModule {
  name: string
  version: string
  loaded = false
  memory?: WebAssembly.Memory
  exports?: WebAssembly.Exports

  private loadPromise?: Promise<void>
  private instance?: WebAssembly.Instance

  constructor(
    name: string,
    version: string,
    private options: WasmLoaderOptions
  ) {
    this.name = name
    this.version = version
  }

  /**
   * Ensure the module is loaded
   */
  async ensureLoaded(): Promise<void> {
    if (this.loaded) {
      return
    }

    if (!this.loadPromise) {
      this.loadPromise = this.load()
    }

    return this.loadPromise
  }

  /**
   * Load the module
   */
  private async load(): Promise<void> {
    try {
      const result = await loadWasmModule(this.options)
      this.instance = result.instance
      this.exports = result.instance.exports
      this.memory = result.instance.exports.memory as WebAssembly.Memory | undefined
      this.loaded = true
    } catch (error) {
      this.loadPromise = undefined
      throw error
    }
  }

  /**
   * Get an exported function
   */
  getFunction<T extends (...args: any[]) => any>(name: string): T {
    if (!this.loaded || !this.exports) {
      throw new Error(`Module ${this.name} not loaded`)
    }

    const fn = this.exports[name]
    if (typeof fn !== 'function') {
      throw new Error(`Function ${name} not found in module ${this.name}`)
    }

    return fn as T
  }

  /**
   * Unload the module
   */
  unload(): void {
    this.loaded = false
    this.instance = undefined
    this.exports = undefined
    this.memory = undefined
    this.loadPromise = undefined
  }
}
