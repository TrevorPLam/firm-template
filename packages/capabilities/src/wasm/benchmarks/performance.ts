/**
 * Performance benchmarking tools for WASM vs JavaScript
 */

import type {
  BenchmarkResult,
  BenchmarkOptions,
  PerformanceComparison,
  ImageData,
  Matrix,
  Vector,
} from '../types'
import { createImageProcessor } from '../modules/image-processing'
import { createCalculator } from '../modules/calculations'

/**
 * Run a benchmark for a given function
 */
async function runBenchmark(
  name: string,
  fn: () => Promise<any> | any,
  options: BenchmarkOptions = {}
): Promise<BenchmarkResult> {
  const iterations = options.iterations ?? 100
  const warmup = options.warmup ?? 10

  const times: number[] = []

  // Warmup
  for (let i = 0; i < warmup; i++) {
    await fn()
  }

  // Measure
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    await fn()
    const end = performance.now()
    times.push(end - start)
  }

  // Calculate statistics
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length
  const minTime = Math.min(...times)
  const maxTime = Math.max(...times)
  
  // Standard deviation
  const variance =
    times.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / times.length
  const stdDev = Math.sqrt(variance)

  return {
    operation: name,
    implementation: 'wasm', // Will be set by caller
    avgTime,
    minTime,
    maxTime,
    stdDev,
    opsPerSecond: 1000 / avgTime,
    samples: iterations,
  }
}

/**
 * Benchmark image resize operation
 */
export async function benchmarkImageResize(
  options: BenchmarkOptions = {}
): Promise<PerformanceComparison | BenchmarkResult> {
  const dataSize = options.dataSize ?? 1024
  const imageData: ImageData = {
    width: dataSize,
    height: dataSize,
    data: new Uint8ClampedArray(dataSize * dataSize * 4).fill(128),
  }

  const resizeOptions = {
    width: dataSize / 2,
    height: dataSize / 2,
  }

  if (!options.compareWithJS) {
    const processor = createImageProcessor()
    const result = await runBenchmark(
      'image-resize',
      () => processor.resize(imageData, resizeOptions, { fallback: 'prefer-wasm' }),
      options
    )
    return result
  }

  // Compare WASM vs JS
  const processorWasm = createImageProcessor()
  const processorJS = createImageProcessor()

  const wasmResult = await runBenchmark(
    'image-resize',
    () => processorWasm.resize(imageData, resizeOptions, { fallback: 'prefer-wasm' }),
    options
  )

  const jsResult = await runBenchmark(
    'image-resize',
    () => processorJS.resize(imageData, resizeOptions, { fallback: 'always-js' }),
    options
  )

  jsResult.implementation = 'js'

  const speedup = jsResult.avgTime / wasmResult.avgTime
  const improvement = ((speedup - 1) * 100)

  return {
    wasm: wasmResult,
    js: jsResult,
    speedup,
    improvement,
  }
}

/**
 * Benchmark image filter operation
 */
export async function benchmarkImageFilter(
  options: BenchmarkOptions = {}
): Promise<PerformanceComparison | BenchmarkResult> {
  const dataSize = options.dataSize ?? 512
  const imageData: ImageData = {
    width: dataSize,
    height: dataSize,
    data: new Uint8ClampedArray(dataSize * dataSize * 4).fill(128),
  }

  const filterOptions = {
    filter: 'grayscale' as const,
    intensity: 100,
  }

  if (!options.compareWithJS) {
    const processor = createImageProcessor()
    const result = await runBenchmark(
      'image-filter',
      () => processor.applyFilter(imageData, filterOptions, { fallback: 'prefer-wasm' }),
      options
    )
    return result
  }

  // Compare WASM vs JS
  const processorWasm = createImageProcessor()
  const processorJS = createImageProcessor()

  const wasmResult = await runBenchmark(
    'image-filter',
    () => processorWasm.applyFilter(imageData, filterOptions, { fallback: 'prefer-wasm' }),
    options
  )

  const jsResult = await runBenchmark(
    'image-filter',
    () => processorJS.applyFilter(imageData, filterOptions, { fallback: 'always-js' }),
    options
  )

  jsResult.implementation = 'js'

  const speedup = jsResult.avgTime / wasmResult.avgTime
  const improvement = ((speedup - 1) * 100)

  return {
    wasm: wasmResult,
    js: jsResult,
    speedup,
    improvement,
  }
}

/**
 * Benchmark matrix multiplication
 */
export async function benchmarkMatrixMultiply(
  options: BenchmarkOptions = {}
): Promise<PerformanceComparison | BenchmarkResult> {
  const size = options.dataSize ?? 128

  const matrixA: Matrix = {
    rows: size,
    cols: size,
    data: new Float64Array(size * size).map(() => Math.random()),
  }

  const matrixB: Matrix = {
    rows: size,
    cols: size,
    data: new Float64Array(size * size).map(() => Math.random()),
  }

  if (!options.compareWithJS) {
    const calculator = createCalculator()
    const result = await runBenchmark(
      'matrix-multiply',
      () => calculator.matrixMultiply(matrixA, matrixB, { fallback: 'prefer-wasm' }),
      options
    )
    return result
  }

  // Compare WASM vs JS
  const calculatorWasm = createCalculator()
  const calculatorJS = createCalculator()

  const wasmResult = await runBenchmark(
    'matrix-multiply',
    () => calculatorWasm.matrixMultiply(matrixA, matrixB, { fallback: 'prefer-wasm' }),
    options
  )

  const jsResult = await runBenchmark(
    'matrix-multiply',
    () => calculatorJS.matrixMultiply(matrixA, matrixB, { fallback: 'always-js' }),
    options
  )

  jsResult.implementation = 'js'

  const speedup = jsResult.avgTime / wasmResult.avgTime
  const improvement = ((speedup - 1) * 100)

  return {
    wasm: wasmResult,
    js: jsResult,
    speedup,
    improvement,
  }
}

/**
 * Benchmark FFT operation
 */
export async function benchmarkFFT(
  options: BenchmarkOptions = {}
): Promise<PerformanceComparison | BenchmarkResult> {
  const size = options.dataSize ?? 1024 // Must be power of 2

  const input: Vector = {
    length: size,
    data: new Float64Array(size).map(() => Math.random()),
  }

  if (!options.compareWithJS) {
    const calculator = createCalculator()
    const result = await runBenchmark(
      'fft',
      () => calculator.fft(input, {}, { fallback: 'prefer-wasm' }),
      options
    )
    return result
  }

  // Compare WASM vs JS
  const calculatorWasm = createCalculator()
  const calculatorJS = createCalculator()

  const wasmResult = await runBenchmark(
    'fft',
    () => calculatorWasm.fft(input, {}, { fallback: 'prefer-wasm' }),
    options
  )

  const jsResult = await runBenchmark(
    'fft',
    () => calculatorJS.fft(input, {}, { fallback: 'always-js' }),
    options
  )

  jsResult.implementation = 'js'

  const speedup = jsResult.avgTime / wasmResult.avgTime
  const improvement = ((speedup - 1) * 100)

  return {
    wasm: wasmResult,
    js: jsResult,
    speedup,
    improvement,
  }
}

/**
 * Run a comprehensive benchmark suite
 */
export async function runBenchmarkSuite(
  options: BenchmarkOptions = {}
): Promise<{
  imageResize: PerformanceComparison | BenchmarkResult
  imageFilter: PerformanceComparison | BenchmarkResult
  matrixMultiply: PerformanceComparison | BenchmarkResult
  fft: PerformanceComparison | BenchmarkResult
}> {
  console.log('Running benchmark suite...')

  const results = {
    imageResize: await benchmarkImageResize(options),
    imageFilter: await benchmarkImageFilter(options),
    matrixMultiply: await benchmarkMatrixMultiply(options),
    fft: await benchmarkFFT(options),
  }

  console.log('Benchmark suite complete!')
  return results
}

/**
 * Format benchmark results as a table
 */
export function formatBenchmarkResults(
  results: Record<string, PerformanceComparison | BenchmarkResult>
): string {
  const lines: string[] = ['Performance Benchmark Results', '='.repeat(80), '']

  for (const [name, result] of Object.entries(results)) {
    lines.push(`${name}:`)

    if ('speedup' in result) {
      // PerformanceComparison
      lines.push(`  WASM: ${result.wasm.avgTime.toFixed(2)}ms (${result.wasm.opsPerSecond.toFixed(0)} ops/s)`)
      lines.push(`  JS:   ${result.js.avgTime.toFixed(2)}ms (${result.js.opsPerSecond.toFixed(0)} ops/s)`)
      lines.push(`  Speedup: ${result.speedup.toFixed(2)}x (${result.improvement.toFixed(1)}% faster)`)
    } else {
      // BenchmarkResult
      lines.push(`  ${result.implementation.toUpperCase()}: ${result.avgTime.toFixed(2)}ms (${result.opsPerSecond.toFixed(0)} ops/s)`)
      lines.push(`  Min: ${result.minTime.toFixed(2)}ms, Max: ${result.maxTime.toFixed(2)}ms`)
      lines.push(`  StdDev: ${result.stdDev.toFixed(2)}ms`)
    }

    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Compare WASM vs JS for a custom operation
 */
export async function compareImplementations(
  name: string,
  wasmFn: () => Promise<any> | any,
  jsFn: () => Promise<any> | any,
  options: BenchmarkOptions = {}
): Promise<PerformanceComparison> {
  const wasmResult = await runBenchmark(name, wasmFn, options)
  const jsResult = await runBenchmark(name, jsFn, options)
  
  jsResult.implementation = 'js'
  
  const speedup = jsResult.avgTime / wasmResult.avgTime
  const improvement = ((speedup - 1) * 100)

  return {
    wasm: wasmResult,
    js: jsResult,
    speedup,
    improvement,
  }
}
