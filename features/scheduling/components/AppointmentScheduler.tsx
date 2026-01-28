'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import type { SchedulingConfig } from '@/lib/scheduling'

interface AppointmentSchedulerProps {
  /** Scheduling configuration computed on the server. */
  config: SchedulingConfig
  /** Optional section heading (customize per page). */
  title?: string
  /** Optional section description (customize per page). */
  description?: string
  /** Inline embed or modal popup. */
  mode?: 'inline' | 'modal'
  /** Button label for modal mode. */
  ctaLabel?: string
}

const SchedulerFrame = ({ embedUrl, label }: { embedUrl: string; label: string }) => (
  <div className="w-full overflow-hidden rounded-xl border border-slate/20 bg-white">
    <div className="aspect-video">
      <iframe
        title={label}
        src={embedUrl}
        className="h-full w-full"
        loading="lazy"
      />
    </div>
  </div>
)

const SchedulerFallback = ({ message }: { message: string }) => (
  <Card variant="default" className="text-center">
    <h3 className="text-xl font-semibold text-charcoal mb-2">Scheduling Unavailable</h3>
    <p className="text-slate mb-6">{message}</p>
    <Link href="/contact">
      <Button variant="primary" size="medium">
        Contact Us Instead
      </Button>
    </Link>
  </Card>
)

const SchedulingDialog = ({
  dialogId,
  titleId,
  label,
  embedUrl,
  onClose,
}: {
  dialogId: string
  titleId: string
  label: string
  embedUrl: string
  onClose: () => void
}) => (
  <div
    id={dialogId}
    className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/80 px-4 py-6"
    role="dialog"
    aria-modal="true"
    aria-labelledby={titleId}
  >
    <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 id={titleId} className="text-xl font-semibold text-charcoal">
            {label}
          </h3>
          <p className="text-sm text-slate">
            Choose a time that works best for you and we will send a confirmation.
          </p>
        </div>
        <Button
          variant="secondary"
          size="small"
          onClick={onClose}
          aria-label="Close scheduling dialog"
        >
          Close
        </Button>
      </div>
      <SchedulerFrame embedUrl={embedUrl} label={label} />
    </div>
  </div>
)

const SchedulerModal = ({
  embedUrl,
  label,
  ctaLabel,
}: {
  embedUrl: string
  label: string
  ctaLabel: string
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dialogId = useId()
  const dialogTitleId = useId()

  return (
    <div className="flex justify-center">
      <Button
        variant="primary"
        size="large"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={dialogId}
      >
        {ctaLabel}
      </Button>

      {isOpen ? (
        <SchedulingDialog
          dialogId={dialogId}
          titleId={dialogTitleId}
          label={label}
          embedUrl={embedUrl}
          onClose={() => setIsOpen(false)}
        />
      ) : null}
    </div>
  )
}

/**
 * AppointmentScheduler — Optional scheduling CTA with inline or modal embed.
 *
 * @example
 * <AppointmentScheduler config={config} mode="modal" />
 */
export default function AppointmentScheduler({
  config,
  title = 'Book a Consultation',
  description = 'Pick a time that works for you and we will confirm the meeting details.',
  mode = 'inline',
  ctaLabel = 'Schedule a Consultation',
}: AppointmentSchedulerProps) {
  // Avoid rendering when scheduling is intentionally disabled in env config.
  if (config.status === 'disabled') {
    return null
  }

  const label =
    config.provider === 'calendly' ? 'Calendly scheduling' : 'Cal.com scheduling'

  return (
    <Section className="bg-off-white">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">{title}</h2>
          <p className="text-lg text-slate mb-10">{description}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {config.status === 'error' || !config.embedUrl ? (
            <SchedulerFallback message={config.reason ?? 'Please contact us to schedule.'} />
          ) : mode === 'modal' ? (
            <SchedulerModal embedUrl={config.embedUrl} label={label} ctaLabel={ctaLabel} />
          ) : (
            <SchedulerFrame embedUrl={config.embedUrl} label={label} />
          )}
        </div>
      </Container>
    </Section>
  )
}
