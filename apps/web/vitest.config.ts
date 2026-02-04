// AI-META-BEGIN
// 
// AI-META: Test suite
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Loaded by build tools at compile time
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Config values: safe to modify. Schema/structure: coordinate with team
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['lib/**/*.ts', 'components/**/*.tsx', 'app/**/*.tsx'],
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/node_modules/**',
        '**/dist/**',
        '**/.next/**',
        'vitest.config.ts',
        'tailwind.config.ts',
        'next.config.js',
        'middleware.ts', // Next.js Edge middleware - see docs/testing/99_EXCEPTIONS.md
        'app/layout.tsx', // Root layout - see docs/testing/99_EXCEPTIONS.md
        'lib/actions/**', // Server actions require integration tests
        'lib/email.ts', // Server-only email sending
        'lib/env.ts', // Server-only env validation
      ],
      all: true,
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
    },
  },
})
