import { Suspense } from 'react'
import type { Metadata } from 'next'
import SearchPage from '@/components/SearchPage'
import { getSearchIndex } from '@/lib/search'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Search | Your Firm Name',
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
