---
title: Integration testing
summary: Dockerized integration test harness with mocks and fixtures.
---

# Integration testing

Integration tests validate interactions between services, adapters, and
third-party dependencies.

## Start dependencies

```bash
docker compose -f docker-compose.test.yml up -d
```

## Mock services

WireMock stubs live in `tests/integration/mocks/wiremock`. Add mappings under
`mappings/` and response bodies under `__files/`.

## Conventions

- Keep contract tests in `tests/integration/contracts`.
- Use environment variables to swap between mock and live services.
- Run `scripts/integration/monitoring-check.sh` before long test suites.
