// AI-META-BEGIN
// 
// AI-META: React component: Hero
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Imported by pages and other components
// DEPENDENCIES: internal packages (@repo/*), Next.js framework, React
// DANGER: None identified
// CHANGE-SAFETY: Props and styling: generally safe. Logic changes: test thoroughly
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

/**
 * Homepage hero – thin wrapper around @repo/patterns Hero with app content and media slot.
 */
import React from 'react'
import Image from 'next/image'
import VideoPlayer from '@/components/VideoPlayer'
import { Hero as HeroPattern } from '@repo/patterns'

const heroMediaType: 'image' | 'video' = 'video'
const heroVideo = {
  provider: 'youtube' as const,
  videoId: 'ysz5S6PUM-U',
  title: 'Firm overview video',
  caption: 'Replace with a short explainer or welcome video for your firm.',
}

export default function Hero() {
  const content = {
    headline: 'Your professional partner — delivering expert solutions for your business.',
    subhead:
      'We work alongside businesses and teams who want clear strategy, honest execution, and a partner who takes ownership — not a detached vendor.',
    ctaPrimary: { label: 'Book a Free Consultation', href: '/contact' },
    ctaSecondary: { label: 'Get Started', href: '/contact' },
    disclaimer: 'No contracts · Cancel anytime · Free consultation, no obligation',
    media:
      heroMediaType === 'video' ? (
        <VideoPlayer
          provider={heroVideo.provider}
          videoId={heroVideo.videoId}
          title={heroVideo.title}
          caption={heroVideo.caption}
        />
      ) : (
        <div className="bg-gradient-to-br from-foreground to-primary/20 rounded-2xl p-4 aspect-square flex items-center justify-center shadow-lg">
          <Image
            src="/images/hero-growth.svg"
            alt="Stylized growth chart representing business growth and success"
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
