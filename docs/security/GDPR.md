---
title: GDPR Compliance
summary: General Data Protection Regulation compliance for EU personal data
category: compliance
status: active
last_updated: 2026-02-04
owner: Data Protection Officer
---

# GDPR Compliance

## Overview

The General Data Protection Regulation (GDPR) is a comprehensive data protection law that applies to all organizations processing personal data of EU residents, regardless of the organization's location.

## Core Principles (Article 5)

### 1. Lawfulness, Fairness, and Transparency
Personal data must be processed lawfully, fairly, and in a transparent manner.

**Implementation**:
- Clear privacy policy published at `/privacy`
- Cookie consent banner (for non-essential cookies)
- Data processing disclosures
- Contact information for data inquiries

### 2. Purpose Limitation
Data collected for specified, explicit, and legitimate purposes.

**Implementation**:
```typescript
// Location: apps/web/lib/gdpr/data-purposes.ts

export enum DataProcessingPurpose {
  ESSENTIAL_OPERATIONS = 'essential',      // Legal basis: Legitimate interest
  MARKETING = 'marketing',                  // Legal basis: Consent
  ANALYTICS = 'analytics',                  // Legal basis: Consent
  SERVICE_IMPROVEMENT = 'service_improvement', // Legal basis: Legitimate interest
}

export interface DataCollectionConsent {
  userId: string;
  purpose: DataProcessingPurpose;
  granted: boolean;
  grantedAt?: Date;
  revokedAt?: Date;
  ipAddress: string;
  userAgent: string;
}
```

### 3. Data Minimization
Only collect data that is adequate, relevant, and necessary.

**Implementation**:
- Collect minimum required fields
- Optional vs required fields clearly marked
- Regular review of data collection (quarterly)
- Delete unnecessary data

```typescript
// Example: Minimal data collection
interface ContactFormData {
  // Required - minimum necessary
  email: string;
  message: string;
  
  // Optional - only if user provides
  name?: string;
  phone?: string;
  company?: string;
}
```

### 4. Accuracy
Data must be accurate and kept up to date.

**Implementation**:
- Email verification required
- Users can update their information
- Data validation at input
- Regular data quality checks

### 5. Storage Limitation
Data kept only as long as necessary.

**Implementation**:
```typescript
// Location: apps/web/lib/gdpr/retention.ts

export const DATA_RETENTION_PERIODS = {
  contactFormSubmissions: 365,    // 1 year
  analyticsData: 730,             // 2 years
  auditLogs: 2190,                // 6 years (compliance)
  marketingConsent: 730,          // 2 years
  inactiveUsers: 1095,            // 3 years
};

export async function deleteExpiredData(): Promise<void> {
  // Automated data deletion based on retention periods
  // Runs daily via cron job
}
```

### 6. Integrity and Confidentiality
Data processed securely with appropriate technical and organizational measures.

**Implementation**:
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Access controls (RBAC)
- Audit logging
- Regular security testing

### 7. Accountability
Controller must demonstrate compliance.

**Implementation**:
- Documentation in `/docs/security/`
- Privacy Impact Assessments (PIAs)
- Data Protection Impact Assessments (DPIAs)
- Processing records
- Consent logs

## Individual Rights (Chapter 3)

### Right to Access (Article 15)
Individuals can request a copy of their personal data.

**Implementation**:
```typescript
// Location: apps/web/lib/gdpr/data-export.ts

export async function exportUserData(userId: string): Promise<UserDataExport> {
  // Export all personal data in machine-readable format (JSON)
  return {
    profile: await getUserProfile(userId),
    contacts: await getUserContacts(userId),
    consents: await getUserConsents(userId),
    activityLog: await getUserActivityLog(userId),
    metadata: {
      exportDate: new Date(),
      format: 'JSON',
      version: '1.0',
    },
  };
}
```

**Process**:
1. User requests data export via email or UI
2. Verify user identity (authentication + additional verification)
3. Generate data export within 30 days
4. Provide download link (expires in 7 days)

### Right to Rectification (Article 16)
Individuals can correct inaccurate personal data.

**Implementation**:
- User profile edit functionality
- Email verification for email changes
- Audit trail of corrections

### Right to Erasure/"Right to be Forgotten" (Article 17)
Individuals can request deletion of their data.

**Implementation**:
```typescript
// Location: apps/web/lib/gdpr/data-deletion.ts

export async function deleteUserData(
  userId: string,
  reason: DeletionReason
): Promise<DeletionResult> {
  // Soft delete with retention period for legal compliance
  // Hard delete after retention period expires
  
  await Promise.all([
    // Anonymize user profile
    anonymizeUserProfile(userId),
    // Delete non-essential data immediately
    deleteMarketingData(userId),
    deleteAnalyticsData(userId),
    // Retain audit logs (legal requirement)
    flagAuditLogsForRetention(userId, reason),
  ]);
  
  return {
    status: 'completed',
    deletedAt: new Date(),
    retainedData: ['audit_logs'], // What we still keep and why
    hardDeleteDate: addDays(new Date(), 90), // When fully deleted
  };
}
```

**Exceptions**:
- Legal obligations (keep audit logs)
- Contractual obligations (active contracts)
- Legal claims (pending litigation)

### Right to Restriction (Article 18)
Individuals can restrict processing of their data.

**Implementation**:
```typescript
export interface ProcessingRestriction {
  userId: string;
  restrictedAt: Date;
  reason: 'accuracy_dispute' | 'unlawful_processing' | 'legal_claim' | 'objection';
  restrictions: {
    marketing: boolean;
    analytics: boolean;
    serviceImprovement: boolean;
  };
}
```

### Right to Data Portability (Article 20)
Individuals can receive and transfer their data.

**Implementation**:
- JSON export format
- CSV export option
- API for direct transfer to another service (future)

### Right to Object (Article 21)
Individuals can object to processing based on legitimate interests.

**Implementation**:
- Opt-out links in all marketing emails
- Analytics opt-out option
- Profiling opt-out

### Rights Related to Automated Decision-Making (Article 22)
Individuals can opt out of automated decisions with significant effects.

**Implementation**:
- Clear disclosure when AI/automated decisions used
- Human review option for significant decisions
- Explanation of automated decision logic

## Legal Bases for Processing (Article 6)

### 1. Consent
Freely given, specific, informed, and unambiguous.

**Implementation**:
```typescript
// Location: apps/web/lib/gdpr/consent.ts

export interface Consent {
  userId: string;
  purpose: DataProcessingPurpose;
  granted: boolean;
  grantedAt?: Date;
  ipAddress: string;
  userAgent: string;
  consentText: string;  // What they agreed to
  withdrawnAt?: Date;
}

export async function recordConsent(consent: Consent): Promise<void> {
  // Store consent with full context
  // Must be freely given, specific, informed, unambiguous
  // Must be easy to withdraw
  await consentDatabase.insert(consent);
}

export async function withdrawConsent(
  userId: string, 
  purpose: DataProcessingPurpose
): Promise<void> {
  // Immediately stop processing for that purpose
  // Keep consent record for compliance (prove we respected withdrawal)
}
```

**Consent Requirements**:
- ✅ Clear and plain language
- ✅ Separate consent for different purposes
- ✅ Opt-in (not pre-checked boxes)
- ✅ Easy to withdraw
- ✅ Keep records of consent

### 2. Contract
Processing necessary for contract performance.

**Example**: Email address to send service confirmations

### 3. Legal Obligation
Processing required by law.

**Example**: Tax records, audit logs

### 4. Vital Interests
Processing necessary to protect life.

**Example**: Medical emergencies

### 5. Public Task
Processing necessary for public interest or official authority.

**Example**: Government services

### 6. Legitimate Interests
Processing necessary for legitimate interests (balancing test).

**Examples**: 
- Fraud prevention
- Network security
- Essential analytics (error tracking)

## Special Categories of Data (Article 9)

**Prohibited unless explicit consent or legal exception**:
- Racial/ethnic origin
- Political opinions
- Religious/philosophical beliefs
- Trade union membership
- Genetic data
- Biometric data (for identification)
- Health data
- Sex life/sexual orientation

**Implementation**:
```typescript
// NEVER collect special category data without explicit consent
// Document legal basis if collected
// Extra security measures required
```

## Children's Data (Article 8)

**Age of consent**: 16 years (can be lowered to 13 by member states)

**Implementation**:
- Age verification for account creation
- Parental consent for users under 16
- Extra protections for children's data
- No profiling of children for marketing

## Data Protection Officer (DPO)

**Required if**:
- Public authority
- Core activities require regular/systematic monitoring
- Core activities involve special category data at scale

**Implementation**:
- DPO designated: [TBD]
- Contact: dpo@firm-template.com
- Independent from management
- Reports to highest management level

## Data Protection Impact Assessment (DPIA)

**Required for**:
- High risk processing
- Large scale special category data
- Systematic monitoring of public areas
- Automated decisions with legal effects
- New technologies

**Process**:
1. Describe processing operations
2. Assess necessity and proportionality
3. Identify risks to individuals
4. Evaluate measures to address risks
5. Consult DPO
6. Document in `/docs/security/audit/dpia/`

## Data Breach Notification

### To Supervisory Authority (Article 33)
**Timeline**: Within 72 hours of becoming aware

**Required information**:
- Nature of breach
- Categories and number of individuals affected
- Likely consequences
- Measures taken or proposed

**Implementation**:
```typescript
// Location: apps/web/lib/gdpr/breach-notification.ts

export interface DataBreach {
  id: string;
  discoveredAt: Date;
  notifiedAt?: Date;
  category: 'confidentiality' | 'integrity' | 'availability';
  affectedDataTypes: string[];
  affectedIndividualsCount: number;
  riskLevel: 'low' | 'medium' | 'high';
  consequences: string;
  measuresToken: string;
  supervisoryAuthorityNotified: boolean;
  individualsNotified: boolean;
}

export async function notifyDataBreach(breach: DataBreach): Promise<void> {
  // Notify within 72 hours
  if (breach.riskLevel === 'high') {
    await notifySupervisoryAuthority(breach);
    await notifyAffectedIndividuals(breach);
  }
}
```

### To Individuals (Article 34)
**Required if**: High risk to rights and freedoms

**Implementation**:
- Email notification to affected users
- Clear description of breach
- Advice on protective measures
- Contact point for questions

## International Data Transfers (Chapter V)

### Adequacy Decisions
Transfer to countries with adequate protection:
- EU/EEA countries
- UK, Switzerland, Japan, etc.

### Standard Contractual Clauses (SCCs)
For transfers to countries without adequacy decision.

### Binding Corporate Rules (BCRs)
For transfers within multinational corporations.

**Implementation**:
```typescript
// Track data storage locations
export const DATA_STORAGE_LOCATIONS = {
  primaryDatabase: 'EU-West (Ireland)',      // Within EU
  backups: 'EU-Central (Germany)',           // Within EU
  cdn: 'Global (with EU priority)',          // Cloudflare - SCC in place
  monitoring: 'US-East (Sentry)',            // SCC required
};

// Ensure SCCs are in place for US vendors
export const VENDOR_COMPLIANCE = {
  sentry: {
    location: 'United States',
    dataTransferMechanism: 'Standard Contractual Clauses',
    agreementDate: '2024-01-01',
    reviewDate: '2025-01-01',
  },
  // ... other vendors
};
```

## Cookies and Tracking

### ePrivacy Directive (Cookie Law)
Consent required for non-essential cookies.

**Implementation**:
```typescript
// Location: apps/web/components/cookie-banner.tsx

export const COOKIE_CATEGORIES = {
  essential: {
    name: 'Essential',
    required: true,  // No consent needed
    description: 'Required for site functionality',
    cookies: ['session', 'csrf-token'],
  },
  analytics: {
    name: 'Analytics',
    required: false,  // Consent required
    description: 'Help us improve the site',
    cookies: ['_ga', '_gid'],
  },
  marketing: {
    name: 'Marketing',
    required: false,  // Consent required
    description: 'Personalized advertising',
    cookies: ['_fbp', 'ads_id'],
  },
};

export function CookieBanner() {
  // Show banner on first visit
  // Allow granular consent
  // Easy to change preferences later
  // Respect Do Not Track (DNT)
}
```

## Compliance Checklist

### Documentation
- [x] Privacy policy published and accessible
- [ ] Cookie policy
- [ ] Data processing records (Article 30)
- [ ] Data Protection Impact Assessments (where required)
- [ ] Consent records
- [ ] Data retention schedule
- [ ] Data breach procedures
- [ ] International transfer documentation (SCCs)

### Technical Measures
- [x] Encryption at rest and in transit
- [x] Access controls
- [x] Audit logging
- [ ] Data export functionality (user portal)
- [ ] Data deletion functionality
- [ ] Consent management system
- [ ] Age verification (if targeting children)
- [ ] Cookie consent management

### Organizational Measures
- [ ] Data Protection Officer appointed (if required)
- [ ] Staff training on GDPR
- [ ] Data processing agreements with vendors
- [ ] Breach notification procedures tested
- [ ] Regular compliance reviews (quarterly)
- [ ] Privacy by design in development process
- [ ] Vendor GDPR compliance verification

### User Rights Implementation
- [ ] Subject access request (SAR) process
- [ ] Data rectification process
- [ ] Data erasure process
- [ ] Data portability process
- [ ] Consent withdrawal process
- [ ] Objection to processing process
- [ ] Automated decision explanation process

## Testing GDPR Compliance

### Automated Tests
```typescript
// Test: Data export includes all personal data
test('User data export is complete', async () => {
  const export = await exportUserData(testUserId);
  expect(export).toHaveProperty('profile');
  expect(export).toHaveProperty('consents');
  expect(export).toHaveProperty('activityLog');
});

// Test: Consent withdrawal stops processing
test('Consent withdrawal stops marketing', async () => {
  await withdrawConsent(testUserId, 'marketing');
  const user = await getUser(testUserId);
  expect(user.consents.marketing).toBe(false);
});

// Test: Data deletion works
test('User data deletion removes personal info', async () => {
  await deleteUserData(testUserId);
  const user = await getUser(testUserId);
  expect(user.email).toContain('deleted');
  expect(user.name).toBe('[Deleted User]');
});
```

### Manual Tests (Quarterly)
- Submit test subject access request
- Test data export format and completeness
- Test data deletion process
- Verify consent management functionality
- Review data retention compliance
- Audit vendor compliance
- Test breach notification procedures

## Penalties for Non-Compliance

### Tier 1 (Up to €10 million or 2% of annual turnover)
- Breach of processor obligations
- Breach of data protection officer obligations
- Breach of monitoring body obligations

### Tier 2 (Up to €20 million or 4% of annual turnover)
- Breach of basic principles (Article 5)
- Breach of individual rights (Articles 12-22)
- Breach of international transfers (Chapter V)
- Non-compliance with supervisory authority orders

## Resources

### External Resources
- [GDPR Official Text](https://gdpr-info.eu/)
- [ICO GDPR Guidance](https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/)
- [EDPB Guidelines](https://edpb.europa.eu/our-work-tools/general-guidance/gdpr-guidelines-recommendations-best-practices_en)
- [GDPR Checklist](https://gdprchecklist.io/)

### Internal Resources
- Privacy policy: `/privacy`
- Data processing records: `docs/security/audit/data-processing-records/`
- DPIAs: `docs/security/audit/dpia/`
- Consent management: `apps/web/lib/gdpr/`

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-04 | Initial GDPR compliance documentation | Data Protection Officer |

---

**Next Review Date**: 2026-05-04  
**Review Frequency**: Quarterly  
**Document Owner**: Data Protection Officer (DPO)
