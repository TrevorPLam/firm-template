/**
 * Patterns – composed sections (hero, pricing, testimonials, etc.).
 * Built from @repo/ui primitives only; take content/config as props.
 * @see docs/PLATFORM.md
 */

export { Hero, type HeroContent, type HeroCTA, type HeroProps } from './Hero'
export { Features, type FeaturesContent, type FeatureItem, type FeaturesProps } from './Features'
export {
  Testimonials,
  type TestimonialsContent,
  type TestimonialItem,
  type TestimonialMetric,
  type TestimonialsProps,
} from './Testimonials'
export {
  Pricing,
  type PricingContent,
  type PricingTier,
  type PricingFeature,
  type PricingAddOn,
  type PricingProps,
} from './Pricing'
export { FAQ, type FAQContent, type FAQItem, type FAQProps } from './FAQ'
export {
  Contact,
  type ContactContent,
  type ContactBlock,
  type ContactProps,
} from './Contact'
