// AI-META-BEGIN
// 
// AI-META: React component: Grid
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

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6
  colsSm?: 1 | 2 | 3 | 4 | 6
  colsMd?: 1 | 2 | 3 | 4 | 6
  colsLg?: 1 | 2 | 3 | 4 | 6
  gap?: 4 | 6 | 8
  children: React.ReactNode
}

const colsMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  6: 'grid-cols-6',
} as const
const smMap = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  6: 'sm:grid-cols-6',
} as const
const mdMap = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  6: 'md:grid-cols-6',
} as const
const lgMap = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  6: 'lg:grid-cols-6',
} as const
const gapMap = { 4: 'gap-4', 6: 'gap-6', 8: 'gap-8' } as const

/**
 * CSS Grid primitive. Layout only; no colors or section assumptions.
 */
const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      className,
      cols = 1,
      colsSm,
      colsMd,
      colsLg,
      gap = 6,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        'grid',
        colsMap[cols],
        colsSm && smMap[colsSm],
        colsMd && mdMap[colsMd],
        colsLg && lgMap[colsLg],
        gapMap[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)

Grid.displayName = 'Grid'

export default Grid
