# Architecture Decision Records (ADRs)

**Purpose:** Document significant architectural and cross-feature decisions.

**Last Updated:** 2026-02-04

**Link back**: [Architecture Documentation](../architecture/00_INDEX.md)

## Overview

This directory contains Architecture Decision Records (ADRs) for the Firm Template platform. ADRs capture important decisions made during development, including context, options considered, and rationale.

## What Gets an ADR?

Create an ADR when making decisions about:

- **Architecture:** Major structural changes (monorepo layout, package organization)
- **Technology:** Framework choices, library selections, tooling changes
- **Patterns:** Shared conventions across apps/packages
- **Security:** Authentication approaches, data handling policies
- **Integrations:** Third-party service selections
- **Performance:** Optimization strategies with trade-offs

## What Doesn't Need an ADR?

Skip ADRs for:
- Bug fixes (unless they reveal architectural issues)
- Routine feature additions using existing patterns
- Documentation updates
- Dependency version bumps (unless major changes)
- Styling or UI tweaks

## ADR Template

Use this template for new ADRs:

```markdown
# ADR-XXXX: [Decision Title]

**Status:** [Proposed | Accepted | Deprecated | Superseded]
**Date:** YYYY-MM-DD
**Authors:** [Name/Team]
**Related Tasks:** [Task IDs if applicable]

## Context

What is the situation and problem statement driving this decision?

## Decision

What is the change that we're proposing/announcing?

## Consequences

### Positive
- What becomes easier or better?

### Negative
- What trade-offs are we accepting?
- What becomes harder?

### Neutral
- What stays the same or is unaffected?

## Alternatives Considered

What other options did we evaluate?

### Option 1: [Name]
- **Pros:**
- **Cons:**
- **Why rejected:**

### Option 2: [Name]
- **Pros:**
- **Cons:**
- **Why rejected:**

## Implementation Notes

- Key files or packages affected
- Migration path (if applicable)
- Rollback plan (if risky)

## Related Decisions

- Links to related ADRs
- Links to relevant documentation
```

## Naming Convention

ADRs should be numbered sequentially and use descriptive titles:

```
ADR-0001-monorepo-structure.md
ADR-0002-design-token-system.md
ADR-0003-integration-adapter-pattern.md
```

## Current ADRs

_No ADRs exist yet. This is a starting point for future architectural decisions._

## Agent Workflow

When making cross-feature decisions:

1. Determine if the decision warrants an ADR (use "What Gets an ADR?" above)
2. If yes: create HITL asking for ADR approval with decision context
3. Once approved: create ADR using template
4. Reference ADR in related code comments and PRs

## References

- **ADR Format:** Based on Michael Nygard's ADR template
- **More on ADRs:** [https://adr.github.io/](https://adr.github.io/)
- **Agent Governance:** [.agents/AGENTS.toon](../../.agents/AGENTS.toon)
