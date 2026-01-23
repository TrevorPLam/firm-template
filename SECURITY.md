# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Disclose Publicly

**Do not** create a public GitHub issue for security vulnerabilities. This could put users at risk.

### 2. Report Privately

Please report security vulnerabilities by:

- **Email:** [security@example.com](mailto:security@example.com) *(⚠️ Update with actual security contact email)*
- **GitHub Security Advisory:** Use GitHub's private vulnerability reporting feature (if enabled)

### 3. Include Details

When reporting, please include:

- **Description** - Clear description of the vulnerability
- **Impact** - Potential impact and severity
- **Steps to Reproduce** - Detailed steps to reproduce the issue
- **Proof of Concept** - If possible, include a proof of concept
- **Suggested Fix** - If you have ideas for fixing the issue

### 4. Response Timeline

We will:

- **Acknowledge** your report within 48 hours
- **Investigate** the vulnerability within 7 days
- **Provide updates** on our progress
- **Notify you** when the vulnerability is fixed

### 5. Disclosure

We follow responsible disclosure practices:

- We will credit you (if desired) when the vulnerability is disclosed
- We will coordinate disclosure timing with you
- Public disclosure will occur after a fix is available

## Security Best Practices

### For Users

- Keep dependencies up to date
- Use strong, unique passwords
- Enable two-factor authentication when available
- Review and understand security headers configuration
- Monitor for security advisories

### For Developers

- Never commit secrets or credentials
- Use environment variables for sensitive configuration
- Validate and sanitize all user input
- Follow security patterns in `middleware.ts`
- Review `.repo/policy/SECURITY_BASELINE.md` for security requirements
- Run security audits regularly: `npm audit`

## Security Features

### Security Headers

The application implements comprehensive security headers:

- **Content Security Policy (CSP)** - Prevents XSS attacks
- **Strict-Transport-Security (HSTS)** - Enforces HTTPS
- **X-Frame-Options** - Prevents clickjacking
- **X-Content-Type-Options** - Prevents MIME sniffing
- **Permissions-Policy** - Restricts browser features

See `middleware.ts` for implementation details.

### Rate Limiting

API routes are protected with rate limiting to prevent abuse.

### Input Validation

All user input is validated using Zod schemas and sanitized before processing.

### Dependency Management

- **Dependabot** - Automated dependency updates
- **npm audit** - Regular security audits
- **Security scanning** - Automated vulnerability detection

## Security Baseline

This repository follows a security baseline defined in `.repo/policy/SECURITY_BASELINE.md`:

- **Absolute Prohibitions:** Secrets must never be committed
- **Security Triggers:** Certain changes require security review
- **Forbidden Patterns:** Automated detection of security anti-patterns
- **HITL Requirements:** High-risk changes require human approval

## Security Contact

For security-related questions or to report vulnerabilities:

- **Email:** [security@example.com](mailto:security@example.com) *(⚠️ Update with actual security contact email)*
- **GitHub:** Use private vulnerability reporting (if enabled)

## Security Updates

Security updates are released as needed. We recommend:

- Subscribing to security advisories
- Keeping dependencies up to date
- Reviewing release notes for security fixes

## Acknowledgments

We appreciate responsible disclosure of security vulnerabilities. Contributors who report security issues will be credited (if desired) when the vulnerability is disclosed.

---

**Last Updated:** 2026-01-23  
**Security Contact:** [security@example.com](mailto:security@example.com) *(⚠️ Update with actual security contact email)*
