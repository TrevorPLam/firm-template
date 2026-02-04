// AI-META-BEGIN
// 
// AI-META: Next.js app router page or layout component
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Direct route access via Next.js app router
// DEPENDENCIES: internal packages (@repo/*), Next.js framework, React
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { Container, Link as UILink, Section } from '@repo/ui'
import { Pricing as PricingPattern, FAQ as FAQPattern } from '@repo/patterns'
import AppointmentScheduler from '@/components/AppointmentScheduler'
import { getSchedulingConfig } from '@/lib/scheduling'
import { validatedPublicEnv } from '@/lib/env.public'

/**
 * TEMPLATE CUSTOMIZATION:
 * Update pricing tiers in tiers, addOns, faqs below.
 */

export const metadata: Metadata = {
  title: `Pricing | ${validatedPublicEnv.NEXT_PUBLIC_SITE_NAME}`,
  description: 'Transparent pricing for professional services. Choose from Basic, Professional, or Enterprise tiers. No hidden fees.',
}

const tiers = [
  {
    name: 'Basic',
    price: 'Contact Us',
    period: '',
    description: 'Essential services for getting started',
    features: [
      { name: '10 hours per month', included: true },
      { name: 'Email support (48hr response)', included: true },
      { name: 'Monthly progress reports', included: true },
      { name: 'Standard service delivery', included: true },
      { name: 'Access to client portal', included: true },
      { name: 'Quarterly planning sessions', included: true },
      { name: 'Priority support', included: false },
      { name: 'Dedicated account manager', included: false },
      { name: 'Custom solutions', included: false },
      { name: 'Weekly status calls', included: false },
    ],
    cta: 'Get Started',
    href: '/contact',
    popular: false,
  },
  {
    name: 'Professional',
    price: 'Contact Us',
    period: '',
    description: 'Comprehensive services for growing organizations',
    features: [
      { name: '25 hours per month', included: true },
      { name: 'Priority support (24hr response)', included: true },
      { name: 'Bi-weekly progress reports', included: true },
      { name: 'Expedited service delivery', included: true },
      { name: 'Access to client portal', included: true },
      { name: 'Monthly planning sessions', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Process optimization', included: true },
      { name: 'Bi-weekly status calls', included: true },
      { name: 'Dedicated account manager', included: false },
      { name: 'Custom integrations', included: false },
    ],
    cta: 'Get Started',
    href: '/contact',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    period: '',
    description: 'Full-service solutions for complex needs',
    features: [
      { name: 'Unlimited hours', included: true },
      { name: 'VIP support (4hr response)', included: true },
      { name: 'Weekly progress reports', included: true },
      { name: 'White-glove service delivery', included: true },
      { name: 'Access to client portal', included: true },
      { name: 'Weekly planning sessions', included: true },
      { name: 'Advanced analytics & insights', included: true },
      { name: 'Custom process optimization', included: true },
      { name: 'Daily status updates', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Strategic consulting', included: true },
    ],
    cta: 'Contact Sales',
    href: '/contact',
    popular: false,
  },
]

const addOns = [
  { name: 'Additional Hours', price: 'Contact for rates', description: 'Purchase additional hours as needed for your projects' },
  { name: 'Specialized Services', price: 'Custom pricing', description: 'Access specialized expertise for specific challenges' },
  { name: 'Training & Workshops', price: 'Contact for details', description: 'Team training and knowledge transfer sessions' },
  { name: 'Implementation Support', price: 'Project-based', description: 'Hands-on support for implementing recommendations' },
]

const faqs = [
  { question: "What's included in each tier?", answer: 'Each tier includes a set of core services shown in the comparison table above. Higher tiers include more hours, faster response times, and additional services. All tiers include strategy, execution, and reporting.' },
  { question: 'Can I change tiers later?', answer: "Yes! You can upgrade or downgrade at any time. If you upgrade mid-cycle, we'll prorate the difference. If you downgrade, the new rate applies at your next billing cycle." },
  { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, ACH transfers, and wire transfers. Payment terms are typically net 30 for established clients. We also offer flexible payment arrangements for larger projects.' },
  { question: 'Is there a contract or commitment?', answer: "Contract terms vary by service tier and client needs. We offer both month-to-month arrangements and longer-term engagements with discounted rates. We'll discuss what works best for your situation during our consultation." },
  { question: "What's not included in the listed pricing?", answer: 'Third-party costs (licenses, subscriptions, outside vendors), travel expenses when applicable, and services outside our core offerings are billed separately. We\'re transparent about any additional costs before starting work.' },
  { question: 'How do you measure success?', answer: 'Success metrics are defined collaboratively during onboarding and vary by client goals. We establish clear KPIs, track progress regularly, and adjust strategies as needed to ensure you\'re seeing results.' },
  { question: 'Do you work with businesses in my industry?', answer: "We work across many industries and sectors. During our consultation, we'll discuss your specific situation and share relevant experience. Our approach focuses on understanding your unique needs rather than applying one-size-fits-all solutions." },
  { question: 'Can I get a custom package?', answer: "Absolutely! We can create custom packages tailored to your specific needs, combining elements from different tiers or adding specialized services. Schedule a consultation to discuss your requirements, and we'll build a proposal that fits your goals and budget." },
]

export default function PricingPage() {
  const schedulingConfig = getSchedulingConfig()

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <PricingPattern
        content={{
          heroTitle: 'Simple, Transparent Pricing',
          heroSubhead: 'No hidden fees, no surprises. Choose the plan that fits your business goals.',
          heroNote: 'All plans include strategy, execution, and reporting. Flexible engagement terms available.',
          tiers,
          addOns,
          checkIcon: <Check className="w-5 h-5" aria-hidden />,
          xIcon: <X className="w-5 h-5" aria-hidden />,
        }}
      />

      <FAQPattern content={{ title: 'Frequently Asked Questions', items: faqs }} className="bg-background-alt" />

      <AppointmentScheduler
        config={schedulingConfig}
        mode="modal"
        title="Book a Pricing Walkthrough"
        description="Schedule a short call to compare plans and get a tailored proposal."
        ctaLabel="Schedule a Pricing Call"
      />

      <Section className="bg-foreground text-primary-foreground">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-white/80 mb-8">
              Schedule a free consultation to discuss which plan is right for your business.
            </p>
            <UILink variant="primary-button" href="/contact" className="inline-flex">
              Schedule Free Consultation
            </UILink>
          </div>
        </Container>
      </Section>
    </>
  )
}
