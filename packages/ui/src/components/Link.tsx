// AI-META-BEGIN
// 
// AI-META: React component: Link
// OWNERSHIP: packages/ui (shared UI components)
// ENTRYPOINTS: Imported by pages and other components
// DEPENDENCIES: internal packages (@repo/*), React
// DANGER: None identified
// CHANGE-SAFETY: Props and styling: generally safe. Logic changes: test thoroughly
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

import React from 'react'
import { cn } from '@repo/utils'

/**
 * Styled link primitive. Token-based; no marketing assumptions.
 * Use with next/link: <Link href="..." as={NextLink}> or wrap <a> in Next.js Link.
 */
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'default' | 'muted' | 'primary' | 'primary-button' | 'secondary-button'
  children: React.ReactNode
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseStyles =
      'transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded inline-flex items-center justify-center'
    const isButtonStyle = variant === 'primary-button' || variant === 'secondary-button'

    const variants = {
      default: 'underline underline-offset-2 text-foreground hover:text-foreground-muted',
      muted: 'underline underline-offset-2 text-foreground-muted hover:text-foreground',
      primary: 'underline underline-offset-2 text-primary hover:text-primary-hover',
      'primary-button':
        'no-underline font-semibold py-4 px-8 text-lg bg-primary hover:bg-primary-hover text-primary-foreground',
      'secondary-button':
        'no-underline font-semibold py-4 px-8 text-lg bg-transparent hover:bg-background text-foreground border-2 border-foreground',
    }

    return (
      <a
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </a>
    )
  }
)

Link.displayName = 'Link'

export default Link
