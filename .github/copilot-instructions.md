# GitHub Copilot Instructions

## Purpose
This repository is an **enterprise-grade Next.js application template** with an **AI-native governance framework**. The goal is to ship production-ready, secure, and well-documented web experiences quickly while preserving strict traceability and quality gates. See README.md for a full feature overview and system diagrams.

## Product Vision
- Deliver a **production-ready web app template** that is fast, accessible, and secure by default.
- Provide a **governance framework for AI-assisted development** that enforces traceability, testing, and safety.
- Enable teams to move quickly **without sacrificing reliability or clarity**.

## Architecture Principles
- **Performance-first**: Prefer Server Components, static generation, and edge-friendly patterns where possible.
- **Security-by-default**: Keep security headers, validation, and secret detection intact; never introduce secrets.
- **Consistency over novelty**: Follow existing patterns and naming conventions in the repo.
- **Governance compliance**: Use the `.repo/` framework for tasks, verification, and change traceability.

## Contribution Guidelines for AI
- **Read before change**: Follow `.repo/agents/QUICK_REFERENCE.md` and `.repo/policy/CONSTITUTION.md`.
- **Use command manifest**: Only run commands listed in `.repo/repo.manifest.yaml`.
- **Maintain traceability**: Link changes to `.repo/tasks/TODO.md` and keep acceptance criteria current.
- **Avoid scope creep**: Implement only what the active task requires.
- **Protect secrets**: Never add or log credentials, tokens, or real customer data.
- **Respect boundaries**: Keep changes localized and follow existing folder structures.

## Key Repository Areas
- `app/` — Next.js App Router pages and API routes.
- `components/` — UI components.
- `lib/` — Utilities, services, and shared logic.
- `content/` — Content and MDX sources.
- `.repo/` — Governance policies, tasks, and automation.

## Supporting Docs (Deep Context)
- `PRODUCT.md` — Product vision and roadmap.
- `docs/ARCHITECTURE.md` — System architecture details.
- `README.md` — Feature overview, architecture diagrams, and setup.
- `.repo/GOVERNANCE.md` — AI governance framework overview.

