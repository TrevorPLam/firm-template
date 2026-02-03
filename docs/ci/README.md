---
title: Continuous integration
summary: CI pipeline overview and required checks.
---

# Continuous integration

The CI pipeline runs linting, type checking, testing, and builds for every pull
request and for pushes to `main`. Security checks run alongside code-quality
jobs.

## Workflows

- `CI` (`.github/workflows/ci.yml`) handles lint/type-check/test/build plus
  dependency review and audits.
- `Deploy` (`.github/workflows/deploy.yml`) handles staging/production promotion.

## Required checks

Configure branch protection to require the following:

- `lint-test-build`
- `dependency-review`
- `security-audit`

The CI workflow enforces a minimum line coverage threshold (default 70%) and
uploads build/test artifacts from the `artifacts/` directory.
