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
