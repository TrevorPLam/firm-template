# CONSULTING_FIRM_EXAMPLE.md — Vertical Customization Example (Consulting)

Last Updated: 2026-01-21
Status: Example

Goal: Illustrate a consulting firm adaptation with clear service mapping and pricing models.

**Meta**
- Audience: Strategy, operations, and transformation consultancies
- Scope: Copy updates only (services, pricing models, blog topics, CTAs)
- Non-goals: Route changes, component refactors, or layout changes

> AI note: Keep the service routes; update copy and CTA focus to match your consulting offer.

---

## Service Structure (Mapping to `/app/services/service-[1-8]/`)
| Service Route | Suggested Consulting Service | Summary/Positioning |
| --- | --- | --- |
| service-1 | Strategy & Growth | Market assessment, positioning, and GTM planning. |
| service-2 | Operations Optimization | Process redesign, workflow improvement, and KPIs. |
| service-3 | Digital Transformation | Tech roadmap, modernization, and enablement. |
| service-4 | Change Management | Stakeholder alignment and adoption planning. |
| service-5 | Customer Experience | Journey mapping, service design, and retention strategy. |
| service-6 | Data & Analytics | Reporting, dashboards, and decision frameworks. |
| service-7 | PMO & Delivery | Program governance, cadence, and risk management. |
| service-8 | Executive Advisory | Board/leadership counsel and strategic reviews. |

**Customization notes**
- Align one CTA to “Schedule a Discovery Call” and another to “View Case Studies.”
- Highlight outcomes (cost saved, time reduced, revenue impact) in service benefits.
- Add “Engagement Phases” bullets to pricing and services.

---

## Sample Pricing Models
**Project-Based (Typical)**
- Discovery Sprint (2–4 weeks)
- Delivery Phase (8–12 weeks)
- Executive Retainer (monthly)

**Retainer (Ongoing)**
- Monthly strategy review + KPI tracking
- Quarterly leadership workshops

> AI note: Use “Contact for Pricing” if engagement scope varies by client size.

**Suggested FAQ swaps for `/app/pricing/page.tsx`**
- “What does a discovery sprint include?”
- “How do you scope project phases?”
- “Can we start with a pilot engagement?”

---

## Sample Blog Topics
- “How to Build a 90-Day Transformation Roadmap”
- “Operational KPIs That Actually Drive Performance”
- “Change Management Mistakes to Avoid”
- “What Good PMO Governance Looks Like”
- “Leadership Alignment: A Practical Framework”

---

## Content Checklist (Consulting)
- Include anonymized case studies and outcomes in the services pages.
- Add a short “Engagement Phases” section to the pricing page.
- Ensure the contact form captures company size and desired timeline.
- Replace client logos in `/public/clients/` with approved logos, and add partner badges in `/components/TrustBadge.tsx`.
- Replace placeholder video IDs in the hero, about, and service pages with consulting explainer videos.
- Add an “Outcomes” callout block to the hero or value props.

---

## Implementation Steps (Copy-Only)
1. Map your top eight services to the existing service routes.
2. Update service benefits to focus on measurable impact.
3. Replace pricing tiers with discovery, delivery, and retainer framing.
4. Add blog topics that showcase thought leadership frameworks.
