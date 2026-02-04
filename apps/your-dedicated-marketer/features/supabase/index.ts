// AI-META-BEGIN
// 
// AI-META: Application module
// OWNERSHIP: apps/your-dedicated-marketer
// ENTRYPOINTS: Package entry point, imported by consumers
// DEPENDENCIES: Supabase (database)
// DANGER: Database operations - ensure proper error handling
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

/**
 * Supabase feature module
 * 
 * Exports all public APIs for the Supabase feature
 */

export * from './lib/supabase-leads';
