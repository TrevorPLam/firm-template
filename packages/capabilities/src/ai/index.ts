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

export {
  getAiConfig,
  validateAiConfig,
  type AiConfig,
  type AiConfigIssue,
  type AiContentPolicy,
  type AiProvider,
} from './config'

export {
  PersonalizationEngine,
  ContentOptimizer,
  UserBehaviorAnalyzer,
  ABTestingFramework,
  PerformanceAnalytics,
  type PersonalizationConfig,
  type UserProfile,
  type ContentRecommendation,
  type OptimizationStrategy,
  type ABTestConfig,
  type AnalyticsReport,
} from './personalization'
