# PLACEHOLDER_REFERENCE.md — Content Replacement Map

Last Updated: 2026-01-21
Status: Active

Goal: Provide a single map of placeholder content locations and replacement priority.

---

## How to use this file
1. Replace **Priority 1** placeholders before launch.
2. Then work through **Priority 2** and **Priority 3** as time allows.
3. Use `rg` to locate additional placeholder strings:
   ```bash
   rg -n "Your Firm|Core Service|Key Benefit|Feature" \
     app components content lib public
   ```

---

## Priority 1 — Required before launch
| Area | Placeholder | Files to update |
| --- | --- | --- |
| Branding | `Your Firm Name`, `Your Firm LLC` | `lib/env.ts`, `lib/env.public.ts`, `components/Footer.tsx`, `components/Navigation.tsx`, `app/layout.tsx` |
| Metadata + OG | `Your Firm Name` in titles/OG | `app/layout.tsx`, `app/api/og/route.tsx`, `public/manifest.json` |
| Homepage | Hero + value props placeholders | `components/Hero.tsx`, `components/ValueProps.tsx`, `components/CTASection.tsx`, `components/FinalCTA.tsx` |
| Services | `Core Service 1-8` placeholders | `app/services/service-[1-8]/page.tsx`, `app/services/page.tsx`, `components/ServicesOverview.tsx` |
| Pricing | `Basic/Professional/Enterprise` placeholders | `app/pricing/page.tsx` |
| Contact | Page metadata + copy | `app/contact/page.tsx` |

---

## Priority 2 — Recommended for launch polish
| Area | Placeholder | Files to update |
| --- | --- | --- |
| About | `Your Firm Name` narrative | `app/about/page.tsx` |
| Blog | Example posts + author | `content/blog/*.mdx`, `lib/blog.ts`, `app/blog/page.tsx` |
| Video | Placeholder video IDs + captions | `components/Hero.tsx`, `app/about/page.tsx`, `app/services/service-1/page.tsx`, `content/blog/*.mdx` |
| Search | Search page metadata | `app/search/page.tsx` |

---

## Priority 3 — Optional enhancements
| Area | Placeholder | Files to update |
| --- | --- | --- |
| Footer links | Generic service links | `components/Footer.tsx` |
| Service detail schema | Organization name | `components/ServiceDetailLayout.tsx` |
| Verification notes | Placeholder mentions | `docs/SANITIZATION_VERIFICATION.md` |

---

## AI iteration notes
- Keep the component structure intact; replace copy only.
- Use short, scannable sentences for hero/value props.
- Match metadata titles to the format: `Page | Your Firm Name`.
