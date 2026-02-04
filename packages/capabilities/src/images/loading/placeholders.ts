/**
 * LQIP and Blurhash placeholder generation strategies
 */

import type { PlaceholderConfig, LQIP, BlurhashData, PlaceholderStrategy } from '../types'

/**
 * Placeholder generator
 */
export class PlaceholderGenerator {
  private config: PlaceholderConfig

  constructor(config: PlaceholderConfig) {
    this.config = config
  }

  /**
   * Generate placeholder based on strategy
   */
  async generatePlaceholder(
    source: string | Blob | File
  ): Promise<string | LQIP | BlurhashData> {
    switch (this.config.strategy) {
      case 'lqip':
        return this.generateLQIP(source)

      case 'blurhash':
        return this.generateBlurhash(source)

      case 'color':
        return this.generateColorPlaceholder(source)

      case 'svg':
        return this.generateSVGPlaceholder()

      default:
        return ''
    }
  }

  /**
   * Generate LQIP (Low Quality Image Placeholder)
   */
  private async generateLQIP(source: string | Blob | File): Promise<LQIP> {
    const blob = await this.loadImage(source)
    const bitmap = await createImageBitmap(blob)

    // Create small canvas for LQIP
    const targetWidth = 20
    const aspectRatio = bitmap.width / bitmap.height
    const targetHeight = Math.round(targetWidth / aspectRatio)

    const canvas = this.createCanvas(targetWidth, targetHeight)
    const ctx = canvas.getContext('2d')

    if (!ctx) throw new Error('Failed to get canvas context')

    // Draw downscaled image
    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight)

    // Convert to data URL with low quality
    const quality = (this.config.lqipQuality || 10) / 100
    const dataUrl = canvas.toDataURL('image/jpeg', quality)

    return {
      dataUrl,
      width: targetWidth,
      height: targetHeight,
      aspectRatio,
    }
  }

  /**
   * Generate Blurhash placeholder
   */
  private async generateBlurhash(source: string | Blob | File): Promise<BlurhashData> {
    const blob = await this.loadImage(source)
    const bitmap = await createImageBitmap(blob)

    const components = this.config.blurhashComponents || { x: 4, y: 3 }

    // Get image data
    const canvas = this.createCanvas(bitmap.width, bitmap.height)
    const ctx = canvas.getContext('2d')

    if (!ctx) throw new Error('Failed to get canvas context')

    ctx.drawImage(bitmap, 0, 0)
    const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height)

    // Generate blurhash
    const hash = this.encodeBlurhash(imageData, components.x, components.y)

    return {
      hash,
      width: bitmap.width,
      height: bitmap.height,
      aspectRatio: bitmap.width / bitmap.height,
    }
  }

  /**
   * Encode Blurhash (simplified implementation)
   * In production, use the official blurhash library
   */
  private encodeBlurhash(imageData: ImageData, componentX: number, componentY: number): string {
    // This is a placeholder implementation
    // In production, use: import { encode } from 'blurhash'
    const { width, height, data } = imageData

    // Calculate average color as fallback
    let r = 0,
      g = 0,
      b = 0
    const pixelCount = width * height

    for (let i = 0; i < data.length; i += 4) {
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
    }

    r = Math.floor(r / pixelCount)
    g = Math.floor(g / pixelCount)
    b = Math.floor(b / pixelCount)

    // Generate simple hash based on average color
    const hash = `L${this.encodeAC(r, g, b)}${'0'.repeat(componentX * componentY - 1)}`

    return hash
  }

  /**
   * Encode AC component (simplified)
   */
  private encodeAC(r: number, g: number, b: number): string {
    const value = (r << 16) | (g << 8) | b
    return value.toString(36).padStart(6, '0').substring(0, 6)
  }

  /**
   * Decode Blurhash to data URL
   */
  decodeBlurhash(hash: string, width: number, height: number): string {
    // In production, use: import { decode } from 'blurhash'
    // This is a simplified placeholder

    const canvas = this.createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    if (!ctx) throw new Error('Failed to get canvas context')

    // Extract approximate color from hash
    const colorStr = hash.substring(1, 7)
    const value = parseInt(colorStr, 36)
    const r = (value >> 16) & 255
    const g = (value >> 8) & 255
    const b = value & 255

    // Fill with solid color as fallback
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
    ctx.fillRect(0, 0, width, height)

    return canvas.toDataURL()
  }

  /**
   * Generate dominant color placeholder
   */
  private async generateColorPlaceholder(source: string | Blob | File): Promise<string> {
    if (this.config.color) {
      return this.config.color
    }

    const blob = await this.loadImage(source)
    const bitmap = await createImageBitmap(blob)

    // Sample center pixels for dominant color
    const canvas = this.createCanvas(1, 1)
    const ctx = canvas.getContext('2d')

    if (!ctx) throw new Error('Failed to get canvas context')

    ctx.drawImage(bitmap, 0, 0, 1, 1)
    const pixel = ctx.getImageData(0, 0, 1, 1).data

    return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`
  }

  /**
   * Generate SVG placeholder
   */
  private generateSVGPlaceholder(): string {
    if (this.config.svgPlaceholder) {
      return this.config.svgPlaceholder
    }

    // Generate simple SVG placeholder
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="${this.config.color || '#f0f0f0'}" />
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-family="sans-serif" font-size="14">
          Loading...
        </text>
      </svg>
    `.trim()

    return `data:image/svg+xml;base64,${btoa(svg)}`
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
   * Create canvas element
   */
  private createCanvas(width: number, height: number): HTMLCanvasElement {
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      return canvas
    }

    // Node.js environment
    try {
      const { createCanvas } = require('canvas')
      return createCanvas(width, height)
    } catch {
      throw new Error('Canvas not available in this environment')
    }
  }
}

/**
 * Create placeholder generator
 */
export function createPlaceholderGenerator(config: PlaceholderConfig): PlaceholderGenerator {
  return new PlaceholderGenerator(config)
}

/**
 * Generate LQIP from image URL
 */
export async function generateLQIPFromUrl(url: string, quality = 10): Promise<string> {
  const generator = new PlaceholderGenerator({
    strategy: 'lqip',
    lqipQuality: quality,
  })

  const lqip = (await generator.generatePlaceholder(url)) as LQIP
  return lqip.dataUrl
}

/**
 * Generate Blurhash from image URL
 */
export async function generateBlurhashFromUrl(
  url: string,
  components = { x: 4, y: 3 }
): Promise<string> {
  const generator = new PlaceholderGenerator({
    strategy: 'blurhash',
    blurhashComponents: components,
  })

  const blurhash = (await generator.generatePlaceholder(url)) as BlurhashData
  return blurhash.hash
}

/**
 * Extract dominant color from image
 */
export async function extractDominantColor(source: string | Blob | File): Promise<string> {
  const generator = new PlaceholderGenerator({
    strategy: 'color',
  })

  return (await generator.generatePlaceholder(source)) as string
}

/**
 * Create responsive placeholder image element
 */
export function createPlaceholderImage(config: {
  placeholder: string
  width: number
  height: number
  alt?: string
  className?: string
}): HTMLImageElement {
  if (typeof document === 'undefined') {
    throw new Error('Document not available')
  }

  const img = document.createElement('img')
  img.src = config.placeholder
  img.width = config.width
  img.height = config.height
  img.alt = config.alt || ''
  img.style.aspectRatio = `${config.width} / ${config.height}`

  if (config.className) {
    img.className = config.className
  }

  return img
}

/**
 * Apply placeholder to existing image element
 */
export function applyPlaceholder(
  img: HTMLImageElement,
  placeholder: string | LQIP | BlurhashData,
  strategy: PlaceholderStrategy = 'lqip'
): void {
  switch (strategy) {
    case 'lqip':
      if (typeof placeholder === 'string') {
        img.src = placeholder
      } else if ('dataUrl' in placeholder) {
        img.src = placeholder.dataUrl
      }
      img.style.filter = 'blur(10px)'
      break

    case 'blurhash':
      if (typeof placeholder === 'string') {
        const generator = new PlaceholderGenerator({ strategy: 'blurhash' })
        img.src = generator.decodeBlurhash(placeholder, img.width || 400, img.height || 300)
      } else if ('hash' in placeholder) {
        const generator = new PlaceholderGenerator({ strategy: 'blurhash' })
        img.src = generator.decodeBlurhash(placeholder.hash, img.width || 400, img.height || 300)
      }
      break

    case 'color':
      if (typeof placeholder === 'string') {
        img.style.backgroundColor = placeholder
      }
      break

    case 'svg':
      if (typeof placeholder === 'string') {
        img.src = placeholder
      }
      break
  }
}

/**
 * Batch generate placeholders for multiple images
 */
export async function batchGeneratePlaceholders(
  sources: Array<string | Blob | File>,
  config: PlaceholderConfig
): Promise<Array<string | LQIP | BlurhashData>> {
  const generator = new PlaceholderGenerator(config)

  return Promise.all(sources.map((source) => generator.generatePlaceholder(source)))
}
