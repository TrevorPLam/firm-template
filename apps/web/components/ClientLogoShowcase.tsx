/**
 * ClientLogoShowcase — Highlights client logos to build trust.
 *
 * @example
 * <ClientLogoShowcase />
 */

import Image from 'next/image'
import { Container } from '@repo/ui'
import { Section } from '@repo/ui'

interface ClientLogo {
  /** Public logo path under /public. */
  src: string
  /** Accessible description for the logo. */
  alt: string
  /** Optional destination URL for the client. */
  href?: string
}

interface ClientLogoShowcaseProps {
  /** Section headline. */
  heading?: string
  /** Supporting copy explaining the credibility signal. */
  summary?: string
  /** Logo list to render. */
  logos?: ClientLogo[]
  /** Maximum number of logos to display. */
  maxLogos?: number
}

const DEFAULT_MAX_LOGOS = 8

const defaultLogos: ClientLogo[] = [
  { src: '/clients/client-alpha.svg', alt: 'Client Alpha logo' },
  { src: '/clients/client-aurora.svg', alt: 'Client Aurora logo' },
  { src: '/clients/client-nimbus.svg', alt: 'Client Nimbus logo' },
  { src: '/clients/client-summit.svg', alt: 'Client Summit logo' },
]

const isValidLogo = (logo: ClientLogo) => Boolean(logo.src?.trim()) && Boolean(logo.alt?.trim())

const prepareLogos = (logos: ClientLogo[], maxLogos: number) => {
  const validLogos = logos.filter(isValidLogo)
  return {
    visibleLogos: validLogos.slice(0, maxLogos),
    hiddenCount: Math.max(0, validLogos.length - maxLogos),
    invalidCount: logos.length - validLogos.length,
  }
}

function LogoHeader({ heading, summary, hiddenCount }: {
  heading: string
  summary: string
  hiddenCount: number
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal">
        Trusted by teams like yours
      </p>
      <h2 className="text-3xl font-semibold text-charcoal md:text-4xl">{heading}</h2>
      <p className="text-base text-slate md:text-lg">{summary}</p>
      {hiddenCount > 0 ? (
        <p className="text-sm text-slate">Showing a preview of featured clients.</p>
      ) : null}
    </div>
  )
}

function LogoGrid({ logos }: { logos: ClientLogo[] }) {
  return (
    <ul className="grid grid-cols-2 gap-6 md:grid-cols-4" aria-label="Client logos">
      {logos.map((logo) => {
        const logoImage = (
          <Image
            src={logo.src}
            alt={logo.alt}
            width={160}
            height={80}
            className="h-12 w-auto grayscale transition duration-300 hover:grayscale-0"
            loading="lazy"
          />
        )

        return (
          <li key={`${logo.src}-${logo.alt}`} className="flex items-center justify-center">
            {logo.href ? (
              <a
                href={logo.href}
                className="inline-flex"
                rel="noreferrer"
                aria-label={logo.alt}
              >
                {logoImage}
              </a>
            ) : (
              logoImage
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default function ClientLogoShowcase({
  heading = 'Proven outcomes for modern professional services firms.',
  summary = 'Swap these logos with organizations you serve to reinforce trust at a glance.',
  logos = defaultLogos,
  maxLogos = DEFAULT_MAX_LOGOS,
}: ClientLogoShowcaseProps) {
  const { visibleLogos, hiddenCount, invalidCount } = prepareLogos(logos, maxLogos)

  return (
    <Section className="bg-off-white">
      <Container className="space-y-10">
        <LogoHeader heading={heading} summary={summary} hiddenCount={hiddenCount} />
        {visibleLogos.length > 0 ? (
          <LogoGrid logos={visibleLogos} />
        ) : (
          <p className="text-sm text-slate">Client logos will appear here once available.</p>
        )}
        {invalidCount > 0 ? (
          <p className="text-sm text-slate">
            Some logo entries were skipped because they were missing data.
          </p>
        ) : null}
      </Container>
    </Section>
  )
}
