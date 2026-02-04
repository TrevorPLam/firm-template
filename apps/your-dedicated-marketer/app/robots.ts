// AI-META-BEGIN
// 
// AI-META: Application module
// OWNERSHIP: apps/your-dedicated-marketer
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

import { MetadataRoute } from 'next'
import { getPublicBaseUrl } from '@/lib/env.public'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getPublicBaseUrl()

  // Default policy: allow everything except API/admin paths; keep sitemap in sync with sitemap.ts
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
  }
}
