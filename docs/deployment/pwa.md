---
title: PWA Deployment Checklist
description: Validate hosting, headers, and release steps for PWA production.
---

# PWA Deployment Checklist

## Hosting & Headers

- Serve over HTTPS with HSTS enabled.
- Set `Content-Type: application/manifest+json` for manifest.
- Configure cache-control headers for service worker updates.

## Release Steps

1. Bump service worker cache version.
2. Deploy assets with versioned filenames.
3. Run Lighthouse audit post-deploy.
4. Validate push notification delivery.

## Rollback Guidance

- Keep previous service worker script for 24 hours.
- Document known issues and remediation steps.
