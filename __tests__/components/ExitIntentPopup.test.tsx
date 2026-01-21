import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const pushSpy = vi.fn()

vi.mock('@/lib/exit-intent', async () => {
  const actual = await vi.importActual<typeof import('@/lib/exit-intent')>(
    '@/lib/exit-intent'
  )

  return {
    ...actual,
    // Force non-touch for predictable exit-intent testing in jsdom.
    isTouchDevice: () => false,
  }
})

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: pushSpy }),
}))

import ExitIntentPopup from '@/components/ExitIntentPopup'

describe('ExitIntentPopup', () => {
  beforeEach(() => {
    pushSpy.mockClear()
  })

  it('test_happy_shows_popup_on_exit_intent', async () => {
    // Happy path: when the cursor leaves at the top, the popup should appear.
    render(<ExitIntentPopup delayMs={0} title="Exit Intent Title" />)

    fireEvent.mouseLeave(document, { clientY: 0 })

    await waitFor(() => {
      expect(screen.getByText('Exit Intent Title')).toBeInTheDocument()
    })
  })

  it('test_edge_respects_blocked_paths', async () => {
    // Edge case: blocklisted routes should never display the popup.
    render(
      <ExitIntentPopup delayMs={0} title="Blocked Title" blockedPaths={['/']} />
    )

    fireEvent.mouseLeave(document, { clientY: 0 })

    await waitFor(() => {
      expect(screen.queryByText('Blocked Title')).not.toBeInTheDocument()
    })
  })
})
