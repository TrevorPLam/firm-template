'use client'

import { useRef } from 'react'
import Card from '@/components/ui/Card'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { resolveVideoSource, type VideoProvider } from '@/lib/video'

export interface VideoTestimonialItem {
  /** Name of the person or organization. */
  name: string
  /** Role or context label. */
  role: string
  /** Short quote shown alongside the video. */
  quote: string
  /** Video provider for the testimonial clip. */
  provider: VideoProvider
  /** Video ID for embed providers. */
  videoId?: string
  /** Direct file source for hosted videos. */
  src?: string
  /** Optional poster image for file-based video. */
  poster?: string
}

export interface VideoTestimonialProps {
  /** List of testimonials to display. */
  items: VideoTestimonialItem[]
  /** Section title (customize per page). */
  title?: string
  /** Section description (optional). */
  description?: string
  /** Enable hover-to-play for file-based videos. */
  playOnHover?: boolean
}

const VideoTestimonialFallback = ({ message }: { message: string }) => (
  <Card variant="default" className="text-center">
    <h3 className="text-lg font-semibold text-charcoal mb-2">Video testimonials unavailable</h3>
    <p className="text-sm text-slate">{message}</p>
  </Card>
)

const TestimonialPlaceholder = ({ message }: { message: string }) => (
  <div className="aspect-video w-full rounded-xl border border-slate/20 bg-off-white flex items-center justify-center px-4 text-center">
    <p className="text-sm text-slate">{message}</p>
  </div>
)

const FileTestimonialVideo = ({
  item,
  src,
  playOnHover,
}: {
  item: VideoTestimonialItem
  src: string
  playOnHover: boolean
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  return (
    <div
      className="aspect-video w-full overflow-hidden rounded-xl border border-slate/20 bg-black"
      onMouseEnter={() => {
        if (!playOnHover) return
        // Autoplay can be blocked by browsers; ignore failures for smoother UX.
        void videoRef.current?.play().catch(() => null)
      }}
      onMouseLeave={() => {
        if (!playOnHover) return
        videoRef.current?.pause()
      }}
    >
      <video
        ref={videoRef}
        className="h-full w-full"
        controls
        preload="metadata"
        playsInline
        poster={item.poster}
        aria-label={`${item.name} testimonial`}
      >
        <source src={src} />
      </video>
    </div>
  )
}

const EmbedTestimonialVideo = ({
  title,
  src,
}: {
  title: string
  src: string
}) => (
  <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate/20 bg-black">
    <iframe title={title} src={src} className="h-full w-full" loading="lazy" allowFullScreen />
  </div>
)

const TestimonialVideo = ({
  item,
  playOnHover,
}: {
  item: VideoTestimonialItem
  playOnHover: boolean
}) => {
  const resolved = resolveVideoSource({
    provider: item.provider,
    videoId: item.videoId,
    src: item.src,
  })

  if (resolved.status === 'error' || !resolved.provider || !resolved.src) {
    return (
      <TestimonialPlaceholder
        message={resolved.reason ?? 'Replace this placeholder video before launch.'}
      />
    )
  }

  if (resolved.provider === 'file') {
    return <FileTestimonialVideo item={item} src={resolved.src} playOnHover={playOnHover} />
  }

  return <EmbedTestimonialVideo title={`${item.name} testimonial`} src={resolved.src} />
}

/**
 * VideoTestimonial — grid of video testimonial cards with optional hover playback.
 */
export default function VideoTestimonial({
  items,
  title = 'Client Video Testimonials',
  description = 'Hear directly from clients about their experience working with our team.',
  playOnHover = false,
}: VideoTestimonialProps) {
  if (items.length === 0) {
    return (
      <Section className="bg-white">
        <Container>
          <VideoTestimonialFallback message="Add at least one testimonial to enable this section." />
        </Container>
      </Section>
    )
  }

  return (
    <Section className="bg-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">{title}</h2>
          <p className="text-lg text-slate">{description}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={`${item.name}-${item.role}`} variant="default" className="space-y-4">
              <TestimonialVideo item={item} playOnHover={playOnHover} />
              <div>
                <p className="text-sm text-slate mb-3">"{item.quote}"</p>
                <p className="font-semibold text-charcoal">{item.name}</p>
                <p className="text-xs uppercase tracking-wide text-slate">{item.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
