// AI-META-BEGIN
// 
// AI-META: Package entry point and public API exports
// OWNERSHIP: packages/capabilities
// ENTRYPOINTS: Package entry point, imported by consumers
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

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
