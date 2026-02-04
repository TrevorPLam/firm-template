/**
 * @module ContentOptimizer
 * Content optimization engine for improving content performance through
 * data-driven strategies and multi-objective optimization.
 */

import type {
  OptimizationStrategy,
  OptimizationGoal,
  OptimizationConstraint,
  UserProfile,
} from './types'

/**
 * Content optimization result
 */
export interface OptimizationResult {
  /** Content ID that was optimized */
  contentId: string
  /** Optimization strategy applied */
  strategy: string
  /** Improvements achieved */
  improvements: Record<string, number>
  /** Recommendations for further optimization */
  recommendations: string[]
  /** Confidence in optimization (0-1) */
  confidence: number
}

/**
 * Content metadata for optimization
 */
export interface ContentMetadata {
  /** Content identifier */
  id: string
  /** Content title */
  title: string
  /** Content type */
  type: string
  /** Content topics/tags */
  topics: string[]
  /** Historical performance metrics */
  metrics: Record<string, number>
  /** Target audience segments */
  targetSegments: string[]
}

/**
 * Content optimizer that applies data-driven strategies to improve
 * content performance across multiple objectives.
 */
export class ContentOptimizer {
  private strategies: Map<string, OptimizationStrategy>
  private contentMetrics: Map<string, ContentMetadata>
  private optimizationHistory: Map<string, OptimizationResult[]>

  constructor() {
    this.strategies = new Map()
    this.contentMetrics = new Map()
    this.optimizationHistory = new Map()
  }

  /**
   * Registers an optimization strategy
   * @param strategy - Optimization strategy to register
   */
  registerStrategy(strategy: OptimizationStrategy): void {
    if (!strategy.name) {
      throw new Error('Strategy must have a name')
    }

    if (!strategy.metrics || strategy.metrics.length === 0) {
      throw new Error('Strategy must define at least one metric')
    }

    this.strategies.set(strategy.name, strategy)
  }

  /**
   * Registers content metadata for optimization
   * @param metadata - Content metadata
   */
  registerContent(metadata: ContentMetadata): void {
    if (!metadata.id) {
      throw new Error('Content must have an ID')
    }

    this.contentMetrics.set(metadata.id, metadata)
  }

  /**
   * Optimizes content based on a strategy
   * @param contentId - Content identifier
   * @param strategyName - Name of strategy to apply
   * @param userProfiles - Optional user profiles for personalized optimization
   * @returns Optimization result with improvements and recommendations
   */
  async optimize(
    contentId: string,
    strategyName: string,
    userProfiles?: UserProfile[],
  ): Promise<OptimizationResult> {
    const strategy = this.strategies.get(strategyName)
    if (!strategy) {
      throw new Error(`Strategy "${strategyName}" not found`)
    }

    const content = this.contentMetrics.get(contentId)
    if (!content) {
      throw new Error(`Content "${contentId}" not found`)
    }

    const improvements: Record<string, number> = {}
    const recommendations: string[] = []

    // Check each optimization goal
    for (const goal of strategy.goals) {
      const improvement = await this.optimizeGoal(
        content,
        goal,
        strategy.constraints,
        userProfiles,
      )

      improvements[goal.name] = improvement.value
      recommendations.push(...improvement.recommendations)
    }

    // Calculate overall confidence based on goal achievement
    const confidence = this.calculateOptimizationConfidence(
      strategy.goals,
      improvements,
    )

    const result: OptimizationResult = {
      contentId,
      strategy: strategyName,
      improvements,
      recommendations: this.deduplicateRecommendations(recommendations),
      confidence,
    }

    // Store optimization history
    if (!this.optimizationHistory.has(contentId)) {
      this.optimizationHistory.set(contentId, [])
    }
    this.optimizationHistory.get(contentId)!.push(result)

    return result
  }

  /**
   * Optimizes content for a specific goal
   * @param content - Content metadata
   * @param goal - Optimization goal
   * @param constraints - Optimization constraints
   * @param userProfiles - Optional user profiles
   * @returns Optimization improvement data
   */
  private async optimizeGoal(
    content: ContentMetadata,
    goal: OptimizationGoal,
    constraints: OptimizationConstraint[],
    userProfiles?: UserProfile[],
  ): Promise<{ value: number; recommendations: string[] }> {
    const recommendations: string[] = []
    const currentValue = content.metrics[goal.name] || goal.current

    // Calculate gap to target
    const gap = goal.target - currentValue
    const gapPercentage = (gap / goal.target) * 100

    // Generate recommendations based on goal type
    if (goal.name === 'engagement_rate') {
      if (gapPercentage > 20) {
        recommendations.push(
          'Consider adding interactive elements (polls, quizzes, CTAs)',
        )
        recommendations.push('Optimize content length for target audience')
      }

      if (userProfiles && userProfiles.length > 0) {
        const avgEngagement =
          userProfiles.reduce((sum, p) => sum + p.engagementScore, 0) /
          userProfiles.length

        if (avgEngagement < 50) {
          recommendations.push(
            'Target audience shows low engagement - consider content repositioning',
          )
        }
      }
    }

    if (goal.name === 'conversion_rate') {
      if (gapPercentage > 15) {
        recommendations.push('Strengthen call-to-action placement and clarity')
        recommendations.push('Add social proof elements (testimonials, stats)')
      }
    }

    if (goal.name === 'time_on_page') {
      if (gapPercentage > 25) {
        recommendations.push('Improve content structure with clear headings')
        recommendations.push('Add multimedia elements to increase engagement')
      }
    }

    if (goal.name === 'bounce_rate' && currentValue > goal.target) {
      recommendations.push('Improve page load speed')
      recommendations.push('Enhance content relevance to landing sources')
      recommendations.push('Add internal links to related content')
    }

    // Check constraints
    for (const constraint of constraints) {
      const constraintMet = this.checkConstraint(
        content,
        constraint,
        currentValue,
      )
      if (!constraintMet) {
        recommendations.push(
          `Constraint violation: ${constraint.name} ${constraint.type} ${constraint.value}`,
        )
      }
    }

    // Estimate improvement (simplified model)
    const potentialImprovement = Math.min(
      gap * 0.3, // 30% improvement potential
      gap * goal.weight, // Weight-adjusted improvement
    )

    return {
      value: potentialImprovement,
      recommendations,
    }
  }

  /**
   * Checks if a constraint is met
   * @param content - Content metadata
   * @param constraint - Constraint to check
   * @param currentValue - Current metric value
   * @returns True if constraint is met
   */
  private checkConstraint(
    content: ContentMetadata,
    constraint: OptimizationConstraint,
    currentValue: number,
  ): boolean {
    const value = content.metrics[constraint.name] || currentValue

    switch (constraint.type) {
      case 'max':
        return value <= constraint.value
      case 'min':
        return value >= constraint.value
      case 'exact':
        return Math.abs(value - constraint.value) < 0.01
      default:
        return true
    }
  }

  /**
   * Calculates optimization confidence
   * @param goals - Optimization goals
   * @param improvements - Achieved improvements
   * @returns Confidence score (0-1)
   */
  private calculateOptimizationConfidence(
    goals: OptimizationGoal[],
    improvements: Record<string, number>,
  ): number {
    if (goals.length === 0) {
      return 0
    }

    let totalWeightedConfidence = 0
    let totalWeight = 0

    for (const goal of goals) {
      const improvement = improvements[goal.name] || 0
      const gap = goal.target - goal.current

      // Confidence based on how much of the gap was closed
      const goalConfidence =
        gap === 0 ? 1 : Math.min(improvement / Math.abs(gap), 1)

      totalWeightedConfidence += goalConfidence * goal.weight
      totalWeight += goal.weight
    }

    return totalWeight > 0 ? totalWeightedConfidence / totalWeight : 0
  }

  /**
   * Removes duplicate recommendations
   * @param recommendations - Array of recommendations
   * @returns Deduplicated recommendations
   */
  private deduplicateRecommendations(recommendations: string[]): string[] {
    return Array.from(new Set(recommendations))
  }

  /**
   * Performs batch optimization on multiple content items
   * @param contentIds - Array of content IDs
   * @param strategyName - Strategy to apply
   * @returns Array of optimization results
   */
  async batchOptimize(
    contentIds: string[],
    strategyName: string,
  ): Promise<OptimizationResult[]> {
    if (contentIds.length === 0) {
      return []
    }

    const results: OptimizationResult[] = []

    for (const contentId of contentIds) {
      try {
        const result = await this.optimize(contentId, strategyName)
        results.push(result)
      } catch (error) {
        console.error(`Failed to optimize content ${contentId}:`, error)
      }
    }

    return results
  }

  /**
   * Gets optimization history for content
   * @param contentId - Content identifier
   * @returns Array of past optimization results
   */
  getHistory(contentId: string): OptimizationResult[] {
    return this.optimizationHistory.get(contentId) || []
  }

  /**
   * Analyzes strategy effectiveness across all optimizations
   * @param strategyName - Strategy name
   * @returns Strategy performance metrics
   */
  analyzeStrategyEffectiveness(strategyName: string): {
    totalOptimizations: number
    avgConfidence: number
    avgImprovements: Record<string, number>
    successRate: number
  } {
    const allResults = Array.from(this.optimizationHistory.values()).flat()
    const strategyResults = allResults.filter(
      (r) => r.strategy === strategyName,
    )

    if (strategyResults.length === 0) {
      return {
        totalOptimizations: 0,
        avgConfidence: 0,
        avgImprovements: {},
        successRate: 0,
      }
    }

    const avgConfidence =
      strategyResults.reduce((sum, r) => sum + r.confidence, 0) /
      strategyResults.length

    // Aggregate improvements
    const improvementKeys = new Set<string>()
    strategyResults.forEach((r) => {
      Object.keys(r.improvements).forEach((key) => improvementKeys.add(key))
    })

    const avgImprovements: Record<string, number> = {}
    for (const key of improvementKeys) {
      const values = strategyResults
        .map((r) => r.improvements[key])
        .filter((v) => v !== undefined)

      avgImprovements[key] =
        values.reduce((sum, v) => sum + v, 0) / values.length
    }

    const successRate =
      strategyResults.filter((r) => r.confidence > 0.7).length /
      strategyResults.length

    return {
      totalOptimizations: strategyResults.length,
      avgConfidence,
      avgImprovements,
      successRate,
    }
  }

  /**
   * Clears optimization history
   */
  clearHistory(): void {
    this.optimizationHistory.clear()
  }
}
