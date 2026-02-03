---
title: Process Automation Overview
description: Automation priorities and workflow opportunities for scale.
---

# Process Automation Overview

## Automation Priorities

1. Release checklist validation.
2. Client health scoring.
3. Weekly reporting and summaries.

## Example Automation Rule

```ts
const automationRules = [
  {
    name: "auto-flag-risk",
    when: (client) => client.healthScore < 70,
    action: () => createRiskTicket(), // Create a ticket when health is poor.
  },
];
```
