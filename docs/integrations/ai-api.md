---
title: AI API Integration & Error Handling
description: Implementation notes for AI API calls, retries, and observability.
---

# AI API Integration & Error Handling

## API Contract Expectations

- Standardize request payloads with prompt, model, and metadata.
- Track latency and token usage for budgeting.
- Use correlation IDs for request tracing.

## Example Integration Pattern

```ts
import { AiError } from "@firm/capabilities/ai";

const generationOptions = {
  prompt,
  model: "gpt-4.1-mini", // Use the default draft model.
  tags: ["client", "draft"],
};

try {
  const response = await aiClient.generate(generationOptions);

  return response.output;
} catch (error) {
  if (error instanceof AiError && error.retryable) {
    // Retry transient failures like 429 or 503.
    return aiClient.generate({ ...generationOptions, retryCount: 1 });
  }

  // Escalate non-retryable failures to monitoring.
  throw error;
}
```

## Observability Checklist

- Log prompt size, model, latency, and completion status.
- Trigger alerts on repeated failures per tenant.
- Store error traces with redacted prompts.
