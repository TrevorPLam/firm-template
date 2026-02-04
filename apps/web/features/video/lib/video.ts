// AI-META-BEGIN
// 
// AI-META: Utility functions and helpers
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Imported by application code
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Add functions: safe. Modify existing: check all call sites first
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

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
