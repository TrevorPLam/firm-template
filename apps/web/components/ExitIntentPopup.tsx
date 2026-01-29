'use client'

/**
 * ExitIntentPopup — Re-engagement modal shown when a visitor moves toward leaving.
 *
 * @example
 * <ExitIntentPopup delayMs={5000} frequency="session" />
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@repo/ui'
import { Card } from '@repo/ui'
import { cn } from '@/lib/utils'
import {
  DEFAULT_EXIT_INTENT_STORAGE_KEY,
  exitIntentCooldownMs,
  getExitIntentStorage,
  isTouchDevice,
  readExitIntentState,
  shouldShowExitIntent,
  type ExitIntentFrequency,
  writeExitIntentState,
} from '@/lib/exit-intent'
import { usePathname, useRouter } from 'next/navigation'

interface ExitIntentPopupProps {
  /** Toggle the popup without removing it from the layout. */
  enabled?: boolean
  /** Headline text shown in the popup. */
  title?: string
  /** Supporting message for the visitor. */
  description?: string
  /** Primary CTA label. */
  primaryActionLabel?: string
  /** Primary CTA destination. */
  primaryActionHref?: string
  /** Secondary CTA label (dismiss). */
  secondaryActionLabel?: string
  /** Delay before exit intent becomes eligible (milliseconds). */
  delayMs?: number
  /** How often the popup may be shown. */
  frequency?: ExitIntentFrequency
  /** Storage key for tracking display state. */
  storageKey?: string
  /** Explicit allowlist for pages where exit intent should show. */
  allowedPaths?: string[]
  /** Explicit blocklist for pages where exit intent should not show. */
  blockedPaths?: string[]
  /** Optional callback after a dismissal. */
  onDismiss?: () => void
}

const defaultContent = {
  title: 'Before you go',
  description:
    'Get a quick consultation checklist and see how we can support your next project.',
  primaryActionLabel: 'Schedule a Consultation',
  primaryActionHref: '/contact',
  secondaryActionLabel: 'No thanks',
}

const isPathEligible = ({
  pathname,
  allowedPaths,
  blockedPaths,
}: {
  pathname: string
  allowedPaths?: string[]
  blockedPaths?: string[]
}): boolean => {
  if (blockedPaths?.includes(pathname)) {
    return false
  }

  if (allowedPaths && allowedPaths.length > 0) {
    return allowedPaths.includes(pathname)
  }

  return true
}

export default function ExitIntentPopup({
  enabled = true,
  title = defaultContent.title,
  description = defaultContent.description,
  primaryActionLabel = defaultContent.primaryActionLabel,
  primaryActionHref = defaultContent.primaryActionHref,
  secondaryActionLabel = defaultContent.secondaryActionLabel,
  delayMs = 5000,
  frequency = 'session',
  storageKey = DEFAULT_EXIT_INTENT_STORAGE_KEY,
  allowedPaths,
  blockedPaths = ['/privacy', '/terms'],
  onDismiss,
}: ExitIntentPopupProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isArmed, setIsArmed] = useState(delayMs <= 0)
  const hasTriggeredRef = useRef(false)

  const isEligiblePath = useMemo(
    () => isPathEligible({ pathname, allowedPaths, blockedPaths }),
    [allowedPaths, blockedPaths, pathname]
  )

  const storage = useMemo(() => getExitIntentStorage(frequency), [frequency])
  const cooldownMs = useMemo(() => exitIntentCooldownMs(frequency), [frequency])

  useEffect(() => {
    if (!enabled || !isEligiblePath) {
      return
    }

    if (delayMs <= 0) {
      // Already armed; no timer needed.
      setIsArmed(true)
      return
    }

    const timer = window.setTimeout(() => {
      setIsArmed(true)
    }, delayMs)

    return () => window.clearTimeout(timer)
  }, [delayMs, enabled, isEligiblePath])

  useEffect(() => {
    if (!enabled || !isEligiblePath || !isArmed) {
      return
    }

    if (isTouchDevice()) {
      // Exit intent is unreliable (and annoying) on touch devices, so we skip it.
      return
    }

    const storedState = readExitIntentState(storage, storageKey)
    const shouldShow = shouldShowExitIntent({
      now: Date.now(),
      lastShownAt: storedState.lastShownAt,
      cooldownMs,
    })

    if (!shouldShow) {
      return
    }

    const handleMouseLeave = (event: MouseEvent) => {
      if (event.clientY > 0 || hasTriggeredRef.current) {
        return
      }

      // This is the core exit-intent trigger: cursor leaves the viewport at the top.
      hasTriggeredRef.current = true
      setIsOpen(true)
      writeExitIntentState(storage, storageKey, { lastShownAt: Date.now() })
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [cooldownMs, enabled, isArmed, isEligiblePath, storage, storageKey])

  const handleDismiss = () => {
    setIsOpen(false)
    onDismiss?.()
  }

  const handlePrimaryAction = () => {
    if (primaryActionHref) {
      // Use router navigation so the popup doesn't force a full page reload.
      router.push(primaryActionHref)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/70 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
    >
      <Card className="relative w-full max-w-lg bg-off-white">
        <button
          type="button"
          onClick={handleDismiss}
          className={cn(
            'absolute right-4 top-4 rounded-full p-2 text-charcoal',
            'transition-colors hover:text-teal focus:outline-none focus:ring-2 focus:ring-teal'
          )}
          aria-label="Close exit intent popup"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="space-y-4 pr-8">
          <p id="exit-intent-title" className="text-2xl font-semibold text-charcoal">
            {title}
          </p>
          <p className="text-base text-slate">{description}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="medium" onClick={handlePrimaryAction}>
              {primaryActionLabel}
            </Button>
            <Button variant="secondary" size="medium" onClick={handleDismiss}>
              {secondaryActionLabel}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
