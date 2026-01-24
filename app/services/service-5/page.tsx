import type { Metadata } from 'next'
import { Briefcase } from 'lucide-react'
import ServiceDetailLayout from '@/components/ServiceDetailLayout'
import { validatedPublicEnv } from '@/lib/env.public'

/**
 * TEMPLATE CUSTOMIZATION:
 * Replace this generic service page with your actual service offerings.
 * Update icon, title, description, features, process, target audience, and FAQs.
 */

export const metadata: Metadata = {
  title: `Core Service 5 | ${validatedPublicEnv.NEXT_PUBLIC_SITE_NAME}`,
  description: 'Professional service solutions tailored to your business needs. Expert guidance and strategic execution to help your organization succeed.',
}

export default function Service1Page() {
  return (
    <ServiceDetailLayout
      icon={Briefcase}
      title="Core Service 5"
      description="Comprehensive professional services designed to help your business achieve its goals. Our expert team delivers strategic solutions with measurable results."
      serviceSlug="service-5"
      included={[
        'Initial consultation and needs assessment',
        'Strategic planning and roadmap development',
        'Expert guidance and recommendations',
        'Implementation support and oversight',
        'Regular progress reviews and reporting',
        'Ongoing optimization and refinement',
        'Access to specialized tools and resources',
        'Dedicated support team',
      ]}
      process={[
        {
          title: 'Discovery',
          description: 'Understanding your business objectives, challenges, and opportunities through comprehensive analysis.',
        },
        {
          title: 'Strategy',
          description: 'Developing customized action plan aligned with your goals and available resources.',
        },
        {
          title: 'Execution',
          description: 'Implementing recommended solutions with expert guidance and hands-on support.',
        },
        {
          title: 'Optimization',
          description: 'Monitoring results and continuously refining approach for maximum impact.',
        },
      ]}
      whoItsFor={[
        'Organizations seeking expert guidance in this area',
        'Businesses ready to invest in professional solutions',
        'Teams looking for strategic partnership and support',
        'Companies wanting measurable results and accountability',
        'Leaders who value expertise and proven methodologies',
      ]}
      pricing={[
        {
          tier: 'Basic',
          description: 'Essential services for getting started',
          href: '/pricing#basic',
        },
        {
          tier: 'Professional',
          description: 'Comprehensive service with ongoing support',
          href: '/pricing#professional',
        },
        {
          tier: 'Enterprise',
          description: 'Full-service solution with dedicated resources',
          href: '/pricing#enterprise',
        },
      ]}
      faqs={[
        {
          question: 'How long does it take to see results?',
          answer: 'Timeline varies based on your specific situation and goals. Most clients see initial progress within the first month, with significant results typically appearing within 3-6 months. We\'ll provide a realistic timeline during our initial consultation.',
        },
        {
          question: 'What makes your approach different?',
          answer: 'We combine deep expertise with a partnership mindset. Rather than just providing recommendations, we work alongside your team to ensure successful implementation and lasting results. Our focus is on practical solutions that work in the real world.',
        },
        {
          question: 'Do you work with businesses in my industry?',
          answer: 'Our methodology is adaptable across industries. While we have experience in many sectors, what matters most is understanding your specific challenges and goals. During our consultation, we\'ll discuss relevant case studies and how our approach applies to your situation.',
        },
        {
          question: 'What level of involvement is required from our team?',
          answer: 'We\'re flexible and adapt to your preferences. Some clients want hands-on collaboration, while others prefer us to take the lead. We\'ll discuss the optimal approach based on your resources and objectives.',
        },
      ]}
    />
  )
}
