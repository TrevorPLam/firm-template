import { describe, expect, it } from 'vitest'
import { contactFormSchema } from '@/lib/contact-form-schema'

const validSubmission = {
  name: 'Taylor Client',
  email: 'taylor@example.com',
  company: 'Example Co',
  phone: '+1 (415) 555-1212',
  website: '',
  message: 'We need help improving conversions on our site.',
  hearAboutUs: 'Referral',
}

describe('contactFormSchema', () => {
  it('accepts valid submissions with formatted phone numbers', () => {
    const result = contactFormSchema.safeParse(validSubmission)

    expect(result.success).toBe(true)
  })

  it('rejects disposable email domains', () => {
    const result = contactFormSchema.safeParse({
      ...validSubmission,
      email: 'lead@mailinator.com',
    })

    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.email).toContain(
      'Please use a business email address'
    )
  })

  it('rejects phone numbers with invalid characters', () => {
    const result = contactFormSchema.safeParse({
      ...validSubmission,
      phone: '123-ABC-7890',
    })

    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.phone).toContain(
      'Phone number contains invalid characters'
    )
  })

  it('rejects phone numbers without enough digits', () => {
    const result = contactFormSchema.safeParse({
      ...validSubmission,
      phone: '123-45',
    })

    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.phone).toContain(
      'Phone number must include at least 7 digits'
    )
  })
})
