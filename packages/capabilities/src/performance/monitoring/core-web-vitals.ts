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
 * Core Web Vitals tracking and reporting
 */

import type {
  CoreWebVitals,
  WebVitalsReport,
  VitalsRating,
  NavigationType,
  PerformanceAlert,
} from '../types'

/**
 * Web Vitals thresholds (in milliseconds or units)
 */
export const VITALS_THRESHOLDS = {
  lcp: { good: 2500, poor: 4000 },
  fid: { good: 100, poor: 300 },
  cls: { good: 0.1, poor: 0.25 },
  fcp: { good: 1800, poor: 3000 },
  ttfb: { good: 800, poor: 1800 },
  inp: { good: 200, poor: 500 },
} as const

/**
 * Core Web Vitals tracker
 */
export class WebVitalsTracker {
  private vitals: CoreWebVitals = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    inp: null,
  }
  private reports: WebVitalsReport[] = []
  private alerts: PerformanceAlert[] = []
  private observers: Map<string, PerformanceObserver> = new Map()
  private callbacks: Array<(report: WebVitalsReport) => void> = []

  /**
   * Initialize Web Vitals tracking
   */
  initialize(): void {
    if (typeof window === 'undefined' || !window.performance) {
      console.warn('Performance API not available')
      return
    }

    this.trackLCP()
    this.trackFID()
    this.trackCLS()
    this.trackFCP()
    this.trackTTFB()
    this.trackINP()
  }

  /**
   * Track Largest Contentful Paint (LCP)
   */
  private trackLCP(): void {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          renderTime?: number
          loadTime?: number
        }

        if (lastEntry) {
          const value = lastEntry.renderTime || lastEntry.loadTime || 0
          this.updateVital('lcp', value)
        }
      })

      observer.observe({ type: 'largest-contentful-paint', buffered: true })
      this.observers.set('lcp', observer)
    } catch (error) {
      console.error('Error tracking LCP:', error)
    }
  }

  /**
   * Track First Input Delay (FID)
   */
  private trackFID(): void {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        for (const entry of entries) {
          if (entry.entryType === 'first-input') {
            const fidEntry = entry as PerformanceEntry & { processingStart?: number }
            const value = fidEntry.processingStart
              ? fidEntry.processingStart - entry.startTime
              : 0
            this.updateVital('fid', value)
          }
        }
      })

      observer.observe({ type: 'first-input', buffered: true })
      this.observers.set('fid', observer)
    } catch (error) {
      console.error('Error tracking FID:', error)
    }
  }

  /**
   * Track Cumulative Layout Shift (CLS)
   */
  private trackCLS(): void {
    if (!('PerformanceObserver' in window)) return

    let clsValue = 0
    let sessionValue = 0
    let sessionEntries: PerformanceEntry[] = []

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()

        for (const entry of entries) {
          const layoutShiftEntry = entry as PerformanceEntry & {
            hadRecentInput?: boolean
            value?: number
          }

          if (!layoutShiftEntry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0]
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1]

            if (
              sessionValue &&
              entry.startTime - (lastSessionEntry?.startTime || 0) < 1000 &&
              entry.startTime - (firstSessionEntry?.startTime || 0) < 5000
            ) {
              sessionValue += layoutShiftEntry.value || 0
              sessionEntries.push(entry)
            } else {
              sessionValue = layoutShiftEntry.value || 0
              sessionEntries = [entry]
            }

            if (sessionValue > clsValue) {
              clsValue = sessionValue
              this.updateVital('cls', clsValue)
            }
          }
        }
      })

      observer.observe({ type: 'layout-shift', buffered: true })
      this.observers.set('cls', observer)
    } catch (error) {
      console.error('Error tracking CLS:', error)
    }
  }

  /**
   * Track First Contentful Paint (FCP)
   */
  private trackFCP(): void {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        for (const entry of entries) {
          if (entry.name === 'first-contentful-paint') {
            this.updateVital('fcp', entry.startTime)
          }
        }
      })

      observer.observe({ type: 'paint', buffered: true })
      this.observers.set('fcp', observer)
    } catch (error) {
      console.error('Error tracking FCP:', error)
    }
  }

  /**
   * Track Time to First Byte (TTFB)
   */
  private trackTTFB(): void {
    if (typeof window === 'undefined' || !window.performance) return

    try {
      const navEntry = performance.getEntriesByType('navigation')[0] as
        | (PerformanceEntry & { responseStart?: number })
        | undefined

      if (navEntry?.responseStart) {
        this.updateVital('ttfb', navEntry.responseStart)
      }
    } catch (error) {
      console.error('Error tracking TTFB:', error)
    }
  }

  /**
   * Track Interaction to Next Paint (INP)
   */
  private trackINP(): void {
    if (!('PerformanceObserver' in window)) return

    let longestInteraction = 0

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()

        for (const entry of entries) {
          const eventEntry = entry as PerformanceEntry & {
            processingStart?: number
            processingEnd?: number
          }

          if (eventEntry.processingStart && eventEntry.processingEnd) {
            const duration = eventEntry.processingEnd - eventEntry.processingStart

            if (duration > longestInteraction) {
              longestInteraction = duration
              this.updateVital('inp', duration)
            }
          }
        }
      })

      observer.observe({ type: 'event', buffered: true, durationThreshold: 16 })
      this.observers.set('inp', observer)
    } catch (error) {
      // INP might not be supported in all browsers
      console.debug('INP tracking not available:', error)
    }
  }

  /**
   * Update vital metric and create report
   */
  private updateVital(name: keyof CoreWebVitals, value: number): void {
    const previousValue = this.vitals[name] ?? 0
    this.vitals[name] = value

    const report = this.createReport(name, value, value - previousValue)
    this.reports.push(report)

    if (report.rating === 'poor') {
      this.createAlert(report)
    }

    this.callbacks.forEach((callback) => callback(report))
  }

  /**
   * Create Web Vitals report
   */
  private createReport(
    name: keyof CoreWebVitals,
    value: number,
    delta: number
  ): WebVitalsReport {
    return {
      name,
      value,
      rating: this.getRating(name, value),
      delta,
      id: this.generateId(),
      navigationType: this.getNavigationType(),
      timestamp: Date.now(),
    }
  }

  /**
   * Get rating for a metric value
   */
  private getRating(name: keyof CoreWebVitals, value: number): VitalsRating {
    const thresholds = VITALS_THRESHOLDS[name]
    if (!thresholds) return 'good'

    if (value <= thresholds.good) return 'good'
    if (value <= thresholds.poor) return 'needs-improvement'
    return 'poor'
  }

  /**
   * Generate unique ID for page load
   */
  private generateId(): string {
    return `v3-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get navigation type
   */
  private getNavigationType(): NavigationType {
    if (typeof window === 'undefined' || !window.performance) return 'navigate'

    const navEntry = performance.getEntriesByType('navigation')[0] as
      | (PerformanceEntry & { type?: string })
      | undefined

    return (navEntry?.type || 'navigate') as NavigationType
  }

  /**
   * Create alert for poor vitals
   */
  private createAlert(report: WebVitalsReport): void {
    const threshold = VITALS_THRESHOLDS[report.name]

    this.alerts.push({
      type: 'vitals',
      severity: 'warning',
      title: `Poor ${report.name.toUpperCase()} Score`,
      message: `${report.name.toUpperCase()} is ${report.value.toFixed(0)}ms (threshold: ${threshold?.good}ms)`,
      metric: report.name,
      value: report.value,
      threshold: threshold?.good || 0,
      timestamp: report.timestamp,
      metadata: {
        rating: report.rating,
        navigationType: report.navigationType,
      },
    })
  }

  /**
   * Subscribe to vitals updates
   */
  onReport(callback: (report: WebVitalsReport) => void): () => void {
    this.callbacks.push(callback)
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback)
    }
  }

  /**
   * Get current vitals
   */
  getVitals(): CoreWebVitals {
    return { ...this.vitals }
  }

  /**
   * Get all reports
   */
  getReports(): WebVitalsReport[] {
    return [...this.reports]
  }

  /**
   * Get alerts
   */
  getAlerts(): PerformanceAlert[] {
    return [...this.alerts]
  }

  /**
   * Get vitals score (0-100)
   */
  getScore(): number {
    const metrics = Object.entries(this.vitals).filter(([_, value]) => value !== null)

    if (metrics.length === 0) return 0

    const scores = metrics.map(([name, value]) => {
      if (value === null) return 0
      const rating = this.getRating(name as keyof CoreWebVitals, value)
      if (rating === 'good') return 100
      if (rating === 'needs-improvement') return 50
      return 0
    })

    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  /**
   * Cleanup observers
   */
  disconnect(): void {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers.clear()
  }
}

/**
 * Send Web Vitals to analytics endpoint
 */
export async function sendToAnalytics(
  report: WebVitalsReport,
  endpoint: string
): Promise<void> {
  try {
    const body = JSON.stringify({
      metric: report.name,
      value: report.value,
      rating: report.rating,
      delta: report.delta,
      id: report.id,
      navigationType: report.navigationType,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: report.timestamp,
    })

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, body)
    } else {
      await fetch(endpoint, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      })
    }
  } catch (error) {
    console.error('Failed to send vitals to analytics:', error)
  }
}
