// AI-META-BEGIN
// 
// AI-META: Application module
// OWNERSHIP: apps/your-dedicated-marketer
// ENTRYPOINTS: Package entry point, imported by consumers
// DEPENDENCIES: HubSpot (CRM)
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

/**
 * HubSpot feature module
 * 
 * Exports all public APIs for the HubSpot feature
 */

export * from './lib/hubspot-client';
