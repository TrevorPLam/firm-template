/**
 * filepath: apps/your-dedicated-marketer/components/FinalCTA.tsx
 * purpose: Render the final call-to-action section with primary and secondary actions.
 * last_updated: 2026-01-31
 * related_tasks: ALIGN-003
 */
import React, { memo } from 'react'
import Link from 'next/link'
import { Button, Container, Section } from '@repo/ui'

function FinalCTA() {
  return (
    <Section className="bg-foreground text-background">
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
            Ready to grow with me?
          </h2>
          <p className="text-lg text-background/90 mb-8 leading-relaxed">
            Book a free strategy call and I’ll map the next marketing moves with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="primary" size="large">
                Book a Free Strategy Call
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="secondary"
                size="large"
                className="border-background text-foreground bg-background hover:bg-background-alt"
              >
                Get a Free Marketing Plan
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default memo(FinalCTA)
