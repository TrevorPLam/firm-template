---
title: API Endpoints and Schemas
description: Catalog of API endpoints with request and response schemas.
---

# API Endpoints and Schemas

This catalog summarizes the most common endpoints. The OpenAPI spec is the source of truth for exact schemas.

## Forms

### `GET /v1/forms`

**Description:** List all available forms.

**Response schema (excerpt):**

```json
{
  "data": [
    {
      "id": "contact",
      "name": "Contact form",
      "fields": [
        { "id": "email", "type": "email", "required": true }
      ]
    }
  ]
}
```

### `POST /v1/forms/submit`

**Description:** Submit a form payload.

**Request schema (excerpt):**

```json
{
  "formId": "contact",
  "fields": {
    "name": "Alex Doe",
    "email": "alex@example.com"
  }
}
```

> Inline note: keep request/response samples in sync with `openapi.yaml` during updates.
