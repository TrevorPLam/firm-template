---
title: OpenAPI Specification
description: Guidance for maintaining the OpenAPI spec and publishing /docs.
---

# OpenAPI Specification

The API gateway uses a single OpenAPI specification to drive documentation, client generation, and schema validation.

## Files

- [`openapi.yaml`](openapi.yaml): source of truth for endpoints, schemas, and auth.

## Maintenance workflow

```bash
# Regenerate the rendered docs after updating openapi.yaml.
pnpm --filter api-gateway docs:build

# Validate the specification for schema errors.
pnpm --filter api-gateway docs:lint
```

> Inline note: keep the spec in sync with versioned routes (`/v1`, `/v2`) to avoid drift.
