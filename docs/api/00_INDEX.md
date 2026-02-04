# API Documentation Index

## Overview

The Firm Template platform includes a **Django-based API Gateway** that provides backend REST APIs for applications.

**Link back**: [Architecture Documentation](../architecture/00_INDEX.md)

## API Organization

### API Gateway Structure
**Location**: `/services/api-gateway/backend/`  
**Technology**: Django + Python  
**Port**: 8000 (development)

The API gateway provides:
- RESTful endpoints for data access
- JWT-based authentication and authorization
- Database access layer (PostgreSQL)
- Rate limiting and request validation

### API Versioning

**Current Version**: v1  
**URL Pattern**: `/api/v1/<endpoint>`

**Versioning Strategy**:
- Major versions in URL path (`/api/v1/`, `/api/v2/`)
- Breaking changes trigger new major version
- Backward compatibility maintained within major version
- Deprecation notices given 6 months before removal

**Evidence**: `/docs/api/versioning.md`

## Authentication Model

### JWT Authentication
The API uses **JSON Web Tokens (JWT)** for authentication.

**Token Types**:
1. **Access Token**: Short-lived (15 minutes), used for API requests
2. **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

**Auth Flow**:
```
1. POST /api/v1/auth/login → returns access + refresh tokens
2. Include access token in requests: Authorization: Bearer <token>
3. When access token expires, POST /api/v1/auth/refresh → new access token
```

**Evidence**: 
- Auth endpoints: `/docs/api/authentication.md`
- API README: `/docs/api/README.md` (authentication section)

### Authorization
- **Role-Based Access Control (RBAC)**: Users assigned roles (admin, user, etc.)
- **Permission Checks**: Each endpoint validates user permissions
- **Multi-Tenant Scoping**: Data access scoped to user's tenant/organization

## Error Conventions

### Standard Error Response
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [
      {
        "field": "field_name",
        "message": "Field-specific error"
      }
    ]
  }
}
```

### HTTP Status Codes

| Status | Usage |
|--------|-------|
| 200 OK | Successful GET, PUT, PATCH requests |
| 201 Created | Successful POST (resource created) |
| 204 No Content | Successful DELETE |
| 400 Bad Request | Invalid request syntax |
| 401 Unauthorized | Missing or invalid authentication |
| 403 Forbidden | Insufficient permissions |
| 404 Not Found | Resource doesn't exist |
| 422 Unprocessable Entity | Validation errors |
| 429 Too Many Requests | Rate limit exceeded |
| 500 Internal Server Error | Server error |

### Common Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| `UNAUTHORIZED` | 401 | Missing/invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Invalid input data |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

**Evidence**: `/docs/api/README.md` (error handling section)

## API Endpoints

### Core Endpoints

| Category | Base Path | Description |
|----------|-----------|-------------|
| Authentication | `/api/v1/auth/*` | Login, logout, token refresh |
| Clients (CRM) | `/api/v1/clients/*` | Client management |
| Projects | `/api/v1/projects/*` | Project tracking |
| Finance | `/api/v1/invoices/*`, `/api/v1/payments/*` | Invoicing and payments |
| Analytics | `/api/v1/analytics/*` | Metrics and reporting |

**Full endpoint list**: See [README.md](README.md) for detailed endpoint documentation.

**Evidence**: 
- Endpoints doc: `/docs/api/endpoints.md`
- API README: `/docs/api/README.md` (API endpoints section)

## OpenAPI Specification

**Location**: `/docs/api/openapi.yaml`  
**Format**: OpenAPI 3.0.3

### Interactive Documentation
- **Swagger UI**: `http://localhost:8000/docs/` (browse and test endpoints)
- **ReDoc**: `http://localhost:8000/docs/redoc/` (readable documentation)

### Client Generation
Use OpenAPI schema to generate client libraries:
```bash
# Install generator
npm install -g @openapitools/openapi-generator-cli

# Generate TypeScript client
openapi-generator-cli generate \
  -i docs/api/openapi.yaml \
  -g typescript-axios \
  -o clients/typescript
```

**Evidence**: `/docs/api/openapi.yaml`, `/docs/api/README.md` (OpenAPI section)

## Rate Limiting

**Limits**:
- Authenticated requests: 100 requests/minute
- Unauthenticated requests: 10 requests/minute

**Rate Limit Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

**Implementation**: Redis (Upstash) for rate limit tracking

**Evidence**: 
- Rate limit config: `UPSTASH_REDIS_REST_URL` in `/.env.example`
- API README: `/docs/api/README.md` (rate limiting section)

## Pagination

**Query Parameters**:
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 30, max: 100)

**Response Format**:
```json
{
  "count": 150,
  "next": "https://api.example.com/clients?page=3",
  "previous": "https://api.example.com/clients?page=1",
  "results": [...]
}
```

**Evidence**: `/docs/api/README.md` (pagination section)

## Integration Examples

### From Next.js App
```typescript
// apps/web/lib/api-client.ts (example)
const API_BASE_URL = process.env.API_GATEWAY_URL || 'http://localhost:8000/api/v1';

async function fetchClients(token: string) {
  const response = await fetch(`${API_BASE_URL}/clients`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}
```

**Evidence**: `/docs/api/integration-examples.md`, `/apps/*/lib/api-client.ts` (if exists)

## Testing API

### Local Development
```bash
# Start API gateway
docker-compose up api-gateway

# Access Swagger UI
open http://localhost:8000/docs/

# Test endpoint with curl
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "password": "test"}'
```

### Automated Tests
```bash
# Run API tests
cd services/api-gateway/backend
python manage.py test
```

**Evidence**: 
- Testing doc: `/docs/api/testing.md`
- Test location: `/services/api-gateway/backend/tests/` (if exists)

## Security

### HTTPS Only (Production)
- All production API traffic over HTTPS
- HSTS headers enforced

### CORS Configuration
- Configured for allowed origins only
- No wildcard (*) in production

### Input Validation
- All inputs validated and sanitized
- SQL injection prevented via ORM (no raw SQL)
- XSS prevention via output escaping

**Evidence**: `/docs/SECURITY.md`, `/docs/api/authentication.md`

## Related Documentation

- **Detailed API Reference**: [README.md](README.md)
- **Authentication Guide**: [authentication.md](authentication.md)
- **Endpoints Reference**: [endpoints.md](endpoints.md)
- **Integration Examples**: [integration-examples.md](integration-examples.md)
- **OpenAPI Spec**: [openapi.yaml](openapi.yaml)
- **Testing Guide**: [testing.md](testing.md)
- **Versioning Strategy**: [versioning.md](versioning.md)
- **Architecture Overview**: [../architecture/10_OVERVIEW.md](../architecture/10_OVERVIEW.md)
- **Key Flows (API calls)**: [../architecture/40_KEY_FLOWS.md#flow-5-api-gateway-request-backend-data-access](../architecture/40_KEY_FLOWS.md#flow-5-api-gateway-request-backend-data-access)

## Maintenance

### When to Update
- New endpoint added → Update openapi.yaml, endpoints.md
- Auth model changes → Update authentication.md
- Error codes added → Update README.md error section
- Version increment → Update versioning.md

### OpenAPI Schema Generation
```bash
# Generate schema from Django
cd services/api-gateway/backend
python manage.py spectacular --file ../../docs/api/openapi.yaml
```

---

**Back to**: [Architecture Index](../architecture/00_INDEX.md)
