// AI-META-BEGIN
// 
// AI-META: Test suite
// OWNERSHIP: packages/integrations
// ENTRYPOINTS: Loaded by build tools at compile time
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Tests: safe to modify. Add tests for new functionality
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

import { describe, it, expect } from 'vitest'
import { createIntegrations, type IntegrationsConfig } from './index'

describe('createIntegrations', () => {
  it('returns registry with hubspot adapter', () => {
    const integrations = createIntegrations()
    
    expect(integrations.hubspot).toBeDefined()
    expect(integrations.hubspot.name).toBe('hubspot')
  })
  
  it('returns registry with analytics adapter', () => {
    const integrations = createIntegrations()
    
    expect(integrations.analytics).toBeDefined()
    expect(integrations.analytics.name).toBe('analytics')
  })
  
  it('accepts empty config', () => {
    const integrations = createIntegrations({})
    
    expect(integrations.hubspot).toBeDefined()
    expect(integrations.analytics).toBeDefined()
  })
  
  it('accepts config with hubspot enabled', () => {
    const config: IntegrationsConfig = {
      hubspot: { enabled: true }
    }
    const integrations = createIntegrations(config)
    
    expect(integrations.hubspot).toBeDefined()
  })
  
  it('accepts config with analytics enabled', () => {
    const config: IntegrationsConfig = {
      analytics: { enabled: true }
    }
    const integrations = createIntegrations(config)
    
    expect(integrations.analytics).toBeDefined()
  })
  
  it('hubspot adapter has track method', () => {
    const integrations = createIntegrations()
    
    expect(integrations.hubspot.track).toBeDefined()
    expect(typeof integrations.hubspot.track).toBe('function')
    
    // Noop adapter should not throw
    expect(() => integrations.hubspot.track({ event: 'test' })).not.toThrow()
  })
  
  it('hubspot adapter has identify method', () => {
    const integrations = createIntegrations()
    
    expect(integrations.hubspot.identify).toBeDefined()
    expect(typeof integrations.hubspot.identify).toBe('function')
    
    // Noop adapter should not throw
    expect(() => integrations.hubspot.identify({ userId: '123' })).not.toThrow()
  })
  
  it('analytics adapter has track method', () => {
    const integrations = createIntegrations()
    
    expect(integrations.analytics.track).toBeDefined()
    expect(typeof integrations.analytics.track).toBe('function')
    
    // Noop adapter should not throw
    expect(() => integrations.analytics.track({ event: 'pageview' })).not.toThrow()
  })
  
  it('analytics adapter has identify method', () => {
    const integrations = createIntegrations()
    
    expect(integrations.analytics.identify).toBeDefined()
    expect(typeof integrations.analytics.identify).toBe('function')
    
    // Noop adapter should not throw
    expect(() => integrations.analytics.identify({ userId: '456' })).not.toThrow()
  })
  
  it('noop adapters accept undefined', () => {
    const integrations = createIntegrations()
    
    expect(() => integrations.hubspot.track(undefined)).not.toThrow()
    expect(() => integrations.hubspot.identify(undefined)).not.toThrow()
    expect(() => integrations.analytics.track(undefined)).not.toThrow()
    expect(() => integrations.analytics.identify(undefined)).not.toThrow()
  })
})
