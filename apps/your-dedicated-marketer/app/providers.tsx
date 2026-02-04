// AI-META-BEGIN
// 
// AI-META: Application module
// OWNERSHIP: apps/your-dedicated-marketer
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: React
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test && pnpm type-check
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
