---
title: HIPAA Compliance
summary: Health Insurance Portability and Accountability Act compliance framework for healthcare data
category: compliance
status: active
last_updated: 2026-02-04
owner: Security & Compliance Team
---

# HIPAA Compliance

## Overview

This document outlines the Health Insurance Portability and Accountability Act (HIPAA) compliance requirements and implementation for the firm-template platform when handling Protected Health Information (PHI).

**Note**: This platform is designed to be HIPAA-ready. Full HIPAA compliance requires additional operational procedures and Business Associate Agreements (BAAs) with vendors.

## Applicability

HIPAA applies when the platform:
- Stores, processes, or transmits Protected Health Information (PHI)
- Acts as a Business Associate to a Covered Entity (healthcare provider)
- Handles electronic Protected Health Information (ePHI)

## Protected Health Information (PHI)

PHI includes any individually identifiable health information:
- Health conditions, diagnoses, treatments
- Healthcare services provided
- Payment for healthcare services
- Personal identifiers linked to health information

### Common PHI Identifiers
1. Names
2. Geographic subdivisions smaller than state
3. Dates (birth, admission, discharge, death)
4. Phone numbers
5. Email addresses
6. Social Security numbers
7. Medical record numbers
8. Health plan beneficiary numbers
9. Account numbers
10. Certificate/license numbers
11. Device identifiers and serial numbers
12. URLs
13. IP addresses
14. Biometric identifiers
15. Full-face photographs
16. Any other unique identifying characteristic

## HIPAA Rules

### 1. Privacy Rule

**Objective**: Protect individuals' medical records and other PHI.

#### Implementation:
- **Privacy Policy**: Document data collection, use, and disclosure practices
- **Minimum Necessary**: Access only PHI necessary for specific job function
- **Patient Rights**: Support access, amendment, and accounting of disclosures
- **Notice of Privacy Practices**: Provide clear privacy notice to users

#### Technical Implementation:
```typescript
// Example: Minimum necessary access control
// Location: apps/web/lib/hipaa/access-control.ts

export enum PHIAccessLevel {
  NONE = 0,
  LIMITED = 1,    // Name, DOB only
  STANDARD = 2,   // Basic health info
  FULL = 3,       // Complete medical records
  ADMIN = 4       // All access + audit logs
}

export function enforceMininumNecessary(
  userRole: string, 
  requestedData: string[]
): string[] {
  // Filter data based on role's access level
  // Only return fields necessary for job function
}
```

### 2. Security Rule

**Objective**: Protect ePHI through administrative, physical, and technical safeguards.

#### Administrative Safeguards

**1. Security Management Process**
- Risk analysis (annual)
- Risk management procedures
- Sanction policy for violations
- Information system activity review

**Implementation**:
- Annual security risk assessment documented in `docs/security/audit/risk-assessments/`
- Automated security monitoring via Sentry
- Violation tracking and disciplinary procedures
- Regular audit log reviews

**2. Assigned Security Responsibility**
- Designated Security Official: [TBD]
- Security contact: security@firm-template.com

**3. Workforce Security**
- Authorization/supervision procedures
- Workforce clearance procedures  
- Termination procedures

**Implementation**:
- Role-based access control (RBAC)
- Background checks for PHI access
- Immediate access revocation on termination
- Security training for all workforce members

**4. Information Access Management**
- Access authorization policies
- Access establishment and modification procedures

**Implementation**:
```typescript
// Example: HIPAA-compliant access logging
// Location: apps/web/lib/hipaa/audit-log.ts

export interface PHIAccessLog {
  timestamp: Date
  userId: string
  action: 'view' | 'create' | 'update' | 'delete' | 'export'
  resourceType: string
  resourceId: string
  patientId?: string
  ipAddress: string
  userAgent: string
  accessGranted: boolean
  reason?: string
}

export async function logPHIAccess(log: PHIAccessLog): Promise<void> {
  // Tamper-proof audit logging
  // Retained for 6 years minimum per HIPAA
}
```

**5. Security Awareness and Training**
- Security reminders
- Protection from malicious software
- Log-in monitoring
- Password management

**Implementation**:
- Mandatory annual HIPAA training
- Phishing awareness training
- Secure password requirements (12+ characters, MFA required)
- Failed login attempt monitoring

**6. Security Incident Procedures**
- Incident response and reporting
- Documented in `docs/security/incident-response.md`

**7. Contingency Plan**
- Data backup plan
- Disaster recovery plan
- Emergency mode operation plan
- Documented in `docs/security/disaster-recovery.md`

**8. Evaluation**
- Annual security posture evaluation
- Third-party HIPAA compliance audits

#### Physical Safeguards

**1. Facility Access Controls**
- Contingency operations
- Facility security plan
- Access control and validation procedures

**Implementation** (Cloud Infrastructure):
- AWS/Azure data centers with SOC2/HIPAA compliance
- Multi-factor authentication for infrastructure access
- IP allowlisting for production systems
- Physical access logs maintained by cloud provider

**2. Workstation Use**
- Policies for workstation use with ePHI
- Screen lock requirements (5 minutes idle)
- Encrypted hard drives on all devices

**3. Workstation Security**
- Physical safeguards for workstations
- Clean desk policy for PHI handling

**4. Device and Media Controls**
- Disposal procedures (secure erase/destruction)
- Media re-use procedures (data wiping)
- Accountability tracking for devices
- Data backup and storage procedures

#### Technical Safeguards

**1. Access Control**

**Unique User Identification (Required)**
```typescript
// Each user has unique credentials
// No shared accounts for PHI access
// Implementation: apps/web/lib/auth/
```

**Emergency Access Procedure (Required)**
```typescript
// Break-glass access for emergencies
// Requires manager approval + audit log
// Auto-expires after 4 hours
```

**Automatic Logoff (Addressable)**
```typescript
// Session timeout after 15 minutes of inactivity
// Implemented in middleware.ts
export const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
```

**Encryption and Decryption (Addressable)**
```typescript
// Encryption at rest: AES-256
// Encryption in transit: TLS 1.3
// Database encryption: Supabase native encryption
// File encryption: AWS S3 server-side encryption (SSE-KMS)
```

**2. Audit Controls (Required)**

Implementation:
```typescript
// Comprehensive audit logging
// Location: apps/web/lib/hipaa/audit-log.ts

// Log retention: 6 years (HIPAA requirement)
// Immutable logs (append-only)
// Includes: user, timestamp, action, resource, result
```

**3. Integrity Controls (Addressable)**

Implementation:
- Checksums for data integrity verification
- Digital signatures for critical transactions
- Database constraints and foreign keys
- Backup integrity verification

**4. Person or Entity Authentication (Required)**

Implementation:
- Multi-factor authentication (MFA) required for PHI access
- Session tokens with short expiration (15 minutes)
- Strong password requirements (minimum 12 characters)
- Failed login attempt lockout (5 attempts)

**5. Transmission Security (Addressable)**

Implementation:
```typescript
// All transmission encrypted with TLS 1.3
// No PHI transmitted via email (secure portal only)
// VPN required for remote access to production systems
// End-to-end encryption for sensitive data transfer
```

### 3. Breach Notification Rule

**Objective**: Notify individuals, HHS, and potentially media of PHI breaches.

#### Breach Definition
Unauthorized acquisition, access, use, or disclosure of PHI that compromises security or privacy.

#### Notification Requirements

**Individual Notification** (within 60 days):
- Written notification by mail or email
- Include: date of breach, description, types of PHI, steps individuals should take, breach investigation/mitigation

**HHS Notification**:
- Breaches affecting 500+ individuals: within 60 days
- Breaches affecting <500 individuals: annual report

**Media Notification** (if 500+ individuals affected):
- Prominent media outlets in affected area

#### Implementation
- Breach detection procedures in `docs/security/incident-response.md`
- Breach notification templates in `docs/security/breach-notification-templates/`
- Breach log maintained in `docs/security/audit/breach-log.md`

### 4. Enforcement Rule

**Penalties for non-compliance**:
- Tier 1: $100-$50,000 per violation (unknowing)
- Tier 2: $1,000-$50,000 per violation (reasonable cause)
- Tier 3: $10,000-$50,000 per violation (willful neglect, corrected)
- Tier 4: $50,000 per violation (willful neglect, not corrected)
- Annual maximum: $1.5 million per violation category

## Business Associate Agreements (BAAs)

Required with all vendors that have access to PHI:

### Current Vendors Requiring BAAs
- [ ] Hosting provider (AWS/Vercel/Azure)
- [ ] Database provider (Supabase - requires enterprise plan for BAA)
- [ ] Email service (Resend/SendGrid)
- [ ] Analytics (if tracking PHI - disabled by default)
- [ ] Monitoring/logging (Sentry - requires configuration)

### BAA Requirements
- Define permitted uses of PHI
- Require safeguards for PHI
- Prohibit unauthorized use/disclosure
- Require breach notification
- Return or destruction of PHI at contract end

## De-identification

### Safe Harbor Method
Remove 18 PHI identifiers (listed above) and have no actual knowledge that remaining information could identify an individual.

### Statistical Method (Expert Determination)
A qualified statistician determines risk of re-identification is very small.

## Implementation Checklist

### Technical Controls
- [x] Encryption at rest (database, file storage)
- [x] Encryption in transit (TLS 1.3)
- [x] Access control with MFA
- [x] Audit logging system
- [ ] PHI-specific access logging (see example above)
- [x] Session timeouts
- [x] Unique user identification
- [ ] Emergency access procedures
- [ ] Data backup with integrity verification
- [ ] Secure data disposal procedures

### Administrative Controls
- [ ] HIPAA Privacy Officer designated
- [ ] HIPAA Security Officer designated
- [ ] Risk assessment completed (annual)
- [ ] Security awareness training program
- [ ] Sanction policy for violations
- [ ] Workforce security procedures
- [ ] Business Associate Agreements signed
- [ ] Breach notification procedures documented
- [ ] Contingency plan tested

### Documentation
- [ ] Privacy policy published
- [ ] Notice of Privacy Practices
- [ ] Security policies documented
- [ ] Procedure manuals for PHI handling
- [ ] Training materials and records
- [ ] Audit logs and reviews
- [ ] Risk assessments
- [ ] Incident response procedures

## HIPAA-Ready Code Examples

### Example 1: PHI Data Classification
```typescript
// Location: apps/web/lib/hipaa/classification.ts

export interface DataClassification {
  isPHI: boolean
  identifiers: string[]  // Which of 18 identifiers present
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted'
}

export function classifyData(data: any): DataClassification {
  // Automatically detect and classify PHI
  // Used for access control and audit logging
}
```

### Example 2: Minimum Necessary Redaction
```typescript
// Location: apps/web/lib/hipaa/redaction.ts

export function redactPHI(
  data: any, 
  userRole: string
): any {
  // Automatically redact PHI based on user's role
  // Return minimum necessary information
  // Example: Show initials instead of full name for limited access
}
```

### Example 3: Breach Detection
```typescript
// Location: apps/web/lib/hipaa/breach-detection.ts

export async function detectPotentialBreach(
  accessLogs: PHIAccessLog[]
): Promise<BreachAlert[]> {
  // Monitor for unusual access patterns
  // - Bulk downloads
  // - Access outside normal hours
  // - Access to unrelated patient records
  // - Failed access attempts
  return suspiciousActivities;
}
```

## Testing HIPAA Compliance

### Automated Tests
- Access control validation
- Encryption verification
- Audit log completeness
- Session timeout enforcement

### Manual Tests (Quarterly)
- Access review for all PHI access
- Security configuration review
- Training completion verification
- BAA status review
- Backup/restore testing

### Annual Audit
- Full HIPAA security risk assessment
- Third-party compliance audit
- Penetration testing with focus on PHI protection

## Resources

### External Resources
- [HHS HIPAA Portal](https://www.hhs.gov/hipaa/index.html)
- [HIPAA Security Rule Guidance](https://www.hhs.gov/hipaa/for-professionals/security/guidance/index.html)
- [NIST HIPAA Security Guidance](https://csrc.nist.gov/publications/detail/sp/800-66/rev-1/final)

### Internal Resources
- Security policies: `docs/security/policies/`
- Incident response: `docs/security/incident-response.md`
- Audit procedures: `docs/security/audit/`

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-04 | Initial HIPAA compliance documentation | Security & Compliance Team |

---

**Next Review Date**: 2026-05-04  
**Review Frequency**: Quarterly  
**Document Owner**: HIPAA Privacy Officer / Security Officer
