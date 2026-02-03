---
title: API Authentication
description: Authentication and authorization examples for the API gateway.
---

# API Authentication

All API requests must be authenticated via a bearer token. The API gateway validates tokens and applies role-based access controls.

## Required headers

```http
# The Authorization header carries the bearer token.
Authorization: Bearer <token>

# The client request ID helps trace end-to-end requests.
X-Request-Id: <uuid>
```

## Example: authenticated request

```bash
# Use an environment variable so secrets stay out of shell history.
API_TOKEN="${API_TOKEN}"

curl -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  https://api.example.com/v1/forms
```

## Authorization guidance

- **Admin**: full CRUD across resources.
- **Editor**: create/update content and submissions.
- **Viewer**: read-only access.

> Inline note: keep scopes aligned to capabilities to avoid leaking integrations details into UI layers.
