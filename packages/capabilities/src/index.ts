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
