import Card from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { resolveVideoSource, type VideoProvider } from '@/lib/video'

/**
 * VideoPlayer — Unified video embed and file player.
 *
 * @example
 * <VideoPlayer provider="youtube" videoId="abc123" title="Firm overview" />
 */
export interface VideoPlayerProps {
  /** Label for accessibility and captions. */
  title: string
  /** Video provider type. */
  provider: VideoProvider
  /** Provider-specific ID for embeds (YouTube/Vimeo). */
  videoId?: string
  /** Direct file source (MP4/WebM) for file playback. */
  src?: string
  /** Optional poster image for file playback. */
  poster?: string
  /** Optional caption displayed below the player. */
  caption?: string
  /** Optional wrapper classes. */
  className?: string
}

const VideoFallback = ({ message }: { message: string }) => (
  <Card variant="default" className="text-center">
    <h3 className="text-lg font-semibold text-charcoal mb-2">Video unavailable</h3>
    <p className="text-sm text-slate">{message}</p>
  </Card>
)

const VideoFrame = ({
  title,
  embedUrl,
}: {
  title: string
  embedUrl: string
}) => (
  <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate/20 bg-black">
    <iframe
      title={title}
      src={embedUrl}
      className="h-full w-full"
      loading="lazy"
      allowFullScreen
    />
  </div>
)

const FilePlayer = ({
  title,
  src,
  poster,
}: {
  title: string
  src: string
  poster?: string
}) => (
  <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate/20 bg-black">
    {/* Preload metadata to keep initial page load fast while still showing duration. */}
    <video
      className="h-full w-full"
      controls
      preload="metadata"
      playsInline
      poster={poster}
      aria-label={title}
    >
      <source src={src} />
    </video>
  </div>
)

export default function VideoPlayer({
  title,
  provider,
  videoId,
  src,
  poster,
  caption,
  className,
}: VideoPlayerProps) {
  const resolved = resolveVideoSource({ provider, videoId, src })

  if (resolved.status === 'error' || !resolved.provider || !resolved.src) {
    return (
      <VideoFallback
        message={resolved.reason ?? 'Update the video source before publishing.'}
      />
    )
  }

  return (
    <figure className={cn('space-y-3', className)}>
      {resolved.provider === 'file' ? (
        <FilePlayer title={title} src={resolved.src} poster={poster} />
      ) : (
        <VideoFrame title={title} embedUrl={resolved.src} />
      )}
      {caption ? <figcaption className="text-sm text-slate">{caption}</figcaption> : null}
    </figure>
  )
}
