# Contributing to firm-template

Thank you for your interest in contributing to firm-template! This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and professional in all interactions.

## Getting Started

### Prerequisites

- Node.js >=20 <23
- npm >=10
- Git

### Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/your-org/firm-template.git
   cd firm-template
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Development Workflow

### Before You Start

1. **Check current tasks:**
   - Review `.repo/tasks/TODO.md` for the current active task
   - Check `.repo/tasks/BACKLOG.md` for prioritized tasks

2. **Read relevant documentation:**
   - `.repo/policy/BESTPR.md` - Repository-specific best practices
   - `.repo/policy/CONSTITUTION.md` - Governance rules
   - `.repo/repo.manifest.yaml` - Command definitions

### Making Changes

1. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow coding standards:**
   - Use TypeScript for all new code
   - Follow existing code patterns
   - Write tests for new functionality
   - Update documentation as needed

3. **Run checks before committing:**
   ```bash
   npm run lint          # Check code quality
   npm run type-check    # Verify types
   npm run test          # Run tests
   npm run format        # Format code
   ```

4. **Commit your changes:**
   - Use clear, descriptive commit messages
   - Reference task numbers if applicable
   - Follow conventional commit format when possible

### Testing

#### Unit Tests

Write unit tests for new functionality:

```bash
npm run test
```

#### End-to-End Tests

Add E2E tests for user-facing features:

```bash
npm run test:e2e
```

#### Coverage

Maintain test coverage above thresholds:
- Branches: 40%
- Functions: 45%
- Lines: 50%
- Statements: 50%

### Code Style

- **Formatting:** Use Prettier (configured in project)
- **Linting:** Follow ESLint rules (configured in project)
- **TypeScript:** Use strict mode, avoid `any` types
- **Components:** Use functional components with TypeScript
- **Naming:** Use descriptive names, follow existing conventions

### Pull Request Process

1. **Before submitting:**
   - [ ] All tests pass (`npm run test && npm run test:e2e`)
   - [ ] Code is formatted (`npm run format`)
   - [ ] No linting errors (`npm run lint`)
   - [ ] Type checking passes (`npm run type-check`)
   - [ ] Build succeeds (`npm run build`)
   - [ ] Documentation updated if needed
   - [ ] Changes are traceable to a task (if applicable)

2. **Create pull request:**
   - Use descriptive title and description
   - Reference related issues or tasks
   - Include verification evidence
   - List all filepaths changed
   - Note any risks or breaking changes

3. **PR Review:**
   - Address review feedback promptly
   - Update PR if requested
   - Ensure all quality gates pass

### Repository Structure

Follow the established structure:

- **`app/`** - Next.js App Router routes and pages
- **`components/`** - Reusable React components
- **`lib/`** - Shared utilities and business logic
- **`content/`** - Content files (blog posts, markdown)
- **`public/`** - Static assets
- **`__tests__/`** - Unit tests
- **`tests/e2e/`** - End-to-end tests
- **`scripts/`** - Automation scripts

### Next.js Best Practices

- Use App Router structure (`app/` directory)
- Prefer Server Components by default
- Use Client Components only when needed (interactivity, hooks, browser APIs)
- Leverage Next.js built-in features (Image, metadata API, server actions)
- Follow Next.js conventions for routing and layouts

### Security Considerations

- Never commit secrets or credentials
- Validate all user input
- Use parameterized queries if using a database
- Follow security patterns in `middleware.ts`
- Review `.repo/policy/SECURITY_BASELINE.md` for security requirements

### Governance Framework

This repository uses an AI-native governance framework:

- **HITL (Human-in-the-Loop):** Required for risky changes
- **Quality Gates:** Automated checks must pass
- **Traceability:** Changes must be justified
- **Safety First:** Security and stability over speed

See `.repo/policy/` for detailed governance rules.

## Documentation

### Updating Documentation

- Keep documentation current with code changes
- Follow existing documentation structure
- Use clear, concise language
- Include code examples when helpful

### Documentation Structure

- **README.md** - Project overview (this file)
- **CONTRIBUTING.md** - Contribution guidelines (this file)
- **SECURITY.md** - Security policy
- **`.repo/`** - Governance framework documentation

## Questions?

- Review `.repo/GOVERNANCE.md` for framework overview
- Check `.repo/policy/HITL.md` for active human-in-the-loop items
- Create an issue for questions or clarifications

## Thank You!

Your contributions help make firm-template better for everyone. We appreciate your time and effort!
