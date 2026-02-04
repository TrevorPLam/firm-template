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
 * Token validation and testing utilities
 * Ensures design tokens meet quality standards
 */

export interface ValidationRule {
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  validate: (value: any, context?: any) => ValidationResult;
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
  suggestion?: string;
}

export interface TokenValidationReport {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  info: ValidationIssue[];
  summary: {
    total: number;
    errors: number;
    warnings: number;
    info: number;
  };
}

export interface ValidationIssue {
  path: string;
  rule: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion?: string;
  value?: any;
}

/**
 * Color validation rules
 */
export const colorValidationRules: ValidationRule[] = [
  {
    name: 'validHexColor',
    description: 'Color must be a valid hex code',
    severity: 'error',
    validate: (value: string) => {
      if (typeof value !== 'string') {
        return { valid: false, message: 'Color must be a string' };
      }
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/;
      const valid = hexRegex.test(value) || value.startsWith('hsl') || value.startsWith('rgb');
      return {
        valid,
        message: valid ? undefined : 'Invalid color format',
        suggestion: 'Use hex (#RRGGBB), hsl(), or rgb() format',
      };
    },
  },
  {
    name: 'contrastRatio',
    description: 'Color combinations must meet WCAG contrast requirements',
    severity: 'warning',
    validate: (value: { foreground: string; background: string }) => {
      // Simplified contrast check - in production, use a proper contrast calculation library
      return {
        valid: true,
        message: 'Contrast ratio check requires color parsing - use external tool for validation',
      };
    },
  },
];

/**
 * Typography validation rules
 */
export const typographyValidationRules: ValidationRule[] = [
  {
    name: 'validFontSize',
    description: 'Font size must be valid CSS value',
    severity: 'error',
    validate: (value: string) => {
      const valid = /^(\d+\.?\d*)(px|rem|em|%)$/.test(value);
      return {
        valid,
        message: valid ? undefined : 'Invalid font size format',
        suggestion: 'Use px, rem, em, or % units',
      };
    },
  },
  {
    name: 'accessibleFontSize',
    description: 'Font size should be at least 12px for readability',
    severity: 'warning',
    validate: (value: string) => {
      const match = value.match(/^(\d+\.?\d*)(px|rem)$/);
      if (!match) return { valid: true };

      const [, size, unit] = match;
      const pxSize = unit === 'rem' ? parseFloat(size) * 16 : parseFloat(size);
      const valid = pxSize >= 12;

      return {
        valid,
        message: valid ? undefined : `Font size ${value} is smaller than 12px`,
        suggestion: 'Use at least 12px for body text',
      };
    },
  },
  {
    name: 'validFontWeight',
    description: 'Font weight must be valid',
    severity: 'error',
    validate: (value: number | string) => {
      const validWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
      const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
      const valid = validWeights.includes(numValue);

      return {
        valid,
        message: valid ? undefined : `Invalid font weight: ${value}`,
        suggestion: 'Use values: 100, 200, 300, 400, 500, 600, 700, 800, 900',
      };
    },
  },
];

/**
 * Spacing validation rules
 */
export const spacingValidationRules: ValidationRule[] = [
  {
    name: 'validSpacingValue',
    description: 'Spacing must be valid CSS value',
    severity: 'error',
    validate: (value: string) => {
      if (value === '0') return { valid: true };
      const valid = /^(\d+\.?\d*)(px|rem|em)$/.test(value);
      return {
        valid,
        message: valid ? undefined : 'Invalid spacing format',
        suggestion: 'Use px, rem, or em units',
      };
    },
  },
  {
    name: 'consistentSpacingScale',
    description: 'Spacing should follow a consistent scale',
    severity: 'info',
    validate: (value: string, context?: { previous?: string }) => {
      // Check if spacing follows 4px/0.25rem increments
      if (value === '0') return { valid: true };
      const match = value.match(/^(\d+\.?\d*)(px|rem)$/);
      if (!match) return { valid: true };

      const [, size, unit] = match;
      const pxSize = unit === 'rem' ? parseFloat(size) * 16 : parseFloat(size);
      const valid = pxSize % 4 === 0;

      return {
        valid,
        message: valid ? undefined : `Spacing ${value} doesn't follow 4px grid`,
        suggestion: 'Consider using 4px increments for consistency',
      };
    },
  },
];

/**
 * Motion validation rules
 */
export const motionValidationRules: ValidationRule[] = [
  {
    name: 'validDuration',
    description: 'Animation duration must be reasonable',
    severity: 'warning',
    validate: (value: number) => {
      const valid = value >= 0 && value <= 2000;
      return {
        valid,
        message: valid ? undefined : `Duration ${value}ms is outside recommended range`,
        suggestion: 'Use durations between 0-2000ms',
      };
    },
  },
  {
    name: 'validEasing',
    description: 'Easing function must be valid',
    severity: 'error',
    validate: (value: string) => {
      const validKeywords = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'];
      const isCubicBezier = /^cubic-bezier\([\d.,\s-]+\)$/.test(value);
      const valid = validKeywords.includes(value) || isCubicBezier;

      return {
        valid,
        message: valid ? undefined : 'Invalid easing function',
        suggestion: 'Use CSS easing keywords or cubic-bezier()',
      };
    },
  },
];

/**
 * Validate a single token value
 */
export function validateToken(
  path: string,
  value: any,
  rules: ValidationRule[],
  context?: any
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const rule of rules) {
    const result = rule.validate(value, context);
    if (!result.valid) {
      issues.push({
        path,
        rule: rule.name,
        severity: rule.severity,
        message: result.message || `${rule.name} validation failed`,
        suggestion: result.suggestion,
        value,
      });
    }
  }

  return issues;
}

/**
 * Validate an object of tokens
 */
export function validateTokens(
  tokens: Record<string, any>,
  rules: ValidationRule[],
  basePath: string = ''
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const [key, value] of Object.entries(tokens)) {
    const path = basePath ? `${basePath}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively validate nested objects
      issues.push(...validateTokens(value, rules, path));
    } else {
      // Validate leaf values
      issues.push(...validateToken(path, value, rules));
    }
  }

  return issues;
}

/**
 * Generate validation report
 */
export function generateValidationReport(issues: ValidationIssue[]): TokenValidationReport {
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const info = issues.filter((i) => i.severity === 'info');

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    info,
    summary: {
      total: issues.length,
      errors: errors.length,
      warnings: warnings.length,
      info: info.length,
    },
  };
}

/**
 * Validate theme configuration
 */
export function validateThemeTokens(theme: any): TokenValidationReport {
  const allIssues: ValidationIssue[] = [];

  // Validate colors
  if (theme.colors) {
    allIssues.push(...validateTokens(theme.colors, colorValidationRules, 'colors'));
  }

  // Validate typography
  if (theme.typography) {
    if (theme.typography.fontSize) {
      allIssues.push(...validateTokens(theme.typography.fontSize, typographyValidationRules, 'typography.fontSize'));
    }
    if (theme.typography.fontWeight) {
      allIssues.push(
        ...validateTokens(theme.typography.fontWeight, typographyValidationRules, 'typography.fontWeight')
      );
    }
  }

  // Validate spacing
  if (theme.spacing) {
    allIssues.push(...validateTokens(theme.spacing, spacingValidationRules, 'spacing'));
  }

  return generateValidationReport(allIssues);
}

/**
 * Test token accessibility
 */
export function testTokenAccessibility(theme: any): {
  passed: boolean;
  tests: Array<{ name: string; passed: boolean; message: string }>;
} {
  const tests = [];

  // Test minimum touch target size (44x44 dp recommended)
  tests.push({
    name: 'Touch Target Size',
    passed: true,
    message: 'Manual verification required for interactive element sizes',
  });

  // Test color contrast (requires actual contrast calculation)
  tests.push({
    name: 'Color Contrast',
    passed: true,
    message: 'Use a contrast checker tool for accurate WCAG compliance',
  });

  // Test font size minimums
  let minFontSizePassed = true;
  if (theme.typography?.fontSize) {
    for (const size of Object.values(theme.typography.fontSize)) {
      if (typeof size === 'string') {
        const match = size.match(/^(\d+\.?\d*)(px|rem)$/);
        if (match) {
          const [, sizeValue, unit] = match;
          const pxSize = unit === 'rem' ? parseFloat(sizeValue) * 16 : parseFloat(sizeValue);
          if (pxSize < 12) {
            minFontSizePassed = false;
            break;
          }
        }
      }
    }
  }

  tests.push({
    name: 'Minimum Font Size',
    passed: minFontSizePassed,
    message: minFontSizePassed ? 'All font sizes meet 12px minimum' : 'Some font sizes are below 12px',
  });

  return {
    passed: tests.every((t) => t.passed),
    tests,
  };
}

/**
 * Format validation report for console output
 */
export function formatValidationReport(report: TokenValidationReport): string {
  const lines: string[] = [];

  lines.push('Token Validation Report');
  lines.push('='.repeat(50));
  lines.push('');
  lines.push(`Status: ${report.valid ? '✓ VALID' : '✗ INVALID'}`);
  lines.push(`Total Issues: ${report.summary.total}`);
  lines.push(`  Errors: ${report.summary.errors}`);
  lines.push(`  Warnings: ${report.summary.warnings}`);
  lines.push(`  Info: ${report.summary.info}`);
  lines.push('');

  if (report.errors.length > 0) {
    lines.push('Errors:');
    lines.push('-'.repeat(50));
    for (const issue of report.errors) {
      lines.push(`  ✗ ${issue.path}`);
      lines.push(`    ${issue.message}`);
      if (issue.suggestion) {
        lines.push(`    💡 ${issue.suggestion}`);
      }
      lines.push('');
    }
  }

  if (report.warnings.length > 0) {
    lines.push('Warnings:');
    lines.push('-'.repeat(50));
    for (const issue of report.warnings) {
      lines.push(`  ⚠ ${issue.path}`);
      lines.push(`    ${issue.message}`);
      if (issue.suggestion) {
        lines.push(`    💡 ${issue.suggestion}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}
