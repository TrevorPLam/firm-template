// AI-META-BEGIN
// 
// AI-META: Test suite
// OWNERSHIP: apps/your-dedicated-marketer
// ENTRYPOINTS: Loaded by build tools at compile time
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Config values: safe to modify. Schema/structure: coordinate with team
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
})
