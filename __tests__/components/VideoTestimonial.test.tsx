import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import VideoTestimonial from '@/components/VideoTestimonial'

describe('VideoTestimonial', () => {
  it('test_renders_testimonial_cards', () => {
    // Happy path: cards should render with the supplied testimonial content.
    render(
      <VideoTestimonial
        items={[
          {
            name: 'Taylor Harper',
            role: 'Founder',
            quote: 'Clear, structured guidance from day one.',
            provider: 'youtube',
            videoId: 'abc123',
          },
        ]}
      />
    )

    expect(screen.getByText('Taylor Harper')).toBeInTheDocument()
    expect(screen.getByText('Founder')).toBeInTheDocument()
  })

  it('test_handles_empty_items', () => {
    // Empty path: no items should show the section-level fallback.
    render(<VideoTestimonial items={[]} />)

    expect(screen.getByText('Video testimonials unavailable')).toBeInTheDocument()
  })

  it('test_handles_invalid_item_source', () => {
    // Error path: invalid items should surface the per-card placeholder message.
    render(
      <VideoTestimonial
        items={[
          {
            name: 'Morgan Lee',
            role: 'Director',
            quote: 'Missing video ID should display a helpful placeholder.',
            provider: 'vimeo',
          },
        ]}
      />
    )

    expect(screen.getByText('Missing video ID.')).toBeInTheDocument()
  })
})
