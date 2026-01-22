# Contributing Guide

**Last Updated:** 2026-01-21  
**Related Tasks:** T-105 (Governance automation)

## Development Setup

### Prerequisites

- Node.js 20+ (v20-v22 recommended)
- npm 10+
- Git
- Audit tooling (optional but recommended for verification):
  - Lighthouse CLI (`npm install -g lighthouse`)
  - Playwright browsers (`npx playwright install --with-deps`)

Why: audit scripts (`npm run audit:lighthouse`, `npm run audit:a11y`) rely on these CLIs to produce
deterministic reports and catch regressions early.

### Installation

```bash
# Clone the repository
git clone https://github.com/TrevorPLam/your-dedicated-marketer.git
cd your-dedicated-marketer

# Install dependencies
npm install --legacy-peer-deps
```

### Local Development

```bash
# Start development server
npm run dev

# Run tests
npm run test

# Type check
npm run type-check

# Lint
npm run lint

# Lighthouse audit (requires dev server)
LIGHTHOUSE_BASE_URL=http://localhost:3000 npm run audit:lighthouse

# Accessibility audit (requires dev server)
A11Y_BASE_URL=http://localhost:3000 npm run audit:a11y

# Format code
npm run format
```

## Pre-Commit Hooks (Optional)

Pre-commit hooks can help catch issues before committing. They're optional but recommended.

### Setup with Husky

1. **Install Husky:**
   ```bash
   npm install --save-dev husky
   npx husky init
   ```

2. **Add pre-commit hook:**
   ```bash
   # Create .husky/pre-commit
   npx husky add .husky/pre-commit "npm run lint-staged"
   ```

3. **Install lint-staged:**
   ```bash
   npm install --save-dev lint-staged
   ```

4. **Add to package.json:**
   ```json
   {
     "lint-staged": {
       "*.{ts,tsx,js,jsx}": [
         "eslint --fix",
         "prettier --write"
       ],
       "*.{md,json,yml,yaml}": [
         "prettier --write"
       ]
     }
   }
   ```

### Manual Pre-Commit Checks

If you prefer not to use hooks, run these before committing:

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Lint
npm run lint

# Type check
npm run type-check

# Run tests
npm run test
```

## Code Style

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint rules (see `eslint.config.mjs`)
- Use Prettier for formatting
- Prefer functional components
- Use server components by default (Next.js App Router)

### File Naming

- Components: `PascalCase.tsx` (e.g., `ContactForm.tsx`)
- Utilities: `camelCase.ts` (e.g., `sanitize.ts`)
- Pages: `page.tsx` (Next.js convention)
- Tests: `*.test.ts` or `*.test.tsx`

## Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Maintenance tasks

**Examples:**
```
feat(contact): add rate limiting to contact form
fix(og): escape HTML in OG image titles
docs(deployment): update Cloudflare Pages instructions
```

## Pull Request Process

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Write code
   - Add tests
   - Update documentation

3. **Run checks:**
   ```bash
   npm run lint
   npm run type-check
   npm run test
   npm run build
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat(scope): your commit message"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request:**
   - Fill out PR template
   - Link related tasks from P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md
   - Wait for CI to pass
   - Request review if needed

## CI Checks

The CI pipeline runs on every PR and push to main:

- ✅ Type checking (`npm run type-check`)
- ✅ Linting (`npm run lint`)
- ✅ Tests (`npm run test`)
- ✅ Build (`npm run build`)
- ⚠️ Security audit (`npm audit`)
- ⚠️ TODO comment check (flags technical debt)

## Audit tooling notes

Common failures and fixes:
- `Lighthouse CLI not found` → install with `npm install -g lighthouse` or set `LIGHTHOUSE_BIN`.
- `Executable doesn't exist` (Playwright) → run `npx playwright install --with-deps`.
- `ECONNREFUSED` → ensure `npm run dev` is running or set `*_BASE_URL` env vars.

See `docs/TESTING_STRATEGY.md` and `docs/OBSERVABILITY.md` for the full audit checklist.

## Code Review Guidelines

### For Reviewers

- Check that tests pass
- Verify code follows style guidelines
- Ensure documentation is updated
- Check for security issues
- Verify no secrets are committed

### For Authors

- Keep PRs small and focused
- Write clear commit messages
- Link related tasks/issues
- Respond to feedback promptly
- Update documentation as needed

## Task Management

- **Task Source**: `P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md` is the single source of truth (by priority)
- **Creating Tasks**: Add to `P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md` following the task schema
- **Completing Tasks**: Mark as DONE and move to `TODOCOMPLETED.md`
- **TODO Comments**: Avoid TODO comments in code; use `P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md` instead

## Testing

### Unit Tests

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test -- --watch
```

### E2E Tests

```bash
# Run Playwright tests
npm run test:e2e
```

## Documentation

- Update relevant docs when making changes
- Follow existing documentation patterns
- Keep `README.md` and `docs/` accurate
- Document breaking changes in `CHANGELOG.md`

## Security

- **Never commit secrets** (API keys, tokens, credentials)
- Use environment variables for sensitive data
- Review security implications of new dependencies
- Report vulnerabilities responsibly

## Questions?

- Check `CODEBASECONSTITUTION.md` for governance rules
- Review `AGENTS.md` for agent-specific guidelines
- See `READMEAI.md` for AI operating instructions
- Check `P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md` for current tasks

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- Task tracking: T-105
