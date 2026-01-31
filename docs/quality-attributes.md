# Quality Attributes (Quality Gate)

**Purpose:** Define quality standards that must be met before declaring work complete.

**Last Updated:** 2026-01-31

## Overview

The Quality Gate ensures all changes meet minimum quality standards before being merged. This document defines the attributes and verification requirements referenced by autonomous agents.

## Required Quality Attributes

### 1. Functional Correctness
- **Definition:** Feature works as specified in task requirements
- **Verification:** Manual testing or automated test execution
- **Gate:** Must pass before marking task complete

### 2. Type Safety
- **Definition:** No TypeScript errors in changed files
- **Verification:** Run `pnpm type-check`
- **Gate:** Must pass with zero errors

### 3. Linting Standards
- **Definition:** Code follows ESLint and Prettier rules
- **Verification:** Run `pnpm lint` and `pnpm format:check`
- **Gate:** Must pass with zero violations

### 4. Build Success
- **Definition:** All packages build without errors
- **Verification:** Run `pnpm build`
- **Gate:** Must pass for affected packages

### 5. Test Coverage (where tests exist)
- **Definition:** New functionality has corresponding tests; existing tests pass
- **Verification:** Run `pnpm test`
- **Gate:** Zero failing tests; new features should have tests

### 6. Documentation
- **Definition:** Changes to public APIs or behaviors are documented
- **Verification:** Manual review of README, package docs, or inline comments
- **Gate:** Required for public-facing changes

## Agent Workflow

When completing a task:

1. Make code changes
2. Run verification commands (build, test, lint, type-check)
3. If all checks pass: mark task complete with evidence
4. If any checks fail: fix or create HITL for blocking issues

## Evidence Requirements

All quality verification must include:
- Command executed (e.g., `pnpm build`)
- Output summary or exit code
- Session timestamp
- Task ID reference

## Exceptions

Quality Gate can be skipped only when:
- Explicitly approved in HITL by repository owner
- Documentation-only changes (linting/formatting still required)
- Temporary WIP branch (must pass before merge to main/develop)

## Related

- **Security Gate:** See [security-review-triggers.md](./security-review-triggers.md)
- **Task Governance:** See [.agents/AGENTS.toon](../.agents/AGENTS.toon)
- **Standards Validation:** See [.alignment/STANDARDS-VALIDATION-REPORT.md](../.alignment/STANDARDS-VALIDATION-REPORT.md)
