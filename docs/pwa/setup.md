---
title: PWA Setup & Configuration
description: Configure manifests, icons, and installability for PWA-ready apps.
---

# PWA Setup & Configuration

## Environment Configuration

```bash
# .env.local (example)
PWA_ENABLED=true
PWA_OFFLINE_FALLBACK_PATH=/offline
PWA_SERVICE_WORKER_PATH=/sw.js
PWA_ENABLE_INSTALL_PROMPT=true
PWA_UPDATE_STRATEGY=prompt
PWA_ENABLE_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_VAPID_KEY=your-public-vapid-key
NEXT_PUBLIC_PWA_NAME=Firm Web App
NEXT_PUBLIC_PWA_SHORT_NAME=Firm
NEXT_PUBLIC_PWA_THEME_COLOR=#111827
NEXT_PUBLIC_PWA_BACKGROUND_COLOR=#ffffff
NEXT_PUBLIC_PWA_START_URL=/
NEXT_PUBLIC_PWA_DISPLAY=standalone
```

## Config Helper (Example)

```ts
import { getPwaConfig } from '@repo/capabilities/pwa'

const pwaConfig = getPwaConfig()

// Use pwaConfig to hydrate manifests and service worker defaults.
console.log(pwaConfig.manifest.name)
```

Use `PWA_UPDATE_STRATEGY` to control whether updates are applied silently (`auto`)
or surfaced to users via a prompt (`prompt`).

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
