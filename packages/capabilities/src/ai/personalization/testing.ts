// AI-META-BEGIN
// 
// AI-META: Test suite
// OWNERSHIP: packages/capabilities
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

/**
 * @module ABTestingFramework
 * Comprehensive A/B testing framework for experimentation,
 * statistical analysis, and variant performance evaluation.
 */

import type { ABTestConfig, TestVariant } from './types'

/**
 * Test status
 */
export type TestStatus = 'draft' | 'running' | 'paused' | 'completed' | 'cancelled'

/**
 * Active A/B test
 */
export interface ABTest extends ABTestConfig {
  /** Test identifier */
  id: string
  /** Current test status */
  status: TestStatus
  /** Test start date */
  startDate?: Date
  /** Test end date */
  endDate?: Date
  /** Current sample sizes per variant */
  sampleSizes: Record<string, number>
  /** Variant performance metrics */
  variantMetrics: Record<string, Record<string, number>>
}

/**
 * Test assignment for a user
 */
export interface TestAssignment {
  /** Test identifier */
  testId: string
  /** Assigned variant ID */
  variantId: string
  /** Assignment timestamp */
  assignedAt: Date
}

/**
 * Test result with statistical analysis
 */
export interface TestResult {
  /** Test identifier */
  testId: string
  /** Test name */
  testName: string
  /** Winner variant (if statistically significant) */
  winner?: string
  /** Variant performance comparison */
  variantPerformance: VariantPerformance[]
  /** Statistical significance (p-value) */
  significance: number
  /** Confidence interval */
  confidenceInterval: number
  /** Test conclusion */
  conclusion: string
  /** Recommendations */
  recommendations: string[]
}

/**
 * Variant performance metrics
 */
export interface VariantPerformance {
  /** Variant identifier */
  variantId: string
  /** Variant name */
  variantName: string
  /** Sample size */
  sampleSize: number
  /** Metric values */
  metrics: Record<string, number>
  /** Conversion rate (if applicable) */
  conversionRate?: number
  /** Performance vs control (%) */
  vsControl?: number
}

/**
 * A/B testing framework providing experiment management, statistical analysis,
 * and automated variant optimization.
 */
export class ABTestingFramework {
  private tests: Map<string, ABTest>
  private assignments: Map<string, TestAssignment[]>
  private testResults: Map<string, TestResult>

  constructor() {
    this.tests = new Map()
    this.assignments = new Map()
    this.testResults = new Map()
  }

  /**
   * Creates a new A/B test
   * @param config - Test configuration
   * @returns Created test with ID
   */
  createTest(config: ABTestConfig): ABTest {
    if (!config.name) {
      throw new Error('Test must have a name')
    }

    if (!config.variants || config.variants.length < 2) {
      throw new Error('Test must have at least 2 variants')
    }

    // Validate variant weights
    const totalWeight = config.variants.reduce((sum, v) => sum + v.weight, 0)
    if (Math.abs(totalWeight - 1.0) > 0.001) {
      throw new Error('Variant weights must sum to 1.0')
    }

    const testId = `test-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`

    const test: ABTest = {
      ...config,
      id: testId,
      status: 'draft',
      sampleSizes: {},
      variantMetrics: {},
    }

    // Initialize metrics for each variant
    for (const variant of config.variants) {
      test.sampleSizes[variant.id] = 0
      test.variantMetrics[variant.id] = {}
    }

    this.tests.set(testId, test)
    return test
  }

  /**
   * Starts a test
   * @param testId - Test identifier
   */
  startTest(testId: string): void {
    const test = this.tests.get(testId)
    if (!test) {
      throw new Error(`Test ${testId} not found`)
    }

    if (test.status === 'running') {
      throw new Error('Test is already running')
    }

    test.status = 'running'
    test.startDate = new Date()

    if (test.duration > 0) {
      test.endDate = new Date(Date.now() + test.duration * 24 * 60 * 60 * 1000)
    }
  }

  /**
   * Pauses a running test
   * @param testId - Test identifier
   */
  pauseTest(testId: string): void {
    const test = this.tests.get(testId)
    if (!test) {
      throw new Error(`Test ${testId} not found`)
    }

    if (test.status !== 'running') {
      throw new Error('Only running tests can be paused')
    }

    test.status = 'paused'
  }

  /**
   * Resumes a paused test
   * @param testId - Test identifier
   */
  resumeTest(testId: string): void {
    const test = this.tests.get(testId)
    if (!test) {
      throw new Error(`Test ${testId} not found`)
    }

    if (test.status !== 'paused') {
      throw new Error('Only paused tests can be resumed')
    }

    test.status = 'running'
  }

  /**
   * Stops a test
   * @param testId - Test identifier
   */
  stopTest(testId: string): void {
    const test = this.tests.get(testId)
    if (!test) {
      throw new Error(`Test ${testId} not found`)
    }

    test.status = 'completed'
    test.endDate = new Date()
  }

  /**
   * Assigns a user to a test variant
   * @param testId - Test identifier
   * @param userId - User identifier
   * @returns Assigned variant
   */
  assignVariant(testId: string, userId: string): TestVariant {
    const test = this.tests.get(testId)
    if (!test) {
      throw new Error(`Test ${testId} not found`)
    }

    if (test.status !== 'running') {
      throw new Error('Can only assign variants for running tests')
    }

    // Check if user already assigned
    const userAssignments = this.assignments.get(userId) || []
    const existingAssignment = userAssignments.find((a) => a.testId === testId)

    if (existingAssignment) {
      const variant = test.variants.find(
        (v) => v.id === existingAssignment.variantId,
      )
      if (!variant) {
        throw new Error('Variant not found')
      }
      return variant
    }

    // Assign variant based on weights
    const variant = this.selectVariantByWeight(test.variants, userId)

    // Record assignment
    const assignment: TestAssignment = {
      testId,
      variantId: variant.id,
      assignedAt: new Date(),
    }

    if (!this.assignments.has(userId)) {
      this.assignments.set(userId, [])
    }
    this.assignments.get(userId)!.push(assignment)

    // Increment sample size
    test.sampleSizes[variant.id]++

    return variant
  }

  /**
   * Selects a variant based on configured weights
   * @param variants - Available variants
   * @param userId - User identifier for consistent assignment
   * @returns Selected variant
   */
  private selectVariantByWeight(
    variants: TestVariant[],
    userId: string,
  ): TestVariant {
    // Use hash of userId for deterministic selection
    const hash = this.hashUserId(userId)
    const random = (hash % 1000000) / 1000000

    let cumulative = 0
    for (const variant of variants) {
      cumulative += variant.weight
      if (random <= cumulative) {
        return variant
      }
    }

    // Fallback to last variant
    return variants[variants.length - 1]
  }

  /**
   * Simple hash function for user ID
   * @param userId - User identifier
   * @returns Hash value
   */
  private hashUserId(userId: string): number {
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  /**
   * Records a metric for a variant
   * @param testId - Test identifier
   * @param userId - User identifier
   * @param metric - Metric name
   * @param value - Metric value
   */
  recordMetric(
    testId: string,
    userId: string,
    metric: string,
    value: number,
  ): void {
    const test = this.tests.get(testId)
    if (!test) {
      throw new Error(`Test ${testId} not found`)
    }

    const userAssignments = this.assignments.get(userId) || []
    const assignment = userAssignments.find((a) => a.testId === testId)

    if (!assignment) {
      throw new Error('User not assigned to this test')
    }

    const variantId = assignment.variantId

    if (!test.variantMetrics[variantId][metric]) {
      test.variantMetrics[variantId][metric] = 0
    }

    // Accumulate metric value (could be count, sum, etc.)
    test.variantMetrics[variantId][metric] += value
  }

  /**
   * Analyzes test results with statistical significance
   * @param testId - Test identifier
   * @returns Test result with analysis
   */
  async analyzeResults(testId: string): Promise<TestResult> {
    const test = this.tests.get(testId)
    if (!test) {
      throw new Error(`Test ${testId} not found`)
    }

    // Check minimum sample size
    const hasMinimumSample = test.variants.every(
      (v) => test.sampleSizes[v.id] >= test.minSampleSize,
    )

    if (!hasMinimumSample) {
      return {
        testId,
        testName: test.name,
        variantPerformance: [],
        significance: 0,
        confidenceInterval: 0,
        conclusion: 'Insufficient sample size. Continue testing.',
        recommendations: [
          `Minimum sample size: ${test.minSampleSize} per variant`,
          'Wait for more data before drawing conclusions',
        ],
      }
    }

    // Calculate variant performance
    const variantPerformance: VariantPerformance[] = []
    const controlVariant = test.variants[0] // First variant is control

    for (const variant of test.variants) {
      const metrics: Record<string, number> = {}

      // Calculate average metrics
      for (const metric of test.successMetrics) {
        const total = test.variantMetrics[variant.id][metric] || 0
        const sampleSize = test.sampleSizes[variant.id]
        metrics[metric] = sampleSize > 0 ? total / sampleSize : 0
      }

      // Calculate conversion rate if 'conversions' metric exists
      const conversions = test.variantMetrics[variant.id]['conversions'] || 0
      const conversionRate =
        test.sampleSizes[variant.id] > 0
          ? conversions / test.sampleSizes[variant.id]
          : 0

      // Calculate vs control
      let vsControl: number | undefined
      if (variant.id !== controlVariant.id) {
        const controlConversions =
          test.variantMetrics[controlVariant.id]['conversions'] || 0
        const controlRate =
          test.sampleSizes[controlVariant.id] > 0
            ? controlConversions / test.sampleSizes[controlVariant.id]
            : 0

        vsControl =
          controlRate > 0 ? ((conversionRate - controlRate) / controlRate) * 100 : 0
      }

      variantPerformance.push({
        variantId: variant.id,
        variantName: variant.name,
        sampleSize: test.sampleSizes[variant.id],
        metrics,
        conversionRate,
        vsControl,
      })
    }

    // Calculate statistical significance (simplified chi-square test)
    const significance = this.calculateSignificance(variantPerformance)
    const confidenceInterval = 0.95 // 95% confidence

    // Determine winner
    let winner: string | undefined
    let conclusion = ''
    const recommendations: string[] = []

    if (significance < 0.05) {
      // Statistically significant
      const bestPerformer = variantPerformance.reduce((best, current) => {
        const bestRate = best.conversionRate || 0
        const currentRate = current.conversionRate || 0
        return currentRate > bestRate ? current : best
      })

      winner = bestPerformer.variantId
      conclusion = `Statistically significant result (p=${significance.toFixed(4)}). Variant "${bestPerformer.variantName}" is the winner with ${((bestPerformer.conversionRate || 0) * 100).toFixed(2)}% conversion rate.`

      recommendations.push(`Implement variant "${bestPerformer.variantName}"`)
      recommendations.push('Monitor performance post-implementation')

      if (bestPerformer.vsControl) {
        recommendations.push(
          `Expected improvement: ${bestPerformer.vsControl.toFixed(1)}% vs control`,
        )
      }
    } else {
      conclusion = `No statistically significant difference detected (p=${significance.toFixed(4)}). Continue testing or conclude test as inconclusive.`

      recommendations.push('Consider extending test duration')
      recommendations.push('Increase traffic allocation to test')
      recommendations.push('Review test design and success metrics')
    }

    const result: TestResult = {
      testId,
      testName: test.name,
      winner,
      variantPerformance,
      significance,
      confidenceInterval,
      conclusion,
      recommendations,
    }

    this.testResults.set(testId, result)
    return result
  }

  /**
   * Calculates statistical significance using chi-square approximation
   * @param performance - Variant performance data
   * @returns P-value (significance level)
   */
  private calculateSignificance(performance: VariantPerformance[]): number {
    if (performance.length < 2) {
      return 1.0
    }

    // Simplified chi-square calculation
    const control = performance[0]
    const variant = performance[1]

    const controlConversions = (control.conversionRate || 0) * control.sampleSize
    const variantConversions = (variant.conversionRate || 0) * variant.sampleSize

    const controlNonConversions = control.sampleSize - controlConversions
    const variantNonConversions = variant.sampleSize - variantConversions

    const totalConversions = controlConversions + variantConversions
    const totalSample = control.sampleSize + variant.sampleSize

    const expectedControlConversions =
      (control.sampleSize * totalConversions) / totalSample
    const expectedVariantConversions =
      (variant.sampleSize * totalConversions) / totalSample

    // Chi-square statistic
    const chiSquare =
      Math.pow(controlConversions - expectedControlConversions, 2) /
        expectedControlConversions +
      Math.pow(variantConversions - expectedVariantConversions, 2) /
        expectedVariantConversions

    // Approximate p-value (simplified)
    // For df=1, chi-square > 3.841 means p < 0.05
    if (chiSquare > 10.828) return 0.001
    if (chiSquare > 6.635) return 0.01
    if (chiSquare > 3.841) return 0.05
    if (chiSquare > 2.706) return 0.1

    return 0.5 // Not significant
  }

  /**
   * Gets a test by ID
   * @param testId - Test identifier
   * @returns Test data
   */
  getTest(testId: string): ABTest | undefined {
    return this.tests.get(testId)
  }

  /**
   * Gets all active tests
   * @returns Array of active tests
   */
  getActiveTests(): ABTest[] {
    return Array.from(this.tests.values()).filter((t) => t.status === 'running')
  }

  /**
   * Gets test result if available
   * @param testId - Test identifier
   * @returns Test result or undefined
   */
  getTestResult(testId: string): TestResult | undefined {
    return this.testResults.get(testId)
  }

  /**
   * Gets user's test assignments
   * @param userId - User identifier
   * @returns Array of test assignments
   */
  getUserAssignments(userId: string): TestAssignment[] {
    return this.assignments.get(userId) || []
  }

  /**
   * Clears all test data
   */
  clear(): void {
    this.tests.clear()
    this.assignments.clear()
    this.testResults.clear()
  }
}
