---
title: Operational Workflows
description: Standardized workflows for delivery, approvals, and release management.
---

# Operational Workflows

## Weekly Delivery Cadence

1. Monday: backlog grooming + prioritization.
2. Wednesday: client review and feedback capture.
3. Friday: release readiness and QA sign-off.

## Workflow Guardrails

- One release manager per client portfolio.
- Document every release with a change summary.
- Maintain a weekly risk register.

## Workflow Automation Example

```ts
const releaseChecklist = [
  "content-freeze",
  "qa-signoff",
  "stakeholder-approval",
  "deploy",
];

const isReleaseReady = releaseChecklist.every((step) => status[step] === "done");
// Only allow deploy when every step is complete.
```
