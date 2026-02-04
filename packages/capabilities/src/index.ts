// AI-META-BEGIN
// 
// AI-META: Package entry point and public API exports
// OWNERSHIP: packages/capabilities
// ENTRYPOINTS: Package entry point, imported by consumers
// DEPENDENCIES: internal packages (@repo/*)
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

/**
 * Capabilities – business features (lead capture, analytics, scheduling).
 * Use integrations only via @repo/integrations; never import provider SDKs directly.
 * @see docs/PLATFORM.md
 */

export {
  LeadCapture,
  createLeadCapture,
  validateLeadData,
  validateEmail,
  validatePhone,
  defaultLeadFormConfig,
  type LeadFormData,
  type LeadFormConfig,
  type LeadCaptureConfig,
  type ValidationError,
  type SubmissionResult,
} from './lead-capture';

export {
  Analytics,
  createAnalytics,
  getAnalytics,
  initializeAnalytics,
  track,
  identify,
  defaultAnalyticsConfig,
  type AnalyticsEvent,
  type AnalyticsConfig,
  type PageViewEvent,
  type ClickEvent,
  type FormSubmissionEvent,
} from './analytics';

export {
  getAiConfig,
  validateAiConfig,
  type AiConfig,
  type AiConfigIssue,
  type AiContentPolicy,
  type AiProvider,
} from './ai';
export { getPwaConfig, type PwaConfig, type PwaManifestConfig } from './pwa';
export {
  getCmsConfig,
  validateCmsConfig,
  type CmsConfig,
  type CmsConfigIssue,
  type CmsProvider,
} from './cms';
export {
  getRealtimeConfig,
  validateRealtimeConfig,
  type RealtimeConfig,
  type RealtimeConfigIssue,
  type RealtimeProvider,
} from './realtime';
export { getWasmConfig, validateWasmConfig, type WasmConfig, type WasmConfigIssue } from './wasm';

// Blockchain integration
export {
  ProvenanceTracker,
  RightsManager,
  DigitalWatermarkManager,
  AuditTrailManager,
  LicensingContractManager,
  type BlockchainConfig,
  type ProvenanceRecord,
  type CustodyRecord,
  type DigitalRights,
  type RightsPermission,
  type RoyaltyConfig,
  type DigitalWatermark,
  type WatermarkVerification,
  type AuditEntry,
  type AuditQuery,
  type LicenseTerms,
  type UsageLimits,
  type LicenseEvent,
  type TransactionResult,
} from './blockchain';

// Voice interface
export {
  SpeechToTextEngine,
  QueryProcessor,
  NavigationCommandManager,
  ScreenReaderManager,
  VoiceAnalyticsManager,
  type VoiceConfig,
  type SpeechRecognitionResult,
  type SpeechAlternative,
  type NaturalLanguageQuery,
  type QueryEntity,
  type QueryContext,
  type VoiceCommand,
  type CommandHandler,
  type CommandParameter,
  type CommandResult,
  type ScreenReaderConfig,
  type AccessibleElement,
  type VoiceInteractionEvent,
  type VoiceAnalyticsMetrics,
  type VoiceAnalyticsReport,
  type AnalyticsTrend,
  type NavigationTarget,
  type VoiceFeedbackOptions,
} from './voice';
