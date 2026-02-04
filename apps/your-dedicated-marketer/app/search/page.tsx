// AI-META-BEGIN
// 
// AI-META: Next.js app router page or layout component
// OWNERSHIP: apps/your-dedicated-marketer
// ENTRYPOINTS: Direct route access via Next.js app router
// DEPENDENCIES: React
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

import { Suspense } from 'react'
import type { Metadata } from 'next'
import SearchPage from '@/components/SearchPage'
import { getSearchIndex } from '@/lib/search'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Search | Your Dedicated Marketer',
  description: 'Search blog posts, services, and marketing resources across the site.',
}

export default async function SearchRoute() {
  const items = getSearchIndex()

  return (
    <Suspense>
      <SearchPage items={items} />
    </Suspense>
  )
}
