// AI-META-BEGIN
// 
// AI-META: Shared package module
// OWNERSHIP: packages/patterns
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: internal packages (@repo/*), React
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

import React from 'react'
import { Accordion, type AccordionItem, Container, Section, Typography } from '@repo/ui'

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQContent {
  title?: string
  items: FAQItem[]
}

export interface FAQProps {
  content: FAQContent
  className?: string
}

/**
 * FAQ section pattern. Content as props; uses Accordion primitive only.
 */
export function FAQ({ content, className }: FAQProps) {
  const { title, items } = content

  const accordionItems: AccordionItem[] = items.map((item) => ({
    question: item.question,
    answer: item.answer,
  }))

  return (
    <Section className={className ?? 'bg-background-alt'}>
      <Container>
        <div className="max-w-3xl mx-auto">
          {title != null && (
            <Typography variant="h2" as="h2" className="mb-8 text-center">
              {title}
            </Typography>
          )}
          <Accordion items={accordionItems} />
        </div>
      </Container>
    </Section>
  )
}
