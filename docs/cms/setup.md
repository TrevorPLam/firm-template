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
  name: "caseStudy",
  fields: [
    { id: "title", type: "text", required: true },
    { id: "summary", type: "richText" },
    { id: "industry", type: "text" },
  ],
};

await cmsClient.createContentType(contentType); // Keep CMS schema aligned.
```

## Environment Variables

```
CMS_PROVIDER=contentful
CMS_SPACE_ID=abc123
CMS_API_TOKEN=secure-token
```
