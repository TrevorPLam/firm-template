---
title: Database migration workflow
summary: Standardized migration, backup, and seeding scripts for deployments.
---

# Database migration workflow

This folder provides a consistent interface for database maintenance tasks.
Each script is environment-agnostic and expects connection settings from
environment variables.

## Required environment variables

- `DATABASE_URL` – connection string for the target database.
- `DATABASE_MIGRATIONS_DIR` – directory containing migration files.

## Common commands

```bash
./scripts/database/migrate.sh
./scripts/database/seed.sh
./scripts/database/backup.sh
./scripts/database/restore.sh backups/latest.dump
```

## Notes

Update the scripts with provider-specific tooling (Prisma, Django, Flyway, etc.)
when the backend implementation is finalized.
