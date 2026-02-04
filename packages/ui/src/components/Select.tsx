// AI-META-BEGIN
// 
// AI-META: React component: Select
// OWNERSHIP: packages/ui (shared UI components)
// ENTRYPOINTS: Imported by pages and other components
// DEPENDENCIES: internal packages (@repo/*), React
// DANGER: None identified
// CHANGE-SAFETY: Props and styling: generally safe. Logic changes: test thoroughly
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

import React, { useId } from 'react'
import { cn } from '@repo/utils'

// Labeled select with error styling; keeps forms consistent with Input/Textarea
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const generatedId = useId()
    const selectId = id || props.name || generatedId

    return (
      <div className="mb-4">
        {label && (
          <label className="block text-foreground-muted font-semibold mb-2" htmlFor={selectId}>
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full px-4 py-3 rounded-lg border bg-background text-foreground transition-all',
            'focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none',
            error ? 'border-error focus:border-error focus:ring-error/20' : 'border-border',
            className
          )}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
