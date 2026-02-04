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
 * Performance regression detection and monitoring
 */

import type {
  RegressionConfig,
  RegressionResult,
  PerformanceMetrics,
  PerformanceAlert,
} from '../types'

/**
 * Regression severity thresholds (percentage change)
 */
const SEVERITY_THRESHOLDS = {
  minor: 5, // 5% regression
  moderate: 15, // 15% regression
  major: 30, // 30% regression
  critical: 50, // 50% regression
} as const

/**
 * Performance regression detector
 */
export class RegressionDetector {
  private config: RegressionConfig
  private history: PerformanceMetrics[] = []
  private alerts: PerformanceAlert[] = []

  constructor(config: RegressionConfig) {
    this.config = config
  }

  /**
   * Detect regressions by comparing current metrics to baseline
   */
  detectRegressions(current: PerformanceMetrics): RegressionResult[] {
    this.alerts = []
    const results: RegressionResult[] = []

    for (const metric of this.config.metrics) {
      const result = this.checkMetric(metric, current)
      if (result) {
        results.push(result)

        if (result.detected && this.config.enableAlerts) {
          this.createAlert(result)
        }
      }
    }

    this.history.push(current)
    return results
  }

  /**
   * Check individual metric for regression
   */
  private checkMetric(
    metric: keyof PerformanceMetrics,
    current: PerformanceMetrics
  ): RegressionResult | null {
    const baselineValue = this.getBaselineValue(metric)
    const currentValue = this.getCurrentValue(metric, current)

    if (baselineValue === null || currentValue === null) {
      return null
    }

    const percentageChange = ((currentValue - baselineValue) / baselineValue) * 100
    const detected = Math.abs(percentageChange) > this.config.maxRegression

    return {
      detected,
      metric,
      baseline: baselineValue,
      current: currentValue,
      percentageChange,
      severity: this.getSeverity(Math.abs(percentageChange)),
      recommendation: this.getRecommendation(metric, percentageChange),
    }
  }

  /**
   * Get baseline value for a metric
   */
  private getBaselineValue(metric: keyof PerformanceMetrics): number | null {
    const baseline = this.config.baseline

    if (metric === 'webVitals') {
      return null // Handle web vitals separately
    }

    if (metric === 'bundleSizes') {
      return baseline.bundleSizes?.total || null
    }

    return (baseline[metric] as number) || null
  }

  /**
   * Get current value for a metric
   */
  private getCurrentValue(
    metric: keyof PerformanceMetrics,
    current: PerformanceMetrics
  ): number | null {
    if (metric === 'webVitals') {
      return null // Handle web vitals separately
    }

    if (metric === 'bundleSizes') {
      return current.bundleSizes?.total || null
    }

    return (current[metric] as number) || null
  }

  /**
   * Determine severity level based on percentage change
   */
  private getSeverity(percentageChange: number): RegressionResult['severity'] {
    if (percentageChange >= SEVERITY_THRESHOLDS.critical) return 'critical'
    if (percentageChange >= SEVERITY_THRESHOLDS.major) return 'major'
    if (percentageChange >= SEVERITY_THRESHOLDS.moderate) return 'moderate'
    return 'minor'
  }

  /**
   * Get recommendation for regression
   */
  private getRecommendation(metric: string, percentageChange: number): string {
    const direction = percentageChange > 0 ? 'increased' : 'decreased'
    const absChange = Math.abs(percentageChange).toFixed(1)

    const recommendations: Record<string, string> = {
      loadTime: `Page load time ${direction} by ${absChange}%. Consider optimizing critical rendering path and reducing blocking resources.`,
      tti: `Time to Interactive ${direction} by ${absChange}%. Review and optimize JavaScript execution time and main thread blocking.`,
      tbt: `Total Blocking Time ${direction} by ${absChange}%. Break up long tasks and defer non-critical JavaScript.`,
      speedIndex: `Speed Index ${direction} by ${absChange}%. Optimize above-the-fold content loading and eliminate render-blocking resources.`,
      bundleSizes: `Bundle size ${direction} by ${absChange}%. Analyze bundle composition, remove unused code, and implement code splitting.`,
    }

    return (
      recommendations[metric] ||
      `Metric ${metric} ${direction} by ${absChange}%. Review recent changes and optimize performance.`
    )
  }

  /**
   * Create alert for regression
   */
  private createAlert(result: RegressionResult): void {
    const severityMap = {
      minor: 'info' as const,
      moderate: 'warning' as const,
      major: 'error' as const,
      critical: 'critical' as const,
    }

    this.alerts.push({
      type: 'regression',
      severity: severityMap[result.severity],
      title: `Performance Regression Detected: ${result.metric}`,
      message: `${result.metric} regressed by ${Math.abs(result.percentageChange).toFixed(1)}% (${result.baseline.toFixed(0)} → ${result.current.toFixed(0)})`,
      metric: result.metric,
      value: result.current,
      threshold: result.baseline,
      timestamp: Date.now(),
      metadata: {
        severity: result.severity,
        recommendation: result.recommendation,
      },
    })
  }

  /**
   * Get all alerts
   */
  getAlerts(): PerformanceAlert[] {
    return [...this.alerts]
  }

  /**
   * Update baseline metrics
   */
  updateBaseline(baseline: PerformanceMetrics): void {
    this.config.baseline = baseline
  }

  /**
   * Get performance history
   */
  getHistory(): PerformanceMetrics[] {
    return [...this.history]
  }

  /**
   * Calculate trend for a metric over time
   */
  calculateTrend(metric: keyof PerformanceMetrics): {
    trend: 'improving' | 'stable' | 'degrading'
    changeRate: number
    dataPoints: number
  } {
    if (this.history.length < 2) {
      return { trend: 'stable', changeRate: 0, dataPoints: this.history.length }
    }

    const values: number[] = []
    for (const snapshot of this.history) {
      const value = this.getCurrentValue(metric, snapshot)
      if (value !== null) {
        values.push(value)
      }
    }

    if (values.length < 2) {
      return { trend: 'stable', changeRate: 0, dataPoints: values.length }
    }

    // Calculate linear regression slope
    const n = values.length
    const xMean = (n - 1) / 2
    const yMean = values.reduce((a, b) => a + b, 0) / n

    let numerator = 0
    let denominator = 0

    for (let i = 0; i < n; i++) {
      numerator += (i - xMean) * (values[i] - yMean)
      denominator += Math.pow(i - xMean, 2)
    }

    const slope = numerator / denominator
    const changeRate = (slope / yMean) * 100

    let trend: 'improving' | 'stable' | 'degrading' = 'stable'
    if (Math.abs(changeRate) > 5) {
      trend = changeRate < 0 ? 'improving' : 'degrading'
    }

    return { trend, changeRate, dataPoints: n }
  }

  /**
   * Generate regression report
   */
  generateReport(results: RegressionResult[]): {
    summary: string
    regressions: RegressionResult[]
    recommendations: string[]
    overallHealth: 'good' | 'warning' | 'critical'
  } {
    const detected = results.filter((r) => r.detected)
    const critical = detected.filter((r) => r.severity === 'critical' || r.severity === 'major')

    let overallHealth: 'good' | 'warning' | 'critical' = 'good'
    if (critical.length > 0) {
      overallHealth = 'critical'
    } else if (detected.length > 0) {
      overallHealth = 'warning'
    }

    const summary =
      detected.length === 0
        ? 'No performance regressions detected'
        : `${detected.length} regression${detected.length > 1 ? 's' : ''} detected (${critical.length} critical)`

    const recommendations = detected.map((r) => r.recommendation)

    return {
      summary,
      regressions: detected,
      recommendations,
      overallHealth,
    }
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.history = []
  }

  /**
   * Export history to JSON
   */
  exportHistory(): string {
    return JSON.stringify(this.history, null, 2)
  }

  /**
   * Import history from JSON
   */
  importHistory(json: string): void {
    try {
      this.history = JSON.parse(json)
    } catch (error) {
      console.error('Failed to import history:', error)
    }
  }
}

/**
 * Compare two performance snapshots
 */
export function compareSnapshots(
  baseline: PerformanceMetrics,
  current: PerformanceMetrics
): {
  loadTime: { change: number; percentage: number }
  tti: { change: number; percentage: number }
  tbt: { change: number; percentage: number }
  speedIndex: { change: number; percentage: number }
  bundleSize: { change: number; percentage: number }
} {
  const calculateDiff = (base: number, curr: number) => ({
    change: curr - base,
    percentage: ((curr - base) / base) * 100,
  })

  return {
    loadTime: calculateDiff(baseline.loadTime, current.loadTime),
    tti: calculateDiff(baseline.tti, current.tti),
    tbt: calculateDiff(baseline.tbt, current.tbt),
    speedIndex: calculateDiff(baseline.speedIndex, current.speedIndex),
    bundleSize: calculateDiff(baseline.bundleSizes.total, current.bundleSizes.total),
  }
}

/**
 * Load baseline from file or API
 */
export async function loadBaseline(source: string): Promise<PerformanceMetrics | null> {
  try {
    // In Node.js environment
    if (typeof window === 'undefined') {
      const fs = await import('fs')
      const data = await fs.promises.readFile(source, 'utf-8')
      return JSON.parse(data)
    }

    // In browser environment
    const response = await fetch(source)
    return await response.json()
  } catch (error) {
    console.error('Failed to load baseline:', error)
    return null
  }
}

/**
 * Save baseline to file or API
 */
export async function saveBaseline(
  metrics: PerformanceMetrics,
  destination: string
): Promise<void> {
  try {
    const data = JSON.stringify(metrics, null, 2)

    // In Node.js environment
    if (typeof window === 'undefined') {
      const fs = await import('fs')
      await fs.promises.writeFile(destination, data, 'utf-8')
    } else {
      // In browser environment, send to API
      await fetch(destination, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
      })
    }
  } catch (error) {
    console.error('Failed to save baseline:', error)
    throw error
  }
}
