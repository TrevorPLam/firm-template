---
title: Financial Forecasting & Budget Planning
description: Forecasting cadence, inputs, and variance review process.
---

# Financial Forecasting & Budget Planning

## Forecast Inputs

- Pipeline weighted revenue
- Renewal probability
- Cost of delivery per portfolio

## Forecast Model Example

```ts
const forecast = {
  baseRevenue: pipelineWeightedRevenue,
  renewals: renewalProbability * currentARR,
  deliveryCost: portfolioCost,
};

const netForecast = forecast.baseRevenue + forecast.renewals - forecast.deliveryCost;
// Use net forecast for quarterly planning.
```

## Variance Review

- Review variance monthly.
- Adjust staffing plans based on forecast deltas.
