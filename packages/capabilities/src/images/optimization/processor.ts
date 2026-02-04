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
 * Image processing and transformation utilities
 */

import type {
  ImageTransformation,
  ImageFormat,
  OptimizationResult,
  ProcessorConfig,
} from '../types'

/**
 * Default processor configuration
 */
const DEFAULT_CONFIG: ProcessorConfig = {
  maxConcurrency: 5,
  defaultQuality: 80,
  progressive: true,
  optimize: true,
  stripMetadata: true,
  autoOrient: true,
}

/**
 * Image processor for client-side and server-side transformations
 */
export class ImageProcessor {
  private config: ProcessorConfig
  private processingQueue: Array<() => Promise<void>> = []
  private activeProcessing = 0

  constructor(config: Partial<ProcessorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Process image with transformations
   */
  async processImage(
    source: string | Blob | File,
    transformations: ImageTransformation
  ): Promise<Blob> {
    return this.enqueueProcessing(async () => {
      const imageBlob = await this.loadImage(source)
      const bitmap = await this.createImageBitmap(imageBlob)

      const canvas = this.createCanvas(
        transformations.width || bitmap.width,
        transformations.height || bitmap.height
      )

      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Failed to get canvas context')

      // Apply transformations
      this.applyTransformations(ctx, bitmap, transformations)

      // Convert to desired format
      const format = transformations.format || 'jpeg'
      const quality = (transformations.quality || this.config.defaultQuality) / 100

      return this.canvasToBlob(canvas, format, quality)
    })
  }

  /**
   * Load image from various sources
   */
  private async loadImage(source: string | Blob | File): Promise<Blob> {
    if (source instanceof Blob) {
      return source
    }

    if (typeof source === 'string') {
      const response = await fetch(source)
      if (!response.ok) throw new Error(`Failed to load image: ${response.statusText}`)
      return await response.blob()
    }

    throw new Error('Unsupported image source type')
  }

  /**
   * Create ImageBitmap with proper orientation
   */
  private async createImageBitmap(blob: Blob): Promise<ImageBitmap> {
    if (typeof createImageBitmap === 'undefined') {
      // Fallback for environments without createImageBitmap
      return this.createImageBitmapFallback(blob)
    }

    const options: ImageBitmapOptions = {}

    if (this.config.autoOrient) {
      options.imageOrientation = 'from-image'
    }

    return createImageBitmap(blob, options)
  }

  /**
   * Fallback for createImageBitmap
   */
  private async createImageBitmapFallback(blob: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(blob)

      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve(img as any)
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load image'))
      }

      img.src = url
    })
  }

  /**
   * Create canvas element
   */
  private createCanvas(width: number, height: number): HTMLCanvasElement {
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      return canvas
    }

    // Node.js environment - use canvas package if available
    try {
      const { createCanvas } = require('canvas')
      return createCanvas(width, height)
    } catch {
      throw new Error('Canvas not available in this environment')
    }
  }

  /**
   * Apply transformations to canvas context
   */
  private applyTransformations(
    ctx: CanvasRenderingContext2D,
    bitmap: ImageBitmap | HTMLImageElement,
    transformations: ImageTransformation
  ): void {
    const srcWidth = bitmap.width
    const srcHeight = bitmap.height
    const dstWidth = transformations.width || srcWidth
    const dstHeight = transformations.height || srcHeight

    // Clear canvas
    ctx.clearRect(0, 0, dstWidth, dstHeight)

    // Apply background if padding
    if (transformations.crop === 'pad' && transformations.background) {
      ctx.fillStyle = transformations.background
      ctx.fillRect(0, 0, dstWidth, dstHeight)
    }

    // Calculate dimensions based on crop mode
    const dimensions = this.calculateDimensions(
      srcWidth,
      srcHeight,
      dstWidth,
      dstHeight,
      transformations
    )

    // Apply blur if specified
    if (transformations.blur) {
      ctx.filter = `blur(${transformations.blur}px)`
    }

    // Draw image
    ctx.drawImage(
      bitmap,
      dimensions.sx,
      dimensions.sy,
      dimensions.sw,
      dimensions.sh,
      dimensions.dx,
      dimensions.dy,
      dimensions.dw,
      dimensions.dh
    )

    // Reset filter
    ctx.filter = 'none'

    // Apply sharpen if specified (simple implementation)
    if (transformations.sharpen) {
      this.applySharpen(ctx, dstWidth, dstHeight, transformations.sharpen)
    }
  }

  /**
   * Calculate drawing dimensions based on crop mode
   */
  private calculateDimensions(
    srcWidth: number,
    srcHeight: number,
    dstWidth: number,
    dstHeight: number,
    transformations: ImageTransformation
  ): {
    sx: number
    sy: number
    sw: number
    sh: number
    dx: number
    dy: number
    dw: number
    dh: number
  } {
    const crop = transformations.crop || 'fit'

    switch (crop) {
      case 'fill':
      case 'crop': {
        // Cover the entire destination, cropping if necessary
        const scale = Math.max(dstWidth / srcWidth, dstHeight / srcHeight)
        const scaledWidth = srcWidth * scale
        const scaledHeight = srcHeight * scale

        return {
          sx: 0,
          sy: 0,
          sw: srcWidth,
          sh: srcHeight,
          dx: (dstWidth - scaledWidth) / 2,
          dy: (dstHeight - scaledHeight) / 2,
          dw: scaledWidth,
          dh: scaledHeight,
        }
      }

      case 'fit': {
        // Fit entire image, may have letterboxing
        const scale = Math.min(dstWidth / srcWidth, dstHeight / srcHeight)
        const scaledWidth = srcWidth * scale
        const scaledHeight = srcHeight * scale

        return {
          sx: 0,
          sy: 0,
          sw: srcWidth,
          sh: srcHeight,
          dx: (dstWidth - scaledWidth) / 2,
          dy: (dstHeight - scaledHeight) / 2,
          dw: scaledWidth,
          dh: scaledHeight,
        }
      }

      case 'scale': {
        // Stretch to fit exactly
        return {
          sx: 0,
          sy: 0,
          sw: srcWidth,
          sh: srcHeight,
          dx: 0,
          dy: 0,
          dw: dstWidth,
          dh: dstHeight,
        }
      }

      default:
        return {
          sx: 0,
          sy: 0,
          sw: srcWidth,
          sh: srcHeight,
          dx: 0,
          dy: 0,
          dw: dstWidth,
          dh: dstHeight,
        }
    }
  }

  /**
   * Apply sharpen filter
   */
  private applySharpen(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    amount: number
  ): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    // Simple sharpen kernel
    const kernel = [0, -amount / 4, 0, -amount / 4, amount + 1, -amount / 4, 0, -amount / 4, 0]

    const output = new Uint8ClampedArray(data)

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + c
              sum += data[idx] * kernel[(ky + 1) * 3 + (kx + 1)]
            }
          }
          output[(y * width + x) * 4 + c] = sum
        }
      }
    }

    imageData.data.set(output)
    ctx.putImageData(imageData, 0, 0)
  }

  /**
   * Convert canvas to Blob
   */
  private canvasToBlob(
    canvas: HTMLCanvasElement,
    format: ImageFormat,
    quality: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const mimeType = `image/${format === 'jpg' ? 'jpeg' : format}`

      if (canvas.toBlob) {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
            else reject(new Error('Failed to convert canvas to blob'))
          },
          mimeType,
          quality
        )
      } else {
        // Fallback for older browsers
        try {
          const dataUrl = canvas.toDataURL(mimeType, quality)
          const blob = this.dataUrlToBlob(dataUrl)
          resolve(blob)
        } catch (error) {
          reject(error)
        }
      }
    })
  }

  /**
   * Convert data URL to Blob
   */
  private dataUrlToBlob(dataUrl: string): Blob {
    const parts = dataUrl.split(',')
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
    const bstr = atob(parts[1])
    const n = bstr.length
    const u8arr = new Uint8Array(n)

    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i)
    }

    return new Blob([u8arr], { type: mime })
  }

  /**
   * Enqueue processing task with concurrency control
   */
  private async enqueueProcessing<T>(task: () => Promise<T>): Promise<T> {
    if (this.activeProcessing >= this.config.maxConcurrency) {
      await new Promise<void>((resolve) => {
        this.processingQueue.push(async () => {
          resolve()
        })
      })
    }

    this.activeProcessing++

    try {
      return await task()
    } finally {
      this.activeProcessing--
      const nextTask = this.processingQueue.shift()
      if (nextTask) {
        nextTask()
      }
    }
  }

  /**
   * Batch process multiple images
   */
  async batchProcess(
    images: Array<{ source: string | Blob | File; transformations: ImageTransformation }>
  ): Promise<Blob[]> {
    return Promise.all(images.map((img) => this.processImage(img.source, img.transformations)))
  }

  /**
   * Get image dimensions without loading full image
   */
  async getImageDimensions(source: string | Blob | File): Promise<{ width: number; height: number }> {
    const blob = await this.loadImage(source)
    const bitmap = await this.createImageBitmap(blob)

    return {
      width: bitmap.width,
      height: bitmap.height,
    }
  }

  /**
   * Calculate optimal dimensions maintaining aspect ratio
   */
  calculateAspectRatioDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth?: number,
    maxHeight?: number
  ): { width: number; height: number } {
    const aspectRatio = originalWidth / originalHeight

    if (maxWidth && maxHeight) {
      const targetRatio = maxWidth / maxHeight

      if (aspectRatio > targetRatio) {
        return {
          width: maxWidth,
          height: Math.round(maxWidth / aspectRatio),
        }
      } else {
        return {
          width: Math.round(maxHeight * aspectRatio),
          height: maxHeight,
        }
      }
    }

    if (maxWidth) {
      return {
        width: maxWidth,
        height: Math.round(maxWidth / aspectRatio),
      }
    }

    if (maxHeight) {
      return {
        width: Math.round(maxHeight * aspectRatio),
        height: maxHeight,
      }
    }

    return { width: originalWidth, height: originalHeight }
  }
}

/**
 * Create image processor instance
 */
export function createImageProcessor(config?: Partial<ProcessorConfig>): ImageProcessor {
  return new ImageProcessor(config)
}
