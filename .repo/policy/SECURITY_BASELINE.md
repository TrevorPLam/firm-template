# Security Baseline

## Overview

Security is **non-negotiable** in this repository. This document defines absolute prohibitions, security check requirements, review triggers, forbidden patterns, mandatory HITL actions, and evidence requirements.

All security gates are **hard gates** - they cannot be waived and must be resolved before merge.

---

## Absolute Prohibitions

### Secrets: Absolute Prohibition

**Policy**: NO secrets, API keys, tokens, passwords, or credentials in code, configuration, or documentation. **Ever. No exceptions.**

**Why**: Secrets in code create security vulnerabilities. They are discoverable in version history, logs, and public repositories. There is no safe way to have secrets in code.

**What Counts as a Secret**:
- API keys (public or private)
- OAuth tokens
- Database passwords
- Private keys (SSH, TLS, signing)
- Service account credentials
- Session tokens
- Encryption keys
- Webhook secrets
- Third-party service credentials

**What To Do Instead**:
- Use environment variables
- Use secret management services (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault)
- Use per-environment configuration
- Document how to obtain/configure secrets without including them

**Detection**: Secrets scanning runs on every PR. Any detected secret fails CI and blocks merge.

**Remediation**: If secret is detected:
1. **STOP immediately** - do not merge
2. **Revoke the secret** - assume it's compromised
3. **Generate new secret** - rotate credentials
4. **Remove from code** - remove all traces from current and historical commits
5. **Create HITL** - security team must review
6. **Document** - how it happened and how to prevent it

---

## Dependency Vulnerability Handling

**Policy**: `always_hitl`

### How It Works

1. **Detection**: Dependency scanner runs on every PR
2. **Vulnerability Found**: Any vulnerability (Critical, High, Medium, Low) triggers HITL
3. **HITL Created**: Security team reviews vulnerability
4. **Assessment**: Team determines:
   - Is it exploitable in our context?
   - What's the risk level?
   - Is there a patch available?
   - Is there a workaround?
5. **Decision**: 
   - **Fix**: Update dependency or apply patch
   - **Mitigate**: Apply workaround if no fix available
   - **Accept Risk**: Document why risk is acceptable (rare)
6. **Merge**: Only after HITL resolved and decision documented

### Rationale

- Vulnerabilities require human judgment
- Context matters for risk assessment
- No "auto-allow" for vulnerabilities
- Transparency and accountability

---

## Security Check Frequency

**Frequency**: `every_pr`

### What Gets Checked

1. **Secrets Scan**: Every commit scanned for secrets
2. **Dependency Vulnerabilities**: Every dependency checked against vulnerability databases
3. **Forbidden Patterns**: Code scanned for known insecure patterns
4. **Static Analysis**: Security-focused static analysis (e.g., CodeQL)

### Timing

- **Pre-merge**: All checks run before PR can merge
- **Continuous**: Scheduled scans on main branch (weekly)
- **Release**: Full security audit before release

### Tools

- Secrets: `git-secrets`, `truffleHog`, GitHub secret scanning
- Dependencies: `npm audit`, `pip-audit`, GitHub Dependabot
- Patterns: Custom regex rules + static analysis
- Static Analysis: CodeQL, SonarQube

---

## Security Review Triggers

These changes **trigger mandatory security review** via HITL:

### Trigger 1: Authentication/Authorization Changes
- **Examples**: Login logic, session handling, permission checks, role assignments
- **Why**: Core security mechanisms - errors have high impact
- **Review**: Security team reviews logic, tests, error handling

### Trigger 2: Cryptography Changes
- **Examples**: Encryption, hashing, signing, key management
- **Why**: Cryptography is easy to get wrong - use vetted libraries
- **Review**: Verify proper algorithm, key sizes, implementation

### Trigger 4: External API Integration
- **Examples**: New third-party API, webhook, external service
- **Why**: External systems introduce trust boundaries
- **Review**: Authentication method, data exposure, error handling

### Trigger 5: Database Schema Changes
- **Examples**: New tables, column changes, permission changes
- **Why**: Schema changes affect data security and access control
- **Review**: Permissions, encryption at rest, sensitive data handling

### Trigger 6: File Upload/Download
- **Examples**: User file uploads, file serving, file processing
- **Why**: File operations are common attack vectors
- **Review**: Validation, size limits, type checking, storage security

### Trigger 8: Security-Related Configuration
- **Examples**: CORS, CSP, rate limiting, security headers
- **Why**: Configuration errors create vulnerabilities
- **Review**: Settings appropriate for environment and threat model

### Trigger 9: Privileged Operations
- **Examples**: Admin functions, system calls, elevated permissions
- **Why**: Privileged operations have higher risk
- **Review**: Proper authorization, audit logging, error handling

### Trigger 10: Personal Data Handling
- **Examples**: PII collection, storage, processing, deletion
- **Why**: Privacy regulations (GDPR, CCPA) and ethical responsibility
- **Review**: Legal compliance, user consent, data minimization

---

## Forbidden Patterns

These code patterns are **automatically detected and blocked**:

### Pattern A: Hardcoded Credentials
```javascript
// ❌ FORBIDDEN
const API_KEY = "sk_live_1234567890";
const password = "admin123";
```
**Why**: Secrets in code (see Absolute Prohibitions)

### Pattern B: SQL Injection Vulnerable Code
```javascript
// ❌ FORBIDDEN
const query = `SELECT * FROM users WHERE id = ${userId}`;
```
**Why**: SQL injection attack vector - use parameterized queries

### Pattern C: Command Injection Vulnerable Code
```javascript
// ❌ FORBIDDEN
exec(`git clone ${userInput}`);
```
**Why**: Command injection attack vector - validate and sanitize input

### Pattern D: Path Traversal Vulnerable Code
```javascript
// ❌ FORBIDDEN
fs.readFile(`./uploads/${userFilename}`);
```
**Why**: Path traversal attack - validate paths are within expected directory

### Pattern E: Insecure Random for Security
```javascript
// ❌ FORBIDDEN
const token = Math.random().toString(36);
```
**Why**: `Math.random()` is not cryptographically secure - use `crypto.randomBytes()`

### Pattern F: Disabled Security Features
```javascript
// ❌ FORBIDDEN
app.use(helmet({ contentSecurityPolicy: false }));
```
**Why**: Disabling security features without documented justification

### Pattern G: Weak Cryptography
```javascript
// ❌ FORBIDDEN
crypto.createHash('md5');  // MD5 is broken
crypto.createCipher('des', key);  // DES is weak
```
**Why**: Use strong algorithms (SHA-256+, AES-256+)

### Pattern H: Unvalidated Redirects
```javascript
// ❌ FORBIDDEN
res.redirect(req.query.url);  // Unvalidated redirect
```
**Why**: Open redirect vulnerability - validate destination

---

## Mandatory HITL Actions

Security HITL items require these actions:

### HITL Action 1: Security Team Review
- **Who**: Designated security team member or lead
- **When**: All security triggers
- **What**: Review code, threat model, mitigation

### HITL Action 2: Threat Modeling
- **Who**: Security team + developer
- **When**: New features, external integrations
- **What**: Identify threats, attack vectors, mitigations

### HITL Action 3: Penetration Testing
- **Who**: Security team or external tester
- **When**: Major features, authentication changes
- **What**: Attempt to exploit vulnerabilities

### HITL Action 4: Compliance Review
- **Who**: Compliance officer or legal
- **When**: Personal data handling, regulatory requirements
- **What**: Verify GDPR, CCPA, SOC2 compliance

### HITL Action 5: Incident Response Plan
- **Who**: Security team + ops team
- **When**: High-risk changes
- **What**: Document rollback, monitoring, incident handling

### HITL Action 6: Security Audit Log Review
- **Who**: Security team
- **When**: Privileged operations, access control changes
- **What**: Verify audit logging is sufficient

### HITL Action 7: Vendor Security Assessment
- **Who**: Security team + procurement
- **When**: New third-party services
- **What**: Review vendor security practices, SLA, data handling

### HITL Action 8: Security Documentation Update
- **Who**: Developer + security team
- **When**: All security changes
- **What**: Update security docs, runbooks, incident procedures

---

## Evidence Requirements

Security claims must be backed by evidence:

### For Secrets
- **Evidence**: Clean secrets scan output
- **Command**: `git-secrets --scan` or equivalent
- **Pass Criteria**: No secrets detected

### For Dependencies
- **Evidence**: Clean vulnerability scan output
- **Command**: `npm audit` or equivalent
- **Pass Criteria**: No vulnerabilities OR all vulnerabilities have HITL resolution

### For Forbidden Patterns
- **Evidence**: Clean static analysis output
- **Command**: `eslint --plugin security` or equivalent
- **Pass Criteria**: No forbidden patterns detected

### For Authentication/Authorization
- **Evidence**: Test results showing:
  - Unauthorized access blocked
  - Authorized access granted
  - Edge cases handled
- **Command**: Security test suite
- **Pass Criteria**: All security tests pass

### For Cryptography
- **Evidence**: Code review confirming:
  - Strong algorithms used
  - Proper key management
  - Vetted library used (not custom crypto)
- **Command**: Manual review + static analysis
- **Pass Criteria**: Security team approval

---

## Security Baseline Checklist

Every PR must verify:

- [ ] No secrets in code, config, or docs
- [ ] Dependency scan clean OR all vulnerabilities have HITL resolution
- [ ] No forbidden patterns detected
- [ ] Security triggers identified and HITL created if needed
- [ ] All security HITL items resolved
- [ ] Security tests pass
- [ ] Evidence provided for all security claims
- [ ] Security documentation updated if needed

---

## Escalation

### When to Escalate

- **Vulnerability discovered**: Escalate to security team immediately
- **Uncertain about security**: Create HITL, don't guess
- **Security test failing**: Don't disable test - escalate to understand why

### How to Escalate

1. **Create HITL item**: Document the security concern
2. **Tag security team**: Notify appropriate team member
3. **Stop work**: Don't proceed until resolved
4. **Document**: Record the issue and resolution

---

**Version**: 2.2  
**Last Updated**: 2026-01-23  
**Authority**: Constitution Article 6 (Safety Before Speed)  
**Non-Waiverable**: All security baseline requirements are hard gates
