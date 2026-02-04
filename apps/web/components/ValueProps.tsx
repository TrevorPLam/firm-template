// AI-META-BEGIN
// 
// AI-META: React component: ValueProps
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Imported by pages and other components
// DEPENDENCIES: internal packages (@repo/*), React
// DANGER: None identified
// CHANGE-SAFETY: Props and styling: generally safe. Logic changes: test thoroughly
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

/**
 * Value propositions – thin wrapper around @repo/patterns Features with app content.
 */
import React, { memo } from 'react'
import { Target, DollarSign, Settings } from 'lucide-react'
import { Features as FeaturesPattern } from '@repo/patterns'

const valueProps = [
  {
    icon: <Target className="w-6 h-6" aria-hidden />,
    title: 'Expert guidance, strategic execution',
    description: (
      <>
        <p>Success requires more than just doing tasks. You need a partner who understands your business context and goals.</p>
        <p>We provide:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Deep understanding of your business objectives</li>
          <li>Strategic planning aligned with your goals</li>
          <li>Proactive recommendations, not just execution</li>
          <li>Ongoing accountability and results tracking</li>
        </ul>
        <p>That&apos;s the value we deliver.</p>
      </>
    ),
  },
  {
    icon: <DollarSign className="w-6 h-6" aria-hidden />,
    title: 'True partnership approach',
    description: (
      <>
        <p>
          We work as an extension of your team, learning your business and taking ownership — not just checking boxes.
        </p>
        <p>When we work together:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>We learn your business like an internal team member would</li>
          <li>We help shape priorities, not just follow orders</li>
          <li>We integrate with your existing processes and tools</li>
          <li>You get senior-level expertise without full-time overhead</li>
        </ul>
        <p>You stay focused on running the business.</p>
        <p>We take responsibility for delivering results.</p>
      </>
    ),
  },
  {
    icon: <Settings className="w-6 h-6" aria-hidden />,
    title: 'Ideal for ambitious organizations',
    description: (
      <>
        <p>This approach works best if:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>You&apos;re a leader looking for strategic partnership</li>
          <li>You want senior-level expertise and ownership</li>
          <li>You prefer depth over managing multiple vendors</li>
          <li>You value clarity, momentum, and follow-through</li>
        </ul>
        <p>If you&apos;re looking for a hands-off vendor or one-time project, this may not be the right fit.</p>
        <p>If you want a dedicated partner invested in your success, it is.</p>
      </>
    ),
  },
]

function ValueProps() {
  return (
    <FeaturesPattern
      content={{ items: valueProps }}
      className="bg-background-alt"
    />
  )
}

export default memo(ValueProps)
