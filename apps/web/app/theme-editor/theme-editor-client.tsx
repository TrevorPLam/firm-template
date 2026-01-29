'use client'

import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { Button } from '@repo/ui'
import { Card } from '@repo/ui'
import { Container } from '@repo/ui'
import { Input } from '@repo/ui'
import { Section } from '@repo/ui'
import { Select } from '@repo/ui'

interface ColorOption {
  value: string
  label: string
  hex: string
  darkHex: string
  lightHex: string
  buttonClass: string
  buttonHoverClass: string
  badgeClass: string
}

interface FontOption {
  value: string
  label: string
  className: string
  stack: string
}

const COLOR_OPTIONS: ColorOption[] = [
  {
    value: 'teal',
    label: 'Teal (default)',
    hex: '#0EA5A4',
    darkHex: '#0d8f8e',
    lightHex: '#10b5b4',
    buttonClass: 'bg-teal',
    buttonHoverClass: 'hover:bg-teal-dark',
    badgeClass: 'bg-teal/10 text-teal',
  },
  {
    value: 'amber',
    label: 'Amber',
    hex: '#F59E0B',
    darkHex: '#F59E0B',
    lightHex: '#F59E0B',
    buttonClass: 'bg-amber',
    buttonHoverClass: 'hover:bg-amber',
    badgeClass: 'bg-amber/10 text-amber',
  },
  {
    value: 'charcoal',
    label: 'Charcoal',
    hex: '#0F1115',
    darkHex: '#0F1115',
    lightHex: '#0F1115',
    buttonClass: 'bg-charcoal',
    buttonHoverClass: 'hover:bg-slate',
    badgeClass: 'bg-charcoal/10 text-charcoal',
  },
  {
    value: 'success',
    label: 'Success',
    hex: '#10B981',
    darkHex: '#10B981',
    lightHex: '#10B981',
    buttonClass: 'bg-success',
    buttonHoverClass: 'hover:bg-success',
    badgeClass: 'bg-success/10 text-success',
  },
  {
    value: 'error',
    label: 'Error',
    hex: '#EF4444',
    darkHex: '#EF4444',
    lightHex: '#EF4444',
    buttonClass: 'bg-error',
    buttonHoverClass: 'hover:bg-error',
    badgeClass: 'bg-error/10 text-error',
  },
]

const FONT_OPTIONS: FontOption[] = [
  {
    value: 'font-sans',
    label: 'Inter (Sans)',
    className: 'font-sans',
    stack: "['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']",
  },
  {
    value: 'font-authority',
    label: 'IBM Plex Sans (Authority)',
    className: 'font-authority',
    stack: "['IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']",
  },
]

const DEFAULT_THEME = {
  primary: 'teal',
  secondary: 'amber',
  headingFont: 'font-authority',
  bodyFont: 'font-sans',
}

const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
const MAX_LOGO_BYTES = 2 * 1024 * 1024

const resolveOption = <T extends { value: string }>(
  options: T[],
  value: string,
  fallbackValue: string
): T => {
  // Guard against tampered form values so the preview/export stays deterministic.
  const match = options.find((option) => option.value === value)
  return match ?? options.find((option) => option.value === fallbackValue) ?? options[0]
}

const buildTailwindSnippet = (config: {
  primary: ColorOption
  secondary: ColorOption
  headingFont: FontOption
  bodyFont: FontOption
}) => {
  return `// tailwind.config.ts\n// Replace the teal + amber tokens with your selected values.\nextend: {\n  colors: {\n    teal: {\n      DEFAULT: '${config.primary.hex}',\n      dark: '${config.primary.darkHex}',\n      light: '${config.primary.lightHex}',\n    },\n    amber: '${config.secondary.hex}',\n  },\n  fontFamily: {\n    sans: ${config.bodyFont.stack},\n    authority: ${config.headingFont.stack},\n  },\n}`
}

const buildCssVariablesSnippet = (config: { primary: ColorOption; secondary: ColorOption }) => {
  return `/* app/globals.css */\n:root {\n  --teal: ${config.primary.hex};\n  --teal-dark: ${config.primary.darkHex};\n  --teal-light: ${config.primary.lightHex};\n  --amber: ${config.secondary.hex};\n}`
}

const ThemeControls = ({
  primaryValue,
  secondaryValue,
  headingFontValue,
  bodyFontValue,
  logoError,
  onPrimaryChange,
  onSecondaryChange,
  onHeadingFontChange,
  onBodyFontChange,
  onLogoChange,
}: {
  primaryValue: string
  secondaryValue: string
  headingFontValue: string
  bodyFontValue: string
  logoError: string | null
  onPrimaryChange: (value: string) => void
  onSecondaryChange: (value: string) => void
  onHeadingFontChange: (value: string) => void
  onBodyFontChange: (value: string) => void
  onLogoChange: (event: ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <Card>
      <h2 className="text-h3 font-authority text-charcoal mb-4">Theme controls</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Primary color"
          options={COLOR_OPTIONS}
          value={primaryValue}
          onChange={(event) => onPrimaryChange(event.target.value)}
        />
        <Select
          label="Secondary color"
          options={COLOR_OPTIONS}
          value={secondaryValue}
          onChange={(event) => onSecondaryChange(event.target.value)}
        />
        <Select
          label="Heading font"
          options={FONT_OPTIONS}
          value={headingFontValue}
          onChange={(event) => onHeadingFontChange(event.target.value)}
        />
        <Select
          label="Body font"
          options={FONT_OPTIONS}
          value={bodyFontValue}
          onChange={(event) => onBodyFontChange(event.target.value)}
        />
      </div>
      <Input
        label="Logo upload (preview only)"
        type="file"
        accept={LOGO_TYPES.join(',')}
        error={logoError ?? undefined}
        onChange={onLogoChange}
      />
      <p className="text-meta text-slate">
        Uploads stay in your browser. Use the generated snippets to update the real files.
      </p>
    </Card>
  )
}

const ThemePreview = ({
  primary,
  secondary,
  headingFont,
  bodyFont,
  logoPreview,
}: {
  primary: ColorOption
  secondary: ColorOption
  headingFont: FontOption
  bodyFont: FontOption
  logoPreview: string | null
}) => {
  return (
    <Card>
      <h2 className="text-h3 font-authority text-charcoal mb-4">Live preview</h2>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-lg border border-gray-200 bg-off-white flex items-center justify-center">
            {logoPreview ? (
              <img src={logoPreview} alt="Selected logo preview" className="max-h-12 max-w-12" />
            ) : (
              <span className="text-meta text-slate">Logo</span>
            )}
          </div>
          <span className={`text-meta font-semibold ${secondary.badgeClass}`}>Secondary accent</span>
        </div>
        <div>
          <h3 className={`text-h2 ${headingFont.className} text-charcoal mb-2`}>
            Preview your new brand tone
          </h3>
          <p className={`text-body ${bodyFont.className} text-slate`}>
            This sample card reflects your selected colors and fonts so you can iterate quickly.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button
            className={`px-6 py-3 text-white rounded-lg font-semibold transition-colors ${primary.buttonClass} ${primary.buttonHoverClass}`}
            type="button"
          >
            Primary action
          </button>
          <span className="text-meta text-slate">Secondary button uses outline styles in UI kit.</span>
        </div>
      </div>
    </Card>
  )
}

const ThemeExport = ({ tailwindSnippet, cssSnippet }: { tailwindSnippet: string; cssSnippet: string }) => {
  const [showSnippets, setShowSnippets] = useState(false)

  return (
    <Card>
      <h2 className="text-h3 font-authority text-charcoal mb-4">Export snippets</h2>
      <p className="text-body text-slate mb-4">
        Click below to generate copy-ready updates for your Tailwind config and CSS variables.
      </p>
      <Button
        type="button"
        onClick={() => setShowSnippets((previous) => !previous)}
        aria-expanded={showSnippets}
      >
        {showSnippets ? 'Hide snippets' : 'Generate snippets'}
      </Button>
      {showSnippets && (
        <div className="mt-6 grid gap-4">
          <div>
            <h3 className="text-body-lg font-semibold text-charcoal mb-2">tailwind.config.ts</h3>
            <pre className="bg-charcoal text-off-white p-4 rounded-lg text-meta overflow-auto">
              {tailwindSnippet}
            </pre>
          </div>
          <div>
            <h3 className="text-body-lg font-semibold text-charcoal mb-2">app/globals.css</h3>
            <pre className="bg-charcoal text-off-white p-4 rounded-lg text-meta overflow-auto">
              {cssSnippet}
            </pre>
          </div>
        </div>
      )}
    </Card>
  )
}

export default function ThemeEditorClient() {
  const [primaryValue, setPrimaryValue] = useState(DEFAULT_THEME.primary)
  const [secondaryValue, setSecondaryValue] = useState(DEFAULT_THEME.secondary)
  const [headingFontValue, setHeadingFontValue] = useState(DEFAULT_THEME.headingFont)
  const [bodyFontValue, setBodyFontValue] = useState(DEFAULT_THEME.bodyFont)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoError, setLogoError] = useState<string | null>(null)

  const primary = useMemo(
    () => resolveOption(COLOR_OPTIONS, primaryValue, DEFAULT_THEME.primary),
    [primaryValue]
  )
  const secondary = useMemo(
    () => resolveOption(COLOR_OPTIONS, secondaryValue, DEFAULT_THEME.secondary),
    [secondaryValue]
  )
  const headingFont = useMemo(
    () => resolveOption(FONT_OPTIONS, headingFontValue, DEFAULT_THEME.headingFont),
    [headingFontValue]
  )
  const bodyFont = useMemo(
    () => resolveOption(FONT_OPTIONS, bodyFontValue, DEFAULT_THEME.bodyFont),
    [bodyFontValue]
  )

  const tailwindSnippet = useMemo(
    () =>
      buildTailwindSnippet({
        primary,
        secondary,
        headingFont,
        bodyFont,
      }),
    [primary, secondary, headingFont, bodyFont]
  )

  const cssSnippet = useMemo(
    () => buildCssVariablesSnippet({ primary, secondary }),
    [primary, secondary]
  )

  const handleLogoChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      // Give a friendly nudge when the user clears the input.
      setLogoError('Select an image file to preview your logo.')
      setLogoPreview(null)
      return
    }

    if (!LOGO_TYPES.includes(file.type)) {
      setLogoError('Upload a PNG, JPEG, WebP, or SVG file.')
      setLogoPreview(null)
      return
    }

    if (file.size > MAX_LOGO_BYTES) {
      setLogoError('Logo files must be 2MB or smaller for smooth previews.')
      setLogoPreview(null)
      return
    }

    setLogoError(null)
    const previewUrl = URL.createObjectURL(file)
    setLogoPreview((previous) => {
      // Clean up prior previews to avoid leaking blob URLs during iteration.
      if (previous) {
        URL.revokeObjectURL(previous)
      }
      return previewUrl
    })
  }, [])

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview)
      }
    }
  }, [logoPreview])

  return (
    <Section className="bg-off-white">
      <Container>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-h1 font-authority text-charcoal mb-3">Theme editor</h1>
            <p className="text-body-lg text-slate">
              Use this development-only workspace to explore tokens without touching production styles.
            </p>
          </div>
          <ThemeControls
            primaryValue={primaryValue}
            secondaryValue={secondaryValue}
            headingFontValue={headingFontValue}
            bodyFontValue={bodyFontValue}
            logoError={logoError}
            onPrimaryChange={setPrimaryValue}
            onSecondaryChange={setSecondaryValue}
            onHeadingFontChange={setHeadingFontValue}
            onBodyFontChange={setBodyFontValue}
            onLogoChange={handleLogoChange}
          />
          <ThemePreview
            primary={primary}
            secondary={secondary}
            headingFont={headingFont}
            bodyFont={bodyFont}
            logoPreview={logoPreview}
          />
          <ThemeExport tailwindSnippet={tailwindSnippet} cssSnippet={cssSnippet} />
        </div>
      </Container>
    </Section>
  )
}
