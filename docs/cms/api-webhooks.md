---
title: CMS API Usage & Webhook Integration
description: API patterns, caching guidance, and webhook processing.
---

# CMS API Usage & Webhook Integration

## API Fetch Pattern

```ts
const entry = await cmsClient.getEntry("caseStudy", {
  locale: "en-US",
  include: 2, // Resolve nested references.
});
```

## Webhook Handler Example

```ts
export async function handleCmsWebhook(payload: CmsWebhookPayload) {
  if (payload.event === "publish") {
    await revalidatePath(`/case-studies/${payload.entryId}`); // Refresh cached pages.
  }
}
```

## Caching Guidance

- Cache published content for 5-15 minutes.
- Skip caching for preview tokens.
