import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import ThemeEditorClient from './theme-editor-client'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `Theme Editor | ${siteConfig.name}`,
  description: 'Preview and export theme tokens for this template (development only).',
}

export default function ThemeEditorPage() {
  return <ThemeEditorClient />
}
