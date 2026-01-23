# Human-In-The-Loop (HITL) System

## Overview

The HITL system handles decisions that require human judgment, external integrations, clarifications, and unknowns. HITL ensures critical decisions involve humans and prevents agents from guessing.

---

## Storage Model

**Model**: `split` (index + items in separate locations)

### Locations

1. **Index**: `/.repo/policy/HITL.md` (this file)
   - Master index of all HITL items
   - Quick reference tables (Active, Archived)
   - Status tracking

2. **Items**: `/.repo/hitl/`
   - Individual HITL item files
   - One file per item: `HITL-001.md`, `HITL-002.md`, etc.
   - Full details, context, resolution

### Rationale

- Index provides quick overview without loading all items
- Separate files enable parallel work on different items
- Clear ownership and status tracking

---

## Minimal Human Effort Rule

**Principle**: Minimize human effort required while maintaining safety and quality.

### How

- Agents do maximum preparation work
- HITL items are well-documented with context
- Clear questions that can be answered quickly
- Action items clearly defined
- Follow-up automated when possible

### Example

❌ **Bad**: "Need help with auth"
✅ **Good**: "External Auth0 integration requires API key and configuration. Question: Should we use Auth0 tenant X or Y? Context: Production vs staging. Decision needed by: 2026-01-30. If X: [next steps]. If Y: [next steps]."

---

## Categories

### Category 1: External Integration
**Trigger**: Changes involving external systems, third-party APIs, or services

**Examples**:
- New API integration (Stripe, Auth0, SendGrid)
- External database connection
- Third-party SDK addition
- Webhook configuration

**Required Actions**:
- Security review
- Vendor assessment
- Configuration approval
- Credentials/secrets setup

---

### Category 2: Clarification
**Trigger**: Ambiguous requirements, unclear specifications, or missing information

**Examples**:
- "Should button be blue or green?" (designer input)
- "What's the error message for invalid input?" (product input)
- "Which database table stores X?" (engineer input)

**Required Actions**:
- Identify decision maker
- Document question with context
- Get answer
- Document decision

---

### Category 3: Risk
**Trigger**: Identified security, data loss, or high-impact risks

**Examples**:
- Potential data loss scenario
- Security vulnerability identified
- Breaking change with unknown impact
- Performance degradation risk

**Required Actions**:
- Stop work immediately
- Document risk clearly
- Get risk assessment from appropriate team
- Document mitigation plan
- Get approval to proceed

---

### Category 4: Feedback
**Trigger**: Agent needs feedback on approach, design, or implementation

**Examples**:
- "Is this the right architectural approach?"
- "Does this UI match design system?"
- "Is this error handling appropriate?"

**Required Actions**:
- Present options with trade-offs
- Get feedback from appropriate reviewer
- Document decision
- Proceed with approved approach

---

### Category 5: Vendor
**Trigger**: New vendor, service, or tool addition

**Examples**:
- Adding npm package with known vulnerabilities
- Using new cloud service
- Adopting new tool or framework

**Required Actions**:
- Vendor security assessment
- Cost evaluation
- License review
- Procurement approval (if needed)
- Documentation of selection rationale

---

## Statuses

### Status: Pending
**Meaning**: HITL item created, awaiting human review

**Actions**:
- Human notified
- Work blocked until review
- PR cannot merge

---

### Status: In Progress
**Meaning**: Human is actively working on resolution

**Actions**:
- Work blocked until completion
- Regular status updates
- PR cannot merge

---

### Status: Blocked
**Meaning**: HITL item blocked by external dependency

**Actions**:
- Document blocker clearly
- Escalate if needed
- Work blocked until unblocked
- PR cannot merge

---

### Status: Completed
**Meaning**: HITL item resolved

**Actions**:
- Resolution documented
- Work can proceed
- PR can merge (if this was only blocker)
- Item moved to Archived table

---

### Status: Superseded
**Meaning**: HITL item no longer relevant (e.g., requirement changed)

**Actions**:
- Document why superseded
- Link to new item if applicable
- Work blocked if no replacement
- Item moved to Archived table

---

## Merge Blocking Rule

**Rule**: Pending, In Progress, or Blocked HITL items block PR merge.

### Why

- HITL items represent unresolved questions or risks
- Merging with unresolved items creates incomplete or unsafe code
- Forces resolution before proceeding

### Process

1. HITL item created → PR marked as blocked
2. Human resolves HITL → PR unblocked
3. PR can merge only after all HITL items Completed or Superseded

---

## Role Permissions

### Agents (AI/Automated)

**CAN**:
- Create HITL items
- Update HITL item context
- Add information to HITL items
- Change status: Pending → (nothing, agents cannot resolve)

**CANNOT**:
- Resolve HITL items (humans only)
- Change status to Completed
- Delete HITL items
- Override HITL requirement

---

### Humans

**CAN**:
- Review HITL items
- Resolve HITL items
- Change any status
- Delete/archive HITL items
- Override HITL requirement (with documentation)

**MUST**:
- Review HITL items promptly
- Document resolution clearly
- Update status accurately
- Communicate decisions

---

## External Systems Detection

**Methods**: `keywords + manifest + change_type`

### 1. Keywords Detection

Automatically create HITL for PRs containing these keywords:
- External API, third-party, integration
- New service, new vendor, new tool
- API key, credentials, secrets (also triggers security)
- Stripe, Auth0, SendGrid, etc. (known services)

### 2. Manifest Detection

Check `/.repo/repo.manifest.yaml` for:
- New dependency added
- External system referenced
- New environment variable

### 3. Change Type Detection

Automatically create HITL for these change types:
- `external-integration`
- `vendor-addition`
- `api-contract` (if external API)
- `security` (always requires HITL)

---

## HITL Item File Format

Each HITL item is a Markdown file with this structure:

```markdown
# HITL-001: [Short Title]

## Metadata

- **ID**: HITL-001
- **Category**: External Integration
- **Status**: Pending
- **Created**: 2026-01-23
- **Created By**: agent-primary
- **Assigned To**: security-team@example.com
- **Priority**: High
- **Due Date**: 2026-01-30
- **PR**: #123

## Question/Issue

[Clear, specific question or issue that requires human decision]

## Context

[Relevant background information, code snippets, links]
- Filepaths affected: [list]
- Related systems: [list]
- Dependencies: [list]

## Options Considered

1. **Option A**: [description]
   - Pros: [list]
   - Cons: [list]

2. **Option B**: [description]
   - Pros: [list]
   - Cons: [list]

## Recommendation

[Agent's recommendation with rationale, if applicable]

## Decision Required

[Specific decision needed from human]

## Resolution

[Filled in by human when resolved]

**Decision**: [Chosen option and rationale]
**Action Items**: [List of next steps]
**Resolved By**: [Name]
**Resolved Date**: [Date]

## References

- PR: #123
- ADR: [if created]
- Documentation: [links]
```

---

## Active HITL Items

| ID | Category | Status | Title | Assigned To | Created | Due |
|----|----------|--------|-------|-------------|---------|-----|
| _No active items_ | | | | | | |

---

## Archived HITL Items

| ID | Category | Status | Title | Resolved | Resolution |
|----|----------|--------|-------|----------|------------|
| _No archived items_ | | | | | |

---

## Auto-Sync with PRs

**Model**: `auto_sync_pr_and_hitl`

### How It Works

1. **HITL Created**: Automatically link to originating PR
2. **Status Changes**: PR status updates when HITL status changes
   - HITL Pending → PR marked "blocked by HITL"
   - HITL Completed → PR unblocked (if no other blockers)
3. **Comments**: HITL updates commented on PR
4. **Resolution**: HITL resolution documented in PR

### Benefits

- Single source of truth (PR and HITL in sync)
- Visibility for all stakeholders
- Clear blocking reasons
- Automatic unblocking when resolved

---

## Escalation

### When to Escalate HITL

- HITL blocked for > 48 hours
- Critical priority not reviewed within 24 hours
- Conflicting decisions from reviewers
- Unclear who should resolve

### How to Escalate

1. Update HITL status to "Blocked"
2. Document escalation reason
3. Tag next-level reviewer/manager
4. Set escalation due date
5. Follow up daily until resolved

---

## Archiving Process

### When to Archive

- HITL status: Completed or Superseded
- 30 days after resolution
- All references updated

### How to Archive

1. Move from Active to Archived table in index
2. Keep file in `/.repo/hitl/` (do not delete)
3. Add "Archived" tag to file
4. Update any references to point to archived item

### Why Keep Archives

- Historical record
- Audit trail
- Learning from past decisions
- Reference for similar future issues

---

**Version**: 2.2  
**Last Updated**: 2026-01-23  
**Authority**: Constitution Article 3 (No Guessing) + Article 8 (HITL for External Systems)
