---
title: Operational Analytics
description: Metrics for throughput, efficiency, and operational health.
---

# Operational Analytics

## Operational Metrics

- Cycle time per release
- QA defect density
- Blocker resolution time

## Operational Metric Examples

```ts
const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;
const cycleTimeDays = (release.completedAt - release.startedAt) / MILLISECONDS_IN_A_DAY;
const defectDensity = defects.count / release.storyPoints;
// Use normalized metrics to compare across portfolios.
```

## Review Rituals

- Weekly ops review with delivery leads.
- Monthly process improvements tracked in retros.
