/**
 * ImageKit CDN integration
 */

import type {
  ImageKitConfig,
  ImageTransformation,
  OptimizationResult,
  ImageUploadOptions,
  ImageUploadResult,
  ResponsiveImageConfig,
} from '../types'

/**
 * ImageKit image service
 */
export class ImageKitService {
  private config: ImageKitConfig

  constructor(config: ImageKitConfig) {
    this.config = config
  }

  /**
   * Generate ImageKit URL with transformations
   */
  getImageUrl(path: string, transformations?: ImageTransformation): string {
    const baseUrl = this.config.urlEndpoint.replace(/\/$/, '')
    const cleanPath = path.startsWith('/') ? path : `/${path}`

    if (!transformations) {
      return `${baseUrl}${cleanPath}`
    }

    const transformString = this.buildTransformationString(transformations)
    return transformString
      ? `${baseUrl}/tr:${transformString}${cleanPath}`
      : `${baseUrl}${cleanPath}`
  }

  /**
   * Build ImageKit transformation string
   */
  private buildTransformationString(transformations: ImageTransformation): string {
    const parts: string[] = []

    if (transformations.width) parts.push(`w-${transformations.width}`)
    if (transformations.height) parts.push(`h-${transformations.height}`)
    if (transformations.aspectRatio) parts.push(`ar-${transformations.aspectRatio}`)
    if (transformations.crop) parts.push(`c-${this.mapCropMode(transformations.crop)}`)
    if (transformations.focus) parts.push(`fo-${transformations.focus}`)
    if (transformations.quality) parts.push(`q-${transformations.quality}`)
    if (transformations.format) parts.push(`f-${transformations.format}`)
    if (transformations.dpr) parts.push(`dpr-${transformations.dpr}`)
    if (transformations.blur) parts.push(`bl-${transformations.blur}`)
    if (transformations.sharpen) parts.push(`e-sharpen`)
    if (transformations.background) parts.push(`bg-${transformations.background}`)

    if (transformations.auto) {
      if (transformations.auto.includes('format')) parts.push('f-auto')
      if (transformations.auto.includes('quality')) parts.push('q-auto')
    }

    return parts.join(',')
  }

  /**
   * Map crop mode to ImageKit format
   */
  private mapCropMode(crop: string): string {
    const mapping: Record<string, string> = {
      fill: 'maintain_ratio',
      fit: 'at_max',
      scale: 'force',
      crop: 'at_least',
      pad: 'pad_resize',
    }
    return mapping[crop] || crop
  }

  /**
   * Generate responsive image srcset
   */
  generateSrcSet(config: ResponsiveImageConfig): string {
    return config.breakpoints
      .map((width) => {
        const transformations = {
          ...config.transformations,
          width,
        }
        const url = this.getImageUrl(config.src, transformations)
        return `${url} ${width}w`
      })
      .join(', ')
  }

  /**
   * Generate picture element with multiple formats
   */
  generatePictureElement(config: ResponsiveImageConfig): {
    sources: Array<{ srcset: string; type: string; sizes?: string }>
    img: { src: string; alt: string; loading?: 'lazy' | 'eager' }
  } {
    const formats = config.formats || ['webp', 'jpeg']
    const sources = formats.map((format) => {
      const formatConfig = {
        ...config,
        transformations: {
          ...config.transformations,
          format,
        },
      }
      return {
        srcset: this.generateSrcSet(formatConfig),
        type: `image/${format}`,
        sizes: config.sizes,
      }
    })

    const fallbackUrl = this.getImageUrl(config.src, config.transformations)

    return {
      sources,
      img: {
        src: fallbackUrl,
        alt: '',
        loading: config.lazy ? 'lazy' : 'eager',
      },
    }
  }

  /**
   * Upload image to ImageKit
   */
  async uploadImage(options: ImageUploadOptions): Promise<ImageUploadResult> {
    if (!this.config.privateKey) {
      throw new Error('Private key required for upload')
    }

    const formData = new FormData()
    formData.append('file', options.file)

    if (options.publicId) formData.append('fileName', options.publicId)
    if (options.folder) formData.append('folder', options.folder)
    if (options.tags) formData.append('tags', options.tags.join(','))
    if (options.overwrite !== undefined) {
      formData.append('useUniqueFileName', (!options.overwrite).toString())
    }

    // Add transformation if specified
    if (options.transformations) {
      const transformString = this.buildTransformationString(options.transformations)
      if (transformString) {
        formData.append('transformation', transformString)
      }
    }

    const uploadUrl = `${this.config.urlEndpoint.replace('/ik-seo', '')}/api/v1/files/upload`

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.encodeCredentials()}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Upload failed: ${error.message || response.statusText}`)
    }

    const data = await response.json()

    return {
      success: true,
      publicId: data.fileId,
      url: data.url,
      secureUrl: data.url,
      format: data.fileType,
      size: data.size,
      dimensions: {
        width: data.width,
        height: data.height,
      },
      createdAt: new Date(data.createdAt),
    }
  }

  /**
   * Encode credentials for Basic Auth
   */
  private encodeCredentials(): string {
    const credentials = `${this.config.privateKey}:`
    if (typeof btoa !== 'undefined') {
      return btoa(credentials)
    }
    // Node.js environment
    return Buffer.from(credentials).toString('base64')
  }

  /**
   * Optimize image with ImageKit
   */
  async optimizeImage(path: string, options?: ImageTransformation): Promise<OptimizationResult> {
    const originalUrl = this.getImageUrl(path)

    const optimizedTransformations: ImageTransformation = {
      ...options,
      auto: ['format', 'quality'],
      format: options?.format || 'auto',
    }

    const optimizedUrl = this.getImageUrl(path, optimizedTransformations)

    // Fetch sizes for comparison
    const [originalSize, optimizedSize] = await Promise.all([
      this.getImageSize(originalUrl),
      this.getImageSize(optimizedUrl),
    ])

    const reduction = originalSize > 0 ? ((originalSize - optimizedSize) / originalSize) * 100 : 0

    return {
      originalUrl,
      optimizedUrl,
      originalSize,
      optimizedSize,
      reduction,
      format: optimizedTransformations.format || 'auto',
      dimensions: {
        width: options?.width || 0,
        height: options?.height || 0,
      },
      transformations: optimizedTransformations,
    }
  }

  /**
   * Get image size from URL
   */
  private async getImageSize(url: string): Promise<number> {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      const contentLength = response.headers.get('content-length')
      return contentLength ? parseInt(contentLength, 10) : 0
    } catch (error) {
      console.error('Failed to get image size:', error)
      return 0
    }
  }

  /**
   * Generate LQIP (Low Quality Image Placeholder)
   */
  getLQIP(path: string, quality = 10, width = 20): string {
    return this.getImageUrl(path, {
      width,
      quality,
      blur: 10,
    })
  }

  /**
   * Get image metadata
   */
  async getImageMetadata(
    fileId: string
  ): Promise<{
    width: number
    height: number
    format: string
    size: number
    name: string
  }> {
    if (!this.config.privateKey) {
      throw new Error('Private key required for metadata')
    }

    const metadataUrl = `${this.config.urlEndpoint.replace('/ik-seo', '')}/api/v1/files/${fileId}/details`

    const response = await fetch(metadataUrl, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${this.encodeCredentials()}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get metadata: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      width: data.width,
      height: data.height,
      format: data.fileType,
      size: data.size,
      name: data.name,
    }
  }

  /**
   * Delete image from ImageKit
   */
  async deleteImage(fileId: string): Promise<boolean> {
    if (!this.config.privateKey) {
      throw new Error('Private key required for deletion')
    }

    const deleteUrl = `${this.config.urlEndpoint.replace('/ik-seo', '')}/api/v1/files/${fileId}`

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Basic ${this.encodeCredentials()}`,
      },
    })

    return response.ok
  }

  /**
   * Purge image cache
   */
  async purgeCache(url: string): Promise<boolean> {
    if (!this.config.privateKey) {
      throw new Error('Private key required for cache purge')
    }

    const purgeUrl = `${this.config.urlEndpoint.replace('/ik-seo', '')}/api/v1/files/purge`

    const response = await fetch(purgeUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.encodeCredentials()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    return response.ok
  }

  /**
   * Get authentication parameters for client-side upload
   */
  getAuthenticationParameters(): {
    token: string
    expire: number
    signature: string
  } {
    // This should be implemented server-side
    // Placeholder for client-side reference
    const expire = Math.floor(Date.now() / 1000) + 3600 // 1 hour
    const token = this.generateToken()
    const signature = this.generateSignature(token, expire)

    return {
      token,
      expire,
      signature,
    }
  }

  /**
   * Generate authentication token
   */
  private generateToken(): string {
    return Math.random().toString(36).substring(2, 15)
  }

  /**
   * Generate signature for authentication
   */
  private generateSignature(token: string, expire: number): string {
    // In production, this should use HMAC-SHA1 with private key
    return `${token}_${expire}_signature`
  }
}

/**
 * Create ImageKit service instance
 */
export function createImageKitService(config: ImageKitConfig): ImageKitService {
  return new ImageKitService(config)
}
