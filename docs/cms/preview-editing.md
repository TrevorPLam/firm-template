---
title: Content Preview & Editing Workflows
description: Enable previews, drafts, and editorial review steps.
---

# Content Preview & Editing Workflows

## Preview Flow

1. Editor saves draft content.
2. CMS triggers preview webhook.
3. Preview environment renders draft content.

## Preview Token Example

```ts
export function getPreviewHeaders(token: string) {
  return {
    "X-Preview-Token": token, // Keep tokens short-lived.
  };
}
```

## Editorial Notes

- Require peer review for public-facing content.
- Track draft → review → approved transitions.
