/**
 * Cloudinary CDN integration
 */

import type {
  CloudinaryConfig,
  ImageTransformation,
  OptimizationResult,
  ImageUploadOptions,
  ImageUploadResult,
  ResponsiveImageConfig,
} from '../types'

/**
 * Cloudinary image service
 */
export class CloudinaryService {
  private config: CloudinaryConfig

  constructor(config: CloudinaryConfig) {
    this.config = config
  }

  /**
   * Generate Cloudinary URL with transformations
   */
  getImageUrl(publicId: string, transformations?: ImageTransformation): string {
    const protocol = this.config.secure !== false ? 'https' : 'http'
    const baseUrl = `${protocol}://res.cloudinary.com/${this.config.cloudName}/image/upload`

    const transformString = this.buildTransformationString(transformations)
    const url = transformString
      ? `${baseUrl}/${transformString}/${publicId}`
      : `${baseUrl}/${publicId}`

    return url
  }

  /**
   * Build Cloudinary transformation string
   */
  private buildTransformationString(transformations?: ImageTransformation): string {
    if (!transformations) return ''

    const parts: string[] = []

    if (transformations.width) parts.push(`w_${transformations.width}`)
    if (transformations.height) parts.push(`h_${transformations.height}`)
    if (transformations.crop) parts.push(`c_${transformations.crop}`)
    if (transformations.gravity) parts.push(`g_${transformations.gravity}`)
    if (transformations.quality) parts.push(`q_${transformations.quality}`)
    if (transformations.format) parts.push(`f_${transformations.format}`)
    if (transformations.dpr) parts.push(`dpr_${transformations.dpr}`)
    if (transformations.aspectRatio) parts.push(`ar_${transformations.aspectRatio}`)
    if (transformations.blur) parts.push(`e_blur:${transformations.blur}`)
    if (transformations.sharpen) parts.push(`e_sharpen:${transformations.sharpen}`)
    if (transformations.background) parts.push(`b_${transformations.background}`)

    if (transformations.auto) {
      transformations.auto.forEach((auto) => {
        parts.push(`${auto}_auto`)
      })
    }

    return parts.join(',')
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
   * Upload image to Cloudinary
   */
  async uploadImage(options: ImageUploadOptions): Promise<ImageUploadResult> {
    if (!this.config.apiKey || !this.config.apiSecret) {
      throw new Error('API credentials required for upload')
    }

    const formData = new FormData()
    formData.append('file', options.file)
    formData.append('api_key', this.config.apiKey)

    if (options.folder) formData.append('folder', options.folder)
    if (options.publicId) formData.append('public_id', options.publicId)
    if (options.tags) formData.append('tags', options.tags.join(','))
    if (options.uploadPreset) formData.append('upload_preset', options.uploadPreset)
    if (options.overwrite) formData.append('overwrite', 'true')

    // Add transformation if specified
    if (options.transformations) {
      const transformString = this.buildTransformationString(options.transformations)
      if (transformString) {
        formData.append('transformation', transformString)
      }
    }

    // Generate signature
    const timestamp = Math.round(Date.now() / 1000)
    formData.append('timestamp', timestamp.toString())

    const signature = await this.generateSignature(timestamp, options)
    formData.append('signature', signature)

    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/upload`

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      success: true,
      publicId: data.public_id,
      url: data.url,
      secureUrl: data.secure_url,
      format: data.format,
      size: data.bytes,
      dimensions: {
        width: data.width,
        height: data.height,
      },
      createdAt: new Date(data.created_at),
    }
  }

  /**
   * Generate upload signature
   */
  private async generateSignature(timestamp: number, options: ImageUploadOptions): Promise<string> {
    // In a real implementation, this should be done server-side
    // This is a placeholder showing the signature format
    const params: Record<string, string> = {
      timestamp: timestamp.toString(),
    }

    if (options.folder) params.folder = options.folder
    if (options.publicId) params.public_id = options.publicId

    // Sort params and create signature string
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join('&')

    const signatureString = `${sortedParams}${this.config.apiSecret}`

    // Hash with SHA-1 (in real implementation, use crypto library)
    return this.sha1Hash(signatureString)
  }

  /**
   * Simple SHA-1 hash (placeholder - use proper crypto library in production)
   */
  private async sha1Hash(str: string): Promise<string> {
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      const encoder = new TextEncoder()
      const data = encoder.encode(str)
      const hashBuffer = await crypto.subtle.digest('SHA-1', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    }

    // Node.js environment
    try {
      const crypto = await import('crypto')
      return crypto.createHash('sha1').update(str).digest('hex')
    } catch {
      throw new Error('Crypto not available')
    }
  }

  /**
   * Optimize image with Cloudinary
   */
  async optimizeImage(publicId: string, options?: ImageTransformation): Promise<OptimizationResult> {
    const originalUrl = this.getImageUrl(publicId)

    const optimizedTransformations: ImageTransformation = {
      ...options,
      auto: ['format', 'quality'],
      format: options?.format || 'auto',
    }

    const optimizedUrl = this.getImageUrl(publicId, optimizedTransformations)

    // Fetch sizes for comparison
    const [originalSize, optimizedSize] = await Promise.all([
      this.getImageSize(originalUrl),
      this.getImageSize(optimizedUrl),
    ])

    const reduction = ((originalSize - optimizedSize) / originalSize) * 100

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
  getLQIP(publicId: string, quality = 10, width = 20): string {
    return this.getImageUrl(publicId, {
      width,
      quality,
      format: 'auto',
      crop: 'scale',
    })
  }

  /**
   * Get image metadata
   */
  async getImageMetadata(publicId: string): Promise<{
    width: number
    height: number
    format: string
    size: number
    colors?: string[]
  }> {
    // This would require the Cloudinary Admin API
    // Placeholder implementation
    const url = this.getImageUrl(publicId)
    const response = await fetch(url, { method: 'HEAD' })

    return {
      width: 0,
      height: 0,
      format: 'unknown',
      size: parseInt(response.headers.get('content-length') || '0', 10),
    }
  }

  /**
   * Delete image from Cloudinary
   */
  async deleteImage(publicId: string): Promise<boolean> {
    if (!this.config.apiKey || !this.config.apiSecret) {
      throw new Error('API credentials required for deletion')
    }

    const timestamp = Math.round(Date.now() / 1000)
    const signature = await this.generateSignature(timestamp, { file: new Blob(), publicId })

    const deleteUrl = `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/destroy`

    const response = await fetch(deleteUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_id: publicId,
        api_key: this.config.apiKey,
        timestamp,
        signature,
      }),
    })

    const data = await response.json()
    return data.result === 'ok'
  }
}

/**
 * Create Cloudinary service instance
 */
export function createCloudinaryService(config: CloudinaryConfig): CloudinaryService {
  return new CloudinaryService(config)
}
