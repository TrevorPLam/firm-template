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
const cycleTimeDays = (release.completedAt - release.startedAt) / 86400000;
const defectDensity = defects.count / release.storyPoints;
// Use normalized metrics to compare across portfolios.
```

## Review Rituals

- Weekly ops review with delivery leads.
- Monthly process improvements tracked in retros.
