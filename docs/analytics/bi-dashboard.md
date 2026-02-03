---
title: Business Intelligence Dashboard
description: Dashboard requirements, data sources, and visualization standards.
---

# Business Intelligence Dashboard

## Core Dashboard Sections

- Portfolio health summary
- Delivery velocity trends
- Client satisfaction indicators
- Revenue and margin overview

## Data Source Inventory

| Source | Metric Examples | Owner |
| --- | --- | --- |
| CRM | Pipeline health | RevOps |
| Project tracker | Delivery velocity | PMO |
| Support | Incident volume | Support |

## Dashboard Filter Model

```ts
const dashboardFilters = {
  portfolio: "all",
  timeRange: "last-90-days",
  region: "north-america",
};
// Keep filters consistent across widgets.
```
