// AI-META-BEGIN
// 
// AI-META: React component: FinalCTA
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Imported by pages and other components
// DEPENDENCIES: internal packages (@repo/*), Next.js framework, React
// DANGER: None identified
// CHANGE-SAFETY: Props and styling: generally safe. Logic changes: test thoroughly
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

import React, { memo } from 'react'
import Link from 'next/link'
import { Button } from '@repo/ui'
import { Container } from '@repo/ui'
import { Section } from '@repo/ui'

/**
 * TEMPLATE CUSTOMIZATION:
 * Update the heading and description to match your firm's offering.
 * Update CTA button text to match your preferred action (consultation, demo, quote, etc.)
 */

function FinalCTA() {
  return (
    <Section className="bg-charcoal text-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-white/90 mb-8 leading-relaxed">
            Schedule a free consultation and we'll discuss how we can help your business succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="primary" size="large">
                Schedule a Consultation
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="large" className="border-white text-charcoal bg-white hover:bg-off-white">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default memo(FinalCTA)
