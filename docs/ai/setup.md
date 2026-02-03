---
title: AI Service Setup & Configuration
description: Configure AI providers, credentials, and baseline model settings.
---

# AI Service Setup & Configuration

## Provider Checklist

- Confirm vendor terms, data retention, and privacy policy.
- Ensure API keys are stored in a secrets manager.
- Define default models and fallback options.

## Environment Configuration

```
# .env.local (example)
AI_PROVIDER=openai
AI_MODEL=gpt-4.1-mini // Default model for content drafts.
AI_MAX_TOKENS=2048   // Cap output to control cost.
AI_TEMPERATURE=0.4   // Keep copy consistent and on-brand.
```

## Runtime Initialization (Example)

```ts
import { createAiClient } from "@firm/capabilities/ai";

const aiClient = createAiClient({
  provider: process.env.AI_PROVIDER, // Select configured provider.
  model: process.env.AI_MODEL,       // Override per-request if needed.
  maxTokens: Number(process.env.AI_MAX_TOKENS),
  temperature: Number(process.env.AI_TEMPERATURE),
});
```

## Security Notes

- Restrict API keys to server-only environments.
- Enable audit logging for AI request metadata (prompt length, latency).
