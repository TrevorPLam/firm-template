#!/usr/bin/env bash
set -euo pipefail

# Basic integration monitoring hook. Extend with alerting integrations.

BASE_URL="${1:-http://localhost:8089}"

curl -fsS --max-time 10 "${BASE_URL}/health" >/dev/null

echo "Integration dependencies are responding"
