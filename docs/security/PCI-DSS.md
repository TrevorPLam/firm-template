---
title: PCI-DSS Compliance
summary: Payment Card Industry Data Security Standard compliance for payment card data
category: compliance
status: active
last_updated: 2026-02-04
owner: Security & Compliance Team
---

# PCI-DSS Compliance

## Overview

This document outlines the Payment Card Industry Data Security Standard (PCI-DSS) compliance requirements for the firm-template platform when handling payment card data.

**Important**: The recommended approach is to **NEVER** store, process, or transmit payment card data directly. Use PCI-DSS compliant payment processors (Stripe, PayPal, Square) instead.

## PCI-DSS Scope

### What is PCI-DSS?
A set of security standards designed to ensure all companies that accept, process, store, or transmit credit card information maintain a secure environment.

### Cardholder Data (CHD)
- **Primary Account Number (PAN)**: Credit/debit card number
- **Cardholder Name**: Name on the card
- **Expiration Date**: Card expiration date
- **Service Code**: 3-4 digit number on magnetic stripe

### Sensitive Authentication Data (SAD)
**NEVER STORE** after authorization:
- Full magnetic stripe data
- CAV2/CVC2/CVV2/CID (card verification value)
- PIN/PIN block

## Compliance Levels

Based on annual transaction volume (Visa):
- **Level 1**: >6 million transactions/year → Annual external audit (QSA)
- **Level 2**: 1-6 million transactions/year → Annual self-assessment (SAQ)
- **Level 3**: 20,000-1 million e-commerce transactions/year → Annual SAQ
- **Level 4**: <20,000 e-commerce transactions/year OR <1 million total → Annual SAQ

## Recommended Architecture: Out-of-Scope

### Using Payment Processors (Recommended)

**Never handle card data directly**. Use tokenization:

```typescript
// RECOMMENDED: Use Stripe.js (PCI-DSS compliant)
// Location: apps/web/lib/payments/stripe.ts

import { loadStripe } from '@stripe/stripe-js';

export async function createPaymentIntent(amount: number) {
  // Card data never touches your server
  // Stripe handles all PCI-DSS requirements
  const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
  
  // Only store Stripe payment intent ID, never card data
  return stripe.createPaymentIntent({
    amount,
    currency: 'usd',
  });
}

// Store only non-sensitive data:
interface PaymentRecord {
  paymentIntentId: string;  // Stripe token
  customerId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  last4: string;  // Only last 4 digits OK to store
  brand: string;  // 'visa', 'mastercard', etc.
  // NEVER store: full PAN, CVV, PIN
}
```

### Iframe/JavaScript-Based Solutions
- Stripe Elements
- PayPal Smart Buttons
- Square Web Payments SDK
- Authorize.Net Accept.js

**Benefits**:
- Card data processed entirely in vendor's PCI-compliant environment
- Your servers never see/store card data
- Significantly reduced PCI-DSS scope
- Reduced compliance burden and audit costs

## PCI-DSS 12 Requirements

### Build and Maintain a Secure Network

#### Requirement 1: Install and maintain a firewall configuration
**Implementation**:
- Cloud provider firewall (AWS Security Groups, Azure NSG)
- Application-level firewall rules
- Network segmentation (separate payment processing if in-scope)
- Deny all inbound traffic by default, allow only necessary ports

```typescript
// Example: Security headers (prevent card data leakage)
// Location: apps/web/lib/security-headers.ts

export const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' https://js.stripe.com",  // Only trusted payment scripts
    "frame-src https://js.stripe.com",          // Payment iframes
    "connect-src 'self' https://api.stripe.com", // Payment API only
    // ... other CSP directives
  ].join('; '),
};
```

#### Requirement 2: Do not use vendor-supplied defaults
**Implementation**:
- Changed default passwords on all systems
- Removed default accounts
- Disabled unnecessary services
- Custom security configurations documented

**Evidence**: Configuration management in version control

### Protect Cardholder Data

#### Requirement 3: Protect stored cardholder data

**Implementation** (Out-of-Scope Approach):
```typescript
// ✅ CORRECT: Store only tokens and last 4 digits
interface PaymentMethod {
  id: string;
  customerId: string;
  stripePaymentMethodId: string;  // Tokenized reference
  last4: string;                   // Safe to store
  brand: string;                   // Safe to store
  expMonth: number;                // Safe to store
  expYear: number;                 // Safe to store
  // ❌ NEVER: cardNumber, cvv, fullMagneticStripe
}

// ❌ WRONG: Never store full card data
interface BadPaymentMethod {
  cardNumber: string;     // PCI-DSS violation!
  cvv: string;           // PCI-DSS violation!
  pin: string;           // PCI-DSS violation!
}
```

**If you must store card data** (requires full PCI-DSS compliance):
- Encrypt using strong cryptography (AES-256)
- Store encryption keys separately
- Implement key management procedures
- Render PAN unreadable (one-way hashing, truncation, tokenization)

#### Requirement 4: Encrypt transmission of cardholder data

**Implementation**:
```typescript
// All payment communications over TLS 1.3+
// Location: apps/web/middleware.ts

export function middleware(request: NextRequest) {
  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production' && !request.url.startsWith('https://')) {
    return NextResponse.redirect(`https://${request.headers.get('host')}${request.url}`);
  }
  
  // TLS 1.3 enforced at load balancer level
  // Minimum TLS 1.2 accepted
}
```

**Evidence**:
- TLS certificate configuration
- Security headers with HSTS
- No fallback to unencrypted protocols

### Maintain a Vulnerability Management Program

#### Requirement 5: Protect all systems against malware

**Implementation**:
- Regular security updates (Dependabot)
- Dependency vulnerability scanning
- Code analysis (CodeQL)
- Container scanning if using Docker

```yaml
# .github/workflows/security-scan.yml
- name: Scan for vulnerabilities
  run: |
    pnpm audit --audit-level=high
    npm install -g snyk
    snyk test --severity-threshold=high
```

#### Requirement 6: Develop and maintain secure systems and applications

**Implementation**:
- Secure development lifecycle (SDLC)
- Code review for all changes
- Security testing in CI/CD
- Vulnerability remediation procedures
- OWASP Top 10 awareness

**Security Controls**:
```typescript
// Input validation (prevent injection attacks)
// Location: apps/web/lib/sanitize.ts

export function sanitizePaymentNote(note: string): string {
  // Prevent XSS in payment notes
  return escapeHtml(note.slice(0, 500));
}

// Rate limiting (prevent brute force of payment endpoints)
// Location: apps/web/lib/actions/rate-limit.ts

export async function checkPaymentRateLimit(ip: string): Promise<boolean> {
  // Limit payment attempts per IP
  // Prevents card testing attacks
  return checkRateLimit('payment', ip);
}
```

### Implement Strong Access Control Measures

#### Requirement 7: Restrict access to cardholder data by business need-to-know

**Implementation**:
- Role-based access control (RBAC)
- Principle of least privilege
- Access only for job function
- Regular access reviews (quarterly)

```typescript
// Example: Payment access control
// Location: apps/web/lib/payments/access-control.ts

export enum PaymentAccessLevel {
  NONE = 0,           // No payment access
  VIEW_SUMMARY = 1,   // View transaction summaries only
  PROCESS = 2,        // Process payments
  REFUND = 3,         // Issue refunds
  ADMIN = 4,          // Full payment administration
}

export function hasPaymentAccess(
  user: User,
  requiredLevel: PaymentAccessLevel
): boolean {
  // Check if user has necessary permission
  return user.paymentAccessLevel >= requiredLevel;
}
```

#### Requirement 8: Identify and authenticate access to system components

**Implementation**:
- Unique user IDs (no shared accounts)
- Multi-factor authentication (MFA) required for payment access
- Strong password policy (12+ characters)
- Session timeout (15 minutes)
- Failed login lockout (5 attempts)

```typescript
// Location: apps/web/lib/auth/payment-mfa.ts

export async function requireMFAForPayment(userId: string): Promise<boolean> {
  // Additional MFA check before processing payments
  // Even if user is already authenticated
  return verifyMFAToken(userId);
}
```

#### Requirement 9: Restrict physical access to cardholder data

**Implementation** (Cloud Infrastructure):
- Cloud provider physical security (AWS/Azure)
- No physical media with card data
- Secure workstation policies
- Visitor logs (cloud provider responsibility)

### Regularly Monitor and Test Networks

#### Requirement 10: Track and monitor all access to network resources and cardholder data

**Implementation**:
```typescript
// Comprehensive audit logging
// Location: apps/web/lib/payments/audit-log.ts

export interface PaymentAuditLog {
  timestamp: Date;
  userId: string;
  action: 'view' | 'create' | 'refund' | 'void' | 'export';
  paymentId: string;
  amount?: number;
  result: 'success' | 'failure' | 'error';
  ipAddress: string;
  userAgent: string;
  details?: string;
}

export async function logPaymentAction(log: PaymentAuditLog): Promise<void> {
  // Immutable audit trail
  // Retained for 1 year minimum (PCI-DSS requirement)
  // Protected from modification/deletion
  await auditLogDatabase.insert(log);
}
```

**Logging Requirements**:
- User identification
- Type of event
- Date and time
- Success or failure indication
- Origination of event
- Identity of affected data/system
- Log retention: 3 months online, 12 months archived

#### Requirement 11: Regularly test security systems and processes

**Implementation**:
- Quarterly vulnerability scans (Approved Scanning Vendor - ASV)
- Annual penetration testing
- Intrusion detection/prevention systems
- File integrity monitoring for critical files

```yaml
# Automated security testing
# .github/workflows/codeql.yml
name: Security Scan
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: github/codeql-action/analyze@v3
      - name: Dependency scan
        run: pnpm audit --audit-level=high
```

### Maintain an Information Security Policy

#### Requirement 12: Maintain a policy that addresses information security

**Implementation**:
- Security policy documented in `/docs/security/policies/`
- Annual review and updates
- Security awareness training
- Incident response plan
- Acceptable use policy for employees

**Required Policies**:
1. Information Security Policy
2. Acceptable Use Policy
3. Access Control Policy
4. Data Retention and Disposal Policy
5. Incident Response Policy
6. Remote Access Policy
7. Network Security Policy
8. Physical Security Policy
9. Vendor Management Policy

## Self-Assessment Questionnaire (SAQ)

### SAQ A: Card-not-present merchants using third-party payment processors

**Applicable if**:
- E-commerce or mail/telephone-order merchant
- All cardholder data outsourced to PCI-DSS validated third party
- Merchant does not store, process, or transmit cardholder data
- Uses Stripe/PayPal/Square with proper integration

**Requirements** (22 questions):
1. Firewall configuration
2. Vendor default credentials changed
3. Cardholder data storage (none)
4. Encryption of transmitted data
5. Antivirus software
6. Secure systems and applications
7. Access control
8. Unique IDs
9. Physical access restrictions
10. Logging and monitoring
11. Security testing
12. Security policy

**Validation**:
- Annual SAQ completion
- Attestation of Compliance (AOC)
- Quarterly network scans (if applicable)

### SAQ D: All other merchants and service providers

**Required if**:
- Store, process, or transmit cardholder data
- Don't fit into SAQ A, A-EP, B, B-IP, C, C-VT, or P2PE categories
- Full PCI-DSS requirements apply (350+ controls)

## Implementation Checklist

### Out-of-Scope Setup (Recommended)
- [x] Use PCI-DSS compliant payment processor (Stripe/PayPal)
- [x] Implement tokenization (card data never touches servers)
- [x] Use iframe/JavaScript SDK for card input
- [ ] Store only tokens and last 4 digits
- [x] Secure transmission (TLS 1.3)
- [x] Access controls for payment data
- [ ] Audit logging for payment transactions
- [ ] Rate limiting for payment endpoints
- [ ] Complete SAQ A questionnaire annually

### If In-Scope (Card Data on Servers)
- [ ] Designate PCI-DSS Compliance Officer
- [ ] Complete full PCI-DSS requirements (1-12)
- [ ] Encrypt stored cardholder data (AES-256)
- [ ] Implement key management procedures
- [ ] Network segmentation for cardholder data environment (CDE)
- [ ] Quarterly vulnerability scans (ASV)
- [ ] Annual penetration testing
- [ ] File integrity monitoring
- [ ] Complete SAQ D or undergo QSA audit
- [ ] Maintain detailed documentation

## Testing PCI-DSS Compliance

### Automated Tests
```typescript
// Test: No card data in logs
test('Payment logs do not contain card data', () => {
  const log = createPaymentLog({ cardNumber: '4242424242424242' });
  expect(log).not.toContain('4242424242424242');
  expect(log).toContain('last4');
});

// Test: Rate limiting on payment endpoints
test('Payment endpoint has rate limiting', async () => {
  // Attempt multiple payments rapidly
  const results = await Promise.all(
    Array(10).fill(null).map(() => processPayment(testCard))
  );
  const blocked = results.filter(r => r.status === 429);
  expect(blocked.length).toBeGreaterThan(0);
});
```

### Manual Tests (Quarterly)
- Verify no card data in logs/databases
- Test encryption of transmitted data
- Verify access controls for payment functions
- Review audit logs for completeness
- Test backup/restore procedures
- Verify vendor compliance (Stripe/PayPal certificates)

### Annual Requirements
- Complete SAQ questionnaire
- Update security policies
- Security awareness training
- Penetration testing (if Level 1)
- Submit Attestation of Compliance (AOC)

## Common Pitfalls

### ❌ Don't Do This
```typescript
// NEVER log card data
console.log('Card:', cardNumber, cvv);  // PCI-DSS violation!

// NEVER store in database
await db.insert({ cardNumber, cvv });   // PCI-DSS violation!

// NEVER send in email
sendEmail({ subject: 'Payment', body: `Card: ${cardNumber}` });  // Violation!

// NEVER transmit over HTTP
fetch('http://api.example.com/payment', { body: cardNumber });  // Violation!
```

### ✅ Do This Instead
```typescript
// Use payment processor tokens
const paymentMethod = await stripe.createPaymentMethod({ card: elements });
await db.insert({ stripePaymentMethodId: paymentMethod.id });  // ✅ Safe

// Log only safe data
console.log('Payment processed:', { last4: card.last4, brand: card.brand });

// Use tokenization
const token = await stripe.createToken(cardElement);
await processPayment({ token: token.id });  // ✅ Safe
```

## Vendor Management

### Required from Payment Processors
- [ ] PCI-DSS Level 1 Service Provider certification
- [ ] Attestation of Compliance (AOC) - current
- [ ] Quarterly scan reports (ASV)
- [ ] Security incident notification procedures

### Approved Vendors
- ✅ **Stripe**: PCI Level 1 Service Provider
- ✅ **PayPal**: PCI Level 1 Service Provider
- ✅ **Square**: PCI Level 1 Service Provider
- ✅ **Braintree**: PCI Level 1 Service Provider (PayPal)

## Resources

### External Resources
- [PCI Security Standards Council](https://www.pcisecuritystandards.org/)
- [PCI-DSS Quick Reference Guide](https://www.pcisecuritystandards.org/documents/PCI_DSS_QRG_v3_2_1.pdf)
- [SAQ Instructions and Guidelines](https://www.pcisecuritystandards.org/documents/SAQ-InstrGuidelines-v3_2_1.pdf)
- [Approved Scanning Vendors (ASV)](https://www.pcisecuritystandards.org/assessors_and_solutions/approved_scanning_vendors)

### Internal Resources
- Payment implementation: `apps/web/lib/payments/`
- Security policies: `docs/security/policies/`
- Incident response: `docs/security/incident-response.md`

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-04 | Initial PCI-DSS compliance documentation | Security & Compliance Team |

---

**Next Review Date**: 2026-05-04  
**Review Frequency**: Quarterly  
**Document Owner**: PCI-DSS Compliance Officer
