---
title: Service Worker Implementation Patterns
description: Caching strategies and offline support patterns for PWAs.
---

# Service Worker Implementation Patterns

## Caching Strategy Matrix

| Resource | Strategy | Reason |
| --- | --- | --- |
| HTML | Network-first | Fresh content |
| Static assets | Cache-first | Fast loading |
| API data | Stale-while-revalidate | Balance speed + freshness |

## Example Registration

```ts
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js"); // Register after first paint.
  });
}
```

## Offline Fallback

self.addEventListener("fetch", (event) => {
  // Use network-first for navigation requests (HTML) to get the freshest content.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Fallback to cache if the network is unavailable.
        return caches.match(event.request);
      })
    );
    return;
  }

  // For other requests (e.g., static assets), use cache-first for performance.
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
