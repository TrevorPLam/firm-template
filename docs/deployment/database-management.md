---
title: Database management
summary: Environment configuration, migrations, and backup procedures.
---

# Database management

Use the scripts in `scripts/database` to keep environments consistent during
deployments. Each script relies on environment variables so teams can reuse the
same commands in local, staging, and production workflows.

## Environment configuration

Add the following values to `.env` (see `.env.example`):

- `DATABASE_URL`
- `DATABASE_MIGRATIONS_DIR`

## Migration flow

```bash
./scripts/database/migrate.sh
```

## Backups and restores

```bash
./scripts/database/backup.sh
./scripts/database/restore.sh backups/db-YYYYMMDD-HHMMSS.dump
```

## Seeding

```bash
./scripts/database/seed.sh
```
