#!/usr/bin/env bash
set -euo pipefail

# Seeds the database with baseline or test data.
# Replace with your application's seeding command.

: "${DATABASE_URL:?DATABASE_URL is required}"

echo "Seeding database at ${DATABASE_URL}"
# Example: prisma db seed
