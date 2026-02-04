// AI-META-BEGIN
// 
// AI-META: Package entry point and public API exports
// OWNERSHIP: packages/capabilities
// ENTRYPOINTS: Package entry point, imported by consumers
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

/**
 * Client Success Analytics Module
 * 
 * Provides comprehensive client health monitoring, performance metrics,
 * and proactive issue detection for scaling from 50 to 500+ clients.
 * 
 * @module client-success
 */

export * from './types';
export * from './health-monitor';
export * from './metrics';
export * from './scoring';
export * from './alerts';
