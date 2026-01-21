import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import VideoPlayer from '@/components/VideoPlayer'
import type { VideoProvider } from '@/lib/video'

describe('VideoPlayer', () => {
  it('test_renders_embed_video', () => {
    // Happy path: embed providers should render an iframe with the title.
    render(<VideoPlayer provider="youtube" videoId="abc123" title="Test video" />)

    expect(screen.getByTitle('Test video')).toBeInTheDocument()
  })

  it('test_handles_missing_video_id', () => {
    // Empty path: missing IDs should show the fallback messaging.
    render(<VideoPlayer provider="youtube" title="Missing ID" />)

    expect(screen.getByText('Video unavailable')).toBeInTheDocument()
  })

  it('test_handles_unsupported_provider', () => {
    // Error path: runtime-unknown providers should render the fallback.
    render(
      <VideoPlayer provider={'unknown' as VideoProvider} title="Bad provider" />
    )

    expect(screen.getByText('Video unavailable')).toBeInTheDocument()
  })
})
