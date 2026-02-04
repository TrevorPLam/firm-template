/**
 * @module PerformanceAnalytics
 * Performance analytics and reporting engine for comprehensive
 * personalization system monitoring and insight generation.
 */

import type {
  AnalyticsReport,
  PerformanceMetric,
  Insight,
  BaselineComparison,
} from './types'

/**
 * Time series data point
 */
export interface TimeSeriesPoint {
  /** Timestamp */
  timestamp: Date
  /** Metric value */
  value: number
  /** Additional metadata */
  metadata?: Record<string, unknown>
}

/**
 * Aggregated analytics data
 */
export interface AggregatedMetrics {
  /** Metric name */
  metric: string
  /** Total value */
  total: number
  /** Average value */
  average: number
  /** Minimum value */
  min: number
  /** Maximum value */
  max: number
  /** Standard deviation */
  stdDev: number
  /** Sample count */
  count: number
}

/**
 * Dashboard data for visualization
 */
export interface AnalyticsDashboard {
  /** Summary metrics */
  summary: {
    totalUsers: number
    activeUsers: number
    avgEngagement: number
    conversionRate: number
  }
  /** Top performing content */
  topContent: Array<{
    contentId: string
    score: number
    views: number
    conversions: number
  }>
  /** Recent trends */
  trends: Array<{
    metric: string
    direction: 'up' | 'down' | 'stable'
    change: number
  }>
  /** Active experiments */
  experiments: Array<{
    name: string
    status: string
    progress: number
  }>
}

/**
 * Performance analytics engine providing comprehensive monitoring,
 * reporting, and insight generation capabilities.
 */
export class PerformanceAnalytics {
  private metrics: Map<string, TimeSeriesPoint[]>
  private reports: Map<string, AnalyticsReport>
  private baselines: Map<string, Map<string, number>>

  constructor() {
    this.metrics = new Map()
    this.reports = new Map()
    this.baselines = new Map()
  }

  /**
   * Records a metric data point
   * @param metric - Metric name
   * @param value - Metric value
   * @param metadata - Optional metadata
   */
  recordMetric(
    metric: string,
    value: number,
    metadata?: Record<string, unknown>,
  ): void {
    if (!this.metrics.has(metric)) {
      this.metrics.set(metric, [])
    }

    const dataPoint: TimeSeriesPoint = {
      timestamp: new Date(),
      value,
      metadata,
    }

    this.metrics.get(metric)!.push(dataPoint)

    // Keep only last 10000 points per metric for performance
    const points = this.metrics.get(metric)!
    if (points.length > 10000) {
      this.metrics.set(metric, points.slice(-10000))
    }
  }

  /**
   * Generates an analytics report for a time period
   * @param start - Period start date
   * @param end - Period end date
   * @param metricsToInclude - Specific metrics to include (optional)
   * @returns Analytics report
   */
  async generateReport(
    start: Date,
    end: Date,
    metricsToInclude?: string[],
  ): Promise<AnalyticsReport> {
    const reportId = `report-${start.getTime()}-${end.getTime()}`

    const metricsToAnalyze = metricsToInclude || Array.from(this.metrics.keys())

    const performanceMetrics: PerformanceMetric[] = []

    for (const metricName of metricsToAnalyze) {
      const metric = await this.calculateMetric(metricName, start, end)
      if (metric) {
        performanceMetrics.push(metric)
      }
    }

    // Generate insights based on metrics
    const insights = this.generateInsights(performanceMetrics, start, end)

    // Calculate baseline comparison if available
    const baseline = await this.compareToBaseline(
      performanceMetrics,
      start,
      end,
    )

    const report: AnalyticsReport = {
      period: { start, end },
      metrics: performanceMetrics,
      insights,
      baseline,
    }

    this.reports.set(reportId, report)
    return report
  }

  /**
   * Calculates a performance metric for a period
   * @param metricName - Metric name
   * @param start - Period start
   * @param end - Period end
   * @returns Performance metric or null
   */
  private async calculateMetric(
    metricName: string,
    start: Date,
    end: Date,
  ): Promise<PerformanceMetric | null> {
    const dataPoints = this.metrics.get(metricName)
    if (!dataPoints || dataPoints.length === 0) {
      return null
    }

    // Filter points in time range
    const periodPoints = dataPoints.filter(
      (p) => p.timestamp >= start && p.timestamp <= end,
    )

    if (periodPoints.length === 0) {
      return null
    }

    // Calculate current value (average)
    const currentValue =
      periodPoints.reduce((sum, p) => sum + p.value, 0) / periodPoints.length

    // Get previous period for comparison
    const periodLength = end.getTime() - start.getTime()
    const prevStart = new Date(start.getTime() - periodLength)
    const prevEnd = start

    const prevPoints = dataPoints.filter(
      (p) => p.timestamp >= prevStart && p.timestamp < prevEnd,
    )

    let change = 0
    let trend: 'up' | 'down' | 'stable' = 'stable'

    if (prevPoints.length > 0) {
      const prevValue =
        prevPoints.reduce((sum, p) => sum + p.value, 0) / prevPoints.length

      change = prevValue > 0 ? ((currentValue - prevValue) / prevValue) * 100 : 0

      if (change > 5) {
        trend = 'up'
      } else if (change < -5) {
        trend = 'down'
      }
    }

    // Determine appropriate unit
    const unit = this.getMetricUnit(metricName)

    return {
      name: metricName,
      value: currentValue,
      unit,
      trend,
      change,
    }
  }

  /**
   * Gets appropriate unit for a metric
   * @param metricName - Metric name
   * @returns Unit string
   */
  private getMetricUnit(metricName: string): string {
    const lowerName = metricName.toLowerCase()

    if (lowerName.includes('rate') || lowerName.includes('percentage')) {
      return '%'
    }
    if (lowerName.includes('time') || lowerName.includes('duration')) {
      return 'ms'
    }
    if (lowerName.includes('score')) {
      return 'points'
    }
    if (lowerName.includes('count') || lowerName.includes('total')) {
      return 'count'
    }

    return 'units'
  }

  /**
   * Generates insights from performance metrics
   * @param metrics - Performance metrics
   * @param start - Period start
   * @param end - Period end
   * @returns Array of insights
   */
  private generateInsights(
    metrics: PerformanceMetric[],
    start: Date,
    end: Date,
  ): Insight[] {
    const insights: Insight[] = []

    for (const metric of metrics) {
      // Positive trend insights
      if (metric.trend === 'up' && metric.change > 20) {
        insights.push({
          type: 'success',
          title: `Strong ${metric.name} Growth`,
          description: `${metric.name} increased by ${metric.change.toFixed(1)}% during this period, indicating strong performance.`,
          actions: [
            'Analyze what drove this improvement',
            'Apply learnings to other areas',
            'Document successful strategies',
          ],
          priority: 'high',
        })
      }

      // Negative trend warnings
      if (metric.trend === 'down' && metric.change < -15) {
        insights.push({
          type: 'warning',
          title: `${metric.name} Declining`,
          description: `${metric.name} decreased by ${Math.abs(metric.change).toFixed(1)}% during this period. Immediate attention required.`,
          actions: [
            'Investigate root cause of decline',
            'Review recent changes or experiments',
            'Consider rolling back recent updates',
          ],
          priority: 'high',
        })
      }

      // Moderate opportunities
      if (metric.trend === 'up' && metric.change > 10 && metric.change <= 20) {
        insights.push({
          type: 'opportunity',
          title: `${metric.name} Showing Promise`,
          description: `${metric.name} improved by ${metric.change.toFixed(1)}%. Opportunity to amplify this trend.`,
          actions: [
            'Double down on current strategy',
            'Test aggressive optimization',
            'Increase resource allocation',
          ],
          priority: 'medium',
        })
      }

      // Stagnation warnings
      if (metric.trend === 'stable' && Math.abs(metric.change) < 2) {
        insights.push({
          type: 'opportunity',
          title: `${metric.name} Stagnant`,
          description: `${metric.name} has remained flat. Consider new strategies to drive improvement.`,
          actions: [
            'Launch A/B tests for optimization',
            'Review personalization strategies',
            'Seek external benchmarks',
          ],
          priority: 'low',
        })
      }
    }

    // Overall system health check
    const avgChange =
      metrics.reduce((sum, m) => sum + m.change, 0) / metrics.length
    if (avgChange > 10) {
      insights.push({
        type: 'success',
        title: 'Overall System Performance Strong',
        description: `Average metric improvement of ${avgChange.toFixed(1)}% across all KPIs.`,
        actions: [
          'Maintain current trajectory',
          'Share best practices across teams',
          'Prepare case study of success',
        ],
        priority: 'medium',
      })
    }

    return insights
  }

  /**
   * Compares current period to baseline
   * @param metrics - Current metrics
   * @param start - Current period start
   * @param end - Current period end
   * @returns Baseline comparison or undefined
   */
  private async compareToBaseline(
    metrics: PerformanceMetric[],
    start: Date,
    end: Date,
  ): Promise<BaselineComparison | undefined> {
    const baselinePeriodKey = this.getBaselinePeriodKey(start, end)
    const baselineMetrics = this.baselines.get(baselinePeriodKey)

    if (!baselineMetrics) {
      return undefined
    }

    // Calculate overall improvement
    let totalImprovement = 0
    let metricCount = 0

    for (const metric of metrics) {
      const baselineValue = baselineMetrics.get(metric.name)
      if (baselineValue !== undefined && baselineValue > 0) {
        const improvement = ((metric.value - baselineValue) / baselineValue) * 100
        totalImprovement += improvement
        metricCount++
      }
    }

    const avgImprovement = metricCount > 0 ? totalImprovement / metricCount : 0

    // Calculate statistical significance (simplified)
    const significance = Math.min(metricCount / 5, 1) * 0.95

    return {
      period: this.getBaselinePeriod(start, end),
      improvement: avgImprovement,
      significance,
    }
  }

  /**
   * Sets baseline metrics for comparison
   * @param start - Baseline period start
   * @param end - Baseline period end
   * @param metrics - Baseline metric values
   */
  setBaseline(
    start: Date,
    end: Date,
    metrics: Record<string, number>,
  ): void {
    const key = this.getBaselinePeriodKey(start, end)
    const baselineMap = new Map(Object.entries(metrics))
    this.baselines.set(key, baselineMap)
  }

  /**
   * Gets baseline period key
   * @param start - Period start
   * @param end - Period end
   * @returns Baseline key
   */
  private getBaselinePeriodKey(start: Date, end: Date): string {
    return `baseline-${start.getTime()}-${end.getTime()}`
  }

  /**
   * Gets baseline period dates
   * @param start - Current period start
   * @param end - Current period end
   * @returns Baseline period
   */
  private getBaselinePeriod(
    start: Date,
    end: Date,
  ): { start: Date; end: Date } {
    const periodLength = end.getTime() - start.getTime()
    return {
      start: new Date(start.getTime() - periodLength),
      end: start,
    }
  }

  /**
   * Aggregates metrics over a time period
   * @param metricName - Metric name
   * @param start - Period start
   * @param end - Period end
   * @returns Aggregated metrics
   */
  async aggregateMetrics(
    metricName: string,
    start: Date,
    end: Date,
  ): Promise<AggregatedMetrics | null> {
    const dataPoints = this.metrics.get(metricName)
    if (!dataPoints || dataPoints.length === 0) {
      return null
    }

    const periodPoints = dataPoints.filter(
      (p) => p.timestamp >= start && p.timestamp <= end,
    )

    if (periodPoints.length === 0) {
      return null
    }

    const values = periodPoints.map((p) => p.value)
    const total = values.reduce((sum, v) => sum + v, 0)
    const average = total / values.length
    const min = Math.min(...values)
    const max = Math.max(...values)

    // Calculate standard deviation
    const squaredDiffs = values.map((v) => Math.pow(v - average, 2))
    const variance =
      squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length
    const stdDev = Math.sqrt(variance)

    return {
      metric: metricName,
      total,
      average,
      min,
      max,
      stdDev,
      count: periodPoints.length,
    }
  }

  /**
   * Generates dashboard data for visualization
   * @returns Dashboard data
   */
  async generateDashboard(): Promise<AnalyticsDashboard> {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Summary metrics (last 24h)
    const totalUsersMetric = await this.aggregateMetrics(
      'total_users',
      last24h,
      now,
    )
    const activeUsersMetric = await this.aggregateMetrics(
      'active_users',
      last24h,
      now,
    )
    const engagementMetric = await this.aggregateMetrics(
      'engagement_score',
      last24h,
      now,
    )
    const conversionMetric = await this.aggregateMetrics(
      'conversion_rate',
      last24h,
      now,
    )

    const summary = {
      totalUsers: totalUsersMetric?.total || 0,
      activeUsers: activeUsersMetric?.total || 0,
      avgEngagement: engagementMetric?.average || 0,
      conversionRate: conversionMetric?.average || 0,
    }

    // Top content (mock data - would integrate with actual content tracking)
    const topContent = this.getTopContent(last7d, now)

    // Trends
    const trends = await this.getTrends(last7d, now)

    // Experiments (mock data - would integrate with AB testing framework)
    const experiments = this.getActiveExperiments()

    return {
      summary,
      topContent,
      trends,
      experiments,
    }
  }

  /**
   * Gets top performing content
   * @param start - Period start
   * @param end - Period end
   * @returns Top content items
   */
  private getTopContent(
    start: Date,
    end: Date,
  ): Array<{
    contentId: string
    score: number
    views: number
    conversions: number
  }> {
    // Placeholder implementation - would integrate with content tracking
    return []
  }

  /**
   * Gets metric trends
   * @param start - Period start
   * @param end - Period end
   * @returns Trend data
   */
  private async getTrends(
    start: Date,
    end: Date,
  ): Promise<
    Array<{ metric: string; direction: 'up' | 'down' | 'stable'; change: number }>
  > {
    const trends: Array<{
      metric: string
      direction: 'up' | 'down' | 'stable'
      change: number
    }> = []

    for (const metricName of this.metrics.keys()) {
      const metric = await this.calculateMetric(metricName, start, end)
      if (metric) {
        trends.push({
          metric: metric.name,
          direction: metric.trend,
          change: metric.change,
        })
      }
    }

    return trends
  }

  /**
   * Gets active experiments
   * @returns Active experiment data
   */
  private getActiveExperiments(): Array<{
    name: string
    status: string
    progress: number
  }> {
    // Placeholder implementation - would integrate with AB testing framework
    return []
  }

  /**
   * Gets time series data for a metric
   * @param metricName - Metric name
   * @param start - Period start
   * @param end - Period end
   * @returns Time series data points
   */
  getTimeSeries(
    metricName: string,
    start: Date,
    end: Date,
  ): TimeSeriesPoint[] {
    const dataPoints = this.metrics.get(metricName)
    if (!dataPoints) {
      return []
    }

    return dataPoints.filter(
      (p) => p.timestamp >= start && p.timestamp <= end,
    )
  }

  /**
   * Exports analytics data as JSON
   * @param start - Period start
   * @param end - Period end
   * @returns JSON string of analytics data
   */
  async exportData(start: Date, end: Date): Promise<string> {
    const report = await this.generateReport(start, end)
    const dashboard = await this.generateDashboard()

    const exportData = {
      report,
      dashboard,
      exportedAt: new Date(),
    }

    return JSON.stringify(exportData, null, 2)
  }

  /**
   * Clears all analytics data
   */
  clear(): void {
    this.metrics.clear()
    this.reports.clear()
    this.baselines.clear()
  }

  /**
   * Gets statistics about stored metrics
   * @returns Metrics statistics
   */
  getStats(): {
    totalMetrics: number
    totalDataPoints: number
    metricsNames: string[]
  } {
    const metricsNames = Array.from(this.metrics.keys())
    const totalDataPoints = Array.from(this.metrics.values()).reduce(
      (sum, points) => sum + points.length,
      0,
    )

    return {
      totalMetrics: this.metrics.size,
      totalDataPoints,
      metricsNames,
    }
  }
}
