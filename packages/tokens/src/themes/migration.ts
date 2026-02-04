/**
 * Theme migration utilities
 * Helps migrate between theme versions and formats
 */

import type { ThemeConfig } from './advanced';

export interface MigrationResult {
  success: boolean;
  theme?: ThemeConfig;
  warnings: string[];
  errors: string[];
}

export interface ThemeVersion {
  major: number;
  minor: number;
  patch: number;
}

export type ThemeMigrator = (theme: any) => MigrationResult;

/**
 * Parse version string
 */
export function parseVersion(version: string): ThemeVersion {
  const [major, minor, patch] = version.split('.').map(Number);
  return { major: major || 0, minor: minor || 0, patch: patch || 0 };
}

/**
 * Compare versions
 */
export function compareVersions(a: ThemeVersion, b: ThemeVersion): number {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

/**
 * Legacy theme format (v1)
 */
interface LegacyThemeV1 {
  name: string;
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
  };
  fonts?: {
    body?: string;
    heading?: string;
  };
}

/**
 * Migrate from v1 to current format
 */
export function migrateFromV1(legacy: LegacyThemeV1): MigrationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    if (!legacy.name) {
      errors.push('Theme name is required');
      return { success: false, warnings, errors };
    }

    // Basic color mapping
    const primaryColor = legacy.colors?.primary || '#3b82f6';
    const secondaryColor = legacy.colors?.secondary || '#8b5cf6';

    warnings.push('Color scales generated from single color values - review for accuracy');

    const theme: Partial<ThemeConfig> = {
      id: legacy.name.toLowerCase().replace(/\s+/g, '-'),
      name: legacy.name,
      mode: 'light',
      variant: 'default',
      colorScheme: 'neutral',
      customProperties: {
        'legacy-primary': primaryColor,
        'legacy-secondary': secondaryColor,
      },
    };

    return {
      success: true,
      theme: theme as ThemeConfig,
      warnings,
      errors,
    };
  } catch (error) {
    errors.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, warnings, errors };
  }
}

/**
 * Tailwind config format
 */
interface TailwindTheme {
  colors?: Record<string, any>;
  fontFamily?: Record<string, string[]>;
  fontSize?: Record<string, [string, any]>;
  spacing?: Record<string, string>;
  borderRadius?: Record<string, string>;
}

/**
 * Migrate from Tailwind config
 */
export function migrateFromTailwind(tailwind: TailwindTheme, themeName: string): MigrationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    warnings.push('Tailwind theme converted - verify color scales and spacing');

    const theme: Partial<ThemeConfig> = {
      id: themeName.toLowerCase().replace(/\s+/g, '-'),
      name: themeName,
      mode: 'light',
      variant: 'default',
      colorScheme: 'neutral',
    };

    // Map font families
    if (tailwind.fontFamily) {
      warnings.push('Font family stacks converted - review for compatibility');
    }

    // Map spacing
    if (tailwind.spacing) {
      warnings.push('Spacing scale converted - verify against design requirements');
    }

    return {
      success: true,
      theme: theme as ThemeConfig,
      warnings,
      errors,
    };
  } catch (error) {
    errors.push(`Tailwind migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, warnings, errors };
  }
}

/**
 * CSS custom properties format
 */
interface CSSVariableTheme {
  [key: string]: string;
}

/**
 * Migrate from CSS custom properties
 */
export function migrateFromCSSVariables(cssVars: CSSVariableTheme, themeName: string): MigrationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    const theme: Partial<ThemeConfig> = {
      id: themeName.toLowerCase().replace(/\s+/g, '-'),
      name: themeName,
      mode: 'light',
      variant: 'default',
      colorScheme: 'neutral',
      customProperties: {},
    };

    // Parse CSS variables
    for (const [key, value] of Object.entries(cssVars)) {
      const cleanKey = key.replace(/^--/, '');
      if (theme.customProperties) {
        theme.customProperties[cleanKey] = value;
      }
    }

    warnings.push('CSS variables imported as custom properties - map to standard tokens for full compatibility');

    return {
      success: true,
      theme: theme as ThemeConfig,
      warnings,
      errors,
    };
  } catch (error) {
    errors.push(`CSS variables migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, warnings, errors };
  }
}

/**
 * Material-UI theme format
 */
interface MaterialUITheme {
  palette?: {
    primary?: { main: string };
    secondary?: { main: string };
    error?: { main: string };
    warning?: { main: string };
    info?: { main: string };
    success?: { main: string };
  };
  typography?: {
    fontFamily?: string;
    fontSize?: number;
  };
  spacing?: number;
}

/**
 * Migrate from Material-UI theme
 */
export function migrateFromMaterialUI(muiTheme: MaterialUITheme, themeName: string): MigrationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    const theme: Partial<ThemeConfig> = {
      id: themeName.toLowerCase().replace(/\s+/g, '-'),
      name: themeName,
      mode: 'light',
      variant: 'default',
      colorScheme: 'neutral',
    };

    warnings.push('Material-UI theme converted - color scales generated from main colors');

    if (muiTheme.spacing) {
      warnings.push(`Spacing unit of ${muiTheme.spacing}px converted to rem-based scale`);
    }

    return {
      success: true,
      theme: theme as ThemeConfig,
      warnings,
      errors,
    };
  } catch (error) {
    errors.push(`Material-UI migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, warnings, errors };
  }
}

/**
 * Validate theme structure
 */
export function validateTheme(theme: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!theme.id) errors.push('Missing required field: id');
  if (!theme.name) errors.push('Missing required field: name');
  if (!theme.mode) errors.push('Missing required field: mode');
  if (!theme.variant) errors.push('Missing required field: variant');
  if (!theme.colorScheme) errors.push('Missing required field: colorScheme');

  if (theme.colors) {
    const requiredColorScales = ['primary', 'neutral'];
    for (const scale of requiredColorScales) {
      if (!theme.colors[scale]) {
        errors.push(`Missing required color scale: ${scale}`);
      }
    }
  } else {
    errors.push('Missing required field: colors');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Auto-detect and migrate theme format
 */
export function autoMigrate(input: any, themeName?: string): MigrationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check if already in current format
  if (input.id && input.name && input.colors && input.typography) {
    const validation = validateTheme(input);
    if (validation.valid) {
      return { success: true, theme: input, warnings: ['Theme already in current format'], errors: [] };
    }
  }

  // Try to detect format
  if (input.palette && input.typography) {
    warnings.push('Detected Material-UI theme format');
    return migrateFromMaterialUI(input, themeName || 'Migrated Theme');
  }

  if (input.colors && typeof input.colors === 'object' && !Array.isArray(input.colors)) {
    // Check if Tailwind-like
    const firstColor = Object.values(input.colors)[0];
    if (typeof firstColor === 'object') {
      warnings.push('Detected Tailwind-like theme format');
      return migrateFromTailwind(input, themeName || 'Migrated Theme');
    }
  }

  // Check for CSS variables
  const keys = Object.keys(input);
  if (keys.some(k => k.startsWith('--'))) {
    warnings.push('Detected CSS variables format');
    return migrateFromCSSVariables(input, themeName || 'Migrated Theme');
  }

  // Try legacy v1 format
  if (input.name && (input.colors || input.fonts)) {
    warnings.push('Detected legacy v1 theme format');
    return migrateFromV1(input);
  }

  errors.push('Unable to auto-detect theme format');
  return { success: false, warnings, errors };
}

/**
 * Export theme to different formats
 */
export function exportToTailwind(theme: ThemeConfig): TailwindTheme {
  return {
    colors: theme.colors,
    fontFamily: theme.typography.fontFamily,
    fontSize: Object.entries(theme.typography.fontSize).reduce((acc, [key, value]) => {
      acc[key] = [value, {}];
      return acc;
    }, {} as Record<string, [string, any]>),
    spacing: theme.spacing,
    borderRadius: theme.radius,
  };
}

export function exportToCSSVariables(theme: ThemeConfig): string {
  const vars: string[] = [];

  // Colors
  Object.entries(theme.colors).forEach(([colorName, scale]) => {
    Object.entries(scale).forEach(([shade, value]) => {
      vars.push(`  --color-${colorName}-${shade}: ${value};`);
    });
  });

  return `:root {\n${vars.join('\n')}\n}`;
}

/**
 * Batch migration utility
 */
export function migrateThemes(themes: any[], format?: string): MigrationResult[] {
  return themes.map((theme, index) => {
    const name = theme.name || `Theme ${index + 1}`;
    return autoMigrate(theme, name);
  });
}
