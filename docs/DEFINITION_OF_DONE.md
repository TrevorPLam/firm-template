# Definition of Done (Platform Quality Gates)

A change is "done" when:

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
- No new third-party scripts without an explicit "enable flag" and a reason.

## Docs
- Updated docs for any new/changed primitives, patterns, capabilities, or integrations.
