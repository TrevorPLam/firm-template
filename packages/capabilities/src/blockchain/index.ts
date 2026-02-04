/**
 * @module Blockchain
 * Blockchain integration capabilities for content provenance, rights management,
 * digital watermarking, audit trails, and smart contract licensing.
 */

export { ProvenanceTracker } from './provenance/tracker'
export { RightsManager } from './rights/manager'
export { DigitalWatermarkManager } from './watermark/digital'
export { AuditTrailManager } from './audit/trail'
export { LicensingContractManager } from './contracts/licensing'

export type {
  BlockchainConfig,
  ProvenanceRecord,
  CustodyRecord,
  DigitalRights,
  RightsPermission,
  RoyaltyConfig,
  DigitalWatermark,
  WatermarkVerification,
  AuditEntry,
  AuditQuery,
  LicenseTerms,
  UsageLimits,
  LicenseEvent,
  TransactionResult,
} from './types'
