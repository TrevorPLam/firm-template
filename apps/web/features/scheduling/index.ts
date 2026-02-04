// AI-META-BEGIN
// 
// AI-META: Application module
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Package entry point, imported by consumers
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

/**
 * Scheduling feature module
 */

export * from './lib/scheduling';
export { AppointmentScheduler } from './components/AppointmentScheduler';
