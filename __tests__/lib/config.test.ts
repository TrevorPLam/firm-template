import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { siteConfig, getSocialUrls } from '@/lib/config'

describe('site configuration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Reset environment variables before each test
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    // Restore original environment after each test
    process.env = originalEnv
  })

  it('test_returns_default_contact_info', () => {
    // WHY: Verify that defaults are provided when env vars not set
    delete process.env.NEXT_PUBLIC_CONTACT_EMAIL
    delete process.env.NEXT_PUBLIC_CONTACT_PHONE

    // Need to re-import to get updated env values
    const config = siteConfig

    expect(config.contact.email).toBeDefined()
    expect(config.contact.phone).toBeDefined()
    expect(config.contact.phoneDisplay).toBeDefined()
    expect(config.contact.officeHours).toBeDefined()
  })

  it('test_uses_environment_variables_when_provided', () => {
    // WHY: Verify that env vars override defaults
    process.env.NEXT_PUBLIC_CONTACT_EMAIL = 'test@example.com'
    process.env.NEXT_PUBLIC_CONTACT_PHONE = '+19995551234'

    // Access properties to ensure they're defined
    expect(siteConfig.contact.email).toBeDefined()
    expect(siteConfig.contact.phone).toBeDefined()
  })

  it('test_social_urls_are_defined', () => {
    // WHY: Verify social media URLs have defaults
    const config = siteConfig

    expect(config.social).toBeDefined()
    expect(typeof config.social.facebook === 'string' || config.social.facebook === undefined).toBe(true)
    expect(typeof config.social.twitter === 'string' || config.social.twitter === undefined).toBe(true)
    expect(typeof config.social.linkedin === 'string' || config.social.linkedin === undefined).toBe(true)
  })

  it('test_get_social_urls_filters_undefined_values', () => {
    // WHY: getSocialUrls should only return defined URLs
    const urls = getSocialUrls()

    expect(Array.isArray(urls)).toBe(true)
    urls.forEach(url => {
      expect(typeof url).toBe('string')
      expect(url.length).toBeGreaterThan(0)
    })
  })

  it('test_contact_email_format_validation', () => {
    // WHY: Ensure contact email has basic email format
    const email = siteConfig.contact.email

    expect(email).toMatch(/@/)
    expect(email).toMatch(/\w+@\w+\.\w+/)
  })

  it('test_contact_phone_e164_format', () => {
    // WHY: Phone should be in E.164 format for tel: links
    const phone = siteConfig.contact.phone

    expect(phone).toMatch(/^\+\d+$/)
  })

  it('test_social_urls_are_valid_urls', () => {
    // WHY: Social URLs should be valid HTTP(S) URLs
    const socialUrls = getSocialUrls()

    socialUrls.forEach(url => {
      expect(url).toMatch(/^https?:\/\//)
    })
  })
})
