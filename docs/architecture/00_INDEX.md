# Architecture Documentation Index

**Welcome!** This is the entry point for understanding how this platform is structured.

## Purpose

This architecture documentation helps you:
- Understand what the system does and how it's organized
- Navigate the codebase safely and modify it with confidence
- Extend the platform with new client sites and features
- Understand runtime behavior, deployment, and key flows

## Reading Order

If you're **new to the codebase**, follow this sequence:

1. **[10_OVERVIEW.md](10_OVERVIEW.md)** – What this platform does, high-level components
2. **[20_RUNTIME_TOPOLOGY.md](20_RUNTIME_TOPOLOGY.md)** – What runs where, boot sequence, environments
3. **[30_MODULES_AND_DEPENDENCIES.md](30_MODULES_AND_DEPENDENCIES.md)** – Package structure and import rules
4. **[40_KEY_FLOWS.md](40_KEY_FLOWS.md)** – Critical user journeys and data flows
5. **[90_GLOSSARY.md](90_GLOSSARY.md)** – Terms, acronyms, domain language

If you're **extending or modifying**, jump to:
- Modifying UI/patterns → [30_MODULES_AND_DEPENDENCIES.md](30_MODULES_AND_DEPENDENCIES.md)
- Adding integrations → [../integrations/00_INDEX.md](../integrations/00_INDEX.md)
- Working with APIs → [../api/00_INDEX.md](../api/00_INDEX.md)
- Data/storage → [../data/00_INDEX.md](../data/00_INDEX.md)

## Deep-Dive Documentation

Beyond architecture basics:

- **[../data/00_INDEX.md](../data/00_INDEX.md)** – Storage, schema, migrations, invariants
- **[../api/00_INDEX.md](../api/00_INDEX.md)** – API organization, auth, errors, versioning
- **[../integrations/00_INDEX.md](../integrations/00_INDEX.md)** – Third-party providers, webhooks, secrets
- **[../adr/README.md](../adr/README.md)** – Architecture Decision Records (ADRs)
- **[../PLATFORM.md](../PLATFORM.md)** – Platform principles and layering rules
- **[../SECURITY.md](../SECURITY.md)** – Security guidelines and practices

## Quick Reference

| Area | Link |
|------|------|
| Platform overview | [README.md](../../README.md) |
| Getting started | [CONTRIBUTING.md](../../CONTRIBUTING.md) |
| Project structure | [30_MODULES_AND_DEPENDENCIES.md](30_MODULES_AND_DEPENDENCIES.md) |
| Deployment guide | [20_RUNTIME_TOPOLOGY.md](20_RUNTIME_TOPOLOGY.md) |
| Key flows | [40_KEY_FLOWS.md](40_KEY_FLOWS.md) |
| Terms & glossary | [90_GLOSSARY.md](90_GLOSSARY.md) |

## Documentation Maintenance

See the [Maintenance Rules](#maintenance-rules) section at the bottom of [10_OVERVIEW.md](10_OVERVIEW.md).

---

**Next**: Start with [10_OVERVIEW.md](10_OVERVIEW.md)
