/**
 * Type definitions for blockchain integration system
 */

/**
 * Blockchain configuration options
 */
export interface BlockchainConfig {
  /** Network to connect to (ethereum, polygon, etc) */
  network: string
  /** RPC endpoint URL */
  rpcEndpoint: string
  /** Contract addresses */
  contracts?: Record<string, string>
  /** Gas price strategy */
  gasPriceStrategy?: 'fast' | 'medium' | 'slow'
  /** Enable transaction confirmation waiting */
  waitForConfirmation?: boolean
  /** Number of confirmations to wait */
  confirmations?: number
}

/**
 * Content provenance record
 */
export interface ProvenanceRecord {
  /** Unique content identifier */
  contentId: string
  /** Content hash (SHA-256) */
  contentHash: string
  /** Creator address */
  creator: string
  /** Creation timestamp */
  timestamp: Date
  /** Blockchain transaction hash */
  txHash: string
  /** Metadata URI (IPFS, etc) */
  metadataUri?: string
  /** Chain of custody records */
  custody: CustodyRecord[]
}

/**
 * Chain of custody record
 */
export interface CustodyRecord {
  /** Previous owner address */
  from: string
  /** New owner address */
  to: string
  /** Transfer timestamp */
  timestamp: Date
  /** Transfer reason/type */
  type: 'transfer' | 'license' | 'derivative'
  /** Transaction hash */
  txHash: string
}

/**
 * Digital rights configuration
 */
export interface DigitalRights {
  /** Rights holder address */
  holder: string
  /** Content identifier */
  contentId: string
  /** Rights type */
  type: 'exclusive' | 'non-exclusive' | 'creative-commons'
  /** Usage permissions */
  permissions: RightsPermission[]
  /** Expiration date */
  expiresAt?: Date
  /** Territory restrictions */
  territories?: string[]
  /** Royalty configuration */
  royalties?: RoyaltyConfig
}

/**
 * Rights permission definition
 */
export interface RightsPermission {
  /** Permission type */
  type: 'reproduce' | 'distribute' | 'display' | 'perform' | 'modify'
  /** Is permission granted */
  granted: boolean
  /** Permission conditions */
  conditions?: string[]
}

/**
 * Royalty configuration
 */
export interface RoyaltyConfig {
  /** Royalty percentage (0-100) */
  percentage: number
  /** Recipient address */
  recipient: string
  /** Minimum payout amount */
  minimumPayout?: number
  /** Payment token/currency */
  currency?: string
}

/**
 * Digital watermark data
 */
export interface DigitalWatermark {
  /** Content identifier */
  contentId: string
  /** Watermark type */
  type: 'visible' | 'invisible' | 'forensic'
  /** Watermark data/payload */
  payload: string
  /** Embedding algorithm */
  algorithm: 'lsb' | 'dct' | 'dwt'
  /** Robustness level */
  robustness: 'low' | 'medium' | 'high'
  /** Creation timestamp */
  timestamp: Date
}

/**
 * Watermark verification result
 */
export interface WatermarkVerification {
  /** Is watermark present */
  present: boolean
  /** Extracted watermark data */
  payload?: string
  /** Confidence score (0-1) */
  confidence: number
  /** Watermark integrity */
  intact: boolean
  /** Tampering detected */
  tampered: boolean
}

/**
 * Audit trail entry
 */
export interface AuditEntry {
  /** Entry identifier */
  id: string
  /** Event type */
  eventType: string
  /** Actor/user identifier */
  actor: string
  /** Resource affected */
  resource: string
  /** Action performed */
  action: string
  /** Event timestamp */
  timestamp: Date
  /** Event metadata */
  metadata: Record<string, unknown>
  /** Blockchain transaction hash */
  txHash: string
  /** Block number */
  blockNumber: number
}

/**
 * Audit query options
 */
export interface AuditQuery {
  /** Filter by actor */
  actor?: string
  /** Filter by resource */
  resource?: string
  /** Filter by event type */
  eventType?: string
  /** Start date */
  startDate?: Date
  /** End date */
  endDate?: Date
  /** Maximum results */
  limit?: number
  /** Skip results (pagination) */
  offset?: number
}

/**
 * Smart contract license terms
 */
export interface LicenseTerms {
  /** License identifier */
  id: string
  /** Licensor address */
  licensor: string
  /** Licensee address */
  licensee: string
  /** Licensed content */
  contentId: string
  /** License type */
  type: 'standard' | 'premium' | 'enterprise'
  /** License duration */
  duration: number
  /** Price (in wei or token units) */
  price: string
  /** Usage limits */
  usageLimits?: UsageLimits
  /** Auto-renewal */
  autoRenew: boolean
  /** Contract status */
  status: 'active' | 'expired' | 'revoked' | 'pending'
}

/**
 * Usage limits for licenses
 */
export interface UsageLimits {
  /** Maximum views */
  maxViews?: number
  /** Maximum downloads */
  maxDownloads?: number
  /** Maximum derivatives */
  maxDerivatives?: number
  /** Geographic restrictions */
  geoRestrictions?: string[]
}

/**
 * Blockchain transaction result
 */
export interface TransactionResult {
  /** Transaction hash */
  hash: string
  /** Block number */
  blockNumber?: number
  /** Gas used */
  gasUsed?: string
  /** Transaction status */
  status: 'pending' | 'confirmed' | 'failed'
  /** Error message if failed */
  error?: string
  /** Timestamp */
  timestamp: Date
}

/**
 * License contract event
 */
export interface LicenseEvent {
  /** Event type */
  type: 'created' | 'activated' | 'renewed' | 'revoked' | 'expired'
  /** License identifier */
  licenseId: string
  /** Event timestamp */
  timestamp: Date
  /** Transaction hash */
  txHash: string
  /** Event data */
  data: Record<string, unknown>
}
