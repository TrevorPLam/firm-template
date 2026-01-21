import { render, screen, within } from '@testing-library/react'
import { Award } from 'lucide-react'
import TrustBadge from '@/components/TrustBadge'

describe('TrustBadge', () => {
  it('test_renders_badges', () => {
    render(<TrustBadge />)

    expect(
      screen.getByRole('heading', { name: /credentials that reinforce confidence/i })
    ).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('test_handles_empty_badges', () => {
    render(<TrustBadge badges={[]} />)

    expect(screen.getByText(/trust badges will appear here once available/i)).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('test_truncates_large_badge_list', () => {
    const badges = Array.from({ length: 8 }, (_, index) => ({
      label: `Badge ${index}`,
      description: `Description ${index}`,
      icon: Award,
    }))

    render(<TrustBadge badges={badges} maxBadges={2} alignment="left" />)

    const badgeList = screen.getByRole('list', { name: /trust badges/i })
    expect(within(badgeList).getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText(/additional badges are available on request/i)).toBeInTheDocument()
  })

  it('test_handles_invalid_badge_data', () => {
    const badges = [
      { label: '', description: 'Missing label', icon: Award },
      { label: 'Missing description', description: '', icon: Award },
    ]

    render(<TrustBadge badges={badges} />)

    expect(screen.getByText(/trust badges will appear here once available/i)).toBeInTheDocument()
    expect(screen.getByText(/some badges were hidden/i)).toBeInTheDocument()
  })
})
