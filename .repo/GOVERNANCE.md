# Governance Framework

## Authority Chain

This repository follows a strict authority hierarchy:

**Manifest > Agents > Policy > Standards > Product**

### 1. Manifest (Highest Authority)
- **Location**: `/.repo/repo.manifest.yaml`
- **Purpose**: Canonical source of truth for commands, verification profiles, and configuration
- **Authority**: Defines how the repository is built, tested, and verified

### 2. Agents
- **Location**: `/.repo/agents/`
- **Purpose**: Define agent capabilities, roles, and operational rules
- **Authority**: Controls what agents can and cannot do

### 3. Policy
- **Location**: `/.repo/policy/`
- **Purpose**: Authoritative rules and principles for governance
- **Authority**: Non-negotiable requirements (Constitution, Principles, Quality Gates, Security, Boundaries, HITL)

### 4. Standards
- **Location**: `/.repo/docs/standards/`
- **Purpose**: Technical standards for documentation, APIs, code style
- **Authority**: Implementation guidelines and best practices

### 5. Product
- **Location**: Repository code and documentation
- **Purpose**: Application code, features, and user-facing documentation
- **Authority**: Must comply with all above levels

## Core Requirements

### Non-Coder Plain English Requirement
All policy, governance, and procedural documents MUST be written in plain English that is accessible to non-technical stakeholders. This ensures:
- Business stakeholders can understand decisions
- Compliance and audit requirements are clear
- Human-in-the-loop processes are accessible to all
- No technical jargon barriers prevent participation

### Filepath Requirement
ALL artifacts that reference code or documentation MUST include absolute or relative filepaths. This applies to:
- Pull Requests (all changed files listed)
- Task Packets (files touched section required)
- Agent Logs (files modified tracked)
- ADRs (affected files documented)
- Waivers (specific files/rules referenced)

This ensures traceability, accountability, and context for all changes.

### Deliver Small Increments
All work MUST be broken into small, shippable increments:
- Each PR addresses ONE change type (P3)
- Changes are testable and verifiable independently
- Progress is visible through frequent commits
- Rollback is always possible
- Risk is minimized through incremental delivery

## Principles

This repository operates under 25 core principles (P3-P25) documented in `/.repo/policy/PRINCIPLES.md`. These principles guide all development work and decision-making.

Key principles include:
- **P3**: One Change Type Per PR
- **P4**: Make It Shippable
- **P6**: Evidence Over Vibes
- **P7**: UNKNOWN Is a First-Class State
- **P8**: Read Repo First
- **P22**: Waivers Rare + Temporary

See `/.repo/policy/PRINCIPLES.md` for complete documentation.

## Quality Gates

Merge policy and quality requirements are documented in `/.repo/policy/QUALITY_GATES.md`.

Key gates include:
- **Merge Policy**: Soft block with auto-generated waivers
- **Coverage Strategy**: Gradual ratchet (coverage cannot decrease)
- **Performance Budgets**: Strict with fallback to default
- **Warnings Policy**: Zero warnings tolerated
- **Required Checks**: Build, test, lint, security, governance

## Security Baseline

Security requirements are non-negotiable and documented in `/.repo/policy/SECURITY_BASELINE.md`.

Key requirements:
- **Secrets**: Absolute prohibition (no exceptions)
- **Dependency Vulnerabilities**: Always require HITL review
- **Security Checks**: Run on every PR
- **Forbidden Patterns**: Automatically detected and blocked

## Boundaries

Architectural boundaries enforce clean architecture using a hybrid_domain_feature_layer model, documented in `/.repo/policy/BOUNDARIES.md`.

Key rules:
- **Import Direction**: ui → domain → data → shared_platform
- **Cross-Feature**: Requires ADR
- **Enforcement**: Hybrid static checker + manifest
- **Violations**: Generate waiver + auto-task for remediation

## Human-In-The-Loop (HITL)

For decisions requiring human judgment, the HITL system is documented in `/.repo/policy/HITL.md`.

Key aspects:
- **Storage**: `/.repo/policy/HITL.md` (index) + `/.repo/hitl/` (items)
- **Categories**: External Integration, Clarification, Risk, Feedback, Vendor
- **Blocking**: Pending/In Progress HITL items block PR merge
- **Detection**: Keywords + manifest + change type analysis

## Waivers

Quality gate exceptions are handled through the waiver system:
- **Policy**: Waivers are rare and temporary (P22)
- **Generation**: Auto-generated for all quality gate failures
- **Lifecycle**: Full history tracking
- **Storage**: `/waivers/` (active) and `/waivers/historical/` (archived)

## Changes to Governance

Changes to this governance framework require:
1. ADR documenting the change and rationale
2. Review by repository maintainers
3. Update to affected documentation
4. Communication to all stakeholders

---

**Version**: 2.2  
**Last Updated**: 2026-01-23  
**Authority**: Solo Founder (per Constitution Article 1)
