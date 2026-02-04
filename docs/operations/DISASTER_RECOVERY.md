# Disaster Recovery Runbook

**Version:** 1.0  
**Last Updated:** 2026-02-04  
**Team:** Platform Operations

## Overview

This runbook provides step-by-step procedures for recovering from various disaster scenarios affecting the firm-template platform.

## Emergency Contacts

| Role | Contact | Availability |
|------|---------|--------------|
| Platform Lead | platform-lead@example.com | 24/7 |
| DevOps Team | devops@example.com | Business Hours |
| Database Admin | dba@example.com | On-call |
| Security Team | security@example.com | 24/7 |

## Recovery Time Objectives (RTO)

| Service | RTO | RPO | Priority |
|---------|-----|-----|----------|
| Production Sites | 1 hour | 15 minutes | Critical |
| Database | 30 minutes | 5 minutes | Critical |
| API Gateway | 1 hour | 15 minutes | High |
| Analytics | 4 hours | 1 hour | Medium |
| Development | 8 hours | 24 hours | Low |

## Disaster Scenarios

### Scenario 1: Complete Database Loss

**Severity:** CRITICAL

#### Symptoms
- Database connection errors across all services
- 500 errors on all client sites
- Unable to read/write data

#### Immediate Actions
1. **Confirm the issue** (5 minutes)
   ```bash
   # Check database connectivity
   psql $DATABASE_URL -c "SELECT 1;"
   
   # Check database server status
   ./scripts/database/health-check.sh
   ```

2. **Activate incident response** (2 minutes)
   - Notify Platform Lead and DevOps team
   - Start incident log
   - Update status page

3. **Assess backup availability** (3 minutes)
   ```bash
   # List available backups
   ls -lh scripts/database/backups/
   
   # Find most recent backup
   ls -t scripts/database/backups/db-*.dump* | head -1
   ```

#### Recovery Steps

1. **Provision new database instance** (10-15 minutes)
   - Use infrastructure-as-code templates
   - Ensure same configuration as original
   - Update DNS/connection strings

2. **Restore from most recent backup** (15-30 minutes)
   ```bash
   # Find latest backup
   LATEST_BACKUP=$(ls -t scripts/database/backups/db-*.dump* | head -1)
   
   # Restore database
   ./scripts/database/restore.sh "$LATEST_BACKUP"
   
   # Verify data integrity
   ./scripts/database/verify.sh
   ```

3. **Verify restoration** (5-10 minutes)
   ```bash
   # Check critical tables
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM clients;"
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
   
   # Run smoke tests
   pnpm test:integration
   ```

4. **Resume operations** (5 minutes)
   - Update application connection strings
   - Restart services
   - Monitor for errors
   - Update status page

#### Post-Recovery
- Document timeline and actions taken
- Review backup procedures
- Schedule post-mortem meeting
- Update RTO/RPO if needed

---

### Scenario 2: Application Server Failure

**Severity:** HIGH

#### Symptoms
- 502/503 errors
- Slow response times
- Server unreachable

#### Immediate Actions
1. **Verify scope** (2 minutes)
   ```bash
   # Check server status
   curl -I https://production-server.com/health
   
   # Check load balancer
   ./scripts/monitoring/check-lb.sh
   ```

2. **Activate failover** (5 minutes)
   ```bash
   # Switch to backup server
   ./scripts/deploy/failover.sh
   
   # Update DNS if needed
   ./scripts/dns/update-primary.sh backup-server
   ```

3. **Monitor recovery** (Ongoing)
   - Watch error rates
   - Check response times
   - Verify all endpoints

---

### Scenario 3: Data Corruption

**Severity:** HIGH

#### Symptoms
- Inconsistent data
- Foreign key violations
- Application errors with valid operations

#### Immediate Actions
1. **Isolate affected data** (5 minutes)
   - Identify scope of corruption
   - Take snapshot of current state
   - Stop writes to affected tables if possible

2. **Assess data loss** (10 minutes)
   ```bash
   # Check transaction logs
   psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity;"
   
   # Identify last known good state
   ./scripts/database/find-corruption.sh
   ```

3. **Recovery options**

   **Option A: Point-in-time recovery**
   ```bash
   # Restore to specific timestamp
   ./scripts/database/restore-pitr.sh "2024-01-15 14:30:00"
   ```

   **Option B: Selective restoration**
   ```bash
   # Restore specific tables
   ./scripts/database/restore-tables.sh affected_table1 affected_table2
   ```

   **Option C: Manual correction**
   - If corruption is minor, correct manually
   - Document all changes
   - Verify integrity after each change

---

### Scenario 4: Security Breach

**Severity:** CRITICAL

#### Immediate Actions
1. **Contain the breach** (Immediate)
   - Isolate affected systems
   - Revoke compromised credentials
   - Block suspicious IPs

2. **Assess impact** (15 minutes)
   ```bash
   # Check access logs
   ./scripts/security/audit-access.sh
   
   # Review recent changes
   git log --since="1 day ago" --all
   
   # Check for unauthorized access
   ./scripts/security/check-unauthorized.sh
   ```

3. **Notify stakeholders** (5 minutes)
   - Security team
   - Legal team
   - Affected clients (if required)

4. **Begin forensics** (Ongoing)
   - Preserve logs
   - Document timeline
   - Identify attack vector

---

### Scenario 5: Complete Infrastructure Loss

**Severity:** CRITICAL

#### Immediate Actions
1. **Activate full DR plan** (Immediate)
   - Notify all stakeholders
   - Activate backup infrastructure
   - Begin parallel recovery tracks

2. **Database recovery** (Priority 1)
   - Restore from latest backup
   - Verify data integrity
   - Update connection strings

3. **Application deployment** (Priority 2)
   ```bash
   # Deploy from source control
   git clone https://github.com/TrevorPLam/firm-template
   cd firm-template
   pnpm install
   pnpm build
   
   # Deploy to new infrastructure
   ./scripts/deploy/emergency-deploy.sh
   ```

4. **DNS and networking** (Priority 3)
   - Update DNS records
   - Configure load balancers
   - Set up SSL certificates

5. **Verification** (Priority 4)
   - Run full test suite
   - Verify all client sites
   - Check integrations

---

## Backup Procedures

### Daily Backups
```bash
# Automated daily backup (run via cron)
0 2 * * * /path/to/scripts/database/backup.sh --compress --verify
```

### Weekly Full Backups
```bash
# Full backup with encryption (run via cron)
0 3 * * 0 /path/to/scripts/database/backup.sh --encrypt --compress --verify
```

### Backup Verification
```bash
# Verify latest backup
./scripts/database/verify-backup.sh

# Test restore (monthly)
./scripts/database/test-restore.sh
```

## Testing Procedures

### Monthly DR Drills
1. Schedule drill with team (announce 1 week prior)
2. Select random disaster scenario
3. Execute recovery procedures
4. Document time to recovery
5. Identify improvements
6. Update runbook

### Quarterly Full Recovery Test
1. Provision test environment
2. Restore from production backup
3. Verify all functionality
4. Measure against RTO/RPO
5. Document findings

## Monitoring and Alerting

### Critical Alerts
- Database connection failures
- Server unavailability (>5 minutes)
- Disk space >90%
- CPU >90% sustained
- Error rate >5%

### Alert Channels
- PagerDuty for critical alerts
- Slack #incidents for all alerts
- Email for non-critical alerts

## Communication Templates

### Initial Incident Notification
```
INCIDENT: [SEVERITY] [SHORT DESCRIPTION]
Time: [TIMESTAMP]
Impact: [AFFECTED SERVICES]
Status: Investigating
Updates: Every 15 minutes at [LINK]
```

### Resolution Notification
```
RESOLVED: [SHORT DESCRIPTION]
Time: [TIMESTAMP]
Duration: [DURATION]
Root Cause: [BRIEF DESCRIPTION]
Next Steps: [POST-MORTEM LINK]
```

## Post-Incident Procedures

### Within 24 Hours
1. Complete incident timeline
2. Document actions taken
3. Calculate actual vs. target RTO/RPO
4. Identify immediate improvements

### Within 1 Week
1. Conduct post-mortem meeting
2. Document root cause analysis
3. Create action items
4. Update runbook if needed
5. Share learnings with team

### Within 1 Month
1. Implement improvements
2. Update monitoring/alerts
3. Conduct follow-up drill
4. Review insurance/contracts if needed

## Tools and Resources

### Essential Scripts
- `scripts/database/backup.sh` - Database backups
- `scripts/database/restore.sh` - Database restore
- `scripts/deploy/emergency-deploy.sh` - Emergency deployment
- `scripts/monitoring/health-check.sh` - System health checks

### Documentation
- [Infrastructure Guide](../infra/INFRASTRUCTURE.md)
- [Deployment Guide](../deployment/DEPLOYMENT.md)
- [Security Guide](../security/SECURITY.md)

### External Resources
- Cloud Provider Console
- DNS Management Panel
- Status Page Dashboard
- Monitoring Dashboard

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-04 | Initial runbook | Platform Team |

---

**Review Schedule:** Quarterly  
**Next Review:** 2026-05-04  
**Owner:** Platform Operations Team
