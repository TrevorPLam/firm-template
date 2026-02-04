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
 * AI-Powered Content Personalization Engine
 *
 * Provides advanced machine learning capabilities for dynamic content optimization
 * and personalized user experience delivery based on behavior analysis.
 *
 * @module @firm-template/capabilities/ai/personalization
 */

export { PersonalizationEngine } from './engine'
export { ContentOptimizer } from './optimizer'
export { UserBehaviorAnalyzer } from './analyzer'
export { ABTestingFramework } from './testing'
export { PerformanceAnalytics } from './analytics'

export type {
  PersonalizationConfig,
  UserProfile,
  ContentRecommendation,
  OptimizationStrategy,
  ABTestConfig,
  AnalyticsReport,
} from './types'
