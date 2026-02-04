---
title: Integration monitoring
summary: Health checks and alert hooks for integration test dependencies.
---

# Integration monitoring

Use `scripts/integration/monitoring-check.sh` to verify mocked services are
responding before running integration tests. Extend the script with alerting
hooks (Slack, PagerDuty) as needed.
