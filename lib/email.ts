/**
 * Transactional email helpers for contact form notifications.
 *
 * @module lib/email
 *
 * Security notes:
 * - Uses server-only environment variables (never expose to client).
 * - Accepts sanitized inputs only (escapeHtml already applied upstream).
 * - Logs avoid raw email addresses or message content.
 */

import 'server-only'

import { logError, logInfo } from '@/lib/logger'
import { validatedEnv } from '@/lib/env'

type EmailProvider = 'sendgrid' | 'postmark' | 'resend' | 'none'

type ContactEmailPayload = {
  name: string
  email: string
  phone?: string
  message: string
}

type EmailMessage = {
  to: string
  from: string
  subject: string
  text: string
}

type EmailSendResult = {
  success: boolean
  provider: EmailProvider
}

type ContactEmailResults = {
  ownerNotification: EmailSendResult
  customerThankYou?: EmailSendResult
}

const MAX_MESSAGE_LENGTH = 2000

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, Math.max(0, maxLength - 3))}...`
}

function getEmailProvider(): EmailProvider {
  return validatedEnv.EMAIL_PROVIDER
}

function getEmailConfig() {
  return {
    provider: getEmailProvider(),
    apiKey: validatedEnv.EMAIL_API_KEY,
    fromAddress: validatedEnv.EMAIL_FROM_ADDRESS,
    toAddress: validatedEnv.EMAIL_TO_ADDRESS,
    sendThankYou: validatedEnv.EMAIL_SEND_THANK_YOU,
    siteName: validatedEnv.NEXT_PUBLIC_SITE_NAME,
  }
}

function buildContactSummary(payload: ContactEmailPayload) {
  const safeMessage = payload.message.trim() || 'No message provided.'
  const message = truncateText(safeMessage, MAX_MESSAGE_LENGTH)
  const phoneLine = payload.phone ? `Phone: ${payload.phone}` : 'Phone: Not provided'

  return [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    phoneLine,
    '',
    'Message:',
    message,
  ].join('\n')
}

function buildOwnerNotification(config: ReturnType<typeof getEmailConfig>, payload: ContactEmailPayload) {
  return {
    to: config.toAddress ?? '',
    from: config.fromAddress ?? '',
    subject: `New contact request for ${config.siteName}`,
    text: buildContactSummary(payload),
  }
}

function buildCustomerThankYou(config: ReturnType<typeof getEmailConfig>, payload: ContactEmailPayload) {
  return {
    to: payload.email,
    from: config.fromAddress ?? '',
    subject: `Thanks for contacting ${config.siteName}`,
    text: [
      `Hi ${payload.name},`,
      '',
      "Thanks for reaching out. We'll review your message and get back to you soon.",
      '',
      'Best,',
      config.siteName,
    ].join('\n'),
  }
}

async function sendWithSendGrid(apiKey: string, message: EmailMessage) {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: message.to }] }],
      from: { email: message.from },
      subject: message.subject,
      content: [{ type: 'text/plain', value: message.text }],
    }),
  })

  return response.ok
}

async function sendWithPostmark(apiKey: string, message: EmailMessage) {
  const response = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: {
      'X-Postmark-Server-Token': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      From: message.from,
      To: message.to,
      Subject: message.subject,
      TextBody: message.text,
    }),
  })

  return response.ok
}

async function sendWithResend(apiKey: string, message: EmailMessage) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: message.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
    }),
  })

  return response.ok
}

async function sendEmail(message: EmailMessage): Promise<EmailSendResult> {
  const config = getEmailConfig()
  if (config.provider === 'none') {
    return { success: false, provider: 'none' }
  }

  if (!config.apiKey || !config.fromAddress) {
    logError('Email config missing required values', undefined, {
      provider: config.provider,
    })
    return { success: false, provider: config.provider }
  }

  try {
    const ok = await (config.provider === 'sendgrid'
      ? sendWithSendGrid(config.apiKey, message)
      : config.provider === 'postmark'
      ? sendWithPostmark(config.apiKey, message)
      : sendWithResend(config.apiKey, message))

    if (!ok) {
      logError('Email provider returned non-OK response', undefined, {
        provider: config.provider,
      })
    }

    return { success: ok, provider: config.provider }
  } catch (error) {
    logError('Email sending failed', error, { provider: config.provider })
    return { success: false, provider: config.provider }
  }
}

export async function sendContactEmails(payload: ContactEmailPayload): Promise<ContactEmailResults> {
  const config = getEmailConfig()
  if (config.provider === 'none') {
    return { ownerNotification: { success: false, provider: 'none' } }
  }

  const ownerMessage = buildOwnerNotification(config, payload)
  const ownerResult = await sendEmail(ownerMessage)

  if (ownerResult.success) {
    logInfo('Contact form owner notification sent', { provider: ownerResult.provider })
  }

  if (!config.sendThankYou) {
    return { ownerNotification: ownerResult }
  }

  const customerMessage = buildCustomerThankYou(config, payload)
  const customerResult = await sendEmail(customerMessage)

  if (customerResult.success) {
    logInfo('Contact form thank-you email sent', { provider: customerResult.provider })
  }

  return { ownerNotification: ownerResult, customerThankYou: customerResult }
}
