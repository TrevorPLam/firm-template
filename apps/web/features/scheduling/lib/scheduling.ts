// AI-META-BEGIN
// 
// AI-META: Utility functions and helpers
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Imported by application code
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Add functions: safe. Modify existing: check all call sites first
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

import { validatedEnv } from '@/lib/env'

export type SchedulingProvider = 'calendly' | 'calcom' | 'none'
export type SchedulingStatus = 'enabled' | 'disabled' | 'error'

export interface SchedulingConfigInput {
  provider?: string | null
  calendlyUrl?: string | null
  calcomUsername?: string | null
}

export interface SchedulingConfig {
  status: SchedulingStatus
  provider: SchedulingProvider
  embedUrl?: string
  reason?: string
}

const normalizeProvider = (provider?: string | null): SchedulingProvider => {
  if (!provider) {
    return 'none'
  }

  const normalized = provider.toLowerCase()
  if (normalized === 'calendly' || normalized === 'calcom') {
    return normalized
  }

  // Treat unknown values as disabled to avoid exposing a broken CTA.
  return 'none'
}

const buildCalendlyEmbedUrl = (input?: string | null): string | null => {
  if (!input) {
    return null
  }

  try {
    const url = new URL(input)
    return url.toString()
  } catch {
    // Explicitly return null so the caller can surface a friendly fallback.
    return null
  }
}

const buildCalcomEmbedUrl = (input?: string | null): string | null => {
  const username = input?.trim()
  if (!username || username.includes(' ')) {
    return null
  }

  return `https://cal.com/${username}`
}

export const buildSchedulingConfig = (input: SchedulingConfigInput): SchedulingConfig => {
  const provider = normalizeProvider(input.provider)

  if (provider === 'none') {
    return {
      status: 'disabled',
      provider,
      reason: 'Scheduling provider not configured.',
    }
  }

  if (provider === 'calendly') {
    const embedUrl = buildCalendlyEmbedUrl(input.calendlyUrl)
    return embedUrl
      ? { status: 'enabled', provider, embedUrl }
      : {
        status: 'error',
        provider,
        reason: 'Calendly requires a valid scheduling URL.',
      }
  }

  const embedUrl = buildCalcomEmbedUrl(input.calcomUsername)
  return embedUrl
    ? { status: 'enabled', provider, embedUrl }
    : {
      status: 'error',
      provider,
      reason: 'Cal.com requires a valid username.',
    }
}

export const getSchedulingConfig = (): SchedulingConfig =>
  buildSchedulingConfig({
    provider: validatedEnv.SCHEDULING_PROVIDER,
    calendlyUrl: validatedEnv.CALENDLY_URL,
    calcomUsername: validatedEnv.CALCOM_USERNAME,
  })
