// AI-META-BEGIN
// 
// AI-META: Package entry point and public API exports
// OWNERSHIP: packages/capabilities
// ENTRYPOINTS: Package entry point, imported by consumers
// DEPENDENCIES: Standard library only
// DANGER: Secret/API key handling - never log or expose; Environment variable access - validate all values
// CHANGE-SAFETY: Config values: safe to modify. Schema/structure: coordinate with team
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

export type AiProvider = 'openai' | 'anthropic' | 'azure-openai' | 'none'

export interface AiContentPolicy {
  /** Enable automated content generation for drafts and snippets. */
  enableGeneration: boolean
  /** Enable personalization based on user traits and segmentation. */
  enablePersonalization: boolean
  /** Enable AI-assisted optimization (tone, readability, SEO). */
  enableOptimization: boolean
}

export interface AiConfig {
  /** Provider name (controls which integration adapter is selected). */
  provider: AiProvider
  /** Server-only API key for the selected provider. */
  apiKey?: string
  /** Default model identifier (ex: gpt-4o-mini, claude-3-5). */
  model: string
  /** Upper token limit for generation requests. */
  maxTokens: number
  /** Temperature for creative variance (0 = deterministic). */
  temperature: number
  /** Feature flags for AI content workflows. */
  policy: AiContentPolicy
  /** Optional URL for a UI-based content management workflow. */
  managementConsoleUrl?: string
}

export interface AiConfigIssue {
  field: keyof AiConfig | 'policy'
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
 * Build AI configuration from environment variables.
 *
 * Inline commentary is intentional: future edits should preserve the mapping
 * so config remains centralized and auditable.
 */
export const getAiConfig = (env: NodeJS.ProcessEnv = process.env): AiConfig => ({
  provider: (env.AI_PROVIDER as AiProvider | undefined) ?? 'none',
  apiKey: env.AI_API_KEY,
  model: env.AI_MODEL ?? 'gpt-4o-mini',
  maxTokens: parseNumber(env.AI_MAX_TOKENS, 800),
  temperature: parseNumber(env.AI_TEMPERATURE, 0.4),
  policy: {
    enableGeneration: parseBoolean(env.AI_ENABLE_GENERATION, true),
    enablePersonalization: parseBoolean(env.AI_ENABLE_PERSONALIZATION, false),
    enableOptimization: parseBoolean(env.AI_ENABLE_OPTIMIZATION, true),
  },
  managementConsoleUrl: env.AI_MANAGEMENT_CONSOLE_URL,
})

/**
 * Validate the AI configuration for required fields when a provider is active.
 */
export const validateAiConfig = (config: AiConfig): AiConfigIssue[] => {
  const issues: AiConfigIssue[] = []

  if (config.provider !== 'none' && !config.apiKey) {
    issues.push({
      field: 'apiKey',
      message: 'AI_API_KEY is required when AI_PROVIDER is set',
    })
  }

  if (config.maxTokens <= 0) {
    issues.push({
      field: 'maxTokens',
      message: 'AI_MAX_TOKENS must be greater than zero',
    })
  }

  return issues
}
