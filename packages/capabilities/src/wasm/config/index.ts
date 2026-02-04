export interface WasmConfig {
  /** Toggle WebAssembly features on or off. */
  enabled: boolean
  /** Path to the WASM module bundle. */
  modulePath: string
  /** Optional worker path for off-main-thread execution. */
  workerPath?: string
  /** Enable verbose logging for debugging. */
  debug: boolean
  /** Build target for feature gating (browser/server). */
  target: 'browser' | 'server'
}

export interface WasmConfigIssue {
  field: keyof WasmConfig
  message: string
}

const parseBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) {
    return fallback
  }

  return value.toLowerCase() === 'true'
}

/**
 * WebAssembly configuration helper.
 */
export const getWasmConfig = (env: NodeJS.ProcessEnv = process.env): WasmConfig => ({
  enabled: parseBoolean(env.WASM_ENABLED, false),
  modulePath: env.WASM_MODULE_PATH ?? '/wasm/module.wasm',
  workerPath: env.WASM_WORKER_PATH,
  debug: parseBoolean(env.WASM_DEBUG, false),
  target: (env.WASM_TARGET as WasmConfig['target'] | undefined) ?? 'browser',
})

/**
 * Validate WebAssembly configuration for required fields.
 */
export const validateWasmConfig = (config: WasmConfig): WasmConfigIssue[] => {
  const issues: WasmConfigIssue[] = []

  if (config.enabled && !config.modulePath) {
    issues.push({
      field: 'modulePath',
      message: 'WASM_MODULE_PATH is required when WASM is enabled',
    })
  }

  return issues
}
