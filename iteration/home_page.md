# Home Page Code - Your Dedicated Marketer

Complete code for the homepage, including all components used.

---

## Main Page Component

**File:** `app/page.tsx`

```tsx
/**
 * Homepage component.
 * 
 * **Purpose:**
 * Main landing page for the marketing website.
 * Showcases services, social proof, and drives conversions.
 * 
 * **Section Order:**
 * 1. Hero - Value proposition + primary CTAs
 * 2. ValueProps - Key benefits grid
 * 3. ServicesOverview - Service offerings cards
 * 4. SocialProof - Testimonials (lazy loaded)
 * 5. CaseStudyHighlight - Featured case study (lazy loaded)
 * 6. FinalCTA - Bottom conversion prompt (lazy loaded)
 * 
 * **Performance:**
 * - Above-fold components (Hero, ValueProps, ServicesOverview) loaded immediately
 * - Below-fold components dynamically imported for code splitting
 * - All components SSR-enabled (ssr: true)
 * 
 * **SEO:**
 * - Uses default metadata from layout.tsx
 * - No page-specific metadata override needed
 * 
 * @see app/layout.tsx for global metadata
 * @see components/Hero.tsx for hero section details
 */

import dynamic from 'next/dynamic'
import Hero from '@/components/Hero'
import ValueProps from '@/components/ValueProps'
import ServicesOverview from '@/components/ServicesOverview'

// Below-fold components loaded dynamically for better initial load
const SocialProof = dynamic(() => import('@/components/SocialProof'), {
  loading: () => <div className="sr-only">Loading testimonials…</div>,
  ssr: true,
})

const CaseStudyHighlight = dynamic(() => import('@/components/CaseStudyHighlight'), {
  loading: () => <div className="sr-only">Loading case study…</div>,
  ssr: true,
})

const FinalCTA = dynamic(() => import('@/components/FinalCTA'), {
  loading: () => <div className="sr-only">Loading final call to action…</div>,
  ssr: true,
})

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <ServicesOverview />
      <SocialProof />
      <CaseStudyHighlight />
      <FinalCTA />
    </>
  )
}
```

---

## Section 1: Hero Component

**File:** `components/Hero.tsx`

```tsx
/**
 * Homepage hero section component.
 * 
 * **Purpose:**
 * Primary above-the-fold content on the homepage.
 * Introduces the brand value proposition with CTAs.
 * 
 * **Layout:**
 * - Two-column grid on desktop (text + image)
 * - Single column on mobile (text only, image hidden)
 * 
 * **CTAs:**
 * - Primary: "Book a Free Strategy Call" → /contact
 * - Secondary: "Get a Free Marketing Plan" → /contact
 * 
 * **Image:**
 * - Location: /public/images/hero-growth.svg
 * - Priority loaded (LCP optimization)
 * - Hidden on mobile for faster load
 * 
 * **Styling:**
 * - Background: Gradient from off-white to white
 * - Text: charcoal (dark) headings, slate body
 * 
 * @component
 */

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'

/**
 * Homepage hero section.
 * Renders the main value proposition and CTAs.
 */
export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-off-white to-white py-20 md:py-32">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6 leading-tight">
              Your dedicated marketer — that means I'm part of your team.
            </h1>
            <p className="text-lg md:text-xl text-slate-800 mb-8 leading-relaxed">
              I work alongside founders and teams who want clear strategy, honest execution, and a marketer who takes ownership — not a detached agency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button variant="primary" size="large">
                  Book a Free Strategy Call
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="large">
                  Get a Free Marketing Plan
                </Button>
              </Link>
            </div>
            <p className="text-sm text-slate mt-4">
              No contracts · Cancel anytime · Free strategy call, no obligation
            </p>
          </div>

          {/* Right Column - Hero Image/Illustration */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-charcoal to-teal/20 rounded-2xl p-4 aspect-square flex items-center justify-center shadow-lg">
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
          </div>
        </div>
      </Container>
    </section>
  )
}
```

---

## Section 2: Value Props Component

**File:** `components/ValueProps.tsx`

```tsx
import React, { memo } from 'react'
import { Target, DollarSign, Settings } from 'lucide-react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'

const valueProps = [
  {
    icon: Target,
    title: 'Marketing shouldn't feel like a guessing game.',
    description: (
      <>
        <p>Most founders don't actually need more marketing. They need someone to own it.</p>
        <p>Someone who:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Understands the business context</li>
          <li>Knows what matters right now (and what doesn't)</li>
          <li>Makes decisions, not just suggestions</li>
          <li>Stays accountable over time</li>
        </ul>
        <p>That's the role I fill.</p>
      </>
    ),
  },
  {
    icon: DollarSign,
    title: 'What 'part of your team' actually means',
    description: (
      <>
        <p>
          I'm embedded in your team, learning the business and taking ownership — not handing you a list of tasks.
        </p>
        <p>When we work together:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>I learn your business like an internal hire would</li>
          <li>I help decide priorities, not just execute orders</li>
          <li>I work within your existing tools, people, and constraints</li>
          <li>You get marketing leadership without hiring full-time</li>
        </ul>
        <p>You stay focused on running the business.</p>
        <p>I take responsibility for the marketing.</p>
      </>
    ),
  },
  {
    icon: Settings,
    title: 'Who this works best for',
    description: (
      <>
        <p>This is a good fit if:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>You're a founder or part of a lean team</li>
          <li>You want senior-level marketing ownership, not hand-holding</li>
          <li>You don't want to manage freelancers or a revolving bench of contractors</li>
          <li>You want clarity, momentum, and follow-through</li>
        </ul>
        <p>If you're looking for a hands-off partner or a one-time project, this probably isn't it.</p>
        <p>If you want a dedicated marketer embedded into your team, it is.</p>
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
```

---

## Section 3: Services Overview Component

**File:** `components/ServicesOverview.tsx`

```tsx
import React from 'react'
import Link from 'next/link'
import { Search, FileText, Share2, Mail } from 'lucide-react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'

const services = [
  {
    icon: Search,
    title: 'SEO Services',
    description: 'Get found by customers actively searching for your services',
    href: '/services/seo',
  },
  {
    icon: FileText,
    title: 'Content Marketing',
    description: 'Attract and engage your audience with strategic content',
    href: '/services/content',
  },
  {
    icon: Share2,
    title: 'Social Media',
    description: 'Build community and brand awareness across platforms',
    href: '/services/social',
  },
  {
    icon: Mail,
    title: 'Email Marketing',
    description: 'Nurture leads and drive conversions with targeted campaigns',
    href: '/services/email',
  },
]

export default function ServicesOverview() {
  return (
    <Section className="bg-off-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
            Marketing leadership I run with your team
          </h2>
          <p className="text-lg text-slate max-w-2xl mx-auto">
            I focus on the channels that matter most right now so founders and teams get momentum without extra management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card key={index} variant="service">
                <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-teal" />
                </div>
                <h3 className="text-2xl font-semibold text-charcoal mb-3">{service.title}</h3>
                <p className="text-slate mb-4 leading-relaxed">{service.description}</p>
                <Link
                  href={service.href}
                  className="text-teal font-semibold hover:text-teal-dark transition-colors inline-flex items-center"
                >
                  Learn More →
                </Link>
              </Card>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
```

---

## Section 4: Social Proof Component

**File:** `components/SocialProof.tsx`

```tsx
import React, { memo } from 'react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'

const testimonials = [
  {
    quote: "Working with Your Dedicated Marketer transformed our online presence. We saw a 150% increase in qualified leads within the first 3 months.",
    author: 'Sarah Johnson',
    company: 'Tech Solutions Inc.',
    title: 'CEO',
  },
  {
    quote: "Finally, a marketing partner that actually understands founder and team realities. No fluff, just results-driven strategies that work.",
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
    <Section className="bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
            Trusted by founders and teams I work with
          </h2>
          <p className="text-lg text-slate max-w-2xl mx-auto">
            Here's what people say about having me embedded in their marketing
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} variant="testimonial">
              <p className="text-slate mb-6 italic leading-relaxed">{testimonial.quote}</p>
              <div>
                <p className="font-semibold text-charcoal">{testimonial.author}</p>
                <p className="text-slate text-sm">{testimonial.company}, {testimonial.title}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-8 text-center">
          {metrics.map((metric, index) => (
            <div key={index}>
              <div className="text-4xl md:text-5xl font-bold text-teal mb-2">{metric.value}</div>
              <div className="text-slate font-medium">{metric.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export default memo(SocialProof)
```

---

## Section 5: Case Study Highlight Component

**File:** `components/CaseStudyHighlight.tsx`

```tsx
import React, { memo } from 'react'
import Link from 'next/link'
import { TrendingUp, Users, DollarSign } from 'lucide-react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'

const metrics = [
  {
    icon: TrendingUp,
    value: '250%',
    label: 'Revenue Increase',
  },
  {
    icon: Users,
    value: '3.5x',
    label: 'Lead Generation',
  },
  {
    icon: DollarSign,
    value: '5:1',
    label: 'Marketing ROI',
  },
]

function CaseStudyHighlight() {
  return (
    <Section className="bg-gradient-to-br from-teal/10 to-teal/5">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Case Study Details */}
          <div>
            <div className="inline-block bg-teal/20 text-teal font-semibold px-4 py-2 rounded-full mb-4">
              Featured Case Study
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              How Local Services Co. Increased Revenue 250% in 6 Months
            </h2>
            <p className="text-lg text-slate mb-6 leading-relaxed">
              Discover how we helped a local service business transform their marketing strategy
              and achieve exceptional growth through strategic SEO, content marketing, and targeted campaigns.
            </p>
            <Link href="/case-studies/local-services-co">
              <Button variant="primary" size="medium">
                View Full Case Study
              </Button>
            </Link>
          </div>

          {/* Right Column - Key Metrics */}
          <div className="grid gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <div key={index} className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-md">
                  <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-teal" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-charcoal">{metric.value}</div>
                    <div className="text-slate">{metric.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default memo(CaseStudyHighlight)
```

---

## Section 6: Final CTA Component

**File:** `components/FinalCTA.tsx`

```tsx
import React, { memo } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'

function FinalCTA() {
  return (
    <Section className="bg-charcoal text-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to grow with me?
          </h2>
          <p className="text-lg text-white/90 mb-8 leading-relaxed">
            Book a free strategy call and I'll map the next marketing moves with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="primary" size="large">
                Book a Free Strategy Call
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="large" className="border-white text-charcoal bg-white hover:bg-off-white">
                Get a Free Marketing Plan
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default memo(FinalCTA)
```

---

## Component Dependencies

The home page uses several UI components that are reusable across the site:

- `Button` - `components/ui/Button.tsx`
- `Container` - `components/ui/Container.tsx`
- `Section` - `components/ui/Section.tsx`
- `Card` - `components/ui/Card.tsx`

These provide consistent styling and layout across all sections.

---

## Performance Notes

1. **Code Splitting**: Below-fold components (`SocialProof`, `CaseStudyHighlight`, `FinalCTA`) are dynamically imported to reduce initial bundle size.

2. **SSR Enabled**: All dynamically imported components have `ssr: true` to ensure content is available for search engines.

3. **Image Optimization**: Hero image uses Next.js Image component with `priority` flag for LCP optimization.

4. **Memoization**: Most components use `React.memo()` to prevent unnecessary re-renders.
