import React from 'react'
import { cn } from '@repo/utils'

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  /** Semantic variant; maps to element and token-based styles */
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body'
    | 'body-muted'
    | 'small'
    | 'small-muted'
  /** Override rendered element (e.g. h2 with variant="h1" for visual hierarchy) */
  as?: React.ElementType
  children: React.ReactNode
}

const variantStyles: Record<NonNullable<TypographyProps['variant']>, string> = {
  h1: 'text-4xl md:text-5xl font-bold text-foreground font-heading tracking-tight',
  h2: 'text-3xl md:text-4xl font-bold text-foreground font-heading tracking-tight',
  h3: 'text-2xl md:text-3xl font-semibold text-foreground font-heading',
  h4: 'text-xl md:text-2xl font-semibold text-foreground font-heading',
  h5: 'text-lg font-semibold text-foreground font-heading',
  h6: 'text-base font-semibold text-foreground font-heading',
  body: 'text-base text-foreground font-sans leading-relaxed',
  'body-muted': 'text-base text-foreground-muted font-sans leading-relaxed',
  small: 'text-sm text-foreground font-sans',
  'small-muted': 'text-sm text-foreground-muted font-sans',
}

const variantElements: Record<string, keyof JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  'body-muted': 'p',
  small: 'span',
  'small-muted': 'span',
}

/**
 * Typography primitive. Token-based; no marketing/section assumptions.
 */
const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = 'body', as, children, ...props }, ref) => {
    const Component = as ?? variantElements[variant]
    return React.createElement(
      Component,
      {
        ref: ref as React.Ref<HTMLElement>,
        className: cn(variantStyles[variant], className),
        ...props,
      },
      children
    )
  }
)

Typography.displayName = 'Typography'

export default Typography
