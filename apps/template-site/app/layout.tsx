// AI-META-BEGIN
// 
// AI-META: Next.js app router page or layout component
// OWNERSHIP: apps/template-site
// ENTRYPOINTS: Wrapper for all child routes in this directory
// DEPENDENCIES: internal packages (@repo/*), Next.js framework, React
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

import '@repo/tokens/themes/default.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Template Site',
  description: 'Template site for the firm platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
