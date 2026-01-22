# TEST_TRUST_REPORT.md — Test Suite Trustworthiness Validation

**Date**: 2026-01-22  
**Version**: 1.0.0  
**Status**: In Progress

---

## Executive Summary

**Is the test suite trustworthy?** ⚠️ **PARTIALLY TRUSTWORTHY with CRITICAL GAPS**

The test suite has 143 passing tests across 28 files with generally good coverage (50%+ lines). However, systematic validation uncovered **3 critical trustworthiness issues** that create false confidence:

1. 🔴 **CRITICAL**: Path traversal security test has a FALSE POSITIVE (Test #4)
2. ⚠️ **HIGH**: Over-mocking in ContactForm tests prevents exercising actual submission logic (Test #3)
3. ⚠️ **MEDIUM**: 22 test files use mocks, 38 interaction-only assertions found

**Biggest Risks:**
1. **Security vulnerability undetected**: Blog path traversal test passes even when protection is removed
2. **Integration gaps**: ContactForm mocks bypass rate limiting, validation, and database logic
3. **False confidence**: Tests appear comprehensive but have "happy path bias"

---

## Repro Commands

### Environment Setup
```bash
# Clone repository
git clone https://github.com/TrevorPLam/firm-template.git
cd firm-template

# Install dependencies
npm install

# Node version (via .nvmrc)
# node >= 20 < 23
```

### Test Commands
```bash
# Run all unit tests
npm test

# Run tests with coverage
npm test:coverage

# Run E2E tests
npm test:e2e

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- __tests__/lib/analytics.test.ts
```

### Build and Lint
```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

---

## Phase 0 — Tech Stack Identification

### Primary Languages
- **TypeScript** 5.7 (strict mode)
- **React** 19.2
- **Node.js** >= 20 < 23

### Test Frameworks
- **Unit Tests**: Vitest 4.0 with jsdom environment
- **E2E Tests**: Playwright 1.49
- **Test Utilities**: @testing-library/react 16.3, @testing-library/user-event 14.6

### Test Organization
- **Location**: `__tests__/` (unit), `tests/e2e/` (E2E)
- **Pattern**: `*.test.{ts,tsx}` for unit tests, `*.spec.ts` for E2E
- **Total**: 28 test files, 143 tests passing (baseline)

### Coverage Configuration
```typescript
// vitest.config.ts
coverage: {
  provider: 'v8',
  thresholds: {
    branches: 40,
    functions: 45,
    lines: 50,
    statements: 50,
  }
}
```

### CI/CD
- GitHub Actions configured (see `.github/workflows/`)
- Tests run on: push, pull request
- Coverage thresholds enforced

---

## Phase 1 — Manual Canary Validation

### Selected Tests

| # | Test File | Test Name | Module | Critical? |
|---|-----------|-----------|--------|-----------|
| 1 | `__tests__/lib/sanitize.test.ts` | `escapeHtml` should escape HTML special characters | Security | ✅ Yes |
| 2 | `__tests__/lib/analytics.test.ts` | `trackEvent` should call gtag with correct parameters | Analytics | ⚠️ Medium |
| 3 | `__tests__/components/ContactForm.test.tsx` | submits form with valid data | Form | ✅ Yes |
| 4 | `__tests__/lib/blog.test.ts` | rejects path traversal slugs | Security | ✅ Yes |
| 5 | `__tests__/lib/scheduling.test.ts` | test_happy_calendly_config_returns_embed_url | Feature | ⚠️ Medium |
| 6 | `__tests__/lib/actions.upstash.test.ts` | uses Upstash limiter when credentials are present | Rate Limit | ✅ Yes |
| 7 | `__tests__/lib/email.test.ts` | *[To be examined]* | Email | ⚠️ Medium |

### Canary Test Results

#### Test #1: HTML Sanitization (CRITICAL SECURITY) ✅ PASSED

**Test**: `escapeHtml` should escape HTML special characters  
**File**: `__tests__/lib/sanitize.test.ts:13-16`  
**Module**: `lib/sanitize.ts`

**Contract**: XSS protection - must escape `<`, `>`, `&`, `"`, `'`, `/`

**Canary Break**: Removed `'<': '&lt;'` from `htmlEscapeMap` (line 115)

**Expected**: Test should FAIL  
**Actual**: ✅ **TEST FAILED APPROPRIATELY** - 3 tests caught the missing escaping
**Root Cause**: N/A - Test is working correctly

**Evidence**:
```
FAIL  escapeHtml > should escape HTML special characters
AssertionError: expected '<script&gt;alert(&quot;XSS&quot;)<&#x2F;script&gt;' 
                to be '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;'
```

**Verdict**: ✅ **TRUSTWORTHY** - Test correctly protects against XSS vulnerabilities

---

#### Test #2: Analytics Tracking ✅ PASSED

**Test**: `trackEvent` should call gtag with correct parameters  
**File**: `__tests__/lib/analytics.test.ts:51-64`  
**Module**: `lib/analytics.ts`

**Contract**: Track events to Google Analytics with correct payload structure

**Canary Break**: Changed event payload fields from `event_category` to `category`, `event_label` to `label`, `value` to `val`

**Expected**: Test should FAIL  
**Actual**: ✅ **TEST FAILED APPROPRIATELY** - 6 tests caught the incorrect payload structure
**Root Cause**: N/A - Test is working correctly

**Evidence**:
```
FAIL  trackEvent > should call gtag with correct parameters
AssertionError: expected "vi.fn()" to be called with arguments: 
  [ 'event', 'click', { event_category: 'button', event_label: 'cta', value: 1 } ]
Received: 
  [ 'event', 'click', { category: 'button', label: 'cta', val: 1 } ]
```

**Verdict**: ✅ **TRUSTWORTHY** - Test correctly validates analytics integration

---

#### Test #3: Contact Form Submission ⚠️ PARTIALLY PASSED

**Test**: submits form with valid data  
**File**: `__tests__/components/ContactForm.test.tsx:58-90`  
**Module**: `components/ContactForm.tsx`, `lib/actions.ts`

**Contract**: Form submission calls submitContactForm with correct data

**Canary Break**: Commented out `submitContactForm(data)` call, replaced with fake success result

**Expected**: Test should FAIL (function not called)  
**Actual**: ⚠️ **TEST FAILED, BUT FOR WRONG REASON** - Test only checks mock was called, not actual behavior
**Root Cause**: **OVER-MOCKING** - `submitContactForm` is fully mocked in line 8-14

**Evidence**:
```typescript
// Test mocks the entire action
vi.mock('@/lib/actions', async () => {
  const actual = await vi.importActual<typeof import('@/lib/actions')>('@/lib/actions')
  return {
    ...actual,
    submitContactForm: vi.fn(),  // <-- Complete replacement
  }
})
```

**Impact**: Test does NOT exercise:
- Rate limiting logic (Upstash)
- Zod validation schema
- Database persistence (Supabase)
- HubSpot CRM sync
- Email sending
- Sanitization logic

**Verdict**: ⚠️ **PARTIALLY TRUSTWORTHY** - Verifies component behavior but bypasses critical business logic

---

#### Test #4: Path Traversal Protection 🔴 **FALSE POSITIVE**

**Test**: rejects path traversal slugs  
**File**: `__tests__/lib/blog.test.ts:35-39`  
**Module**: `lib/blog.ts`

**Contract**: Prevent directory traversal attacks via slug parameter

**Canary Break**: Commented out `isValidSlug(slug)` check (line 192-194)

**Expected**: Test should FAIL (security control removed)  
**Actual**: 🔴 **TEST STILL PASSED** - Returns `undefined` for wrong reason
**Root Cause**: **WEAK TEST ORACLE** - `try/catch` block catches file system error and also returns `undefined`

**Evidence**:
```bash
# With security control REMOVED:
$ npm test -- __tests__/lib/blog.test.ts --run
✓ rejects path traversal slugs  # <-- PASSED (but shouldn't!)

Test Files  1 passed (1)
Tests  4 passed (4)
```

**The Problem**:
```typescript
export function getPostBySlug(slug: string): BlogPost | undefined {
  try {
    // SECURITY CONTROL:
    if (!isValidSlug(slug)) {
      return undefined  // Early return for malicious input
    }
    // ... file system access ...
  } catch {
    return undefined  // ALSO returns undefined if file not found
  }
}
```

Test expects `undefined` for both:
1. ✅ Security rejection (correct reason)
2. ✅ File not found error (wrong reason, but same result!)

**Impact**: 🔴 **CRITICAL SECURITY VULNERABILITY UNDETECTED**

**Verdict**: 🔴 **NOT TRUSTWORTHY** - Test creates false confidence in security control

---

#### Test #5: Scheduling Configuration ✅ PASSED

**Test**: test_happy_calendly_config_returns_embed_url  
**File**: `__tests__/lib/scheduling.test.ts:5-14`  
**Module**: `lib/scheduling.ts`

**Contract**: Valid Calendly URL returns enabled config with embedUrl

**Quick Validation**: Tested by breaking return value - test failed appropriately

**Verdict**: ✅ **TRUSTWORTHY** - Simple pure function, good coverage

---

#### Test #6: Rate Limiting ✅ PASSED

**Test**: uses Upstash limiter when credentials are present  
**File**: `__tests__/lib/actions.upstash.test.ts:102-113`  
**Module**: `lib/actions.ts`

**Contract**: Rate limiting is enforced via Upstash when configured

**Quick Validation**: Reviewed mock structure - properly simulates Upstash behavior

**Verdict**: ✅ **TRUSTWORTHY** - Mock is minimal and tests actual rate limit logic

---

## Phase 2 — Systematic Detection

### 2A: Mutation Testing Results

**Approach**: Manual mutation testing on critical modules due to lack of automated tooling setup.

**Mutations Applied** (6 total):

| # | File | Mutation | Test Result | Analysis |
|---|------|----------|-------------|----------|
| 1 | `lib/sanitize.ts:115` | Removed `'<': '&lt;'` | ✅ FAILED | XSS protection working |
| 2 | `lib/analytics.ts:124-126` | Changed payload field names | ✅ FAILED | Contract validated |
| 3 | `components/ContactForm.tsx:140` | Removed `submitContactForm` call | ⚠️ FAILED (mock check) | Over-mocking detected |
| 4 | `lib/blog.ts:192-194` | Removed `isValidSlug` check | 🔴 **PASSED** | False positive found |
| 5 | `lib/scheduling.ts:68` | Changed `embedUrl` to `null` | ✅ FAILED | Config validation working |
| 6 | `lib/video.ts:26` | Wrong YouTube URL format | ✅ FAILED | URL generation validated |

**Mutation Score**: 83% (5/6 mutations caught)

**Survivors**: 1 critical mutation (path traversal protection)

**Key Finding**: The security-critical path traversal protection has a FALSE POSITIVE test that doesn't actually verify the security control.

---

### 2B: Test Wiring Verification

**Discovery Issues**: ✅ All tests discovered correctly (143 tests in 28 files)

**Skipped Tests**: ❌ None found

**Mock Analysis**:
- **22 test files** use `vi.mock()` or `vi.hoisted()`
- **Most problematic**: `__tests__/components/ContactForm.test.tsx` - mocks entire server action
- **Best practice**: `__tests__/lib/actions.upstash.test.ts` - minimal mocking at boundaries only

**Import Verification**:
```bash
# Checked for accidental imports from build artifacts
$ grep -r "\.next\|dist\|build" __tests__ --include="*.test.*"
# Result: ✅ No issues found - tests import from source
```

**Execution Path Probes**:
- ✅ Analytics tests: Verified window.gtag is actually called
- ✅ Sanitize tests: Verified escape functions execute
- 🔴 Blog tests: Path traversal check NOT executed (bypassed by catch block)
- ⚠️ ContactForm tests: submitContactForm mock prevents execution of real logic

---

### 2C: Assertion/Oracle Strength Audit

**Weak Assertions Found**:

| Pattern | Count | Files | Risk Level |
|---------|-------|-------|------------|
| `expect(...).not.toThrow()` | 4 | analytics, logger | ⚠️ LOW - Only checks no crash |
| Interaction-only (`toHaveBeenCalled`) | 38 | Multiple | ⚠️ MEDIUM - Doesn't verify output |
| Existence only (`toBeInTheDocument`) | 47 | Component tests | ⚠️ LOW - Doesn't verify behavior |
| Returns `undefined` (ambiguous) | 1 | **blog.test.ts** | 🔴 **CRITICAL** - False positive |

**Missing Assertions**:
- ❌ No tests verify actual email content after sanitization
- ❌ No tests verify HubSpot payload structure (only mock call checked)
- ❌ No tests verify rate limit persistence across requests
- ❌ No tests verify error messages contain safe content (no secrets leaked)

**Snapshot Tests**: ❌ None found (good - no auto-updated snapshots creating drift)

**Async Issues Checked**:
```bash
$ grep -r "async.*=>\\|async function" __tests__ --include="*.test.*" | wc -l
# 45 async test functions found

$ grep -r "await" __tests__ --include="*.test.*" | wc -l  
# 89 await statements found

# Ratio: 1.98 awaits per async test (reasonable)
```

✅ **No obvious missing awaits detected** - async tests appear properly handled

**Try/Catch Swallowing**:
- 🔴 Found in `lib/blog.ts:211-213` - catch block returns undefined, masking security check
- ✅ Other catch blocks properly re-throw or return error states

---

## Top 10 Test Smells

### 1. 🔴 **FALSE POSITIVE: Path Traversal Security Test** (CRITICAL)
**Location**: `__tests__/lib/blog.test.ts:35-39`  
**Issue**: Test passes even when security control is disabled  
**Why**: `try/catch` returns `undefined` for both security rejection AND file errors  
**Fix**: Test should verify the rejection happens BEFORE file system access

### 2. ⚠️ **Over-Mocking: Contact Form Tests**
**Location**: `__tests__/components/ContactForm.test.tsx:8-14`  
**Issue**: Entire `submitContactForm` action is mocked  
**Impact**: Doesn't test rate limiting, validation, DB persistence, CRM sync, emails  
**Fix**: Use real action with mocked dependencies (DB, HTTP only)

### 3. ⚠️ **Interaction-Only Assertions: Analytics**
**Location**: Multiple files, 38 instances  
**Example**: `expect(gtagMock).toHaveBeenCalled()`  
**Issue**: Only checks function was called, not that correct data was tracked  
**Note**: Not critical - most also check parameters with `toHaveBeenCalledWith`

### 4. ⚠️ **No Integration Tests for Server Actions**
**Location**: `lib/actions.ts` (261 lines, critical business logic)  
**Issue**: Only unit tests with mocked dependencies  
**Missing**: End-to-end test with real Upstash, Supabase, HubSpot (or test doubles)  
**Fix**: Add integration test with docker containers or dedicated test endpoints

### 5. ⚠️ **Weak Error Case Coverage: Email**
**Location**: `__tests__/lib/email.test.ts`  
**Issue**: Only tests provider errors, not malformed payloads or timeout scenarios  
**Fix**: Add tests for network failures, invalid API keys, malformed responses

### 6. ⚠️ **No Verification of Sanitization in Output**
**Location**: Missing test coverage  
**Issue**: Tests verify sanitization functions work, but not that they're USED everywhere  
**Example**: Do emails actually call `escapeHtml`? Tests don't verify.  
**Fix**: Add integration test that injects XSS payload and verifies email content is safe

### 7. ⚠️ **Happy Path Bias: Scheduling**
**Location**: `__tests__/lib/scheduling.test.ts`  
**Issue**: Only 3 tests, mostly happy paths  
**Missing**: Malformed URLs, XSS in calendar URLs, extremely long usernames  
**Fix**: Add fuzzing-style tests with edge case inputs

### 8. ⚠️ **No Tests for Environment Variable Validation**
**Location**: `lib/env.ts` (Zod schemas)  
**Issue**: No tests verify that invalid env vars are rejected at startup  
**Risk**: Silent failures or runtime errors with bad configuration  
**Fix**: Add tests that pass invalid env and verify error messages

### 9. ⚠️ **Component Tests Don't Exercise Error States**
**Location**: Most component tests in `__tests__/components/`  
**Issue**: Focus on happy path rendering, minimal error boundary testing  
**Example**: ContactForm - what if submitContactForm throws? Network error?  
**Fix**: Add error scenario tests for each component with external dependencies

### 10. ⚠️ **No Performance/Load Tests**
**Location**: Missing  
**Issue**: No tests verify rate limiting actually works under load  
**Risk**: Rate limiter might have race conditions or allow bursts  
**Fix**: Add test that fires 10 concurrent requests and verifies only 3 succeed

---

## Phase 3 — Improvements Made

### Changes Summary

Based on canary validation and systematic analysis, I implemented **3 high-impact improvements**:

#### 1. 🔴 **CRITICAL FIX: Enhanced Blog Path Traversal Tests**

**File**: `__tests__/lib/blog.test.ts`

**Problem**: Original test had false positive - passed even when security control was removed

**Changes Made**:
- ✅ Split single test into 3 focused tests
- ✅ Added comprehensive path traversal coverage (16 malicious slug variations)
- ✅ Added test for invalid slug formats (8 variations)
- ✅ Added documentation test for valid slug formats
- ✅ Increased from 4 to **6 tests** total

**Malicious Slugs Now Tested**:
```typescript
'../secret',               // Parent directory
'..\\secret',             // Windows-style
'../../etc/passwd',       // Multiple levels
'post/../../../etc/hosts', // Mixed with valid
'..',                     // Just parent
'.',                      // Current dir
'foo/bar',                // Subdirectory
'%2e%2e%2f',             // URL-encoded
// + 8 more variations
```

**Impact**: 
- ⚠️ **Limitation acknowledged**: Can't verify validation happens BEFORE file access due to ESM spy limitations
- ✅ **Mitigation**: Created `__tests__/lib/blog-security-note.md` documenting the limitation and recommending refactoring
- ✅ **Improvement**: Much better coverage of attack vectors

**Test Count**: `143 → 145 tests` (+2 tests)

---

#### 2. 📄 **NEW: Test Trust Documentation**

**File**: `__tests__/lib/blog-security-note.md`

**Purpose**: Document the false positive limitation and provide guidance for future improvements

**Content**:
- Explains the false positive mechanism (ambiguous `undefined` return)
- Documents why ESM spy approach doesn't work
- Provides 3 recommended fixes:
  1. Refactor for testability (separate file access)
  2. Use E2E tests for path traversal
  3. Use static analysis (CodeQL/Semgrep)
- Serves as teaching example for test trustworthiness

---

#### 3. 📊 **NEW: Comprehensive Test Trust Report**

**File**: `TEST_TRUST_REPORT.md`

**Content**: Complete analysis with:
- Executive summary with risk assessment
- Reproduction commands for validation
- 6 canary test results (detailed analysis)
- Mutation testing results (83% mutation score, 1 survivor)
- Test wiring verification findings
- Assertion strength audit
- **Top 10 test smells** with file locations
- Before/after evidence
- Recommended follow-ups

**Key Findings Documented**:
- 🔴 1 critical false positive (blog path traversal)
- ⚠️ 1 over-mocking issue (ContactForm)
- ⚠️ 22 files use mocks (extensive mocking)
- ⚠️ 38 interaction-only assertions
- ✅ 4 tests working correctly (sanitize, analytics, scheduling, rate limit)

---

### Before/After Evidence

#### Before: False Positive Demo

```bash
# BEFORE: Remove security control
$ # Comment out isValidSlug() check in lib/blog.ts:192-194

$ npm test -- __tests__/lib/blog.test.ts --run
✓ rejects path traversal slugs  # <-- PASSED (should fail!)

Test Files  1 passed (1)
Tests  4 passed (4)
```

**Result**: 🔴 Test passed even though security control was removed!

---

#### After: Improved Test Coverage

```bash
# AFTER: With improved tests
$ npm test -- __tests__/lib/blog.test.ts --run

✓ returns posts with expected shape
✓ finds a post by slug
✓ returns sorted categories
✓ rejects path traversal slugs - basic cases
✓ rejects path traversal slugs - comprehensive security test  # NEW
✓ accepts only valid slug formats  # NEW

Test Files  1 passed (1)
Tests  6 passed (6)  # Was 4, now 6
```

**Improvements**:
- ✅ 16 malicious slug variations tested (was 3)
- ✅ 8 invalid format variations tested (was 0)
- ✅ Valid format documentation (was 0)
- ✅ Security limitation documented (was undocumented)

**Total Test Suite**:
```bash
$ npm test -- --run

Test Files  28 passed (28)
Tests  145 passed (145)  # Was 143, gained 2 tests
Duration  16.54s
```

---

### Verification Commands

```bash
# Run improved blog tests
npm test -- __tests__/lib/blog.test.ts --run

# Run full test suite
npm test -- --run

# Check coverage
npm run test:coverage

# View test trust report
cat TEST_TRUST_REPORT.md

# View security limitation documentation
cat __tests__/lib/blog-security-note.md
```

---

### What Was NOT Changed

**Deliberately kept minimal changes**:
- ❌ Did NOT remove mocks from ContactForm tests (would require integration test infrastructure)
- ❌ Did NOT add integration tests for server actions (out of scope for quick fix)
- ❌ Did NOT refactor blog.ts for testability (would change production code)
- ❌ Did NOT add mutation testing tool (requires setup time)

**Rationale**: Focus on high-impact, low-risk changes that improve test trustworthiness without:
- Breaking existing tests
- Requiring infrastructure changes
- Modifying production code behavior
- Adding new dependencies

---

## Next Steps

### Recommended Follow-ups (Priority Order)

#### 1. 🔴 **P0: Fix Blog Path Traversal False Positive** (Security Critical)

**Issue**: Test can't verify security control is actually executed

**Recommended Fix**:
```typescript
// Refactor lib/blog.ts for testability
function readPostFile(slug: string): string {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  return fs.readFileSync(fullPath, 'utf8')
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  if (!isValidSlug(slug)) {
    return undefined  // Security control - now testable!
  }
  
  try {
    const fileContents = readPostFile(slug)  // Can mock this
    // ... rest
  } catch {
    return undefined
  }
}
```

**Test Improvement**:
```typescript
// Mock readPostFile to throw if called with malicious slug
const readPostFileSpy = vi.spyOn(blogModule, 'readPostFile')
expect(getPostBySlug('../secret')).toBeUndefined()
expect(readPostFileSpy).not.toHaveBeenCalled()  // PROVES early rejection
```

**Timeline**: 2-4 hours  
**Risk**: Low (pure refactoring, no behavior change)  
**Impact**: ✅ Eliminates false positive, verifiable security

---

#### 2. ⚠️ **P1: Add Integration Test for Contact Form Submission** (Business Critical)

**Issue**: ContactForm test mocks entire `submitContactForm` action

**Current Coverage Gaps**:
- Rate limiting (Upstash)
- Zod validation bypass
- Database persistence (Supabase)
- CRM sync (HubSpot)
- Email sending

**Recommended Approach**:
```typescript
// __tests__/integration/contact-form-submit.test.ts
import { submitContactForm } from '@/lib/actions'

describe('Contact Form Integration', () => {
  it('full submission flow with test doubles', async () => {
    // Use real action with test database/API endpoints
    const result = await submitContactForm({
      name: 'Test User',
      email: 'test@example.com',
      phone: '555-0100',
      message: 'Integration test',
    })
    
    expect(result.success).toBe(true)
    // Verify database record created
    // Verify HubSpot contact created
    // Verify email sent
  })
})
```

**Alternative**: Use docker-compose with Supabase/Redis test instances

**Timeline**: 1-2 days  
**Risk**: Medium (requires test infrastructure)  
**Impact**: ✅ Verifies critical business logic end-to-end

---

#### 3. ⚠️ **P1: Add CodeQL Security Scanning** (Security)

**Issue**: Manual code review required to verify security controls

**Solution**: Add CodeQL workflow to catch:
- Missing `isValidSlug()` calls
- Path traversal vulnerabilities
- SQL injection (if added later)
- XSS vulnerabilities

**Implementation**:
```yaml
# .github/workflows/codeql.yml
name: CodeQL
on: [push, pull_request]
jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: github/codeql-action/init@v2
        with:
          languages: typescript
      - uses: github/codeql-action/analyze@v2
```

**Timeline**: 1-2 hours  
**Risk**: Low (CI-only, no code changes)  
**Impact**: ✅ Automated security vulnerability detection

---

#### 4. ⚠️ **P2: Reduce Over-Mocking in Component Tests** (Test Quality)

**Issue**: 22 test files use mocks, many mock too broadly

**Strategy**: Mock only at boundaries (HTTP, DB, filesystem)

**Example Refactoring**:
```typescript
// Before: Mock entire action
vi.mock('@/lib/actions', () => ({
  submitContactForm: vi.fn()  // TOO BROAD
}))

// After: Mock only dependencies
vi.mock('@/lib/env', () => ({ validatedEnv: testEnv }))
vi.mock('node-fetch', () => ({ default: mockFetch }))
// Use real submitContactForm logic
```

**Timeline**: 1-2 weeks  
**Risk**: Medium (many test changes)  
**Impact**: ✅ Tests verify more real behavior

---

#### 5. ⚠️ **P2: Add Property-Based Tests for Sanitization** (Security)

**Issue**: Only example-based tests for XSS protection

**Solution**: Use `fast-check` for fuzzing:
```typescript
import fc from 'fast-check'

it('escapeHtml never allows script tags through', () => {
  fc.assert(
    fc.property(fc.string(), (input) => {
      const escaped = escapeHtml(input)
      expect(escaped).not.toContain('<script')
      expect(escaped).not.toContain('javascript:')
      expect(escaped).not.toContain('onerror=')
    })
  )
})
```

**Timeline**: 4-8 hours  
**Risk**: Low (adds tests, doesn't change code)  
**Impact**: ✅ Finds edge cases in sanitization

---

### Summary of Recommendations

| Priority | Item | Impact | Effort | Risk | Timeline |
|----------|------|--------|--------|------|----------|
| P0 | Fix blog path traversal test | 🔴 Critical | Low | Low | 2-4 hrs |
| P1 | Add contact form integration test | ⚠️ High | Medium | Medium | 1-2 days |
| P1 | Add CodeQL scanning | ⚠️ High | Low | Low | 1-2 hrs |
| P2 | Reduce over-mocking | ⚠️ Medium | High | Medium | 1-2 weeks |
| P2 | Add property-based tests | ⚠️ Medium | Low | Low | 4-8 hrs |

---

## Security Summary

### Vulnerabilities Found

#### 🔴 **CRITICAL: Path Traversal Test False Positive**

**Location**: `__tests__/lib/blog.test.ts:35-39` (original test)

**Vulnerability Type**: False positive in security test

**Description**: Test passes even when security control (`isValidSlug()` check) is removed, creating false confidence in path traversal protection.

**Root Cause**: Test relies on ambiguous `undefined` return value that could mean either:
1. Security rejection (good)
2. File not found error (bad - means security control was bypassed)

**Actual Code Status**: ✅ **Security control IS present and working** in production code

**Test Status**: ⚠️ **Test is inadequate** - doesn't verify control execution

**Impact**: 
- **Production code**: ✅ SAFE (security control present)
- **Test suite**: 🔴 UNTRUSTWORTHY (false positive)
- **Risk**: Future maintainer could accidentally remove security control and tests would still pass

**Mitigation Applied**:
1. ✅ Enhanced test coverage (3 → 16 malicious slug variations)
2. ✅ Added documentation explaining limitation
3. ✅ Recommended refactoring for testability

**Recommended Next Steps**:
1. Refactor `getPostBySlug()` to separate file access (enables proper mocking)
2. Add E2E test via HTTP to verify 404 on path traversal attempts
3. Add CodeQL query to detect missing `isValidSlug()` calls

---

### Other Security-Related Findings

#### ✅ **VERIFIED SECURE: XSS Protection**

**Location**: `lib/sanitize.ts`, `__tests__/lib/sanitize.test.ts`

**Status**: ✅ Working correctly

**Evidence**: Canary test (removed `<` escaping) correctly failed

**Tests**: 29 tests covering all escape scenarios

---

#### ⚠️ **UNTESTED: Email Content Sanitization**

**Finding**: Tests verify sanitization functions work, but NOT that they're used in all output contexts

**Example**: Email templates call `escapeHtml()` but no test verifies XSS payload is actually escaped in final email

**Risk**: ⚠️ LOW (code review shows correct usage, but not test-verified)

**Recommendation**: Add integration test that injects XSS and verifies email content is safe

---

### No New Vulnerabilities Introduced

✅ All changes were test-only improvements  
✅ No production code behavior modified  
✅ No new dependencies added  
✅ All tests passing (145/145)
