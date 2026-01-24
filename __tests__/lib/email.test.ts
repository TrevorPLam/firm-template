import { beforeEach, describe, expect, it, vi } from 'vitest'

const fetchMock = vi.hoisted(() => vi.fn())
const logError = vi.hoisted(() => vi.fn())
const logInfo = vi.hoisted(() => vi.fn())

const env = {
  EMAIL_PROVIDER: 'sendgrid',
  EMAIL_API_KEY: 'email-key',
  EMAIL_FROM_ADDRESS: 'from@example.com',
  EMAIL_TO_ADDRESS: 'owner@example.com',
  EMAIL_SEND_THANK_YOU: true,
  NEXT_PUBLIC_SITE_NAME: 'Test Firm',
}

vi.stubGlobal('fetch', fetchMock)

vi.mock('@/lib/logger', () => ({
  logError,
  logInfo,
}))

vi.mock('@/lib/env', () => ({
  validatedEnv: env,
}))

const buildPayload = (overrides?: Partial<{ name: string; email: string; phone?: string; message: string }>) => ({
  name: 'Jordan Example',
  email: 'jordan@example.com',
  phone: '555-987-1234',
  message: 'Looking for help with a new project.',
  ...overrides,
})

describe('sendContactEmails', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    fetchMock.mockResolvedValue({ ok: true })
    env.EMAIL_PROVIDER = 'sendgrid'
    env.EMAIL_API_KEY = 'email-key'
    env.EMAIL_FROM_ADDRESS = 'from@example.com'
    env.EMAIL_TO_ADDRESS = 'owner@example.com'
    env.EMAIL_SEND_THANK_YOU = true
    env.NEXT_PUBLIC_SITE_NAME = 'Test Firm'
  })

  it('test_sends_owner_and_thank_you_emails_with_sendgrid', async () => {
    const { sendContactEmails } = await import('@/lib/email')
    const result = await sendContactEmails(buildPayload())

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(result.ownerNotification.success).toBe(true)
    expect(result.customerThankYou?.success).toBe(true)
    const body = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string)
    expect(body.personalizations[0].to[0].email).toBe('owner@example.com')
  })

  it('test_skips_sending_when_provider_is_none', async () => {
    env.EMAIL_PROVIDER = 'none'
    env.EMAIL_SEND_THANK_YOU = false

    const { sendContactEmails } = await import('@/lib/email')
    const result = await sendContactEmails(buildPayload())

    expect(fetchMock).not.toHaveBeenCalled()
    expect(result.ownerNotification.success).toBe(false)
    expect(result.ownerNotification.provider).toBe('none')
  })

  it('fails fast when the owner recipient address is missing', async () => {
    env.EMAIL_TO_ADDRESS = ''
    env.EMAIL_SEND_THANK_YOU = false

    const { sendContactEmails } = await import('@/lib/email')
    const result = await sendContactEmails(buildPayload())

    expect(fetchMock).not.toHaveBeenCalled()
    expect(result.ownerNotification.success).toBe(false)
    expect(logError).toHaveBeenCalledWith(
      'Email config missing owner recipient address',
      undefined,
      expect.objectContaining({ provider: env.EMAIL_PROVIDER }),
    )
  })

  it('test_handles_provider_errors_gracefully', async () => {
    env.EMAIL_PROVIDER = 'postmark'
    env.EMAIL_SEND_THANK_YOU = false
    fetchMock.mockResolvedValue({ ok: false })

    const { sendContactEmails } = await import('@/lib/email')
    const result = await sendContactEmails(buildPayload())

    expect(result.ownerNotification.success).toBe(false)
    expect(logError).toHaveBeenCalledWith(
      'Email provider returned non-OK response',
      undefined,
      expect.objectContaining({ provider: 'postmark' }),
    )
  })

  it('test_truncates_large_messages_and_fills_empty_message_defaults', async () => {
    env.EMAIL_PROVIDER = 'resend'
    env.EMAIL_SEND_THANK_YOU = false
    const longMessage = 'A'.repeat(3000)

    const { sendContactEmails } = await import('@/lib/email')
    await sendContactEmails(buildPayload({ message: longMessage }))
    await sendContactEmails(buildPayload({ message: '   ', phone: undefined }))

    const firstBody = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string)
    expect(firstBody.text.length).toBeLessThanOrEqual(2100)
    const secondBody = JSON.parse(fetchMock.mock.calls[1]?.[1]?.body as string)
    expect(secondBody.text).toContain('No message provided.')
  })
})
