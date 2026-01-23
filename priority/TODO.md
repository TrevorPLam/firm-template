# TODO - Textbook Codebase Standard v2.2 Implementation

This document contains tasks derived from analyzing the phase documents (phase1.md through phase9.md) for implementing the Textbook Codebase Standard v2.2 governance framework.

## Phase 1: Master Handoff Skeleton + Locked Decisions
- [ ] Review and finalize locked decisions in phase1.md
- [ ] Establish authority chain: Manifest > Agents > Standards
- [ ] Document selected principles (P3-P25)
- [ ] Define quality gates and merge policies
- [ ] Configure waiver system with auto-generation
- [ ] Set up security baseline requirements
- [ ] Define boundary enforcement model (hybrid_domain_feature_layer)
- [ ] Plan agent execution order

## Phase 2: Policy Corpus (Authoritative Rules)
- [ ] Create `/.repo/policy/` directory structure
- [ ] Create `/.repo/policy/CONSTITUTION.md` with 8 articles
- [ ] Create `/.repo/policy/PRINCIPLES.md` with P3-P25 operating principles
- [ ] Create `/.repo/policy/QUALITY_GATES.md` with merge rules
- [ ] Create `/.repo/policy/SECURITY_BASELINE.md` with security requirements
- [ ] Create `/.repo/policy/BOUNDARIES.md` with module boundary rules
- [ ] Create `/.repo/policy/HITL.md` with Human-In-The-Loop procedures
- [ ] Verify all policy files use plain English (non-coder friendly)

## Phase 3: Manifest + Command Resolution
- [ ] Create `/.repo/repo.manifest.yaml` with canonical commands
- [ ] Create `/.repo/docs/standards/manifest.md` with resolution process
- [ ] Fill `commands.install` from package.json or repo evidence
- [ ] Fill `commands.check:quick` (fast build + sanity check)
- [ ] Fill `commands.check:ci` (quick + tests + full build)
- [ ] Fill `commands.check:release` (ci + security + budgets)
- [ ] Fill `commands.check:governance` (governance-verify)
- [ ] Fill `commands.check:boundaries` (boundary checker)
- [ ] Fill `commands.check:security` (dep scan + secrets + patterns)
- [ ] Define verify_profiles (quick, ci, release, governance)
- [ ] Set test requirements (unit+integration)
- [ ] Configure budget enforcement
- [ ] Configure security settings

## Phase 4: Agents Framework + Folder-Level Guides
- [ ] Create `/.repo/agents/` directory structure
- [ ] Create `/.repo/agents/AGENTS.md` with core rules
- [ ] Create `/.repo/agents/capabilities.md` listing all agent capabilities
- [ ] Create `/.repo/agents/roles/primary.md` (full capabilities agent)
- [ ] Create `/.repo/agents/roles/secondary.md` (modify/refactor only)
- [ ] Create `/.repo/agents/roles/reviewer.md` (human, controls waivers)
- [ ] Create `/.repo/agents/roles/release.md` (human, controls releases)
- [ ] Create folder-level `AGENT.md` guides in:
  - [ ] `/.repo/AGENT.md`
  - [ ] `/src/AGENT.md`
  - [ ] `/src/platform/AGENT.md`
  - [ ] `/tests/AGENT.md`
  - [ ] `/docs/AGENT.md`
  - [ ] `/scripts/AGENT.md`

## Phase 5: PR Operating System
- [ ] Create `/.repo/agents/prompts/` directory
- [ ] Create `/.repo/agents/prompts/task_packet.md` template
- [ ] Create `/.repo/agents/prompts/pr_template.md` template
- [ ] Create `/.repo/agents/checklists/` directory
- [ ] Create `/.repo/agents/checklists/change-plan.md` checklist
- [ ] Create `/.repo/agents/checklists/pr-review.md` checklist
- [ ] Create `/.repo/agents/checklists/incident.md` checklist
- [ ] Create `/.repo/templates/` directory
- [ ] Create `/.repo/templates/PR_TEMPLATE.md`

## Phase 6: Logging + Trace + Waiver + ADR Templates
- [ ] Create `/.repo/templates/AGENT_LOG_TEMPLATE.md`
- [ ] Create `/.repo/templates/AGENT_TRACE_SCHEMA.json` with JSON schema
- [ ] Create `/.repo/templates/WAIVER_TEMPLATE.md`
- [ ] Create `/.repo/templates/ADR_TEMPLATE.md`
- [ ] Create `/.repo/templates/RUNBOOK_TEMPLATE.md`
- [ ] Create `/.repo/templates/RFC_TEMPLATE.md`
- [ ] Ensure all templates prohibit secrets and private data

## Phase 7: Automation Stubs
- [ ] Create `/.repo/automation/` directory structure
- [ ] Create `/.repo/automation/ci/governance-verify.yml` CI job template
- [ ] Create `/.repo/automation/scripts/governance-verify.js` script stub
- [ ] Create `/.repo/automation/scripts/validate-agent-trace.js` script stub
- [ ] Wire automation to use manifest-defined commands

## Phase 8: Docs Glue (Indexes + Standards + ADR Scaffold)
- [ ] Create `/.repo/docs/` directory structure
- [ ] Create `/.repo/docs/DOCS_INDEX.md` with navigation
- [ ] Create `/.repo/docs/standards/documentation.md`
- [ ] Create `/.repo/docs/standards/adr.md`
- [ ] Create `/.repo/docs/standards/api.md`
- [ ] Create `/.repo/docs/standards/style.md`
- [ ] Create `/.repo/docs/adr/` directory
- [ ] Create `/.repo/docs/adr/README.md`
- [ ] Create `/.repo/docs/adr/0001-example.md` example ADR

## Phase 9: Root Scaffolds
- [ ] Update `/README.md` to link to `/.repo/docs/DOCS_INDEX.md`
- [ ] Create or update `/SECURITY.md` referencing security baseline
- [ ] Create or update `/CODEOWNERS` file
- [ ] Review `/LICENSE` file
- [ ] Create `/P0TODO.md` (highest priority tasks)
- [ ] Create `/P1TODO.md` (high priority tasks)
- [ ] Create `/P2TODO.md` (normal priority tasks)
- [ ] Create `/COMPLETEDTODO.md` (archived completed tasks)
- [ ] Create `/.repo/archive/todo/README.md` for TODO snapshots

## Cross-Phase Integration Tasks
- [ ] Ensure all filepaths are absolute and correct
- [ ] Verify plain English requirements in all policy documents
- [ ] Test command resolution from manifest
- [ ] Validate boundary enforcement rules
- [ ] Test HITL workflow end-to-end
- [ ] Verify waiver system with expiration tracking
- [ ] Test security check integration
- [ ] Validate agent trace schema with sample traces
- [ ] Review governance-verify implementation requirements

## Verification & Validation
- [ ] Run governance-verify against the implemented structure
- [ ] Verify all required artifacts exist at correct paths
- [ ] Test manifest commands locally
- [ ] Validate security baseline enforcement
- [ ] Verify boundary checker functionality
- [ ] Test HITL item creation and completion workflow
- [ ] Validate waiver generation and expiration
- [ ] Run full CI pipeline with governance checks

## Documentation & Training
- [ ] Document deviation from any phase specification
- [ ] Create quick-start guide for developers
- [ ] Document HITL process for non-technical stakeholders
- [ ] Create examples for common change types
- [ ] Document rollback procedures
- [ ] Create troubleshooting guide for governance checks

---

## Notes
- All tasks must follow the principles outlined in phase documents
- UNKNOWN values require HITL items before proceeding
- Evidence required for all completed tasks
- Filepaths must be included in all task tracking
- No guessing - refer to repo contents or create HITL items
- Security and safety checks must be in place before marking phases complete
