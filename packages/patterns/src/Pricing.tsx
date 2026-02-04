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
import { Card, Container, Grid, Link, Section, Typography } from '@repo/ui'

export interface PricingFeature {
  name: string
  included: boolean
}

export interface PricingTier {
  name: string
  price: string
  period?: string
  description: string
  features: PricingFeature[]
  cta: string
  href: string
  popular?: boolean
}

export interface PricingAddOn {
  name: string
  price: string
  description: string
}

export interface PricingContent {
  /** Optional dark hero above tiers */
  heroTitle?: string
  heroSubhead?: string
  heroNote?: string
  tiers: PricingTier[]
  addOns?: PricingAddOn[]
  /** Optional: pass Check and X icons for feature list (e.g. from lucide-react) */
  checkIcon?: React.ReactNode
  xIcon?: React.ReactNode
}

export interface PricingProps {
  content: PricingContent
  className?: string
}

/**
 * Pricing section pattern. Content as props; uses primitives only.
 */
export function Pricing({ content, className }: PricingProps) {
  const { heroTitle, heroSubhead, heroNote, tiers, addOns, checkIcon, xIcon } = content

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
                <Typography variant="body" as="p" className="text-xl text-white/80 mb-4">
                  {heroSubhead}
                </Typography>
              )}
              {heroNote != null && (
                <Typography variant="body-muted" as="p" className="text-lg text-white/70">
                  {heroNote}
                </Typography>
              )}
            </div>
          </Container>
        </Section>
      )}

      <Section className={className ?? 'bg-background-alt'}>
        <Container>
          <Grid cols={1} colsLg={3} gap={8} className="max-w-7xl mx-auto">
            {tiers.map((tier, index) => (
              <Card
                key={index}
                variant="default"
                className={tier.popular === true ? 'ring-2 ring-primary relative' : ''}
              >
                {tier.popular === true && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <Typography variant="h3" as="h3" className="mb-2">
                    {tier.name}
                  </Typography>
                  <div className="mb-3">
                    <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                    {tier.period != null && tier.period !== '' && (
                      <Typography variant="body-muted" as="span" className="ml-1">
                        {tier.period}
                      </Typography>
                    )}
                  </div>
                  <Typography variant="small-muted" as="p">
                    {tier.description}
                  </Typography>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {feature.included
                        ? checkIcon != null && (
                            <span className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 [&>svg]:w-5 [&>svg]:h-5">
                              {checkIcon}
                            </span>
                          )
                        : xIcon != null && (
                            <span className="w-5 h-5 text-foreground-muted/30 flex-shrink-0 mt-0.5 [&>svg]:w-5 [&>svg]:h-5">
                              {xIcon}
                            </span>
                          )}
                      {!feature.included && checkIcon == null && xIcon == null && (
                        <span className="w-5 h-5 flex-shrink-0 mt-0.5 text-foreground-muted/30" aria-hidden>
                          —
                        </span>
                      )}
                      {feature.included && checkIcon == null && (
                        <span className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" aria-hidden>
                          ✓
                        </span>
                      )}
                      <span
                        className={
                          feature.included ? 'text-foreground' : 'text-foreground-muted/50'
                        }
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  variant={tier.popular === true ? 'primary-button' : 'secondary-button'}
                  className="w-full inline-flex justify-center"
                >
                  {tier.cta}
                </Link>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {addOns != null && addOns.length > 0 && (
        <Section className="bg-background">
          <Container>
            <div className="text-center mb-12">
              <Typography variant="h2" as="h2" className="mb-4">
                Add-On Services
              </Typography>
              <Typography variant="body-muted" as="p" className="max-w-2xl mx-auto">
                Enhance your service package with additional specialized offerings
              </Typography>
            </div>
            <Grid cols={1} colsMd={2} gap={6} className="max-w-4xl mx-auto">
              {addOns.map((addon, index) => (
                <Card key={index} variant="default">
                  <Typography variant="h4" as="h3" className="mb-2">
                    {addon.name}
                  </Typography>
                  <Typography variant="body" as="p" className="text-primary font-semibold mb-2">
                    {addon.price}
                  </Typography>
                  <Typography variant="small-muted" as="p">
                    {addon.description}
                  </Typography>
                </Card>
              ))}
            </Grid>
          </Container>
        </Section>
      )}
    </>
  )
}
