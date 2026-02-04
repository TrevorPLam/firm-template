// AI-META-BEGIN
// 
// AI-META: Shared package module
// OWNERSHIP: packages/capabilities
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

/**
 * TypeScript type definitions for real-time collaboration features
 * Covers OT operations, presence, synchronization, and notifications
 */

// ============================================================================
// Operational Transformation Types
// ============================================================================

/**
 * Operation type for OT transformations
 */
export type OperationType = 
  | 'insert' 
  | 'delete' 
  | 'retain' 
  | 'format'
  | 'set'
  | 'unset';

/**
 * Base operation interface
 */
export interface Operation {
  type: OperationType;
  timestamp?: number;
  userId?: string;
  clientId?: string;
}

/**
 * Text insert operation
 */
export interface InsertOperation extends Operation {
  type: 'insert';
  position: number;
  content: string;
  attributes?: Record<string, unknown>;
}

/**
 * Text delete operation
 */
export interface DeleteOperation extends Operation {
  type: 'delete';
  position: number;
  length: number;
}

/**
 * Retain operation (keep content unchanged)
 */
export interface RetainOperation extends Operation {
  type: 'retain';
  length: number;
  attributes?: Record<string, unknown>;
}

/**
 * Format operation (apply formatting to range)
 */
export interface FormatOperation extends Operation {
  type: 'format';
  position: number;
  length: number;
  attributes: Record<string, unknown>;
}

/**
 * Set operation (for structured data)
 */
export interface SetOperation extends Operation {
  type: 'set';
  path: string[];
  value: unknown;
}

/**
 * Unset operation (for structured data)
 */
export interface UnsetOperation extends Operation {
  type: 'unset';
  path: string[];
}

/**
 * Union type of all operations
 */
export type AnyOperation = 
  | InsertOperation 
  | DeleteOperation 
  | RetainOperation 
  | FormatOperation
  | SetOperation
  | UnsetOperation;

/**
 * Document state representation
 */
export interface DocumentState {
  content: string;
  version: number;
  checksum?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Operation result
 */
export interface OperationResult {
  success: boolean;
  newState?: DocumentState;
  error?: string;
}

// ============================================================================
// Presence Types
// ============================================================================

/**
 * User cursor position
 */
export interface CursorPosition {
  line: number;
  column: number;
  offset?: number;
}

/**
 * Selection range
 */
export interface SelectionRange {
  anchor: CursorPosition;
  focus: CursorPosition;
}

/**
 * User presence information
 */
export interface UserPresence {
  userId: string;
  name: string;
  email?: string;
  avatar?: string;
  color: string;
  cursor?: CursorPosition;
  selection?: SelectionRange;
  lastActive: number;
  status: 'active' | 'idle' | 'away';
  metadata?: Record<string, unknown>;
}

/**
 * Presence update event
 */
export interface PresenceUpdate {
  type: 'join' | 'leave' | 'update';
  presence: UserPresence;
  timestamp: number;
}

// ============================================================================
// Synchronization Types
// ============================================================================

/**
 * Sync state
 */
export type SyncState = 
  | 'connected' 
  | 'disconnected' 
  | 'syncing' 
  | 'error';

/**
 * Synchronization message
 */
export interface SyncMessage {
  id: string;
  documentId: string;
  version: number;
  operations: AnyOperation[];
  timestamp: number;
  userId: string;
  clientId: string;
}

/**
 * Acknowledgment message
 */
export interface AckMessage {
  messageId: string;
  version: number;
  success: boolean;
  error?: string;
}

/**
 * Conflict information
 */
export interface Conflict {
  id: string;
  operations: AnyOperation[];
  conflictingWith: AnyOperation[];
  timestamp: number;
  resolved: boolean;
  resolution?: AnyOperation[];
}

/**
 * Conflict resolution strategy
 */
export type ConflictStrategy = 
  | 'last-write-wins' 
  | 'operational-transform'
  | 'manual'
  | 'merge';

// ============================================================================
// Workflow Types
// ============================================================================

/**
 * Approval status
 */
export type ApprovalStatus = 
  | 'draft' 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'revision';

/**
 * Approval request
 */
export interface ApprovalRequest {
  id: string;
  documentId: string;
  requesterId: string;
  approvers: string[];
  status: ApprovalStatus;
  message?: string;
  createdAt: number;
  updatedAt: number;
  deadline?: number;
}

/**
 * Approval action
 */
export interface ApprovalAction {
  requestId: string;
  userId: string;
  action: 'approve' | 'reject' | 'request-revision';
  comment?: string;
  timestamp: number;
}

/**
 * Workflow stage
 */
export interface WorkflowStage {
  id: string;
  name: string;
  order: number;
  approvers: string[];
  requiredApprovals: number;
  status: ApprovalStatus;
}

/**
 * Collaborative workflow
 */
export interface CollaborativeWorkflow {
  id: string;
  name: string;
  documentId: string;
  stages: WorkflowStage[];
  currentStage: number;
  status: ApprovalStatus;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// Notification Types
// ============================================================================

/**
 * Notification type
 */
export type NotificationType = 
  | 'mention'
  | 'comment'
  | 'approval-request'
  | 'approval-granted'
  | 'approval-denied'
  | 'edit'
  | 'system';

/**
 * Notification priority
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Notification
 */
export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  userId: string;
  documentId?: string;
  senderId?: string;
  read: boolean;
  createdAt: number;
  expiresAt?: number;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Notification subscription
 */
export interface NotificationSubscription {
  userId: string;
  documentId?: string;
  types: NotificationType[];
  enabled: boolean;
}

// ============================================================================
// Event Types
// ============================================================================

/**
 * Real-time event types
 */
export type RealtimeEventType =
  | 'operation'
  | 'presence'
  | 'sync'
  | 'notification'
  | 'error';

/**
 * Real-time event
 */
export interface RealtimeEvent<T = unknown> {
  type: RealtimeEventType;
  payload: T;
  timestamp: number;
  source?: string;
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * OT engine configuration
 */
export interface OTEngineConfig {
  checkInterval?: number;
  maxPendingOps?: number;
  transformTimeout?: number;
}

/**
 * Presence configuration
 */
export interface PresenceConfig {
  updateInterval?: number;
  idleTimeout?: number;
  awayTimeout?: number;
}

/**
 * Sync configuration
 */
export interface SyncConfig {
  reconnectInterval?: number;
  maxRetries?: number;
  batchSize?: number;
  conflictStrategy?: ConflictStrategy;
}

/**
 * Real-time configuration
 */
export interface RealtimeConfig {
  ot?: OTEngineConfig;
  presence?: PresenceConfig;
  sync?: SyncConfig;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Real-time error codes
 */
export enum RealtimeErrorCode {
  TRANSFORM_ERROR = 'TRANSFORM_ERROR',
  SYNC_ERROR = 'SYNC_ERROR',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
}

/**
 * Real-time error
 */
export class RealtimeError extends Error {
  constructor(
    public code: RealtimeErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'RealtimeError';
  }
}
