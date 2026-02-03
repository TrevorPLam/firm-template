---
title: Multi-Channel Content Distribution
description: Deliver content across web, email, and social channels.
---

# Multi-Channel Content Distribution

## Channel Matrix

| Channel | Format | Owner | SLA |
| --- | --- | --- | --- |
| Website | HTML | Web team | 24h |
| Email | Markdown | Lifecycle | 48h |
| Social | Snippets | Social team | 12h |

## Distribution Checklist

- Confirm channel-specific formatting rules.
- Review content metadata (SEO, tags, categories).
- Schedule releases to avoid overlap.

## Payload Example

```json
{
  "id": "case-study-42",
  "channels": ["web", "email"],
  "publishAt": "2026-02-10T10:00:00Z"
}
```
