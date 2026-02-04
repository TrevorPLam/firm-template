// AI-META-BEGIN
// 
// AI-META: Package entry point and public API exports
// OWNERSHIP: packages/patterns
// ENTRYPOINTS: Package entry point, imported by consumers
// DEPENDENCIES: internal packages (@repo/*)
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

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
