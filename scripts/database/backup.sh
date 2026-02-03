#!/usr/bin/env bash
set -euo pipefail

# Creates a backup snapshot using pg_dump-compatible tooling.
# Update this script for your database provider.

: "${DATABASE_URL:?DATABASE_URL is required}"

BACKUP_DIR="${1:-backups}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_FILE="${BACKUP_DIR}/db-${TIMESTAMP}.dump"

mkdir -p "$BACKUP_DIR"

echo "Creating backup at ${BACKUP_FILE}"
# Example: pg_dump --format=custom --file "$BACKUP_FILE" "$DATABASE_URL"
