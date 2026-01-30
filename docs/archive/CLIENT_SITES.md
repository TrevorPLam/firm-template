# Client Sites Model (Baked In)

## What "a client site" is in this platform
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
