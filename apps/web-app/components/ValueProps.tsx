import React, { memo } from 'react'
import { Target, DollarSign, Settings } from 'lucide-react'
import { Container } from '@repo/ui'
import { Section } from '@repo/ui'
import { Card } from '@repo/ui'

/**
 * TEMPLATE CUSTOMIZATION:
 * Replace these value propositions with your firm's unique benefits.
 * Keep the structure (icon, title, description) but update content to match your vertical.
 * 
 * Examples by industry:
 * - Law Firm: "Experienced legal counsel", "Client-first approach", "Proven track record"
 * - Consulting: "Strategic insights", "Implementation support", "Measurable outcomes"
 * - Accounting: "Tax optimization", "Compliance expertise", "Financial clarity"
 * - Design Agency: "Creative excellence", "Brand strategy", "Collaborative process"
 */

const valueProps = [
  {
    icon: Target,
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
        <p>That's the value we deliver.</p>
      </>
    ),
  },
  {
    icon: DollarSign,
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
    icon: Settings,
    title: 'Ideal for ambitious organizations',
    description: (
      <>
        <p>This approach works best if:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>You're a leader looking for strategic partnership</li>
          <li>You want senior-level expertise and ownership</li>
          <li>You prefer depth over managing multiple vendors</li>
          <li>You value clarity, momentum, and follow-through</li>
        </ul>
        <p>If you're looking for a hands-off vendor or one-time project, this may not be the right fit.</p>
        <p>If you want a dedicated partner invested in your success, it is.</p>
      </>
    ),
  },
]

function ValueProps() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="grid md:grid-cols-3 gap-8">
          {valueProps.map((prop, index) => {
            const Icon = prop.icon
            return (
              <Card key={index} variant="default">
                <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-teal" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-3">{prop.title}</h3>
                <div className="text-slate leading-relaxed space-y-4">{prop.description}</div>
              </Card>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

export default memo(ValueProps)
