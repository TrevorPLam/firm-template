/**
 * Main exports for WebAssembly integration
 */

// Types
export type {
  WasmModule,
  WasmLoaderOptions,
  WasmLoadResult,
  WasmMemoryConfig,
  RetryConfig,
  CompatibilityInfo,
  ImageProcessingOptions,
  ImageResizeOptions,
  ImageFilterOptions,
  ImageFilter,
  ImageData,
  Matrix,
  Vector,
  FFTOptions,
  RegressionResult,
  ClusteringResult,
  BenchmarkResult,
  BenchmarkOptions,
  PerformanceComparison,
  FallbackStrategy,
  ExecutionOptions,
  CalculationType,
} from './types'

export { WasmError } from './types'

// Loader
export {
  loadWasmModule,
  preloadWasmModule,
  clearModuleCache,
  getCacheStats,
  LazyWasmModule,
} from './loader'

// Compatibility
export {
  detectWasmSupport,
  shouldUseWasm,
  getCompatibility,
  getCompatibilityReport,
  getFeatureFlags,
  setupPolyfills,
} from './fallback/compatibility'

export type { FeatureFlags } from './fallback/compatibility'

// Image Processing
export {
  createImageProcessor,
  getImageProcessor,
  resizeImage,
  compressImage,
  applyImageFilter,
} from './modules/image-processing'

// Calculations
export {
  createCalculator,
  getCalculator,
  matrixMultiply,
  fft,
  linearRegression,
  kmeansClustering,
} from './modules/calculations'

// Benchmarks
export {
  benchmarkImageResize,
  benchmarkImageFilter,
  benchmarkMatrixMultiply,
  benchmarkFFT,
  runBenchmarkSuite,
  formatBenchmarkResults,
  compareImplementations,
} from './benchmarks/performance'

// Config
export { getWasmConfig, validateWasmConfig, type WasmConfig, type WasmConfigIssue } from './config'
