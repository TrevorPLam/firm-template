/**
 * TrustBadge — Displays certifications or awards with tooltip details.
 *
 * @example
 * <TrustBadge />
 */

import { Award, BadgeCheck, ShieldCheck } from 'lucide-react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'

type BadgeAlignment = 'left' | 'center'

interface TrustBadgeItem {
  /** Short label shown under the badge. */
  label: string
  /** Tooltip copy describing the credential. */
  description: string
  /** Icon representing the badge. */
  icon: typeof Award
}

interface TrustBadgeProps {
  /** Section headline. */
  heading?: string
  /** Supporting copy for the badges. */
  summary?: string
  /** Badge list to render. */
  badges?: TrustBadgeItem[]
  /** Layout alignment for the badge grid. */
  alignment?: BadgeAlignment
  /** Maximum number of badges to display. */
  maxBadges?: number
}

const DEFAULT_MAX_BADGES = 6

const defaultBadges: TrustBadgeItem[] = [
  {
    label: 'Certified Excellence',
    description: 'Recognized for consistent, high-quality client delivery.',
    icon: Award,
  },
  {
    label: 'Verified Partner',
    description: 'Independent verification of service standards and compliance.',
    icon: BadgeCheck,
  },
  {
    label: 'Security Focused',
    description: 'Commitment to protecting sensitive client information.',
    icon: ShieldCheck,
  },
]

const isValidBadge = (badge: TrustBadgeItem) => Boolean(badge.label?.trim()) && Boolean(badge.description?.trim())

const prepareBadges = (badges: TrustBadgeItem[], maxBadges: number) => {
  const validBadges = badges.filter(isValidBadge)
  return {
    visibleBadges: validBadges.slice(0, maxBadges),
    hiddenCount: Math.max(0, validBadges.length - maxBadges),
    invalidCount: badges.length - validBadges.length,
  }
}

const alignmentClass = (alignment: BadgeAlignment) => {
  return alignment === 'left' ? 'items-start text-left' : 'items-center text-center'
}

function BadgeHeader({ heading, summary, hiddenCount, alignment }: {
  heading: string
  summary: string
  hiddenCount: number
  alignment: BadgeAlignment
}) {
  return (
    <div className={`space-y-3 ${alignmentClass(alignment)}`}>
      <p className="text-sm font-semibold uppercase tracking-widest text-teal">Credentials</p>
      <h2 className="text-3xl font-semibold text-charcoal md:text-4xl">{heading}</h2>
      <p className="text-base text-slate md:text-lg">{summary}</p>
      {hiddenCount > 0 ? (
        <p className="text-sm text-slate">Additional badges are available on request.</p>
      ) : null}
    </div>
  )
}

function BadgeGrid({ badges, alignment }: { badges: TrustBadgeItem[]; alignment: BadgeAlignment }) {
  return (
    <ul
      className={`grid gap-6 md:grid-cols-3 ${alignment === 'left' ? 'justify-items-start' : 'justify-items-center'}`}
      aria-label="Trust badges"
    >
      {badges.map((badge) => {
        const Icon = badge.icon
        return (
          <li
            key={badge.label}
            className="flex flex-col items-center gap-3 rounded-xl border border-slate/20 bg-white px-4 py-6"
            title={badge.description}
          >
            <Icon className="h-8 w-8 text-teal" aria-hidden="true" />
            <p className="text-sm font-semibold text-charcoal">{badge.label}</p>
            <p className="text-xs text-slate">{badge.description}</p>
          </li>
        )
      })}
    </ul>
  )
}

export default function TrustBadge({
  heading = 'Credentials that reinforce confidence.',
  summary = 'Replace these with your own certifications, awards, or memberships.',
  badges = defaultBadges,
  alignment = 'center',
  maxBadges = DEFAULT_MAX_BADGES,
}: TrustBadgeProps) {
  const { visibleBadges, hiddenCount, invalidCount } = prepareBadges(badges, maxBadges)

  return (
    <Section>
      <Container className="space-y-10">
        <BadgeHeader
          heading={heading}
          summary={summary}
          hiddenCount={hiddenCount}
          alignment={alignment}
        />
        {visibleBadges.length > 0 ? (
          <BadgeGrid badges={visibleBadges} alignment={alignment} />
        ) : (
          <p className="text-sm text-slate">Trust badges will appear here once available.</p>
        )}
        {invalidCount > 0 ? (
          <p className="text-sm text-slate">
            Some badges were hidden because they were missing required details.
          </p>
        ) : null}
      </Container>
    </Section>
  )
}
