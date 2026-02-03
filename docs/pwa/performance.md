---
title: PWA Performance Optimization
description: Optimize loading, caching, and runtime performance for PWAs.
---

# PWA Performance Optimization

## Core Recommendations

- Precache critical routes and fonts.
- Compress images and use responsive formats.
- Limit runtime caching to reduce stale assets.

## Performance Budget Example

```
First Contentful Paint: < 2.0s
Largest Contentful Paint: < 2.5s
Total JS per route: < 220 KB
```

## Runtime Hints

```ts
const cacheName = "runtime-v1";
// Increment cache version to force cleanup of old assets.
```
