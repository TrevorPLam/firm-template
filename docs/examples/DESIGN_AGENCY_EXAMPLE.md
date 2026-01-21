# DESIGN_AGENCY_EXAMPLE.md — Vertical Customization Example (Design Agency)

Last Updated: 2026-01-21
Status: Example

Goal: Provide a design agency configuration with creative services and flexible pricing models.

**Meta**
- Audience: Design agencies, creative studios, product design teams
- Scope: Copy updates only (services, pricing models, blog topics, CTAs)
- Non-goals: Route changes, component refactors, or layout changes

> AI note: Keep layout and component structure the same; update creative services and visuals only.

---

## Service Structure (Mapping to `/app/services/service-[1-8]/`)
| Service Route | Suggested Design Service | Summary/Positioning |
| --- | --- | --- |
| service-1 | Brand Identity | Logos, messaging, and visual systems. |
| service-2 | Web Design | Conversion-focused marketing sites and landing pages. |
| service-3 | UX/UI Design | Product and app interface design. |
| service-4 | Design Systems | Component libraries and documentation. |
| service-5 | Motion Graphics | Short-form animations and micro-interactions. |
| service-6 | Product Strategy | Discovery workshops and product visioning. |
| service-7 | Creative Retainer | Ongoing design capacity for marketing teams. |
| service-8 | Content Production | Visual assets, templates, and campaign design. |

**Customization notes**
- Add portfolio links or case studies to each service detail page.
- Use the blog to share process breakdowns and client outcomes.
- Emphasize creative process and deliverables in CTAs.

---

## Sample Pricing Models
- **Project-Based**: Fixed fee per project (brand, website, product sprint).
- **Hourly**: Design sprints or overflow support.
- **Retainer**: Monthly design capacity with a scoped backlog.

> AI note: Clarify what is in-scope (deliverables, revisions, handoff assets).

**Suggested FAQ swaps for `/app/pricing/page.tsx`**
- “How many revision rounds are included?”
- “What does handoff include?”
- “Do you offer ongoing design support?”

---

## Sample Blog Topics
- “How to Prepare for a Brand Discovery Workshop”
- “UX Research Methods That Improve Conversion”
- “Design System ROI: Why It Matters”
- “Website Launch Checklist for Professional Services Firms”
- “Motion Graphics Trends for B2B Brands”

---

## Content Checklist (Design Agency)
- Update imagery in `/public/` with portfolio-quality visuals.
- Add a short “Process” section to the homepage or services pages.
- Ensure contact form captures project timeline, budget, and preferred deliverables.
- Replace client logos in `/public/clients/` with brand partners, and add award badges in `/components/TrustBadge.tsx`.
- Replace placeholder video IDs in the hero, about, and service pages with studio reels.
- Add a portfolio CTA to the hero secondary button.

---

## Implementation Steps (Copy-Only)
1. Map top services to the eight routes and update benefits to emphasize outcomes.
2. Replace pricing tiers with project, hourly, or retainer framing.
3. Refresh blog topics with process, research, and launch insights.
4. Swap images and thumbnails with portfolio-ready assets.
