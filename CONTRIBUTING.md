# Contributing to Firm Template

Thank you for your interest in contributing to the Firm Template repository! This document provides guidelines for contributing to this project.

## Quick Links

- [Platform overview](README.md)
- [Documentation index](docs/README.md)
- [Security policy](SECURITY.md)
- [ALIGNMENT Contribution Guidelines](.alignment/CONTRIBUTING.md) - Comprehensive guide for ALIGNMENT contributions

## Development Setup

### Prerequisites
- Node.js 20+
- pnpm 8+

### Quick Start
```bash
# Clone and setup
git clone <your-fork>
cd firm-template
pnpm install

# Start development
pnpm dev

# Run tests
pnpm test

# Check code quality
pnpm lint
```

### Project Structure
- `apps/` - Template applications (template-site, web, your-dedicated-marketer)
- `packages/` - Reusable template components (capabilities, integrations, patterns)
- `services/` - Backend template services
- `content/` - Template content and documentation
- `docs/` - Template documentation and guides

### 2. Contribution Process

1. Open an issue to discuss larger changes, or create a branch for small fixes.
2. Create a branch: `git checkout -b fix/short-description` or `feature/short-description`.
3. Make your changes. Follow existing code style (Prettier, ESLint).
4. Run `pnpm lint` and `pnpm test` before committing.
5. Commit with a clear message (Conventional Commits preferred: `fix:`, `feat:`, `docs:`).
6. Push and open a Pull Request targeting `main` or `develop`.

### 3. What We Look For

- **Code:** Matches existing patterns; passes lint and tests.
- **Docs:** Update README or docs when behavior or setup changes.
- **Tests:** Add or update tests for new or changed behavior when applicable.

### 4. Pull Request Guidelines

- Keep PRs focused and reasonably sized.
- Ensure CI passes (build, lint, test, security checks).
- Request review from code owners; see [.github/CODEOWNERS](.github/CODEOWNERS).

### 5. Project Structure

- **apps/** – Next.js applications (web, template-site, your-dedicated-marketer).
- **packages/** – Shared packages (ui, tokens, patterns, capabilities, integrations, utils, config).
- **docs/** – Project documentation.
- **Repo root** – Shared configuration (`tsconfig.base.json`, `turbo.json`, `pnpm-workspace.yaml`, `docker-compose.yml`).

For more detail, see [docs/PLATFORM.md](docs/PLATFORM.md).

## Questions or Issues?

- Open a GitHub issue for bugs, features, or questions.
- For security concerns, see [.github/SECURITY.md](.github/SECURITY.md).

## License

By contributing, you agree that your contributions will be licensed under the same terms as the project. See [LICENSE](LICENSE).
