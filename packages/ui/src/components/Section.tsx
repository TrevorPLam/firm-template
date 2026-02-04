// AI-META-BEGIN
// 
// AI-META: React component: Section
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

// Section shell that standardizes vertical rhythm across pages
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn('py-16 md:py-24', className)}
        {...props}
      >
        {children}
      </section>
    )
  }
)

Section.displayName = 'Section'

export default Section
