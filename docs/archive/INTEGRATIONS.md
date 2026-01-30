# Integrations Suite (OFF by Default)

## Goal
Support many integrations (CRM, analytics, scheduling, email, chat)
without polluting UI code, increasing risk, or slowing every site.

## Rules
1. Integrations are adapters only. They do not control UI.
2. Integrations are never imported by ui or patterns.
3. Integrations are used only through capabilities.
4. Every integration must have:
   - a typed interface
   - an "enabled" flag defaulting to false
   - a no-op implementation when disabled
   - a clear failure mode (does nothing vs logs vs throws)

## Enabling model
- Default: everything disabled
- Enable per app via env/config (ex: ENABLE_HUBSPOT=true)
- Capabilities read config and choose adapter:
  - enabled -> real adapter
  - disabled -> no-op adapter

## Example categories
- CRM: HubSpot, Salesforce
- Analytics: GA4, Segment, PostHog
- Scheduling: Calendly, Acuity
- Email: Resend, SendGrid, Mailchimp
- Chat: Intercom, Crisp

## Policy
- Adding a new integration must not increase bundle cost when disabled.
- When enabled, load scripts lazily and only where needed.
