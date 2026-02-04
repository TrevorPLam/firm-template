// AI-META-BEGIN
// 
// AI-META: Next.js app router page or layout component
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Direct route access via Next.js app router
// DEPENDENCIES: internal packages (@repo/*), React
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

import type { Metadata } from 'next'
import { Mail, Phone, Clock } from 'lucide-react'
import { Contact as ContactPattern } from '@repo/patterns'
import ContactForm from '@/components/ContactForm'
import ErrorBoundary from '@/components/ErrorBoundary'
import AppointmentScheduler from '@/components/AppointmentScheduler'
import { getSchedulingConfig } from '@/lib/scheduling'
import { siteConfig } from '@/lib/config'
import { validatedPublicEnv } from '@/lib/env.public'

export const metadata: Metadata = {
  title: `Contact Us | ${validatedPublicEnv.NEXT_PUBLIC_SITE_NAME}`,
  description: 'Get in touch to discuss your goals. Schedule a free consultation or send us a message.',
}

export default function ContactPage() {
  const schedulingConfig = getSchedulingConfig()

  const contactBlocks = [
    {
      icon: <Mail className="w-6 h-6" aria-hidden />,
      title: 'Email',
      value: (
        <a href={`mailto:${siteConfig.contact.email}`} className="hover:underline">
          {siteConfig.contact.email}
        </a>
      ),
    },
    {
      icon: <Phone className="w-6 h-6" aria-hidden />,
      title: 'Phone',
      value: (
        <a href={`tel:${siteConfig.contact.phone}`} className="hover:underline">
          {siteConfig.contact.phoneDisplay}
        </a>
      ),
    },
    {
      icon: <Clock className="w-6 h-6" aria-hidden />,
      title: 'Office Hours',
      value: (
        <>
          <p className="text-foreground-muted">Monday - Friday</p>
          <p className="text-foreground-muted">9:00 AM - 5:00 PM EST</p>
        </>
      ),
    },
  ]

  const stepsSlot = (
    <>
      <h3 className="font-semibold text-foreground mb-2">What Happens Next?</h3>
      <ol className="space-y-3 text-foreground-muted">
        <li className="flex gap-3">
          <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
            1
          </span>
          <span>We&apos;ll review your information and respond within 24 hours</span>
        </li>
        <li className="flex gap-3">
          <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
            2
          </span>
          <span>Schedule a free 30-minute consultation to discuss your goals</span>
        </li>
        <li className="flex gap-3">
          <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
            3
          </span>
          <span>Receive a custom strategy plan tailored to your business</span>
        </li>
      </ol>
    </>
  )

  return (
    <>
      <ContactPattern
        content={{
          heroTitle: "Let's Grow Your Business Together",
          heroSubhead: 'Schedule a free 30-minute consultation to discuss your goals and how we can help you achieve them.',
          heading: 'Send Us a Message',
          description: "Fill out the form below and we'll get back to you within 24 hours (usually much faster!).",
          formSlot: (
            <ErrorBoundary
              fallback={
                <div className="rounded-lg border border-error/20 bg-error/5 p-4 text-error">
                  We&apos;re having trouble loading the form. Please email us at{' '}
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
                  >
                    {siteConfig.contact.email}
                  </a>
                  .
                </div>
              }
            >
              <ContactForm />
            </ErrorBoundary>
          ),
          contactBlocks,
          stepsSlot,
        }}
      />

      <AppointmentScheduler
        config={schedulingConfig}
        mode="inline"
        title="Prefer to Schedule Now?"
        description="Reserve a time that works for you and we will confirm by email."
      />

      {/* Prefer to Talk First – app-specific CTA */}
      <section className="bg-background py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Prefer to Talk First?</h2>
          <p className="text-lg text-foreground-muted mb-8">
            No problem! Send us an email or give us a call during business hours. We&apos;re here to answer any questions about our services, pricing, or process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" aria-hidden />
              Email Us
            </a>
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="inline-flex items-center justify-center bg-transparent hover:bg-background text-foreground font-semibold py-3 px-6 rounded-lg border-2 border-foreground transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" aria-hidden />
              Call Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
