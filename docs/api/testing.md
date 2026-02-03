---
title: API Testing Guide
description: How to validate API endpoints and schemas.
---

# API Testing Guide

Use these steps to validate API endpoints and keep documentation accurate.

## Local testing

```bash
# Run API gateway tests.
pnpm --filter api-gateway test

# Validate OpenAPI schemas against route handlers.
pnpm --filter api-gateway test:schemas
```

## Example: curl sanity checks

```bash
# Inline note: always include auth headers when testing protected routes.
API_TOKEN="${API_TOKEN}"

curl -H "Authorization: Bearer ${API_TOKEN}" \
  https://api.example.com/v1/forms
```

## Documentation update checklist

- [ ] Update `openapi.yaml` with new routes
- [ ] Add request/response examples to `endpoints.md`
- [ ] Link changelog entries to migrations when breaking changes ship
