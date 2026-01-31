'use client'

/**
 * filepath: apps/your-dedicated-marketer/components/Breadcrumbs.tsx
 * purpose: Render schema-backed breadcrumb navigation for internal pages.
 * last_updated: 2026-01-31
 * related_tasks: ALIGN-003
 */
import React, { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home } from 'lucide-react'

import { getPublicBaseUrl } from '@/lib/env.public'

function titleize(segment: string) {
  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function Breadcrumbs() {
  const pathname = usePathname()

  const crumbs = useMemo(() => {
    if (!pathname || pathname === '/') return []

    const segments = pathname.split('/').filter(Boolean)
    return segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/')
      return { label: titleize(segment), href }
    })
  }, [pathname])

  if (!crumbs.length) return null

  const baseUrl = getPublicBaseUrl().replace(/\/$/, '')
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      ...crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: crumb.label,
        item: `${baseUrl}${crumb.href}`,
      })),
    ],
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-background/90 backdrop-blur sticky top-16 z-30 border-b border-foreground/5"
    >
      <ol className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-sm text-foreground-muted">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-primary font-semibold hover:text-primary-hover"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {crumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <span aria-hidden="true" className="text-foreground/60">
              /
            </span>
            <li>
              {index === crumbs.length - 1 ? (
                <span className="text-foreground font-semibold" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-primary font-semibold hover:text-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </nav>
  )
}
