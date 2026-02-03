---
title: PWA Testing & Debugging
description: Validate installability, offline behavior, and service worker updates.
---

# PWA Testing & Debugging

## Testing Checklist

- Run Lighthouse PWA audit in Chrome DevTools.
- Validate offline fallback pages.
- Confirm update flow for service worker changes.

## Debugging Tips

```ts
navigator.serviceWorker.addEventListener("controllerchange", () => {
  window.location.reload(); // Refresh when a new SW takes control.
});
```

## Update Strategy

- Use a "new version available" banner to prompt reloads.
- Version static assets to avoid cache collisions.
