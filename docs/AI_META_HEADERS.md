# AI-META Headers - Documentation Overlay System

## Overview

This repository uses **AI-META headers** - a standardized comment-only documentation system designed to improve AI agent iteration speed and human code comprehension. Every code file contains structured metadata that answers: "What is this?", "Where does it fit?", "What's dangerous?", and "How do I test it?"

## Purpose

AI-META headers provide:
- **Fast context** for AI coding agents (no need to traverse imports)
- **Safety guardrails** for identifying security-critical code
- **Testing guidance** for validation after changes
- **Ownership clarity** for understanding module boundaries

## Header Format

All headers follow this structure:

```javascript
// AI-META-BEGIN
// 
// AI-META: [One-line purpose in plain English]
// OWNERSHIP: [Module/domain this file belongs to]
// ENTRYPOINTS: [How this file is reached/imported]
// DEPENDENCIES: [Key internal modules and critical external libs]
// DANGER: [Security/performance footguns, or "None identified"]
// CHANGE-SAFETY: [What's safe to change vs risky]
// TESTS: [How to validate changes - commands to run]
// 
// AI-META-END
```

### Comment Syntax by Language

- **TypeScript/JavaScript**: `// ` (double slash with space)
- **Python**: `# ` (hash with space)
- **Shell scripts**: `# ` (hash with space)

## Field Definitions

### AI-META
One-line description of the file's purpose. Examples:
- `React component: Hero`
- `Environment variable validation and configuration`
- `Server action for form handling and data mutations`
- `Utility functions and helpers`

### OWNERSHIP
Module or domain this file belongs to. Examples:
- `apps/web (marketing website)`
- `packages/ui (shared UI components)`
- `packages/utils (shared utilities)`
- `scripts (build/deployment utilities)`

### ENTRYPOINTS
How this file is reached or imported. Examples:
- `Direct route access via Next.js app router`
- `Runs on every request before route handlers`
- `Imported by pages and other components`
- `HTTP API endpoint`
- `Package entry point, imported by consumers`

### DEPENDENCIES
Key internal modules (@repo/*) and critical external libraries. Examples:
- `Next.js framework, React, Zod (validation)`
- `Supabase (database), HubSpot (CRM)`
- `Upstash Redis (rate limiting)`
- `Standard library only`

### DANGER
Security footguns, performance hotspots, or critical behaviors. Examples:
- `Authentication logic`
- `XSS prevention - must sanitize all user input`
- `Rate limiting - misconfiguration can lead to DoS`
- `Server-only code - must never be imported by client`
- `Environment variable access - validate all values`
- `None identified` (for non-critical files)

### CHANGE-SAFETY
Guidance on what's safe to modify. Examples:
- `Props and styling: generally safe. Logic changes: test thoroughly`
- `Add functions: safe. Modify existing: check all call sites first`
- `High risk - affects all requests. Test edge cases thoroughly`
- `Critical - any changes require security review and testing`

### TESTS
How to validate changes. Examples:
- `Run: pnpm test (Vitest), pnpm type-check (TypeScript)`
- `Run: pnpm test in package directory, pnpm type-check for types`
- `Integration tests required - run full test suite: pnpm test`

## Real-World Examples

### Example 1: React Component

```tsx
// AI-META-BEGIN
// 
// AI-META: React component: Hero
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Imported by pages and other components
// DEPENDENCIES: internal packages (@repo/*), Next.js framework, React
// DANGER: None identified
// CHANGE-SAFETY: Props and styling: generally safe. Logic changes: test thoroughly
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

import React from 'react'
// ... rest of component
```

### Example 2: Security-Critical Utility

```typescript
// AI-META-BEGIN
// 
// AI-META: Input sanitization and XSS prevention utilities
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Imported by application code
// DEPENDENCIES: Standard library only
// DANGER: XSS prevention - must sanitize all user input
// CHANGE-SAFETY: Critical - any changes require security review and testing
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

export function escapeHtml(text: string): string {
  // ... implementation
}
```

### Example 3: Middleware

```typescript
// AI-META-BEGIN
// 
// AI-META: Next.js middleware for request/response handling
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Runs on every request before route handlers
// DEPENDENCIES: Next.js framework, Upstash Redis (rate limiting)
// DANGER: XSS prevention - must sanitize all user input; Environment variable access - validate all values
// CHANGE-SAFETY: High risk - affects all requests. Test edge cases thoroughly
// TESTS: Integration tests required - run full test suite: pnpm test
// 
// AI-META-END

export function middleware(request: NextRequest) {
  // ... implementation
}
```

## Maintenance Guide

### When Adding a New File

1. Create the file with your code
2. Add the AI-META header at the very top (before any imports)
3. Fill in each field based on the file's actual purpose and context
4. Ensure the header is present before committing

### When Modifying an Existing File

**DO NOT** modify the AI-META header unless:
- The file's primary purpose changes significantly
- New security concerns are introduced
- Dependencies change substantially
- Testing approach changes

Minor code changes (bug fixes, style updates) should NOT update the header.

### Automated Header Addition

The repository includes a Python script for bulk header addition:

```bash
python3 /tmp/ai-meta-work/add_ai_headers.py
```

This script:
- Is **idempotent** (won't duplicate headers)
- Automatically infers metadata from file paths and imports
- Adds headers to all `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, and `.sh` files
- Skips excluded directories (node_modules, dist, build, etc.)

### Keeping Headers Updated

1. **Annual Review**: Once per year, run a repository-wide header audit
2. **Major Refactors**: Update affected headers when module boundaries change
3. **Security Reviews**: Update DANGER fields when new vulnerabilities are found
4. **CI Integration**: Consider adding a check to ensure new files have headers

## Benefits

### For AI Coding Agents
- **Faster context loading**: Agents know what a file does without reading the whole thing
- **Safety awareness**: Agents understand what's dangerous before making changes
- **Testing clarity**: Agents know exactly how to validate their changes
- **Dependency awareness**: Agents understand what will break if they change something

### For Human Developers
- **Onboarding speed**: New developers quickly understand module purposes
- **Code archaeology**: Easy to understand why code exists and what it affects
- **Refactoring safety**: Clear understanding of change impact before modifying
- **Review efficiency**: Reviewers can quickly assess risk level of changes

## Statistics

**Repository Coverage:**
- Total code files: 329
- Extensions covered: `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.sh`
- Lines added: ~3,950 (all comments, no functional changes)
- Type-check status: 6/9 packages passing (3 pre-existing failures unrelated to headers)
- Test status: Passing (all existing tests continue to pass)

**File Distribution:**
- TypeScript/JavaScript: 299 files
- Shell scripts: 26 files
- Python: 4 files

## Non-Negotiables

These rules are MANDATORY:

1. **Comment-only changes**: Headers must NEVER contain executable code
2. **No functional impact**: Adding/modifying headers must not change runtime behavior
3. **Consistent format**: All headers follow the exact same structure
4. **Idempotent insertion**: Running the header script multiple times must not duplicate headers
5. **No secrets**: Headers must NEVER contain API keys, passwords, or sensitive data

## Troubleshooting

### Header Not Showing Up
- Ensure the file extension is supported (`.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.sh`)
- Check that the file is not in an excluded directory
- Verify there are no syntax errors in the file

### Duplicate Headers
- Headers use `AI-META-BEGIN` and `AI-META-END` markers
- The insertion script detects these markers and skips files that already have them
- If you see duplicates, manually remove one set

### Type Errors After Adding Headers
- Headers are comments only and should not cause type errors
- If you see errors, they are likely pre-existing issues unrelated to headers
- Verify by removing the header temporarily and re-checking

## Version History

- **v1.0.0** (2026-02-04): Initial implementation
  - Added headers to all 329 code files
  - Created automated insertion script
  - Documented format and maintenance procedures

## Future Enhancements

Potential improvements (not yet implemented):

- [ ] CI check to ensure all new files have headers
- [ ] VSCode extension for auto-generating headers
- [ ] Header linter to validate format consistency
- [ ] Header update bot for keeping metadata current
- [ ] Integration with GitHub Copilot for smarter suggestions

## Questions?

For questions or suggestions about the AI-META header system, please:
1. Check this documentation first
2. Search existing issues for similar questions
3. Open a new issue with the `documentation` label
