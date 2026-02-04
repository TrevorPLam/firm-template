---
title: Service-Level Agreements (SLAs)
description: SLA targets for delivery, response times, and uptime.
---

# Service-Level Agreements (SLAs)

## Core SLA Targets

| Category | Target | Notes |
| --- | --- | --- |
| First response | < 4 business hours | Account team coverage |
| Critical fix | < 24 hours | Severity 1 incidents |
| Release cadence | Weekly | Portfolio-level updates |

## Escalation Protocol

1. Severity 1: alert delivery + exec sponsor.
2. Severity 2: alert delivery lead + client lead.
3. Severity 3: log in backlog for next sprint.

## SLA Tracking Example

```ts
const sla = {
  responseHours: 4,
  criticalFixHours: 24,
  weeklyRelease: true,
};

if (ticket.severity === 1 && ticket.ageHours > sla.criticalFixHours) {
  notifyOnCall("SLA breach detected"); // Escalate immediately.
}
```
