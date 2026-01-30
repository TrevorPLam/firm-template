import type { Config } from 'tailwindcss'

/**
 * Tailwind theme maps to design tokens (CSS variables) from @repo/tokens.
 * Single source of truth: tokens drive colors, spacing, radius.
 * @see docs/PLATFORM.md
 */
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/patterns/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Semantic tokens – map to @repo/tokens themes */
        background: 'var(--color-background)',
        'background-alt': 'var(--color-background-alt)',
        foreground: 'var(--color-foreground)',
        'foreground-muted': 'var(--color-foreground-muted)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          light: 'var(--color-primary-light)',
          foreground: 'var(--color-primary-foreground)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          muted: 'var(--color-border-muted)',
        },
        /* Legacy aliases (tokens define these from semantic vars) */
        charcoal: 'var(--charcoal)',
        'off-white': 'var(--off-white)',
        slate: 'var(--slate)',
        teal: {
          DEFAULT: 'var(--teal)',
          dark: 'var(--teal-dark)',
          light: 'var(--teal-light)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-heading)'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
      },
    },
  },
  plugins: [],
}

export default config
