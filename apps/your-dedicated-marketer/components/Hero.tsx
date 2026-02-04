// AI-META-BEGIN
// 
// AI-META: React component: Hero
// OWNERSHIP: apps/your-dedicated-marketer
// ENTRYPOINTS: Imported by pages and other components
// DEPENDENCIES: internal packages (@repo/*), Next.js framework, React
// DANGER: None identified
// CHANGE-SAFETY: Props and styling: generally safe. Logic changes: test thoroughly
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

/**
 * Homepage hero – thin wrapper around @repo/patterns Hero with app content and media slot.
 */
import React from 'react'
import Image from 'next/image'
import { Hero as HeroPattern } from '@repo/patterns'

export default function Hero() {
  const content = {
    headline: 'Your dedicated marketer — that means I’m part of your team.',
    subhead:
      'I work alongside founders and teams who want clear strategy, honest execution, and a marketer who takes ownership — not a detached agency.',
    ctaPrimary: { label: 'Book a Free Strategy Call', href: '/contact' },
    ctaSecondary: { label: 'Get a Free Marketing Plan', href: '/contact' },
    disclaimer: 'No contracts · Cancel anytime · Free strategy call, no obligation',
    media: (
      <div className="bg-gradient-to-br from-foreground to-primary/20 p-4 aspect-square flex items-center justify-center">
        <Image
          src="/images/hero-growth.svg"
          alt="Stylized bar chart climbing upward to represent marketing growth"
          width={640}
          height={640}
          sizes="(min-width: 1280px) 592px, (min-width: 1024px) 50vw, 0px"
          priority
          className="h-full w-full object-contain"
        />
      </div>
    ),
  }

  return (
    <HeroPattern
      content={content}
      className="bg-gradient-to-b from-background to-background-alt py-20 md:py-32"
    />
  )
}
