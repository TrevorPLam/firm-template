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

```bash
# .env.local (example)
AI_PROVIDER=openai
AI_API_KEY=sk-live-example
AI_MODEL=gpt-4o-mini       # Default model for content drafts.
AI_MAX_TOKENS=800          # Cap output to control cost.
AI_TEMPERATURE=0.4         # Keep copy consistent and on-brand.
AI_ENABLE_GENERATION=true  # Allow draft generation.
AI_ENABLE_PERSONALIZATION=false
AI_ENABLE_OPTIMIZATION=true
AI_MANAGEMENT_CONSOLE_URL=https://console.example.com
```

## Runtime Initialization (Example)

```ts
import { getAiConfig } from '@repo/capabilities/ai'

const aiConfig = getAiConfig()

// Use aiConfig to initialize provider adapters.
console.log(aiConfig.provider, aiConfig.model)
```

## Security Notes

- Restrict API keys to server-only environments.
- Enable audit logging for AI request metadata (prompt length, latency).

## Health Checks & Fallbacks

Use `validateAiConfig` to fail fast in environments that enable AI providers.
If configuration checks fail, switch the provider to `none` and surface a
diagnostic message in your monitoring system.
