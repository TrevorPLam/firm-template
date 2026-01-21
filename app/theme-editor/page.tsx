import type { Metadata } from 'next'
import ThemeEditorClient from './theme-editor-client'

export const metadata: Metadata = {
  title: 'Theme Editor | Your Firm Name',
  description: 'Preview and export theme tokens for this template (development only).',
}

export default function ThemeEditorPage() {
  return <ThemeEditorClient />
}
