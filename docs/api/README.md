---
title: API Documentation Overview
description: Entry point for API gateway documentation, schemas, and examples.
---

# API Documentation Overview

This section documents the API gateway and backend services that power the platform. Use the links below to navigate authentication, versioning, schemas, and integration examples.

## Quick links

- [Authentication](authentication.md)
- [Endpoints and schemas](endpoints.md)
- [OpenAPI specification](openapi.md)
- [Versioning, changelog, and migrations](versioning.md)
- [Integration examples](integration-examples.md)
- [Testing guide](testing.md)

## Documentation hosting

We serve the rendered API docs at the `/docs` endpoint in the API gateway. If you are running locally, ensure the API gateway is running and open:

```
http://localhost:3001/docs
```

> Inline note: this route should be backed by the OpenAPI spec so it stays in sync with the documented schemas.
