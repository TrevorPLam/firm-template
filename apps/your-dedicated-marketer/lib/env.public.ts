// AI-META-BEGIN
// 
// AI-META: Environment variable validation and configuration
// OWNERSHIP: apps/your-dedicated-marketer
// ENTRYPOINTS: Imported by application code
// DEPENDENCIES: Zod (validation)
// DANGER: Server-only code - must never be imported by client; Environment variable access - validate all values
// CHANGE-SAFETY: Add new variables: safe. Remove/rename existing: breaking change
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

/**
 * Public (browser-safe) environment helpers.
 *
 * IMPORTANT:
 * - This module must never reference server-only env vars.
 * - Only NEXT_PUBLIC_* vars are allowed here.
 */

import { z } from 'zod'

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_NAME: z.string().default('Your Dedicated Marketer'),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
})

const publicEnv = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
})

if (!publicEnv.success) {
  console.error('❌ Invalid public environment variables:', publicEnv.error.flatten().fieldErrors)
  throw new Error('Invalid public environment variables')
}

export const validatedPublicEnv = publicEnv.data

// Base URL helper for metadata/routes; stays public-only to avoid leaking secrets into client bundles
export const getPublicBaseUrl = () => validatedPublicEnv.NEXT_PUBLIC_SITE_URL
