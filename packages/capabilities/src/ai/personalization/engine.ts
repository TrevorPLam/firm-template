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
 * @module PersonalizationEngine
 * Core personalization engine that orchestrates ML-based content recommendations
 * and user profiling for adaptive content delivery.
 */

import type {
  PersonalizationConfig,
  UserProfile,
  BehaviorSignal,
  ContentRecommendation,
  PersonalizationFactor,
} from './types'

/**
 * Main personalization engine implementing ML-based content recommendation
 * and real-time user adaptation capabilities.
 */
export class PersonalizationEngine {
  private config: PersonalizationConfig
  private userProfiles: Map<string, UserProfile>
  private contentScores: Map<string, Map<string, number>>

  /**
   * Creates a new personalization engine instance
   * @param config - Engine configuration options
   */
  constructor(config: PersonalizationConfig) {
    this.config = config
    this.userProfiles = new Map()
    this.contentScores = new Map()
  }

  /**
   * Gets or creates a user profile
   * @param userId - User identifier
   * @returns User profile
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    if (this.userProfiles.has(userId)) {
      return this.userProfiles.get(userId)!
    }

    const profile: UserProfile = {
      userId,
      segments: [],
      behaviors: [],
      preferences: {
        types: [],
        topics: [],
        formats: [],
      },
      engagementScore: 50,
      lastUpdated: new Date(),
    }

    this.userProfiles.set(userId, profile)
    return profile
  }

  /**
   * Records a user behavior signal
   * @param userId - User identifier
   * @param signal - Behavior signal to record
   */
  async recordBehavior(userId: string, signal: BehaviorSignal): Promise<void> {
    const profile = await this.getUserProfile(userId)

    profile.behaviors.push(signal)

    // Keep only last 100 behaviors for performance
    if (profile.behaviors.length > 100) {
      profile.behaviors = profile.behaviors.slice(-100)
    }

    // Update engagement score based on signal type
    const scoreDeltas: Record<string, number> = {
      view: 1,
      click: 3,
      share: 5,
      convert: 10,
      bounce: -2,
    }

    const delta = scoreDeltas[signal.type] * signal.weight
    profile.engagementScore = Math.max(
      0,
      Math.min(100, profile.engagementScore + delta),
    )

    profile.lastUpdated = new Date()

    if (this.config.realtimeAdaptation) {
      await this.updateUserSegments(userId)
    }
  }

  /**
   * Generates personalized content recommendations
   * @param userId - User identifier
   * @param contentIds - Available content IDs to rank
   * @param limit - Maximum number of recommendations
   * @returns Array of content recommendations sorted by score
   */
  async recommend(
    userId: string,
    contentIds: string[],
    limit = 10,
  ): Promise<ContentRecommendation[]> {
    if (contentIds.length === 0) {
      return []
    }

    const profile = await this.getUserProfile(userId)
    const recommendations: ContentRecommendation[] = []

    for (const contentId of contentIds) {
      const recommendation = await this.scoreContent(profile, contentId)

      if (recommendation.confidence >= this.config.confidenceThreshold) {
        recommendations.push(recommendation)
      }
    }

    // Sort by score descending
    recommendations.sort((a, b) => b.score - a.score)

    return recommendations.slice(0, limit)
  }

  /**
   * Scores a piece of content for a user profile
   * @param profile - User profile
   * @param contentId - Content identifier
   * @returns Content recommendation with score and reasoning
   */
  private async scoreContent(
    profile: UserProfile,
    contentId: string,
  ): Promise<ContentRecommendation> {
    const factors: PersonalizationFactor[] = []
    let totalScore = 50 // Base score

    // Behavioral scoring
    const behaviorScore = this.calculateBehaviorScore(profile, contentId)
    if (behaviorScore !== 0) {
      factors.push({
        name: 'past_engagement',
        impact: behaviorScore / 100,
        category: 'behavioral',
      })
      totalScore += behaviorScore * 0.3
    }

    // Engagement score factor
    const engagementImpact = (profile.engagementScore - 50) / 50
    factors.push({
      name: 'user_engagement',
      impact: engagementImpact,
      category: 'behavioral',
    })
    totalScore += engagementImpact * 20

    // Contextual recency boost
    const recencyScore = this.calculateRecencyScore(profile)
    if (recencyScore > 0) {
      factors.push({
        name: 'recency',
        impact: recencyScore,
        category: 'contextual',
      })
      totalScore += recencyScore * 10
    }

    // Strategy-based adjustment
    if (this.config.selectionStrategy === 'ml-based') {
      totalScore *= 1.1 // ML boost
    }

    // Normalize score to 0-100 range
    totalScore = Math.max(0, Math.min(100, totalScore))

    // Calculate confidence based on data availability
    const confidence = this.calculateConfidence(profile, factors.length)

    const reasoning: string[] = []
    factors.forEach((factor) => {
      if (Math.abs(factor.impact) > 0.1) {
        const direction = factor.impact > 0 ? 'increased' : 'decreased'
        reasoning.push(
          `${factor.name} ${direction} score by ${Math.abs(factor.impact * 100).toFixed(0)}%`,
        )
      }
    })

    if (reasoning.length === 0) {
      reasoning.push('Using baseline recommendation score')
    }

    return {
      contentId,
      score: Math.round(totalScore),
      confidence,
      reasoning,
      factors,
    }
  }

  /**
   * Calculates behavior-based score for content
   * @param profile - User profile
   * @param contentId - Content identifier
   * @returns Behavior score (-100 to 100)
   */
  private calculateBehaviorScore(
    profile: UserProfile,
    contentId: string,
  ): number {
    const relevantBehaviors = profile.behaviors.filter(
      (b) => b.contentId === contentId,
    )

    if (relevantBehaviors.length === 0) {
      return 0
    }

    const weights: Record<string, number> = {
      view: 1,
      click: 2,
      share: 3,
      convert: 5,
      bounce: -3,
    }

    const score = relevantBehaviors.reduce((sum, behavior) => {
      return sum + (weights[behavior.type] || 0) * behavior.weight
    }, 0)

    return Math.max(-100, Math.min(100, score * 5))
  }

  /**
   * Calculates recency score based on profile activity
   * @param profile - User profile
   * @returns Recency score (0 to 1)
   */
  private calculateRecencyScore(profile: UserProfile): number {
    if (profile.behaviors.length === 0) {
      return 0
    }

    const lastBehavior = profile.behaviors[profile.behaviors.length - 1]
    const hoursSinceLastActivity =
      (Date.now() - lastBehavior.timestamp.getTime()) / (1000 * 60 * 60)

    // Decay over 24 hours
    return Math.max(0, 1 - hoursSinceLastActivity / 24)
  }

  /**
   * Calculates confidence level for recommendation
   * @param profile - User profile
   * @param factorCount - Number of personalization factors
   * @returns Confidence level (0 to 1)
   */
  private calculateConfidence(
    profile: UserProfile,
    factorCount: number,
  ): number {
    const behaviorConfidence = Math.min(profile.behaviors.length / 20, 1)
    const factorConfidence = Math.min(factorCount / 5, 1)
    const dataAge =
      (Date.now() - profile.lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
    const freshnessConfidence = Math.max(0, 1 - dataAge / 30) // 30 day decay

    return (behaviorConfidence + factorConfidence + freshnessConfidence) / 3
  }

  /**
   * Updates user segments based on behavior patterns
   * @param userId - User identifier
   */
  private async updateUserSegments(userId: string): Promise<void> {
    const profile = await this.getUserProfile(userId)

    const newSegments: string[] = []

    // Engagement-based segmentation
    if (profile.engagementScore >= 80) {
      newSegments.push('high_engagement')
    } else if (profile.engagementScore >= 50) {
      newSegments.push('medium_engagement')
    } else {
      newSegments.push('low_engagement')
    }

    // Behavior-based segmentation
    const recentBehaviors = profile.behaviors.slice(-20)
    const conversions = recentBehaviors.filter((b) => b.type === 'convert')

    if (conversions.length >= 3) {
      newSegments.push('high_intent')
    }

    const shares = recentBehaviors.filter((b) => b.type === 'share')
    if (shares.length >= 2) {
      newSegments.push('advocate')
    }

    profile.segments = newSegments
  }

  /**
   * Clears user data (for privacy/GDPR compliance)
   * @param userId - User identifier
   */
  async clearUserData(userId: string): Promise<void> {
    this.userProfiles.delete(userId)
    this.contentScores.delete(userId)
  }

  /**
   * Gets engine statistics
   * @returns Engine statistics
   */
  getStats(): {
    totalUsers: number
    avgBehaviorsPerUser: number
    config: PersonalizationConfig
  } {
    const totalBehaviors = Array.from(this.userProfiles.values()).reduce(
      (sum, profile) => sum + profile.behaviors.length,
      0,
    )

    return {
      totalUsers: this.userProfiles.size,
      avgBehaviorsPerUser:
        this.userProfiles.size > 0 ? totalBehaviors / this.userProfiles.size : 0,
      config: this.config,
    }
  }
}
