import { beforeEach, describe, expect, it, vi } from 'vitest'

const fetchMock = vi.hoisted(() => vi.fn())
const logError = vi.hoisted(() => vi.fn())
const logInfo = vi.hoisted(() => vi.fn())
const logWarn = vi.hoisted(() => vi.fn())
const sendContactEmails = vi.hoisted(() => vi.fn())
const supabaseUrl = 'https://supabase.example'

vi.stubGlobal('fetch', fetchMock)

vi.mock('next/headers', () => ({
  headers: () => ({
    get: (key: string) => (key === 'x-forwarded-for' ? '203.0.113.9' : null),
  }),
}))

vi.mock('@/lib/logger', () => ({
  logError,
  logInfo,
  logWarn,
}))

vi.mock('@/lib/email', () => ({
  sendContactEmails,
}))

vi.mock('@/lib/env', () => ({
  validatedEnv: {
    SUPABASE_URL: supabaseUrl,
    SUPABASE_SERVICE_ROLE_KEY: 'supabase-key',
    HUBSPOT_PRIVATE_APP_TOKEN: 'hubspot-token',
    UPSTASH_REDIS_REST_URL: '',
    UPSTASH_REDIS_REST_TOKEN: '',
  },
}))

const buildPayload = (email: string) => ({
  name: 'Jamie\nTest',
  email,
  phone: '555-123-4567',
  website: '',
  message: 'Looking for professional services support. <script>alert(1)</script>',
})

const buildResponse = (data: unknown, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => data,
})

describe('contact form lead pipeline', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    sendContactEmails.mockResolvedValue({
      ownerNotification: { success: true, provider: 'sendgrid' },
      customerThankYou: { success: true, provider: 'sendgrid' },
    })
    fetchMock.mockImplementation(async (input: RequestInfo) => {
      const url = typeof input === 'string' ? input : input.toString()
      const supabaseRestUrl = `${supabaseUrl}/rest/v1/leads`

      if (url === supabaseRestUrl) {
        return buildResponse([{ id: 'lead-123' }])
      }

      if (url.startsWith(`${supabaseRestUrl}?id=eq.`)) {
        return buildResponse([])
      }

      if (url.endsWith('/crm/v3/objects/contacts/search')) {
        return buildResponse({ total: 0, results: [] })
      }

      if (url.endsWith('/crm/v3/objects/contacts')) {
        return buildResponse({ id: 'hubspot-123' })
      }

      if (url.includes('/crm/v3/objects/contacts/')) {
        return buildResponse({ id: 'hubspot-123' })
      }

      return buildResponse({ message: 'not found' }, false, 404)
    })
  })

  it('test_stores_a_sanitized_lead_and_syncs_to_hubspot', async () => {
    const { submitContactForm } = await import('@/lib/actions/contact-form')
    const response = await submitContactForm(buildPayload('jamie@example.com'))

    expect(response.success).toBe(true)
    expect(sendContactEmails).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'jamie@example.com',
        message: expect.stringContaining('&lt;script&gt;alert(1)&lt;'),
      }),
    )
    const insertCall = fetchMock.mock.calls.find(([url]) => url === `${supabaseUrl}/rest/v1/leads`)
    const insertBody = JSON.parse(insertCall?.[1]?.body as string)[0]

    expect(insertBody.message).toMatch(/&lt;script&gt;alert\(1\)&lt;.*script&gt;/)
    expect(insertBody.is_suspicious).toBe(false)
  })

  it('test_returns_success_even_when_hubspot_fails', async () => {
    fetchMock.mockImplementation(async (input: RequestInfo) => {
      const url = typeof input === 'string' ? input : input.toString()
      const supabaseRestUrl = `${supabaseUrl}/rest/v1/leads`

      if (url === supabaseRestUrl) {
        return buildResponse([{ id: 'lead-456' }])
      }

      if (url.startsWith(`${supabaseRestUrl}?id=eq.`)) {
        return buildResponse([])
      }

      if (url.endsWith('/crm/v3/objects/contacts/search')) {
        return buildResponse({ message: 'HubSpot failure' }, false, 500)
      }

      return buildResponse({ message: 'not found' }, false, 404)
    })

    const { submitContactForm } = await import('@/lib/actions/contact-form')
    const response = await submitContactForm(buildPayload('error@example.com'))

    expect(response.success).toBe(true)
    expect(logError).toHaveBeenCalledWith('HubSpot sync failed', expect.any(Error))
    const updateCall = fetchMock.mock.calls.find(([url]) =>
      typeof url === 'string' && url.startsWith(`${supabaseUrl}/rest/v1/leads?id=eq.`)
    )
    const updateBody = JSON.parse(updateCall?.[1]?.body as string)
    expect(updateBody.hubspot_sync_status).toBe('needs_sync')
  })
})
