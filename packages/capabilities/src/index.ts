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
