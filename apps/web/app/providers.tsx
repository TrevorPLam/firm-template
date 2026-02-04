// AI-META-BEGIN
// 
// AI-META: Application module
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: React
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

'use client'

import React from 'react'
import ErrorBoundary from '@/components/ErrorBoundary'
import Breadcrumbs from '@/components/Breadcrumbs'

// Client-only shell that wires global ErrorBoundary and breadcrumb trail around all pages
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Breadcrumbs />
        {children}
      </div>
    </ErrorBoundary>
  )
}
