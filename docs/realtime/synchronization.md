---
title: Real-Time Data Synchronization
description: Sync strategies, state hydration, and recovery patterns.
---

# Real-Time Data Synchronization

## Sync Strategies

- **Full snapshot + delta updates:** hydrate initial state, then send diffs.
- **Event sourcing:** store append-only events for replay.
- **Optimistic updates:** apply locally, rollback on error.

## Example Sync Flow

```ts
const state = await fetchInitialState();
setState(state);

socket.on("state.delta", (delta) => {
  setState((prev) => applyDelta(prev, delta)); // Merge updates safely.
});
```

## Recovery

- Re-fetch snapshot after reconnect.
- Ignore outdated deltas based on version.
