#!/usr/bin/env bash
set -euo pipefail

# Runs the migration tool for the configured database.
# Replace the placeholder command with your framework's CLI.

: "${DATABASE_URL:?DATABASE_URL is required}"
: "${DATABASE_MIGRATIONS_DIR:?DATABASE_MIGRATIONS_DIR is required}"

echo "Applying migrations from ${DATABASE_MIGRATIONS_DIR} to ${DATABASE_URL}"
# Example: prisma migrate deploy --schema "$DATABASE_MIGRATIONS_DIR"
