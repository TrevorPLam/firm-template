/**
 * Type definitions for image optimization system
 */

/**
 * Image format types
 */
export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'avif' | 'gif' | 'svg'

/**
 * Image transformation options
 */
export interface ImageTransformation {
  /** Target width in pixels */
  width?: number
  /** Target height in pixels */
  height?: number
  /** Aspect ratio to maintain */
  aspectRatio?: string
  /** Crop mode */
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad'
  /** Crop gravity/focus */
  gravity?: 'auto' | 'center' | 'north' | 'south' | 'east' | 'west' | 'face' | 'faces'
  /** Output format */
  format?: ImageFormat
  /** Quality (1-100) */
  quality?: number
  /** DPR (device pixel ratio) */
  dpr?: number
  /** Blur effect */
  blur?: number
  /** Sharpen effect */
  sharpen?: number
  /** Auto optimization */
  auto?: Array<'format' | 'quality' | 'brightness' | 'contrast'>
  /** Background color for padding */
  background?: string
}

/**
 * Responsive image configuration
 */
export interface ResponsiveImageConfig {
  /** Base image URL */
  src: string
  /** Breakpoints (widths in pixels) */
  breakpoints: number[]
  /** Sizes attribute for responsive images */
  sizes?: string
  /** Transformations to apply */
  transformations?: ImageTransformation
  /** Output formats to generate */
  formats?: ImageFormat[]
  /** Enable lazy loading */
  lazy?: boolean
}

/**
 * CDN provider configuration
 */
export interface CDNConfig {
  /** CDN provider name */
  provider: 'cloudinary' | 'imagekit' | 'custom'
  /** Cloud/account name */
  cloudName?: string
  /** API key */
  apiKey?: string
  /** API secret */
  apiSecret?: string
  /** Base URL for custom CDN */
  baseUrl?: string
  /** Enable secure URLs */
  secure?: boolean
  /** Default transformations */
  defaultTransformations?: ImageTransformation
}

/**
 * Cloudinary-specific configuration
 */
export interface CloudinaryConfig extends CDNConfig {
  provider: 'cloudinary'
  cloudName: string
  /** Upload preset */
  uploadPreset?: string
  /** Folder path */
  folder?: string
}

/**
 * ImageKit-specific configuration
 */
export interface ImageKitConfig extends CDNConfig {
  provider: 'imagekit'
  /** ImageKit URL endpoint */
  urlEndpoint: string
  /** Public key */
  publicKey?: string
  /** Private key */
  privateKey?: string
}

/**
 * Image optimization result
 */
export interface OptimizationResult {
  /** Original image URL */
  originalUrl: string
  /** Optimized image URL */
  optimizedUrl: string
  /** Original size in bytes */
  originalSize: number
  /** Optimized size in bytes */
  optimizedSize: number
  /** Size reduction percentage */
  reduction: number
  /** Output format */
  format: ImageFormat
  /** Dimensions */
  dimensions: {
    width: number
    height: number
  }
  /** Transformations applied */
  transformations: ImageTransformation
}

/**
 * Lazy loading configuration
 */
export interface LazyLoadConfig {
  /** Root margin for intersection observer */
  rootMargin?: string
  /** Intersection threshold */
  threshold?: number
  /** Loading placeholder strategy */
  placeholder?: 'blur' | 'color' | 'lqip' | 'none'
  /** Fade-in animation duration (ms) */
  fadeInDuration?: number
  /** Enable native lazy loading */
  native?: boolean
  /** Preload priority images */
  priority?: boolean
}

/**
 * Placeholder strategy
 */
export type PlaceholderStrategy = 'lqip' | 'blurhash' | 'color' | 'svg' | 'none'

/**
 * Placeholder configuration
 */
export interface PlaceholderConfig {
  /** Placeholder strategy */
  strategy: PlaceholderStrategy
  /** Background color */
  color?: string
  /** LQIP quality (1-100) */
  lqipQuality?: number
  /** Blurhash components */
  blurhashComponents?: { x: number; y: number }
  /** SVG placeholder path */
  svgPlaceholder?: string
}

/**
 * LQIP (Low Quality Image Placeholder) data
 */
export interface LQIP {
  /** Base64 encoded image data */
  dataUrl: string
  /** Width */
  width: number
  /** Height */
  height: number
  /** Aspect ratio */
  aspectRatio: number
}

/**
 * Blurhash placeholder data
 */
export interface BlurhashData {
  /** Blurhash string */
  hash: string
  /** Width */
  width: number
  /** Height */
  height: number
  /** Aspect ratio */
  aspectRatio: number
}

/**
 * Image performance metrics
 */
export interface ImagePerformanceMetrics {
  /** Total number of images */
  totalImages: number
  /** Images loaded */
  imagesLoaded: number
  /** Images failed */
  imagesFailed: number
  /** Total bytes transferred */
  bytesTransferred: number
  /** Average load time (ms) */
  averageLoadTime: number
  /** Lazy loaded images */
  lazyLoadedImages: number
  /** Images from cache */
  cachedImages: number
  /** Format distribution */
  formatDistribution: Record<ImageFormat, number>
}

/**
 * Image loading event
 */
export interface ImageLoadEvent {
  /** Image URL */
  url: string
  /** Load time (ms) */
  loadTime: number
  /** File size (bytes) */
  size: number
  /** Image format */
  format: ImageFormat
  /** Dimensions */
  dimensions: {
    width: number
    height: number
  }
  /** Whether loaded from cache */
  cached: boolean
  /** Whether lazy loaded */
  lazy: boolean
  /** Timestamp */
  timestamp: number
}

/**
 * Image optimization report
 */
export interface ImageOptimizationReport {
  /** Report timestamp */
  timestamp: number
  /** Total images processed */
  totalImages: number
  /** Total size before optimization (bytes) */
  totalSizeBefore: number
  /** Total size after optimization (bytes) */
  totalSizeAfter: number
  /** Total reduction percentage */
  totalReduction: number
  /** Individual image results */
  results: OptimizationResult[]
  /** Performance metrics */
  metrics: ImagePerformanceMetrics
  /** Recommendations */
  recommendations: string[]
}

/**
 * Image upload options
 */
export interface ImageUploadOptions {
  /** File to upload */
  file: File | Blob | Buffer
  /** Folder/path */
  folder?: string
  /** Public ID */
  publicId?: string
  /** Tags */
  tags?: string[]
  /** Transformations to apply on upload */
  transformations?: ImageTransformation
  /** Overwrite existing */
  overwrite?: boolean
  /** Upload preset */
  uploadPreset?: string
}

/**
 * Image upload result
 */
export interface ImageUploadResult {
  /** Upload success */
  success: boolean
  /** Public ID */
  publicId: string
  /** Image URL */
  url: string
  /** Secure URL */
  secureUrl: string
  /** Format */
  format: ImageFormat
  /** Size in bytes */
  size: number
  /** Dimensions */
  dimensions: {
    width: number
    height: number
  }
  /** Created at */
  createdAt: Date
}

/**
 * Image cache entry
 */
export interface ImageCacheEntry {
  /** Cache key */
  key: string
  /** Image URL */
  url: string
  /** Cached data */
  data: string | Blob
  /** Cache timestamp */
  timestamp: number
  /** Expiry timestamp */
  expiresAt: number
  /** Size in bytes */
  size: number
}

/**
 * Image processor configuration
 */
export interface ProcessorConfig {
  /** Maximum concurrent processing */
  maxConcurrency: number
  /** Default quality */
  defaultQuality: number
  /** Enable progressive JPEGs */
  progressive: boolean
  /** Enable optimization */
  optimize: boolean
  /** Strip metadata */
  stripMetadata: boolean
  /** Auto-orient images */
  autoOrient: boolean
}
