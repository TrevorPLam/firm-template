// AI-META-BEGIN
// 
// AI-META: Next.js app router page or layout component
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Direct route access via Next.js app router
// DEPENDENCIES: React
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

import { Suspense } from 'react'
import type { Metadata } from 'next'
import SearchPage from '@/components/SearchPage'
import { getSearchIndex } from '@/lib/search'
import { validatedPublicEnv } from '@/lib/env.public'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: `Search | ${validatedPublicEnv.NEXT_PUBLIC_SITE_NAME}`,
  description: 'Search blog posts, services, and resources across the site.',
}

export default async function SearchRoute() {
  const items = getSearchIndex()

  return (
    <Suspense>
      <SearchPage items={items} initialQuery="" />
    </Suspense>
  )
}
