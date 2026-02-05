# Safety Policy

## Purpose

Preserve security, compliance, and data handling guarantees across all work.

## Security Non-Negotiables

1. No secrets in code, docs, test fixtures, or logs.
2. No bypass of authentication/authorization controls.
3. No reduction in tenant/data isolation behavior.
4. Risk acceptance must be documented with expiry and compensating controls.

## Data Handling

- Treat API keys, auth tokens, PII, and payment data as sensitive.
- Redact sensitive values in debugging output.
- Use `.env.example` for variable names only; never commit real values.

## Incident Response Expectations

- If a potential vulnerability is discovered, stop and document the issue.
- Create a high-priority backlog item with scope, impact, and verification plan.
