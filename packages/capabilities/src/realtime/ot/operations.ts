/**
 * Operational Transformation - Operation Types and Utilities
 * 
 * Based on the WOOT (WithOut Operational Transformation) and Jupiter algorithms.
 * This module defines operation types and utility functions for OT.
 * 
 * References:
 * - Oster et al. (2006): "Data Consistency for P2P Collaborative Editing"
 * - Nichols et al. (1995): "High-latency, Low-bandwidth Windowing in the Jupiter Collaboration System"
 */

import type {
  AnyOperation,
  InsertOperation,
  DeleteOperation,
  RetainOperation,
  FormatOperation,
  SetOperation,
  UnsetOperation,
  DocumentState,
  OperationResult,
  RealtimeErrorCode,
} from '../types';
import { RealtimeError } from '../types';

/**
 * Create an insert operation
 */
export function insert(
  position: number,
  content: string,
  attributes?: Record<string, unknown>
): InsertOperation {
  if (position < 0) {
    throw new RealtimeError(
      RealtimeErrorCode.VALIDATION_ERROR,
      'Insert position must be non-negative'
    );
  }
  if (!content) {
    throw new RealtimeError(
      RealtimeErrorCode.VALIDATION_ERROR,
      'Insert content cannot be empty'
    );
  }

  return {
    type: 'insert',
    position,
    content,
    attributes,
    timestamp: Date.now(),
  };
}

/**
 * Create a delete operation
 */
export function delete_(position: number, length: number): DeleteOperation {
  if (position < 0) {
    throw new RealtimeError(
      RealtimeErrorCode.VALIDATION_ERROR,
      'Delete position must be non-negative'
    );
  }
  if (length <= 0) {
    throw new RealtimeError(
      RealtimeErrorCode.VALIDATION_ERROR,
      'Delete length must be positive'
    );
  }

  return {
    type: 'delete',
    position,
    length,
    timestamp: Date.now(),
  };
}

/**
 * Create a retain operation
 */
export function retain(
  length: number,
  attributes?: Record<string, unknown>
): RetainOperation {
  if (length <= 0) {
    throw new RealtimeError(
      RealtimeErrorCode.VALIDATION_ERROR,
      'Retain length must be positive'
    );
  }

  return {
    type: 'retain',
    length,
    attributes,
    timestamp: Date.now(),
  };
}

/**
 * Create a format operation
 */
export function format(
  position: number,
  length: number,
  attributes: Record<string, unknown>
): FormatOperation {
  if (position < 0) {
    throw new RealtimeError(
      RealtimeErrorCode.VALIDATION_ERROR,
      'Format position must be non-negative'
    );
  }
  if (length <= 0) {
    throw new RealtimeError(
      RealtimeErrorCode.VALIDATION_ERROR,
      'Format length must be positive'
    );
  }

  return {
    type: 'format',
    position,
    length,
    attributes,
    timestamp: Date.now(),
  };
}

/**
 * Create a set operation for structured data
 */
export function set(path: string[], value: unknown): SetOperation {
  if (!path || path.length === 0) {
    throw new RealtimeError(
      RealtimeErrorCode.VALIDATION_ERROR,
      'Set path cannot be empty'
    );
  }

  return {
    type: 'set',
    path,
    value,
    timestamp: Date.now(),
  };
}

/**
 * Create an unset operation for structured data
 */
export function unset(path: string[]): UnsetOperation {
  if (!path || path.length === 0) {
    throw new RealtimeError(
      RealtimeErrorCode.VALIDATION_ERROR,
      'Unset path cannot be empty'
    );
  }

  return {
    type: 'unset',
    path,
    timestamp: Date.now(),
  };
}

/**
 * Apply an operation to a document state
 */
export function apply(
  operation: AnyOperation,
  state: DocumentState
): OperationResult {
  try {
    let newContent = state.content;

    switch (operation.type) {
      case 'insert': {
        const op = operation as InsertOperation;
        if (op.position > newContent.length) {
          throw new RealtimeError(
            RealtimeErrorCode.VALIDATION_ERROR,
            `Insert position ${op.position} exceeds document length ${newContent.length}`
          );
        }
        newContent =
          newContent.slice(0, op.position) +
          op.content +
          newContent.slice(op.position);
        break;
      }

      case 'delete': {
        const op = operation as DeleteOperation;
        if (op.position + op.length > newContent.length) {
          throw new RealtimeError(
            RealtimeErrorCode.VALIDATION_ERROR,
            `Delete range exceeds document length`
          );
        }
        newContent =
          newContent.slice(0, op.position) +
          newContent.slice(op.position + op.length);
        break;
      }

      case 'retain':
        // Retain doesn't modify content
        break;

      case 'format':
        // Format operations don't modify plain text content
        // In a rich text editor, this would update attributes
        break;

      case 'set':
      case 'unset':
        // These operate on structured data, not implemented for plain text
        throw new RealtimeError(
          RealtimeErrorCode.VALIDATION_ERROR,
          'Set/Unset operations not supported for plain text documents'
        );

      default:
        throw new RealtimeError(
          RealtimeErrorCode.VALIDATION_ERROR,
          `Unknown operation type: ${(operation as AnyOperation).type}`
        );
    }

    return {
      success: true,
      newState: {
        ...state,
        content: newContent,
        version: state.version + 1,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Invert an operation (create its inverse)
 * Used for undo/redo functionality
 */
export function invert(
  operation: AnyOperation,
  state: DocumentState
): AnyOperation {
  switch (operation.type) {
    case 'insert': {
      const op = operation as InsertOperation;
      return delete_(op.position, op.content.length);
    }

    case 'delete': {
      const op = operation as DeleteOperation;
      const content = state.content.slice(op.position, op.position + op.length);
      return insert(op.position, content);
    }

    case 'retain':
      return operation;

    case 'format': {
      const op = operation as FormatOperation;
      // Invert by swapping attributes (simplified)
      return {
        ...op,
        attributes: {},
      };
    }

    case 'set': {
      const op = operation as SetOperation;
      // Get current value at path
      return unset(op.path);
    }

    case 'unset': {
      const op = operation as UnsetOperation;
      // Would need current value to properly invert
      return set(op.path, null);
    }

    default:
      throw new RealtimeError(
        RealtimeErrorCode.VALIDATION_ERROR,
        `Cannot invert unknown operation type`
      );
  }
}

/**
 * Compose two operations into a single operation
 * Used to merge consecutive operations for efficiency
 */
export function compose(
  op1: AnyOperation,
  op2: AnyOperation
): AnyOperation | null {
  // Same type operations that can be merged
  if (op1.type === 'insert' && op2.type === 'insert') {
    const o1 = op1 as InsertOperation;
    const o2 = op2 as InsertOperation;

    // Can compose if second insert is at the end of first
    if (o2.position === o1.position + o1.content.length) {
      return insert(o1.position, o1.content + o2.content, o1.attributes);
    }
  }

  if (op1.type === 'delete' && op2.type === 'delete') {
    const o1 = op1 as DeleteOperation;
    const o2 = op2 as DeleteOperation;

    // Can compose if deletions are adjacent
    if (o2.position === o1.position) {
      return delete_(o1.position, o1.length + o2.length);
    }
  }

  if (op1.type === 'retain' && op2.type === 'retain') {
    const o1 = op1 as RetainOperation;
    const o2 = op2 as RetainOperation;
    return retain(o1.length + o2.length);
  }

  // Cannot compose these operations
  return null;
}

/**
 * Validate an operation
 */
export function validate(operation: AnyOperation): boolean {
  try {
    switch (operation.type) {
      case 'insert': {
        const op = operation as InsertOperation;
        return op.position >= 0 && op.content.length > 0;
      }

      case 'delete': {
        const op = operation as DeleteOperation;
        return op.position >= 0 && op.length > 0;
      }

      case 'retain': {
        const op = operation as RetainOperation;
        return op.length > 0;
      }

      case 'format': {
        const op = operation as FormatOperation;
        return op.position >= 0 && op.length > 0;
      }

      case 'set': {
        const op = operation as SetOperation;
        return op.path && op.path.length > 0;
      }

      case 'unset': {
        const op = operation as UnsetOperation;
        return op.path && op.path.length > 0;
      }

      default:
        return false;
    }
  } catch {
    return false;
  }
}

/**
 * Compare two operations for equality
 */
export function equals(op1: AnyOperation, op2: AnyOperation): boolean {
  if (op1.type !== op2.type) return false;

  switch (op1.type) {
    case 'insert': {
      const o1 = op1 as InsertOperation;
      const o2 = op2 as InsertOperation;
      return (
        o1.position === o2.position &&
        o1.content === o2.content &&
        JSON.stringify(o1.attributes) === JSON.stringify(o2.attributes)
      );
    }

    case 'delete': {
      const o1 = op1 as DeleteOperation;
      const o2 = op2 as DeleteOperation;
      return o1.position === o2.position && o1.length === o2.length;
    }

    case 'retain': {
      const o1 = op1 as RetainOperation;
      const o2 = op2 as RetainOperation;
      return (
        o1.length === o2.length &&
        JSON.stringify(o1.attributes) === JSON.stringify(o2.attributes)
      );
    }

    case 'format': {
      const o1 = op1 as FormatOperation;
      const o2 = op2 as FormatOperation;
      return (
        o1.position === o2.position &&
        o1.length === o2.length &&
        JSON.stringify(o1.attributes) === JSON.stringify(o2.attributes)
      );
    }

    case 'set': {
      const o1 = op1 as SetOperation;
      const o2 = op2 as SetOperation;
      return (
        JSON.stringify(o1.path) === JSON.stringify(o2.path) &&
        JSON.stringify(o1.value) === JSON.stringify(o2.value)
      );
    }

    case 'unset': {
      const o1 = op1 as UnsetOperation;
      const o2 = op2 as UnsetOperation;
      return JSON.stringify(o1.path) === JSON.stringify(o2.path);
    }

    default:
      return false;
  }
}

/**
 * Calculate operation length (for iteration)
 */
export function length(operation: AnyOperation): number {
  switch (operation.type) {
    case 'insert':
      return (operation as InsertOperation).content.length;
    case 'delete':
      return (operation as DeleteOperation).length;
    case 'retain':
      return (operation as RetainOperation).length;
    case 'format':
      return (operation as FormatOperation).length;
    default:
      return 0;
  }
}
