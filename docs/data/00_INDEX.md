# Data Layer Documentation

## Overview

This index covers data storage, schema management, migrations, and data invariants in the platform.

**Link back**: [Architecture Documentation](../architecture/00_INDEX.md)

## Current State

The platform uses **multiple data storage approaches**:

1. **PostgreSQL** (via API Gateway)
   - Backend database for API gateway service
   - Managed via Django ORM
   - Migrations in `/services/api-gateway/backend/migrations/` (if exists)

2. **Supabase** (optional integration)
   - PostgreSQL-based backend-as-a-service
   - Used for lead capture and client-specific data
   - Configured via `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

3. **CMS** (optional integration)
   - External content storage (Sanity, Contentful, etc.)
   - Configured via `CMS_PROVIDER`, `CMS_PROJECT_ID`, etc.
   - Content fetched via CMS APIs

## Storage Types

| Storage | Use Case | Configuration |
|---------|----------|---------------|
| PostgreSQL (API Gateway) | Backend data, user accounts, API data | `DATABASE_URL` in `.env` |
| Supabase | Lead submissions, client-specific tables | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| CMS | Marketing content, blog posts, case studies | `CMS_PROVIDER`, `CMS_API_TOKEN` |
| Redis (Upstash) | Rate limiting, session caching | `UPSTASH_REDIS_REST_URL` |

## Schema Location

### API Gateway Schema
**Location**: Django models in `/services/api-gateway/backend/modules/*/models.py` (if exists)  
**Migrations**: `/services/api-gateway/backend/migrations/` (Django migrations)  
**Management**: Django `manage.py` commands:
```bash
python manage.py makemigrations
python manage.py migrate
```

### Supabase Schema
**Location**: Managed in Supabase dashboard or via SQL migrations  
**Access**: Via Supabase client SDK in capabilities  
**Evidence**: `/packages/capabilities/src/lead-capture.ts` (Supabase usage)

### CMS Schema
**Location**: Defined in CMS dashboard (Sanity Studio, Contentful, etc.)  
**Access**: Via CMS SDK in capabilities  
**Evidence**: `/packages/capabilities/src/cms/` (CMS integration)

## Migrations

### Django Migrations (API Gateway)
```bash
# Create migration
cd services/api-gateway/backend
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# View migration status
python manage.py showmigrations
```

### Supabase Migrations
- Managed via Supabase CLI or dashboard
- SQL migrations stored externally (not in this repo by default)
- See Supabase docs for migration workflow

### CMS Migrations
- Schema changes made in CMS dashboard
- No local migrations needed
- Content types versioned by CMS provider

## Data Invariants

### Security Invariants (Critical)
1. **No sensitive data in logs**: Redaction enforced (see `/docs/SECURITY.md`)
2. **Multi-tenant scoping**: All data access scoped to tenant/client (if applicable)
3. **No auth bypass in production**: Production must enforce authentication

### Data Quality Invariants
1. **Email validation**: All email fields must pass RFC 5322 validation
2. **Lead deduplication**: Prevent duplicate lead submissions (same email within time window)
3. **Required fields**: Forms must enforce required fields before submission

### Performance Invariants
1. **Query limits**: Paginate results (max 100 items per request)
2. **Rate limiting**: Enforce rate limits on write operations (via Redis)
3. **Connection pooling**: Database connections pooled for efficiency

## Data Access Patterns

### Read Paths
```
Next.js App → API Gateway → Database → Response
Next.js App → Supabase SDK → Supabase DB → Response
Next.js App → CMS SDK → CMS API → Content
```

### Write Paths
```
Form Submit → API Route → Lead Capture Capability → Integration → Database/CMS
Form Submit → API Route → API Gateway → Database → Response
```

## Evidence

**Configuration**:
- Environment template: `/.env.example` (all database/storage configs)
- API Gateway: `/services/api-gateway/backend/`
- Lead Capture: `/packages/capabilities/src/lead-capture.ts`
- CMS Integration: `/packages/capabilities/src/cms/`

**Documentation**:
- Security: `/docs/SECURITY.md`
- API endpoints: `/docs/api/endpoints.md`
- Integrations: `/docs/integrations/00_INDEX.md`

## Related Topics

- **API Gateway**: [../api/00_INDEX.md](../api/00_INDEX.md)
- **Integrations**: [../integrations/00_INDEX.md](../integrations/00_INDEX.md)
- **Lead Capture Flow**: [../architecture/40_KEY_FLOWS.md#flow-2-lead-capture-form-submission](../architecture/40_KEY_FLOWS.md#flow-2-lead-capture-form-submission)
- **Security**: [../SECURITY.md](../SECURITY.md)

## Future Enhancements

Potential future additions (not yet implemented):
- Centralized migration management
- Data versioning and audit logs
- Automated backup/restore procedures
- Data retention policies

*Note: This is a living document. Update when storage patterns change.*

---

**Back to**: [Architecture Index](../architecture/00_INDEX.md)
