#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENT="${1:-staging}"

# Placeholder rollback procedure for the template.
# Replace this with provider-specific rollback commands.

echo "Rolling back the last deployment in ${ENVIRONMENT}"
# Example: vercel rollback --env "$ENVIRONMENT"
