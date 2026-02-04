# Real-time Collaboration and Live Editing Platform

Advanced operational transformation infrastructure for real-time collaborative editing with presence awareness, conflict resolution, and approval workflows.

## Overview

This package provides production-ready infrastructure for building real-time collaborative applications. It implements proper Operational Transformation (OT) algorithms based on academic research, including the Jupiter algorithm and WOOT framework.

## Features

- **Operational Transformation**: Industry-standard OT algorithms for conflict-free concurrent editing
- **Presence Tracking**: Real-time cursor positions and user awareness
- **Synchronization**: Robust sync system with automatic conflict resolution
- **Workflows**: Multi-stage approval and review processes
- **Notifications**: Real-time notification system for collaboration events
- **Type Safety**: Full TypeScript support with comprehensive type definitions

## Theoretical Foundation

### Operational Transformation (OT)

Operational Transformation is a technology for supporting collaborative editing systems. The core idea is to transform operations from one context to another, ensuring that all clients converge to the same final state regardless of the order in which they receive operations.

#### Key Properties

**TP1 (Transformation Property 1 - Convergence)**:
```
T(a, b) · b = T(b, a) · a
```
This ensures that applying operation `a` after `b` produces the same result as applying `b` after `a`, after proper transformation.

**TP2 (Transformation Property 2 - Composition)**:
```
T(c, a · b) = T(T(c, a), T(b, c))
```
This property ensures correctness when transforming against a sequence of operations.

### Academic References

1. **Ellis & Gibbs (1989)**: "Concurrency Control in Groupware Systems"
   - Introduced the concept of Operational Transformation
   - Defined the transformation properties TP1 and TP2

2. **Nichols et al. (1995)**: "High-latency, Low-bandwidth Windowing in the Jupiter Collaboration System"
   - Introduced the Jupiter algorithm
   - Client-server architecture for OT
   - Solved many practical implementation challenges

3. **Oster et al. (2006)**: "Data Consistency for P2P Collaborative Editing"
   - WOOT (WithOut Operational Transformation) algorithm
   - Alternative approach for peer-to-peer systems

4. **Sun et al. (1998)**: "Achieving Convergence, Causality Preservation, and Intention Preservation in Real-Time Cooperative Editing Systems"
   - Formal analysis of OT properties
   - COT (Causality, Ordering, Transformation) framework

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  (WebSocket/Transport Integration - App Specific)           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                 Real-time Infrastructure                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  OT Engine   │  │ Synchronizer │  │  Presence    │     │
│  │              │  │              │  │  Tracker     │     │
│  │ - Transform  │  │ - Messages   │  │ - Cursors    │     │
│  │ - Compose    │  │ - Acks       │  │ - Status     │     │
│  │ - Apply      │  │ - Retry      │  │ - Transform  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Conflict    │  │  Workflows   │  │Notifications │     │
│  │  Resolver    │  │              │  │              │     │
│  │              │  │ - Approval   │  │ - Events     │     │
│  │ - Detect     │  │ - Stages     │  │ - Subscribe  │     │
│  │ - Merge      │  │ - Actions    │  │ - Deliver    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Installation

```bash
# This is part of the firm-template monorepo
# Import from capabilities package
```

## Usage

### Basic Collaborative Editing

```typescript
import { OTEngine, Synchronizer, PresenceTracker } from '@firm/capabilities/realtime';

// Initialize OT engine
const engine = new OTEngine('Initial document content');

// Initialize synchronizer
const sync = new Synchronizer('Initial document content');

// Initialize presence tracker
const presence = new PresenceTracker();

// Register user
presence.join({
  userId: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
  color: '#FF6B6B',
});

// Track cursor movements
presence.updateCursor('user-123', {
  line: 5,
  column: 10,
  offset: 150,
});
```

### Applying Operations

```typescript
import { insert, delete as del, format } from '@firm/capabilities/realtime';

// Insert text
const insertOp = insert(10, 'Hello World');
const result = engine.submit(insertOp, 'client-1', engine.getVersion());

// Delete text
const deleteOp = del(5, 10);
engine.submit(deleteOp, 'client-1', engine.getVersion());

// Format text
const formatOp = format(0, 5, { bold: true, color: 'red' });
engine.submit(formatOp, 'client-1', engine.getVersion());
```

### Operational Transformation

```typescript
import { transform, insert, delete as del } from '@firm/capabilities/realtime';

// Two concurrent operations
const op1 = insert(5, 'Hello');
const op2 = insert(10, 'World');

// Transform op1 against op2
const transformedOp1 = transform(op1, op2);

// Now transformedOp1 can be applied after op2
// This ensures convergence
```

### Synchronization

```typescript
// Connect to sync system
sync.connect();

// Send operations
const operations = [insert(0, 'Hello'), insert(5, ' World')];
const message = await sync.send(operations, 'user-123', 'client-1');

// Receive remote operations
sync.subscribe((event, data) => {
  if (event === 'synced') {
    console.log('All operations synced');
  }
});

// Handle incoming messages
sync.receive(incomingMessage);
```

### Conflict Resolution

```typescript
import { ConflictResolver } from '@firm/capabilities/realtime';

const resolver = new ConflictResolver('operational-transform');

// Detect conflicts
const hasConflict = resolver.detectConflict(op1, op2);

// Resolve conflicts
if (hasConflict) {
  const resolved = resolver.resolve(
    [op1],
    [op2],
    engine.getState()
  );
  
  // Apply resolved operations
  for (const op of resolved) {
    engine.submit(op, 'client-1', engine.getVersion());
  }
}
```

### Presence Indicators

```typescript
import {
  generateCursorIndicators,
  generateAvatarIndicators,
  cursorToStyles,
} from '@firm/capabilities/realtime';

// Get all presences
const presences = presence.getAll();

// Generate cursor indicators for rendering
const cursors = generateCursorIndicators(presences, 'current-user-id');

// Render cursors
cursors.forEach(cursor => {
  const styles = cursorToStyles(cursor.position);
  // Apply styles to DOM element
});

// Generate avatar indicators
const avatars = generateAvatarIndicators(presences);
```

### Approval Workflows

```typescript
import { ApprovalWorkflow, createSimpleWorkflow } from '@firm/capabilities/realtime';

// Create workflow manager
const workflow = new ApprovalWorkflow();

// Create a simple approval workflow
const approval = workflow.createWorkflow(
  'Document Review',
  'doc-123',
  [
    {
      id: 'stage-1',
      name: 'Review',
      order: 1,
      approvers: ['user-1', 'user-2'],
      requiredApprovals: 2,
    },
  ],
  'author-id'
);

// Create approval request
const request = workflow.createRequest(
  approval.id,
  'author-id',
  ['user-1', 'user-2'],
  'Please review this document',
  Date.now() + 86400000 // 24 hours
);

// Submit approval action
workflow.submitAction(
  request.id,
  'user-1',
  'approve',
  'Looks good!'
);

// Check workflow status
workflow.subscribe((event, wf) => {
  if (event === 'approved') {
    console.log('Workflow approved:', wf.id);
  }
});
```

### Notifications

```typescript
import { NotificationSystem } from '@firm/capabilities/realtime';

const notifications = new NotificationSystem();

// Subscribe to notifications
notifications.onNotification((notification) => {
  console.log('New notification:', notification.title);
  // Display to user
});

// Send various notification types
notifications.sendMention(
  'user-123',
  'sender-456',
  'doc-789',
  '@user-123 what do you think?',
  '/documents/789'
);

notifications.sendApprovalRequest(
  'user-123',
  'sender-456',
  'doc-789',
  'Please review the changes',
  '/approvals/request-123'
);

// Get unread notifications
const unread = notifications.getForUser('user-123', true);

// Mark as read
notifications.markAsRead(unread[0].id);
```

## Advanced Usage

### Custom Conflict Resolution Strategy

```typescript
const resolver = new ConflictResolver('merge');

// Or implement custom strategy
resolver.setStrategy('operational-transform');

// Handle manual resolution
const unresolved = resolver.getUnresolvedConflicts();
for (const conflict of unresolved) {
  const resolution = customResolve(conflict);
  resolver.resolveManually(conflict.id, resolution);
}
```

### Three-Way Merge

```typescript
import { ThreeWayMerge } from '@firm/capabilities/realtime';

const merger = new ThreeWayMerge();

const result = merger.merge(
  baseState,
  ourState,
  theirState
);

if (result.conflicts.length > 0) {
  // Handle conflicts
  console.log('Merge conflicts:', result.conflicts);
} else {
  // Use merged state
  console.log('Merged successfully:', result.merged);
}
```

### Multi-Stage Workflows

```typescript
import { createMultiStageWorkflow } from '@firm/capabilities/realtime';

const { workflow, manager } = createMultiStageWorkflow(
  'Complex Review',
  'doc-123',
  [
    {
      name: 'Peer Review',
      approvers: ['peer-1', 'peer-2'],
      requiredApprovals: 1,
    },
    {
      name: 'Manager Review',
      approvers: ['manager-1'],
      requiredApprovals: 1,
    },
    {
      name: 'Final Approval',
      approvers: ['director-1'],
      requiredApprovals: 1,
    },
  ],
  'author-id'
);
```

### Batch Operations

```typescript
// Submit multiple operations as a batch
const operations = [
  insert(0, 'Hello '),
  insert(6, 'World'),
  format(0, 11, { bold: true }),
];

const result = engine.submitBatch(
  operations,
  'client-1',
  engine.getVersion()
);

if (result.success) {
  console.log('Batch applied successfully');
}
```

### Cursor Transformation

```typescript
// Transform cursors when operations are applied
presence.transformAllCursors('insert', 10, 5);

// Or transform individual cursor
const newCursor = presence.transformCursor(
  cursor,
  'delete',
  10,
  5
);
```

## API Reference

### OT Engine

#### `OTEngine`

Main engine for operational transformation.

**Constructor**: `new OTEngine(initialContent?: string, config?: OTEngineConfig)`

**Methods**:
- `getState(): DocumentState` - Get current document state
- `getVersion(): number` - Get current version number
- `submit(operation, clientId, baseVersion)` - Submit an operation
- `submitBatch(operations, clientId, baseVersion)` - Submit multiple operations
- `getOperationsSince(version)` - Get operations since a version
- `checkpoint()` - Create a state checkpoint
- `restore(checkpoint)` - Restore from checkpoint
- `getStats()` - Get engine statistics

### Operations

#### Basic Operations

- `insert(position, content, attributes?)` - Create insert operation
- `delete(position, length)` - Create delete operation
- `retain(length, attributes?)` - Create retain operation
- `format(position, length, attributes)` - Create format operation
- `set(path, value)` - Create set operation (structured data)
- `unset(path)` - Create unset operation (structured data)

#### Transformation Functions

- `transform(op1, op2)` - Transform op1 against op2
- `transformAgainstSequence(op, sequence)` - Transform against multiple ops
- `compose(op1, op2)` - Compose two operations
- `apply(operation, state)` - Apply operation to state
- `invert(operation, state)` - Invert operation (for undo)

### Presence Tracker

#### `PresenceTracker`

Tracks user presence and cursor positions.

**Constructor**: `new PresenceTracker(config?: PresenceConfig)`

**Methods**:
- `join(presence)` - Add user presence
- `leave(userId)` - Remove user presence
- `updateCursor(userId, cursor)` - Update cursor position
- `updateSelection(userId, selection)` - Update selection
- `getAll()` - Get all presences
- `getActive()` - Get active users only
- `transformCursor(cursor, operationType, position, length)` - Transform cursor

### Synchronizer

#### `Synchronizer`

Manages real-time synchronization.

**Constructor**: `new Synchronizer(initialContent?: string, config?: SyncConfig)`

**Methods**:
- `connect()` - Connect to sync system
- `disconnect()` - Disconnect
- `send(operations, userId, clientId)` - Send operations
- `receive(message)` - Receive remote operations
- `subscribe(handler)` - Subscribe to sync events
- `getPendingMessages()` - Get pending messages
- `getStats()` - Get sync statistics

### Conflict Resolver

#### `ConflictResolver`

Resolves operation conflicts.

**Constructor**: `new ConflictResolver(strategy?: ConflictStrategy)`

**Methods**:
- `detectConflict(op1, op2)` - Check if operations conflict
- `resolve(operations, conflictingWith, state)` - Resolve conflicts
- `getUnresolvedConflicts()` - Get unresolved conflicts
- `setStrategy(strategy)` - Change resolution strategy

### Approval Workflow

#### `ApprovalWorkflow`

Manages collaborative approval workflows.

**Constructor**: `new ApprovalWorkflow()`

**Methods**:
- `createWorkflow(name, documentId, stages, createdBy)` - Create workflow
- `createRequest(workflowId, requesterId, approvers, message?, deadline?)` - Create approval request
- `submitAction(requestId, userId, action, comment?)` - Submit approval action
- `getPendingRequests(userId)` - Get pending requests for user
- `getOverdueRequests()` - Get overdue requests

### Notification System

#### `NotificationSystem`

Manages real-time notifications.

**Constructor**: `new NotificationSystem()`

**Methods**:
- `send(userId, type, title, message, options?)` - Send notification
- `sendMention(userId, senderId, documentId, message, actionUrl?)` - Send mention
- `sendApprovalRequest(userId, senderId, documentId, message, actionUrl?)` - Send approval request
- `getForUser(userId, unreadOnly?)` - Get user's notifications
- `markAsRead(notificationId)` - Mark as read
- `subscribe(userId, types, documentId?)` - Subscribe to notification types

## Type Definitions

See `types.ts` for complete type definitions including:

- `AnyOperation` - Union of all operation types
- `DocumentState` - Document state representation
- `UserPresence` - User presence information
- `SyncMessage` - Synchronization message
- `Conflict` - Conflict information
- `ApprovalRequest` - Approval request
- `Notification` - Notification object
- And many more...

## Performance Considerations

### Operation Batching

Batch operations when possible to reduce network overhead and transformation complexity:

```typescript
const batches = sync.batchOperations(largeOperationList);
for (const batch of batches) {
  await sync.send(batch, userId, clientId);
}
```

### History Optimization

The OT engine automatically optimizes operation history by composing consecutive operations:

```typescript
engine.optimizeHistory(); // Manually trigger optimization
```

### Cleanup

Always clean up resources when done:

```typescript
engine.destroy();
sync.destroy();
presence.destroy();
notifications.destroy();
```

## Error Handling

All components throw `RealtimeError` with specific error codes:

```typescript
import { RealtimeError, RealtimeErrorCode } from '@firm/capabilities/realtime';

try {
  engine.submit(operation, clientId, version);
} catch (error) {
  if (error instanceof RealtimeError) {
    switch (error.code) {
      case RealtimeErrorCode.TRANSFORM_ERROR:
        // Handle transformation error
        break;
      case RealtimeErrorCode.VALIDATION_ERROR:
        // Handle validation error
        break;
      case RealtimeErrorCode.SYNC_ERROR:
        // Handle sync error
        break;
    }
  }
}
```

## Integration with Transport Layer

This package provides the OT infrastructure but does not include WebSocket or transport implementation. Here's how to integrate:

```typescript
// Example WebSocket integration
const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  sync.receive(message);
};

sync.subscribe((event, data) => {
  if (event === 'syncing') {
    // Send message via WebSocket
    ws.send(JSON.stringify(data));
  }
});
```

## Testing

The implementation includes comprehensive error handling and validation. Test your integration:

```typescript
import { verifyConvergence } from '@firm/capabilities/realtime';

// Verify TP1 property
const op1 = insert(5, 'Hello');
const op2 = insert(10, 'World');
const converges = verifyConvergence(op1, op2, 'Initial content');

console.assert(converges, 'Operations should converge');
```

## Best Practices

1. **Always transform operations**: Never apply remote operations directly without transformation
2. **Batch when possible**: Reduce network overhead by batching operations
3. **Handle conflicts gracefully**: Use appropriate conflict resolution strategy for your use case
4. **Clean up resources**: Call `destroy()` on components when done
5. **Monitor statistics**: Use `getStats()` methods to monitor system health
6. **Implement proper error handling**: Handle all `RealtimeError` cases
7. **Version tracking**: Always track document versions for consistency

## License

Part of the firm-template monorepo.

## References

- [Operational Transformation](https://en.wikipedia.org/wiki/Operational_transformation)
- [Jupiter Collaboration System](https://dl.acm.org/doi/10.1145/215585.215706)
- [WOOT Algorithm](https://hal.inria.fr/inria-00071240)
- [Google Wave Federation Protocol](https://en.wikipedia.org/wiki/Google_Wave_Federation_Protocol)
