/**
 * Operational Transformation - Transform Algorithms
 * 
 * Implements the core OT transformation algorithms for conflict resolution.
 * Based on the Jupiter algorithm and the Control Algorithm (CA) theory.
 * 
 * The transformation function T(a, b) transforms operation 'a' against operation 'b'
 * such that the effect of applying 'a' after 'b' is the same as applying 'a' before 'b'.
 * 
 * TP1: T(a, b) · b = T(b, a) · a  (Transformation Property 1 - Convergence)
 * TP2: T(c, a · b) = T(T(c, a), T(b, c))  (Transformation Property 2 - Composition)
 * 
 * References:
 * - Nichols et al. (1995): "High-latency, Low-bandwidth Windowing in the Jupiter Collaboration System"
 * - Ellis & Gibbs (1989): "Concurrency Control in Groupware Systems"
 * - Sun et al. (1998): "Achieving Convergence, Causality Preservation, and Intention Preservation in Real-Time Cooperative Editing Systems"
 */

import type {
  AnyOperation,
  InsertOperation,
  DeleteOperation,
  RetainOperation,
  FormatOperation,
  RealtimeErrorCode,
} from '../types';
import { RealtimeError } from '../types';

/**
 * Transform operation 'a' against operation 'b'
 * Returns transformed version of 'a' that can be applied after 'b'
 */
export function transform(a: AnyOperation, b: AnyOperation): AnyOperation {
  // Insert vs Insert
  if (a.type === 'insert' && b.type === 'insert') {
    return transformInsertInsert(a, b);
  }

  // Insert vs Delete
  if (a.type === 'insert' && b.type === 'delete') {
    return transformInsertDelete(a, b);
  }

  // Delete vs Insert
  if (a.type === 'delete' && b.type === 'insert') {
    return transformDeleteInsert(a, b);
  }

  // Delete vs Delete
  if (a.type === 'delete' && b.type === 'delete') {
    return transformDeleteDelete(a, b);
  }

  // Insert vs Retain
  if (a.type === 'insert' && b.type === 'retain') {
    return a; // Retain doesn't affect position
  }

  // Delete vs Retain
  if (a.type === 'delete' && b.type === 'retain') {
    return a; // Retain doesn't affect position
  }

  // Format operations
  if (a.type === 'format' && b.type === 'insert') {
    return transformFormatInsert(a, b);
  }

  if (a.type === 'format' && b.type === 'delete') {
    return transformFormatDelete(a, b);
  }

  // Default: return operation unchanged
  return a;
}

/**
 * Transform Insert vs Insert
 * When two inserts occur at the same position, we break ties using clientId or timestamp
 */
function transformInsertInsert(
  a: InsertOperation,
  b: InsertOperation
): InsertOperation {
  if (a.position < b.position) {
    // 'a' is before 'b', no change needed
    return a;
  } else if (a.position > b.position) {
    // 'a' is after 'b', shift position by length of 'b'
    return {
      ...a,
      position: a.position + b.content.length,
    };
  } else {
    // Same position - use tie-breaking
    // If 'b' has lower clientId or earlier timestamp, it goes first
    const bPriority = b.clientId || b.userId || '';
    const aPriority = a.clientId || a.userId || '';

    if (bPriority < aPriority) {
      return {
        ...a,
        position: a.position + b.content.length,
      };
    } else {
      return a;
    }
  }
}

/**
 * Transform Insert vs Delete
 */
function transformInsertDelete(
  insert: InsertOperation,
  del: DeleteOperation
): InsertOperation {
  const deleteEnd = del.position + del.length;

  if (insert.position <= del.position) {
    // Insert is before delete range, no change
    return insert;
  } else if (insert.position >= deleteEnd) {
    // Insert is after delete range, shift back by delete length
    return {
      ...insert,
      position: insert.position - del.length,
    };
  } else {
    // Insert is within delete range, move to delete start
    return {
      ...insert,
      position: del.position,
    };
  }
}

/**
 * Transform Delete vs Insert
 */
function transformDeleteInsert(
  del: DeleteOperation,
  insert: InsertOperation
): DeleteOperation {
  const deleteEnd = del.position + del.length;

  if (insert.position <= del.position) {
    // Insert is before delete range, shift delete forward
    return {
      ...del,
      position: del.position + insert.content.length,
    };
  } else if (insert.position >= deleteEnd) {
    // Insert is after delete range, no change
    return del;
  } else {
    // Insert is within delete range, extend delete length
    return {
      ...del,
      length: del.length + insert.content.length,
    };
  }
}

/**
 * Transform Delete vs Delete
 */
function transformDeleteDelete(
  a: DeleteOperation,
  b: DeleteOperation
): DeleteOperation {
  const aEnd = a.position + a.length;
  const bEnd = b.position + b.length;

  // No overlap
  if (aEnd <= b.position) {
    // 'a' is completely before 'b'
    return a;
  } else if (a.position >= bEnd) {
    // 'a' is completely after 'b', shift back
    return {
      ...a,
      position: a.position - b.length,
    };
  }

  // There is overlap - need to adjust
  const overlapStart = Math.max(a.position, b.position);
  const overlapEnd = Math.min(aEnd, bEnd);
  const overlapLength = overlapEnd - overlapStart;

  if (a.position < b.position) {
    if (aEnd <= bEnd) {
      // 'a' starts before 'b' and ends within 'b'
      return {
        ...a,
        length: b.position - a.position,
      };
    } else {
      // 'a' encompasses 'b'
      return {
        ...a,
        length: a.length - b.length,
      };
    }
  } else {
    if (aEnd <= bEnd) {
      // 'a' is completely contained within 'b'
      return {
        ...a,
        position: b.position,
        length: 0,
      };
    } else {
      // 'a' starts within 'b' and extends beyond
      return {
        ...a,
        position: b.position,
        length: aEnd - bEnd,
      };
    }
  }
}

/**
 * Transform Format vs Insert
 */
function transformFormatInsert(
  format: FormatOperation,
  insert: InsertOperation
): FormatOperation {
  const formatEnd = format.position + format.length;

  if (insert.position <= format.position) {
    // Insert before format range, shift format forward
    return {
      ...format,
      position: format.position + insert.content.length,
    };
  } else if (insert.position >= formatEnd) {
    // Insert after format range, no change
    return format;
  } else {
    // Insert within format range, extend format length
    return {
      ...format,
      length: format.length + insert.content.length,
    };
  }
}

/**
 * Transform Format vs Delete
 */
function transformFormatDelete(
  format: FormatOperation,
  del: DeleteOperation
): FormatOperation {
  const formatEnd = format.position + format.length;
  const deleteEnd = del.position + del.length;

  // No overlap
  if (formatEnd <= del.position) {
    // Format is completely before delete
    return format;
  } else if (format.position >= deleteEnd) {
    // Format is completely after delete, shift back
    return {
      ...format,
      position: format.position - del.length,
    };
  }

  // There is overlap
  const overlapStart = Math.max(format.position, del.position);
  const overlapEnd = Math.min(formatEnd, deleteEnd);
  const overlapLength = overlapEnd - overlapStart;

  if (format.position < del.position) {
    if (formatEnd <= deleteEnd) {
      // Format starts before delete and ends within delete
      return {
        ...format,
        length: del.position - format.position,
      };
    } else {
      // Format encompasses delete
      return {
        ...format,
        length: format.length - del.length,
      };
    }
  } else {
    if (formatEnd <= deleteEnd) {
      // Format is completely contained within delete
      return {
        ...format,
        position: del.position,
        length: 0,
      };
    } else {
      // Format starts within delete and extends beyond
      return {
        ...format,
        position: del.position,
        length: formatEnd - deleteEnd,
      };
    }
  }
}

/**
 * Transform an operation against a sequence of operations
 * This is used when catching up with missed operations
 */
export function transformAgainstSequence(
  operation: AnyOperation,
  sequence: AnyOperation[]
): AnyOperation {
  let transformed = operation;

  for (const op of sequence) {
    transformed = transform(transformed, op);
  }

  return transformed;
}

/**
 * Transform a sequence of operations against another operation
 * Returns the transformed sequence
 */
export function transformSequence(
  sequence: AnyOperation[],
  operation: AnyOperation
): AnyOperation[] {
  return sequence.map(op => transform(op, operation));
}

/**
 * Compose transformation: Transform 'c' against the composition of 'a' and 'b'
 * Verifies TP2: T(c, a · b) = T(T(c, a), T(b, c))
 */
export function composeTransform(
  c: AnyOperation,
  a: AnyOperation,
  b: AnyOperation
): AnyOperation {
  const cPrimeA = transform(c, a);
  const bPrimeC = transform(b, c);
  return transform(cPrimeA, bPrimeC);
}

/**
 * Verify convergence property (TP1)
 * For testing: checks if T(a, b) · b = T(b, a) · a
 */
export function verifyConvergence(
  a: AnyOperation,
  b: AnyOperation,
  initialState: string
): boolean {
  try {
    const aPrime = transform(a, b);
    const bPrime = transform(b, a);

    // Apply b then a'
    let state1 = applyOp(initialState, b);
    state1 = applyOp(state1, aPrime);

    // Apply a then b'
    let state2 = applyOp(initialState, a);
    state2 = applyOp(state2, bPrime);

    return state1 === state2;
  } catch {
    return false;
  }
}

/**
 * Helper: Apply an operation to a string (simplified)
 */
function applyOp(content: string, op: AnyOperation): string {
  switch (op.type) {
    case 'insert': {
      const o = op as InsertOperation;
      return (
        content.slice(0, o.position) + o.content + content.slice(o.position)
      );
    }
    case 'delete': {
      const o = op as DeleteOperation;
      return content.slice(0, o.position) + content.slice(o.position + o.length);
    }
    case 'retain':
    case 'format':
      return content;
    default:
      return content;
  }
}

/**
 * Create an identity transformation (no-op)
 */
export function identity(length: number): RetainOperation {
  return {
    type: 'retain',
    length,
    timestamp: Date.now(),
  };
}

/**
 * Check if an operation is a no-op
 */
export function isNoop(operation: AnyOperation): boolean {
  switch (operation.type) {
    case 'insert':
      return (operation as InsertOperation).content.length === 0;
    case 'delete':
      return (operation as DeleteOperation).length === 0;
    case 'format':
      return (operation as FormatOperation).length === 0;
    case 'retain':
      return true;
    default:
      return false;
  }
}
