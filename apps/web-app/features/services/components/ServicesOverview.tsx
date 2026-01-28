import React from 'react'
import Link from 'next/link'
import { Search, FileText, Share2, Mail } from 'lucide-react'
import { Container } from '@repo/ui'
import { Section } from '@repo/ui'
import { Card } from '@repo/ui'

const services = [
  {
    icon: Search,
    title: 'Core Service 1',
    description: 'Primary service offering - customize this description for your business',
    href: '/services/service-1',
  },
  {
    icon: FileText,
    title: 'Core Service 2',
    description: 'Secondary service offering - update with your specific capabilities',
    href: '/services/service-2',
  },
  {
    icon: Share2,
    title: 'Core Service 3',
    description: 'Tertiary service offering - tailor to your target market',
    href: '/services/service-3',
  },
  {
    icon: Mail,
    title: 'Core Service 4',
    description: 'Additional service offering - customize for your firm',
    href: '/services/service-4',
  },
]

export default function ServicesOverview() {
  return (
    <Section className="bg-off-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
            Professional Services for Your Business
          </h2>
          <p className="text-lg text-slate max-w-2xl mx-auto">
            We focus on the solutions that matter most to your business goals and deliver results without unnecessary complexity.
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
