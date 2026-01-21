/**
 * Homepage component.
 * 
 * **Purpose:**
\* Main landing page for the professional services website.
 * Showcases services, social proof, and drives conversions.
 * 
 * **Section Order:**
 * 1. Hero - Value proposition + primary CTAs
 * 2. ClientLogoShowcase - Client logos and trust badges
 * 3. ValueProps - Key benefits grid
 * 4. ServicesOverview - Service offerings cards
 * 5. SocialProof - Testimonials (lazy loaded)
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
import ClientLogoShowcase from '@/components/ClientLogoShowcase'
import Hero from '@/components/Hero'
import TrustBadge from '@/components/TrustBadge'
import ValueProps from '@/components/ValueProps'
import ServicesOverview from '@/components/ServicesOverview'

// Below-fold components loaded dynamically for better initial load
const SocialProof = dynamic(() => import('@/components/SocialProof'), {
  loading: () => <div className="sr-only">Loading testimonials…</div>,
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
      <ClientLogoShowcase />
      <TrustBadge />
      <ValueProps />
      <ServicesOverview />
      <SocialProof />
      <FinalCTA />
    </>
  )
}
