/**
 * Feature Flags System
 * 
 * Feature flags enable:
 * - Gradual rollouts (1% → 10% → 100%)
 * - Instant rollbacks without redeployment
 * - A/B testing
 * - Safe deployments
 * 
 * Usage:
 * ```ts
 * if (isFeatureEnabled('new-checkout')) {
 *   return <NewCheckout />
 * }
 * return <OldCheckout />
 * ```
 * 
 * For production, use a service like:
 * - LaunchDarkly (https://launchdarkly.com)
 * - Flagsmith (https://flagsmith.com) - Open source
 * - Unleash (https://www.getunleash.io) - Open source
 */

type FeatureFlag = 
  | 'new-checkout'
  | 'experimental-ui'
  | 'beta-features'
  | string

interface FeatureFlagConfig {
  enabled: boolean
  rolloutPercentage?: number
  userIds?: string[]
  environments?: string[]
}

/**
 * In-memory feature flag store
 * 
 * For production, replace with:
 * - LaunchDarkly SDK
 * - Flagsmith SDK
 * - Unleash SDK
 * - Custom API integration
 */
const featureFlags: Record<FeatureFlag, FeatureFlagConfig> = {
  'new-checkout': {
    enabled: process.env.NEXT_PUBLIC_FEATURE_NEW_CHECKOUT === 'true',
    rolloutPercentage: 0, // 0% rollout by default
  },
  'experimental-ui': {
    enabled: process.env.NODE_ENV === 'development',
  },
  'beta-features': {
    enabled: false,
  },
}

/**
 * Check if a feature is enabled
 * 
 * @param flag - Feature flag name
 * @param userId - Optional user ID for user-specific flags
 * @returns true if feature is enabled
 */
export function isFeatureEnabled(
  flag: FeatureFlag,
  userId?: string
): boolean {
  const config = featureFlags[flag]

  if (!config) {
    // Unknown flags default to false (fail closed)
    return false
  }

  if (!config.enabled) {
    return false
  }

  // Check environment restrictions
  if (config.environments && !config.environments.includes(process.env.NODE_ENV || 'development')) {
    return false
  }

  // Check user-specific flags
  if (config.userIds && userId && config.userIds.includes(userId)) {
    return true
  }

  // Check rollout percentage
  if (config.rolloutPercentage !== undefined) {
    // Simple hash-based rollout (for demo)
    // In production, use proper hashing
    if (userId) {
      const hash = simpleHash(userId + flag)
      return (hash % 100) < config.rolloutPercentage
    }
    // Without userId, use random (not recommended for production)
    return Math.random() * 100 < config.rolloutPercentage
  }

  return true
}

/**
 * Simple hash function for rollout
 * 
 * In production, use a proper hash function like:
 * - crypto.createHash('sha256')
 * - Consistent hashing
 */
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

/**
 * Get all enabled features for a user
 */
export function getEnabledFeatures(userId?: string): FeatureFlag[] {
  return Object.keys(featureFlags).filter(flag =>
    isFeatureEnabled(flag as FeatureFlag, userId)
  )
}

/**
 * React hook for feature flags
 * 
 * Usage in components:
 * ```tsx
 * const isNewCheckoutEnabled = useFeatureFlag('new-checkout', userId)
 * ```
 */
export function useFeatureFlag(flag: FeatureFlag, userId?: string): boolean {
  // In a real implementation, this would:
  // 1. Subscribe to feature flag changes
  // 2. Re-render when flags change
  // 3. Handle loading states
  
  return isFeatureEnabled(flag, userId)
}
