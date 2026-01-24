import '@testing-library/jest-dom'
import { vi, afterEach, expect } from 'vitest'
import { cleanup } from '@testing-library/react'
import { toHaveNoViolations } from 'jest-axe'
import * as fc from 'fast-check'

// Extend Vitest matchers with jest-axe for accessibility testing
expect.extend(toHaveNoViolations)

// Make fast-check available globally for property-based testing
global.fc = fc

// Only set test defaults when the environment variables are not already set to avoid clobbering caller-provided values.
process.env.SUPABASE_URL = process.env.SUPABASE_URL ?? 'https://example.supabase.co'
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'test-service-role-key'
process.env.HUBSPOT_PRIVATE_APP_TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN ?? 'test-hubspot-token'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Next.js router
const usePathnameMock = vi.fn(() => '/')

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: usePathnameMock,
  useSearchParams: () => new URLSearchParams(),
}))

export { usePathnameMock }

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
    return <img src={src} alt={alt} {...props} />
  },
}))
