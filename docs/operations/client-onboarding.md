---
title: Client Onboarding & Scaling Process
description: Step-by-step onboarding flow with scale readiness checkpoints.
---

# Client Onboarding & Scaling Process

## Onboarding Phases

1. **Discovery:** capture goals, timelines, and governance needs.
2. **Implementation:** configure template, integrations, and environments.
3. **Launch readiness:** QA, content freeze, and stakeholder sign-off.
4. **Scale handoff:** transition to ongoing operations.

## Intake Checklist

- Confirm primary stakeholders and escalation contacts.
- Collect brand assets and content inventories.
- Validate compliance requirements (SOC2, GDPR, etc.).

## Scale Readiness Criteria

| Signal | Target | Owner |
| --- | --- | --- |
| First launch cycle time | < 30 days | Delivery lead |
| Rework rate | < 10% | QA lead |
| Stakeholder response | < 24 hrs | Account lead |

## Automation Starter Kit

```ts
const onboardingChecklist = {
  clientId,
  steps: ["discovery", "implementation", "launch-readiness"],
  status: "in-progress", // Track readiness before scale handoff.
};
```
