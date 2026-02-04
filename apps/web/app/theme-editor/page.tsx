// AI-META-BEGIN
// 
// AI-META: Next.js app router page or layout component
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Direct route access via Next.js app router
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

import type { Metadata } from 'next'
import ThemeEditorClient from './theme-editor-client'
import { validatedPublicEnv } from '@/lib/env.public'

export const metadata: Metadata = {
  title: `Theme Editor | ${validatedPublicEnv.NEXT_PUBLIC_SITE_NAME}`,
  description: 'Preview and export theme tokens for this template (development only).',
}

export default function ThemeEditorPage() {
  return <ThemeEditorClient />
}
