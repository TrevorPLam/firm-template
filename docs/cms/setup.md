---
title: CMS Setup & Integration
description: Configure headless CMS providers and sync content models.
---

# CMS Setup & Integration

## Provider Checklist

- Confirm content model support (references, locales).
- Validate webhook and preview capabilities.
- Ensure SSO or role-based access control.

## Content Model Sync

```ts
const contentType = {
  name: 'caseStudy',
  fields: [
    { id: 'title', type: 'text', required: true },
    { id: 'summary', type: 'richText' },
    { id: 'industry', type: 'text' },
  ],
}

await cmsClient.createContentType(contentType) // Keep CMS schema aligned.
```

## Webhook Configuration

- Configure webhooks to hit `/api/cms/webhook` in each app.
- Validate webhook signatures with `CMS_WEBHOOK_SECRET`.
- Log failed deliveries to surface integration drift.

## Environment Configuration

```bash
# .env.local (example)
CMS_PROVIDER=contentful
CMS_PROJECT_ID=space_123
CMS_DATASET=production
CMS_API_TOKEN=secure-token
CMS_PREVIEW_SECRET=preview-secret
CMS_WEBHOOK_SECRET=webhook-secret
CMS_API_BASE_URL=https://cdn.contentful.com
```

## Health Checks

Track CMS availability by validating `CMS_API_TOKEN` during startup and
periodically checking a lightweight content query.

## Config Helper (Example)

```ts
import { getCmsConfig } from '@repo/capabilities/cms'

const cmsConfig = getCmsConfig()

// Use cmsConfig to initialize the CMS adapter.
console.log(cmsConfig.provider, cmsConfig.projectId)
```
