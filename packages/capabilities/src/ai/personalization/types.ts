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
 * Type definitions for AI personalization system
 */

/**
 * Configuration options for personalization engine
 */
export interface PersonalizationConfig {
  /** Model version for ML algorithms */
  modelVersion: string
  /** Minimum confidence threshold for recommendations */
  confidenceThreshold: number
  /** Enable real-time adaptation */
  realtimeAdaptation: boolean
  /** User behavior tracking options */
  trackingOptions: TrackingOptions
  /** Content selection strategy */
  selectionStrategy: 'ml-based' | 'rule-based' | 'hybrid'
}

/**
 * User behavior tracking configuration
 */
export interface TrackingOptions {
  /** Track page views */
  pageViews: boolean
  /** Track user interactions (clicks, hovers) */
  interactions: boolean
  /** Track time on page */
  dwell: boolean
  /** Track scroll depth */
  scrollDepth: boolean
  /** Privacy mode (anonymize data) */
  privacyMode: boolean
}

/**
 * User profile for personalization
 */
export interface UserProfile {
  /** User identifier (anonymized if privacy mode) */
  userId: string
  /** User segments */
  segments: string[]
  /** Behavioral signals */
  behaviors: BehaviorSignal[]
  /** Content preferences */
  preferences: ContentPreferences
  /** Engagement score (0-100) */
  engagementScore: number
  /** Last updated timestamp */
  lastUpdated: Date
}

/**
 * Behavioral signal data
 */
export interface BehaviorSignal {
  /** Signal type */
  type: 'view' | 'click' | 'share' | 'convert' | 'bounce'
  /** Content ID */
  contentId: string
  /** Signal weight/importance */
  weight: number
  /** Timestamp */
  timestamp: Date
}

/**
 * User content preferences
 */
export interface ContentPreferences {
  /** Preferred content types */
  types: string[]
  /** Preferred topics */
  topics: string[]
  /** Preferred format (text, video, interactive) */
  formats: string[]
  /** Reading level preference */
  readingLevel?: 'beginner' | 'intermediate' | 'advanced'
}

/**
 * Content recommendation result
 */
export interface ContentRecommendation {
  /** Content ID */
  contentId: string
  /** Recommendation score (0-100) */
  score: number
  /** Confidence level (0-1) */
  confidence: number
  /** Reasoning for recommendation */
  reasoning: string[]
  /** Personalization factors applied */
  factors: PersonalizationFactor[]
}

/**
 * Personalization factor
 */
export interface PersonalizationFactor {
  /** Factor name */
  name: string
  /** Factor impact on recommendation (-1 to 1) */
  impact: number
  /** Factor category */
  category: 'behavioral' | 'demographic' | 'contextual' | 'content'
}

/**
 * Content optimization strategy
 */
export interface OptimizationStrategy {
  /** Strategy name */
  name: string
  /** Target metrics */
  metrics: string[]
  /** Optimization goals */
  goals: OptimizationGoal[]
  /** Constraints */
  constraints: OptimizationConstraint[]
}

/**
 * Optimization goal
 */
export interface OptimizationGoal {
  /** Goal name */
  name: string
  /** Target value */
  target: number
  /** Current value */
  current: number
  /** Goal weight */
  weight: number
}

/**
 * Optimization constraint
 */
export interface OptimizationConstraint {
  /** Constraint name */
  name: string
  /** Constraint type */
  type: 'max' | 'min' | 'exact'
  /** Constraint value */
  value: number
}

/**
 * A/B testing configuration
 */
export interface ABTestConfig {
  /** Test name */
  name: string
  /** Test variants */
  variants: TestVariant[]
  /** Traffic allocation */
  trafficAllocation: number
  /** Success metrics */
  successMetrics: string[]
  /** Test duration (days) */
  duration: number
  /** Minimum sample size */
  minSampleSize: number
}

/**
 * Test variant
 */
export interface TestVariant {
  /** Variant ID */
  id: string
  /** Variant name */
  name: string
  /** Variant weight (for traffic split) */
  weight: number
  /** Variant configuration */
  config: Record<string, unknown>
}

/**
 * Analytics report
 */
export interface AnalyticsReport {
  /** Report period */
  period: { start: Date; end: Date }
  /** Performance metrics */
  metrics: PerformanceMetric[]
  /** Insights and recommendations */
  insights: Insight[]
  /** Comparison to baseline */
  baseline?: BaselineComparison
}

/**
 * Performance metric
 */
export interface PerformanceMetric {
  /** Metric name */
  name: string
  /** Metric value */
  value: number
  /** Unit of measurement */
  unit: string
  /** Trend direction */
  trend: 'up' | 'down' | 'stable'
  /** Percentage change */
  change: number
}

/**
 * Analytics insight
 */
export interface Insight {
  /** Insight type */
  type: 'opportunity' | 'warning' | 'success'
  /** Insight title */
  title: string
  /** Insight description */
  description: string
  /** Recommended actions */
  actions: string[]
  /** Priority level */
  priority: 'low' | 'medium' | 'high'
}

/**
 * Baseline comparison
 */
export interface BaselineComparison {
  /** Baseline period */
  period: { start: Date; end: Date }
  /** Percentage improvement */
  improvement: number
  /** Statistical significance */
  significance: number
}
