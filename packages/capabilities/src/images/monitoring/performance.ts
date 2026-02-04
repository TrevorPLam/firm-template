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
 * Image performance monitoring and metrics collection
 */

import type { ImagePerformanceMetrics, ImageLoadEvent, ImageFormat } from '../types'

/**
 * Image performance monitor
 */
export class ImagePerformanceMonitor {
  private metrics: ImagePerformanceMetrics = {
    totalImages: 0,
    imagesLoaded: 0,
    imagesFailed: 0,
    bytesTransferred: 0,
    averageLoadTime: 0,
    lazyLoadedImages: 0,
    cachedImages: 0,
    formatDistribution: {} as Record<ImageFormat, number>,
  }

  private loadEvents: ImageLoadEvent[] = []
  private loadTimes: number[] = []
  private observers: Array<(metrics: ImagePerformanceMetrics) => void> = []

  /**
   * Initialize performance monitoring
   */
  initialize(): void {
    if (typeof window === 'undefined' || !window.performance) {
      console.warn('Performance API not available')
      return
    }

    // Monitor existing images
    this.monitorExistingImages()

    // Monitor new images
    this.monitorNewImages()

    // Monitor performance entries
    this.monitorPerformanceEntries()
  }

  /**
   * Monitor existing images on page
   */
  private monitorExistingImages(): void {
    if (typeof document === 'undefined') return

    const images = document.querySelectorAll<HTMLImageElement>('img')

    images.forEach((img) => {
      this.metrics.totalImages++

      if (img.complete) {
        this.onImageLoaded(img)
      } else {
        img.addEventListener('load', () => this.onImageLoaded(img))
        img.addEventListener('error', () => this.onImageError(img))
      }
    })
  }

  /**
   * Monitor dynamically added images
   */
  private monitorNewImages(): void {
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLImageElement) {
            this.metrics.totalImages++
            node.addEventListener('load', () => this.onImageLoaded(node))
            node.addEventListener('error', () => this.onImageError(node))
          } else if (node instanceof Element) {
            const images = node.querySelectorAll<HTMLImageElement>('img')
            images.forEach((img) => {
              this.metrics.totalImages++
              img.addEventListener('load', () => this.onImageLoaded(img))
              img.addEventListener('error', () => this.onImageError(img))
            })
          }
        })
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  /**
   * Monitor performance entries
   */
  private monitorPerformanceEntries(): void {
    if (typeof window === 'undefined' || !window.performance) return

    // Check existing entries
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    entries.forEach((entry) => {
      if (this.isImageResource(entry)) {
        this.processResourceTiming(entry)
      }
    })

    // Monitor new entries
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries() as PerformanceResourceTiming[]
          entries.forEach((entry) => {
            if (this.isImageResource(entry)) {
              this.processResourceTiming(entry)
            }
          })
        })

        observer.observe({ type: 'resource', buffered: true })
      } catch (error) {
        console.warn('Failed to observe performance entries:', error)
      }
    }
  }

  /**
   * Check if resource is an image
   */
  private isImageResource(entry: PerformanceResourceTiming): boolean {
    return (
      entry.initiatorType === 'img' ||
      /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(entry.name)
    )
  }

  /**
   * Process resource timing entry
   */
  private processResourceTiming(entry: PerformanceResourceTiming): void {
    const loadTime = entry.responseEnd - entry.startTime
    const size = entry.transferSize || entry.encodedBodySize || 0
    const cached = entry.transferSize === 0 && entry.decodedBodySize > 0

    const format = this.getFormatFromUrl(entry.name)

    const event: ImageLoadEvent = {
      url: entry.name,
      loadTime,
      size,
      format,
      dimensions: {
        width: 0,
        height: 0,
      },
      cached,
      lazy: false,
      timestamp: Date.now(),
    }

    this.loadEvents.push(event)
    this.loadTimes.push(loadTime)

    // Update metrics
    this.metrics.bytesTransferred += size

    if (cached) {
      this.metrics.cachedImages++
    }

    // Update format distribution
    if (!this.metrics.formatDistribution[format]) {
      this.metrics.formatDistribution[format] = 0
    }
    this.metrics.formatDistribution[format]++

    // Recalculate average
    this.metrics.averageLoadTime =
      this.loadTimes.reduce((a, b) => a + b, 0) / this.loadTimes.length

    this.notifyObservers()
  }

  /**
   * Get image format from URL
   */
  private getFormatFromUrl(url: string): ImageFormat {
    const extension = url.split('.').pop()?.toLowerCase().split('?')[0]

    const formatMap: Record<string, ImageFormat> = {
      jpg: 'jpeg',
      jpeg: 'jpeg',
      png: 'png',
      webp: 'webp',
      avif: 'avif',
      gif: 'gif',
      svg: 'svg',
    }

    return (extension && formatMap[extension]) || 'jpeg'
  }

  /**
   * Handle image loaded
   */
  private onImageLoaded(img: HTMLImageElement): void {
    this.metrics.imagesLoaded++

    // Check if lazy loaded
    if (img.loading === 'lazy' || img.classList.contains('lazy-loaded')) {
      this.metrics.lazyLoadedImages++
    }

    this.notifyObservers()
  }

  /**
   * Handle image error
   */
  private onImageError(img: HTMLImageElement): void {
    this.metrics.imagesFailed++
    this.notifyObservers()
  }

  /**
   * Subscribe to metrics updates
   */
  subscribe(callback: (metrics: ImagePerformanceMetrics) => void): () => void {
    this.observers.push(callback)
    return () => {
      this.observers = this.observers.filter((cb) => cb !== callback)
    }
  }

  /**
   * Notify observers of metric changes
   */
  private notifyObservers(): void {
    this.observers.forEach((callback) => callback(this.getMetrics()))
  }

  /**
   * Get current metrics
   */
  getMetrics(): ImagePerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * Get load events
   */
  getLoadEvents(): ImageLoadEvent[] {
    return [...this.loadEvents]
  }

  /**
   * Get performance score (0-100)
   */
  getScore(): number {
    const scores: number[] = []

    // Load success rate
    const successRate =
      this.metrics.totalImages > 0
        ? this.metrics.imagesLoaded / this.metrics.totalImages
        : 1
    scores.push(successRate * 100)

    // Average load time score (< 100ms = 100, > 1000ms = 0)
    const loadTimeScore = Math.max(0, 100 - (this.metrics.averageLoadTime / 1000) * 100)
    scores.push(loadTimeScore)

    // Cache hit rate
    const cacheRate =
      this.metrics.imagesLoaded > 0
        ? this.metrics.cachedImages / this.metrics.imagesLoaded
        : 0
    scores.push(cacheRate * 100)

    // Lazy loading adoption
    const lazyRate =
      this.metrics.totalImages > 0
        ? this.metrics.lazyLoadedImages / this.metrics.totalImages
        : 0
    scores.push(lazyRate * 50 + 50) // 50 points base + 50 for full adoption

    // Modern format usage (WebP, AVIF)
    const modernFormats =
      (this.metrics.formatDistribution.webp || 0) + (this.metrics.formatDistribution.avif || 0)
    const modernFormatRate =
      this.metrics.imagesLoaded > 0 ? modernFormats / this.metrics.imagesLoaded : 0
    scores.push(modernFormatRate * 100)

    // Calculate weighted average
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  /**
   * Generate performance report
   */
  generateReport(): {
    metrics: ImagePerformanceMetrics
    score: number
    recommendations: string[]
    summary: string
  } {
    const metrics = this.getMetrics()
    const score = this.getScore()
    const recommendations: string[] = []

    // Analyze and generate recommendations
    if (metrics.imagesFailed > 0) {
      const failureRate = (metrics.imagesFailed / metrics.totalImages) * 100
      recommendations.push(
        `${metrics.imagesFailed} images (${failureRate.toFixed(1)}%) failed to load. Review image URLs and hosting.`
      )
    }

    if (metrics.averageLoadTime > 500) {
      recommendations.push(
        `Average load time (${metrics.averageLoadTime.toFixed(0)}ms) is high. Consider image optimization and CDN usage.`
      )
    }

    const lazyLoadingRate = (metrics.lazyLoadedImages / metrics.totalImages) * 100
    if (lazyLoadingRate < 50) {
      recommendations.push(
        `Only ${lazyLoadingRate.toFixed(0)}% of images use lazy loading. Enable lazy loading for below-the-fold images.`
      )
    }

    const modernFormatCount =
      (metrics.formatDistribution.webp || 0) + (metrics.formatDistribution.avif || 0)
    const modernFormatRate = (modernFormatCount / metrics.imagesLoaded) * 100
    if (modernFormatRate < 50) {
      recommendations.push(
        `Only ${modernFormatRate.toFixed(0)}% of images use modern formats. Convert to WebP or AVIF for better compression.`
      )
    }

    const cacheRate = (metrics.cachedImages / metrics.imagesLoaded) * 100
    if (cacheRate < 80) {
      recommendations.push(
        `Cache hit rate is ${cacheRate.toFixed(0)}%. Implement proper caching headers and CDN.`
      )
    }

    const avgSize = metrics.bytesTransferred / metrics.imagesLoaded
    if (avgSize > 100 * 1024) {
      recommendations.push(
        `Average image size (${(avgSize / 1024).toFixed(0)}KB) is large. Optimize and compress images.`
      )
    }

    const summary = `Loaded ${metrics.imagesLoaded}/${metrics.totalImages} images (${metrics.imagesFailed} failed). Average load time: ${metrics.averageLoadTime.toFixed(0)}ms. Total transferred: ${(metrics.bytesTransferred / 1024 / 1024).toFixed(2)}MB.`

    return {
      metrics,
      score,
      recommendations,
      summary,
    }
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics = {
      totalImages: 0,
      imagesLoaded: 0,
      imagesFailed: 0,
      bytesTransferred: 0,
      averageLoadTime: 0,
      lazyLoadedImages: 0,
      cachedImages: 0,
      formatDistribution: {} as Record<ImageFormat, number>,
    }
    this.loadEvents = []
    this.loadTimes = []
    this.notifyObservers()
  }

  /**
   * Export metrics to JSON
   */
  exportMetrics(): string {
    return JSON.stringify(
      {
        metrics: this.metrics,
        loadEvents: this.loadEvents,
        report: this.generateReport(),
      },
      null,
      2
    )
  }
}

/**
 * Create image performance monitor instance
 */
export function createImagePerformanceMonitor(): ImagePerformanceMonitor {
  const monitor = new ImagePerformanceMonitor()
  monitor.initialize()
  return monitor
}

/**
 * Get image loading performance from Performance API
 */
export function getImageLoadingPerformance(): Array<{
  url: string
  duration: number
  size: number
  cached: boolean
}> {
  if (typeof window === 'undefined' || !window.performance) {
    return []
  }

  const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]

  return entries
    .filter(
      (entry) =>
        entry.initiatorType === 'img' || /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(entry.name)
    )
    .map((entry) => ({
      url: entry.name,
      duration: entry.responseEnd - entry.startTime,
      size: entry.transferSize || entry.encodedBodySize || 0,
      cached: entry.transferSize === 0 && entry.decodedBodySize > 0,
    }))
}
