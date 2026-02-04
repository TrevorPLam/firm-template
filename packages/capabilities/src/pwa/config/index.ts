// AI-META-BEGIN
// 
// AI-META: Package entry point and public API exports
// OWNERSHIP: packages/capabilities
// ENTRYPOINTS: Package entry point, imported by consumers
// DEPENDENCIES: Standard library only
// DANGER: Environment variable access - validate all values
// CHANGE-SAFETY: Config values: safe to modify. Schema/structure: coordinate with team
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

export interface PwaManifestConfig {
  /** Display name shown on install prompts and launchers. */
  name: string
  /** Short name for compact display contexts. */
  shortName: string
  /** Theming color for the address bar / status UI. */
  themeColor: string
  /** Background color used while the app is loading. */
  backgroundColor: string
  /** Manifest start URL. */
  startUrl: string
  /** Display mode (standalone, minimal-ui, fullscreen). */
  display: 'standalone' | 'minimal-ui' | 'fullscreen' | 'browser'
}

export type PwaUpdateStrategy = 'prompt' | 'auto'

export interface PwaConfig {
  /** Whether the PWA runtime should be enabled. */
  enabled: boolean
  /** URL for the offline fallback page. */
  offlineFallbackPath: string
  /** Service worker file path served at the root. */
  serviceWorkerPath: string
  /** Public VAPID key for push notification registration. */
  vapidPublicKey?: string
  /** Whether install prompts should be shown. */
  enableInstallPrompt: boolean
  /** Strategy for prompting when a new service worker is available. */
  updateStrategy: PwaUpdateStrategy
  /** Enable performance monitoring hooks for PWA runtime. */
  enablePerformanceMonitoring: boolean
  /** Manifest settings for the app. */
  manifest: PwaManifestConfig
}

const parseBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) {
    return fallback
  }

  return value.toLowerCase() === 'true'
}

/**
 * PWA configuration loader.
 *
 * The inline comments help ensure future edits keep env var names aligned
 * with documentation and deployment templates.
 */
export const getPwaConfig = (env: NodeJS.ProcessEnv = process.env): PwaConfig => ({
  enabled: parseBoolean(env.PWA_ENABLED, true),
  offlineFallbackPath: env.PWA_OFFLINE_FALLBACK_PATH ?? '/offline',
  serviceWorkerPath: env.PWA_SERVICE_WORKER_PATH ?? '/sw.js',
  vapidPublicKey: env.NEXT_PUBLIC_VAPID_KEY,
  enableInstallPrompt: parseBoolean(env.PWA_ENABLE_INSTALL_PROMPT, true),
  updateStrategy: (env.PWA_UPDATE_STRATEGY as PwaUpdateStrategy | undefined) ?? 'prompt',
  enablePerformanceMonitoring: parseBoolean(env.PWA_ENABLE_PERFORMANCE_MONITORING, true),
  manifest: {
    name: env.NEXT_PUBLIC_PWA_NAME ?? 'Firm Web App',
    shortName: env.NEXT_PUBLIC_PWA_SHORT_NAME ?? 'Firm',
    themeColor: env.NEXT_PUBLIC_PWA_THEME_COLOR ?? '#111827',
    backgroundColor: env.NEXT_PUBLIC_PWA_BACKGROUND_COLOR ?? '#ffffff',
    startUrl: env.NEXT_PUBLIC_PWA_START_URL ?? '/',
    display: (env.NEXT_PUBLIC_PWA_DISPLAY as PwaManifestConfig['display'] | undefined) ?? 'standalone',
  },
})
