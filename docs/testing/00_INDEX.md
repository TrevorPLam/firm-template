# Testing Documentation Index

## Overview

This repository enforces **100% test coverage** for all first-party, non-generated code. This documentation provides everything you need to understand, run, and contribute to our testing infrastructure.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run all tests
pnpm test

# Run tests with coverage
pnpm test -- --run --coverage

# Check coverage enforcement
node scripts/ci/check-coverage-strict.js
```

## Documentation Structure

### Core Guides

1. **[10_RUNNING_TESTS.md](./10_RUNNING_TESTS.md)** - How to run tests locally
   - Prerequisites and setup
   - Running individual tests
   - Running test suites
   - Debugging test failures
   - Using watch mode

2. **[20_COVERAGE.md](./20_COVERAGE.md)** - Coverage requirements and enforcement
   - What 100% coverage means
   - How coverage is computed
   - Exclusions and exceptions
   - Adding tests for new code
   - Coverage gates in CI

3. **[30_TEST_PATTERNS.md](./30_TEST_PATTERNS.md)** - Testing patterns and best practices
   - Unit test patterns
   - Integration test patterns
   - Component test patterns
   - Mocking strategies
   - Test data management
   - Anti-patterns to avoid

4. **[99_EXCEPTIONS.md](./99_EXCEPTIONS.md)** - Coverage exceptions register
   - Files exempt from 100% coverage
   - Justification for each exception
   - Mitigation strategies

### Additional Resources

- **[AI_CONTENT_TESTING.md](./AI_CONTENT_TESTING.md)** - AI-generated content testing strategies
- **[README.md](./README.md)** - Legacy testing strategy overview

## Test Layers

Our testing strategy follows the testing pyramid:

### 1. Unit Tests (Highest Volume)
- **Location**: Colocated with source files (`*.test.ts`, `*.test.tsx`)
- **Tool**: [Vitest](https://vitest.dev/)
- **Focus**: Pure functions, utilities, business logic
- **Speed**: Very fast (<1s per file)
- **Coverage**: 100% of testable code

### 2. Integration Tests
- **Location**: `tests/integration/`
- **Tool**: Vitest with test doubles
- **Focus**: Module interactions, API clients, data layers
- **Speed**: Fast to moderate
- **Coverage**: Critical integration points

### 3. End-to-End Tests
- **Location**: `tests/e2e/`
- **Tool**: [Playwright](https://playwright.dev/)
- **Focus**: Critical user journeys
- **Speed**: Slower (seconds to minutes)
- **Coverage**: Core user flows only

### 4. Specialized Tests
- **Accessibility**: `tests/accessibility/` (Playwright + axe-core)
- **Visual Regression**: `tests/visual/` (Playwright screenshots)
- **AI Content**: `tests/ai/` (Content generation validation)

## Test Organization

```
firm-template/
├── apps/
│   ├── web/
│   │   ├── lib/
│   │   │   ├── sanitize.ts
│   │   │   └── sanitize.test.ts       # Colocated unit tests
│   │   └── vitest.config.ts           # App-specific config
│   └── ...
├── packages/
│   ├── utils/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── index.test.ts          # Colocated unit tests
│   │   └── vitest.config.ts           # Package-specific config
│   └── ...
├── tests/
│   ├── e2e/                            # End-to-end tests
│   ├── integration/                    # Integration tests
│   ├── accessibility/                  # Accessibility tests
│   ├── visual/                         # Visual regression tests
│   ├── ai/                            # AI content tests
│   └── fixtures/                      # Shared test data
├── playwright.config.ts               # Playwright config
└── docs/testing/                      # This documentation
```

## Key Principles

### 1. No Fake Coverage
- Tests must assert behavior, not just execute code
- Every branch must be verified, not just reached
- Use meaningful assertions

### 2. No Disabling Tests
- Fix failing tests, don't skip them
- If a test is flaky, fix the test or the code
- Temporary skips must have GitHub issues

### 3. Coverage is Gated
- CI fails if coverage drops below 100%
- Local checks available before pushing
- No merges without passing coverage

### 4. Maintainable Tests
- Small, focused tests
- Clear test names
- Avoid test interdependencies
- Use factories for test data

### 5. Complete Documentation
- Beginners can run tests from scratch
- Clear troubleshooting guides
- Examples for common scenarios

## Tools and Technologies

- **Unit Tests**: [Vitest](https://vitest.dev/) - Fast, modern test runner
- **E2E Tests**: [Playwright](https://playwright.dev/) - Cross-browser automation
- **Coverage**: [@vitest/coverage-v8](https://vitest.dev/guide/coverage.html) - V8 coverage provider
- **Accessibility**: [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm) - Automated accessibility testing
- **Monorepo**: [Turborepo](https://turbo.build/) - Fast task orchestration

## Getting Help

### Common Issues

1. **Tests failing locally but passing in CI** → Check Node version, clear cache
2. **Coverage below 100%** → See [20_COVERAGE.md](./20_COVERAGE.md)
3. **Flaky E2E tests** → See [30_TEST_PATTERNS.md](./30_TEST_PATTERNS.md#e2e-patterns)
4. **Slow test runs** → Use watch mode, run specific tests

### Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Docs](https://testing-library.com/)
- Internal: `#engineering-testing` Slack channel

## Coverage Status

Current coverage status is enforced at **100%** for:
- ✅ All first-party TypeScript/TSX files
- ✅ Line coverage
- ✅ Branch coverage
- ✅ Function coverage
- ✅ Statement coverage

See [99_EXCEPTIONS.md](./99_EXCEPTIONS.md) for documented exceptions.
