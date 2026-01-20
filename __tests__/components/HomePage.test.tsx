import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

describe('HomePage', () => {
  it('renders hero and CTA content', async () => {
    render(<HomePage />)

    // Test hero content
    expect(screen.getByRole('heading', { name: /your professional partner/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /book a free consultation/i })).toBeInTheDocument()
    
    // Test value props content
    expect(screen.getByRole('heading', { level: 3, name: /expert guidance, strategic execution/i })).toBeInTheDocument()
  })
})
