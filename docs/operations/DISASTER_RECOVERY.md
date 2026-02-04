<!--
META: Disaster Recovery and Backup Systems
AUTHOR: Platform Team
CREATED: 2026-02-04
UPDATED: 2026-02-04
VERSION: 1.0.0
STATUS: Production
PURPOSE: Complete disaster recovery procedures and backup system documentation
KEYWORDS: disaster-recovery, backup, restore, business-continuity, DR
-->

# Disaster Recovery and Backup Systems

## Overview

Comprehensive disaster recovery procedures, automated backup systems, and business continuity planning for production operations.

## Quick Start

### Create Backup

```bash
# Full backup with compression and encryption
./scripts/backup/backup-system.sh --type all --compress --encrypt --notify

# Database only
./scripts/backup/backup-system.sh --type database --compress
```

### Disaster Recovery

```bash
# Verify backup integrity
./scripts/recovery/disaster-recovery.sh --verify --timestamp 20260204_120000

# Dry run (preview recovery)
./scripts/recovery/disaster-recovery.sh --dry-run --timestamp 20260204_120000

# Full recovery
./scripts/recovery/disaster-recovery.sh --type all --timestamp 20260204_120000
```

## Features

- **Automated Backups**: Database, files, and configuration backups
- **Compression & Encryption**: Secure backup storage
- **S3 Integration**: Cloud backup storage
- **Retention Management**: Automatic cleanup of old backups
- **Disaster Recovery**: Complete system restoration
- **Health Monitoring**: Infrastructure health checks
- **Notifications**: Email and Slack alerts

## Backup System

### Backup Types

1. **Database Backups** (`--type database`)
   - PostgreSQL database dumps
   - Incremental and full backups
   - Compressed SQL files

2. **File Backups** (`--type files`)
   - Application code and assets
   - Excludes node_modules, build artifacts
   - Tar archives

3. **Configuration Backups** (`--type config`)
   - Environment files
   - Package configurations
   - Docker compose files

4. **Full Backup** (`--type all`)
   - All of the above

### Backup Schedule

| Type | Frequency | Retention |
|------|-----------|-----------|
| Database | Every 6 hours | 30 days |
| Files | Daily | 7 days |
| Config | Daily | 30 days |
| Full | Weekly | 90 days |

### Backup Storage

**Local**: `/var/backups/platform/`
- `database/` - Database backups
- `files/` - Application file backups
- `config/` - Configuration backups
- `manifest_*.json` - Backup metadata

**Remote**: S3 bucket (configurable)
- Automatic upload to S3
- Cross-region replication
- Glacier archival for long-term storage

## Disaster Recovery

### Recovery Time Objective (RTO)

| Component | RTO | Priority |
|-----------|-----|----------|
| Database | 1 hour | Critical |
| Application | 2 hours | High |
| Configuration | 30 minutes | High |
| Full System | 4 hours | Medium |

### Recovery Point Objective (RPO)

| Component | RPO | Data Loss |
|-----------|-----|-----------|
| Database | 6 hours | Acceptable |
| Application | 24 hours | Acceptable |
| Configuration | 24 hours | Minimal |

### Recovery Procedures

#### 1. Database Recovery

```bash
# Restore from specific backup
./scripts/recovery/disaster-recovery.sh \
  --type database \
  --timestamp 20260204_120000

# Verify database after recovery
psql -U postgres -d platform_db -c "SELECT COUNT(*) FROM users;"
```

#### 2. Application Recovery

```bash
# Restore application files
./scripts/recovery/disaster-recovery.sh \
  --type files \
  --timestamp 20260204_120000

# Reinstall dependencies
pnpm install

# Rebuild applications
pnpm build
```

#### 3. Full System Recovery

```bash
# Complete system restoration
./scripts/recovery/disaster-recovery.sh \
  --type all \
  --timestamp 20260204_120000 \
  --verify

# This will:
# 1. Restore database
# 2. Restore files
# 3. Restore configuration
# 4. Reinstall dependencies
# 5. Rebuild applications
```

## Configuration

### Environment Variables

```bash
# Backup configuration
export BACKUP_S3_BUCKET="my-backups"
export BACKUP_ENCRYPTION_KEY="your-secure-key"
export BACKUP_NOTIFY_EMAIL="alerts@example.com"
export BACKUP_NOTIFY_SLACK="https://hooks.slack.com/..."

# Database credentials
export POSTGRES_HOST="localhost"
export POSTGRES_USER="postgres"
export POSTGRES_PASSWORD="secure-password"
export POSTGRES_DB="platform_db"
```

### Backup Script Options

```bash
./scripts/backup/backup-system.sh \
  --type <all|database|files|config> \
  --retention <days> \
  --destination <path> \
  --compress \
  --encrypt \
  --notify
```

### Recovery Script Options

```bash
./scripts/recovery/disaster-recovery.sh \
  --type <all|database|files|config> \
  --backup-dir <path> \
  --timestamp <YYYYMMDD_HHMMSS> \
  --verify \
  --dry-run
```

## Monitoring

### Health Checks

```bash
# Run health checks
./scripts/monitoring/health-check.sh --verbose --alert
```

**Checks**:
- Disk space (>20% free)
- Memory available (>1GB)
- System load
- Application services
- Database connectivity
- Network connectivity
- Backup recency

### Alerts

Alerts are sent when:
- Backup fails
- Disk space < 20%
- Memory < 1GB
- Database unreachable
- Backup > 24 hours old

## Best Practices

### 1. Regular Testing

```bash
# Test recovery monthly
./scripts/recovery/disaster-recovery.sh --dry-run --timestamp <latest>

# Verify backup integrity weekly
./scripts/recovery/disaster-recovery.sh --verify --timestamp <latest>
```

### 2. Multiple Backup Locations

- **Primary**: Local storage
- **Secondary**: S3 bucket
- **Tertiary**: Cross-region S3 replica

### 3. Encryption

Always encrypt sensitive backups:

```bash
# Generate encryption key
openssl rand -base64 32

# Use in backup
export BACKUP_ENCRYPTION_KEY="<generated-key>"
./scripts/backup/backup-system.sh --encrypt
```

### 4. Automated Scheduling

**Cron Jobs**:

```cron
# Database backup every 6 hours
0 */6 * * * /path/to/scripts/backup/backup-system.sh --type database --compress --encrypt

# Full backup weekly (Sunday 2 AM)
0 2 * * 0 /path/to/scripts/backup/backup-system.sh --type all --compress --encrypt --notify

# Health check hourly
0 * * * * /path/to/scripts/monitoring/health-check.sh --alert
```

### 5. Documentation

Maintain runbooks for:
- Database recovery procedures
- Application deployment
- Configuration management
- Incident response

## Incident Response

### Level 1: Minor Issues

**Examples**: Slow performance, minor errors

**Actions**:
1. Check health status
2. Review logs
3. Restart affected services
4. Monitor for recurrence

### Level 2: Service Degradation

**Examples**: Database connection issues, high error rates

**Actions**:
1. Escalate to on-call engineer
2. Check recent deployments
3. Review monitoring dashboards
4. Consider rollback

### Level 3: Complete Outage

**Examples**: Database corruption, server failure

**Actions**:
1. Activate disaster recovery plan
2. Notify stakeholders
3. Restore from most recent backup
4. Post-mortem analysis

## Troubleshooting

### Backup Fails

**Check**:
- Disk space available
- Database credentials correct
- Write permissions on backup directory
- Network connectivity to S3

**Solution**:
```bash
# Clear old backups
./scripts/backup/backup-system.sh --retention 7

# Test database connection
pg_isready -h $POSTGRES_HOST -U $POSTGRES_USER

# Verify S3 access
aws s3 ls s3://$BACKUP_S3_BUCKET/
```

### Recovery Fails

**Check**:
- Backup file exists and is readable
- Correct timestamp specified
- Database service running
- Sufficient disk space

**Solution**:
```bash
# Verify backup
./scripts/recovery/disaster-recovery.sh --verify

# Check backup contents
tar -tzf /var/backups/platform/files/files_backup_*.tar.gz | head

# Test database connection
psql -U postgres -c "SELECT version();"
```

### Backup Too Large

**Solution**:
```bash
# Compress backups
./scripts/backup/backup-system.sh --compress

# Adjust retention
./scripts/backup/backup-system.sh --retention 14

# Use incremental backups for database
# (requires custom implementation)
```

## Security

### Encryption at Rest

All backups should be encrypted:
- Use AES-256 encryption
- Store keys in secure key management system
- Rotate encryption keys annually

### Access Control

Limit backup access:
- Backup directory: `chmod 700`
- Backup files: `chmod 600`
- S3 bucket: Restricted IAM policies

### Audit Logging

Track backup/recovery operations:
```bash
# Log all backup operations
./scripts/backup/backup-system.sh 2>&1 | tee -a /var/log/backups.log

# Review backup history
cat /var/log/backups.log | grep "SUCCESS"
```

## Compliance

### SOC 2

- Automated daily backups
- Encrypted backup storage
- Regular recovery testing
- Access logging and monitoring

### GDPR

- Right to erasure in backups
- Encryption of personal data
- Retention policy compliance
- Data location restrictions

## Resources

### Documentation
- [Backup System Script](../../scripts/backup/backup-system.sh)
- [Recovery Script](../../scripts/recovery/disaster-recovery.sh)
- [Health Check Script](../../scripts/monitoring/health-check.sh)

### Tools
- PostgreSQL backup tools
- AWS CLI for S3
- OpenSSL for encryption

---

**Last Updated**: 2026-02-04  
**Version**: 1.0.0  
**Maintainer**: Platform Team
