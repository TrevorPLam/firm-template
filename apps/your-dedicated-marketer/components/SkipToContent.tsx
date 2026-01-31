/**
 * filepath: apps/your-dedicated-marketer/components/SkipToContent.tsx
 * purpose: Provide an accessible skip link for keyboard and screen reader users.
 * last_updated: 2026-01-31
 * related_tasks: ALIGN-003
 */

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:font-semibold focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  )
}
