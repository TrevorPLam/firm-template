# Human-In-The-Loop (HITL)

Blocking questions or decisions that require founder input. Create a file here when the agent workflow requires human approval.

**Naming:** Use sequential IDs: `HITL-0001.md`, `HITL-0002.md`, etc.

**When to create:** Security/login/money/data changes; external integrations; <UNKNOWN> items; dependency vulnerabilities. See `agents/AGENTS.toon` for full triggers.

**Process:** Mark the related task as "Blocked" in `agents/tasks/TODO.toon`, create the HITL file here, then continue with the next task in the group.
