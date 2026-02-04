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
 * Complex mathematical calculations with WASM and JavaScript fallbacks
 */

import type {
  Matrix,
  Vector,
  FFTOptions,
  RegressionResult,
  ClusteringResult,
  ExecutionOptions,
} from '../types'
import { LazyWasmModule } from '../loader'
import { shouldUseWasm, getCompatibility } from '../fallback/compatibility'

/**
 * Mathematical calculations module
 */
class CalculationsModule {
  private wasmModule?: LazyWasmModule

  constructor(wasmUrl?: string) {
    if (wasmUrl) {
      this.wasmModule = new LazyWasmModule('calculations', '1.0.0', {
        url: wasmUrl,
        streaming: true,
        memory: {
          initial: 128, // 8MB
          maximum: 512, // 32MB
        },
      })
    }
  }

  /**
   * Multiply two matrices
   */
  async matrixMultiply(
    a: Matrix,
    b: Matrix,
    execOptions?: ExecutionOptions
  ): Promise<Matrix> {
    if (a.cols !== b.rows) {
      throw new Error('Matrix dimensions incompatible for multiplication')
    }

    const strategy = execOptions?.fallback ?? 'auto'
    const compat = getCompatibility()

    if (this.wasmModule && shouldUseWasm(compat, strategy)) {
      try {
        return await this.matrixMultiplyWasm(a, b)
      } catch (error) {
        if (strategy === 'always-wasm') {
          throw error
        }
        console.warn('WASM matrix multiply failed, falling back to JS', error)
      }
    }

    return this.matrixMultiplyJS(a, b)
  }

  /**
   * Matrix multiply using WASM (mock implementation)
   */
  private async matrixMultiplyWasm(a: Matrix, b: Matrix): Promise<Matrix> {
    if (!this.wasmModule) {
      throw new Error('WASM module not initialized')
    }

    await this.wasmModule.ensureLoaded()

    console.log('Using WASM matrix multiply (simulated)')
    return this.matrixMultiplyJS(a, b)
  }

  /**
   * Matrix multiply using JavaScript (fallback)
   */
  private matrixMultiplyJS(a: Matrix, b: Matrix): Matrix {
    const result = new Float64Array(a.rows * b.cols)

    for (let i = 0; i < a.rows; i++) {
      for (let j = 0; j < b.cols; j++) {
        let sum = 0
        for (let k = 0; k < a.cols; k++) {
          sum += (a.data[i * a.cols + k] ?? 0) * (b.data[k * b.cols + j] ?? 0)
        }
        result[i * b.cols + j] = sum
      }
    }

    return {
      rows: a.rows,
      cols: b.cols,
      data: result,
    }
  }

  /**
   * Perform Fast Fourier Transform
   */
  async fft(
    input: Vector,
    options: FFTOptions = {},
    execOptions?: ExecutionOptions
  ): Promise<{ real: Vector; imag: Vector }> {
    const strategy = execOptions?.fallback ?? 'auto'
    const compat = getCompatibility()

    if (this.wasmModule && shouldUseWasm(compat, strategy)) {
      try {
        return await this.fftWasm(input, options)
      } catch (error) {
        if (strategy === 'always-wasm') {
          throw error
        }
        console.warn('WASM FFT failed, falling back to JS', error)
      }
    }

    return this.fftJS(input, options)
  }

  /**
   * FFT using WASM (mock implementation)
   */
  private async fftWasm(
    input: Vector,
    options: FFTOptions
  ): Promise<{ real: Vector; imag: Vector }> {
    if (!this.wasmModule) {
      throw new Error('WASM module not initialized')
    }

    await this.wasmModule.ensureLoaded()

    console.log('Using WASM FFT (simulated)')
    return this.fftJS(input, options)
  }

  /**
   * FFT using JavaScript (fallback) - Cooley-Tukey algorithm
   */
  private fftJS(
    input: Vector,
    options: FFTOptions
  ): { real: Vector; imag: Vector } {
    const n = input.length
    
    // Check if n is power of 2
    if ((n & (n - 1)) !== 0) {
      throw new Error('FFT input length must be a power of 2')
    }

    const real = new Float64Array(input.data)
    const imag = new Float64Array(n)

    // Bit-reversal permutation
    let j = 0
    for (let i = 0; i < n - 1; i++) {
      if (i < j) {
        const tempReal = real[i]!
        real[i] = real[j]!
        real[j] = tempReal
      }
      let k = n / 2
      while (k <= j) {
        j -= k
        k /= 2
      }
      j += k
    }

    // Cooley-Tukey FFT
    for (let len = 2; len <= n; len *= 2) {
      const angle = (options.inverse ? 2 : -2) * Math.PI / len
      const wlen = { real: Math.cos(angle), imag: Math.sin(angle) }

      for (let i = 0; i < n; i += len) {
        let w = { real: 1, imag: 0 }
        for (let j = 0; j < len / 2; j++) {
          const u = { real: real[i + j]!, imag: imag[i + j]! }
          const t = {
            real: w.real * real[i + j + len / 2]! - w.imag * imag[i + j + len / 2]!,
            imag: w.real * imag[i + j + len / 2]! + w.imag * real[i + j + len / 2]!,
          }

          real[i + j] = u.real + t.real
          imag[i + j] = u.imag + t.imag
          real[i + j + len / 2] = u.real - t.real
          imag[i + j + len / 2] = u.imag - t.imag

          const tempW = {
            real: w.real * wlen.real - w.imag * wlen.imag,
            imag: w.real * wlen.imag + w.imag * wlen.real,
          }
          w = tempW
        }
      }
    }

    // Normalize if requested
    if (options.normalize) {
      const scale = 1 / Math.sqrt(n)
      for (let i = 0; i < n; i++) {
        real[i] *= scale
        imag[i] *= scale
      }
    }

    return {
      real: { length: n, data: real },
      imag: { length: n, data: imag },
    }
  }

  /**
   * Perform linear regression
   */
  async linearRegression(
    x: Vector,
    y: Vector,
    execOptions?: ExecutionOptions
  ): Promise<RegressionResult> {
    if (x.length !== y.length) {
      throw new Error('X and Y vectors must have the same length')
    }

    const strategy = execOptions?.fallback ?? 'auto'
    const compat = getCompatibility()

    if (this.wasmModule && shouldUseWasm(compat, strategy)) {
      try {
        return await this.linearRegressionWasm(x, y)
      } catch (error) {
        if (strategy === 'always-wasm') {
          throw error
        }
        console.warn('WASM linear regression failed, falling back to JS', error)
      }
    }

    return this.linearRegressionJS(x, y)
  }

  /**
   * Linear regression using WASM (mock implementation)
   */
  private async linearRegressionWasm(x: Vector, y: Vector): Promise<RegressionResult> {
    if (!this.wasmModule) {
      throw new Error('WASM module not initialized')
    }

    await this.wasmModule.ensureLoaded()

    console.log('Using WASM linear regression (simulated)')
    return this.linearRegressionJS(x, y)
  }

  /**
   * Linear regression using JavaScript (fallback)
   */
  private linearRegressionJS(x: Vector, y: Vector): RegressionResult {
    const n = x.length
    let sumX = 0
    let sumY = 0
    let sumXY = 0
    let sumXX = 0

    for (let i = 0; i < n; i++) {
      sumX += x.data[i]!
      sumY += y.data[i]!
      sumXY += x.data[i]! * y.data[i]!
      sumXX += x.data[i]! * x.data[i]!
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    // Calculate R-squared
    const meanY = sumY / n
    let ssRes = 0
    let ssTot = 0
    const residuals = new Float64Array(n)

    for (let i = 0; i < n; i++) {
      const predicted = slope * x.data[i]! + intercept
      residuals[i] = y.data[i]! - predicted
      ssRes += residuals[i]! * residuals[i]!
      ssTot += (y.data[i]! - meanY) * (y.data[i]! - meanY)
    }

    const rSquared = 1 - ssRes / ssTot

    return {
      coefficients: new Float64Array([intercept, slope]),
      rSquared,
      residuals,
    }
  }

  /**
   * Perform K-means clustering
   */
  async kmeansClustering(
    data: Matrix,
    k: number,
    maxIterations = 100,
    execOptions?: ExecutionOptions
  ): Promise<ClusteringResult> {
    if (k <= 0 || k > data.rows) {
      throw new Error('Invalid number of clusters')
    }

    const strategy = execOptions?.fallback ?? 'auto'
    const compat = getCompatibility()

    if (this.wasmModule && shouldUseWasm(compat, strategy)) {
      try {
        return await this.kmeansClusteringWasm(data, k, maxIterations)
      } catch (error) {
        if (strategy === 'always-wasm') {
          throw error
        }
        console.warn('WASM k-means clustering failed, falling back to JS', error)
      }
    }

    return this.kmeansClusteringJS(data, k, maxIterations)
  }

  /**
   * K-means clustering using WASM (mock implementation)
   */
  private async kmeansClusteringWasm(
    data: Matrix,
    k: number,
    maxIterations: number
  ): Promise<ClusteringResult> {
    if (!this.wasmModule) {
      throw new Error('WASM module not initialized')
    }

    await this.wasmModule.ensureLoaded()

    console.log('Using WASM k-means clustering (simulated)')
    return this.kmeansClusteringJS(data, k, maxIterations)
  }

  /**
   * K-means clustering using JavaScript (fallback)
   */
  private kmeansClusteringJS(
    data: Matrix,
    k: number,
    maxIterations: number
  ): ClusteringResult {
    const n = data.rows
    const d = data.cols

    // Initialize centroids randomly
    const centroids = new Float64Array(k * d)
    const assignments = new Int32Array(n)
    
    // Random initialization
    for (let i = 0; i < k; i++) {
      const randomIdx = Math.floor(Math.random() * n)
      for (let j = 0; j < d; j++) {
        centroids[i * d + j] = data.data[randomIdx * d + j]!
      }
    }

    // Iterate
    for (let iter = 0; iter < maxIterations; iter++) {
      // Assign points to nearest centroid
      for (let i = 0; i < n; i++) {
        let minDist = Infinity
        let minCluster = 0

        for (let j = 0; j < k; j++) {
          let dist = 0
          for (let l = 0; l < d; l++) {
            const diff = data.data[i * d + l]! - centroids[j * d + l]!
            dist += diff * diff
          }
          if (dist < minDist) {
            minDist = dist
            minCluster = j
          }
        }

        assignments[i] = minCluster
      }

      // Update centroids
      const counts = new Int32Array(k)
      const newCentroids = new Float64Array(k * d)

      for (let i = 0; i < n; i++) {
        const cluster = assignments[i]!
        counts[cluster]++
        for (let j = 0; j < d; j++) {
          newCentroids[cluster * d + j] += data.data[i * d + j]!
        }
      }

      for (let i = 0; i < k; i++) {
        if (counts[i]! > 0) {
          for (let j = 0; j < d; j++) {
            centroids[i * d + j] = newCentroids[i * d + j]! / counts[i]!
          }
        }
      }
    }

    // Calculate inertia
    let inertia = 0
    for (let i = 0; i < n; i++) {
      const cluster = assignments[i]!
      for (let j = 0; j < d; j++) {
        const diff = data.data[i * d + j]! - centroids[cluster * d + j]!
        inertia += diff * diff
      }
    }

    return {
      assignments,
      centroids: {
        rows: k,
        cols: d,
        data: centroids,
      },
      inertia,
    }
  }
}

/**
 * Create a calculations instance
 */
export function createCalculator(wasmUrl?: string): CalculationsModule {
  return new CalculationsModule(wasmUrl)
}

/**
 * Default calculator instance
 */
let defaultCalculator: CalculationsModule | undefined

/**
 * Get or create default calculator
 */
export function getCalculator(wasmUrl?: string): CalculationsModule {
  if (!defaultCalculator) {
    defaultCalculator = createCalculator(wasmUrl)
  }
  return defaultCalculator
}

/**
 * Convenience functions using default calculator
 */
export const matrixMultiply = (a: Matrix, b: Matrix, execOptions?: ExecutionOptions) =>
  getCalculator().matrixMultiply(a, b, execOptions)

export const fft = (
  input: Vector,
  options?: FFTOptions,
  execOptions?: ExecutionOptions
) => getCalculator().fft(input, options, execOptions)

export const linearRegression = (x: Vector, y: Vector, execOptions?: ExecutionOptions) =>
  getCalculator().linearRegression(x, y, execOptions)

export const kmeansClustering = (
  data: Matrix,
  k: number,
  maxIterations?: number,
  execOptions?: ExecutionOptions
) => getCalculator().kmeansClustering(data, k, maxIterations, execOptions)
