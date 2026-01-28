import type { Metadata } from 'next'
import Link from 'next/link'
import { Briefcase, Target, Users, TrendingUp, Settings, Database, FileText, BarChart } from 'lucide-react'
import { Container } from '@repo/ui'
import { Section } from '@repo/ui'
import { Card } from '@repo/ui'
import { Button } from '@repo/ui'
import { validatedPublicEnv } from '@/lib/env.public'

/**
 * TEMPLATE CUSTOMIZATION:
 * Update service titles, descriptions, and icons to match your actual offerings.
 * Replace generic "Core Service X" with your real service names.
 * Update href links to match your renamed service routes.
 */

export const metadata: Metadata = {
  title: `Professional Services | ${validatedPublicEnv.NEXT_PUBLIC_SITE_NAME}`,
  description: 'Comprehensive professional services solutions tailored to your business needs. Expert guidance and strategic execution.',
}

const coreServices = [
  {
    icon: Briefcase,
    title: 'Core Service 1',
    description: 'Strategic solutions designed to address your primary business challenges with expert guidance and proven methodologies.',
    href: '/services/service-1',
    features: ['Feature A', 'Feature B', 'Feature C', 'Feature D'],
  },
  {
    icon: Target,
    title: 'Core Service 2',
    description: 'Comprehensive approach to achieving your business objectives through careful planning and execution.',
    href: '/services/service-2',
    features: ['Feature A', 'Feature B', 'Feature C', 'Feature D'],
  },
  {
    icon: Users,
    title: 'Core Service 3',
    description: 'Collaborative solutions that leverage our expertise to drive measurable results for your organization.',
    href: '/services/service-3',
    features: ['Feature A', 'Feature B', 'Feature C', 'Feature D'],
  },
  {
    icon: TrendingUp,
    title: 'Core Service 4',
    description: 'Growth-focused strategies that help your business scale efficiently and sustainably over time.',
    href: '/services/service-4',
    features: ['Feature A', 'Feature B', 'Feature C', 'Feature D'],
  },
]

const supportServices = [
  {
    icon: Settings,
    title: 'Supporting Service 5',
    description: 'Specialized support to optimize your operations and enhance overall performance.',
    href: '/services/service-5',
  },
  {
    icon: Database,
    title: 'Supporting Service 6',
    description: 'Data-driven insights and management solutions for better decision-making.',
    href: '/services/service-6',
  },
  {
    icon: FileText,
    title: 'Supporting Service 7',
    description: 'Documentation, planning, and strategic analysis to support your goals.',
    href: '/services/service-7',
  },
  {
    icon: BarChart,
    title: 'Supporting Service 8',
    description: 'Performance tracking, reporting, and continuous improvement initiatives.',
    href: '/services/service-8',
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-b from-charcoal to-charcoal/95 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Professional Services That Deliver Results
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Comprehensive solutions designed to help your business achieve its goals.
              Expert guidance and strategic execution for sustainable success.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="large">
                Schedule Free Consultation
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Core Services */}
      <Section className="bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Core Services
            </h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              Essential services to build your business foundation and drive consistent growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {coreServices.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={index} variant="service">
                  <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-teal" />
                  </div>
                  <h3 className="text-2xl font-semibold text-charcoal mb-3">{service.title}</h3>
                  <p className="text-slate mb-4 leading-relaxed">{service.description}</p>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-slate">
                        <span className="w-1.5 h-1.5 bg-teal rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>

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

      {/* Support Services */}
      <Section className="bg-off-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Supporting Services
            </h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              Additional services to enhance your business operations and maximize results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportServices.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={index} variant="default">
                  <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-teal" />
                  </div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">{service.title}</h3>
                  <p className="text-sm text-slate mb-3 leading-relaxed">{service.description}</p>
                  <Link
                    href={service.href}
                    className="text-teal text-sm font-semibold hover:text-teal-dark transition-colors"
                  >
                    Learn More →
                  </Link>
                </Card>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-teal/10 to-teal/5">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Not Sure Which Services You Need?
            </h2>
            <p className="text-lg text-slate mb-8">
              Schedule a free consultation and we'll create a custom plan tailored to your business goals and objectives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button variant="primary" size="large">
                  Schedule Consultation
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="secondary" size="large">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
