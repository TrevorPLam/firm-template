/**
 * Conflict Resolution and Merging Logic
 * 
 * Implements strategies for resolving conflicts in collaborative editing
 */

import type {
  AnyOperation,
  Conflict,
  ConflictStrategy,
  DocumentState,
  RealtimeErrorCode,
} from '../types';
import { RealtimeError } from '../types';
import { transform, transformAgainstSequence } from '../ot/transform';
import { apply } from '../ot/operations';

/**
 * Conflict resolver for handling operation conflicts
 */
export class ConflictResolver {
  private conflicts: Map<string, Conflict> = new Map();
  private strategy: ConflictStrategy;

  constructor(strategy: ConflictStrategy = 'operational-transform') {
    this.strategy = strategy;
  }

  /**
   * Detect conflicts between operations
   */
  detectConflict(
    op1: AnyOperation,
    op2: AnyOperation
  ): boolean {
    // Insert vs Insert at same position
    if (op1.type === 'insert' && op2.type === 'insert') {
      return op1.position === op2.position;
    }

    // Delete overlaps
    if (op1.type === 'delete' && op2.type === 'delete') {
      const op1End = op1.position + op1.length;
      const op2End = op2.position + op2.length;

      return !(op1End <= op2.position || op2End <= op1.position);
    }

    // Insert within delete range
    if (op1.type === 'insert' && op2.type === 'delete') {
      const deleteEnd = op2.position + op2.length;
      return op1.position >= op2.position && op1.position < deleteEnd;
    }

    if (op1.type === 'delete' && op2.type === 'insert') {
      const deleteEnd = op1.position + op1.length;
      return op2.position >= op1.position && op2.position < deleteEnd;
    }

    // Format overlaps
    if (op1.type === 'format' && op2.type === 'format') {
      const op1End = op1.position + op1.length;
      const op2End = op2.position + op2.length;

      return !(op1End <= op2.position || op2End <= op1.position);
    }

    return false;
  }

  /**
   * Resolve a conflict between operations
   */
  resolve(
    operations: AnyOperation[],
    conflictingWith: AnyOperation[],
    state: DocumentState
  ): AnyOperation[] {
    const conflictId = this.generateConflictId();

    const conflict: Conflict = {
      id: conflictId,
      operations,
      conflictingWith,
      timestamp: Date.now(),
      resolved: false,
    };

    this.conflicts.set(conflictId, conflict);

    let resolution: AnyOperation[];

    switch (this.strategy) {
      case 'operational-transform':
        resolution = this.resolveWithOT(operations, conflictingWith);
        break;

      case 'last-write-wins':
        resolution = this.resolveLastWriteWins(operations, conflictingWith);
        break;

      case 'merge':
        resolution = this.resolveMerge(operations, conflictingWith, state);
        break;

      case 'manual':
        // Store for manual resolution
        resolution = operations;
        break;

      default:
        resolution = this.resolveWithOT(operations, conflictingWith);
    }

    conflict.resolved = true;
    conflict.resolution = resolution;
    this.conflicts.set(conflictId, conflict);

    return resolution;
  }

  /**
   * Resolve using Operational Transformation
   */
  private resolveWithOT(
    operations: AnyOperation[],
    conflictingWith: AnyOperation[]
  ): AnyOperation[] {
    return operations.map(op => 
      transformAgainstSequence(op, conflictingWith)
    );
  }

  /**
   * Resolve using last-write-wins strategy
   */
  private resolveLastWriteWins(
    operations: AnyOperation[],
    conflictingWith: AnyOperation[]
  ): AnyOperation[] {
    // Compare timestamps
    const opsTime = Math.max(
      ...operations.map(op => op.timestamp || 0)
    );
    const conflictTime = Math.max(
      ...conflictingWith.map(op => op.timestamp || 0)
    );

    // Return the newer operations
    return opsTime >= conflictTime ? operations : conflictingWith;
  }

  /**
   * Resolve by merging operations
   */
  private resolveMerge(
    operations: AnyOperation[],
    conflictingWith: AnyOperation[],
    state: DocumentState
  ): AnyOperation[] {
    const merged: AnyOperation[] = [];

    // Try to merge operations intelligently
    for (const op of operations) {
      let transformed = op;

      // Transform against conflicting operations
      for (const conflictOp of conflictingWith) {
        if (!this.detectConflict(transformed, conflictOp)) {
          continue;
        }

        // Merge based on operation types
        if (op.type === 'insert' && conflictOp.type === 'insert') {
          // Both insertions at same position - keep both with ordering
          transformed = transform(transformed, conflictOp);
        } else if (op.type === 'delete' && conflictOp.type === 'delete') {
          // Overlapping deletes - merge delete ranges
          transformed = this.mergeDeletes(transformed, conflictOp);
        } else {
          // Other conflicts - use OT
          transformed = transform(transformed, conflictOp);
        }
      }

      merged.push(transformed);
    }

    return merged;
  }

  /**
   * Merge overlapping delete operations
   */
  private mergeDeletes(
    del1: AnyOperation,
    del2: AnyOperation
  ): AnyOperation {
    if (del1.type !== 'delete' || del2.type !== 'delete') {
      return del1;
    }

    const start = Math.min(del1.position, del2.position);
    const end1 = del1.position + del1.length;
    const end2 = del2.position + del2.length;
    const end = Math.max(end1, end2);

    return {
      type: 'delete',
      position: start,
      length: end - start,
      timestamp: Math.max(del1.timestamp || 0, del2.timestamp || 0),
    };
  }

  /**
   * Get a conflict by ID
   */
  getConflict(conflictId: string): Conflict | undefined {
    return this.conflicts.get(conflictId);
  }

  /**
   * Get all conflicts
   */
  getAllConflicts(): Conflict[] {
    return Array.from(this.conflicts.values());
  }

  /**
   * Get unresolved conflicts
   */
  getUnresolvedConflicts(): Conflict[] {
    return Array.from(this.conflicts.values())
      .filter(c => !c.resolved);
  }

  /**
   * Mark a conflict as manually resolved
   */
  resolveManually(
    conflictId: string,
    resolution: AnyOperation[]
  ): void {
    const conflict = this.conflicts.get(conflictId);

    if (!conflict) {
      throw new RealtimeError(
        RealtimeErrorCode.CONFLICT_ERROR,
        `Conflict ${conflictId} not found`
      );
    }

    conflict.resolved = true;
    conflict.resolution = resolution;
    this.conflicts.set(conflictId, conflict);
  }

  /**
   * Clear resolved conflicts
   */
  clearResolved(): void {
    for (const [id, conflict] of this.conflicts.entries()) {
      if (conflict.resolved) {
        this.conflicts.delete(id);
      }
    }
  }

  /**
   * Clear all conflicts
   */
  clearAll(): void {
    this.conflicts.clear();
  }

  /**
   * Change conflict resolution strategy
   */
  setStrategy(strategy: ConflictStrategy): void {
    this.strategy = strategy;
  }

  /**
   * Get current strategy
   */
  getStrategy(): ConflictStrategy {
    return this.strategy;
  }

  /**
   * Generate unique conflict ID
   */
  private generateConflictId(): string {
    return `conflict-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate resolution
   */
  validateResolution(
    resolution: AnyOperation[],
    state: DocumentState
  ): boolean {
    try {
      let tempState = { ...state };

      for (const op of resolution) {
        const result = apply(op, tempState);

        if (!result.success || !result.newState) {
          return false;
        }

        tempState = result.newState;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get conflict statistics
   */
  getStats(): {
    total: number;
    resolved: number;
    unresolved: number;
    strategy: ConflictStrategy;
  } {
    const all = this.getAllConflicts();

    return {
      total: all.length,
      resolved: all.filter(c => c.resolved).length,
      unresolved: all.filter(c => !c.resolved).length,
      strategy: this.strategy,
    };
  }
}

/**
 * Three-way merge for complex conflicts
 */
export class ThreeWayMerge {
  /**
   * Perform three-way merge
   * 
   * @param base - Base/original state
   * @param ours - Our changes
   * @param theirs - Their changes
   */
  merge(
    base: DocumentState,
    ours: DocumentState,
    theirs: DocumentState
  ): {
    merged: DocumentState;
    conflicts: Conflict[];
  } {
    const conflicts: Conflict[] = [];

    // Simple line-based merge (simplified)
    const baseLines = base.content.split('\n');
    const ourLines = ours.content.split('\n');
    const theirLines = theirs.content.split('\n');

    const merged: string[] = [];
    let i = 0, j = 0, k = 0;

    while (i < baseLines.length || j < ourLines.length || k < theirLines.length) {
      const baseLine = baseLines[i] || '';
      const ourLine = ourLines[j] || '';
      const theirLine = theirLines[k] || '';

      if (baseLine === ourLine && baseLine === theirLine) {
        // No changes
        merged.push(baseLine);
        i++; j++; k++;
      } else if (baseLine === ourLine) {
        // Only theirs changed
        merged.push(theirLine);
        i++; j++; k++;
      } else if (baseLine === theirLine) {
        // Only ours changed
        merged.push(ourLine);
        i++; j++; k++;
      } else {
        // Both changed - conflict
        merged.push(`<<<<<<< ours\n${ourLine}\n=======\n${theirLine}\n>>>>>>> theirs`);
        conflicts.push({
          id: `merge-${i}-${Date.now()}`,
          operations: [],
          conflictingWith: [],
          timestamp: Date.now(),
          resolved: false,
        });
        i++; j++; k++;
      }
    }

    return {
      merged: {
        content: merged.join('\n'),
        version: Math.max(ours.version, theirs.version) + 1,
      },
      conflicts,
    };
  }
}
