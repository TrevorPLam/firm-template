// AI-META-BEGIN
// 
// AI-META: React component: SocialProof
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Imported by pages and other components
// DEPENDENCIES: internal packages (@repo/*), React
// DANGER: None identified
// CHANGE-SAFETY: Props and styling: generally safe. Logic changes: test thoroughly
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

/**
 * Testimonials / social proof – thin wrapper around @repo/patterns Testimonials with app content.
 */
import React, { memo } from 'react'
import { Testimonials as TestimonialsPattern } from '@repo/patterns'

const testimonials = [
  {
    quote: "Working with this firm transformed our business operations. We saw a 150% increase in qualified leads within the first 3 months.",
    author: 'Sarah Johnson',
    company: 'Tech Solutions Inc.',
    title: 'CEO',
  },
  {
    quote: "Finally, a professional partner that actually understands founder and team realities. No fluff, just results-driven strategies that work.",
    author: 'Michael Chen',
    company: 'Local Services Co.',
    title: 'Founder',
  },
  {
    quote: "The transparency and communication are outstanding. I always know exactly what's being done and why. Our ROI has been exceptional.",
    author: 'Emily Rodriguez',
    company: 'E-commerce Store',
    title: 'Owner',
  },
]

const metrics = [
  { value: '127%', label: 'Average Growth' },
  { value: '50+', label: 'Clients Served' },
  { value: '95%', label: 'Client Retention' },
]

function SocialProof() {
  return (
    <TestimonialsPattern
      content={{
        title: 'Trusted by clients we work with',
        description: "Here's what clients say about working with us",
        testimonials,
        metrics,
      }}
      className="bg-background-alt"
    />
  )
}

export default memo(SocialProof)
