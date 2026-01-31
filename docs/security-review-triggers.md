# Security Review Triggers (Security Gate)

**Purpose:** Define conditions that require human review before proceeding with security-sensitive changes.

**Last Updated:** 2026-01-31

## Overview

The Security Gate is a hard stop for autonomous agents when encountering security-sensitive changes. Any trigger requires creating a HITL (Human-In-The-Loop) item and waiting for explicit approval before proceeding.

## Hard Stop Triggers

These **MUST** trigger HITL immediately:

### 1. Authentication & Authorization
- Changes to login/logout flows
- Modifications to session management
- Updates to access control logic
- Changes to password handling or reset flows
- JWT token generation or validation changes

### 2. Secrets Management
- Adding or modifying API keys
- Changes to environment variable handling
- Updates to .gitignore affecting secrets
- Credential storage or retrieval logic
- Any hardcoded secrets (always reject + HITL)

### 3. Financial Transactions
- Payment processing logic
- Pricing calculations
- Subscription management
- Refund or billing changes
- Any money flow modifications

### 4. Data Privacy & PII
- Changes affecting user data storage
- Updates to data retention policies
- Modifications to data export/deletion
- GDPR/privacy compliance changes
- PII logging or transmission

### 5. External Integrations
- New third-party API integrations
- Changes to API authentication
- Webhook endpoint modifications
- OAuth flow changes
- External service credentials

### 6. Security Headers & Middleware
- Content Security Policy (CSP) changes
- CORS configuration updates
- Rate limiting modifications
- Security middleware logic
- HTTPS enforcement changes

### 7. Input Validation & Sanitization
- Changes to input validation rules
- Updates to XSS prevention logic
- SQL injection prevention modifications
- Command injection safeguards
- Path traversal protections

### 8. Dependency Security
- Adding new dependencies (check CVEs first)
- Major version upgrades with security implications
- Changes to dependency vulnerability scanning
- Lockfile modifications with security advisories

## Agent Response Protocol

When a security trigger is detected:

1. **STOP:** Do not implement the change
2. **DOCUMENT:** Create HITL-XXXX.md in `.agents/hitl/` with:
   - Trigger type (from list above)
   - Proposed change description
   - Security implications
   - Risk assessment
   - Recommended review approach
3. **MARK:** Update task status to 'Blocked' in TODO.toon
4. **CONTINUE:** Move to next non-blocked task in group

## HITL Format for Security Issues

```markdown
# HITL-XXXX: [Security Trigger Type]

**Task:** [Task ID from TODO.toon]
**Trigger:** [Specific trigger from list above]
**Severity:** [Low/Medium/High/Critical]

## Proposed Change
[Describe what needs to be changed]

## Security Implications
[What security concerns does this raise?]

## Risk Assessment
- **Attack Surface:** [How does this affect attack surface?]
- **Data Exposure:** [Any PII or sensitive data involved?]
- **Blast Radius:** [What breaks if this is compromised?]

## Recommended Review
[What should the human reviewer check?]

## Alternative Approaches
[Are there safer alternatives?]
```

## Non-Blocking Security Improvements

These can proceed without HITL (but should be tested thoroughly):

- Adding security headers (if not removing existing ones)
- Improving error messages (not exposing sensitive info)
- Adding logging (if not logging sensitive data)
- Documentation updates
- Test coverage improvements

## Related Security Resources

- **OWASP Guidelines:** [SECURITY.md](./SECURITY.md)
- **Dependency Scanning:** CI security job in `.github/workflows/ci.yml`
- **Secret Scanning:** TruffleHog in CI pipeline
- **Standards Section 10:** See [.alignment/standards/10-security-and-compliance.md](../.alignment/standards/10-security-and-compliance.md)

## Escalation

If uncertain whether a change triggers Security Gate:
- **Default:** Create HITL (fail closed)
- **Never:** Proceed with potentially risky changes
- **Always:** Document rationale for security decisions
