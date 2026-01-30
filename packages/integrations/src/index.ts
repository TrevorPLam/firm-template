/**
 * Integrations – adapter layer for external providers (CRM, analytics, etc.).
 * OFF by default. Capabilities call createIntegrations(config) to get adapters.
 * @see docs/INTEGRATIONS.md
 */

export type IntegrationsConfig = {
  hubspot?: { enabled: boolean };
  analytics?: { enabled: boolean };
  [key: string]: { enabled: boolean } | undefined;
};

export type IntegrationsRegistry = ReturnType<typeof createIntegrations>;

/** No-op adapter: does nothing, never loads scripts. */
function noopAdapter(name: string) {
  return {
    name,
    track: (_: unknown) => {},
    identify: (_: unknown) => {},
  };
}

/**
 * Returns enabled or no-op adapters based on config.
 * When disabled, adapters do nothing and never load third-party scripts.
 * Real adapters (HubSpot, GA, etc.) wired in Phase 4; all no-op for now.
 */
export function createIntegrations(_config: IntegrationsConfig = {}) {
  return {
    hubspot: noopAdapter('hubspot'),
    analytics: noopAdapter('analytics'),
  };
}
