# Operating Principles

## Global Rule: Filepaths Required Everywhere

**ALL** artifacts that reference code, documentation, or configuration MUST include absolute or relative filepaths. This is non-negotiable and applies to:

- **Pull Requests**: List all changed files with paths
- **Task Packets**: Include "Files Touched" section with paths
- **Agent Logs**: Track all modified files with paths
- **ADRs**: Document affected files with paths
- **Waivers**: Reference specific files/rules with paths
- **HITL Items**: Include relevant file paths for context

**Why**: Filepaths provide traceability, accountability, and context. They enable anyone to understand what was changed, verify claims, and investigate issues.

---

## The 23 Principles (P3-P25)

### P3: One Change Type Per PR

**Description**: Each pull request must contain only ONE type of change: feature, bugfix, refactor, docs, test, config, security, api-contract, or schema.

**Rationale**: Mixing change types makes PRs harder to review, increases risk, and complicates rollback. Single-type PRs are easier to understand, test, and revert if needed.

**Examples**:
- ✅ Good: PR adds new authentication feature (feature type only)
- ✅ Good: PR fixes bug in payment processing (bugfix type only)
- ❌ Bad: PR adds feature AND refactors unrelated code
- ❌ Bad: PR fixes bug AND updates documentation AND adds tests

**Verification**: PR template enforces change_type selection. CI checks reject PRs with mixed types.

---

### P4: Make It Shippable

**Description**: Every PR must be in a shippable state - fully tested, documented, and ready for production deployment.

**Rationale**: "Shippable" means no WIP commits, no broken tests, no missing documentation. Changes should be production-ready at merge time.

**Examples**:
- ✅ Good: Feature complete with tests, docs updated, all checks passing
- ✅ Good: Bugfix verified with test case, changelog updated
- ❌ Bad: Feature partially implemented, "will finish later"
- ❌ Bad: Tests commented out "temporarily"

**Verification**: All quality gates must pass. No exceptions without waiver.

---

### P5: Don't Break Surprises

**Description**: Changes must not break existing functionality, especially in ways that surprise users or other developers.

**Rationale**: Unexpected breaking changes erode trust and create incidents. Breaking changes require explicit documentation, migration paths, and advance notice.

**Examples**:
- ✅ Good: Deprecated API with 6-month notice + migration guide
- ✅ Good: Backward-compatible change with new feature
- ❌ Bad: Changed API response format without notice
- ❌ Bad: Removed feature without deprecation period

**Verification**: Breaking changes require ADR + HITL approval + explicit documentation.

---

### P6: Evidence Over Vibes

**Description**: Claims must be backed by verifiable evidence, not just assertions or feelings.

**Rationale**: "I think it works" is not evidence. Show test results, logs, screenshots, performance metrics. Evidence enables verification and builds trust.

**Examples**:
- ✅ Good: "Tests pass: [test output], performance improved 15%: [metrics]"
- ✅ Good: "Security scan clean: [scan results], no vulnerabilities found"
- ❌ Bad: "Looks good to me, should be fine"
- ❌ Bad: "I tested it locally and it works"

**Verification**: PR template requires "Verification Commands Run" and "Evidence" sections. Both must be filled with concrete results.

---

### P7: UNKNOWN Is a First-Class State

**Description**: When you don't know something, say "UNKNOWN" explicitly. Never guess or make assumptions.

**Rationale**: Guessing leads to incorrect decisions and wasted work. UNKNOWN triggers HITL routing to get actual answers from humans.

**Examples**:
- ✅ Good: "Command: <UNKNOWN> - needs HITL to determine"
- ✅ Good: "Database schema change impact: UNKNOWN - requires DBA review"
- ❌ Bad: Guessing a command exists without verifying
- ❌ Bad: Assuming API behavior without checking documentation

**Verification**: All <UNKNOWN> values must be resolved (via HITL) before PR merge.

---

### P8: Read Repo First

**Description**: Before making changes, read the repository structure, existing code, documentation, and related files first.

**Rationale**: Understanding context prevents mistakes, ensures consistency, and surfaces existing solutions. Reading first is faster than fixing mistakes later.

**Examples**:
- ✅ Good: Check existing auth patterns before adding new auth code
- ✅ Good: Review naming conventions before naming new module
- ❌ Bad: Create duplicate functionality that already exists
- ❌ Bad: Use different patterns than the rest of the codebase

**Verification**: Task packets must document repository exploration. Agents must demonstrate context understanding.

---

### P9: Assumptions Must Be Declared

**Description**: All assumptions must be explicitly stated and documented, not hidden or implicit.

**Rationale**: Hidden assumptions cause surprises and failures. Explicit assumptions can be validated, challenged, and tracked.

**Examples**:
- ✅ Good: "Assumes: Database supports transactions (verified: yes)"
- ✅ Good: "Assumes: API rate limit is 1000/hour (documented in API docs)"
- ❌ Bad: Code assumes single-threaded environment without stating it
- ❌ Bad: Assumes external service is always available

**Verification**: Task packets include "Assumptions" section. PRs document key assumptions in notes.

---

### P10: Risk Triggers a Stop

**Description**: When you identify significant risk, STOP immediately and escalate via HITL. Don't proceed with risky changes.

**Rationale**: Pressing forward despite risk signals leads to incidents. Safety trumps speed. Escalation enables proper risk assessment.

**Examples**:
- ✅ Good: Detect data loss risk → create HITL → wait for approval
- ✅ Good: Identify security concern → stop work → escalate to security team
- ❌ Bad: Notice risk but continue "because we're on deadline"
- ❌ Bad: Downplay risk to avoid escalation

**Verification**: HITL system tracks all risk escalations. No merge without risk resolution.

---

### P11: Prefer Guardrails Over Heroics

**Description**: Rely on automation, checks, and guardrails rather than individual heroics or manual vigilance.

**Rationale**: Humans make mistakes. Automation is consistent. Heroics don't scale and create bus factor. Guardrails prevent errors proactively.

**Examples**:
- ✅ Good: Automated security scans on every PR
- ✅ Good: Linters enforce code style consistently
- ❌ Bad: Manual code review catches all issues (doesn't scale)
- ❌ Bad: Relying on "remember to check X" reminders

**Verification**: Quality gates, security checks, and governance checks are automated and required.

---

### P12: Rollback Thinking

**Description**: Every change must have a rollback plan. Know how to undo changes before making them.

**Rationale**: Changes fail. Deployments have issues. Rollback enables fast recovery and limits blast radius.

**Examples**:
- ✅ Good: "Rollback: revert PR, previous version still available"
- ✅ Good: "Rollback: feature flag disabled, no code deployment needed"
- ❌ Bad: "Can't roll back without data migration"
- ❌ Bad: No rollback plan documented

**Verification**: Task packets and PRs require "Rollback Plan" section.

---

### P13: Respect Boundaries by Default

**Description**: Follow architectural boundaries strictly. Don't cross boundaries without explicit approval (ADR + review).

**Rationale**: Boundaries prevent coupling, enforce clean architecture, and make code maintainable. Crossing boundaries creates technical debt.

**Examples**:
- ✅ Good: UI calls domain layer, domain calls data layer (correct direction)
- ✅ Good: Cross-feature import requires ADR + approval
- ❌ Bad: Data layer calls UI layer (wrong direction)
- ❌ Bad: Feature A directly imports Feature B internals

**Verification**: Boundary checker runs on every PR. Violations require waiver + remediation plan.

---

### P14: Localize Complexity (Option B)

**Description**: Contain complexity within specific modules. Don't let complexity spread across the codebase.

**Rationale**: Localized complexity is easier to understand, test, and refactor. Spreading complexity makes the entire codebase harder to work with.

**Examples**:
- ✅ Good: Complex algorithm isolated in single module with clear interface
- ✅ Good: External API integration wrapped in adapter layer
- ❌ Bad: Complex logic scattered across many files
- ❌ Bad: Every module knows about every other module

**Verification**: Code reviews check for complexity containment. Refactoring tasks address complexity spread.

---

### P15: Consistency Beats Novelty

**Description**: Prefer existing patterns and conventions over new, "better" approaches. Consistency is more valuable than innovation.

**Rationale**: Consistency reduces cognitive load, makes code predictable, and speeds up development. Novelty creates learning curves and maintenance burden.

**Examples**:
- ✅ Good: Use existing error handling pattern for new feature
- ✅ Good: Follow established naming conventions
- ❌ Bad: Introduce new framework for single use case
- ❌ Bad: Use different patterns in each module "to try new things"

**Verification**: Code reviews enforce consistency. Deviations require ADR justification.

---

### P16: Decisions Written Down (Token-Optimized)

**Description**: Significant decisions must be documented in ADRs using concise, scannable format optimized for token efficiency.

**Rationale**: Written decisions provide context, rationale, and history. Token-optimized format respects AI context limits while preserving information.

**Examples**:
- ✅ Good: ADR documents why we chose PostgreSQL over MySQL (concise format)
- ✅ Good: ADR explains boundary model selection (scannable bullets)
- ❌ Bad: Decision made verbally, no documentation
- ❌ Bad: ADR is 50 pages of verbose text

**Verification**: ADRs required for architecture, API contracts, schema changes, security changes (P23).

---

### P17: PR Narration

**Description**: PRs must narrate the change - what, why, how, evidence, risks. PRs are documentation, not just code.

**Rationale**: PR descriptions help reviewers understand changes, provide context for future developers, and serve as change documentation.

**Examples**:
- ✅ Good: PR describes problem, solution, alternatives considered, verification
- ✅ Good: PR includes before/after evidence, test results
- ❌ Bad: PR description: "fixed stuff"
- ❌ Bad: PR has no description, just code diff

**Verification**: PR template enforces required sections. PRs without proper description are rejected.

---

### P18: No Silent Scope Creep

**Description**: Scope changes must be explicit and documented. Don't expand PR scope without updating task packet.

**Rationale**: Silent scope creep hides work, increases risk, and makes PRs hard to review. Explicit scope changes enable proper planning.

**Examples**:
- ✅ Good: "Scope expanded: added error handling (updated task packet)"
- ✅ Good: "Out of scope change needed → created new HITL/task"
- ❌ Bad: Feature PR also includes unrelated refactoring
- ❌ Bad: "While I was here, I also fixed..."

**Verification**: PR must match task packet scope. Deviations require explicit documentation.

---

### P19: Docs Age With Code

**Description**: Documentation must be updated with code changes. Code and docs must stay in sync.

**Rationale**: Outdated docs are worse than no docs - they mislead and waste time. Docs must evolve with code.

**Examples**:
- ✅ Good: API changes include README updates
- ✅ Good: Refactoring updates architecture diagrams
- ❌ Bad: Code changed but docs still describe old behavior
- ❌ Bad: "We'll update docs later" (never happens)

**Verification**: PRs with code changes must include documentation updates. No exceptions.

---

### P20: Examples Are Contracts

**Description**: Code examples in documentation are contracts - they must work as shown and be tested.

**Rationale**: Broken examples destroy trust and frustrate users. Examples that work become guarantees of correct behavior.

**Examples**:
- ✅ Good: API examples are tested in CI
- ✅ Good: Tutorial code is executable and passes checks
- ❌ Bad: Examples haven't been tested in months
- ❌ Bad: Examples show deprecated API usage

**Verification**: Documentation examples are tested. Broken examples fail CI.

---

### P21: Naming Matters

**Description**: Names must be clear, consistent, and follow established conventions. Good names reduce confusion.

**Rationale**: Poor names increase cognitive load and cause mistakes. Good names make code self-documenting.

**Examples**:
- ✅ Good: `calculateTotalPrice()` (clear, verb-based)
- ✅ Good: `UserRepository` (consistent with convention)
- ❌ Bad: `doStuff()` (unclear)
- ❌ Bad: `mgr`, `tmp`, `data` (too generic)

**Verification**: Code reviews check naming quality. Linters enforce naming conventions.

---

### P22: Waivers Rare + Temporary

**Description**: Waivers for quality gates should be rare exceptions and time-limited. Auto-generated waivers must be addressed.

**Rationale**: Waivers bypass quality gates. Too many waivers means gates are too strict or being ignored. Temporary waivers create pressure to fix issues.

**Examples**:
- ✅ Good: Waiver for coverage drop due to test flake (30-day expiration)
- ✅ Good: Waiver for performance budget on prototype feature (removed before GA)
- ❌ Bad: Waivers never expire
- ❌ Bad: Every PR has waivers

**Verification**: Waiver reports tracked. Expired waivers block merge. High waiver rate triggers review.

---

### P23: ADR Required When Triggered

**Description**: Architecture Decision Records (ADRs) are required for specific triggers: architecture changes, API contract changes, schema changes, security changes.

**Rationale**: These changes have long-term impact and need documented rationale. ADRs provide context for future decisions.

**Examples**:
- ✅ Good: API breaking change includes ADR explaining why and alternatives
- ✅ Good: Database schema change has ADR with migration plan
- ❌ Bad: Changed API contract without documentation
- ❌ Bad: Made architecture decision in Slack, no ADR

**Verification**: ADR triggers checked automatically. Missing ADRs block merge.

---

### P24: Logs Required for Non-Docs

**Description**: Non-documentation changes require agent logs showing the work performed and decisions made.

**Rationale**: Logs provide audit trail, enable debugging, and show decision process. Transparency builds trust.

**Examples**:
- ✅ Good: Agent log documents exploration, decisions, implementation
- ✅ Good: Log shows why approach A was chosen over approach B
- ❌ Bad: Code appears with no log of how/why
- ❌ Bad: "I just made the change" with no documentation

**Verification**: Agent logs required for feature, bugfix, refactor, security changes. Template enforced.

---

### P25: Token-Optimized TODO Discipline

**Description**: TODOs must be managed in prioritized files (P0, P1, P2, Completed) with token-efficient format. Completed items archived.

**Rationale**: Scattered TODOs are never completed. Prioritized TODOs enable focus. Token-optimized format respects context limits. Archives preserve history without cluttering active work.

**Examples**:
- ✅ Good: P0TODO.md for critical items, P1TODO.md for high priority
- ✅ Good: Completed tasks moved to COMPLETEDTODO.md
- ❌ Bad: TODO comments scattered in code
- ❌ Bad: Single massive TODO file with 1000 items

**Verification**: TODO discipline checked in reviews. Priority files maintained. Archive updated.

---

## Principle Summary Table

| # | Principle | Key Requirement | Verification |
|---|-----------|-----------------|--------------|
| P3 | One Change Type Per PR | Single type only | PR template enforces |
| P4 | Make It Shippable | Production-ready | All gates pass |
| P5 | Don't Break Surprises | No unexpected breaks | ADR + HITL for breaking changes |
| P6 | Evidence Over Vibes | Show proof | Required PR sections |
| P7 | UNKNOWN Is First-Class | Say unknown, don't guess | Resolve before merge |
| P8 | Read Repo First | Understand context | Document exploration |
| P9 | Assumptions Declared | State explicitly | Assumptions section |
| P10 | Risk Triggers Stop | Escalate immediately | HITL for risks |
| P11 | Guardrails Over Heroics | Automate checks | Required automated gates |
| P12 | Rollback Thinking | Plan rollback first | Rollback plan section |
| P13 | Respect Boundaries | Follow architecture | Boundary checker |
| P14 | Localize Complexity | Contain complexity | Code review |
| P15 | Consistency Beats Novelty | Use existing patterns | Code review |
| P16 | Decisions Written Down | ADR for significant decisions | ADR triggers |
| P17 | PR Narration | Document changes | PR template |
| P18 | No Silent Scope Creep | Explicit scope changes | Task packet match |
| P19 | Docs Age With Code | Update docs with code | Documentation changes required |
| P20 | Examples Are Contracts | Test examples | CI tests examples |
| P21 | Naming Matters | Clear names | Code review + linters |
| P22 | Waivers Rare + Temporary | Time-limited exceptions | Waiver tracking |
| P23 | ADR Required When Triggered | ADR for major changes | ADR triggers |
| P24 | Logs Required for Non-Docs | Agent logs required | Log template |
| P25 | Token-Optimized TODO | Prioritized TODO files | TODO discipline |

---

**Version**: 2.2  
**Last Updated**: 2026-01-23  
**Authority**: Constitution Article 2 (Verifiable over Persuasive)
