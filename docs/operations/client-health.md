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
const healthScore = (
  deliveryScore * 0.35 +
  qualityScore * 0.25 +
  stakeholderScore * 0.25 +
  changeScore * 0.15
);

const status = healthScore >= 85 ? "green" : healthScore >= 70 ? "yellow" : "red";
// Use status to trigger escalation workflows.
```

## Monitoring Cadence

- Weekly health review per portfolio.
- Monthly executive summary for strategic accounts.
