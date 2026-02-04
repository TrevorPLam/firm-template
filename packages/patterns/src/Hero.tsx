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
import { Container, Grid, Link, Typography } from '@repo/ui'

export interface HeroCTA {
  label: string
  href: string
}

export interface HeroContent {
  headline: string
  subhead: string
  ctaPrimary: HeroCTA
  ctaSecondary?: HeroCTA
  disclaimer?: string
  /** Right column: image, video, or custom content. Rendered only on lg+ unless omitted. */
  media?: React.ReactNode
}

export interface HeroProps {
  content: HeroContent
  className?: string
}

/**
 * Hero section pattern. Content as props; uses primitives only.
 */
export function Hero({ content, className }: HeroProps) {
  const { headline, subhead, ctaPrimary, ctaSecondary, disclaimer, media } = content

  return (
    <section
      className={className ?? 'bg-gradient-to-b from-background to-background-alt py-20 md:py-32'}
      aria-labelledby="hero-heading"
    >
      <Container>
        <Grid cols={1} colsLg={2} gap={6} className="items-center">
          <div>
            <Typography variant="h1" as="h1" id="hero-heading" className="mb-6">
              {headline}
            </Typography>
            <Typography variant="body" as="p" className="text-lg md:text-xl text-foreground-muted mb-8">
              {subhead}
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link variant="primary-button" href={ctaPrimary.href}>
                {ctaPrimary.label}
              </Link>
              {ctaSecondary && (
                <Link variant="secondary-button" href={ctaSecondary.href}>
                  {ctaSecondary.label}
                </Link>
              )}
            </div>
            {disclaimer && (
              <Typography variant="small-muted" as="p" className="mt-4">
                {disclaimer}
              </Typography>
            )}
          </div>
          {media != null && (
            <div className="hidden lg:block [&>*]:rounded-2xl [&>*]:shadow-lg">
              {media}
            </div>
          )}
        </Grid>
      </Container>
    </section>
  )
}
