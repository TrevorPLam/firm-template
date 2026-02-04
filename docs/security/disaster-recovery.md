---
title: Disaster Recovery and Business Continuity Plan
summary: Procedures for recovering from disasters and maintaining business operations
category: operations
status: active
last_updated: 2026-02-04
owner: Operations & Security Team
---

# Disaster Recovery and Business Continuity Plan

## Overview

This document outlines procedures for recovering from disasters and maintaining business continuity for the firm-template platform.

## Recovery Objectives

### Recovery Time Objective (RTO)
Maximum acceptable downtime for each system component.

| Component | RTO | Priority |
|-----------|-----|----------|
| Web Application | 4 hours | P0 |
| API Gateway | 4 hours | P0 |
| Database (Primary) | 2 hours | P0 |
| Authentication Service | 2 hours | P0 |
| Email Service | 24 hours | P1 |
| Analytics | 72 hours | P2 |
| CI/CD Pipeline | 48 hours | P2 |

### Recovery Point Objective (RPO)
Maximum acceptable data loss for each data store.

| Data Store | RPO | Backup Frequency |
|------------|-----|------------------|
| Production Database | 15 minutes | Continuous replication + hourly snapshots |
| User Files/Media | 1 hour | Hourly incremental, daily full |
| Configuration/Secrets | 0 minutes | Immediate replication (HA) |
| Logs | 5 minutes | Real-time streaming |
| Git Repository | 0 minutes | Distributed (GitHub) |

## Backup Strategy

### Database Backups

**Automated Daily Backups**:
```typescript
// Location: scripts/backup/database-backup.ts

export const BACKUP_SCHEDULE = {
  full: '0 2 * * *',      // Daily at 2 AM UTC
  incremental: '0 * * * *', // Hourly
  retention: {
    daily: 7,              // Keep 7 days of daily backups
    weekly: 4,             // Keep 4 weeks of weekly backups
    monthly: 12,           // Keep 12 months of monthly backups
  }
};

export async function performDatabaseBackup(): Promise<BackupResult> {
  // 1. Create snapshot
  const snapshot = await database.createSnapshot({
    name: `backup-${new Date().toISOString()}`,
    description: 'Automated daily backup',
  });
  
  // 2. Verify integrity
  const isValid = await verifyBackupIntegrity(snapshot.id);
  if (!isValid) {
    throw new Error('Backup integrity check failed');
  }
  
  // 3. Store in multiple locations
  await Promise.all([
    storeInPrimaryRegion(snapshot),
    storeInSecondaryRegion(snapshot),
    storeInArchiveStorage(snapshot),
  ]);
  
  // 4. Test restore capability (sample)
  if (Math.random() < 0.1) { // 10% of backups
    await testRestoreFromBackup(snapshot.id);
  }
  
  return { success: true, snapshotId: snapshot.id };
}
```

**Backup Verification**:
- Automated integrity checks (checksums, row counts)
- Monthly restore test to staging environment
- Quarterly full disaster recovery drill

### File Storage Backups

**Strategy**: 
- Primary: AWS S3 with versioning enabled
- Cross-region replication to secondary region
- Lifecycle policy: Archive to Glacier after 90 days

```typescript
// S3 Bucket Configuration
export const S3_BACKUP_CONFIG = {
  versioning: true,
  replication: {
    enabled: true,
    destinationRegion: 'eu-central-1',
  },
  lifecycle: [
    {
      name: 'Archive old versions',
      transition: {
        days: 90,
        storageClass: 'GLACIER',
      },
    },
    {
      name: 'Delete very old versions',
      expiration: {
        days: 365,
      },
    },
  ],
};
```

### Code and Configuration Backups

**Strategy**:
- All code in Git (GitHub)
- Infrastructure as Code (IaC) in Git
- Secrets in encrypted secret manager
- Environment configs in version control

**Locations**:
- Primary: GitHub (distributed, replicated)
- Secondary: Automated daily export to S3
- Tertiary: Local developer clones

## Disaster Scenarios

### Scenario 1: Database Failure

**Impact**: Data layer unavailable, application cannot function

**Detection**:
- Health check failures
- Database connection errors in logs
- Monitoring alerts

**Recovery Procedure**:
1. **Assess the situation** (10 minutes)
   - Is it a failure or just connectivity issue?
   - Is standby replica available?
   - What's the last successful backup?

2. **Immediate failover to replica** (30 minutes)
   ```bash
   # Promote read replica to primary
   aws rds promote-read-replica --db-instance-identifier db-replica-01
   
   # Update application connection string
   export DATABASE_URL="postgresql://db-replica-01.region.rds.amazonaws.com"
   
   # Restart application
   kubectl rollout restart deployment/web-app
   ```

3. **If no replica available, restore from backup** (2 hours)
   ```bash
   # Restore from snapshot
   aws rds restore-db-instance-from-db-snapshot \
     --db-instance-identifier db-restored \
     --db-snapshot-identifier backup-2026-02-04-02-00
   
   # Apply point-in-time recovery if needed
   aws rds restore-db-instance-to-point-in-time \
     --source-db-instance-identifier db-primary \
     --target-db-instance-identifier db-restored \
     --restore-time "2026-02-04T10:30:00Z"
   ```

4. **Verify data integrity** (30 minutes)
   - Run integrity checks
   - Compare record counts
   - Test critical queries
   - Review recent transactions

5. **Restore service** (30 minutes)
   - Update DNS if needed
   - Monitor for errors
   - Verify functionality
   - Communicate status

### Scenario 2: Complete Region Failure

**Impact**: All infrastructure in primary region unavailable

**Detection**:
- Multiple system failures simultaneously
- AWS/cloud provider status page shows region issue
- Cannot reach any resources in region

**Recovery Procedure**:

**Phase 1: Initial Response** (15 minutes)
1. Confirm region-wide outage (AWS status page)
2. Activate incident response team
3. Communicate to stakeholders
4. Begin failover to secondary region

**Phase 2: DNS Failover** (30 minutes)
```bash
# Update Route53 to point to secondary region
aws route53 change-resource-record-sets \
  --hosted-zone-id Z123456 \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "app.firm-template.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z789012",
          "DNSName": "app-secondary.region2.aws.com",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'
```

**Phase 3: Database Restoration** (2 hours)
```bash
# Restore database in secondary region from latest backup
aws rds restore-db-instance-from-db-snapshot \
  --region eu-central-1 \
  --db-instance-identifier db-primary-failover \
  --db-snapshot-identifier backup-latest

# Or use cross-region replica if available (faster)
aws rds promote-read-replica \
  --region eu-central-1 \
  --db-instance-identifier db-replica-eu-central
```

**Phase 4: Application Deployment** (1 hour)
```bash
# Deploy application to secondary region
cd infrastructure/terraform
terraform apply -var="region=eu-central-1"

# Deploy latest application code
kubectl config use-context eu-central-1
kubectl apply -f k8s/production/

# Verify deployment
kubectl get pods
kubectl logs deployment/web-app
```

**Phase 5: Verification** (1 hour)
- Test all critical user flows
- Verify database connectivity
- Check integration points
- Monitor error rates
- Validate data integrity

**Total RTO**: ~4 hours (within acceptable RTO)

### Scenario 3: Ransomware Attack

**Impact**: Systems encrypted, potential data exfiltration

**Detection**:
- Files encrypted with ransomware extension
- Ransom note appears
- Unusual file system activity alerts
- Backup systems targeted

**Recovery Procedure**:

**Phase 1: Containment** (Immediate)
1. **Isolate infected systems** (disconnect network)
   ```bash
   # Disable network interfaces
   sudo ip link set eth0 down
   
   # Block at firewall
   aws ec2 modify-security-group-rules --group-id sg-xxxxx --remove-all-ingress
   ```

2. **Preserve evidence** (forensic snapshots)
   ```bash
   # Take snapshots before any recovery
   aws ec2 create-snapshot --volume-id vol-xxxxx \
     --description "Forensic: Ransomware incident"
   ```

3. **Assess scope**
   - Which systems are affected?
   - Are backups compromised?
   - Was data exfiltrated?
   - What's the ransom demand?

**Phase 2: Verification of Backups** (1 hour)
```bash
# Verify backup integrity
aws rds describe-db-snapshots --db-instance-identifier db-primary

# Test restore from backup (in isolated environment)
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier db-test-restore \
  --db-snapshot-identifier backup-before-incident

# Check for ransomware in backups (file signatures)
```

**Phase 3: Clean Infrastructure Setup** (2 hours)
```bash
# Deploy fresh infrastructure from IaC
cd infrastructure/terraform
terraform destroy -target=module.infected_resources
terraform apply  # Fresh, clean resources

# Use known-good container images
docker pull firm-template/web-app:v1.2.3-verified
```

**Phase 4: Data Restoration** (3 hours)
```bash
# Restore database from clean backup
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier db-primary-new \
  --db-snapshot-identifier backup-verified-clean

# Restore files from backup (pre-incident)
aws s3 sync s3://backup-bucket/files-2026-02-03/ s3://production-files/

# Verify restored data
./scripts/verify-data-integrity.sh
```

**Phase 5: Credential Rotation** (1 hour)
```bash
# Rotate ALL credentials and secrets
./scripts/security/rotate-all-credentials.sh

# Force logout all users
redis-cli FLUSHDB

# Generate new JWT signing keys
./scripts/generate-jwt-keys.sh
```

**Phase 6: Return to Service** (1 hour)
- Deploy applications to clean infrastructure
- Test thoroughly before exposing to users
- Monitor closely for any persistence mechanisms
- Gradual rollout (canary → full)

**Total RTO**: ~8 hours

### Scenario 4: Accidental Data Deletion

**Impact**: Critical data deleted by mistake

**Detection**:
- User reports missing data
- Application errors (foreign key violations)
- Audit log shows deletion events

**Recovery Procedure**:

**Immediate Assessment** (15 minutes)
1. What was deleted?
2. When was it deleted?
3. Who deleted it?
4. Is soft delete possible (restore from trash)?

**Restore from Backup** (1-2 hours)
```bash
# For database records: Point-in-time recovery
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier db-primary \
  --target-db-instance-identifier db-temp-restore \
  --restore-time "2026-02-04T09:00:00Z"  # Just before deletion

# Extract deleted data
pg_dump -h db-temp-restore -t deleted_table > deleted_data.sql

# Restore to production
psql -h db-primary < deleted_data.sql

# Verify restoration
SELECT COUNT(*) FROM deleted_table WHERE id IN (deleted_ids);
```

**For Files**:
```bash
# Restore from S3 versioning
aws s3api list-object-versions --bucket production-files --prefix path/to/file

# Restore specific version
aws s3api copy-object \
  --bucket production-files \
  --copy-source production-files/path/to/file?versionId=VERSION_ID \
  --key path/to/file
```

### Scenario 5: Critical Dependency Outage

**Impact**: Third-party service unavailable (Stripe, Supabase, etc.)

**Detection**:
- API errors from dependency
- Vendor status page shows outage
- User-reported issues

**Recovery Procedure**:

**Immediate Mitigation**:
```typescript
// Graceful degradation in code
export async function processPayment(order: Order): Promise<PaymentResult> {
  try {
    return await stripe.processPayment(order);
  } catch (error) {
    if (isServiceUnavailable(error)) {
      // Queue for later processing
      await paymentQueue.enqueue(order);
      
      return {
        status: 'pending',
        message: 'Payment queued for processing',
      };
    }
    throw error;
  }
}
```

**Failover to Backup Provider** (if available):
```typescript
// Use secondary payment processor
if (!stripe.isAvailable()) {
  return await paypalBackup.processPayment(order);
}
```

**Communication**:
- Status page update
- In-app message to users
- Email to affected users (if needed)

## Business Continuity

### Critical Business Functions

**Priority 1 (Must Continue)**:
- User authentication and access
- Core application functionality
- Data security and availability
- Payment processing (if applicable)

**Priority 2 (Should Continue)**:
- Customer support
- New feature development
- Marketing activities
- Analytics and reporting

**Priority 3 (Can Be Delayed)**:
- Documentation updates
- Internal training
- Office management

### Work From Anywhere Plan

**Infrastructure**:
- Cloud-based (no office dependency)
- VPN access for all team members
- Distributed team already (remote-first)

**Communication**:
- Primary: Slack
- Backup: Email
- Emergency: Phone tree

**Data Access**:
- All code in GitHub (accessible anywhere)
- Documentation in Git (accessible anywhere)
- Infrastructure managed via cloud provider consoles

### Alternative Work Locations

**If Primary Office Unavailable**:
- Team works from home (standard remote work)
- Use coworking spaces if needed
- Virtual meetings via Zoom/Meet

## Testing and Drills

### Monthly Backup Tests
- Restore backup to test environment
- Verify data integrity
- Measure restore time
- Document any issues

### Quarterly DR Drills

**Q1: Database Failure Drill**
- Simulate database failure
- Practice failover to replica
- Measure actual RTO/RPO

**Q2: Application Failure Drill**
- Simulate application deployment failure
- Practice rollback procedures
- Test monitoring and alerting

**Q3: Region Failure Drill**
- Simulate region outage
- Practice failover to secondary region
- Test DNS updates and routing

**Q4: Full DR Drill**
- Simulate complete system failure
- Restore from backups
- Test all recovery procedures
- Update documentation based on findings

### Annual Tabletop Exercise
- Gather all stakeholders
- Walk through disaster scenarios
- Identify gaps in procedures
- Update contact information
- Update recovery procedures

## Recovery Checklists

### Database Recovery Checklist
- [ ] Identify last good backup
- [ ] Create snapshot of current state (even if corrupted)
- [ ] Isolate affected database
- [ ] Restore from backup
- [ ] Verify data integrity
- [ ] Run integrity checks
- [ ] Test critical queries
- [ ] Update application configuration
- [ ] Restore service
- [ ] Monitor for issues
- [ ] Document incident

### Application Recovery Checklist
- [ ] Identify issue (deployment, code, infrastructure)
- [ ] Rollback to last known good version
- [ ] If rollback fails, deploy from clean state
- [ ] Verify configuration/environment variables
- [ ] Run health checks
- [ ] Test critical user flows
- [ ] Monitor error rates
- [ ] Gradual traffic increase
- [ ] Document incident

### Full System Recovery Checklist
- [ ] Assess scope of disaster
- [ ] Activate incident response team
- [ ] Communicate to stakeholders
- [ ] Verify backup availability
- [ ] Deploy infrastructure (IaC)
- [ ] Restore databases
- [ ] Restore file storage
- [ ] Deploy applications
- [ ] Update DNS (if needed)
- [ ] Run comprehensive tests
- [ ] Monitor all systems
- [ ] Gradual traffic restoration
- [ ] Post-incident review
- [ ] Update documentation

## Contact Information

### Emergency Contacts (24/7)

**Operations Lead**:
- Name: [TBD]
- Phone: [TBD]
- Email: [TBD]

**Infrastructure Lead**:
- Name: [TBD]
- Phone: [TBD]
- Email: [TBD]

**Database Administrator**:
- Name: [TBD]
- Phone: [TBD]
- Email: [TBD]

### Vendor Support Contacts

**AWS Enterprise Support**:
- Account ID: [TBD]
- Phone: [TBD]
- Portal: https://console.aws.amazon.com/support

**GitHub Support**:
- Account: TrevorPLam/firm-template
- Email: support@github.com

**Cloudflare Support**:
- Account ID: [TBD]
- Phone: [TBD]

## Recovery Cost Estimates

| Scenario | Estimated Cost | Timeframe |
|----------|----------------|-----------|
| Database restore | $100-500 | 2-4 hours |
| Region failover | $1,000-5,000 | 4-8 hours |
| Full rebuild | $5,000-20,000 | 1-3 days |
| Data recovery specialist | $10,000-50,000 | 1-2 weeks |
| Ransomware (with backups) | $5,000-10,000 | 8-24 hours |
| Ransomware (without backups) | $50,000-500,000 | Unknown |

**Cyber Insurance**: Covers up to [TBD] for recovery costs

## Documentation Updates

This plan should be reviewed and updated:
- **After every DR drill** (document what worked/didn't work)
- **After every incident** (incorporate lessons learned)
- **Quarterly** (scheduled review)
- **When infrastructure changes** (new regions, new services)
- **When team changes** (new contacts, new procedures)

## Metrics

### Target Metrics
- **Backup Success Rate**: 99.9%
- **Backup Verification Rate**: 100% (automated)
- **Restore Test Success Rate**: 95%
- **RTO Achievement**: 90% of recoveries meet RTO
- **RPO Achievement**: 95% meet RPO

### Actual Metrics (Track Monthly)
- Number of backups performed
- Number of backup failures
- Number of restore tests
- Number of DR incidents
- Actual RTO/RPO achieved
- Cost of DR activities

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-04 | Initial disaster recovery plan | Operations & Security Team |

---

**Next Review Date**: 2026-05-04  
**Review Frequency**: Quarterly  
**Document Owner**: Operations Lead  
**Last Tested**: [TBD] (Schedule DR drill)
