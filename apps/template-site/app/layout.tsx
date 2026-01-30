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
