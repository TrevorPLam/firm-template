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
 * @module Voice
 * Voice interface capabilities including speech recognition, natural language
 * processing, voice commands, screen reader accessibility, and analytics.
 */

export { SpeechToTextEngine } from './recognition/speech-to-text'
export { QueryProcessor } from './nlp/query-processor'
export { NavigationCommandManager } from './commands/navigation'
export { ScreenReaderManager } from './accessibility/screen-reader'
export { VoiceAnalyticsManager } from './analytics/insights'

export type {
  VoiceConfig,
  SpeechRecognitionResult,
  SpeechAlternative,
  NaturalLanguageQuery,
  QueryEntity,
  QueryContext,
  VoiceCommand,
  CommandHandler,
  CommandParameter,
  CommandResult,
  ScreenReaderConfig,
  AccessibleElement,
  VoiceInteractionEvent,
  VoiceAnalyticsMetrics,
  VoiceAnalyticsReport,
  AnalyticsTrend,
  NavigationTarget,
  VoiceFeedbackOptions,
} from './types'
