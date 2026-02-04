# Running Tests

Complete guide to running tests in this repository, from setup to debugging.

## Prerequisites

### Required Software

- **Node.js**: v20.x or later
- **pnpm**: v8.15.0 (installed automatically via corepack)
- **Git**: For cloning and version control

### First-Time Setup

```bash
# Clone the repository
git clone <repository-url>
cd firm-template

# Install dependencies (this also installs pnpm if needed)
pnpm install

# Install Playwright browsers (for E2E tests)
pnpm exec playwright install --with-deps
```

## Running Tests

### Run All Tests

```bash
# Run all unit tests across all packages
pnpm test

# Run with coverage
pnpm test -- --run --coverage
```

This uses Turborepo to run tests in all workspaces in parallel.

### Run Tests in a Specific Package

```bash
# Navigate to package
cd apps/web
pnpm test

# Or use Turbo's filter
pnpm test --filter @repo/web
```

### Run a Single Test File

```bash
# From package root
cd apps/web
pnpm test lib/sanitize.test.ts

# Or with full path
pnpm exec vitest run apps/web/lib/sanitize.test.ts
```

### Run Tests Matching a Pattern

```bash
# Run all tests with "sanitize" in the name
pnpm test sanitize

# Run all tests in a directory
cd apps/web
pnpm test lib/
```

### Watch Mode (Interactive)

```bash
# Start watch mode (re-runs tests on file changes)
cd apps/web
pnpm test:watch

# Or directly with vitest
pnpm exec vitest
```

In watch mode:
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `t` to filter by test name
- Press `p` to filter by file name
- Press `q` to quit

### Run with Coverage

```bash
# Generate coverage report
cd apps/web
pnpm test -- --coverage

# Open HTML coverage report
open coverage/index.html
```

## End-to-End Tests

### Run All E2E Tests

```bash
# Run all Playwright tests
pnpm exec playwright test

# Run in UI mode (interactive)
pnpm exec playwright test --ui

# Run in headed mode (see browser)
pnpm exec playwright test --headed
```

### Run Specific E2E Tests

```bash
# Run a specific test file
pnpm exec playwright test tests/e2e/smoke.spec.ts

# Run tests matching a pattern
pnpm exec playwright test smoke

# Run a specific test by name
pnpm exec playwright test -g "homepage loads"
```

### Debug E2E Tests

```bash
# Open Playwright inspector
pnpm exec playwright test --debug

# Run with trace viewer
pnpm exec playwright test --trace on
pnpm exec playwright show-trace trace.zip
```

## Accessibility Tests

```bash
# Run accessibility test suite
pnpm exec playwright test tests/accessibility

# Generate accessibility report
pnpm exec playwright test tests/accessibility --reporter=html
```

## Debugging Test Failures

### 1. Read the Error Message

Vitest provides clear error messages with:
- Expected vs actual values
- Stack traces
- Code snippets

### 2. Run in Debug Mode

```bash
# Add --inspect flag to debug in Chrome DevTools
node --inspect-brk node_modules/.bin/vitest run <test-file>
```

Then open `chrome://inspect` in Chrome.

### 3. Use VS Code Debugger

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "pnpm",
  "runtimeArgs": ["exec", "vitest", "run", "${file}"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

Set breakpoints and press F5.

### 4. Add Debug Logs

```typescript
import { describe, it, expect } from 'vitest'

it('debugs a test', () => {
  const result = myFunction()
  console.log('Result:', result) // Debug log
  expect(result).toBe(expected)
})
```

### 5. Isolate the Test

Use `.only` to run a single test:

```typescript
it.only('isolated test', () => {
  // This test runs alone
})
```

**Remember to remove `.only` before committing!**

### 6. Check Test Environment

```bash
# Verify Node version
node --version  # Should be v20+

# Clear Vitest cache
rm -rf node_modules/.vitest

# Reinstall dependencies
pnpm install --force
```

## Common Issues

### Issue: "Cannot find module"

**Solution**: Install dependencies or rebuild

```bash
pnpm install
pnpm build
```

### Issue: "Test timeout"

**Solution**: Increase timeout

```typescript
it('slow test', async () => {
  // Test code
}, 10000) // 10 second timeout
```

Or globally in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    testTimeout: 10000,
  },
})
```

### Issue: "Coverage below threshold"

**Solution**: See [20_COVERAGE.md](./20_COVERAGE.md) for coverage guidance.

### Issue: "Flaky test"

**Solution**: See [30_TEST_PATTERNS.md](./30_TEST_PATTERNS.md#avoiding-flaky-tests)

### Issue: "Module not found in monorepo"

**Solution**: Build dependencies first

```bash
# Build all packages in correct order
pnpm build

# Then run tests
pnpm test
```

## Performance Tips

### Faster Test Runs

1. **Run tests in parallel** (default in Vitest)
2. **Use watch mode** during development
3. **Filter to specific tests** you're working on
4. **Use Turbo cache**:
   ```bash
   # Turbo caches test results automatically
   pnpm test  # First run: slow
   pnpm test  # Subsequent: instant if no changes
   ```

### Faster Coverage

Coverage can be slow. Use strategically:

```bash
# Development: no coverage
pnpm test

# Before commit: check coverage
pnpm test -- --coverage

# CI: always runs coverage
```

## CI/CD

Tests run automatically on:
- Every pull request
- Every push to `main`
- Nightly builds

CI runs:
```bash
pnpm test -- --coverage
node scripts/ci/check-coverage-strict.js
```

Coverage must be 100% for CI to pass.

## Quick Reference

| Command | Description |
|---------|-------------|
| `pnpm test` | Run all unit tests |
| `pnpm test -- --coverage` | Run with coverage |
| `pnpm test:watch` | Watch mode (in package) |
| `pnpm exec playwright test` | Run E2E tests |
| `pnpm exec playwright test --ui` | E2E in UI mode |
| `pnpm exec playwright test --debug` | Debug E2E |
| `node scripts/ci/check-coverage-strict.js` | Check coverage enforcement |

## Next Steps

- **[20_COVERAGE.md](./20_COVERAGE.md)** - Understanding coverage requirements
- **[30_TEST_PATTERNS.md](./30_TEST_PATTERNS.md)** - Writing effective tests
- **[99_EXCEPTIONS.md](./99_EXCEPTIONS.md)** - Coverage exceptions
