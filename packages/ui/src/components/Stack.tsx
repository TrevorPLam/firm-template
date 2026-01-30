import React from 'react'
import { cn } from '@repo/utils'

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column'
  gap?: 2 | 3 | 4 | 6 | 8
  wrap?: boolean
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  children: React.ReactNode
}

const gapMap = { 2: 'gap-2', 3: 'gap-3', 4: 'gap-4', 6: 'gap-6', 8: 'gap-8' } as const
const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
} as const
const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
} as const

/**
 * Flex stack primitive. Layout only; no colors or section assumptions.
 */
const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      direction = 'column',
      gap = 4,
      wrap = false,
      align,
      justify,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        'flex',
        direction === 'column' ? 'flex-col' : 'flex-row',
        gapMap[gap],
        wrap && 'flex-wrap',
        align && alignMap[align],
        justify && justifyMap[justify],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)

Stack.displayName = 'Stack'

export default Stack
