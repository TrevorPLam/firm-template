---
title: Team Training Curriculum
description: Structured onboarding and training modules for new team members.
---

# Team Training Curriculum

This curriculum ensures new team members learn platform architecture, workflows, and best practices quickly.

## Modules

1. **Platform architecture**
   - Layers, import boundaries, and shared packages.
2. **Development workflow**
   - Local setup, commands, and CI expectations.
3. **Quality and security**
   - Testing standards, security review triggers, and release hygiene.
4. **Client delivery**
   - Site customization flow and deployment checklist.

## Hands-on exercises

```md
# Exercise: create a new capability
1. Identify a business feature (e.g., newsletter signup).
2. Implement it inside packages/capabilities.
3. Add a pattern that consumes the capability.
4. Document the integration in docs/.

> Inline note: keep UI primitives client-agnostic while testing the capability end-to-end.
```

## Tracking progress

- Assign a mentor for weekly check-ins.
- Log completed modules in the onboarding tracker.
- Capture questions to improve future curriculum updates.
