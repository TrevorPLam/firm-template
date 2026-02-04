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

export interface ContactBlock {
  /** Icon element (e.g. from lucide-react) */
  icon: React.ReactNode
  title: string
  /** Value: string or ReactNode (e.g. <a href="mailto:...">) */
  value: React.ReactNode
}

export interface ContactContent {
  /** Optional dark hero above form */
  heroTitle?: string
  heroSubhead?: string
  /** Main section heading */
  heading?: string
  /** Main section description */
  description?: string
  /** Form slot: app provides ContactForm or capability component */
  formSlot: React.ReactNode
  /** Contact info blocks (email, phone, hours) */
  contactBlocks?: ContactBlock[]
  /** Optional "what happens next" steps (ReactNode) */
  stepsSlot?: React.ReactNode
}

export interface ContactProps {
  content: ContactContent
  className?: string
}

/**
 * Contact section pattern. Content as props; form and steps are slots from app/capabilities.
 */
export function Contact({ content, className }: ContactProps) {
  const {
    heroTitle,
    heroSubhead,
    heading,
    description,
    formSlot,
    contactBlocks,
    stepsSlot,
  } = content

  return (
    <>
      {(heroTitle != null || heroSubhead != null) && (
        <Section className="bg-foreground text-primary-foreground py-16 md:py-24">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              {heroTitle != null && (
                <Typography variant="h1" as="h1" className="text-white mb-6">
                  {heroTitle}
                </Typography>
              )}
              {heroSubhead != null && (
                <Typography variant="body" as="p" className="text-xl text-white/80">
                  {heroSubhead}
                </Typography>
              )}
            </div>
          </Container>
        </Section>
      )}

      <Section className={className ?? 'bg-background-alt'}>
        <Container>
          <Grid cols={1} colsLg={2} gap={12}>
            <div>
              {heading != null && (
                <Typography variant="h2" as="h2" className="mb-6">
                  {heading}
                </Typography>
              )}
              {description != null && (
                <Typography variant="body-muted" as="p" className="mb-8">
                  {description}
                </Typography>
              )}
              {formSlot}
            </div>
            <div>
              {contactBlocks != null && contactBlocks.length > 0 && (
                <>
                  <Typography variant="h2" as="h2" className="mb-6">
                    Get In Touch
                  </Typography>
                  <div className="space-y-6 mb-8">
                    {contactBlocks.map((block, index) => (
                      <Card key={index} variant="default">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 text-primary [&>svg]:w-6 [&>svg]:h-6">
                            {block.icon}
                          </div>
                          <div>
                            <Typography variant="body" as="h3" className="font-semibold text-foreground mb-1">
                              {block.title}
                            </Typography>
                            <div className="text-primary [&>a]:hover:text-primary-hover [&>a]:transition-colors">
                              {block.value}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
              {stepsSlot != null && (
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6">
                  {stepsSlot}
                </div>
              )}
            </div>
          </Grid>
        </Container>
      </Section>
    </>
  )
}
