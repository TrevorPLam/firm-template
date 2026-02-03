---
title: Deployment pipeline
summary: Staging and production promotion workflow.
---

# Deployment pipeline

Deployments are triggered manually via the `Deploy` workflow to support
controlled promotion between environments.

## Triggering a deployment

1. Open the GitHub Actions tab.
2. Select the `Deploy` workflow.
3. Choose `staging` or `production`, then supply the ref to deploy.

## Smoke tests

Smoke tests run before deployment. Update `scripts/deploy/smoke-test.sh` with
checks that match your hosting provider and health endpoints.

## Blue-green and rollback

Set `DEPLOY_STRATEGY=blue-green` to align with blue-green release processes and
use `scripts/deploy/rollback.sh` for rollback procedures.
