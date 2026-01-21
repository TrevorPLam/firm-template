# ACCOUNTING_FIRM_EXAMPLE.md — Vertical Customization Example (Accounting)

Last Updated: 2026-01-21
Status: Example

Goal: Provide an accounting-focused template configuration with common services and pricing signals.

**Meta**
- Audience: CPA firms, bookkeeping firms, fractional CFO teams
- Scope: Copy updates only (services, pricing tiers, blog topics, FAQs)
- Non-goals: Route changes, component refactors, or layout changes

> AI note: Keep service routes intact. Update copy, benefits, and FAQs to reflect compliance and trust.

---

## Service Structure (Mapping to `/app/services/service-[1-8]/`)
| Service Route | Suggested Accounting Service | Summary/Positioning |
| --- | --- | --- |
| service-1 | Tax Preparation | Individual and business filing support. |
| service-2 | Bookkeeping | Monthly reconciliation and reporting. |
| service-3 | Payroll Services | Payroll processing, compliance, and filings. |
| service-4 | Audit & Assurance | Financial statement audits and attestations. |
| service-5 | CFO Advisory | Forecasting, cash flow, and strategic planning. |
| service-6 | Business Formation | Entity selection and setup support. |
| service-7 | Compliance Support | Regulatory filings and deadline management. |
| service-8 | Nonprofit Accounting | Fund accounting and reporting guidance. |

**Customization notes**
- Highlight compliance, accuracy, and proactive planning in every service description.
- Add relevant certifications (CPA, EA) to the About or Team section.
- Emphasize deadlines and seasonal readiness in CTAs.

---

## Sample Pricing Structure
| Tier | Label | Example Positioning | Example Includes |
| --- | --- | --- | --- |
| Basic | Essentials | Straightforward filings and monthly bookkeeping | Monthly reconciliations, tax filing checklist |
| Professional | Growth | Expanded reporting and planning | Quarterly reviews, cash flow reporting |
| Enterprise | Advisory | Dedicated finance strategy | Forecasts, CFO advisory calls, custom reporting |

> AI note: If you price per employee or transaction volume, note that in the pricing FAQ.

**Suggested FAQ swaps for `/app/pricing/page.tsx`**
- “What bookkeeping cadence do you recommend?”
- “Do you support year-end tax planning?”
- “Which accounting systems do you support?”

---

## Sample Blog Topics
- “Quarter-End Close Checklist for Small Businesses”
- “Tax Planning Tips for Growing Teams”
- “Cash Flow Forecasting: A Simple Framework”
- “Common Audit Readiness Gaps to Avoid”
- “Year-End Accounting Prep Timeline”

---

## Content Checklist (Accounting)
- Add trust badges or certifications in the footer.
- Ensure contact form captures industry, revenue range, and accounting system used.
- Replace client logos in `/public/clients/` with approved industries, and add CPA badges in `/components/TrustBadge.tsx`.
- Replace testimonial placeholders with anonymized financial outcomes.
- Replace placeholder video IDs in the hero, about, and service pages with accounting overview videos.
- Add deadline reminders in the blog or CTA sections.

---

## Implementation Steps (Copy-Only)
1. Replace service descriptions with compliance-focused benefits and deliverables.
2. Update pricing tiers to match monthly, quarterly, and advisory scopes.
3. Swap blog topics to cover planning, close cycles, and audit readiness.
4. Confirm contact form intake fields match your onboarding process.
