// AI-META-BEGIN
// 
// AI-META: Utility functions and helpers
// OWNERSHIP: packages/utils (shared utilities)
// ENTRYPOINTS: Imported by application code
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Config values: safe to modify. Schema/structure: coordinate with team
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
})
