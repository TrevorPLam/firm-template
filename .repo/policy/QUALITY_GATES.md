# Quality Gates

## Overview

Quality gates ensure code meets minimum standards before merge. This document defines merge policy, hard gates, waiverable gates, coverage strategy, performance budgets, warnings policy, PR size limits, and required checks.

---

## Merge Policy

**Strategy**: `soft_block_with_auto_generated_waivers`

### How It Works

1. **Quality Gate Failure**: When a quality gate fails (e.g., coverage drop, performance regression)
2. **Auto-Waiver Generation**: System automatically generates a waiver document with:
   - Gate that failed
   - Failure details
   - Timestamp
   - PR reference
   - 30-day expiration date
3. **Merge Allowed**: PR can merge with waiver attached
4. **Tracking**: Waiver tracked in `/waivers/` directory
5. **Remediation**: Auto-task created to fix the issue within waiver expiration period

### Rationale

- Soft block prevents blocking critical work while maintaining visibility
- Auto-generation ensures all exceptions are documented
- Expiration creates urgency to fix issues
- Auto-task ensures follow-up happens

---

## Hard Gates (Non-Waiverable)

These gates **CANNOT** be waived. Failures block merge absolutely.

### 1. Security Baseline
- **Check**: Security scan for secrets, vulnerabilities, forbidden patterns
- **Failure**: Any security trigger detected
- **Action**: HITL required, must be resolved before merge
- **Why Non-Waiverable**: Security is non-negotiable

### 2. Secrets Prohibition
- **Check**: Secrets scanning for API keys, tokens, passwords
- **Failure**: Any secret detected in code or config
- **Action**: Remove secret, use secure storage, HITL review
- **Why Non-Waiverable**: Absolute prohibition (Constitution Article 1)

### 3. Build Success
- **Check**: Code must build without errors
- **Failure**: Build fails or produces errors
- **Action**: Fix build errors
- **Why Non-Waiverable**: Broken code cannot ship

### 4. HITL Items Resolution
- **Check**: All HITL items must be resolved or completed
- **Failure**: Pending or In Progress HITL items exist
- **Action**: Complete HITL items before merge
- **Why Non-Waiverable**: External dependencies must be resolved

---

## Waiverable Gates

These gates can be waived with auto-generated waivers. Waivers are temporary (30-day default expiration).

### 1. Test Coverage
- **Check**: Coverage must not decrease from baseline
- **Failure**: Coverage drops below previous level
- **Waiver Conditions**: 
  - Test flakiness (must be fixed within 30 days)
  - Refactoring (coverage improvement task created)
  - Prototype feature (must add tests before GA)
- **Auto-Task**: Add tests to restore coverage

### 2. Performance Budgets
- **Check**: Bundle size, load time, memory usage within budgets
- **Failure**: Budget exceeded
- **Waiver Conditions**:
  - Essential dependency (optimize within 30 days)
  - Feature complexity (create optimization task)
  - Budget needs adjustment (requires ADR + approval)
- **Auto-Task**: Optimize or adjust budget

### 3. Complexity Metrics
- **Check**: Cyclomatic complexity, function length within limits
- **Failure**: Complexity exceeds threshold
- **Waiver Conditions**:
  - Inherent complexity (document why)
  - Refactoring planned (must complete within 30 days)
- **Auto-Task**: Refactor to reduce complexity

### 4. Documentation Coverage
- **Check**: Public APIs documented
- **Failure**: Undocumented public API
- **Waiver Conditions**:
  - Internal API (must document within 30 days)
  - Prototype (must document before GA)
- **Auto-Task**: Add documentation

---

## Coverage Strategy

**Strategy**: `gradual_ratchet`

### How It Works

1. **Baseline**: Current coverage percentage is baseline (e.g., 75%)
2. **New Code**: New code must have coverage ≥ baseline
3. **Ratchet Up**: Coverage can increase (new baseline)
4. **Ratchet Down**: Coverage CANNOT decrease without waiver
5. **Tracking**: Coverage tracked per PR in CI

### Benefits

- Prevents coverage erosion over time
- Encourages incremental improvement
- No sudden "100% coverage" requirement
- Realistic and achievable

### Example

```
Current baseline: 75%
PR adds code, coverage: 76% → ✅ Pass, new baseline: 76%
PR adds code, coverage: 75% → ✅ Pass, baseline stays 75%
PR adds code, coverage: 74% → ❌ Fail, waiver generated
```

---

## Performance Budgets

**Strategy**: `strict_with_fallback_to_default`

### How It Works

1. **Budgets Defined**: Bundle size, load time, memory usage limits defined in manifest
2. **Strict Enforcement**: Exceeding budget fails gate
3. **Fallback**: If budget not defined, use default limits
4. **Waiver**: Budget exceeded → auto-waiver + optimization task

### Default Budgets

```yaml
bundle_size:
  total: 500kb
  js: 300kb
  css: 100kb
  images: 100kb

load_time:
  first_contentful_paint: 1.5s
  time_to_interactive: 3.0s
  
memory:
  heap_size: 50mb
```

### Rationale

- Performance is a feature
- Budgets prevent performance regression
- Fallback ensures checks run even without custom budgets
- Waivers allow exceptions with visibility

---

## Warnings Policy

**Policy**: Zero warnings tolerated

### Rules

1. **Build Warnings**: No compiler/build warnings allowed
2. **Lint Warnings**: No linter warnings allowed
3. **Test Warnings**: No test framework warnings allowed
4. **Deprecation Warnings**: Must be addressed or explicitly suppressed with justification

### Enforcement

- Warnings treated as errors in CI
- PR fails if warnings exist
- No waivers for warnings (fix them)

### Rationale

- Warnings become noise that gets ignored
- "Just one warning" multiplies over time
- Zero warnings creates clean signal

---

## PR Size Policy

**Policy**: PRs should be small and focused

### Recommended Limits

- **Files Changed**: ≤ 10 files ideal, ≤ 20 max
- **Lines Changed**: ≤ 300 lines ideal, ≤ 500 max
- **Review Time**: ≤ 30 minutes ideal

### Exceptions

Large PRs (> 20 files or > 500 lines) require:
1. **Justification**: Why PR must be large
2. **Breakdown**: Could it be split? If not, why?
3. **Extra Review Time**: Expect slower review cycle

### Rationale

- Small PRs are easier to review
- Faster feedback cycle
- Lower risk
- Easier to revert if needed

---

## Required Checks

All PRs must pass these checks before merge:

### 1. Build
- **Command**: From manifest `commands.check:quick`
- **Requirement**: Must complete successfully
- **Waiverable**: No

### 2. Tests
- **Command**: From manifest `commands.check:ci`
- **Requirement**: All tests pass, no skipped tests without justification
- **Waiverable**: No (fix flaky tests)

### 3. Lint
- **Command**: From manifest linting command
- **Requirement**: No errors, no warnings
- **Waiverable**: No

### 4. Security
- **Command**: From manifest `commands.check:security`
- **Requirement**: No secrets, no vulnerabilities, no forbidden patterns
- **Waiverable**: No

### 5. Governance
- **Command**: From manifest `commands.check:governance`
- **Requirement**: All governance rules pass (filepaths, change type, ADR triggers, etc.)
- **Waiverable**: Some (e.g., documentation coverage)

### 6. Boundaries
- **Command**: From manifest `commands.check:boundaries`
- **Requirement**: No boundary violations
- **Waiverable**: Yes (with ADR + justification)

### 7. Coverage
- **Command**: Coverage tool from manifest
- **Requirement**: Coverage ≥ baseline
- **Waiverable**: Yes (30-day waiver + auto-task)

### 8. Performance
- **Command**: Performance testing from manifest
- **Requirement**: Within budgets
- **Waiverable**: Yes (30-day waiver + optimization task)

---

## Verification Profiles

Different verification levels for different situations:

### Quick Profile
- **Usage**: Local development, pre-commit
- **Checks**: Build + lint + fast unit tests
- **Time**: < 5 minutes

### CI Profile
- **Usage**: Every PR
- **Checks**: Quick + full test suite + coverage
- **Time**: < 15 minutes

### Release Profile
- **Usage**: Pre-release
- **Checks**: CI + security scan + performance tests + governance checks
- **Time**: < 30 minutes

### Governance Profile
- **Usage**: Governance verification only
- **Checks**: Governance rules + boundaries + ADR triggers
- **Time**: < 5 minutes

---

## Waiver Lifecycle

### 1. Generation
- Auto-generated when waiverable gate fails
- Includes: gate, reason, timestamp, PR, expiration

### 2. Storage
- Active waivers: `/waivers/`
- Historical waivers: `/waivers/historical/`

### 3. Tracking
- Waiver report shows all active waivers
- Approaching expiration triggers alerts

### 4. Expiration
- Default: 30 days
- Can be extended with justification
- Expired waivers block new merges

### 5. Resolution
- Auto-task created to fix issue
- Waiver resolved when issue fixed
- Waiver moved to historical archive

### 6. History
- Full lifecycle preserved in historical directory
- Audit trail for compliance

---

## Exception Process

### When to Request Exception

1. **Gate Too Strict**: Gate is unrealistic for legitimate reason
2. **Technical Limitation**: Tool limitation prevents compliance
3. **Business Urgency**: Critical fix needed immediately

### How to Request Exception

1. **Create HITL Item**: Document the request
2. **Provide Justification**: Explain why exception needed
3. **Propose Solution**: How will you address later?
4. **Get Approval**: Reviewer must approve
5. **Document**: ADR if exception becomes pattern

### Exception Tracking

- All exceptions tracked in waivers system
- Regular review of exceptions
- Patterns trigger policy update

---

## Enforcement

### Automated
- CI runs all checks automatically
- Failed checks block merge
- Waivers auto-generated for waiverable gates

### Human
- Reviewer verifies waiver justifications
- Reviewer can reject waiver if unjustified
- Reviewer approves exceptions

### Continuous
- Waiver reports generated weekly
- Expired waivers reviewed
- High waiver rate triggers governance review

---

**Version**: 2.2  
**Last Updated**: 2026-01-23  
**Authority**: Constitution Article 6 (Safety Before Speed)
