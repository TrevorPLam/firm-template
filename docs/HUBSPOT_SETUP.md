# HubSpot Setup Guide

**Task**: T-055
**Date**: 2026-01-11
**Status**: ✅ Complete

## Private App Configuration

- **App Name**: Your Dedicated Marketer Website
- **Purpose**: Sync contact form submissions to HubSpot CRM
- **Token Type**: Private App Access Token

## Required Scopes

The private app must have these scopes enabled:
- ✅ `crm.objects.contacts.read` - Read contact data
- ✅ `crm.objects.contacts.write` - Create/update contacts

## Field Mapping

Contact form submissions map to HubSpot contact properties:

| Form Field | HubSpot Property | Notes |
|------------|------------------|-------|
| `name` | `firstname` + `lastname` | Split on first space |
| `email` | `email` | Used as unique identifier |
| `phone` | `phone` | Direct mapping |
| `message` | Notes or custom field | Stored as contact note or activity |

## Environment Variables

### Development (.env.local)
Already configured in `/workspaces/your-dedicated-marketer/.env.local`

### Production (Cloudflare Pages)
Set this in Cloudflare Pages dashboard:
```
HUBSPOT_PRIVATE_APP_TOKEN=pat-na2-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```
**Note**: Replace with your actual HubSpot private app token from the HubSpot dashboard.

## Sync Behavior

1. **Upsert by email**: Contacts are created or updated based on email address
2. **Best-effort sync**: Form succeeds even if HubSpot fails (marked for retry)
3. **Metadata tracking**: Supabase stores sync status and HubSpot contact ID
4. **Suspicious leads**: Flagged submissions still sync but marked accordingly

## API Endpoints Used

- `POST /crm/v3/objects/contacts` - Create contact
- `PATCH /crm/v3/objects/contacts/{contactId}` - Update contact
- `GET /crm/v3/objects/contacts/search` - Find contact by email

## Security Notes

- ✅ Token is server-only (never exposed to browser)
- ✅ Token stored in environment variables (not in code)
- ⚠️ Rotate token if compromised
- ⚠️ Monitor API usage in HubSpot dashboard

## Next Steps

- [x] T-055: Provision HubSpot and provide token
- [ ] T-081: Implement HubSpot sync in `lib/actions.ts`
- [ ] T-082: Add tests for HubSpot sync failure handling
