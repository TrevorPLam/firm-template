---
title: Real-Time Collaboration Patterns
description: Presence, shared state, and conflict resolution guidelines.
---

# Real-Time Collaboration Patterns

## Core Concepts

- **Presence:** who is online and what they are viewing.
- **Shared state:** synchronized content or layouts.
- **Conflict handling:** last-write-wins or merge strategies.

## Collaboration Event Schema

```json
{
  "event": "cursor.update",
  "userId": "user_123",
  "payload": { "x": 120, "y": 220 }
}
```

## Conflict Resolution Tips

- Use version numbers or timestamps for state updates.
- Notify users when conflicts occur.
- Provide undo options for destructive actions.
