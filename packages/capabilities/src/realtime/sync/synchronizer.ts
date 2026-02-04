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
 * Real-time Synchronization System
 * 
 * Manages synchronization between clients and server, handles message queuing,
 * acknowledgments, and retries.
 */

import type {
  AnyOperation,
  SyncMessage,
  AckMessage,
  SyncState,
  SyncConfig,
  DocumentState,
  RealtimeErrorCode,
} from '../types';
import { RealtimeError } from '../types';
import { OTEngine } from '../ot/engine';

/**
 * Message queue item
 */
interface QueuedMessage {
  message: SyncMessage;
  retries: number;
  timestamp: number;
}

/**
 * Sync event handler type
 */
type SyncEventHandler = (
  event: 'connected' | 'disconnected' | 'syncing' | 'synced' | 'error',
  data?: unknown
) => void;

/**
 * Real-time synchronization system
 */
export class Synchronizer {
  private engine: OTEngine;
  private state: SyncState = 'disconnected';
  private messageQueue: Map<string, QueuedMessage> = new Map();
  private pendingAcks: Set<string> = new Set();
  private handlers: SyncEventHandler[] = [];
  private config: Required<SyncConfig>;
  private reconnectTimer?: NodeJS.Timeout;
  private reconnectAttempts = 0;

  constructor(
    initialContent: string = '',
    config: SyncConfig = {}
  ) {
    this.engine = new OTEngine(initialContent);

    this.config = {
      reconnectInterval: config.reconnectInterval || 5000,
      maxRetries: config.maxRetries || 3,
      batchSize: config.batchSize || 10,
      conflictStrategy: config.conflictStrategy || 'operational-transform',
    };
  }

  /**
   * Get current sync state
   */
  getState(): SyncState {
    return this.state;
  }

  /**
   * Get OT engine
   */
  getEngine(): OTEngine {
    return this.engine;
  }

  /**
   * Connect to synchronization
   */
  connect(): void {
    if (this.state === 'connected') return;

    this.state = 'connected';
    this.reconnectAttempts = 0;
    this.emitEvent('connected');
  }

  /**
   * Disconnect from synchronization
   */
  disconnect(): void {
    if (this.state === 'disconnected') return;

    this.state = 'disconnected';
    this.clearReconnectTimer();
    this.emitEvent('disconnected');
  }

  /**
   * Send a sync message
   */
  async send(
    operations: AnyOperation[],
    userId: string,
    clientId: string
  ): Promise<SyncMessage> {
    if (this.state !== 'connected') {
      throw new RealtimeError(
        RealtimeErrorCode.SYNC_ERROR,
        'Not connected to synchronization'
      );
    }

    const message: SyncMessage = {
      id: this.generateMessageId(),
      documentId: 'default', // Would be passed in real implementation
      version: this.engine.getVersion(),
      operations,
      timestamp: Date.now(),
      userId,
      clientId,
    };

    // Queue message
    this.queueMessage(message);

    // Mark as pending acknowledgment
    this.pendingAcks.add(message.id);

    this.state = 'syncing';
    this.emitEvent('syncing', message);

    return message;
  }

  /**
   * Receive a sync message from remote
   */
  receive(message: SyncMessage): void {
    if (this.state === 'disconnected') {
      throw new RealtimeError(
        RealtimeErrorCode.SYNC_ERROR,
        'Cannot receive while disconnected'
      );
    }

    try {
      // Apply operations using OT engine
      const result = this.engine.submitBatch(
        message.operations,
        message.clientId,
        message.version
      );

      if (!result.success) {
        throw new RealtimeError(
          RealtimeErrorCode.SYNC_ERROR,
          result.error || 'Failed to apply operations'
        );
      }

      // Send acknowledgment
      this.acknowledge(message.id, true);
    } catch (error) {
      this.acknowledge(message.id, false, error);
      this.emitEvent('error', error);
    }
  }

  /**
   * Acknowledge a message
   */
  acknowledge(
    messageId: string,
    success: boolean,
    error?: unknown
  ): void {
    const ack: AckMessage = {
      messageId,
      version: this.engine.getVersion(),
      success,
      error: error instanceof Error ? error.message : undefined,
    };

    // Remove from pending
    this.pendingAcks.delete(messageId);

    // Remove from queue if successful
    if (success) {
      this.messageQueue.delete(messageId);
    }

    // Update state
    if (this.pendingAcks.size === 0 && this.messageQueue.size === 0) {
      this.state = 'connected';
      this.emitEvent('synced');
    }
  }

  /**
   * Process acknowledgment received from remote
   */
  processAck(ack: AckMessage): void {
    const queued = this.messageQueue.get(ack.messageId);

    if (!queued) return;

    if (ack.success) {
      // Message successfully applied
      this.messageQueue.delete(ack.messageId);
      this.pendingAcks.delete(ack.messageId);
    } else {
      // Message failed, retry or drop
      this.retryMessage(ack.messageId);
    }

    // Update state if all synced
    if (this.pendingAcks.size === 0 && this.messageQueue.size === 0) {
      this.state = 'connected';
      this.emitEvent('synced');
    }
  }

  /**
   * Queue a message for sending
   */
  private queueMessage(message: SyncMessage): void {
    this.messageQueue.set(message.id, {
      message,
      retries: 0,
      timestamp: Date.now(),
    });
  }

  /**
   * Retry a failed message
   */
  private retryMessage(messageId: string): void {
    const queued = this.messageQueue.get(messageId);

    if (!queued) return;

    if (queued.retries >= this.config.maxRetries) {
      // Max retries exceeded, drop message
      this.messageQueue.delete(messageId);
      this.pendingAcks.delete(messageId);
      this.emitEvent('error', new RealtimeError(
        RealtimeErrorCode.SYNC_ERROR,
        `Message ${messageId} failed after ${this.config.maxRetries} retries`
      ));
      return;
    }

    // Increment retry count
    queued.retries++;
    this.messageQueue.set(messageId, queued);

    // Would trigger re-send in real implementation
  }

  /**
   * Get pending messages
   */
  getPendingMessages(): SyncMessage[] {
    return Array.from(this.messageQueue.values())
      .map(q => q.message);
  }

  /**
   * Get pending message count
   */
  getPendingCount(): number {
    return this.messageQueue.size;
  }

  /**
   * Clear all pending messages
   */
  clearPending(): void {
    this.messageQueue.clear();
    this.pendingAcks.clear();

    if (this.state === 'syncing') {
      this.state = 'connected';
      this.emitEvent('synced');
    }
  }

  /**
   * Batch operations for efficient synchronization
   */
  batchOperations(operations: AnyOperation[]): AnyOperation[][] {
    const batches: AnyOperation[][] = [];
    const batchSize = this.config.batchSize;

    for (let i = 0; i < operations.length; i += batchSize) {
      batches.push(operations.slice(i, i + batchSize));
    }

    return batches;
  }

  /**
   * Handle connection loss and attempt reconnection
   */
  handleConnectionLoss(): void {
    if (this.state === 'disconnected') return;

    this.state = 'disconnected';
    this.emitEvent('disconnected');

    // Start reconnection attempts
    this.attemptReconnect();
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxRetries) {
      this.emitEvent('error', new RealtimeError(
        RealtimeErrorCode.NETWORK_ERROR,
        'Max reconnection attempts exceeded'
      ));
      return;
    }

    this.reconnectAttempts++;

    this.reconnectTimer = setTimeout(() => {
      // Would attempt actual reconnection in real implementation
      // For now, just emit event
      this.emitEvent('connected');
    }, this.config.reconnectInterval * this.reconnectAttempts);
  }

  /**
   * Clear reconnection timer
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
    this.reconnectAttempts = 0;
  }

  /**
   * Subscribe to sync events
   */
  subscribe(handler: SyncEventHandler): () => void {
    this.handlers.push(handler);

    return () => {
      const index = this.handlers.indexOf(handler);
      if (index > -1) {
        this.handlers.splice(index, 1);
      }
    };
  }

  /**
   * Emit a sync event
   */
  private emitEvent(
    event: 'connected' | 'disconnected' | 'syncing' | 'synced' | 'error',
    data?: unknown
  ): void {
    for (const handler of this.handlers) {
      try {
        handler(event, data);
      } catch (error) {
        console.error('Error in sync handler:', error);
      }
    }
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current document state
   */
  getDocumentState(): DocumentState {
    return this.engine.getState();
  }

  /**
   * Get synchronization statistics
   */
  getStats(): {
    state: SyncState;
    pendingMessages: number;
    pendingAcks: number;
    reconnectAttempts: number;
    engineStats: ReturnType<OTEngine['getStats']>;
  } {
    return {
      state: this.state,
      pendingMessages: this.messageQueue.size,
      pendingAcks: this.pendingAcks.size,
      reconnectAttempts: this.reconnectAttempts,
      engineStats: this.engine.getStats(),
    };
  }

  /**
   * Destroy the synchronizer
   */
  destroy(): void {
    this.disconnect();
    this.clearReconnectTimer();
    this.messageQueue.clear();
    this.pendingAcks.clear();
    this.handlers = [];
    this.engine.destroy();
  }
}
