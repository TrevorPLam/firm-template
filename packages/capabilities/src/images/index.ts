/**
 * Image optimization main exports
 */

// Types
export type {
  ImageFormat,
  ImageTransformation,
  ResponsiveImageConfig,
  CDNConfig,
  CloudinaryConfig,
  ImageKitConfig,
  OptimizationResult,
  LazyLoadConfig,
  PlaceholderStrategy,
  PlaceholderConfig,
  LQIP,
  BlurhashData,
  ImagePerformanceMetrics,
  ImageLoadEvent,
  ImageOptimizationReport,
  ImageUploadOptions,
  ImageUploadResult,
  ImageCacheEntry,
  ProcessorConfig,
} from './types'

// CDN Services
export { CloudinaryService, createCloudinaryService } from './cdn/cloudinary'
export { ImageKitService, createImageKitService } from './cdn/imagekit'

// Image Processing
export { ImageProcessor, createImageProcessor } from './optimization/processor'

// Lazy Loading
export {
  LazyLoader,
  createLazyLoader,
  autoInitLazyLoading,
  preloadPriorityImages,
} from './loading/lazy-loader'

// Placeholders
export {
  PlaceholderGenerator,
  createPlaceholderGenerator,
  generateLQIPFromUrl,
  generateBlurhashFromUrl,
  extractDominantColor,
  createPlaceholderImage,
  applyPlaceholder,
  batchGeneratePlaceholders,
} from './loading/placeholders'

// Performance Monitoring
export {
  ImagePerformanceMonitor,
  createImagePerformanceMonitor,
  getImageLoadingPerformance,
} from './monitoring/performance'

/**
 * Create complete image optimization system
 */
export function createImageOptimizer(config: {
  cdn?: {
    provider: 'cloudinary' | 'imagekit'
    config: import('./types').CloudinaryConfig | import('./types').ImageKitConfig
  }
  lazyLoading?: Partial<import('./types').LazyLoadConfig>
  placeholder?: import('./types').PlaceholderConfig
  processor?: Partial<import('./types').ProcessorConfig>
  monitoring?: boolean
}) {
  const { cdn, lazyLoading, placeholder, processor, monitoring = true } = config

  // Initialize CDN service
  let cdnService: CloudinaryService | ImageKitService | null = null
  if (cdn) {
    if (cdn.provider === 'cloudinary') {
      cdnService = new CloudinaryService(cdn.config as import('./types').CloudinaryConfig)
    } else if (cdn.provider === 'imagekit') {
      cdnService = new ImageKitService(cdn.config as import('./types').ImageKitConfig)
    }
  }

  // Initialize lazy loader
  const lazyLoader = lazyLoading ? new LazyLoader(lazyLoading) : null

  // Initialize placeholder generator
  const placeholderGenerator = placeholder
    ? new PlaceholderGenerator(placeholder)
    : null

  // Initialize image processor
  const imageProcessor = new ImageProcessor(processor)

  // Initialize performance monitor
  const performanceMonitor = monitoring ? createImagePerformanceMonitor() : null

  return {
    cdn: cdnService,
    lazyLoader,
    placeholderGenerator,
    processor: imageProcessor,
    monitor: performanceMonitor,

    /**
     * Get optimized image URL
     */
    getOptimizedUrl(
      source: string,
      transformations?: import('./types').ImageTransformation
    ): string {
      if (!cdnService) {
        throw new Error('CDN service not configured')
      }

      if (cdnService instanceof CloudinaryService) {
        return cdnService.getImageUrl(source, transformations)
      } else if (cdnService instanceof ImageKitService) {
        return cdnService.getImageUrl(source, transformations)
      }

      return source
    },

    /**
     * Generate responsive image srcset
     */
    generateSrcSet(config: import('./types').ResponsiveImageConfig): string {
      if (!cdnService) {
        throw new Error('CDN service not configured')
      }

      return cdnService.generateSrcSet(config)
    },

    /**
     * Generate picture element configuration
     */
    generatePicture(config: import('./types').ResponsiveImageConfig): {
      sources: Array<{ srcset: string; type: string; sizes?: string }>
      img: { src: string; alt: string; loading?: 'lazy' | 'eager' }
    } {
      if (!cdnService) {
        throw new Error('CDN service not configured')
      }

      return cdnService.generatePictureElement(config)
    },

    /**
     * Process image with transformations
     */
    async processImage(
      source: string | Blob | File,
      transformations: import('./types').ImageTransformation
    ): Promise<Blob> {
      return imageProcessor.processImage(source, transformations)
    },

    /**
     * Generate placeholder for image
     */
    async generatePlaceholder(
      source: string | Blob | File
    ): Promise<string | import('./types').LQIP | import('./types').BlurhashData> {
      if (!placeholderGenerator) {
        throw new Error('Placeholder generator not configured')
      }

      return placeholderGenerator.generatePlaceholder(source)
    },

    /**
     * Enable lazy loading for images
     */
    enableLazyLoading(selector = 'img[data-src]'): void {
      if (!lazyLoader) {
        throw new Error('Lazy loader not configured')
      }

      lazyLoader.observeAll(selector)
    },

    /**
     * Upload image to CDN
     */
    async uploadImage(
      options: import('./types').ImageUploadOptions
    ): Promise<import('./types').ImageUploadResult> {
      if (!cdnService) {
        throw new Error('CDN service not configured')
      }

      if (cdnService instanceof CloudinaryService) {
        return cdnService.uploadImage(options)
      } else if (cdnService instanceof ImageKitService) {
        return cdnService.uploadImage(options)
      }

      throw new Error('Upload not supported for this CDN')
    },

    /**
     * Get performance metrics
     */
    getPerformanceMetrics(): import('./types').ImagePerformanceMetrics | null {
      return performanceMonitor?.getMetrics() || null
    },

    /**
     * Generate performance report
     */
    generatePerformanceReport(): {
      metrics: import('./types').ImagePerformanceMetrics
      score: number
      recommendations: string[]
      summary: string
    } | null {
      return performanceMonitor?.generateReport() || null
    },

    /**
     * Subscribe to performance updates
     */
    onPerformanceUpdate(
      callback: (metrics: import('./types').ImagePerformanceMetrics) => void
    ): (() => void) | null {
      return performanceMonitor?.subscribe(callback) || null
    },

    /**
     * Cleanup resources
     */
    destroy(): void {
      lazyLoader?.destroy()
    },
  }
}

/**
 * Auto-initialize image optimization with sensible defaults
 */
export function autoInitImageOptimization(config?: {
  lazyLoading?: boolean
  placeholder?: 'lqip' | 'blurhash' | 'color'
  monitoring?: boolean
}): ReturnType<typeof createImageOptimizer> {
  const {
    lazyLoading = true,
    placeholder = 'lqip',
    monitoring = true,
  } = config || {}

  const optimizer = createImageOptimizer({
    lazyLoading: lazyLoading
      ? {
          rootMargin: '50px',
          threshold: 0.01,
          placeholder: placeholder,
          fadeInDuration: 300,
          native: true,
        }
      : undefined,
    placeholder: {
      strategy: placeholder,
      lqipQuality: 10,
      blurhashComponents: { x: 4, y: 3 },
    },
    processor: {
      maxConcurrency: 5,
      defaultQuality: 80,
      progressive: true,
      optimize: true,
    },
    monitoring,
  })

  // Auto-enable lazy loading
  if (lazyLoading && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        optimizer.enableLazyLoading()
      })
    } else {
      optimizer.enableLazyLoading()
    }
  }

  return optimizer
}
