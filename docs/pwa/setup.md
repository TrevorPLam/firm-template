---
title: PWA Setup & Configuration
description: Configure manifests, icons, and installability for PWA-ready apps.
---

# PWA Setup & Configuration

## Manifest Essentials

Include a `manifest.json` with required fields:

```json
{
  "name": "Firm Client Portal",
  "short_name": "Firm",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0B0D12",
  "theme_color": "#0B0D12",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" }
  ]
}
```

## Next.js Configuration Notes

```ts
const nextConfig = {
  async headers() {
    return [
      {
        source: "/manifest.json",
        headers: [
          { key: "Content-Type", value: "application/manifest+json" }, // Ensure proper MIME type.
        ],
      },
    ];
  },
};
```

## Installability Checklist

- Serve over HTTPS (or localhost for dev).
- Provide a 192x192 and 512x512 icon.
- Ensure a service worker is registered.
