# Platform Guidelines (Next.js Marketing Platform)

## Goal
This repo is a platform for producing many unique marketing sites.
We will ship reusable foundations and keep client-specific work isolated.

## Non-negotiable principles
1. Tokens are the only source of styling truth.
2. UI primitives are client-agnostic and accessible by default.
3. Patterns are composed from primitives and must be performance-safe by default.
4. Capabilities contain "business features" (forms, booking, analytics).
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
See [docs/archive/DEFINITION_OF_DONE.md](archive/DEFINITION_OF_DONE.md)
