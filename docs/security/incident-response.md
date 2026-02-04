---
title: Security Incident Response Plan
summary: Procedures for detecting, responding to, and recovering from security incidents
category: operations
status: active
last_updated: 2026-02-04
owner: Security Team
---

# Security Incident Response Plan

## Overview

This document outlines the procedures for detecting, responding to, and recovering from security incidents affecting the firm-template platform.

## Incident Classification

### Severity Levels

#### P0 - Critical
- **Impact**: Complete service outage or critical data breach
- **Response Time**: Immediate (within 15 minutes)
- **Examples**: 
  - Active data breach with data exfiltration
  - Ransomware attack
  - Complete system compromise
  - Critical vulnerability being actively exploited

#### P1 - High
- **Impact**: Major functionality affected or significant security risk
- **Response Time**: Within 1 hour
- **Examples**:
  - Potential data breach (suspected but unconfirmed)
  - Critical vulnerability discovered (not yet exploited)
  - DDoS attack affecting availability
  - Unauthorized access to production systems

#### P2 - Medium
- **Impact**: Limited functionality affected or moderate security risk
- **Response Time**: Within 4 hours
- **Examples**:
  - High severity vulnerability in dependency
  - Suspicious activity in logs
  - Failed authentication attempts spike
  - Minor security configuration error

#### P3 - Low
- **Impact**: Minimal functionality affected or low security risk
- **Response Time**: Within 24 hours
- **Examples**:
  - Low/medium severity vulnerabilities
  - Security policy violations (training issue)
  - False positive security alerts
  - Outdated documentation

## Incident Response Team

### Roles and Responsibilities

#### Incident Commander (IC)
- **Primary**: Security Team Lead
- **Backup**: CTO
- **Responsibilities**:
  - Overall incident coordination
  - Communication with stakeholders
  - Decision authority
  - Post-incident review coordination

#### Security Lead
- **Primary**: Senior Security Engineer
- **Responsibilities**:
  - Technical investigation
  - Containment implementation
  - Evidence preservation
  - Forensic analysis

#### Communications Lead
- **Primary**: Customer Success Manager
- **Backup**: Marketing Lead
- **Responsibilities**:
  - Internal communications
  - Customer notifications
  - Regulatory notifications (GDPR, HIPAA breaches)
  - Public relations (if needed)

#### Technical Lead
- **Primary**: Engineering Lead
- **Responsibilities**:
  - System restoration
  - Infrastructure changes
  - Deployment coordination
  - Technical remediation

#### Legal/Compliance Lead
- **Primary**: Legal Counsel
- **Responsibilities**:
  - Regulatory compliance
  - Legal obligations assessment
  - External reporting requirements
  - Contract implications

## Incident Response Phases

### 1. Preparation

**Before an Incident**:
- Incident response team designated and trained
- Contact information maintained (see below)
- Incident response tools ready
- Backup and recovery procedures tested
- Security monitoring enabled

**Tools and Access**:
- Access to production logs (Sentry, CloudWatch)
- Access to infrastructure (AWS Console, SSH keys)
- Communication channels (Slack #incidents channel)
- Incident tracking system (GitHub Issues with security label)
- Forensic tools installed

### 2. Detection and Analysis

**Detection Sources**:
- Automated monitoring alerts (Sentry, CloudWatch)
- Security scanning (CodeQL, Dependabot)
- User reports
- Audit log analysis
- Third-party vulnerability disclosure
- Penetration testing findings

**Initial Analysis**:
```typescript
// Document initial findings
interface IncidentReport {
  id: string;
  detectedAt: Date;
  detectedBy: string;
  severity: 'P0' | 'P1' | 'P2' | 'P3';
  category: 'breach' | 'malware' | 'ddos' | 'unauthorized_access' | 'vulnerability' | 'other';
  description: string;
  affectedSystems: string[];
  initialImpact: string;
  evidence: string[];
}
```

**Analysis Steps**:
1. **Verify the incident** (confirm it's not false positive)
2. **Classify severity** (P0-P3)
3. **Identify scope** (what systems/data affected)
4. **Determine impact** (users, data, services)
5. **Preserve evidence** (logs, screenshots, forensic data)
6. **Document timeline** (when did it start, what happened when)

### 3. Containment

**Short-term Containment** (Immediate):
- Isolate affected systems
- Block malicious IPs/actors
- Disable compromised accounts
- Take systems offline if necessary
- Prevent further damage

**Long-term Containment** (Sustainable):
- Apply temporary fixes
- Implement monitoring for similar attacks
- Prepare for recovery phase
- Continue investigation

**Containment Checklist**:
```bash
# P0/P1 Incident Containment

# 1. Isolate affected systems
# Block at firewall level
aws ec2 modify-security-group-rules --remove-ingress

# 2. Disable compromised accounts
# Via admin panel or database
UPDATE users SET status = 'suspended' WHERE id = 'compromised_user_id';

# 3. Enable enhanced monitoring
# Increase log verbosity
export LOG_LEVEL=debug

# 4. Take snapshot for forensics
# Preserve evidence
aws ec2 create-snapshot --volume-id vol-xxxxx

# 5. Notify incident team
# Post to #incidents Slack channel
```

### 4. Eradication

**Remove the Threat**:
- Patch vulnerabilities
- Remove malware/backdoors
- Delete unauthorized accounts
- Close security gaps
- Update credentials

**Eradication Steps**:
1. **Identify root cause** (how did they get in)
2. **Remove all traces** (malware, backdoors, unauthorized access)
3. **Patch vulnerabilities** (code fixes, dependency updates)
4. **Strengthen defenses** (additional security controls)
5. **Verify eradication** (scan, test, monitor)

### 5. Recovery

**Return to Normal Operations**:
- Restore systems from clean backups
- Verify system integrity
- Re-enable services incrementally
- Monitor closely for recurrence
- Validate security controls

**Recovery Checklist**:
- [ ] All threats eradicated (verified)
- [ ] Systems patched and hardened
- [ ] Credentials rotated
- [ ] Clean backups identified
- [ ] Recovery plan documented
- [ ] Stakeholders notified of recovery timeline
- [ ] Enhanced monitoring enabled
- [ ] Restore from backups (if needed)
- [ ] Test restored systems
- [ ] Re-enable services
- [ ] Monitor for 48-72 hours

### 6. Post-Incident Activity

**Post-Incident Review** (within 1 week):
- Timeline of events
- What went well
- What needs improvement
- Action items for prevention
- Update incident response plan

**Documentation**:
```markdown
# Incident Post-Mortem: [Incident ID]

## Summary
- **Date**: YYYY-MM-DD
- **Duration**: X hours
- **Severity**: P0/P1/P2/P3
- **Category**: breach/malware/ddos/etc.

## Timeline
- HH:MM - Incident detected
- HH:MM - Team mobilized
- HH:MM - Containment achieved
- HH:MM - Eradication complete
- HH:MM - Recovery started
- HH:MM - Normal operations resumed

## Impact
- Users affected: X
- Data affected: Description
- Services affected: List
- Downtime: X hours

## Root Cause
Detailed explanation of how/why it happened.

## Response Effectiveness
- What went well
- What could be improved

## Action Items
- [ ] Action 1 (Owner: Name, Due: Date)
- [ ] Action 2 (Owner: Name, Due: Date)

## Lessons Learned
Key takeaways for future prevention.
```

**Follow-up Actions**:
- Implement preventive measures
- Update security controls
- Conduct training if needed
- Review and update policies
- Test new controls

## Communication Procedures

### Internal Communication

**Incident Channel**: Slack #incidents (private channel)

**Status Updates** (for P0/P1):
- Every 30 minutes during active response
- Hourly during recovery
- Final summary after resolution

**Update Template**:
```
[STATUS UPDATE - HH:MM]
Severity: P0/P1/P2/P3
Status: Investigating/Contained/Eradicated/Recovering/Resolved
Impact: Brief description
Next update: HH:MM
```

### External Communication

**Customer Communication** (if user-impacting):
- Initial notification within 1 hour (P0/P1)
- Status page updates
- Email to affected users (if identifiable)
- Post-incident summary

**Regulatory Notification**:
- **GDPR breach**: Within 72 hours to supervisory authority
- **HIPAA breach**: Within 60 days to individuals, HHS
- **Other regulations**: As required by law

**Template Locations**:
- Customer notification: `docs/security/templates/customer-notification.md`
- GDPR breach notification: `docs/security/templates/gdpr-breach.md`
- HIPAA breach notification: `docs/security/templates/hipaa-breach.md`

## Specific Incident Playbooks

### Data Breach Response

**Immediate Actions**:
1. Verify the breach occurred
2. Identify what data was accessed/exfiltrated
3. Identify affected users
4. Contain the breach (block access, isolate systems)
5. Preserve evidence (logs, snapshots)

**Assessment**:
- What data was accessed? (PHI, PII, payment card data)
- How many users affected?
- Was data exfiltrated or just accessed?
- Is data encrypted?
- Regulatory implications? (GDPR, HIPAA, PCI-DSS)

**Notification Requirements**:
- [ ] Affected individuals (timeline depends on regulation)
- [ ] Regulatory authorities (GDPR 72 hours, HIPAA 60 days)
- [ ] Law enforcement (if criminal activity)
- [ ] Payment processors (if payment data)
- [ ] Insurance provider (if cyber insurance)

### Ransomware Response

**Immediate Actions**:
1. **DO NOT** pay ransom immediately
2. Isolate infected systems (disconnect network)
3. Identify patient zero (first infected system)
4. Take forensic snapshots
5. Assess backup integrity
6. Contact law enforcement

**Decision Points**:
- Can we restore from backups? (preferred)
- Is data exfiltrated? (double extortion)
- Business continuity impact?
- Ransom amount vs. recovery cost?

**Recovery**:
- Restore from clean backups
- Verify backup integrity before restore
- Re-image compromised systems
- Change all credentials
- Monitor for persistence

### DDoS Attack Response

**Immediate Actions**:
1. Confirm DDoS attack (vs. legitimate traffic spike)
2. Enable DDoS protection (Cloudflare, AWS Shield)
3. Rate limiting/throttling
4. Block malicious IPs/regions
5. Scale infrastructure if needed

**Mitigation**:
- CDN/WAF rules
- Geo-blocking (if attack from specific regions)
- Challenge pages (Cloudflare challenge)
- Traffic analysis and pattern detection

### Credential Compromise Response

**Immediate Actions**:
1. Disable compromised account
2. Force password reset
3. Review account activity (what did they access)
4. Revoke active sessions
5. Review MFA status

**Investigation**:
- How were credentials obtained? (phishing, reuse, breach)
- What access did the account have?
- What actions were taken?
- Were other accounts compromised?

**Remediation**:
- Rotate affected credentials
- Enable MFA if not already
- Password manager recommendation
- Security training for affected user

### Supply Chain Attack Response

**Immediate Actions**:
1. Identify compromised dependency/vendor
2. Assess impact on our systems
3. Isolate affected systems
4. Check for malicious activity
5. Rollback to safe version

**Investigation**:
- Which systems use the compromised dependency?
- What data does it have access to?
- Has it been exploited in our environment?
- Upstream vendor response?

**Remediation**:
- Update to patched version or remove dependency
- Scan for indicators of compromise (IOCs)
- Review access logs
- Consider alternatives if vendor compromised

## Contact Information

### Emergency Contacts (24/7)

**Incident Commander**:
- Name: [TBD]
- Phone: [TBD]
- Email: [TBD]

**Security Team Lead**:
- Name: [TBD]
- Phone: [TBD]
- Email: [TBD]
- PagerDuty: [TBD]

**CTO**:
- Name: [TBD]
- Phone: [TBD]
- Email: [TBD]

**Legal Counsel**:
- Name: [TBD]
- Phone: [TBD]
- Email: [TBD]

### External Contacts

**Cyber Insurance**:
- Provider: [TBD]
- Policy Number: [TBD]
- Claims Phone: [TBD]

**Law Enforcement**:
- FBI Cyber Division: (855) 292-3937
- Local FBI Field Office: [TBD]

**Regulatory Authorities**:
- GDPR: Data Protection Authority contact
- HIPAA: HHS Office for Civil Rights
- PCI: Payment processor security team

**Vendors**:
- AWS Support: [Account contact]
- Cloudflare Support: [Account contact]
- Sentry Support: [Account contact]

## Tools and Resources

### Incident Management
- **Incident Tracking**: GitHub Issues with `security-incident` label
- **Communication**: Slack #incidents channel
- **Status Page**: [status.firm-template.com]
- **Documentation**: `/docs/security/incidents/`

### Forensics and Analysis
- **Log Aggregation**: Sentry, CloudWatch Logs
- **Network Analysis**: CloudWatch Network Monitoring
- **File Analysis**: VirusTotal, malware sandbox
- **Threat Intelligence**: MITRE ATT&CK, CVE databases

### Recovery
- **Backups**: Automated daily backups (30-day retention)
- **Infrastructure as Code**: Terraform/CloudFormation
- **Disaster Recovery**: See `docs/security/disaster-recovery.md`

## Testing and Drills

### Tabletop Exercises (Quarterly)
- Simulate security incident scenario
- Walk through response procedures
- Identify gaps in plan
- Update contact information
- Train team members

### Live Fire Drills (Annual)
- Actually trigger incident response
- Test communication procedures
- Verify tool access
- Practice restoration from backups
- Measure response times

### Continuous Improvement
- Review post-incident reports
- Incorporate lessons learned
- Update playbooks
- Enhance detection capabilities
- Improve automation

## Metrics and Reporting

### Key Metrics
1. **Mean Time to Detect (MTTD)**: Time from incident start to detection
2. **Mean Time to Respond (MTTR)**: Time from detection to containment
3. **Mean Time to Recover (MTTR)**: Time from containment to normal operations
4. **Incident Count**: Number of incidents by severity/category
5. **False Positive Rate**: Security alerts that weren't actual incidents

### Monthly Security Report
- Incident summary (count, severity, categories)
- Response time metrics
- Top vulnerabilities discovered
- Remediation status
- Action items progress

## Appendices

### Appendix A: Incident Classification Matrix

| Category | P0 | P1 | P2 | P3 |
|----------|----|----|----|----|
| Data Breach | Confirmed exfiltration | Suspected breach | Unauthorized access | Potential vulnerability |
| Malware | Active ransomware | Malware detected | Suspicious file | Low-risk detection |
| DDoS | Service down | Service degraded | Traffic spike | Minor attack |
| Unauthorized Access | Production compromise | Staging compromise | Dev compromise | Failed attempts |
| Vulnerability | Actively exploited | Critical vuln found | High severity vuln | Medium/low vuln |

### Appendix B: Useful Commands

```bash
# View recent logs
docker logs --since 1h container_name
aws logs tail /aws/lambda/function-name --since 1h

# Check active connections
netstat -an | grep ESTABLISHED
ss -tuln

# Review failed logins
grep "Failed password" /var/log/auth.log
journalctl -u ssh --since "1 hour ago"

# Snapshot for forensics
aws ec2 create-snapshot --volume-id vol-xxxxx --description "Forensic snapshot"

# Block IP at firewall
sudo iptables -A INPUT -s MALICIOUS_IP -j DROP
```

### Appendix C: Evidence Preservation

**What to Preserve**:
- System logs (application, system, security)
- Network logs (firewall, IDS/IPS)
- Audit trails
- Database logs
- Screenshots
- Memory dumps (if available)
- Disk images/snapshots

**How to Preserve**:
```bash
# 1. Take snapshots immediately
aws ec2 create-snapshot --volume-id vol-xxxxx

# 2. Copy logs to secure location
aws s3 cp /var/log/app.log s3://forensics-bucket/incident-001/

# 3. Document chain of custody
# Record who accessed what when in docs/security/incidents/INCIDENT-ID/custody-log.md
```

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-04 | Initial incident response plan | Security Team |

---

**Next Review Date**: 2026-05-04  
**Review Frequency**: Quarterly (or after major incident)  
**Document Owner**: Security Team Lead

**Last Tested**: [TBD] (Schedule tabletop exercise)
