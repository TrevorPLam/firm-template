---
title: AI Troubleshooting & Optimization
description: Resolve latency, accuracy, and cost issues for AI features.
---

# AI Troubleshooting & Optimization

## Common Issues

| Symptom | Likely Cause | Fix |
| --- | --- | --- |
| High latency | Large prompts | Reduce context size or chunk requests |
| Inconsistent tone | High temperature | Lower temperature and add tone anchors |
| High costs | Long outputs | Reduce max tokens and cache drafts |

## Diagnostics Checklist

- Log prompt length, token usage, and response time.
- Compare output with reference examples.
- Validate model selection against use case.

## Optimization Playbook

```ts
const response = await aiClient.generate({
  prompt,
  maxTokens: 512,        // Lower output length to control cost.
  temperature: 0.3,      // Lower variance for consistent copy.
  cacheKey: "hero-v1",   // Cache repeatable drafts.
  timeoutMs: 10000,      // Fail fast to avoid UI hangs.
});
```

## Error Handling Guidance

- Provide a user-friendly fallback message.
- Re-route to human copy review if retries fail.
