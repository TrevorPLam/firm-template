// AI-META-BEGIN
// 
// AI-META: Utility functions and helpers
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Imported by application code
// DEPENDENCIES: Zod (validation)
// DANGER: None identified
// CHANGE-SAFETY: Add functions: safe. Modify existing: check all call sites first
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

import { z } from 'zod'

const blockedEmailDomains = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'tempmail.com',
  '10minutemail.com',
  'yopmail.com',
])

const hasBlockedDomain = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase()
  return domain ? blockedEmailDomains.has(domain) : false
}

const phonePattern = /^[+]?[\d\s().-]+$/
const minimumPhoneDigits = 7

const hasMinimumDigits = (phone: string): boolean =>
  phone.replace(/\D/g, '').length >= minimumPhoneDigits

// Contact form schema with enhanced validation
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z
    .string()
    .email('Invalid email address')
    .max(254)
    .refine((value) => !hasBlockedDomain(value), 'Please use a business email address'),
  company: z.string().max(200).optional(),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .max(50)
    .refine((value) => phonePattern.test(value), 'Phone number contains invalid characters')
    .refine((value) => hasMinimumDigits(value), 'Phone number must include at least 7 digits')
    .optional(),
  // Honeypot trap: bots that fill this get blocked upstream in submitContactForm
  website: z.string().max(0, 'Honeypot must be empty').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  hearAboutUs: z.string().max(100).optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
