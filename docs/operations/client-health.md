---
title: Client Health Monitoring
description: Health scoring and monitoring cadence for client portfolios.
---

# Client Health Monitoring

## Health Score Inputs

- Delivery timeliness
- QA defect rate
- Stakeholder satisfaction
- Change request volume

## Health Score Model

```ts
const WEIGHTS = {
  DELIVERY: 0.35,
  QUALITY: 0.25,
  STAKEHOLDER: 0.25,
  CHANGE_REQUESTS: 0.15,
};

const healthScore = (
  deliveryScore * WEIGHTS.DELIVERY +
  qualityScore * WEIGHTS.QUALITY +
  stakeholderScore * WEIGHTS.STAKEHOLDER +
  changeScore * WEIGHTS.CHANGE_REQUESTS
);

const status = healthScore >= 85 ? "green" : healthScore >= 70 ? "yellow" : "red";
// Use status to trigger escalation workflows.
```

## Monitoring Cadence

- Weekly health review per portfolio.
- Monthly executive summary for strategic accounts.
