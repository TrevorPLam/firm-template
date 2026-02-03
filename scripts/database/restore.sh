#!/usr/bin/env bash
set -euo pipefail

# Restores a backup snapshot into the configured database.
# Replace the placeholder with your database restore command.

: "${DATABASE_URL:?DATABASE_URL is required}"

BACKUP_FILE="${1:-}"

if [[ -z "$BACKUP_FILE" ]]; then
  echo "Usage: ./scripts/database/restore.sh <backup-file>" >&2
  exit 1
fi

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "Error: Backup file not found at '${BACKUP_FILE}'" >&2
  exit 1
fi

echo "Restoring ${BACKUP_FILE} into ${DATABASE_URL}"
# Example: pg_restore --clean --no-owner --dbname "$DATABASE_URL" "$BACKUP_FILE"
