import { Suspense } from 'react'
import { siteConfig } from '@/lib/config'
import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import SearchPage from '@/components/SearchPage'
import { siteConfig } from '@/lib/config'
import { getSearchIndex } from '@/lib/search'
import { siteConfig } from '@/lib/config'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: `Search | ${siteConfig.name}`,
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
