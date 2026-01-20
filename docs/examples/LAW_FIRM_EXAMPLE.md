# LAW_FIRM_EXAMPLE.md — Vertical Customization Example (Law Firm)

Last Updated: 2026-01-20
Status: Draft

Goal: Show how to adapt the template for a law firm while keeping routing and component structure intact.

> AI note: Use this as a mapping guide. Replace placeholder copy only; keep components and layouts unchanged.

---

## Service Structure (Mapping to `/app/services/service-[1-8]/`)
| Service Route | Suggested Law Firm Service | Summary/Positioning |
| --- | --- | --- |
| service-1 | Corporate Law | Entity formation, governance, contracts, and compliance. |
| service-2 | Family Law | Divorce, custody, support, and mediation services. |
| service-3 | Estate Planning | Wills, trusts, and long-term asset protection. |
| service-4 | Litigation | Civil disputes, trial representation, and arbitration. |
| service-5 | Real Estate Law | Purchases, leases, zoning, and title review. |
| service-6 | Employment Law | Employer policies, disputes, and compliance counsel. |
| service-7 | Intellectual Property | Trademarks, copyrights, and IP strategy. |
| service-8 | Business Advisory | Ongoing general counsel and strategic guidance. |

**Customization notes**
- Keep the same routes; update page titles, descriptions, benefits, and feature bullets.
- Link the strongest conversion CTA to the primary practice area (e.g., litigation consults).

---

## Sample Pricing Structure (Placeholder Tiers)
**Purpose**: Communicate transparency without revealing confidential fee structures.

| Tier | Label | Example Positioning | Example Includes |
| --- | --- | --- | --- |
| Basic | Consultation | Fixed-fee intake or hourly consult | 60–90 minute consult, document review, next-step plan |
| Professional | Matter-Based | Flat-fee packages | Standard filings, negotiation, status updates |
| Enterprise | Retainer | Ongoing counsel | Priority response, quarterly reviews, custom reporting |

> AI note: If your firm is hourly-only, keep the tiers but replace pricing with “Contact for Pricing.”

---

## Sample Blog Topics
- “What to Prepare Before a Business Formation Consultation”
- “Estate Planning Checklist for Growing Families”
- “Litigation vs. Arbitration: Which Path Fits Your Case?”
- “Employment Compliance Updates for 2026”
- “Key Clauses to Watch in Commercial Leases”

---

## Recommended Environment Variables (Example Values)
- `NEXT_PUBLIC_SITE_NAME="Summit Ridge Law"`
- `NEXT_PUBLIC_SITE_TAGLINE="Practical counsel for complex legal matters"`
- `FIRM_LEGAL_NAME="Summit Ridge Law, PLLC"`
- `NEXT_PUBLIC_PRIMARY_CTA="Schedule a Case Review"`
- `NEXT_PUBLIC_SECONDARY_CTA="View Practice Areas"`

---

## Content Checklist (Law Firm)
- Replace hero headline + subcopy with your primary practice positioning.
- Add attorney bios and credentials to `/app/about/page.tsx` or a future `/app/team` page.
- Swap testimonials with anonymized client results or practice outcomes.
- Review disclaimers and add legal-specific footers where required by jurisdiction.
