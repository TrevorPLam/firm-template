/**
 * Analytics Capability
 * 
 * Provides analytics events wrapper with track() function.
 * No-op by default, enabled via config.
 */

import { createIntegrations, IntegrationsConfig } from '@repo/integrations';

// Analytics event types
export interface AnalyticsEvent {
  eventName: string;
  payload?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  trackPageViews: boolean;
  trackClicks: boolean;
  trackFormSubmissions: boolean;
  customProperties?: Record<string, any>;
  integrations: IntegrationsConfig;
}

// Page view event data
export interface PageViewEvent {
  page: string;
  title?: string;
  referrer?: string;
  search?: string;
}

// Click event data
export interface ClickEvent {
  elementType: string;
  elementText?: string;
  elementId?: string;
  elementClass?: string;
  href?: string;
  page: string;
}

// Form submission event data
export interface FormSubmissionEvent {
  formId?: string;
  formName?: string;
  formType?: string;
  success: boolean;
  errors?: string[];
}

// Default configuration
export const defaultAnalyticsConfig: AnalyticsConfig = {
  enabled: false,
  debug: false,
  trackPageViews: true,
  trackClicks: false,
  trackFormSubmissions: true,
  integrations: {},
};

// Main Analytics class
export class Analytics {
  private config: AnalyticsConfig;
  private integrations: ReturnType<typeof createIntegrations>;
  private sessionId: string;
  private isInitialized: boolean = false;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = {
      ...defaultAnalyticsConfig,
      ...config,
      integrations: config.integrations || {},
    };
    this.integrations = createIntegrations(this.config.integrations);
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private log(message: string, data?: any): void {
    if (this.config.debug) {
      console.log(`[Analytics] ${message}`, data);
    }
  }

  /**
   * Initialize analytics (call once on app start)
   */
  initialize(userId?: string): void {
    if (!this.config.enabled) {
      this.log('Analytics disabled, skipping initialization');
      return;
    }

    this.isInitialized = true;
    this.log('Analytics initialized', { userId, sessionId: this.sessionId });

    // Track initial page view if enabled
    if (this.config.trackPageViews && typeof window !== 'undefined') {
      this.trackPageView({
        page: window.location.pathname,
        title: document.title,
        referrer: document.referrer,
      });
    }

    // Set up automatic click tracking if enabled
    if (this.config.trackClicks && typeof window !== 'undefined') {
      this.setupClickTracking();
    }
  }

  /**
   * Track a custom analytics event
   */
  track(eventName: string, payload: Record<string, any> = {}): void {
    if (!this.config.enabled || !this.isInitialized) {
      this.log('Analytics disabled or not initialized, skipping track', { eventName });
      return;
    }

    const event: AnalyticsEvent = {
      eventName,
      payload: {
        ...this.config.customProperties,
        ...payload,
      },
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };

    this.log('Tracking event', event);

    // Send to integrations
    try {
      this.integrations.analytics.track(eventName, event);
    } catch (error) {
      this.log('Failed to send event to integrations', error);
    }
  }

  /**
   * Track a page view
   */
  trackPageView(pageData: PageViewEvent): void {
    this.track('page_view', {
      page: pageData.page,
      title: pageData.title,
      referrer: pageData.referrer,
      search: pageData.search,
    });
  }

  /**
   * Track a click event
   */
  trackClick(clickData: ClickEvent): void {
    this.track('click', {
      elementType: clickData.elementType,
      elementText: clickData.elementText,
      elementId: clickData.elementId,
      elementClass: clickData.elementClass,
      href: clickData.href,
      page: clickData.page,
    });
  }

  /**
   * Track a form submission
   */
  trackFormSubmission(formData: FormSubmissionEvent): void {
    this.track('form_submission', {
      formId: formData.formId,
      formName: formData.formName,
      formType: formData.formType,
      success: formData.success,
      errors: formData.errors,
    });
  }

  /**
   * Set user identifier
   */
  identify(userId: string, traits?: Record<string, any>): void {
    if (!this.config.enabled || !this.isInitialized) {
      this.log('Analytics disabled or not initialized, skipping identify');
      return;
    }

    this.log('Identifying user', { userId, traits });

    try {
      this.integrations.analytics.identify({
        userId,
        traits,
        sessionId: this.sessionId,
      });
    } catch (error) {
      this.log('Failed to identify user in integrations', error);
    }
  }

  /**
   * Set up automatic click tracking
   */
  private setupClickTracking(): void {
    if (typeof document === 'undefined') return;

    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      const clickData: ClickEvent = {
        elementType: target.tagName.toLowerCase(),
        elementText: target.textContent?.slice(0, 100) || undefined,
        elementId: target.id || undefined,
        elementClass: target.className || undefined,
        page: window.location.pathname,
      };

      // Add href for links
      if (target.tagName.toLowerCase() === 'a') {
        const link = target as HTMLAnchorElement;
        clickData.href = link.href;
      }

      this.trackClick(clickData);
    });
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AnalyticsConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
      integrations: { ...this.config.integrations, ...newConfig.integrations },
    };
    this.integrations = createIntegrations(this.config.integrations);
    this.log('Configuration updated', this.config);
  }

  /**
   * Get current configuration
   */
  getConfig(): AnalyticsConfig {
    return { ...this.config };
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Check if analytics is enabled and initialized
   */
  isReady(): boolean {
    return this.config.enabled && this.isInitialized;
  }
}

// Factory function for easy instantiation
export function createAnalytics(config?: Partial<AnalyticsConfig>): Analytics {
  return new Analytics(config);
}

// Singleton instance for global usage
let globalAnalytics: Analytics | null = null;

/**
 * Get or create the global analytics instance
 */
export function getAnalytics(config?: Partial<AnalyticsConfig>): Analytics {
  if (!globalAnalytics) {
    globalAnalytics = createAnalytics(config);
  }
  return globalAnalytics;
}

/**
 * Initialize global analytics (convenience function)
 */
export function initializeAnalytics(config?: Partial<AnalyticsConfig>, userId?: string): void {
  const analytics = getAnalytics(config);
  analytics.initialize(userId);
}

/**
 * Global track function (convenience function)
 */
export function track(eventName: string, payload: Record<string, any> = {}): void {
  const analytics = getAnalytics();
  analytics.track(eventName, payload);
}

/**
 * Global identify function (convenience function)
 */
export function identify(userId: string, traits?: Record<string, any>): void {
  const analytics = getAnalytics();
  analytics.identify(userId, traits);
}

