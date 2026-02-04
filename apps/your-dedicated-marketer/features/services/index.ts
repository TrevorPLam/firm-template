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
 * Services feature module
 * 
 * Exports all public APIs for the services feature
 */

export { ServicesOverview } from './components/ServicesOverview';
export { ServiceDetailLayout } from './components/ServiceDetailLayout';
