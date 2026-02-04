---
title: API Documentation
summary: Complete guide to the Firm Template API including OpenAPI schema and integration examples
---

# API Documentation

## Overview

The Firm Template API provides programmatic access to all platform capabilities including client management, project tracking, financial reporting, and analytics.

## Quick Start

### Base URLs

- **Local Development**: `http://localhost:8000/api/v1`
- **Production**: `https://api.firm-template.com/v1`

### Authentication

The API uses JWT (JSON Web Token) authentication. Include your token in requests:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     https://api.firm-template.com/v1/clients
```

### Getting an Access Token

```bash
# Request token
curl -X POST https://api.firm-template.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your-email@example.com",
    "password": "your-password"
  }'

# Response
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "your-email@example.com",
    "email": "your-email@example.com"
  }
}
```

## Interactive Documentation

### Swagger UI

The primary interactive API documentation is available at:

**Local**: http://localhost:8000/docs/  
**Production**: https://api.firm-template.com/docs/

Features:
- Browse all API endpoints
- Try API calls directly in browser
- View request/response schemas
- Authentication support built-in

### ReDoc

Alternative documentation interface with enhanced readability:

**Local**: http://localhost:8000/docs/redoc/  
**Production**: https://api.firm-template.com/docs/redoc/

Features:
- Clean, readable layout
- Detailed schema documentation
- Code examples in multiple languages
- Downloadable OpenAPI schema

## OpenAPI Schema

### Download

The OpenAPI 3.0 schema is available in multiple formats:

- **YAML**: [openapi.yaml](./openapi.yaml)
- **JSON**: [openapi.json](./openapi.json)

### Generate Client Libraries

Use the OpenAPI schema to generate client libraries:

```bash
# Install OpenAPI Generator
npm install -g @openapitools/openapi-generator-cli

# Generate TypeScript client
openapi-generator-cli generate \
  -i docs/api/openapi.yaml \
  -g typescript-axios \
  -o clients/typescript

# Generate Python client
openapi-generator-cli generate \
  -i docs/api/openapi.yaml \
  -g python \
  -o clients/python
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Obtain access token |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Invalidate token |
| POST | `/auth/register` | Create new account |

### Clients (CRM)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/clients` | List all clients |
| POST | `/clients` | Create new client |
| GET | `/clients/{id}` | Get client details |
| PUT | `/clients/{id}` | Update client |
| DELETE | `/clients/{id}` | Delete client |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | List all projects |
| POST | `/projects` | Create new project |
| GET | `/projects/{id}` | Get project details |
| PUT | `/projects/{id}` | Update project |
| DELETE | `/projects/{id}` | Delete project |

### Finance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/invoices` | List invoices |
| POST | `/invoices` | Create invoice |
| GET | `/invoices/{id}` | Get invoice details |
| POST | `/payments` | Record payment |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/revenue` | Revenue metrics |
| GET | `/analytics/clients` | Client metrics |
| GET | `/analytics/projects` | Project metrics |

## Rate Limiting

API requests are rate limited to prevent abuse:

- **Authenticated**: 100 requests per minute
- **Unauthenticated**: 10 requests per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Invalid request data |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Pagination

List endpoints support pagination:

```bash
GET /api/v1/clients?page=2&page_size=50
```

Response includes pagination metadata:

```json
{
  "count": 150,
  "next": "https://api.firm-template.com/v1/clients?page=3",
  "previous": "https://api.firm-template.com/v1/clients?page=1",
  "results": [...]
}
```

## Filtering and Sorting

### Filtering

Filter results using query parameters:

```bash
# Filter clients by status
GET /api/v1/clients?status=active

# Filter projects by date range
GET /api/v1/projects?created_after=2026-01-01&created_before=2026-12-31
```

### Sorting

Sort results using the `ordering` parameter:

```bash
# Sort by creation date (descending)
GET /api/v1/clients?ordering=-created_at

# Sort by name (ascending)
GET /api/v1/clients?ordering=name
```

## Webhooks

Configure webhooks to receive real-time notifications:

### Webhook Events

- `client.created`
- `client.updated`
- `project.created`
- `project.completed`
- `invoice.paid`
- `payment.received`

### Webhook Payload

```json
{
  "event": "client.created",
  "timestamp": "2026-02-04T12:00:00Z",
  "data": {
    "id": 123,
    "name": "Acme Corp",
    "status": "active"
  }
}
```

## Best Practices

### Use HTTP Status Codes

Always check HTTP status codes:
- `2xx`: Success
- `4xx`: Client error (fix request)
- `5xx`: Server error (retry with backoff)

### Implement Exponential Backoff

For failed requests, use exponential backoff:

```typescript
async function apiCallWithRetry(url: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
```

### Cache Responses

Cache responses when appropriate:

```typescript
const cacheTime = 5 * 60 * 1000; // 5 minutes

async function getCachedClients() {
  const cached = localStorage.getItem('clients');
  const cacheTimestamp = localStorage.getItem('clients_timestamp');
  
  if (cached && Date.now() - Number(cacheTimestamp) < cacheTime) {
    return JSON.parse(cached);
  }
  
  const response = await fetch('/api/v1/clients');
  const data = await response.json();
  
  localStorage.setItem('clients', JSON.stringify(data));
  localStorage.setItem('clients_timestamp', String(Date.now()));
  
  return data;
}
```

### Validate Input Client-Side

Validate data before sending to API:

```typescript
function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Use before API call
if (!validateEmail(email)) {
  throw new Error('Invalid email format');
}
```

## Development

### Local Setup

1. Start API server:
```bash
cd services/api-gateway
python manage.py runserver
```

2. Access documentation:
```
http://localhost:8000/docs/
```

### Generate OpenAPI Schema

```bash
# Generate schema
./scripts/api/generate-openapi.sh

# Output: docs/api/openapi.yaml
```

### Validate Schema

```bash
# Install validator
npm install -g @apidevtools/swagger-cli

# Validate schema
swagger-cli validate docs/api/openapi.yaml
```

### CI Integration

The OpenAPI schema is validated in CI:

```yaml
# .github/workflows/ci.yml
- name: Validate API schema
  run: |
    npm install -g @apidevtools/swagger-cli
    swagger-cli validate docs/api/openapi.yaml
```

## Support

### Resources

- **API Status**: https://status.firm-template.com
- **Developer Portal**: https://developers.firm-template.com
- **API Support**: api@firm-template.com

### Community

- **GitHub Discussions**: Discuss API features
- **Stack Overflow**: Tag questions with `firm-template-api`
- **Discord**: Join our developer community

## Changelog

### Version 1.0.0 (2026-02-04)

**Initial Release:**
- Core API endpoints for clients, projects, finance
- JWT authentication
- OpenAPI 3.0 schema
- Interactive documentation (Swagger UI, ReDoc)
- Rate limiting and pagination
- Webhook support

---

**Last Updated**: 2026-02-04  
**API Version**: 1.0.0  
**Schema Version**: OpenAPI 3.0.3
