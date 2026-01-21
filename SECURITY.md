# SECURITY.md

Last Updated: 2026-01-22

## Supported versions
This repository is a template framework. When used in a real project, define supported release lines here.

## Reporting a vulnerability
If this repo is deployed/used in production, define a private reporting channel (email or ticket system) and response SLA.

## Security principles (baseline)
- Never commit secrets. Use environment variables, `.env` (gitignored), or a secret manager.
- Least privilege for credentials and tokens.
- Prefer dependency pinning and automated updates in CI.
- Use Dependabot for weekly dependency updates; only auto-merge **patch** updates after tests pass.
- Treat AI-generated code as untrusted until verified (tests + review).
- Contact form includes a hidden honeypot field; submissions are rejected if it is filled.

## Dependency vulnerability monitoring
- Known advisory context: `@cloudflare/next-on-pages` pulls transitive build-tool vulnerabilities noted in
  `TODO.md` (T-020). Specific CVEs are **UNKNOWN** until an `npm audit` report can be captured in this repo.
- Monitoring cadence: review `@cloudflare/next-on-pages` release notes at least monthly.
- Mitigations (WHY: upstream adapter controls the toolchain surface area):
  - Re-run `npm audit` after registry access is available to confirm the current advisory list.
  - Prefer upstream adapter patches; track the OpenNext migration path (T-023) if patches lag.
  - Keep Dependabot enabled via `.github/dependabot.yml` to surface patch-level dependency fixes.

## Quick checks
- Run: `make ci`
- Review: `docs/SECURITY_BASELINE.md`
