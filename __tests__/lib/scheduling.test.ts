import { describe, expect, test } from 'vitest'
import { buildSchedulingConfig } from '@/lib/scheduling'

describe('buildSchedulingConfig', () => {
  test('test_happy_calendly_config_returns_embed_url', () => {
    // Happy path: a valid Calendly URL should enable scheduling.
    const result = buildSchedulingConfig({
      provider: 'calendly',
      calendlyUrl: 'https://calendly.com/your-firm/intro',
    })

    expect(result.status).toBe('enabled')
    expect(result.embedUrl).toBe('https://calendly.com/your-firm/intro')
  })

  test('test_empty_provider_returns_disabled', () => {
    // Edge case: missing provider should intentionally hide scheduling CTAs.
    const result = buildSchedulingConfig({})

    expect(result.status).toBe('disabled')
    expect(result.provider).toBe('none')
  })

  test('test_error_calcom_missing_username_returns_error', () => {
    // Error case: Cal.com requires a username, so empty input should surface a config error.
    const result = buildSchedulingConfig({ provider: 'calcom', calcomUsername: '' })

    expect(result.status).toBe('error')
    expect(result.reason).toMatch(/Cal\.com requires a valid username/)
  })
})
