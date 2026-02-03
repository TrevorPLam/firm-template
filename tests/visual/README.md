---
title: Visual regression testing
summary: Baseline guidance for adding visual snapshots and review workflows.
---

# Visual regression testing

This folder holds configuration and snapshot guidance for visual regression
coverage. Use Playwright or a hosted service (Percy/Chromatic) to capture
baseline screenshots.

## Recommended workflow

1. Add visual specs under `tests/visual`.
2. Capture screenshots locally and store baselines in your CI artifact store.
3. Review diffs as part of the pull request workflow.
