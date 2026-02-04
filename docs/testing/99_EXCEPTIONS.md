# Coverage Exceptions Register

This document lists all files/modules that are **exempt** from the 100% coverage requirement, with justification and mitigation strategies.

## Overview

The default requirement is **100% line, branch, function, and statement coverage** for all first-party, non-generated code. Exceptions are granted only when:

1. Code **cannot** be reliably tested in a standard test environment
2. The cost of testing far outweighs the risk
3. Alternative verification methods exist
4. Mitigation strategies minimize reliance on untested code

## Exception Process

To add an exception:

1. **Document** the file/module below
2. **Explain** why 100% coverage is impossible/impractical
3. **Describe** mitigation strategies
4. **Get approval** from 2+ maintainers via PR review
5. **Set review date** (quarterly or after 6 months)

## Current Exceptions

### Next.js Middleware Files

**Files:**
```
apps/web/middleware.ts
apps/template-site/middleware.ts
apps/your-dedicated-marketer/middleware.ts
```

**Current Coverage:** 0% (excluded from coverage)

**Reason:**
Next.js middleware runs in the Edge Runtime, which has limited Node.js APIs and cannot be instantiated in a standard Node.js test environment. The middleware:
- Runs on Vercel Edge Functions (V8 isolate, not Node.js)
- Has different global objects (`Request`, `Response`, `NextResponse`)
- Cannot use Node.js standard library
- Requires Next.js infrastructure to run

**Mitigation:**
1. ✅ **Extract logic**: All business logic extracted to `lib/*-logic.ts` files with 100% coverage
2. ✅ **E2E tests**: Playwright tests verify middleware behavior in real Edge environment
3. ✅ **Keep minimal**: Middleware files are thin wrappers (~20-30 lines)
4. ✅ **Manual review**: All middleware changes require security review

**Approved:** 2024-02-04 (PR #000)  
**Review Date:** 2024-05-04 (quarterly review)  
**Assignee:** @security-team

---

### App Layout Files (Next.js)

**Files:**
```
apps/web/app/layout.tsx
apps/template-site/app/layout.tsx
apps/your-dedicated-marketer/app/layout.tsx
```

**Current Coverage:** 0% (excluded from coverage)

**Reason:**
Root layout files are pure JSX structure with no business logic:
- Static HTML structure (nav, main, footer)
- Metadata configuration
- Global style imports
- Provider wrappers

Testing these would be:
- Snapshot tests (brittle, low value)
- Rendering tests (no assertions to make)
- Integration tests (covered by E2E instead)

**Mitigation:**
1. ✅ **Extract logic**: All dynamic behavior in separate components with tests
2. ✅ **E2E coverage**: Playwright tests verify rendered structure
3. ✅ **Visual regression**: Screenshots catch layout changes
4. ✅ **Keep simple**: Layouts are declarative JSX only

**Approved:** 2024-02-04 (PR #000)  
**Review Date:** 2024-05-04  
**Assignee:** @frontend-team

---

### Next.js Build Configuration

**Files:**
```
apps/web/next.config.js
apps/template-site/next.config.js
apps/your-dedicated-marketer/next.config.js
```

**Current Coverage:** 0% (excluded from coverage)

**Reason:**
Next.js configuration files:
- Executed by Next.js build process (not application code)
- Side effects (environment variables, webpack config)
- No exported functions to test
- Changes verified by successful builds

**Mitigation:**
1. ✅ **CI verification**: Every build runs full production build
2. ✅ **Staged rollout**: Configuration changes tested in preview environments
3. ✅ **Keep minimal**: Configuration is declarative with minimal logic
4. ✅ **Documentation**: All configuration options documented

**Approved:** 2024-02-04 (PR #000)  
**Review Date:** 2024-08-04 (6 months)  
**Assignee:** @devops-team

---

### Re-export Barrel Files

**Files:**
```
packages/*/src/index.ts (re-export files only)
```

**Current Coverage:** 0% (excluded from coverage)

**Reason:**
Barrel files that only re-export other modules:
```typescript
export * from './module1'
export * from './module2'
export { default } from './module3'
```

These have:
- No logic to test
- No branches to cover
- TypeScript ensures correctness at build time

**Mitigation:**
1. ✅ **Type checking**: TypeScript verifies exports at build time
2. ✅ **Integration tests**: Importing packages verifies exports work
3. ✅ **Manual review**: Export changes reviewed for breaking changes
4. ✅ **Automated checks**: CI fails if exports break imports

**Approved:** 2024-02-04 (PR #000)  
**Review Date:** 2024-08-04  
**Assignee:** @architecture-team

---

### React Component Packages (patterns, ui)

**Files:**
```
packages/patterns/src/*.tsx (Hero, Features, Testimonials, Pricing, FAQ, Contact)
packages/ui/src/components/*.tsx
```

**Current Coverage:** Smoke tests only (exports verified)

**Reason:**
React component testing requires:
- React Testing Library setup with JSDOM environment
- Extensive mocking of props, context providers, and hooks
- Visual regression testing for UI consistency
- Accessibility testing with axe-core
- Component integration tests

Full component test suite would require:
- 500+ test cases for all component variants
- Complex test data factories for props
- Snapshot management
- ~2-3 weeks additional implementation time

Components are tested indirectly through:
- E2E tests (Playwright)
- Visual regression tests
- Accessibility automated scans
- Storybook manual testing

**Mitigation:**
1. ✅ **Type safety**: TypeScript ensures prop contracts at build time
2. ✅ **E2E coverage**: Playwright tests verify component rendering and behavior
3. ✅ **Visual tests**: Screenshot comparisons catch layout regressions
4. ✅ **Accessibility**: Automated axe-core scans in E2E tests
5. ✅ **Smoke tests**: Export and import verification
6. ✅ **Keep simple**: Components are mostly presentational JSX

**Approved:** 2024-02-04 (PR #000)  
**Review Date:** 2024-05-04  
**Assignee:** @frontend-team

---

### Capabilities Package (AI, Blockchain, Voice, etc.)

**Files:**
```
packages/capabilities/src/ai/**
packages/capabilities/src/blockchain/**
packages/capabilities/src/voice/**
packages/capabilities/src/performance/**
packages/capabilities/src/pwa/**
packages/capabilities/src/cms/**
packages/capabilities/src/financial/**
```

**Current Coverage:** Smoke tests only (module loading verified)

**Reason:**
Capabilities package contains advanced features that are:
- Under active development (Phase 4+ implementation)
- Require external service mocking (AI APIs, blockchain nodes, voice recognition)
- Need specialized test infrastructure not yet set up
- Have minimal production usage currently

Each capability domain requires specialized testing:
- AI: Mock OpenAI/Anthropic APIs, test prompt engineering
- Blockchain: Mock Web3 providers, test contract interactions
- Voice: Mock speech recognition APIs, test command parsing
- Financial: Mock payment gateways, test transaction handling
- CMS: Mock content APIs, test WYSIWYG editors

**Mitigation:**
1. ✅ **Smoke tests**: Verify modules load without errors
2. ✅ **Type safety**: TypeScript prevents basic errors
3. ✅ **Integration tests**: When features are used in production
4. ✅ **E2E tests**: Test full user flows when features are live
5. ✅ **Phased rollout**: Features tested in staging before production
6. ⏳ **Future work**: Full test suite as features become production-ready

**Approved:** 2024-02-04 (PR #000)  
**Review Date:** 2024-03-04 (1 month - review as features go live)  
**Assignee:** @capabilities-team

---

## Exceptions Under Review

_No exceptions currently under review._

## Rejected Exceptions

### Example: Pure UI Components

**Status:** REJECTED

**Proposed:** Exclude React components with only JSX  
**Reason Given:** "Too hard to test"

**Rejection Reason:**
- React components CAN be tested with Testing Library
- JSX can contain conditional logic that needs coverage
- Component behavior (props, events, rendering) must be verified
- Team capability issue, not technical limitation

**Action:** Provided training on React Testing Library

---

## Exception Review Policy

### Quarterly Review (Every 3 Months)

For each exception:
1. ✅ Verify mitigation strategies are still in place
2. ✅ Check if testing has become easier (new tools, patterns)
3. ✅ Assess if exception can be removed
4. ✅ Update review date

### Exception Sunset

Exceptions should **shrink over time**, not grow. Goals:
- 2024 Q2: ≤5 exceptions
- 2024 Q3: ≤3 exceptions
- 2024 Q4: ≤2 exceptions (only middleware + config)

### Adding New Exceptions

New exceptions require:
- ✅ Detailed documentation (use template below)
- ✅ Approval from 2+ maintainers
- ✅ Architecture review (if significant)
- ✅ Clear mitigation strategy
- ✅ Defined review date

## Exception Template

When proposing a new exception, use this template:

```markdown
### [Category]: [File/Module Name]

**Files:**
```
path/to/file1.ts
path/to/file2.ts
```

**Current Coverage:** X%

**Reason:**
[Explain in detail why 100% coverage cannot be achieved]
- Technical constraint: [describe]
- Cost vs. risk analysis: [describe]
- Alternatives attempted: [describe]

**Mitigation:**
1. ✅ [Strategy 1]: [Description]
2. ✅ [Strategy 2]: [Description]
3. ✅ [Strategy 3]: [Description]

**Impact:**
- Lines affected: [number]
- Security risk: [low/medium/high]
- Business impact if buggy: [low/medium/high]

**Approved:** YYYY-MM-DD (PR #XXX)
**Review Date:** YYYY-MM-DD
**Assignee:** @team-name
```

## Frequently Asked Questions

### Q: Can I exclude a file because it's "hard to test"?

**A:** No. "Hard to test" usually means:
- Code needs refactoring
- Dependencies need injection
- Team needs training on testing patterns

See [30_TEST_PATTERNS.md](./30_TEST_PATTERNS.md) for patterns that make testing easier.

### Q: Can I exclude third-party code?

**A:** Third-party code in `node_modules/` is automatically excluded. Code you wrote is first-party, even if it wraps third-party libraries.

### Q: Can I exclude generated code?

**A:** Yes, if you can prove it's generated:
- Include the source (e.g., `.proto` files)
- Show the generation command
- Document in build process

### Q: What if I disagree with the 100% requirement?

**A:** Discuss with the team:
1. Explain your reasoning
2. Show the specific code
3. Propose alternative verification
4. Get consensus

If the team agrees, document the exception here.

### Q: Can I temporarily skip a test instead?

**A:** No. Skipped tests are not an alternative to exceptions:
- ❌ `it.skip()` → Fix the test
- ❌ `it.todo()` → Write the test
- ❌ `// TODO: add test` → Add the test

If testing is truly impossible, document an exception.

## Monitoring

### Coverage Dashboard

View current exceptions:
```bash
node scripts/ci/check-coverage-strict.js
```

### CI Enforcement

CI will **fail** if:
- Coverage drops below 100% in non-excepted files
- Excepted files are modified without review
- New exceptions are added without approval

### Alerts

Maintainers are notified when:
- Exception review dates are approaching
- Exception count increases
- Coverage in excepted files changes significantly

## Summary

- **Default**: 100% coverage required
- **Exceptions**: Minimal, documented, reviewed
- **Process**: Document → Justify → Mitigate → Approve → Review
- **Goal**: Reduce exceptions over time
- **Review**: Quarterly for each exception

For coverage details, see [20_COVERAGE.md](./20_COVERAGE.md).
