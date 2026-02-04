/**
 * Image processing operations with WASM and JavaScript fallbacks
 */

import type {
  ImageData,
  ImageResizeOptions,
  ImageFilterOptions,
  ImageProcessingOptions,
  ExecutionOptions,
} from '../types'
import { LazyWasmModule } from '../loader'
import { shouldUseWasm, getCompatibility } from '../fallback/compatibility'

/**
 * Image processing module
 */
class ImageProcessingModule {
  private wasmModule?: LazyWasmModule

  constructor(wasmUrl?: string) {
    if (wasmUrl) {
      this.wasmModule = new LazyWasmModule('image-processing', '1.0.0', {
        url: wasmUrl,
        streaming: true,
        memory: {
          initial: 256, // 16MB
          maximum: 1024, // 64MB
        },
      })
    }
  }

  /**
   * Resize an image
   */
  async resize(
    imageData: ImageData,
    options: ImageResizeOptions,
    execOptions?: ExecutionOptions
  ): Promise<ImageData> {
    const strategy = execOptions?.fallback ?? 'auto'
    const compat = getCompatibility()

    if (this.wasmModule && shouldUseWasm(compat, strategy)) {
      try {
        return await this.resizeWasm(imageData, options)
      } catch (error) {
        if (strategy === 'always-wasm') {
          throw error
        }
        console.warn('WASM resize failed, falling back to JS', error)
      }
    }

    return this.resizeJS(imageData, options)
  }

  /**
   * Resize using WASM (mock implementation)
   */
  private async resizeWasm(
    imageData: ImageData,
    options: ImageResizeOptions
  ): Promise<ImageData> {
    if (!this.wasmModule) {
      throw new Error('WASM module not initialized')
    }

    await this.wasmModule.ensureLoaded()

    // In a real implementation, this would call the WASM function
    // For now, we simulate the WASM call with JS implementation
    console.log('Using WASM resize (simulated)')
    return this.resizeJS(imageData, options)
  }

  /**
   * Resize using JavaScript (fallback)
   */
  private resizeJS(imageData: ImageData, options: ImageResizeOptions): ImageData {
    const targetWidth = options.width ?? imageData.width
    const targetHeight = options.height ?? imageData.height

    // Simple bilinear interpolation resize
    const resized = new Uint8ClampedArray(targetWidth * targetHeight * 4)
    const xRatio = imageData.width / targetWidth
    const yRatio = imageData.height / targetHeight

    for (let y = 0; y < targetHeight; y++) {
      for (let x = 0; x < targetWidth; x++) {
        const srcX = Math.floor(x * xRatio)
        const srcY = Math.floor(y * yRatio)
        const srcIdx = (srcY * imageData.width + srcX) * 4
        const dstIdx = (y * targetWidth + x) * 4

        resized[dstIdx] = imageData.data[srcIdx]!
        resized[dstIdx + 1] = imageData.data[srcIdx + 1]!
        resized[dstIdx + 2] = imageData.data[srcIdx + 2]!
        resized[dstIdx + 3] = imageData.data[srcIdx + 3]!
      }
    }

    return {
      width: targetWidth,
      height: targetHeight,
      data: resized,
      colorSpace: imageData.colorSpace,
    }
  }

  /**
   * Compress an image
   */
  async compress(
    imageData: ImageData,
    options: ImageProcessingOptions,
    execOptions?: ExecutionOptions
  ): Promise<Uint8Array> {
    const strategy = execOptions?.fallback ?? 'auto'
    const compat = getCompatibility()

    if (this.wasmModule && shouldUseWasm(compat, strategy)) {
      try {
        return await this.compressWasm(imageData, options)
      } catch (error) {
        if (strategy === 'always-wasm') {
          throw error
        }
        console.warn('WASM compress failed, falling back to JS', error)
      }
    }

    return this.compressJS(imageData, options)
  }

  /**
   * Compress using WASM (mock implementation)
   */
  private async compressWasm(
    imageData: ImageData,
    options: ImageProcessingOptions
  ): Promise<Uint8Array> {
    if (!this.wasmModule) {
      throw new Error('WASM module not initialized')
    }

    await this.wasmModule.ensureLoaded()

    console.log('Using WASM compress (simulated)')
    return this.compressJS(imageData, options)
  }

  /**
   * Compress using JavaScript (fallback)
   */
  private compressJS(
    imageData: ImageData,
    options: ImageProcessingOptions
  ): Uint8Array {
    // Simple mock compression (in reality, would use canvas or library)
    const quality = options.quality ?? 80
    const header = new Uint8Array([0xff, 0xd8]) // JPEG SOI marker
    const data = new Uint8Array(imageData.data.length * (quality / 100))
    
    // Simulate compression by reducing data size
    for (let i = 0; i < data.length; i++) {
      data[i] = imageData.data[i * Math.floor(100 / quality)] ?? 0
    }

    const result = new Uint8Array(header.length + data.length)
    result.set(header, 0)
    result.set(data, header.length)
    
    return result
  }

  /**
   * Apply a filter to an image
   */
  async applyFilter(
    imageData: ImageData,
    options: ImageFilterOptions,
    execOptions?: ExecutionOptions
  ): Promise<ImageData> {
    const strategy = execOptions?.fallback ?? 'auto'
    const compat = getCompatibility()

    if (this.wasmModule && shouldUseWasm(compat, strategy)) {
      try {
        return await this.applyFilterWasm(imageData, options)
      } catch (error) {
        if (strategy === 'always-wasm') {
          throw error
        }
        console.warn('WASM filter failed, falling back to JS', error)
      }
    }

    return this.applyFilterJS(imageData, options)
  }

  /**
   * Apply filter using WASM (mock implementation)
   */
  private async applyFilterWasm(
    imageData: ImageData,
    options: ImageFilterOptions
  ): Promise<ImageData> {
    if (!this.wasmModule) {
      throw new Error('WASM module not initialized')
    }

    await this.wasmModule.ensureLoaded()

    console.log('Using WASM filter (simulated)')
    return this.applyFilterJS(imageData, options)
  }

  /**
   * Apply filter using JavaScript (fallback)
   */
  private applyFilterJS(
    imageData: ImageData,
    options: ImageFilterOptions
  ): ImageData {
    const filtered = new Uint8ClampedArray(imageData.data)
    const intensity = (options.intensity ?? 100) / 100

    switch (options.filter) {
      case 'grayscale':
        for (let i = 0; i < filtered.length; i += 4) {
          const gray =
            (filtered[i]! * 0.299 + filtered[i + 1]! * 0.587 + filtered[i + 2]! * 0.114) *
            intensity +
            filtered[i]! * (1 - intensity)
          filtered[i] = gray
          filtered[i + 1] = gray
          filtered[i + 2] = gray
        }
        break

      case 'sepia':
        for (let i = 0; i < filtered.length; i += 4) {
          const r = filtered[i]!
          const g = filtered[i + 1]!
          const b = filtered[i + 2]!
          
          const tr = r * 0.393 + g * 0.769 + b * 0.189
          const tg = r * 0.349 + g * 0.686 + b * 0.168
          const tb = r * 0.272 + g * 0.534 + b * 0.131
          
          filtered[i] = Math.min(255, tr * intensity + r * (1 - intensity))
          filtered[i + 1] = Math.min(255, tg * intensity + g * (1 - intensity))
          filtered[i + 2] = Math.min(255, tb * intensity + b * (1 - intensity))
        }
        break

      case 'invert':
        for (let i = 0; i < filtered.length; i += 4) {
          filtered[i] = 255 - filtered[i]!
          filtered[i + 1] = 255 - filtered[i + 1]!
          filtered[i + 2] = 255 - filtered[i + 2]!
        }
        break

      case 'brightness':
        const brightnessAdjust = (intensity - 0.5) * 255
        for (let i = 0; i < filtered.length; i += 4) {
          filtered[i] = Math.max(0, Math.min(255, filtered[i]! + brightnessAdjust))
          filtered[i + 1] = Math.max(0, Math.min(255, filtered[i + 1]! + brightnessAdjust))
          filtered[i + 2] = Math.max(0, Math.min(255, filtered[i + 2]! + brightnessAdjust))
        }
        break

      case 'contrast':
        const contrast = intensity * 2
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast))
        for (let i = 0; i < filtered.length; i += 4) {
          filtered[i] = Math.max(0, Math.min(255, factor * (filtered[i]! - 128) + 128))
          filtered[i + 1] = Math.max(0, Math.min(255, factor * (filtered[i + 1]! - 128) + 128))
          filtered[i + 2] = Math.max(0, Math.min(255, factor * (filtered[i + 2]! - 128) + 128))
        }
        break

      default:
        console.warn(`Filter ${options.filter} not implemented`)
    }

    return {
      ...imageData,
      data: filtered,
    }
  }
}

/**
 * Create an image processing instance
 */
export function createImageProcessor(wasmUrl?: string): ImageProcessingModule {
  return new ImageProcessingModule(wasmUrl)
}

/**
 * Default image processor instance
 */
let defaultProcessor: ImageProcessingModule | undefined

/**
 * Get or create default image processor
 */
export function getImageProcessor(wasmUrl?: string): ImageProcessingModule {
  if (!defaultProcessor) {
    defaultProcessor = createImageProcessor(wasmUrl)
  }
  return defaultProcessor
}

/**
 * Convenience functions using default processor
 */
export const resizeImage = (
  imageData: ImageData,
  options: ImageResizeOptions,
  execOptions?: ExecutionOptions
) => getImageProcessor().resize(imageData, options, execOptions)

export const compressImage = (
  imageData: ImageData,
  options: ImageProcessingOptions,
  execOptions?: ExecutionOptions
) => getImageProcessor().compress(imageData, options, execOptions)

export const applyImageFilter = (
  imageData: ImageData,
  options: ImageFilterOptions,
  execOptions?: ExecutionOptions
) => getImageProcessor().applyFilter(imageData, options, execOptions)
