export type CmsProvider = 'contentful' | 'sanity' | 'strapi' | 'none'

export interface CmsConfig {
  /** CMS provider (determines integration adapter). */
  provider: CmsProvider
  /** Project or space identifier for the CMS. */
  projectId?: string
  /** Dataset or environment name (ex: production, staging). */
  dataset?: string
  /** API token for server-side access. */
  apiToken?: string
  /** Secret used for preview or draft sessions. */
  previewSecret?: string
  /** Shared secret for webhook validation. */
  webhookSecret?: string
  /** Base URL for CMS API (self-hosted or regional endpoints). */
  apiBaseUrl?: string
}

export interface CmsConfigIssue {
  field: keyof CmsConfig
  message: string
}

/**
 * Build CMS configuration from environment variables.
 *
 * Inline comments keep mapping between env vars and config explicit.
 */
export const getCmsConfig = (env: NodeJS.ProcessEnv = process.env): CmsConfig => ({
  provider: (env.CMS_PROVIDER as CmsProvider | undefined) ?? 'none',
  projectId: env.CMS_PROJECT_ID,
  dataset: env.CMS_DATASET,
  apiToken: env.CMS_API_TOKEN,
  previewSecret: env.CMS_PREVIEW_SECRET,
  webhookSecret: env.CMS_WEBHOOK_SECRET,
  apiBaseUrl: env.CMS_API_BASE_URL,
})

/**
 * Validate required CMS configuration when a provider is active.
 */
export const validateCmsConfig = (config: CmsConfig): CmsConfigIssue[] => {
  const issues: CmsConfigIssue[] = []

  if (config.provider !== 'none' && !config.apiToken) {
    issues.push({
      field: 'apiToken',
      message: 'CMS_API_TOKEN is required when CMS_PROVIDER is set',
    })
  }

  if (config.provider !== 'none' && !config.projectId) {
    issues.push({
      field: 'projectId',
      message: 'CMS_PROJECT_ID is required when CMS_PROVIDER is set',
    })
  }

  return issues
}
