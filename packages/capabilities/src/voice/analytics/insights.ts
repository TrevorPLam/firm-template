/**
 * @module VoiceAnalytics
 * Analytics system for tracking voice interactions, measuring performance,
 * and generating insights for voice interface optimization.
 */

import type {
  VoiceInteractionEvent,
  VoiceAnalyticsMetrics,
  VoiceAnalyticsReport,
  AnalyticsTrend,
} from '../types'

/**
 * Voice interaction analytics manager for tracking usage patterns
 * and generating insights.
 */
export class VoiceAnalyticsManager {
  private events: VoiceInteractionEvent[] = []
  private sessionStart: Date
  private maxEvents: number

  /**
   * Creates a new voice analytics manager
   * @param maxEvents - Maximum events to store (default: 10000)
   */
  constructor(maxEvents: number = 10000) {
    this.maxEvents = maxEvents
    this.sessionStart = new Date()
  }

  /**
   * Tracks voice interaction event
   * @param event - Voice interaction event
   */
  trackEvent(event: Omit<VoiceInteractionEvent, 'timestamp'>): void {
    const fullEvent: VoiceInteractionEvent = {
      ...event,
      timestamp: new Date(),
    }

    this.events.push(fullEvent)

    // Prevent memory overflow
    if (this.events.length > this.maxEvents) {
      this.events.shift()
    }
  }

  /**
   * Gets analytics metrics for time period
   * @param startDate - Start date (optional, defaults to session start)
   * @param endDate - End date (optional, defaults to now)
   * @returns Analytics metrics
   */
  getMetrics(startDate?: Date, endDate?: Date): VoiceAnalyticsMetrics {
    const start = startDate || this.sessionStart
    const end = endDate || new Date()

    const periodEvents = this.events.filter(
      (e) => e.timestamp >= start && e.timestamp <= end
    )

    return this.calculateMetrics(periodEvents)
  }

  /**
   * Generates analytics report
   * @param startDate - Report start date
   * @param endDate - Report end date
   * @returns Analytics report with trends and recommendations
   */
  generateReport(startDate: Date, endDate: Date): VoiceAnalyticsReport {
    const metrics = this.getMetrics(startDate, endDate)

    // Calculate trends (compare with previous period)
    const periodLength = endDate.getTime() - startDate.getTime()
    const prevStartDate = new Date(startDate.getTime() - periodLength)
    const prevEndDate = startDate

    const previousMetrics = this.getMetrics(prevStartDate, prevEndDate)
    const trends = this.calculateTrends(previousMetrics, metrics)

    // Generate recommendations
    const recommendations = this.generateRecommendations(metrics, trends)

    return {
      period: { start: startDate, end: endDate },
      metrics,
      trends,
      recommendations,
    }
  }

  /**
   * Gets events by type
   * @param type - Event type
   * @param limit - Maximum events to return
   * @returns Array of matching events
   */
  getEventsByType(
    type: VoiceInteractionEvent['type'],
    limit?: number
  ): VoiceInteractionEvent[] {
    const filtered = this.events.filter((e) => e.type === type)
    return limit ? filtered.slice(-limit) : filtered
  }

  /**
   * Gets failed interactions
   * @param limit - Maximum events to return
   * @returns Array of failed events
   */
  getFailedInteractions(limit?: number): VoiceInteractionEvent[] {
    const failed = this.events.filter((e) => !e.success)
    return limit ? failed.slice(-limit) : failed
  }

  /**
   * Gets average metrics by command
   * @returns Map of command names to metrics
   */
  getCommandMetrics(): Map<
    string,
    { count: number; successRate: number; avgDuration: number }
  > {
    const commandMap = new Map<
      string,
      { count: number; successes: number; durations: number[] }
    >()

    for (const event of this.events) {
      if (event.type !== 'command' || !event.command) {
        continue
      }

      const existing = commandMap.get(event.command) || {
        count: 0,
        successes: 0,
        durations: [],
      }

      existing.count++
      if (event.success) existing.successes++
      existing.durations.push(event.duration)

      commandMap.set(event.command, existing)
    }

    const metrics = new Map<
      string,
      { count: number; successRate: number; avgDuration: number }
    >()

    for (const [command, data] of commandMap) {
      metrics.set(command, {
        count: data.count,
        successRate: (data.successes / data.count) * 100,
        avgDuration:
          data.durations.reduce((a, b) => a + b, 0) / data.durations.length,
      })
    }

    return metrics
  }

  /**
   * Clears all analytics data
   */
  clear(): void {
    this.events = []
    this.sessionStart = new Date()
  }

  /**
   * Exports analytics data
   * @returns Serializable analytics data
   */
  export(): {
    events: VoiceInteractionEvent[]
    sessionStart: string
    metrics: VoiceAnalyticsMetrics
  } {
    return {
      events: this.events,
      sessionStart: this.sessionStart.toISOString(),
      metrics: this.getMetrics(),
    }
  }

  /**
   * Calculates metrics from events
   * @param events - Array of events
   * @returns Calculated metrics
   */
  private calculateMetrics(
    events: VoiceInteractionEvent[]
  ): VoiceAnalyticsMetrics {
    const total = events.length
    const successful = events.filter((e) => e.success).length
    const failed = total - successful

    // Calculate average confidence
    const confidenceEvents = events.filter((e) => e.type === 'recognition')
    const avgConfidence =
      confidenceEvents.length > 0
        ? confidenceEvents.reduce((sum, e) => sum + (e.success ? 1 : 0), 0) /
          confidenceEvents.length
        : 0

    // Calculate top commands
    const commandCounts = new Map<string, number>()
    events
      .filter((e) => e.command)
      .forEach((e) => {
        commandCounts.set(e.command!, (commandCounts.get(e.command!) || 0) + 1)
      })

    const topCommands = Array.from(commandCounts.entries())
      .map(([command, count]) => ({ command, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Calculate top intents
    const intentCounts = new Map<string, number>()
    events
      .filter((e) => e.intent)
      .forEach((e) => {
        intentCounts.set(e.intent!, (intentCounts.get(e.intent!) || 0) + 1)
      })

    const topIntents = Array.from(intentCounts.entries())
      .map(([intent, count]) => ({ intent, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Calculate average response time
    const avgResponseTime =
      events.length > 0
        ? events.reduce((sum, e) => sum + e.duration, 0) / events.length
        : 0

    // Calculate error distribution
    const errorTypes: Record<string, number> = {}
    events
      .filter((e) => !e.success && e.error)
      .forEach((e) => {
        const errorKey = e.error || 'Unknown'
        errorTypes[errorKey] = (errorTypes[errorKey] || 0) + 1
      })

    return {
      totalInteractions: total,
      successfulInteractions: successful,
      failedInteractions: failed,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      averageConfidence: avgConfidence,
      topCommands,
      topIntents,
      averageResponseTime,
      errorTypes,
    }
  }

  /**
   * Calculates trends between two metric sets
   * @param previous - Previous period metrics
   * @param current - Current period metrics
   * @returns Array of trends
   */
  private calculateTrends(
    previous: VoiceAnalyticsMetrics,
    current: VoiceAnalyticsMetrics
  ): AnalyticsTrend[] {
    const trends: AnalyticsTrend[] = []

    // Success rate trend
    const successRateChange =
      previous.successRate > 0
        ? ((current.successRate - previous.successRate) / previous.successRate) *
          100
        : 0

    trends.push({
      metric: 'Success Rate',
      direction:
        Math.abs(successRateChange) < 1
          ? 'stable'
          : successRateChange > 0
            ? 'up'
            : 'down',
      change: successRateChange,
      significant: Math.abs(successRateChange) > 5,
    })

    // Response time trend
    const responseTimeChange =
      previous.averageResponseTime > 0
        ? ((current.averageResponseTime - previous.averageResponseTime) /
            previous.averageResponseTime) *
          100
        : 0

    trends.push({
      metric: 'Response Time',
      direction:
        Math.abs(responseTimeChange) < 1
          ? 'stable'
          : responseTimeChange > 0
            ? 'up'
            : 'down',
      change: responseTimeChange,
      significant: Math.abs(responseTimeChange) > 10,
    })

    return trends
  }

  /**
   * Generates recommendations based on metrics and trends
   * @param metrics - Current metrics
   * @param trends - Calculated trends
   * @returns Array of recommendations
   */
  private generateRecommendations(
    metrics: VoiceAnalyticsMetrics,
    trends: AnalyticsTrend[]
  ): string[] {
    const recommendations: string[] = []

    // Low success rate
    if (metrics.successRate < 80) {
      recommendations.push(
        'Success rate is below 80%. Consider improving voice command patterns or recognition accuracy.'
      )
    }

    // High error rate
    if (metrics.failedInteractions / metrics.totalInteractions > 0.3) {
      recommendations.push(
        'High error rate detected. Review error types and improve error handling.'
      )
    }

    // Slow response time
    if (metrics.averageResponseTime > 2000) {
      recommendations.push(
        'Average response time exceeds 2 seconds. Optimize command processing performance.'
      )
    }

    // Declining success rate
    const successTrend = trends.find((t) => t.metric === 'Success Rate')
    if (successTrend?.direction === 'down' && successTrend.significant) {
      recommendations.push(
        'Success rate is declining. Investigate recent changes and user feedback.'
      )
    }

    // Low command diversity
    if (metrics.topCommands.length < 3) {
      recommendations.push(
        'Limited command usage detected. Promote additional voice commands to users.'
      )
    }

    return recommendations
  }
}
