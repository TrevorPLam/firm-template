// AI-META-BEGIN
// 
// AI-META: Shared package module
// OWNERSHIP: packages/tokens
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

/**
 * Advanced theming system with variants and modes
 * Supports multi-tenant theming, dark mode, and dynamic theme switching
 */

export type ColorMode = 'light' | 'dark' | 'auto';
export type ThemeVariant = 'default' | 'compact' | 'comfortable' | 'spacious';
export type ColorScheme = 'neutral' | 'warm' | 'cool' | 'vibrant';

export interface ThemeColor {
  h: number;
  s: number;
  l: number;
  a?: number;
}

export interface ThemeColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface ThemeColors {
  primary: ThemeColorScale;
  secondary: ThemeColorScale;
  accent: ThemeColorScale;
  neutral: ThemeColorScale;
  success: ThemeColorScale;
  warning: ThemeColorScale;
  error: ThemeColorScale;
  info: ThemeColorScale;
}

export interface ThemeTypography {
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
    display: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    none: number;
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
  };
}

export interface ThemeSpacing {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
  32: string;
  40: string;
  48: string;
  56: string;
  64: string;
}

export interface ThemeRadius {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface ThemeShadow {
  xs: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description?: string;
  mode: ColorMode;
  variant: ThemeVariant;
  colorScheme: ColorScheme;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  shadow: ThemeShadow;
  customProperties?: Record<string, string | number>;
}

/**
 * Base spacing scale (applies to all variants)
 */
const baseSpacing: ThemeSpacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
};

/**
 * Spacing variant multipliers
 */
const spacingMultipliers: Record<ThemeVariant, number> = {
  default: 1,
  compact: 0.75,
  comfortable: 1,
  spacious: 1.25,
};

/**
 * Get scaled spacing for a variant
 */
export function getScaledSpacing(variant: ThemeVariant): ThemeSpacing {
  const multiplier = spacingMultipliers[variant];
  const scaled = {} as ThemeSpacing;

  for (const [key, value] of Object.entries(baseSpacing)) {
    if (value === '0') {
      scaled[key as keyof ThemeSpacing] = '0';
    } else {
      const numValue = parseFloat(value);
      const unit = value.replace(numValue.toString(), '');
      scaled[key as keyof ThemeSpacing] = `${numValue * multiplier}${unit}`;
    }
  }

  return scaled;
}

/**
 * Generate color scale from base hue
 */
export function generateColorScale(hue: number, saturation: number = 60): ThemeColorScale {
  return {
    50: `hsl(${hue}, ${saturation * 0.9}%, 97%)`,
    100: `hsl(${hue}, ${saturation * 0.95}%, 94%)`,
    200: `hsl(${hue}, ${saturation}%, 86%)`,
    300: `hsl(${hue}, ${saturation}%, 77%)`,
    400: `hsl(${hue}, ${saturation}%, 65%)`,
    500: `hsl(${hue}, ${saturation}%, 50%)`,
    600: `hsl(${hue}, ${saturation}%, 45%)`,
    700: `hsl(${hue}, ${saturation}%, 38%)`,
    800: `hsl(${hue}, ${saturation * 0.9}%, 28%)`,
    900: `hsl(${hue}, ${saturation * 0.85}%, 18%)`,
    950: `hsl(${hue}, ${saturation * 0.8}%, 10%)`,
  };
}

/**
 * Color scheme configurations
 */
const colorSchemeConfigs: Record<ColorScheme, { primaryHue: number; accentHue: number }> = {
  neutral: { primaryHue: 210, accentHue: 210 },
  warm: { primaryHue: 25, accentHue: 340 },
  cool: { primaryHue: 200, accentHue: 280 },
  vibrant: { primaryHue: 260, accentHue: 340 },
};

/**
 * Create theme configuration
 */
export function createTheme(config: Partial<ThemeConfig> & { id: string; name: string }): ThemeConfig {
  const mode = config.mode || 'light';
  const variant = config.variant || 'default';
  const colorScheme = config.colorScheme || 'neutral';
  const schemeConfig = colorSchemeConfigs[colorScheme];

  return {
    id: config.id,
    name: config.name,
    description: config.description,
    mode,
    variant,
    colorScheme,
    colors: config.colors || {
      primary: generateColorScale(schemeConfig.primaryHue, 60),
      secondary: generateColorScale(schemeConfig.primaryHue + 30, 50),
      accent: generateColorScale(schemeConfig.accentHue, 70),
      neutral: generateColorScale(210, 10),
      success: generateColorScale(142, 60),
      warning: generateColorScale(38, 90),
      error: generateColorScale(0, 70),
      info: generateColorScale(200, 60),
    },
    typography: config.typography || {
      fontFamily: {
        sans: 'system-ui, -apple-system, sans-serif',
        serif: 'Georgia, Cambria, serif',
        mono: 'Consolas, Monaco, monospace',
        display: 'system-ui, -apple-system, sans-serif',
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        none: 1,
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
        loose: 2,
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
      },
    },
    spacing: config.spacing || getScaledSpacing(variant),
    radius: config.radius || {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },
    shadow: config.shadow || {
      xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      base: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      none: 'none',
    },
    customProperties: config.customProperties,
  };
}

/**
 * Convert theme to CSS custom properties
 */
export function themeToCssVariables(theme: ThemeConfig, prefix: string = '--theme'): Record<string, string> {
  const vars: Record<string, string> = {};

  // Colors
  Object.entries(theme.colors).forEach(([colorName, scale]) => {
    Object.entries(scale).forEach(([shade, value]) => {
      vars[`${prefix}-color-${colorName}-${shade}`] = value;
    });
  });

  // Typography
  Object.entries(theme.typography.fontFamily).forEach(([name, value]) => {
    vars[`${prefix}-font-${name}`] = value;
  });
  Object.entries(theme.typography.fontSize).forEach(([name, value]) => {
    vars[`${prefix}-text-${name}`] = value;
  });
  Object.entries(theme.typography.fontWeight).forEach(([name, value]) => {
    vars[`${prefix}-font-weight-${name}`] = value.toString();
  });

  // Spacing
  Object.entries(theme.spacing).forEach(([name, value]) => {
    vars[`${prefix}-spacing-${name}`] = value;
  });

  // Radius
  Object.entries(theme.radius).forEach(([name, value]) => {
    vars[`${prefix}-radius-${name}`] = value;
  });

  // Shadow
  Object.entries(theme.shadow).forEach(([name, value]) => {
    vars[`${prefix}-shadow-${name}`] = value;
  });

  // Custom properties
  if (theme.customProperties) {
    Object.entries(theme.customProperties).forEach(([name, value]) => {
      vars[`${prefix}-${name}`] = value.toString();
    });
  }

  return vars;
}

/**
 * Generate CSS string from theme
 */
export function generateThemeCss(theme: ThemeConfig, selector: string = ':root'): string {
  const vars = themeToCssVariables(theme);
  const entries = Object.entries(vars).map(([key, value]) => `  ${key}: ${value};`);

  return `${selector} {
${entries.join('\n')}
}`;
}

/**
 * Merge theme configurations
 */
export function mergeThemes(base: ThemeConfig, override: Partial<ThemeConfig>): ThemeConfig {
  return {
    ...base,
    ...override,
    colors: { ...base.colors, ...override.colors },
    typography: { ...base.typography, ...override.typography },
    spacing: { ...base.spacing, ...override.spacing },
    radius: { ...base.radius, ...override.radius },
    shadow: { ...base.shadow, ...override.shadow },
    customProperties: { ...base.customProperties, ...override.customProperties },
  };
}

/**
 * Multi-tenant theme registry
 */
export class ThemeRegistry {
  private themes = new Map<string, ThemeConfig>();

  register(theme: ThemeConfig): void {
    this.themes.set(theme.id, theme);
  }

  get(id: string): ThemeConfig | undefined {
    return this.themes.get(id);
  }

  getAll(): ThemeConfig[] {
    return Array.from(this.themes.values());
  }

  has(id: string): boolean {
    return this.themes.has(id);
  }

  remove(id: string): boolean {
    return this.themes.delete(id);
  }

  clear(): void {
    this.themes.clear();
  }
}

/**
 * Global theme registry instance
 */
export const themeRegistry = new ThemeRegistry();
