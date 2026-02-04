// AI-META-BEGIN
// 
// AI-META: React component: Accordion
// OWNERSHIP: packages/ui (shared UI components)
// ENTRYPOINTS: Imported by pages and other components
// DEPENDENCIES: internal packages (@repo/*), React
// DANGER: None identified
// CHANGE-SAFETY: Props and styling: generally safe. Logic changes: test thoroughly
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

'use client'

import React, { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@repo/utils'

// Simple accessible accordion; single-item open state keyed for FAQ blocks
export interface AccordionItem {
  question: string
  answer: string
}

export interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

export default function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const accordionId = useId()

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-background rounded-lg border border-border overflow-hidden"
        >
          {(() => {
            const buttonId = `${accordionId}-button-${index}`
            const panelId = `${accordionId}-panel-${index}`

            return (
              <>
          <button
            id={buttonId}
            onClick={() => toggleItem(index)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-background-alt transition-colors"
            aria-expanded={openIndex === index}
            aria-controls={panelId}
          >
            <span className="font-semibold text-foreground pr-4">{item.question}</span>
            <ChevronDown
              className={cn(
                'w-5 h-5 text-foreground-muted transition-transform flex-shrink-0',
                openIndex === index && 'transform rotate-180'
              )}
            />
          </button>
          {openIndex === index && (
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="px-6 pb-4"
            >
              <p className="text-foreground-muted leading-relaxed">{item.answer}</p>
            </div>
          )}
              </>
            )
          })()}
        </div>
      ))}
    </div>
  )
}
