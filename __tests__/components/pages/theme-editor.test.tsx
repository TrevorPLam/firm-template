import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeEditorClient from '@/app/theme-editor/theme-editor-client'

describe('theme editor', () => {
  it('shows updated snippets after selecting new tokens (happy path)', async () => {
    // Happy path: changing selections should reflect in generated snippets.
    const user = userEvent.setup()
    render(<ThemeEditorClient />)

    await user.selectOptions(screen.getByLabelText('Primary color'), 'amber')
    await user.selectOptions(screen.getByLabelText('Secondary color'), 'charcoal')

    await user.click(screen.getByRole('button', { name: /generate snippets/i }))

    expect(screen.getByRole('heading', { name: 'tailwind.config.ts' })).toBeInTheDocument()
    expect(screen.getAllByText(/#F59E0B/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/#0F1115/i).length).toBeGreaterThan(0)
  })

  it('shows a helpful message when the logo input is cleared (edge case)', () => {
    // Edge case: no file selected should surface a clear, recoverable prompt.
    render(<ThemeEditorClient />)

    const input = screen.getByLabelText('Logo upload (preview only)') as HTMLInputElement
    fireEvent.change(input, { target: { files: [] } })

    expect(
      screen.getByText(/select an image file to preview your logo/i)
    ).toBeInTheDocument()
  })

  it('rejects unsupported logo files (error case)', () => {
    // Error case: bypass the accept filter to ensure defensive validation triggers.
    render(<ThemeEditorClient />)

    const input = screen.getByLabelText('Logo upload (preview only)') as HTMLInputElement
    const file = new File(['not an image'], 'notes.txt', { type: 'text/plain' })

    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByText(/upload a png, jpeg, webp, or svg file/i)).toBeInTheDocument()
  })
})
