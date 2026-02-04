/**
 * Advanced lazy loading with IntersectionObserver
 */

import type { LazyLoadConfig } from '../types'

/**
 * Default lazy loading configuration
 */
const DEFAULT_CONFIG: LazyLoadConfig = {
  rootMargin: '50px',
  threshold: 0.01,
  placeholder: 'blur',
  fadeInDuration: 300,
  native: true,
  priority: false,
}

/**
 * Lazy loader for images with advanced features
 */
export class LazyLoader {
  private config: LazyLoadConfig
  private observer: IntersectionObserver | null = null
  private loadedImages: Set<HTMLImageElement> = new Set()
  private pendingImages: Map<HTMLImageElement, () => void> = new Map()

  constructor(config: Partial<LazyLoadConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.initialize()
  }

  /**
   * Initialize IntersectionObserver
   */
  private initialize(): void {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            this.loadImage(img)
          }
        })
      },
      {
        rootMargin: this.config.rootMargin,
        threshold: this.config.threshold,
      }
    )
  }

  /**
   * Observe an image element
   */
  observe(img: HTMLImageElement): void {
    if (!this.observer) {
      // Fallback: load immediately if IntersectionObserver not available
      this.loadImage(img)
      return
    }

    // Skip if already loaded
    if (this.loadedImages.has(img)) {
      return
    }

    // Use native lazy loading if enabled and supported
    if (this.config.native && 'loading' in HTMLImageElement.prototype) {
      img.loading = 'lazy'
      this.loadImage(img)
      return
    }

    // Setup placeholder
    this.setupPlaceholder(img)

    // Observe element
    this.observer.observe(img)
  }

  /**
   * Setup placeholder before image loads
   */
  private setupPlaceholder(img: HTMLImageElement): void {
    const placeholder = this.config.placeholder

    if (placeholder === 'none') return

    // Store original src
    const originalSrc = img.getAttribute('data-src') || img.src
    if (originalSrc && !img.hasAttribute('data-src')) {
      img.setAttribute('data-src', originalSrc)
    }

    // Apply placeholder strategy
    switch (placeholder) {
      case 'blur': {
        const lqip = img.getAttribute('data-lqip')
        if (lqip) {
          img.src = lqip
          img.style.filter = 'blur(10px)'
          img.style.transition = `filter ${this.config.fadeInDuration}ms ease-in-out`
        }
        break
      }

      case 'color': {
        const color = img.getAttribute('data-color') || '#f0f0f0'
        img.style.backgroundColor = color
        break
      }

      case 'lqip': {
        const lqip = img.getAttribute('data-lqip')
        if (lqip) {
          img.src = lqip
          img.style.transition = `opacity ${this.config.fadeInDuration}ms ease-in-out`
        }
        break
      }
    }

    // Add loading class
    img.classList.add('lazy-loading')
  }

  /**
   * Load image
   */
  private loadImage(img: HTMLImageElement): void {
    if (this.loadedImages.has(img)) return

    const src = img.getAttribute('data-src') || img.src
    const srcset = img.getAttribute('data-srcset')

    // Create promise for load completion
    const loadPromise = new Promise<void>((resolve, reject) => {
      const tempImg = new Image()

      tempImg.onload = () => {
        this.onImageLoaded(img, src, srcset)
        resolve()
      }

      tempImg.onerror = () => {
        this.onImageError(img)
        reject(new Error(`Failed to load image: ${src}`))
      }

      // Start loading
      if (srcset) tempImg.srcset = srcset
      tempImg.src = src
    })

    // Store cleanup function
    this.pendingImages.set(img, () => {
      this.loadedImages.add(img)
      this.pendingImages.delete(img)
      if (this.observer) {
        this.observer.unobserve(img)
      }
    })

    // Handle load
    loadPromise.then(
      () => this.pendingImages.get(img)?.(),
      () => this.pendingImages.get(img)?.()
    )
  }

  /**
   * Handle image loaded successfully
   */
  private onImageLoaded(img: HTMLImageElement, src: string, srcset: string | null): void {
    // Update src/srcset
    img.src = src
    if (srcset) img.srcset = srcset

    // Remove placeholder
    if (this.config.placeholder === 'blur') {
      img.style.filter = 'none'
    }

    // Fade in animation
    if (this.config.fadeInDuration && this.config.fadeInDuration > 0) {
      img.style.opacity = '0'
      requestAnimationFrame(() => {
        img.style.transition = `opacity ${this.config.fadeInDuration}ms ease-in-out`
        img.style.opacity = '1'
      })
    }

    // Update classes
    img.classList.remove('lazy-loading')
    img.classList.add('lazy-loaded')

    // Dispatch event
    img.dispatchEvent(
      new CustomEvent('lazyloaded', {
        bubbles: true,
        detail: { src, srcset },
      })
    )
  }

  /**
   * Handle image load error
   */
  private onImageError(img: HTMLImageElement): void {
    img.classList.remove('lazy-loading')
    img.classList.add('lazy-error')

    // Dispatch error event
    img.dispatchEvent(
      new CustomEvent('lazyerror', {
        bubbles: true,
        detail: { src: img.getAttribute('data-src') },
      })
    )
  }

  /**
   * Observe multiple images
   */
  observeAll(selector: string = 'img[data-src]'): void {
    if (typeof document === 'undefined') return

    const images = document.querySelectorAll<HTMLImageElement>(selector)
    images.forEach((img) => this.observe(img))
  }

  /**
   * Unobserve an image
   */
  unobserve(img: HTMLImageElement): void {
    if (this.observer) {
      this.observer.unobserve(img)
    }
    this.pendingImages.delete(img)
  }

  /**
   * Force load an image immediately
   */
  loadNow(img: HTMLImageElement): void {
    if (this.observer) {
      this.observer.unobserve(img)
    }
    this.loadImage(img)
  }

  /**
   * Load all pending images
   */
  loadAll(): void {
    this.pendingImages.forEach((_, img) => this.loadNow(img))
  }

  /**
   * Get loading statistics
   */
  getStats(): {
    loaded: number
    pending: number
    total: number
    loadedPercentage: number
  } {
    const loaded = this.loadedImages.size
    const pending = this.pendingImages.size
    const total = loaded + pending

    return {
      loaded,
      pending,
      total,
      loadedPercentage: total > 0 ? (loaded / total) * 100 : 0,
    }
  }

  /**
   * Reset loader state
   */
  reset(): void {
    this.loadedImages.clear()
    this.pendingImages.clear()

    if (this.observer) {
      this.observer.disconnect()
      this.initialize()
    }
  }

  /**
   * Destroy loader and cleanup
   */
  destroy(): void {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }

    this.loadedImages.clear()
    this.pendingImages.clear()
  }
}

/**
 * Create lazy loader instance
 */
export function createLazyLoader(config?: Partial<LazyLoadConfig>): LazyLoader {
  return new LazyLoader(config)
}

/**
 * Auto-initialize lazy loading on DOM ready
 */
export function autoInitLazyLoading(
  config?: Partial<LazyLoadConfig>,
  selector: string = 'img[data-src]'
): LazyLoader {
  const loader = new LazyLoader(config)

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        loader.observeAll(selector)
      })
    } else {
      loader.observeAll(selector)
    }

    // Observer for dynamically added images
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLImageElement && node.matches(selector)) {
            loader.observe(node)
          } else if (node instanceof Element) {
            const images = node.querySelectorAll<HTMLImageElement>(selector)
            images.forEach((img) => loader.observe(img))
          }
        })
      })
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  return loader
}

/**
 * Preload priority images
 */
export function preloadPriorityImages(selector: string = 'img[data-priority]'): void {
  if (typeof document === 'undefined') return

  const priorityImages = document.querySelectorAll<HTMLImageElement>(selector)

  priorityImages.forEach((img) => {
    const src = img.getAttribute('data-src') || img.src

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src

    const srcset = img.getAttribute('data-srcset')
    if (srcset) {
      link.setAttribute('imagesrcset', srcset)
    }

    document.head.appendChild(link)
  })
}
