import { describe, it, expect } from 'vitest'
import { resolveVideoSource } from '@/lib/video'

describe('video helpers', () => {
  it('test_resolves_youtube_embed', () => {
    // Happy path: YouTube IDs should resolve to an embed URL.
    const result = resolveVideoSource({ provider: 'youtube', videoId: 'abc123' })

    expect(result.status).toBe('ready')
    expect(result.src).toBe('https://www.youtube.com/embed/abc123')
  })

  it('test_rejects_missing_video_id', () => {
    // Empty path: Missing IDs should surface a clear error message.
    const result = resolveVideoSource({ provider: 'vimeo', videoId: ' ' })

    expect(result.status).toBe('error')
    expect(result.reason).toBe('Missing video ID.')
  })

  it('test_rejects_unknown_provider', () => {
    // Error path: Unsupported providers should be rejected deterministically.
    const result = resolveVideoSource({ provider: 'unknown' })

    expect(result.status).toBe('error')
    expect(result.reason).toBe('Unsupported video provider.')
  })
})
