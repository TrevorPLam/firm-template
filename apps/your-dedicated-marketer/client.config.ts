/**
 * Client-specific configuration for Your Dedicated Marketer
 * Defines content, integrations, and business logic specific to this client
 */

export const clientConfig = {
  // Client identification
  clientId: 'your-dedicated-marketer',
  clientName: 'Your Dedicated Marketer',
  
  // Theme configuration
  theme: {
    id: 'your-dedicated-marketer' as const,
    dataTheme: 'your-dedicated-marketer',
  },
  
  // Site metadata
  site: {
    title: 'Your Dedicated Marketer',
    description: 'Professional marketing services dedicated to growing your business',
    url: 'https://your-dedicated-marketer.com',
    ogImage: '/og-image.jpg',
  },
  
  // Contact information
  contact: {
    email: 'contact@your-dedicated-marketer.com',
    phone: '+1 (555) 123-4567',
    address: '123 Marketing St, Business City, BC 12345',
  },
  
  // Integrations (disabled by default, enable as needed)
  integrations: {
    hubspot: {
      enabled: false,
      portalId: '',
      formGuides: {
        contact: '',
        newsletter: '',
      },
    },
    analytics: {
      enabled: false,
      googleAnalyticsId: '',
      gtmId: '',
    },
    crm: {
      enabled: false,
      provider: 'hubspot' as const,
    },
  },
  
  // Features specific to this client
  features: {
    blog: true,
    appointmentScheduling: true,
    leadCapture: true,
    analytics: false,
    themeEditor: false,
  },
  
  // Business configuration
  business: {
    industry: 'marketing',
    services: [
      'Digital Marketing Strategy',
      'SEO Optimization',
      'Content Marketing',
      'Social Media Management',
      'Email Marketing',
      'PPC Advertising',
    ],
    targetAudience: [
      'Small Businesses',
      'Startups',
      'Local Companies',
    ],
  },
}

export type ClientConfig = typeof clientConfig
