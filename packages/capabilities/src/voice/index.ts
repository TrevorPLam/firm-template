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
