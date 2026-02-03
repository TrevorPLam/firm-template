---
title: Real-Time Notifications
description: Event-driven notifications for collaboration workflows.
---

# Real-Time Notifications

## Notification Types

- Comment mentions
- Approval requests
- System alerts (build failures, publishing errors)

## Example Event Routing

```ts
const notify = ({ channel, message }: Notification) => {
  eventBus.publish(channel, {
    message,
    createdAt: new Date().toISOString(), // Provide timestamp for ordering.
  });
};
```

## Delivery Guidelines

- Throttle notifications during high-volume activity.
- Provide user-level preferences.
- Keep notifications actionable with direct links.
