---
title: Real-Time Testing & Debugging
description: Validate collaboration flows, latency, and message delivery.
---

# Real-Time Testing & Debugging

## Testing Checklist

- Simulate concurrent editors.
- Validate reconnect logic after network loss.
- Measure latency and dropped events.

## Debug Hooks

```ts
socket.on("connect_error", (error) => {
  console.error("Socket error", error); // Capture for monitoring.
});
```

## Performance Targets

- Round-trip latency < 200ms for critical interactions.
- Reconnect within 3 seconds.
