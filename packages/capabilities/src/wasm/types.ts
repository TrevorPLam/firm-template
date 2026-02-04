// AI-META-BEGIN
// 
// AI-META: Shared package module
// OWNERSHIP: packages/capabilities
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

/**
 * Type definitions for WebAssembly integration
 */

/**
 * Base WASM module interface
 */
export interface WasmModule {
  /** Module name/identifier */
  name: string
  /** Module version */
  version: string
  /** Whether module is loaded */
  loaded: boolean
  /** Memory instance */
  memory?: WebAssembly.Memory
  /** Exported functions */
  exports?: WebAssembly.Exports
}

/**
 * WASM loader options
 */
export interface WasmLoaderOptions {
  /** Module URL or path */
  url: string
  /** Import object for WASM instantiation */
  imports?: WebAssembly.Imports
  /** Whether to use streaming compilation */
  streaming?: boolean
  /** Memory configuration */
  memory?: WasmMemoryConfig
  /** Timeout for loading (ms) */
  timeout?: number
  /** Retry configuration */
  retry?: RetryConfig
}

/**
 * WASM memory configuration
 */
export interface WasmMemoryConfig {
  /** Initial memory pages (64KB each) */
  initial: number
  /** Maximum memory pages */
  maximum?: number
  /** Whether memory can be shared */
  shared?: boolean
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  /** Number of retry attempts */
  maxAttempts: number
  /** Delay between retries (ms) */
  delay: number
  /** Exponential backoff multiplier */
  backoff?: number
}

/**
 * WASM load result
 */
export interface WasmLoadResult {
  /** WASM instance */
  instance: WebAssembly.Instance
  /** WASM module */
  module: WebAssembly.Module
  /** Load time in milliseconds */
  loadTime: number
}

/**
 * Browser compatibility info
 */
export interface CompatibilityInfo {
  /** WebAssembly supported */
  wasmSupported: boolean
  /** Streaming compilation supported */
  streamingSupported: boolean
  /** SIMD supported */
  simdSupported: boolean
  /** Threads supported */
  threadsSupported: boolean
  /** Memory64 supported */
  memory64Supported: boolean
  /** Browser name */
  browser?: string
  /** Browser version */
  version?: string
}

/**
 * Image processing options
 */
export interface ImageProcessingOptions {
  /** Image quality (0-100) */
  quality?: number
  /** Compression level (0-9) */
  compression?: number
  /** Image format */
  format?: 'jpeg' | 'png' | 'webp' | 'avif'
  /** Preserve metadata */
  preserveMetadata?: boolean
}

/**
 * Image resize options
 */
export interface ImageResizeOptions extends ImageProcessingOptions {
  /** Target width */
  width?: number
  /** Target height */
  height?: number
  /** Resize mode */
  mode?: 'contain' | 'cover' | 'fill' | 'scale-down'
  /** Maintain aspect ratio */
  aspectRatio?: boolean
}

/**
 * Image filter type
 */
export type ImageFilter =
  | 'grayscale'
  | 'sepia'
  | 'blur'
  | 'sharpen'
  | 'brightness'
  | 'contrast'
  | 'invert'
  | 'saturate'

/**
 * Image filter options
 */
export interface ImageFilterOptions {
  /** Filter type */
  filter: ImageFilter
  /** Filter intensity (0-100) */
  intensity?: number
}

/**
 * Image data structure
 */
export interface ImageData {
  /** Image width */
  width: number
  /** Image height */
  height: number
  /** Pixel data buffer */
  data: Uint8ClampedArray
  /** Color space */
  colorSpace?: 'srgb' | 'display-p3'
}

/**
 * Mathematical calculation types
 */
export type CalculationType =
  | 'matrix-multiply'
  | 'fft'
  | 'convolution'
  | 'linear-regression'
  | 'pca'
  | 'clustering'

/**
 * Matrix data structure
 */
export interface Matrix {
  /** Number of rows */
  rows: number
  /** Number of columns */
  cols: number
  /** Matrix data (row-major order) */
  data: Float64Array
}

/**
 * Vector data structure
 */
export interface Vector {
  /** Vector length */
  length: number
  /** Vector data */
  data: Float64Array
}

/**
 * FFT options
 */
export interface FFTOptions {
  /** Use inverse FFT */
  inverse?: boolean
  /** Normalize output */
  normalize?: boolean
}

/**
 * Regression result
 */
export interface RegressionResult {
  /** Coefficients */
  coefficients: Float64Array
  /** R-squared value */
  rSquared: number
  /** Residuals */
  residuals?: Float64Array
}

/**
 * Clustering result
 */
export interface ClusteringResult {
  /** Cluster assignments */
  assignments: Int32Array
  /** Cluster centroids */
  centroids: Matrix
  /** Inertia (sum of squared distances) */
  inertia: number
}

/**
 * Performance benchmark result
 */
export interface BenchmarkResult {
  /** Operation name */
  operation: string
  /** Implementation type */
  implementation: 'wasm' | 'js'
  /** Average execution time (ms) */
  avgTime: number
  /** Minimum execution time (ms) */
  minTime: number
  /** Maximum execution time (ms) */
  maxTime: number
  /** Standard deviation */
  stdDev: number
  /** Operations per second */
  opsPerSecond: number
  /** Sample size */
  samples: number
}

/**
 * Benchmark options
 */
export interface BenchmarkOptions {
  /** Number of iterations */
  iterations?: number
  /** Warmup iterations */
  warmup?: number
  /** Test data size */
  dataSize?: number
  /** Compare with JavaScript implementation */
  compareWithJS?: boolean
}

/**
 * Performance comparison
 */
export interface PerformanceComparison {
  /** WASM result */
  wasm: BenchmarkResult
  /** JavaScript result */
  js: BenchmarkResult
  /** Speedup factor (wasm vs js) */
  speedup: number
  /** Performance improvement percentage */
  improvement: number
}

/**
 * Error types
 */
export type WasmErrorType =
  | 'LoadError'
  | 'CompilationError'
  | 'InstantiationError'
  | 'RuntimeError'
  | 'MemoryError'
  | 'TimeoutError'
  | 'UnsupportedError'

/**
 * WASM error
 */
export class WasmError extends Error {
  constructor(
    public type: WasmErrorType,
    message: string,
    public cause?: Error
  ) {
    super(message)
    this.name = 'WasmError'
  }
}

/**
 * Fallback strategy
 */
export type FallbackStrategy = 'auto' | 'always-wasm' | 'always-js' | 'prefer-wasm'

/**
 * Module execution options
 */
export interface ExecutionOptions {
  /** Fallback strategy */
  fallback?: FallbackStrategy
  /** Timeout for operation (ms) */
  timeout?: number
  /** Use worker thread */
  useWorker?: boolean
  /** Abort signal */
  signal?: AbortSignal
}
