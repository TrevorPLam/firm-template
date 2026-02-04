// AI-META-BEGIN
// 
// AI-META: Package entry point and public API exports
// OWNERSHIP: packages/capabilities
// ENTRYPOINTS: Package entry point, imported by consumers
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

/**
 * Performance monitoring main exports
 */

// Types
export type {
  PerformanceBudget,
  BudgetCheckResult,
  ResourceType,
  CoreWebVitals,
  VitalsRating,
  WebVitalsReport,
  NavigationType,
  RegressionConfig,
  RegressionResult,
  PerformanceMetrics,
  BundleSizes,
  BundleAnalysisResult,
  ModuleInfo,
  DuplicateInfo,
  TreeShakingOpportunity,
  PerformanceConfig,
  PerformanceAlert,
  PerformanceReport,
} from './types'

// Budget monitoring
export {
  BudgetChecker,
  DEFAULT_BUDGETS,
  calculateResourceSizes,
  monitorBudgets,
  formatBytes,
} from './monitoring/budgets'

// Core Web Vitals
export {
  WebVitalsTracker,
  VITALS_THRESHOLDS,
  sendToAnalytics,
} from './monitoring/core-web-vitals'

// Regression detection
export {
  RegressionDetector,
  compareSnapshots,
  loadBaseline,
  saveBaseline,
} from './monitoring/regression'

// Bundle analysis
export {
  BundleAnalyzer,
  parseWebpackStats,
  parseRollupBundle,
} from './analysis/bundle-analyzer'

/**
 * Create a complete performance monitoring system
 */
export function createPerformanceMonitor(config: {
  budgets?: import('./types').PerformanceBudget[]
  regressionConfig?: import('./types').RegressionConfig
  enableWebVitals?: boolean
  reportEndpoint?: string
  onAlert?: (alert: import('./types').PerformanceAlert) => void
}) {
  const {
    budgets,
    regressionConfig,
    enableWebVitals = true,
    reportEndpoint,
    onAlert,
  } = config

  // Initialize components
  const budgetChecker = new BudgetChecker(budgets)
  const webVitalsTracker = enableWebVitals ? new WebVitalsTracker() : null
  const regressionDetector = regressionConfig
    ? new RegressionDetector(regressionConfig)
    : null

  // Initialize Web Vitals tracking
  if (webVitalsTracker) {
    webVitalsTracker.initialize()

    // Send reports to analytics if endpoint provided
    if (reportEndpoint) {
      webVitalsTracker.onReport(async (report) => {
        try {
          await sendToAnalytics(report, reportEndpoint)
        } catch (error) {
          console.error('Failed to send vitals report:', error)
        }
      })
    }

    // Monitor alerts
    webVitalsTracker.onReport((report) => {
      if (report.rating === 'poor' && onAlert) {
        const alerts = webVitalsTracker.getAlerts()
        alerts.forEach(onAlert)
      }
    })
  }

  return {
    budgetChecker,
    webVitalsTracker,
    regressionDetector,

    /**
     * Run complete performance check
     */
    async check(): Promise<import('./types').PerformanceReport> {
      const timestamp = Date.now()
      const url = typeof window !== 'undefined' ? window.location.href : ''

      // Get Web Vitals
      const webVitals = webVitalsTracker?.getVitals() || {
        lcp: null,
        fid: null,
        cls: null,
        fcp: null,
        ttfb: null,
        inp: null,
      }

      // Get performance metrics
      const metrics: import('./types').PerformanceMetrics = {
        loadTime: 0,
        tti: 0,
        tbt: 0,
        speedIndex: 0,
        webVitals,
        bundleSizes: {
          total: 0,
          javascript: 0,
          css: 0,
          images: 0,
          fonts: 0,
          other: 0,
        },
        timestamp,
      }

      // Calculate bundle sizes
      if (typeof window !== 'undefined' && window.performance) {
        const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
        const sizes = calculateResourceSizes(entries)

        metrics.bundleSizes = {
          total: sizes.total || 0,
          javascript: sizes.javascript || 0,
          css: sizes.css || 0,
          images: sizes.image || 0,
          fonts: sizes.font || 0,
          other: sizes.other || 0,
        }

        // Get load time
        const navEntry = performance.getEntriesByType('navigation')[0] as
          | (PerformanceEntry & { loadEventEnd?: number })
          | undefined
        metrics.loadTime = navEntry?.loadEventEnd || 0
      }

      // Check budgets
      const budgetResults = budgetChecker.checkBudgets(metrics.bundleSizes)

      // Detect regressions
      const regressionResults = regressionDetector
        ? regressionDetector.detectRegressions(metrics)
        : []

      // Get Web Vitals reports
      const webVitalsReports = webVitalsTracker?.getReports() || []

      // Collect all alerts
      const alerts: import('./types').PerformanceAlert[] = [
        ...budgetChecker.getAlerts(),
        ...(webVitalsTracker?.getAlerts() || []),
        ...(regressionDetector?.getAlerts() || []),
      ]

      // Notify alerts
      if (onAlert) {
        alerts.forEach(onAlert)
      }

      // Calculate overall score
      const score = this.calculateScore({
        budgetResults,
        regressionResults,
        webVitalsScore: webVitalsTracker?.getScore() || 0,
      })

      return {
        id: `perf-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp,
        url,
        metrics,
        budgetResults,
        regressionResults,
        webVitalsReports,
        alerts,
        score,
      }
    },

    /**
     * Calculate overall performance score
     */
    calculateScore(data: {
      budgetResults: import('./types').BudgetCheckResult[]
      regressionResults: import('./types').RegressionResult[]
      webVitalsScore: number
    }): number {
      const { budgetResults, regressionResults, webVitalsScore } = data

      // Budget score (0-100)
      const budgetScore =
        budgetResults.length > 0
          ? (budgetResults.filter((r) => r.passed).length / budgetResults.length) * 100
          : 100

      // Regression score (0-100)
      const regressionScore =
        regressionResults.length > 0
          ? (regressionResults.filter((r) => !r.detected).length / regressionResults.length) *
            100
          : 100

      // Weighted average
      return Math.round(budgetScore * 0.3 + regressionScore * 0.2 + webVitalsScore * 0.5)
    },

    /**
     * Cleanup resources
     */
    destroy(): void {
      webVitalsTracker?.disconnect()
    },
  }
}
