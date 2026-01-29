export type VideoProvider = 'youtube' | 'vimeo' | 'file'

export interface VideoSourceInput {
  provider: VideoProvider | string
  videoId?: string
  src?: string
}

export interface ResolvedVideoSource {
  status: 'ready' | 'error'
  provider?: VideoProvider
  src?: string
  reason?: string
}

const videoProviders = new Set<VideoProvider>(['youtube', 'vimeo', 'file'])

export function isVideoProvider(value: string): value is VideoProvider {
  return videoProviders.has(value as VideoProvider)
}

const buildEmbedUrl = (provider: VideoProvider, videoId: string) => {
  const trimmedId = videoId.trim()

  if (provider === 'youtube') {
    return `https://www.youtube.com/embed/${trimmedId}`
  }

  return `https://player.vimeo.com/video/${trimmedId}`
}

export function resolveVideoSource({
  provider,
  videoId,
  src,
}: VideoSourceInput): ResolvedVideoSource {
  if (!isVideoProvider(provider)) {
    return { status: 'error', reason: 'Unsupported video provider.' }
  }

  if (provider === 'file') {
    if (!src?.trim()) {
      return { status: 'error', provider, reason: 'Missing video file source.' }
    }

    return { status: 'ready', provider, src }
  }

  if (!videoId?.trim()) {
    return { status: 'error', provider, reason: 'Missing video ID.' }
  }

  return { status: 'ready', provider, src: buildEmbedUrl(provider, videoId) }
}
