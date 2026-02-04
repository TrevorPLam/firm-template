// AI-META-BEGIN
// 
// AI-META: Package entry point and public API exports
// OWNERSHIP: packages/capabilities
// ENTRYPOINTS: Package entry point, imported by consumers
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

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
