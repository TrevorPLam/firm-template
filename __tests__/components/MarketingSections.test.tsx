import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'
import ValueProps from '@/components/ValueProps'
import ServicesOverview from '@/components/ServicesOverview'
import SocialProof from '@/components/SocialProof'

describe('Marketing sections', () => {
  it('renders hero headline and primary CTAs', () => {
    render(<Hero />)

    expect(
      screen.getByRole('heading', { name: /your professional partner — delivering expert solutions for your business/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /book a free consultation/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument()
  })

  it('renders the value proposition cards', () => {
    render(<ValueProps />)

    expect(
      screen.getByRole('heading', { level: 3, name: /expert guidance, strategic execution/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: /true partnership approach/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /ideal for ambitious organizations/i })).toBeInTheDocument()
  })

  it('renders the services overview section', () => {
    render(<ServicesOverview />)

    expect(
      screen.getByRole('heading', { name: /professional services for your business/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /core service 1/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /learn more/i })).toHaveLength(4)
  })

  it('renders testimonials and metrics', () => {
    render(<SocialProof />)

    expect(screen.getByRole('heading', { name: /trusted by clients we work with/i })).toBeInTheDocument()
    expect(screen.getByText(/sarah johnson/i)).toBeInTheDocument()
    expect(screen.getByText(/127%/i)).toBeInTheDocument()
  })
})
