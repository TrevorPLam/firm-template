// AI-META-BEGIN
// 
// AI-META: Package entry point and public API exports
// OWNERSHIP: packages/capabilities
// ENTRYPOINTS: Package entry point, imported by consumers
// DEPENDENCIES: Standard library only
// DANGER: Authentication logic; Secret/API key handling - never log or expose; Environment variable access - validate all values
// CHANGE-SAFETY: Config values: safe to modify. Schema/structure: coordinate with team
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

export type RealtimeProvider = 'socket-io' | 'pusher' | 'ably' | 'none'

export interface RealtimeConfig {
  /** Provider that powers real-time features. */
  provider: RealtimeProvider
  /** Base URL for the websocket server. */
  serverUrl?: string
  /** Allowed origin for socket connections. */
  appOrigin?: string
  /** Shared secret or API key for server authentication. */
  apiKey?: string
  /** Enable presence tracking for collaboration. */
  enablePresence: boolean
  /** Timeout (ms) for connection attempts. */
  connectionTimeoutMs: number
  /** Message retention window (minutes) for replay. */
  messageRetentionMinutes: number
}

export interface RealtimeConfigIssue {
  field: keyof RealtimeConfig
  message: string
}

const parseBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) {
    return fallback
  }

  return value.toLowerCase() === 'true'
}

const parseNumber = (value: string | undefined, fallback: number) => {
  if (!value) {
    return fallback
  }

  const parsed = Number(value)
  return Number.isNaN(parsed) ? fallback : parsed
}

/**
 * Real-time configuration loader with explicit env mapping.
 */
export const getRealtimeConfig = (env: NodeJS.ProcessEnv = process.env): RealtimeConfig => ({
  provider: (env.REALTIME_PROVIDER as RealtimeProvider | undefined) ?? 'none',
  serverUrl: env.REALTIME_SERVER_URL,
  appOrigin: env.REALTIME_APP_ORIGIN,
  apiKey: env.REALTIME_API_KEY,
  enablePresence: parseBoolean(env.REALTIME_ENABLE_PRESENCE, true),
  connectionTimeoutMs: parseNumber(env.REALTIME_CONNECTION_TIMEOUT_MS, 10_000),
  messageRetentionMinutes: parseNumber(env.REALTIME_MESSAGE_RETENTION_MINUTES, 15),
})

/**
 * Validate required realtime configuration when a provider is active.
 */
export const validateRealtimeConfig = (config: RealtimeConfig): RealtimeConfigIssue[] => {
  const issues: RealtimeConfigIssue[] = []

  if (config.provider !== 'none' && !config.serverUrl) {
    issues.push({
      field: 'serverUrl',
      message: 'REALTIME_SERVER_URL is required when REALTIME_PROVIDER is set',
    })
  }

  if (config.connectionTimeoutMs <= 0) {
    issues.push({
      field: 'connectionTimeoutMs',
      message: 'REALTIME_CONNECTION_TIMEOUT_MS must be greater than zero',
    })
  }

  return issues
}
