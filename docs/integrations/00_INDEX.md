# Integrations Documentation Index

## Overview

This platform uses an **adapter pattern** for third-party integrations. All integrations are **disabled by default** (no-op adapters) and must be explicitly enabled via configuration.

**Link back**: [Architecture Documentation](../architecture/00_INDEX.md)

## Integration Philosophy

### Core Principles
1. **No-op by default**: Integrations do nothing unless explicitly enabled
2. **Isolated adapters**: Integration code never imported directly by UI/patterns
3. **Capability layer**: Only capabilities import and use integrations
4. **Config-driven**: Enable integrations via environment variables

### Architecture Pattern
```
UI/Patterns (never imports integrations)
    ↓
Capabilities (imports integrations)
    ↓
Integration Adapters (isolated, no-op by default)
    ↓
External APIs (HubSpot, Google Analytics, etc.)
```

**Evidence**: 
- Platform rules: `/docs/PLATFORM.md` (integrations section)
- Integration layer: `/packages/integrations/src/index.ts`

## Available Integrations

### 1. Marketing & CRM

| Integration | Purpose | Status | Config |
|------------|---------|--------|--------|
| **HubSpot** | CRM, lead pipeline | Optional | `HUBSPOT_PRIVATE_APP_TOKEN` |
| **Supabase** | Database, lead storage | Optional | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |

**Evidence**: 
- Lead capture: `/packages/capabilities/src/lead-capture.ts`
- Env template: `/.env.example`

### 2. Analytics

| Integration | Purpose | Status | Config |
|------------|---------|--------|--------|
| **Google Analytics** | Web analytics | Optional | `NEXT_PUBLIC_ANALYTICS_ID` |
| **Segment** | Analytics hub | Optional | `NEXT_PUBLIC_SEGMENT_WRITE_KEY` |

**Evidence**: 
- Analytics capability: `/packages/capabilities/src/analytics.ts`
- Env template: `/.env.example`

### 3. Content Management

| Integration | Purpose | Status | Config |
|------------|---------|--------|--------|
| **Sanity CMS** | Headless CMS | Optional | `CMS_PROVIDER=sanity`, `CMS_PROJECT_ID`, `CMS_API_TOKEN` |
| **Contentful** | Headless CMS | Optional | `CMS_PROVIDER=contentful`, `CMS_PROJECT_ID`, `CMS_API_TOKEN` |

**Evidence**: 
- CMS capability: `/packages/capabilities/src/cms/`
- Env template: `/.env.example` (CMS_* variables)

### 4. Email

| Integration | Purpose | Status | Config |
|------------|---------|--------|--------|
| **Resend** | Transactional email | Optional | `EMAIL_PROVIDER=resend`, `EMAIL_API_KEY` |
| **SendGrid** | Email delivery | Optional | `EMAIL_PROVIDER=sendgrid`, `EMAIL_API_KEY` |

**Evidence**: 
- Email config: `/.env.example` (EMAIL_* variables)

### 5. Scheduling

| Integration | Purpose | Status | Config |
|------------|---------|--------|--------|
| **Calendly** | Meeting scheduling | Optional | `SCHEDULING_PROVIDER=calendly`, `CALENDLY_URL` |
| **Cal.com** | Open-source scheduling | Optional | `SCHEDULING_PROVIDER=calcom`, `CALCOM_USERNAME` |

**Evidence**: 
- Scheduling config: `/.env.example` (SCHEDULING_* variables)

### 6. AI Services

| Integration | Purpose | Status | Config |
|------------|---------|--------|--------|
| **OpenAI** | GPT models | Optional | `AI_PROVIDER=openai`, `AI_API_KEY` |
| **Anthropic** | Claude models | Optional | `AI_PROVIDER=anthropic`, `AI_API_KEY` |

**Evidence**: 
- AI capability: `/packages/capabilities/src/ai/`
- Env template: `/.env.example` (AI_* variables)
- AI docs: `/docs/ai/`

### 7. Realtime

| Integration | Purpose | Status | Config |
|------------|---------|--------|--------|
| **WebSocket server** | Realtime connections | Optional | `REALTIME_PROVIDER`, `REALTIME_SERVER_URL` |
| **Ably** | Managed realtime | Optional | `REALTIME_PROVIDER=ably`, `REALTIME_API_KEY` |

**Evidence**: 
- Realtime capability: `/packages/capabilities/src/realtime/`
- Env template: `/.env.example` (REALTIME_* variables)

### 8. Blockchain

| Integration | Purpose | Status | Config |
|------------|---------|--------|--------|
| **Ethereum** | Smart contracts | Optional | Custom config in capability |
| **Solana** | Blockchain integration | Optional | Custom config in capability |

**Evidence**: 
- Blockchain capability: `/packages/capabilities/src/blockchain/`

## Integration Adapter Pattern

### No-Op Adapter (Default)
```typescript
// packages/integrations/src/index.ts
export const hubspotAdapter = {
  submitLead: async (data: LeadData) => {
    // No-op: returns success without doing anything
    console.log('[HubSpot] Integration disabled (no-op)');
    return { success: true };
  }
};
```

### Active Adapter (When Enabled)
```typescript
// packages/integrations/src/index.ts (when configured)
import { Client } from '@hubspot/api-client';

export const hubspotAdapter = {
  submitLead: async (data: LeadData) => {
    if (!process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
      throw new Error('HubSpot not configured');
    }
    
    const client = new Client({ accessToken: process.env.HUBSPOT_PRIVATE_APP_TOKEN });
    await client.crm.contacts.basicApi.create({ properties: data });
    
    return { success: true };
  }
};
```

**Evidence**: 
- Integration package: `/packages/integrations/src/index.ts`
- Lead capture usage: `/packages/capabilities/src/lead-capture.ts`

## Webhook Patterns

### Incoming Webhooks
External services send events to platform:

**Pattern**:
```
External Service → POST /app/api/webhooks/<provider> → Capability handler
```

**Example**: HubSpot sends contact updates to `/app/api/webhooks/hubspot`

**Evidence**: 
- Webhook endpoints: `/apps/*/app/api/webhooks/*/route.ts` (if exists)

### Outgoing Webhooks
Platform sends events to external services:

**Pattern**:
```
Platform event → Capability → Integration adapter → External webhook URL
```

**Example**: Lead submitted → Analytics capability → Google Analytics event

**Evidence**: 
- Analytics capability: `/packages/capabilities/src/analytics.ts` (outgoing events)

## Secrets and Keys Handling

### Environment Variables
**Never commit secrets to code**. All API keys and tokens in environment variables.

**Storage**:
- **Local**: `.env` file (gitignored)
- **Production**: Environment variables in deployment platform (Vercel, AWS, etc.)

**Template**: `/.env.example` lists all required variables

### Secret Types

| Type | Scope | Example Prefix |
|------|-------|----------------|
| Public keys | Browser + Server | `NEXT_PUBLIC_*` |
| Private API keys | Server-only | `HUBSPOT_*`, `SUPABASE_*`, `AI_API_KEY` |
| Database URLs | Server-only | `DATABASE_URL`, `REDIS_URL` |

**Evidence**: 
- Env template: `/.env.example`
- Security docs: `/docs/SECURITY.md`

## Configuration Guide

### Enable Integration: Step-by-Step

1. **Choose integration** (e.g., HubSpot)
2. **Get API credentials** from provider dashboard
3. **Add to `.env`**:
   ```bash
   HUBSPOT_PRIVATE_APP_TOKEN=your_token_here
   ```
4. **Restart app**:
   ```bash
   pnpm --filter @repo/web dev
   ```
5. **Test integration**: Submit form, check logs for success/errors
6. **Verify in provider dashboard**: Check that data arrived

### Disable Integration

1. **Remove from `.env`** or set to empty:
   ```bash
   # HUBSPOT_PRIVATE_APP_TOKEN=
   ```
2. **Restart app**
3. Integration automatically falls back to no-op adapter

**Evidence**: 
- Setup guide: `/docs/CONTRIBUTING.md` (environment setup)
- Env template: `/.env.example`

## Testing Integrations

### Local Testing (With Real APIs)
```bash
# Add real credentials to .env
echo "HUBSPOT_PRIVATE_APP_TOKEN=your_token" >> .env

# Start app
pnpm --filter @repo/web dev

# Test form submission
# Check HubSpot dashboard for new contact
```

### Testing (Without Real APIs - No-Op)
```bash
# Remove credentials from .env or leave empty
# Integration falls back to no-op (no external calls)

# Start app
pnpm --filter @repo/web dev

# Test form submission
# Check logs for "[Integration] disabled (no-op)" messages
```

### Mocking in Tests
```typescript
// Mock integration adapter in tests
jest.mock('@repo/integrations', () => ({
  hubspotAdapter: {
    submitLead: jest.fn().mockResolvedValue({ success: true })
  }
}));
```

**Evidence**: 
- Testing docs: `/docs/testing/`
- Test examples: `/packages/*/tests/` (if exists)

## Rate Limits and Quotas

Each integration has its own rate limits:

| Provider | Rate Limit | Quota |
|----------|------------|-------|
| HubSpot | 100 req/10 sec (free tier) | Depends on plan |
| Google Analytics | 20 hits/sec per user | Unlimited hits |
| Supabase | Based on plan | Varies by tier |
| Resend | 100 emails/day (free) | Depends on plan |

**Best Practices**:
- Implement retry logic with exponential backoff
- Respect rate limit headers from APIs
- Monitor usage in provider dashboards

**Evidence**: Provider documentation (external)

## Security Considerations

### API Key Rotation
- Rotate keys regularly (quarterly or when compromised)
- Update `.env` and restart apps
- Remove old keys from provider dashboards

### Webhook Verification
- Verify webhook signatures from providers
- Reject unsigned/invalid webhooks
- Use webhook secrets from provider settings

### Data Privacy
- Never log API keys or tokens
- Redact sensitive data in logs (see `/docs/SECURITY.md`)
- Respect user consent for analytics tracking

**Evidence**: 
- Security docs: `/docs/SECURITY.md`
- Security review triggers: `/docs/security-review-triggers.md`

## Related Documentation

- **Integration Guide (AI)**: [../integrations/ai-api.md](ai-api.md)
- **Capabilities Documentation**: [../capabilities/](../capabilities/)
- **Lead Capture Flow**: [../architecture/40_KEY_FLOWS.md#flow-2-lead-capture-form-submission](../architecture/40_KEY_FLOWS.md#flow-2-lead-capture-form-submission)
- **Analytics Flow**: [../architecture/40_KEY_FLOWS.md#flow-4-analytics-event-tracking](../architecture/40_KEY_FLOWS.md#flow-4-analytics-event-tracking)
- **Security Guidelines**: [../SECURITY.md](../SECURITY.md)
- **Environment Setup**: [../../CONTRIBUTING.md](../../CONTRIBUTING.md)

## Adding New Integrations

### Checklist
1. **Create adapter** in `/packages/integrations/src/`
2. **No-op by default**: Adapter does nothing if not configured
3. **Add config vars** to `/.env.example`
4. **Create capability** (or extend existing) in `/packages/capabilities/src/`
5. **Document** in this index
6. **Add tests** for no-op and active modes
7. **Update security docs** if handling sensitive data

### Example: Add Slack Integration
```typescript
// packages/integrations/src/slack.ts
export const slackAdapter = {
  postMessage: async (message: string) => {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.log('[Slack] Integration disabled (no-op)');
      return { success: true };
    }
    
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message })
    });
    
    return { success: true };
  }
};
```

**Evidence**: 
- Integration package: `/packages/integrations/src/`
- Capability usage: `/packages/capabilities/src/`

---

**Back to**: [Architecture Index](../architecture/00_INDEX.md)
