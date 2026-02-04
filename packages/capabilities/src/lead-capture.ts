// AI-META-BEGIN
// 
// AI-META: Shared package module
// OWNERSHIP: packages/capabilities
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: internal packages (@repo/*), HubSpot (CRM)
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

/**
 * Lead Capture Capability
 * 
 * Provides form schema, validation, spam controls, and submission interface
 * for collecting leads. Integrations are disabled by default.
 */

import { createIntegrations, IntegrationsConfig } from '@repo/integrations';

// Form schema types
export interface LeadFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
  consent: boolean;
}

export interface LeadFormConfig {
  requireName: boolean;
  requireEmail: boolean;
  requireCompany: boolean;
  requirePhone: boolean;
  requireMessage: boolean;
  requireConsent: boolean;
  honeypotEnabled: boolean;
  rateLimitEnabled: boolean;
  maxSubmissionsPerMinute: number;
}

export interface LeadCaptureConfig {
  form: LeadFormConfig;
  integrations: IntegrationsConfig;
}

// Validation errors
export interface ValidationError {
  field: keyof LeadFormData;
  message: string;
}

// Submission result
export interface SubmissionResult {
  success: boolean;
  errors?: ValidationError[];
  message?: string;
  leadId?: string;
}

// Default configuration
export const defaultLeadFormConfig: LeadFormConfig = {
  requireName: true,
  requireEmail: true,
  requireCompany: false,
  requirePhone: false,
  requireMessage: false,
  requireConsent: true,
  honeypotEnabled: true,
  rateLimitEnabled: true,
  maxSubmissionsPerMinute: 5,
};

// Validation functions
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
}

export function validateLeadData(
  data: Partial<LeadFormData>,
  config: LeadFormConfig
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (config.requireName && (!data.name || data.name.trim().length < 2)) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
  }

  if (config.requireEmail && (!data.email || !validateEmail(data.email))) {
    errors.push({ field: 'email', message: 'Valid email address is required' });
  }

  if (config.requireCompany && (!data.company || data.company.trim().length < 2)) {
    errors.push({ field: 'company', message: 'Company name must be at least 2 characters long' });
  }

  if (config.requirePhone && (!data.phone || !validatePhone(data.phone))) {
    errors.push({ field: 'phone', message: 'Valid phone number is required' });
  }

  if (config.requireMessage && (!data.message || data.message.trim().length < 10)) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters long' });
  }

  if (config.requireConsent && !data.consent) {
    errors.push({ field: 'consent', message: 'Consent is required to submit' });
  }

  return errors;
}

// Spam controls
class SpamController {
  private submissions: Map<string, number[]> = new Map();
  private honeypotFields: string[] = ['website', 'fax', 'comments_extra'];

  isHoneypotTriggered(data: Record<string, any>): boolean {
    return this.honeypotFields.some((field: string) => 
      data[field] && data[field].toString().trim().length > 0
    );
  }

  isRateLimited(identifier: string, maxPerMinute: number): boolean {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    const userSubmissions = this.submissions.get(identifier) || [];
    const recentSubmissions = userSubmissions.filter(time => time > oneMinuteAgo);
    
    if (recentSubmissions.length >= maxPerMinute) {
      return true;
    }
    
    recentSubmissions.push(now);
    this.submissions.set(identifier, recentSubmissions);
    return false;
  }

  clear(): void {
    this.submissions.clear();
  }
}

// Main Lead Capture class
export class LeadCapture {
  private config: LeadCaptureConfig;
  private integrations: ReturnType<typeof createIntegrations>;
  private spamController: SpamController;

  constructor(config: Partial<LeadCaptureConfig> = {}) {
    this.config = {
      form: { ...defaultLeadFormConfig, ...config.form },
      integrations: config.integrations || {},
    };
    this.integrations = createIntegrations(this.config.integrations);
    this.spamController = new SpamController();
  }

  async submitLead(
    data: Partial<LeadFormData>,
    identifier: string = 'anonymous'
  ): Promise<SubmissionResult> {
    try {
      // Spam controls
      if (this.config.form.honeypotEnabled && this.spamController.isHoneypotTriggered(data)) {
        return { success: false, message: 'Submission blocked' };
      }

      if (this.config.form.rateLimitEnabled && 
          this.spamController.isRateLimited(identifier, this.config.form.maxSubmissionsPerMinute)) {
        return { success: false, message: 'Too many submissions. Please try again later.' };
      }

      // Validation
      const errors = validateLeadData(data, this.config.form);
      if (errors.length > 0) {
        return { success: false, errors };
      }

      // Ensure required fields are present
      const leadData: LeadFormData = {
        name: data.name || '',
        email: data.email || '',
        company: data.company,
        phone: data.phone,
        message: data.message,
        consent: data.consent || false,
      };

      // Generate lead ID
      const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Submit to integrations (if enabled)
      try {
        await this.integrations.hubspot.track({
          event: 'lead_submitted',
          properties: leadData,
        });
      } catch (error) {
        // Log but don't fail the submission if integration fails
        console.warn('HubSpot integration failed:', error);
      }

      // Track analytics event (if enabled)
      try {
        await this.integrations.analytics.track('lead_submitted', {
          leadId,
          email: leadData.email,
          company: leadData.company,
        });
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }

      return {
        success: true,
        message: 'Lead submitted successfully',
        leadId,
      };

    } catch (error) {
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  }

  updateConfig(newConfig: Partial<LeadCaptureConfig>): void {
    this.config = {
      form: { ...this.config.form, ...newConfig.form },
      integrations: { ...this.config.integrations, ...newConfig.integrations },
    };
    this.integrations = createIntegrations(this.config.integrations);
  }

  getFormConfig(): LeadFormConfig {
    return { ...this.config.form };
  }
}

// Factory function for easy instantiation
export function createLeadCapture(config?: Partial<LeadCaptureConfig>): LeadCapture {
  return new LeadCapture(config);
}
