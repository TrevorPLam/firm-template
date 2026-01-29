/**
 * Site configuration module.
 *
 * @module lib/config
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Centralized configuration for site-wide constants like
 * contact information, social media links, and branding. Reduces hardcoded
 * values and improves maintainability.
 *
 * **USAGE PATTERN**:
 * ```typescript
 * import { siteConfig } from '@/lib/config'
 * 
 * // Access contact info
 * const email = siteConfig.contact.email
 * const phone = siteConfig.contact.phone
 * 
 * // Access social links
 * const socials = siteConfig.social
 * ```
 *
 * **ENVIRONMENT VARIABLES**:
 * - NEXT_PUBLIC_CONTACT_EMAIL - Contact email address
 * - NEXT_PUBLIC_CONTACT_PHONE - Contact phone number (E.164 format)
 * - NEXT_PUBLIC_SOCIAL_FACEBOOK - Facebook profile URL
 * - NEXT_PUBLIC_SOCIAL_TWITTER - Twitter/X profile URL
 * - NEXT_PUBLIC_SOCIAL_TWITTER_HANDLE - Twitter/X handle (e.g., @yourfirm)
 * - NEXT_PUBLIC_SOCIAL_LINKEDIN - LinkedIn profile URL
 * - NEXT_PUBLIC_OFFICE_HOURS - Office hours string
 *
 * **ADDING NEW CONFIG**:
 * 1. Add to SiteConfig interface
 * 2. Add to siteConfig object with default
 * 3. Add to .env.example if environment variable
 * 4. Update documentation
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Site configuration interface.
 * Defines the structure of site-wide configuration.
 */
export interface SiteConfig {
  contact: {
    email: string
    phone: string
    phoneDisplay: string
    officeHours: string
  }
  social: {
    facebook?: string
    twitter?: string
    twitterHandle?: string
    linkedin?: string
  }
}

/**
 * Site configuration object.
 * 
 * **Contact Information**:
 * - Email and phone are required for contact forms and structured data
 * - Phone format: E.164 (e.g., +15551234567) for tel: links
 * - Phone display: Human-readable (e.g., (555) 123-4567) for UI
 * 
 * **Social Media**:
 * - All social links are optional
 * - Only defined links will be displayed in UI and structured data
 * - Should be full URLs (e.g., https://www.facebook.com/yourfirm)
 * 
 * **Environment Variables**:
 * Set via NEXT_PUBLIC_* variables to customize per deployment.
 * Falls back to placeholder values if not set (for development).
 */
export const siteConfig: SiteConfig = {
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@yourfirm.com',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+15551234567',
    phoneDisplay: process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY || '(555) 123-4567',
    officeHours: process.env.NEXT_PUBLIC_OFFICE_HOURS || 'Monday - Friday, 9:00 AM - 5:00 PM EST',
  },
  social: {
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || 'https://www.facebook.com/yourfirm',
    twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || 'https://www.twitter.com/yourfirm',
    twitterHandle: process.env.NEXT_PUBLIC_SOCIAL_TWITTER_HANDLE || '@yourfirmname',
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || 'https://www.linkedin.com/company/yourfirm',
  },
}

/**
 * Get social media URLs as an array for structured data.
 * Only includes defined (non-empty) URLs.
 * 
 * @returns Array of social media URLs
 */
export function getSocialUrls(): string[] {
  return Object.values(siteConfig.social).filter((url): url is string => Boolean(url))
}
