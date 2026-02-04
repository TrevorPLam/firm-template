/**
 * Operational Transformation Engine
 * 
 * Coordinates OT operations, manages document state, and handles transformation
 * of concurrent operations. Implements the Jupiter algorithm's control structure.
 * 
 * The engine maintains:
 * - Current document state and version
 * - Pending operations queue
 * - Operation history for transformation
 * - Client state tracking
 */

import type {
  AnyOperation,
  DocumentState,
  OperationResult,
  OTEngineConfig,
  RealtimeErrorCode,
} from '../types';
import { RealtimeError } from '../types';
import { apply, validate, compose } from './operations';
import { transform, transformAgainstSequence } from './transform';

/**
 * Client state in the OT system
 */
interface ClientState {
  clientId: string;
  version: number;
  pendingOps: AnyOperation[];
  lastSeen: number;
}

/**
 * OT Engine for coordinating transformations
 */
export class OTEngine {
  private state: DocumentState;
  private history: AnyOperation[] = [];
  private clients: Map<string, ClientState> = new Map();
  private pendingOps: AnyOperation[] = [];
  private config: Required<OTEngineConfig>;
  private checkTimer?: NodeJS.Timeout;

  constructor(
    initialContent: string = '',
    config: OTEngineConfig = {}
  ) {
    this.state = {
      content: initialContent,
      version: 0,
    };

    this.config = {
      checkInterval: config.checkInterval || 5000,
      maxPendingOps: config.maxPendingOps || 100,
      transformTimeout: config.transformTimeout || 30000,
    };

    this.startPeriodicCheck();
  }

  /**
   * Get current document state
   */
  getState(): DocumentState {
    return { ...this.state };
  }

  /**
   * Get current document version
   */
  getVersion(): number {
    return this.state.version;
  }

  /**
   * Get document content
   */
  getContent(): string {
    return this.state.content;
  }

  /**
   * Register a client
   */
  registerClient(clientId: string): void {
    if (!this.clients.has(clientId)) {
      this.clients.set(clientId, {
        clientId,
        version: this.state.version,
        pendingOps: [],
        lastSeen: Date.now(),
      });
    }
  }

  /**
   * Unregister a client
   */
  unregisterClient(clientId: string): void {
    this.clients.delete(clientId);
  }

  /**
   * Submit an operation from a client
   * Returns the transformed operation that was applied
   */
  submit(
    operation: AnyOperation,
    clientId: string,
    baseVersion: number
  ): { operation: AnyOperation; version: number; success: boolean; error?: string } {
    try {
      // Validate operation
      if (!validate(operation)) {
        throw new RealtimeError(
          RealtimeErrorCode.VALIDATION_ERROR,
          'Invalid operation'
        );
      }

      // Register client if needed
      this.registerClient(clientId);

      // Get client state
      const clientState = this.clients.get(clientId);
      if (!clientState) {
        throw new RealtimeError(
          RealtimeErrorCode.VALIDATION_ERROR,
          'Client not registered'
        );
      }

      // Check if we need to transform against missed operations
      let transformed = operation;
      if (baseVersion < this.state.version) {
        const missedOps = this.history.slice(
          baseVersion,
          this.state.version
        );
        transformed = transformAgainstSequence(operation, missedOps);
      }

      // Apply the transformed operation
      const result = apply(transformed, this.state);

      if (!result.success || !result.newState) {
        return {
          operation: transformed,
          version: this.state.version,
          success: false,
          error: result.error,
        };
      }

      // Update state
      this.state = result.newState;
      this.history.push(transformed);

      // Update client state
      clientState.version = this.state.version;
      clientState.lastSeen = Date.now();

      // Trim history if too long
      if (this.history.length > 1000) {
        this.history = this.history.slice(-500);
      }

      return {
        operation: transformed,
        version: this.state.version,
        success: true,
      };
    } catch (error) {
      return {
        operation,
        version: this.state.version,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Submit multiple operations as a batch
   */
  submitBatch(
    operations: AnyOperation[],
    clientId: string,
    baseVersion: number
  ): { operations: AnyOperation[]; version: number; success: boolean; error?: string } {
    const transformedOps: AnyOperation[] = [];
    let currentVersion = baseVersion;

    try {
      for (const op of operations) {
        const result = this.submit(op, clientId, currentVersion);

        if (!result.success) {
          throw new RealtimeError(
            RealtimeErrorCode.TRANSFORM_ERROR,
            result.error || 'Operation failed'
          );
        }

        transformedOps.push(result.operation);
        currentVersion = result.version;
      }

      return {
        operations: transformedOps,
        version: this.state.version,
        success: true,
      };
    } catch (error) {
      return {
        operations: transformedOps,
        version: this.state.version,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get operations since a specific version
   * Used for clients catching up
   */
  getOperationsSince(version: number): AnyOperation[] {
    if (version >= this.state.version) {
      return [];
    }

    const startIndex = Math.max(0, version);
    return this.history.slice(startIndex, this.state.version);
  }

  /**
   * Transform a pending operation against server operations
   * Used when a client receives server operations while having pending local ops
   */
  transformPending(
    pendingOp: AnyOperation,
    serverOps: AnyOperation[]
  ): AnyOperation {
    return transformAgainstSequence(pendingOp, serverOps);
  }

  /**
   * Add a pending operation
   */
  addPending(operation: AnyOperation): void {
    if (this.pendingOps.length >= this.config.maxPendingOps) {
      throw new RealtimeError(
        RealtimeErrorCode.VALIDATION_ERROR,
        'Too many pending operations'
      );
    }

    this.pendingOps.push(operation);
  }

  /**
   * Get pending operations
   */
  getPending(): AnyOperation[] {
    return [...this.pendingOps];
  }

  /**
   * Clear pending operations
   */
  clearPending(): void {
    this.pendingOps = [];
  }

  /**
   * Optimize operation history by composing consecutive operations
   */
  optimizeHistory(): void {
    if (this.history.length < 2) return;

    const optimized: AnyOperation[] = [];
    let current = this.history[0];

    for (let i = 1; i < this.history.length; i++) {
      const next = this.history[i];
      const composed = compose(current, next);

      if (composed) {
        current = composed;
      } else {
        optimized.push(current);
        current = next;
      }
    }

    optimized.push(current);
    this.history = optimized;
  }

  /**
   * Reset document to a specific state
   */
  reset(content: string = '', version: number = 0): void {
    this.state = {
      content,
      version,
    };
    this.history = [];
    this.pendingOps = [];
    this.clients.clear();
  }

  /**
   * Get client state
   */
  getClientState(clientId: string): ClientState | undefined {
    return this.clients.get(clientId);
  }

  /**
   * Get all connected clients
   */
  getClients(): ClientState[] {
    return Array.from(this.clients.values());
  }

  /**
   * Check for stale clients and clean up
   */
  private checkStaleClients(): void {
    const now = Date.now();
    const staleTimeout = 300000; // 5 minutes

    for (const [clientId, state] of this.clients.entries()) {
      if (now - state.lastSeen > staleTimeout) {
        this.clients.delete(clientId);
      }
    }
  }

  /**
   * Start periodic maintenance tasks
   */
  private startPeriodicCheck(): void {
    this.checkTimer = setInterval(() => {
      this.checkStaleClients();
      this.optimizeHistory();
    }, this.config.checkInterval);
  }

  /**
   * Stop the engine and clean up
   */
  destroy(): void {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = undefined;
    }
    this.clients.clear();
    this.history = [];
    this.pendingOps = [];
  }

  /**
   * Create a checkpoint of current state
   */
  checkpoint(): {
    state: DocumentState;
    version: number;
    timestamp: number;
  } {
    return {
      state: { ...this.state },
      version: this.state.version,
      timestamp: Date.now(),
    };
  }

  /**
   * Restore from a checkpoint
   */
  restore(checkpoint: {
    state: DocumentState;
    version: number;
  }): void {
    this.state = { ...checkpoint.state };
    // Clear history after restore
    this.history = [];
    this.pendingOps = [];
  }

  /**
   * Get statistics about the engine
   */
  getStats(): {
    version: number;
    contentLength: number;
    historyLength: number;
    pendingOps: number;
    clients: number;
  } {
    return {
      version: this.state.version,
      contentLength: this.state.content.length,
      historyLength: this.history.length,
      pendingOps: this.pendingOps.length,
      clients: this.clients.size,
    };
  }
}
