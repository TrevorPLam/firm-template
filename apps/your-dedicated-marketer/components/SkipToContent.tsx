// AI-META-BEGIN
// 
// AI-META: React component: SkipToContent
// OWNERSHIP: apps/your-dedicated-marketer
// ENTRYPOINTS: Imported by pages and other components
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Props and styling: generally safe. Logic changes: test thoroughly
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

/**
 * Skip to Content Link
 * Allows keyboard users to skip navigation and go directly to main content
 * Improves accessibility for screen reader and keyboard-only users
 */

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-blue-600 focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  )
}
