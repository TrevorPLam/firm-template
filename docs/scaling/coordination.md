---
title: Cross-Functional Coordination
description: Operating model for cross-team handoffs and escalation.
---

# Cross-Functional Coordination

## Coordination Model

- **Pod-level alignment:** delivery + QA + account leads.
- **Shared planning:** weekly cross-functional backlog sync.
- **Escalation path:** pod lead → ops lead → exec sponsor.

## Coordination Checklist

- Define handoff owners in the release plan.
- Confirm SLAs for approvals and content handoffs.
- Align on launch windows and comms plan.

## Escalation Example

```ts
const escalationMatrix = {
  severity1: ["podLead", "opsLead", "execSponsor"],
  severity2: ["podLead", "opsLead"],
};

routeEscalation(ticket.severity, escalationMatrix); // Ensure consistent routing.
```
