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
import { Card, Container, Grid, Section, Typography } from '@repo/ui'

export interface TestimonialItem {
  quote: string
  author: string
  company: string
  title?: string
}

export interface TestimonialMetric {
  value: string
  label: string
}

export interface TestimonialsContent {
  title?: string
  description?: string
  testimonials: TestimonialItem[]
  metrics?: TestimonialMetric[]
}

export interface TestimonialsProps {
  content: TestimonialsContent
  className?: string
}

/**
 * Testimonials / social proof section pattern. Content as props; uses primitives only.
 */
export function Testimonials({ content, className }: TestimonialsProps) {
  const { title, description, testimonials, metrics } = content

  return (
    <Section className={className ?? 'bg-background-alt'}>
      <Container>
        {(title != null || description != null) && (
          <div className="text-center mb-16">
            {title != null && (
              <Typography variant="h2" as="h2" className="mb-4">
                {title}
              </Typography>
            )}
            {description != null && (
              <Typography variant="body-muted" as="p" className="max-w-2xl mx-auto">
                {description}
              </Typography>
            )}
          </div>
        )}

        <Grid cols={1} colsMd={3} gap={8} className="mb-16">
          {testimonials.map((item, index) => (
            <Card key={index} variant="testimonial">
              <Typography variant="body-muted" as="p" className="mb-6 italic leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </Typography>
              <div>
                <Typography variant="body" as="p" className="font-semibold text-foreground">
                  {item.author}
                </Typography>
                <Typography variant="small-muted" as="p">
                  {item.company}
                  {item.title != null && item.title !== '' ? `, ${item.title}` : ''}
                </Typography>
              </div>
            </Card>
          ))}
        </Grid>

        {metrics != null && metrics.length > 0 && (
          <Grid cols={3} gap={8} className="text-center">
            {metrics.map((metric, index) => (
              <div key={index}>
                <Typography variant="h2" as="p" className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {metric.value}
                </Typography>
                <Typography variant="body-muted" as="p" className="font-medium">
                  {metric.label}
                </Typography>
              </div>
            ))}
          </Grid>
        )}
      </Container>
    </Section>
  )
}
