'use client'

import React from 'react'
import { THEME_IDS, type ThemeId } from '@repo/tokens'

const STORAGE_KEY = 'theme'

function getTheme(): ThemeId {
  if (typeof document === 'undefined') return 'default'
  const stored = document.documentElement.getAttribute('data-theme') as ThemeId | null
  if (stored && THEME_IDS.includes(stored)) return stored
  return (localStorage.getItem(STORAGE_KEY) as ThemeId) || 'default'
}

function setTheme(theme: ThemeId) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem(STORAGE_KEY, theme)
}

/**
 * Toggles design token theme (Default vs Alt). Persists to localStorage.
 * Proves theme switching for Phase 1; can be moved to theme-editor or removed later.
 */
export default function ThemeSwitcher() {
  const [theme, setThemeState] = React.useState<ThemeId>('default')

  React.useEffect(() => {
    setThemeState(getTheme())
  }, [])

  const handleChange = (next: ThemeId) => {
    setTheme(next)
    setThemeState(next)
  }

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Theme">
      <span className="text-sm text-foreground-muted">Theme:</span>
      {THEME_IDS.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => handleChange(id)}
          className={`text-sm px-2 py-1 rounded border transition-colors ${
            theme === id
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-transparent text-foreground border-border hover:border-foreground-muted'
          }`}
          aria-pressed={theme === id}
        >
          {id === 'default' ? 'Default' : 'Alt'}
        </button>
      ))}
    </div>
  )
}
