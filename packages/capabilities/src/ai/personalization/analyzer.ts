/**
 * @module UserBehaviorAnalyzer
 * Advanced user behavior analysis engine for identifying patterns,
 * predicting user actions, and generating behavioral insights.
 */

import type { UserProfile, BehaviorSignal, ContentPreferences } from './types'

/**
 * Behavior pattern analysis result
 */
export interface BehaviorPattern {
  /** Pattern identifier */
  id: string
  /** Pattern name */
  name: string
  /** Pattern frequency (0-1) */
  frequency: number
  /** Pattern confidence (0-1) */
  confidence: number
  /** Associated user segment */
  segment: string
  /** Pattern indicators */
  indicators: string[]
}

/**
 * User journey step
 */
export interface JourneyStep {
  /** Step sequence number */
  sequence: number
  /** Action type */
  action: string
  /** Content ID involved */
  contentId: string
  /** Timestamp */
  timestamp: Date
  /** Step duration (ms) */
  duration?: number
}

/**
 * Prediction result for user behavior
 */
export interface BehaviorPrediction {
  /** Predicted action */
  action: 'convert' | 'bounce' | 'engage' | 'return'
  /** Prediction probability (0-1) */
  probability: number
  /** Contributing factors */
  factors: string[]
  /** Confidence in prediction (0-1) */
  confidence: number
  /** Recommended interventions */
  interventions: string[]
}

/**
 * Cohort analysis result
 */
export interface CohortAnalysis {
  /** Cohort name */
  cohortName: string
  /** Number of users in cohort */
  size: number
  /** Average engagement score */
  avgEngagement: number
  /** Common behaviors */
  commonBehaviors: string[]
  /** Retention rate */
  retentionRate: number
  /** Conversion rate */
  conversionRate: number
}

/**
 * User behavior analyzer providing advanced analytics, pattern detection,
 * and predictive modeling capabilities.
 */
export class UserBehaviorAnalyzer {
  private profiles: Map<string, UserProfile>
  private journeys: Map<string, JourneyStep[]>
  private patterns: Map<string, BehaviorPattern[]>

  constructor() {
    this.profiles = new Map()
    this.journeys = new Map()
    this.patterns = new Map()
  }

  /**
   * Adds a user profile for analysis
   * @param profile - User profile to analyze
   */
  addProfile(profile: UserProfile): void {
    if (!profile.userId) {
      throw new Error('Profile must have a userId')
    }

    this.profiles.set(profile.userId, profile)
  }

  /**
   * Analyzes user behavior to identify patterns
   * @param userId - User identifier
   * @returns Detected behavior patterns
   */
  async analyzePatterns(userId: string): Promise<BehaviorPattern[]> {
    const profile = this.profiles.get(userId)
    if (!profile) {
      throw new Error(`Profile for user ${userId} not found`)
    }

    const patterns: BehaviorPattern[] = []

    // Analyze engagement patterns
    const engagementPattern = this.detectEngagementPattern(profile)
    if (engagementPattern) {
      patterns.push(engagementPattern)
    }

    // Analyze content preference patterns
    const preferencePattern = this.detectPreferencePattern(profile)
    if (preferencePattern) {
      patterns.push(preferencePattern)
    }

    // Analyze temporal patterns
    const temporalPattern = this.detectTemporalPattern(profile)
    if (temporalPattern) {
      patterns.push(temporalPattern)
    }

    // Analyze conversion patterns
    const conversionPattern = this.detectConversionPattern(profile)
    if (conversionPattern) {
      patterns.push(conversionPattern)
    }

    this.patterns.set(userId, patterns)
    return patterns
  }

  /**
   * Detects engagement patterns in user behavior
   * @param profile - User profile
   * @returns Engagement pattern or null
   */
  private detectEngagementPattern(
    profile: UserProfile,
  ): BehaviorPattern | null {
    if (profile.behaviors.length < 5) {
      return null
    }

    const engagementBehaviors = profile.behaviors.filter(
      (b) => b.type === 'click' || b.type === 'share',
    )

    const frequency = engagementBehaviors.length / profile.behaviors.length
    const confidence = Math.min(profile.behaviors.length / 20, 1)

    if (frequency < 0.2) {
      return null
    }

    const indicators: string[] = []
    if (frequency > 0.5) {
      indicators.push('High interaction rate')
    }
    if (profile.engagementScore > 70) {
      indicators.push('Above-average engagement score')
    }

    return {
      id: `engagement-${profile.userId}`,
      name: 'High Engagement',
      frequency,
      confidence,
      segment: profile.segments[0] || 'general',
      indicators,
    }
  }

  /**
   * Detects content preference patterns
   * @param profile - User profile
   * @returns Preference pattern or null
   */
  private detectPreferencePattern(
    profile: UserProfile,
  ): BehaviorPattern | null {
    if (profile.preferences.topics.length === 0) {
      return null
    }

    const topicCount = profile.preferences.topics.length
    const formatCount = profile.preferences.formats.length

    const indicators: string[] = [
      `Prefers ${topicCount} topic${topicCount > 1 ? 's' : ''}`,
    ]

    if (formatCount > 0) {
      indicators.push(`Favors ${formatCount} format${formatCount > 1 ? 's' : ''}`)
    }

    return {
      id: `preference-${profile.userId}`,
      name: 'Content Preference',
      frequency: 0.8, // Preferences are consistent
      confidence: Math.min(profile.behaviors.length / 15, 1),
      segment: profile.segments[0] || 'general',
      indicators,
    }
  }

  /**
   * Detects temporal behavior patterns
   * @param profile - User profile
   * @returns Temporal pattern or null
   */
  private detectTemporalPattern(profile: UserProfile): BehaviorPattern | null {
    if (profile.behaviors.length < 10) {
      return null
    }

    const recentBehaviors = profile.behaviors.slice(-10)
    const timeSpan =
      recentBehaviors[recentBehaviors.length - 1].timestamp.getTime() -
      recentBehaviors[0].timestamp.getTime()

    const avgInterval = timeSpan / recentBehaviors.length / (1000 * 60 * 60) // hours

    const indicators: string[] = []
    if (avgInterval < 1) {
      indicators.push('Frequent activity (multiple times per hour)')
    } else if (avgInterval < 24) {
      indicators.push('Regular daily activity')
    } else {
      indicators.push('Periodic engagement')
    }

    return {
      id: `temporal-${profile.userId}`,
      name: 'Activity Pattern',
      frequency: 1 / avgInterval, // Inverse of average interval
      confidence: 0.7,
      segment: profile.segments[0] || 'general',
      indicators,
    }
  }

  /**
   * Detects conversion-related patterns
   * @param profile - User profile
   * @returns Conversion pattern or null
   */
  private detectConversionPattern(
    profile: UserProfile,
  ): BehaviorPattern | null {
    const conversions = profile.behaviors.filter((b) => b.type === 'convert')

    if (conversions.length === 0) {
      return null
    }

    const conversionRate = conversions.length / profile.behaviors.length

    const indicators: string[] = [
      `${conversions.length} conversion${conversions.length > 1 ? 's' : ''}`,
      `${(conversionRate * 100).toFixed(1)}% conversion rate`,
    ]

    return {
      id: `conversion-${profile.userId}`,
      name: 'Conversion Behavior',
      frequency: conversionRate,
      confidence: Math.min(profile.behaviors.length / 30, 1),
      segment: conversions.length > 2 ? 'high_intent' : 'standard',
      indicators,
    }
  }

  /**
   * Predicts user's next likely action
   * @param userId - User identifier
   * @returns Behavior prediction
   */
  async predictNextAction(userId: string): Promise<BehaviorPrediction> {
    const profile = this.profiles.get(userId)
    if (!profile) {
      throw new Error(`Profile for user ${userId} not found`)
    }

    const factors: string[] = []
    let actionProbabilities = {
      convert: 0.1,
      bounce: 0.2,
      engage: 0.5,
      return: 0.2,
    }

    // Factor 1: Engagement score
    if (profile.engagementScore > 70) {
      actionProbabilities.engage += 0.2
      actionProbabilities.convert += 0.1
      factors.push('High engagement score')
    } else if (profile.engagementScore < 30) {
      actionProbabilities.bounce += 0.2
      factors.push('Low engagement score')
    }

    // Factor 2: Recent behavior
    const recentBehaviors = profile.behaviors.slice(-5)
    const bounces = recentBehaviors.filter((b) => b.type === 'bounce').length

    if (bounces > 2) {
      actionProbabilities.bounce += 0.3
      factors.push('Recent bounce pattern')
    }

    const conversions = recentBehaviors.filter((b) => b.type === 'convert')
    if (conversions.length > 0) {
      actionProbabilities.convert += 0.2
      factors.push('Previous conversions')
    }

    // Factor 3: Segment influence
    if (profile.segments.includes('high_intent')) {
      actionProbabilities.convert += 0.25
      factors.push('High-intent segment')
    }

    if (profile.segments.includes('advocate')) {
      actionProbabilities.engage += 0.15
      actionProbabilities.return += 0.15
      factors.push('Advocate segment')
    }

    // Normalize probabilities
    const totalProb = Object.values(actionProbabilities).reduce(
      (sum, p) => sum + p,
      0,
    )
    for (const key in actionProbabilities) {
      actionProbabilities[key as keyof typeof actionProbabilities] /= totalProb
    }

    // Select most likely action
    const action = Object.entries(actionProbabilities).reduce((max, entry) =>
      entry[1] > max[1] ? entry : max,
    )[0] as BehaviorPrediction['action']

    const probability = actionProbabilities[action]

    // Generate interventions
    const interventions = this.generateInterventions(action, profile)

    // Calculate confidence (use min to ensure high confidence only when ALL components are strong)
    // This conservative approach prevents overconfident predictions when any component is weak
    const behaviorConfidence = Math.min(profile.behaviors.length / 25, 1)
    const factorConfidence = Math.min(factors.length / 4, 1)
    const confidence = Math.min(behaviorConfidence, factorConfidence, probability)

    return {
      action,
      probability,
      factors,
      confidence,
      interventions,
    }
  }

  /**
   * Generates recommended interventions based on predicted action
   * @param action - Predicted action
   * @param profile - User profile
   * @returns Array of intervention recommendations
   */
  private generateInterventions(
    action: BehaviorPrediction['action'],
    profile: UserProfile,
  ): string[] {
    const interventions: string[] = []

    switch (action) {
      case 'bounce':
        interventions.push('Show engaging content immediately')
        interventions.push('Display personalized recommendations')
        interventions.push('Offer incentive to stay (discount, premium content)')
        break

      case 'convert':
        interventions.push('Highlight call-to-action prominently')
        interventions.push('Reduce friction in conversion flow')
        interventions.push('Add urgency indicators (limited time, stock)')
        break

      case 'engage':
        interventions.push('Present interactive content')
        interventions.push('Suggest related content based on interests')
        interventions.push('Enable social sharing features')
        break

      case 'return':
        interventions.push('Send personalized follow-up communication')
        interventions.push('Highlight new content since last visit')
        interventions.push('Offer loyalty rewards')
        break
    }

    return interventions
  }

  /**
   * Tracks and analyzes user journey
   * @param userId - User identifier
   * @param step - Journey step to record
   */
  recordJourneyStep(userId: string, step: JourneyStep): void {
    if (!this.journeys.has(userId)) {
      this.journeys.set(userId, [])
    }

    this.journeys.get(userId)!.push(step)

    // Keep only last 50 steps
    const journey = this.journeys.get(userId)!
    if (journey.length > 50) {
      this.journeys.set(userId, journey.slice(-50))
    }
  }

  /**
   * Gets user journey for analysis
   * @param userId - User identifier
   * @returns User journey steps
   */
  getUserJourney(userId: string): JourneyStep[] {
    return this.journeys.get(userId) || []
  }

  /**
   * Performs cohort analysis on user groups
   * @param segmentName - Segment name for cohort
   * @returns Cohort analysis results
   */
  async analyzeCohort(segmentName: string): Promise<CohortAnalysis> {
    const cohortProfiles = Array.from(this.profiles.values()).filter((p) =>
      p.segments.includes(segmentName),
    )

    if (cohortProfiles.length === 0) {
      throw new Error(`No users found in segment: ${segmentName}`)
    }

    const avgEngagement =
      cohortProfiles.reduce((sum, p) => sum + p.engagementScore, 0) /
      cohortProfiles.length

    // Identify common behaviors
    const behaviorCounts = new Map<string, number>()
    for (const profile of cohortProfiles) {
      for (const behavior of profile.behaviors) {
        behaviorCounts.set(
          behavior.type,
          (behaviorCounts.get(behavior.type) || 0) + 1,
        )
      }
    }

    const totalBehaviors = cohortProfiles.reduce(
      (sum, p) => sum + p.behaviors.length,
      0,
    )

    const commonBehaviors = Array.from(behaviorCounts.entries())
      .filter(([_, count]) => count / totalBehaviors > 0.15)
      .map(([type, count]) => `${type} (${((count / totalBehaviors) * 100).toFixed(0)}%)`)

    // Calculate retention (users with recent activity)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const activeUsers = cohortProfiles.filter(
      (p) => p.lastUpdated > thirtyDaysAgo,
    )
    const retentionRate = activeUsers.length / cohortProfiles.length

    // Calculate conversion rate
    const converters = cohortProfiles.filter((p) =>
      p.behaviors.some((b) => b.type === 'convert'),
    )
    const conversionRate = converters.length / cohortProfiles.length

    return {
      cohortName: segmentName,
      size: cohortProfiles.length,
      avgEngagement,
      commonBehaviors,
      retentionRate,
      conversionRate,
    }
  }

  /**
   * Gets overall analytics summary
   * @returns Analytics summary
   */
  getSummary(): {
    totalProfiles: number
    totalBehaviors: number
    avgEngagement: number
    topSegments: Array<{ segment: string; count: number }>
  } {
    const profiles = Array.from(this.profiles.values())

    const totalBehaviors = profiles.reduce(
      (sum, p) => sum + p.behaviors.length,
      0,
    )

    const avgEngagement =
      profiles.length > 0
        ? profiles.reduce((sum, p) => sum + p.engagementScore, 0) /
          profiles.length
        : 0

    // Count segments
    const segmentCounts = new Map<string, number>()
    for (const profile of profiles) {
      for (const segment of profile.segments) {
        segmentCounts.set(segment, (segmentCounts.get(segment) || 0) + 1)
      }
    }

    const topSegments = Array.from(segmentCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([segment, count]) => ({ segment, count }))

    return {
      totalProfiles: profiles.length,
      totalBehaviors,
      avgEngagement,
      topSegments,
    }
  }

  /**
   * Clears all analysis data
   */
  clear(): void {
    this.profiles.clear()
    this.journeys.clear()
    this.patterns.clear()
  }
}
