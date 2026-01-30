# Target end-state (what you’re refactoring toward)

Even before you have clients, structure the repo so adding a new client later is mostly “new theme + content config + a thin app wrapper”.

## Recommended repo shape (bakes in clients now)

If you’re willing to move toward a workspace/monorepo layout (best for “baked in clients”):

```
apps/
  template-site/           # your current site becomes the first app
  client-*/                # future: client sites (same platform packages)
packages/
  tokens/                  # design tokens + themes
  ui/                      # primitives (buttons, inputs, typography)
  patterns/                # sections (hero, pricing, testimonials)
  capabilities/            # business features (lead capture, scheduling)
  integrations/            # provider adapters, OFF by default
docs/
```

If you’re not ready to restructure folders yet, you can keep a single Next.js app and mirror the same layering under `src/` (then lift packages later). But since you said “baked in”, the layout above is the cleanest path.

---

# Drop-in files

## 1) `docs/PLATFORM.md`

```md
# Platform Guidelines (Next.js Marketing Platform)

## Goal
This repo is a platform for producing many unique marketing sites.
We will ship reusable foundations and keep client-specific work isolated.

## Non-negotiable principles
1. Tokens are the only source of styling truth.
2. UI primitives are client-agnostic and accessible by default.
3. Patterns are composed from primitives and must be performance-safe by default.
4. Capabilities contain “business features” (forms, booking, analytics).
5. Integrations are adapters and are OFF by default unless enabled via config.
6. Client-specific work must not fork or patch primitives.

## Layers and import rules (hard boundaries)
- tokens -> ui -> patterns -> app
- capabilities can be used by patterns and apps (not by tokens)
- integrations can only be used by capabilities (never by ui/patterns/pages directly)

In plain terms:
- UI should never import HubSpot/GA/Calendly SDKs.
- Only capabilities talk to external providers, via integrations adapters.

## Next.js-specific rules
- Use Server Components by default. Only add `"use client"` where required.
- Do not fetch third-party scripts in UI components. Centralize in capabilities.
- Metadata and SEO live at the app/page layer, using structured helpers from packages.
- Images must use Next/Image (or have explicit dimensions if not possible).

## Styling rules
- No hardcoded colors, spacing, or font sizes in components.
- Components reference tokens (CSS variables recommended).
- If using Tailwind, Tailwind config maps to CSS variables; do not introduce a second source of truth.

## Accessibility baseline
- Semantic HTML first.
- Keyboard access required for all interactive UI.
- Focus must be visible and consistent.
- Forms must have labels and error messaging.
- Modals/menus manage focus and close with Escape.

## Performance baseline
- No avoidable layout shift: reserve space for media and dynamic content.
- Responsive images, lazy-load below the fold.
- Fonts: keep weights minimal; avoid blocking render.
- Third-party scripts: disabled by default, loaded only when enabled.

## Promotion rule (prevent one-off chaos)
If a bespoke module is reused by 2+ sites, it must be promoted:
- Bespoke -> Pattern or Capability

## Definition of Done
See docs/DEFINITION_OF_DONE.md
```

---

## 2) `docs/DEFINITION_OF_DONE.md`

```md
# Definition of Done (Platform Quality Gates)

A change is “done” when:

## Build
- Next.js build passes.
- Lint + typecheck pass (if configured).

## Platform integrity
- No hardcoded theme values in ui/patterns.
- Correct layering: no imports that violate tokens/ui/patterns/capabilities/integrations boundaries.
- Integrations remain OFF by default unless explicitly enabled via config.

## Accessibility
- Keyboard-only flow works for the changed UI.
- Focus is visible and logical.
- Forms: label + error messaging.
- Modal/menu behavior is correct (focus, Escape, close).

## Performance
- No layout shift introduced.
- Media has dimensions and is optimized.
- No new third-party scripts without an explicit “enable flag” and a reason.

## Docs
- Updated docs for any new/changed primitives, patterns, capabilities, or integrations.
```

---

## 3) `docs/CLIENT_SITES.md` (this is your “baked in” client plan)

```md
# Client Sites Model (Baked In)

## What “a client site” is in this platform
A client site is an app that:
- selects a theme (tokens)
- selects content/config
- composes pages from patterns + capabilities
- does not fork the platform packages

## What varies per client
- theme tokens (colors, typography, spacing emphasis, motion)
- content (copy, images, case studies, FAQs)
- capability configuration (which integrations are enabled)

## What does NOT vary per client
- UI primitives behavior and accessibility
- core patterns implementation
- capability interfaces (lead capture API, analytics events API)

## Creating a new client later
1. Copy apps/template-site -> apps/client-<name>
2. Add a new theme token pack in packages/tokens/themes/<client>
3. Add a content/config folder in the client app
4. Set integration flags in the client app env/config
5. Compose pages using patterns + capabilities only
```

---

## 4) `docs/INTEGRATIONS.md` (mass suite, OFF by default)

```md
# Integrations Suite (OFF by Default)

## Goal
Support many integrations (CRM, analytics, scheduling, email, chat)
without polluting UI code, increasing risk, or slowing every site.

## Rules
1. Integrations are adapters only. They do not control UI.
2. Integrations are never imported by ui or patterns.
3. Integrations are used only through capabilities.
4. Every integration must have:
   - a typed interface
   - an "enabled" flag defaulting to false
   - a no-op implementation when disabled
   - a clear failure mode (does nothing vs logs vs throws)

## Enabling model
- Default: everything disabled
- Enable per app via env/config (ex: ENABLE_HUBSPOT=true)
- Capabilities read config and choose adapter:
  - enabled -> real adapter
  - disabled -> no-op adapter

## Example categories
- CRM: HubSpot, Salesforce
- Analytics: GA4, Segment, PostHog
- Scheduling: Calendly, Acuity
- Email: Resend, SendGrid, Mailchimp
- Chat: Intercom, Crisp

## Policy
- Adding a new integration must not increase bundle cost when disabled.
- When enabled, load scripts lazily and only where needed.
```

---

# Minimal scaffolding you should add now (to begin refactor)

You said “start refactoring” and “bake in clients”. Here’s the smallest set of folders and config files that makes the direction real without boiling the ocean.

## 5) Add these folders (even if empty)

```
packages/
  tokens/
    src/
      themes/
  ui/
    src/
  patterns/
    src/
  capabilities/
    src/
  integrations/
    src/
apps/
  template-site/
docs/
```

If your repo is currently a single Next.js app at the root, move it into `apps/template-site` when you’re ready. If that’s too disruptive today, keep it in place and create the packages + docs first.

---

# Integration suite implementation rules (clean, practical)

This is the “how” for “mass integrations turned off”.

## The only allowed integration entrypoint

* Capabilities call a single integration registry function that returns adapters.

### Add this guideline to your repo (conceptually)

* `packages/integrations` exports:

  * types (interfaces)
  * `createIntegrations(config)` returning enabled or no-op adapters

### No-op is mandatory

If disabled, the adapter must:

* do nothing
* return safe defaults
* never load third-party scripts
* never throw (unless you explicitly choose “strict mode” in config)

### Enable flags are per app (per client later)

* each app has its own `.env` / config
* the platform never assumes integrations are on

---

# Refactor order (fastest path that avoids rework)

## Phase 1: Tokens first (1–2 days of effort, huge payoff)

1. Create token source (CSS variables recommended).
2. Replace hardcoded colors/spacing in existing components with tokens.
3. Create two themes (Default + Alt) to prove theme switching works.

## Phase 2: Extract primitives (UI package)

Move these first:

* Button, Link, Typography, Input, Textarea, Select
* Card, Container, Stack/Grid primitives

Rule: primitives must not contain marketing-section layout assumptions.

## Phase 3: Convert sections into patterns

Move your biggest repeated sections:

* Hero, Features, Testimonials, Pricing, FAQ, Contact

Rule: patterns take content/config as props and only use primitives/capabilities.

## Phase 4: Create your first capability

Start with Lead Capture because it touches most sites:

* form schema + validation
* spam controls
* submission interface
* integration adapter (disabled by default)

## Phase 5: Add one more capability

Analytics events wrapper:

* `track(eventName, payload)`
* no-op by default
* enabled via config

---

# Guardrails (small, but prevents backsliding)

Add these rules to your “how we code” norms (you can enforce later with lint/boundaries):

1. UI/patterns never import provider SDKs.
2. Capabilities are the only place allowed to touch integrations.
3. Every integration must be safe when disabled.
4. Every client app must be able to run with all integrations disabled.

---


