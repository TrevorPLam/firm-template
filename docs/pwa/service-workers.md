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

```js
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request); // Use cache when offline.
    })
  );
});
```
