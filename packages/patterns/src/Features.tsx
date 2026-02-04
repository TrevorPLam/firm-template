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

export interface FeatureItem {
  icon?: React.ReactNode
  title: string
  description: React.ReactNode
}

export interface FeaturesContent {
  title?: string
  description?: string
  items: FeatureItem[]
}

export interface FeaturesProps {
  content: FeaturesContent
  className?: string
}

/**
 * Features / value props section pattern. Content as props; uses primitives only.
 */
export function Features({ content, className }: FeaturesProps) {
  const { title, description, items } = content

  return (
    <Section className={className ?? 'bg-background-alt'}>
      <Container>
        {(title != null || description != null) && (
          <div className="text-center mb-12">
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
        <Grid cols={1} colsMd={3} gap={8}>
          {items.map((item, index) => (
            <Card key={index} variant="default">
              {item.icon != null && (
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-primary [&>svg]:w-6 [&>svg]:h-6">{item.icon}</span>
                </div>
              )}
              <Typography variant="h4" as="h3" className="mb-3">
                {item.title}
              </Typography>
              <div className="text-foreground-muted leading-relaxed space-y-4">
                {item.description}
              </div>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  )
}
