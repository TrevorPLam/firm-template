# Launch Scope v1

**Decision Date**: 2026-01-11
**Status**: Confirmed

## What Ships in v1

1. **Lead Capture**: Full pipeline (Supabase database + HubSpot CRM sync)
2. **Analytics**: Required at launch (provider to be selected in T-064)
3. **Core Pages**: Home, About, Services, Pricing, Contact, Blog, Privacy, Terms
4. **PWA**: Progressive Web App features (installable, offline-ready)
5. **Search**: Site-wide search functionality

## Critical Path (Business-Breaking Failures)

If these fail on launch day, the business is blocked:
- Contact form cannot save leads to Supabase
- Privacy or Terms pages return 404
- Site fails to build/deploy

## Best-Effort (Non-Blocking)

These can fail without breaking launch:
- HubSpot CRM sync (leads still saved to Supabase)
- Analytics tracking (can be fixed post-launch)
- Search functionality (degrades gracefully)

## Out of Scope for v1

- Email sending (replaced by database storage)
- Advanced CRM automation
- A/B testing
- Multi-language support
