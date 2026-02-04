// AI-META-BEGIN
// 
// AI-META: Next.js app router page or layout component
// OWNERSHIP: apps/template-site
// ENTRYPOINTS: Direct route access via Next.js app router
// DEPENDENCIES: internal packages (@repo/*)
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

import { Hero } from '@repo/patterns'

const heroContent = {
  headline: 'Welcome to Template Site',
  subhead: 'A demonstration of the firm platform architecture',
  ctaPrimary: {
    label: 'Get Started',
    href: '#contact'
  },
  ctaSecondary: {
    label: 'Learn More',
    href: '#features'
  }
}

export default function HomePage() {
  return (
    <main>
      <Hero content={heroContent} />
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Template Site</h2>
          <p className="text-center text-muted-foreground">
            This is the template site that demonstrates the platform architecture.
          </p>
        </div>
      </section>
    </main>
  )
}
