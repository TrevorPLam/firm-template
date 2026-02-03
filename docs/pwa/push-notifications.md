---
title: Push Notification Integration
description: Implement subscription flows and delivery services for PWA notifications.
---

# Push Notification Integration

## Subscription Flow

```ts
const registration = await navigator.serviceWorker.ready;
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY, // Public VAPID key.
});
```

## Server Payload Guidelines

- Include a short title, body, and CTA URL.
- Avoid sensitive content in notification previews.
- Use topic tags to control segmentation.

## Delivery Checklist

- Configure VAPID keys and rotation policy.
- Track opt-in and opt-out rates.
- Provide a settings UI for notification preferences.
