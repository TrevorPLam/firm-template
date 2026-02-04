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
 * Real-time Collaboration and Live Editing Platform
 * 
 * Advanced operational transformation infrastructure for real-time collaboration
 * 
 * @packageDocumentation
 */

// Configuration
export {
  getRealtimeConfig,
  validateRealtimeConfig,
  type RealtimeConfig as RealtimeConfigLegacy,
  type RealtimeConfigIssue,
  type RealtimeProvider,
} from './config';

// Type definitions
export * from './types';

// Operational Transformation
export {
  insert,
  delete_ as delete,
  retain,
  format,
  set,
  unset,
  apply,
  invert,
  compose,
  validate,
  equals,
  length,
} from './ot/operations';

export {
  transform,
  transformAgainstSequence,
  transformSequence,
  composeTransform,
  verifyConvergence,
  identity,
  isNoop,
} from './ot/transform';

export { OTEngine } from './ot/engine';

// Presence tracking
export {
  PresenceTracker,
  generateUserColor,
  createPresence,
} from './presence/tracker';

export {
  generateCursorIndicators,
  generateSelectionIndicators,
  generateAvatarIndicators,
  getInitials,
  cursorToStyles,
  selectionToStyles,
  getPresenceClasses,
  createCursorElement,
  createSelectionElement,
  createAvatarElement,
  hexToRgba,
  getStatusColor,
  formatLastActive,
  getPresenceTooltip,
  sortByActivity,
  groupByStatus,
} from './presence/indicators';

export type {
  CursorIndicator,
  SelectionIndicator,
  AvatarIndicator,
} from './presence/indicators';

// Synchronization
export { Synchronizer } from './sync/synchronizer';

export {
  ConflictResolver,
  ThreeWayMerge,
} from './sync/conflict-resolver';

// Workflows
export {
  ApprovalWorkflow,
  createSimpleWorkflow,
  createMultiStageWorkflow,
} from './workflows/approval';

// Notifications
export { NotificationSystem } from './notifications/system';

// Re-export commonly used types
export type {
  AnyOperation,
  InsertOperation,
  DeleteOperation,
  RetainOperation,
  FormatOperation,
  SetOperation,
  UnsetOperation,
  DocumentState,
  UserPresence,
  CursorPosition,
  SelectionRange,
  SyncMessage,
  Notification,
  ApprovalRequest,
  CollaborativeWorkflow,
} from './types';
