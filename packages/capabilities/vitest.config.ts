import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/node_modules/**',
        '**/dist/**',
        'vitest.config.ts',
        'src/index.ts', // Re-export file
        // Complex features under development - see docs/testing/99_EXCEPTIONS.md
        'src/ai/**',
        'src/blockchain/**',
        'src/voice/**',
        'src/performance/**',
        'src/pwa/**',
        'src/cms/**',
        'src/financial/**',
        'src/client-success/**',
        'src/realtime/**',
        'src/wasm/**',
        'src/images/**',
      ],
      all: true,
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
    },
  },
})
