import { render, screen, within } from '@testing-library/react'
import ClientLogoShowcase from '@/components/ClientLogoShowcase'

describe('ClientLogoShowcase', () => {
  it('test_renders_logos', () => {
    render(<ClientLogoShowcase />)

    expect(
      screen.getByRole('heading', { name: /proven outcomes for modern professional services firms/i })
    ).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(4)
  })

  it('test_handles_empty_logos', () => {
    render(<ClientLogoShowcase logos={[]} />)

    expect(screen.getByText(/client logos will appear here once available/i)).toBeInTheDocument()
    expect(screen.queryAllByRole('img')).toHaveLength(0)
  })

  it('test_truncates_large_logo_list', () => {
    const logos = Array.from({ length: 10 }, (_, index) => ({
      src: `/clients/logo-${index}.svg`,
      alt: `Client ${index} logo`,
    }))

    render(<ClientLogoShowcase logos={logos} maxLogos={3} />)

    const logoList = screen.getByRole('list', { name: /client logos/i })
    expect(within(logoList).getAllByRole('img')).toHaveLength(3)
    expect(screen.getByText(/showing a preview of featured clients/i)).toBeInTheDocument()
  })

  it('test_handles_invalid_logo_data', () => {
    const logos = [
      { src: '', alt: 'Missing source' },
      { src: '/clients/logo.svg', alt: '' },
    ]

    render(<ClientLogoShowcase logos={logos} />)

    expect(screen.getByText(/client logos will appear here once available/i)).toBeInTheDocument()
    expect(screen.getByText(/some logo entries were skipped/i)).toBeInTheDocument()
  })
})
