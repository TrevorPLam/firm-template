---
title: Reporting & Alerting
description: Automated reporting and alerting workflows for ops and success teams.
---

# Reporting & Alerting

## Reporting Schedule

- Weekly portfolio digest (delivery + QA).
- Monthly exec summary (financial + success metrics).

## Alerting Thresholds

| Metric | Threshold | Action |
| --- | --- | --- |
| Health score | < 70 | Trigger escalation |
| SLA breach | Any | Notify ops lead |

## Alert Payload Example

```json
{
  "type": "sla-breach",
  "clientId": "northwind",
  "severity": "critical",
  "owner": "ops-lead"
}
```

> Redact client data before sending alerts to external channels.
