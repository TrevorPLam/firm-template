// AI-META-BEGIN
// 
// AI-META: Application module
// OWNERSHIP: apps/your-dedicated-marketer
// ENTRYPOINTS: Package entry point, imported by consumers
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

/**
 * Contact feature module
 * 
 * Exports all public APIs for the contact feature
 */

export * from './lib/contact-form-schema';
export { ContactForm } from './components/ContactForm';
