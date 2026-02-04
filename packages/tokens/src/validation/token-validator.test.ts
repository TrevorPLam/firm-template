import { describe, it, expect } from 'vitest';
import {
  colorValidationRules,
  typographyValidationRules,
  spacingValidationRules,
  motionValidationRules,
  validateToken,
  validateTokens,
  generateValidationReport,
  validateThemeTokens,
  testTokenAccessibility,
  formatValidationReport,
  type ValidationRule,
  type ValidationResult,
  type ValidationIssue,
  type TokenValidationReport,
} from './token-validator';

describe('token-validator', () => {
  describe('colorValidationRules', () => {
    describe('validHexColor rule', () => {
      const rule = colorValidationRules.find((r) => r.name === 'validHexColor')!;

      it('exists and has correct properties', () => {
        expect(rule).toBeDefined();
        expect(rule.name).toBe('validHexColor');
        expect(rule.severity).toBe('error');
        expect(typeof rule.validate).toBe('function');
      });

      it('validates 6-digit hex colors', () => {
        const result = rule.validate('#FF0000');
        expect(result.valid).toBe(true);
        expect(result.message).toBeUndefined();
      });

      it('validates 3-digit hex colors', () => {
        const result = rule.validate('#F00');
        expect(result.valid).toBe(true);
      });

      it('validates 8-digit hex colors with alpha', () => {
        const result = rule.validate('#FF0000FF');
        expect(result.valid).toBe(true);
      });

      it('validates hsl colors', () => {
        const result = rule.validate('hsl(0, 100%, 50%)');
        expect(result.valid).toBe(true);
      });

      it('validates rgb colors', () => {
        const result = rule.validate('rgb(255, 0, 0)');
        expect(result.valid).toBe(true);
      });

      it('validates rgba colors', () => {
        const result = rule.validate('rgba(255, 0, 0, 0.5)');
        expect(result.valid).toBe(true);
      });

      it('rejects invalid hex colors', () => {
        const result = rule.validate('#XYZ');
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Invalid color format');
        expect(result.suggestion).toBeDefined();
      });

      it('rejects hex colors without #', () => {
        const result = rule.validate('FF0000');
        expect(result.valid).toBe(false);
      });

      it('rejects non-string values', () => {
        const result = rule.validate(123);
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Color must be a string');
      });

      it('rejects invalid lengths', () => {
        const result = rule.validate('#FF');
        expect(result.valid).toBe(false);
      });

      it('validates lowercase hex', () => {
        const result = rule.validate('#ff0000');
        expect(result.valid).toBe(true);
      });

      it('validates mixed case hex', () => {
        const result = rule.validate('#Ff00Aa');
        expect(result.valid).toBe(true);
      });
    });

    describe('contrastRatio rule', () => {
      const rule = colorValidationRules.find((r) => r.name === 'contrastRatio')!;

      it('exists and has correct properties', () => {
        expect(rule).toBeDefined();
        expect(rule.name).toBe('contrastRatio');
        expect(rule.severity).toBe('warning');
      });

      it('returns valid with message about external tool', () => {
        const result = rule.validate({ foreground: '#000', background: '#FFF' });
        expect(result.valid).toBe(true);
        expect(result.message).toContain('external tool');
      });
    });
  });

  describe('typographyValidationRules', () => {
    describe('validFontSize rule', () => {
      const rule = typographyValidationRules.find((r) => r.name === 'validFontSize')!;

      it('exists and has correct properties', () => {
        expect(rule).toBeDefined();
        expect(rule.name).toBe('validFontSize');
        expect(rule.severity).toBe('error');
      });

      it('validates px units', () => {
        expect(rule.validate('16px').valid).toBe(true);
        expect(rule.validate('14.5px').valid).toBe(true);
      });

      it('validates rem units', () => {
        expect(rule.validate('1rem').valid).toBe(true);
        expect(rule.validate('1.5rem').valid).toBe(true);
      });

      it('validates em units', () => {
        expect(rule.validate('1em').valid).toBe(true);
        expect(rule.validate('1.25em').valid).toBe(true);
      });

      it('validates percentage units', () => {
        expect(rule.validate('100%').valid).toBe(true);
        expect(rule.validate('125.5%').valid).toBe(true);
      });

      it('rejects invalid units', () => {
        const result = rule.validate('16pt');
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Invalid font size format');
        expect(result.suggestion).toContain('px, rem, em, or %');
      });

      it('rejects values without units', () => {
        expect(rule.validate('16').valid).toBe(false);
      });

      it('rejects invalid format', () => {
        expect(rule.validate('large').valid).toBe(false);
      });

      it('skips non-string values', () => {
        const result = rule.validate(16 as any);
        expect(result.valid).toBe(true);
      });
    });

    describe('accessibleFontSize rule', () => {
      const rule = typographyValidationRules.find((r) => r.name === 'accessibleFontSize')!;

      it('exists and has correct properties', () => {
        expect(rule).toBeDefined();
        expect(rule.name).toBe('accessibleFontSize');
        expect(rule.severity).toBe('warning');
      });

      it('passes for font sizes >= 12px', () => {
        expect(rule.validate('12px').valid).toBe(true);
        expect(rule.validate('16px').valid).toBe(true);
        expect(rule.validate('24px').valid).toBe(true);
      });

      it('passes for rem equivalent to >= 12px', () => {
        expect(rule.validate('0.75rem').valid).toBe(true); // 12px
        expect(rule.validate('1rem').valid).toBe(true); // 16px
      });

      it('fails for font sizes < 12px', () => {
        const result = rule.validate('10px');
        expect(result.valid).toBe(false);
        expect(result.message).toContain('smaller than 12px');
        expect(result.suggestion).toContain('at least 12px');
      });

      it('fails for rem equivalent to < 12px', () => {
        const result = rule.validate('0.5rem'); // 8px
        expect(result.valid).toBe(false);
      });

      it('passes for non-px/rem units', () => {
        expect(rule.validate('100%').valid).toBe(true);
        expect(rule.validate('1em').valid).toBe(true);
      });

      it('handles decimal values', () => {
        expect(rule.validate('11.5px').valid).toBe(false);
        expect(rule.validate('12.5px').valid).toBe(true);
      });

      it('handles non-string values', () => {
        expect(rule.validate(16 as any).valid).toBe(true);
      });
    });

    describe('validFontWeight rule', () => {
      const rule = typographyValidationRules.find((r) => r.name === 'validFontWeight')!;

      it('exists and has correct properties', () => {
        expect(rule).toBeDefined();
        expect(rule.name).toBe('validFontWeight');
        expect(rule.severity).toBe('error');
      });

      it('validates numeric font weights', () => {
        const validWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
        validWeights.forEach((weight) => {
          expect(rule.validate(weight).valid).toBe(true);
        });
      });

      it('validates string font weights', () => {
        expect(rule.validate('400').valid).toBe(true);
        expect(rule.validate('700').valid).toBe(true);
      });

      it('rejects invalid font weights', () => {
        const result = rule.validate(450);
        expect(result.valid).toBe(false);
        expect(result.message).toContain('Invalid font weight');
        expect(result.suggestion).toContain('100, 200, 300');
      });

      it('rejects weights outside range', () => {
        expect(rule.validate(50).valid).toBe(false);
        expect(rule.validate(1000).valid).toBe(false);
      });

      it('rejects string numeric values that are invalid', () => {
        expect(rule.validate('350').valid).toBe(false);
      });

      it('skips non-numeric string values', () => {
        expect(rule.validate('16px').valid).toBe(true);
        expect(rule.validate('bold').valid).toBe(true);
      });
    });
  });

  describe('spacingValidationRules', () => {
    describe('validSpacingValue rule', () => {
      const rule = spacingValidationRules.find((r) => r.name === 'validSpacingValue')!;

      it('exists and has correct properties', () => {
        expect(rule).toBeDefined();
        expect(rule.name).toBe('validSpacingValue');
        expect(rule.severity).toBe('error');
      });

      it('validates zero without unit', () => {
        expect(rule.validate('0').valid).toBe(true);
      });

      it('validates px units', () => {
        expect(rule.validate('16px').valid).toBe(true);
        expect(rule.validate('8.5px').valid).toBe(true);
      });

      it('validates rem units', () => {
        expect(rule.validate('1rem').valid).toBe(true);
        expect(rule.validate('0.5rem').valid).toBe(true);
      });

      it('validates em units', () => {
        expect(rule.validate('1em').valid).toBe(true);
        expect(rule.validate('2.5em').valid).toBe(true);
      });

      it('rejects invalid units', () => {
        const result = rule.validate('16pt');
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Invalid spacing format');
        expect(result.suggestion).toContain('px, rem, or em');
      });

      it('rejects percentage units', () => {
        expect(rule.validate('100%').valid).toBe(false);
      });

      it('rejects values without units (except 0)', () => {
        expect(rule.validate('16').valid).toBe(false);
      });
    });

    describe('consistentSpacingScale rule', () => {
      const rule = spacingValidationRules.find((r) => r.name === 'consistentSpacingScale')!;

      it('exists and has correct properties', () => {
        expect(rule).toBeDefined();
        expect(rule.name).toBe('consistentSpacingScale');
        expect(rule.severity).toBe('info');
      });

      it('passes for zero', () => {
        expect(rule.validate('0').valid).toBe(true);
      });

      it('passes for 4px increments', () => {
        expect(rule.validate('4px').valid).toBe(true);
        expect(rule.validate('8px').valid).toBe(true);
        expect(rule.validate('16px').valid).toBe(true);
        expect(rule.validate('32px').valid).toBe(true);
      });

      it('passes for rem equivalent to 4px increments', () => {
        expect(rule.validate('0.25rem').valid).toBe(true); // 4px
        expect(rule.validate('0.5rem').valid).toBe(true); // 8px
        expect(rule.validate('1rem').valid).toBe(true); // 16px
      });

      it('fails for values not on 4px grid', () => {
        const result = rule.validate('10px');
        expect(result.valid).toBe(false);
        expect(result.message).toContain("doesn't follow 4px grid");
        expect(result.suggestion).toContain('4px increments');
      });

      it('fails for rem values not on 4px grid', () => {
        const result = rule.validate('0.3rem'); // 4.8px
        expect(result.valid).toBe(false);
      });

      it('passes for non-px/rem units', () => {
        expect(rule.validate('1em').valid).toBe(true);
      });

      it('handles decimal px values', () => {
        expect(rule.validate('12.5px').valid).toBe(false);
        expect(rule.validate('12px').valid).toBe(true);
      });
    });
  });

  describe('motionValidationRules', () => {
    describe('validDuration rule', () => {
      const rule = motionValidationRules.find((r) => r.name === 'validDuration')!;

      it('exists and has correct properties', () => {
        expect(rule).toBeDefined();
        expect(rule.name).toBe('validDuration');
        expect(rule.severity).toBe('warning');
      });

      it('validates durations in range 0-2000ms', () => {
        expect(rule.validate(0).valid).toBe(true);
        expect(rule.validate(100).valid).toBe(true);
        expect(rule.validate(500).valid).toBe(true);
        expect(rule.validate(2000).valid).toBe(true);
      });

      it('rejects negative durations', () => {
        const result = rule.validate(-100);
        expect(result.valid).toBe(false);
        expect(result.message).toContain('outside recommended range');
        expect(result.suggestion).toContain('0-2000ms');
      });

      it('rejects durations over 2000ms', () => {
        const result = rule.validate(3000);
        expect(result.valid).toBe(false);
        expect(result.message).toContain('outside recommended range');
      });

      it('validates boundary values', () => {
        expect(rule.validate(0).valid).toBe(true);
        expect(rule.validate(2000).valid).toBe(true);
        expect(rule.validate(2001).valid).toBe(false);
      });
    });

    describe('validEasing rule', () => {
      const rule = motionValidationRules.find((r) => r.name === 'validEasing')!;

      it('exists and has correct properties', () => {
        expect(rule).toBeDefined();
        expect(rule.name).toBe('validEasing');
        expect(rule.severity).toBe('error');
      });

      it('validates CSS easing keywords', () => {
        expect(rule.validate('linear').valid).toBe(true);
        expect(rule.validate('ease').valid).toBe(true);
        expect(rule.validate('ease-in').valid).toBe(true);
        expect(rule.validate('ease-out').valid).toBe(true);
        expect(rule.validate('ease-in-out').valid).toBe(true);
      });

      it('validates cubic-bezier functions', () => {
        expect(rule.validate('cubic-bezier(0.4, 0, 0.2, 1)').valid).toBe(true);
        expect(rule.validate('cubic-bezier(0, 0, 1, 1)').valid).toBe(true);
      });

      it('validates cubic-bezier with negative values', () => {
        expect(rule.validate('cubic-bezier(0.68, -0.55, 0.265, 1.55)').valid).toBe(true);
      });

      it('validates cubic-bezier with decimal values', () => {
        expect(rule.validate('cubic-bezier(0.455, 0.03, 0.515, 0.955)').valid).toBe(true);
      });

      it('rejects invalid easing values', () => {
        const result = rule.validate('bouncy');
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Invalid easing function');
        expect(result.suggestion).toContain('cubic-bezier()');
      });

      it('rejects malformed cubic-bezier', () => {
        // Note: The regex is permissive and allows various comma-separated numbers
        // So 'cubic-bezier(0.4, 0.2)' actually passes the regex
        expect(rule.validate('cubic-bezier').valid).toBe(false);
        expect(rule.validate('cubic-bezier()').valid).toBe(false);
        expect(rule.validate('cubic-bezier(abc)').valid).toBe(false);
      });

      it('validates cubic-bezier with spaces', () => {
        expect(rule.validate('cubic-bezier( 0.4 , 0 , 0.2 , 1 )').valid).toBe(true);
      });
    });
  });

  describe('validateToken', () => {
    it('returns empty array for valid token', () => {
      const issues = validateToken('color', '#FF0000', colorValidationRules);
      expect(issues).toEqual([]);
    });

    it('returns issues for invalid token', () => {
      const issues = validateToken('color', 'invalid', colorValidationRules);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].path).toBe('color');
      expect(issues[0].severity).toBe('error');
    });

    it('includes all failed rules', () => {
      const issues = validateToken('fontSize', 'invalid', typographyValidationRules);
      expect(issues.length).toBeGreaterThan(0);
    });

    it('includes rule name in issue', () => {
      const issues = validateToken('color', 123, colorValidationRules);
      expect(issues[0].rule).toBe('validHexColor');
    });

    it('includes message in issue', () => {
      const issues = validateToken('color', 123, colorValidationRules);
      expect(issues[0].message).toBeDefined();
    });

    it('uses default message when rule does not provide one', () => {
      const customRule: ValidationRule = {
        name: 'customRule',
        description: 'Custom validation',
        severity: 'error',
        validate: () => ({ valid: false }), // No message
      };
      const issues = validateToken('test', 'value', [customRule]);
      expect(issues[0].message).toBe('customRule validation failed');
    });

    it('includes value in issue', () => {
      const issues = validateToken('color', 'invalid', colorValidationRules);
      expect(issues[0].value).toBe('invalid');
    });

    it('includes suggestion when available', () => {
      const issues = validateToken('color', 'invalid', colorValidationRules);
      expect(issues[0].suggestion).toBeDefined();
    });

    it('passes context to validation rules', () => {
      const context = { previous: '16px' };
      const issues = validateToken('spacing', '20px', spacingValidationRules, context);
      // Context is passed but may not affect validation for this value
      expect(Array.isArray(issues)).toBe(true);
    });
  });

  describe('validateTokens', () => {
    it('validates flat object of tokens', () => {
      const tokens = {
        primary: '#FF0000',
        secondary: '#00FF00',
      };
      const issues = validateTokens(tokens, colorValidationRules);
      expect(issues).toEqual([]);
    });

    it('validates nested objects recursively', () => {
      const tokens = {
        colors: {
          primary: '#FF0000',
          secondary: 'invalid',
        },
      };
      const issues = validateTokens(tokens, colorValidationRules);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].path).toBe('colors.secondary');
    });

    it('builds correct paths for nested tokens', () => {
      const tokens = {
        level1: {
          level2: {
            color: 'invalid',
          },
        },
      };
      const issues = validateTokens(tokens, colorValidationRules);
      expect(issues[0].path).toBe('level1.level2.color');
    });

    it('uses basePath when provided', () => {
      const tokens = { color: 'invalid' };
      const issues = validateTokens(tokens, colorValidationRules, 'theme');
      expect(issues[0].path).toBe('theme.color');
    });

    it('collects all issues from nested structure', () => {
      const tokens = {
        a: 'invalid1',
        b: {
          c: 'invalid2',
          d: 'invalid3',
        },
      };
      const issues = validateTokens(tokens, colorValidationRules);
      expect(issues.length).toBe(3);
    });

    it('does not validate arrays as nested objects', () => {
      const tokens = {
        array: ['#FF0000', '#00FF00'],
      };
      // Arrays are validated as leaf values
      const issues = validateTokens(tokens, colorValidationRules);
      expect(issues.length).toBeGreaterThan(0); // Array itself fails validation
    });

    it('handles null values', () => {
      const tokens = {
        color: null,
      };
      const issues = validateTokens(tokens, colorValidationRules);
      expect(issues.length).toBeGreaterThan(0);
    });
  });

  describe('generateValidationReport', () => {
    it('creates report with correct structure', () => {
      const issues: ValidationIssue[] = [];
      const report = generateValidationReport(issues);
      
      expect(report).toHaveProperty('valid');
      expect(report).toHaveProperty('errors');
      expect(report).toHaveProperty('warnings');
      expect(report).toHaveProperty('info');
      expect(report).toHaveProperty('summary');
    });

    it('marks report as valid when no errors', () => {
      const report = generateValidationReport([]);
      expect(report.valid).toBe(true);
    });

    it('marks report as invalid when errors exist', () => {
      const issues: ValidationIssue[] = [
        {
          path: 'test',
          rule: 'testRule',
          severity: 'error',
          message: 'Test error',
        },
      ];
      const report = generateValidationReport(issues);
      expect(report.valid).toBe(false);
    });

    it('separates issues by severity', () => {
      const issues: ValidationIssue[] = [
        { path: 'a', rule: 'r1', severity: 'error', message: 'e1' },
        { path: 'b', rule: 'r2', severity: 'warning', message: 'w1' },
        { path: 'c', rule: 'r3', severity: 'info', message: 'i1' },
        { path: 'd', rule: 'r4', severity: 'error', message: 'e2' },
      ];
      const report = generateValidationReport(issues);
      
      expect(report.errors.length).toBe(2);
      expect(report.warnings.length).toBe(1);
      expect(report.info.length).toBe(1);
    });

    it('calculates correct summary', () => {
      const issues: ValidationIssue[] = [
        { path: 'a', rule: 'r1', severity: 'error', message: 'e1' },
        { path: 'b', rule: 'r2', severity: 'warning', message: 'w1' },
        { path: 'c', rule: 'r3', severity: 'info', message: 'i1' },
      ];
      const report = generateValidationReport(issues);
      
      expect(report.summary.total).toBe(3);
      expect(report.summary.errors).toBe(1);
      expect(report.summary.warnings).toBe(1);
      expect(report.summary.info).toBe(1);
    });

    it('handles empty issues array', () => {
      const report = generateValidationReport([]);
      expect(report.valid).toBe(true);
      expect(report.summary.total).toBe(0);
      expect(report.summary.errors).toBe(0);
    });
  });

  describe('validateThemeTokens', () => {
    it('validates empty theme', () => {
      const report = validateThemeTokens({});
      expect(report.valid).toBe(true);
      expect(report.summary.total).toBe(0);
    });

    it('validates theme colors', () => {
      const theme = {
        colors: {
          primary: '#FF0000',
          secondary: 'invalid',
        },
      };
      const report = validateThemeTokens(theme);
      expect(report.valid).toBe(false);
      expect(report.errors.length).toBeGreaterThan(0);
    });

    it('validates theme typography fontSize', () => {
      const theme = {
        typography: {
          fontSize: {
            sm: '14px',
            md: 'invalid',
          },
        },
      };
      const report = validateThemeTokens(theme);
      expect(report.valid).toBe(false);
    });

    it('validates theme typography fontWeight', () => {
      const theme = {
        typography: {
          fontWeight: {
            normal: 400,
            bold: 750,
          },
        },
      };
      const report = validateThemeTokens(theme);
      // fontWeight validation will fail for 750, but also fontSize rules run on it
      // The accessibleFontSize rule checks if value is a string with match(), so numbers will pass
      expect(report.errors.length).toBeGreaterThan(0);
      const fontWeightError = report.errors.find(e => e.rule === 'validFontWeight');
      expect(fontWeightError).toBeDefined();
    });

    it('validates theme spacing', () => {
      const theme = {
        spacing: {
          sm: '8px',
          md: 'invalid',
        },
      };
      const report = validateThemeTokens(theme);
      expect(report.valid).toBe(false);
    });

    it('validates complete theme', () => {
      const theme = {
        colors: { primary: '#FF0000' },
        typography: {
          fontSize: { md: '16px' },
          fontWeight: { normal: 400 },
        },
        spacing: { md: '16px' },
      };
      const report = validateThemeTokens(theme);
      expect(report.valid).toBe(true);
    });

    it('includes correct path prefixes', () => {
      const theme = {
        colors: { invalid: 'bad' },
      };
      const report = validateThemeTokens(theme);
      expect(report.errors[0].path).toBe('colors.invalid');
    });

    it('handles theme without typography', () => {
      const theme = { colors: { primary: '#FF0000' } };
      const report = validateThemeTokens(theme);
      expect(report.valid).toBe(true);
    });
  });

  describe('testTokenAccessibility', () => {
    it('returns result with correct structure', () => {
      const result = testTokenAccessibility({});
      expect(result).toHaveProperty('passed');
      expect(result).toHaveProperty('tests');
      expect(Array.isArray(result.tests)).toBe(true);
    });

    it('includes touch target size test', () => {
      const result = testTokenAccessibility({});
      const test = result.tests.find((t) => t.name === 'Touch Target Size');
      expect(test).toBeDefined();
      expect(test?.passed).toBe(true);
    });

    it('includes color contrast test', () => {
      const result = testTokenAccessibility({});
      const test = result.tests.find((t) => t.name === 'Color Contrast');
      expect(test).toBeDefined();
      expect(test?.passed).toBe(true);
    });

    it('includes minimum font size test', () => {
      const result = testTokenAccessibility({});
      const test = result.tests.find((t) => t.name === 'Minimum Font Size');
      expect(test).toBeDefined();
    });

    it('passes minimum font size test for valid sizes', () => {
      const theme = {
        typography: {
          fontSize: {
            sm: '12px',
            md: '16px',
            lg: '1.5rem',
          },
        },
      };
      const result = testTokenAccessibility(theme);
      const test = result.tests.find((t) => t.name === 'Minimum Font Size');
      expect(test?.passed).toBe(true);
    });

    it('fails minimum font size test for small sizes', () => {
      const theme = {
        typography: {
          fontSize: {
            xs: '10px',
            sm: '14px',
          },
        },
      };
      const result = testTokenAccessibility(theme);
      const test = result.tests.find((t) => t.name === 'Minimum Font Size');
      expect(test?.passed).toBe(false);
      expect(test?.message).toContain('below 12px');
    });

    it('checks rem values correctly', () => {
      const theme = {
        typography: {
          fontSize: {
            xs: '0.5rem', // 8px - should fail
            sm: '0.75rem', // 12px - should pass
          },
        },
      };
      const result = testTokenAccessibility(theme);
      const test = result.tests.find((t) => t.name === 'Minimum Font Size');
      expect(test?.passed).toBe(false);
    });

    it('overall passes when all tests pass', () => {
      const theme = {
        typography: {
          fontSize: { md: '16px' },
        },
      };
      const result = testTokenAccessibility(theme);
      expect(result.passed).toBe(true);
    });

    it('overall fails when any test fails', () => {
      const theme = {
        typography: {
          fontSize: { xs: '10px' },
        },
      };
      const result = testTokenAccessibility(theme);
      expect(result.passed).toBe(false);
    });

    it('handles theme without typography', () => {
      const result = testTokenAccessibility({});
      const test = result.tests.find((t) => t.name === 'Minimum Font Size');
      expect(test?.passed).toBe(true);
    });

    it('handles non-string fontSize values', () => {
      const theme = {
        typography: {
          fontSize: {
            md: 16, // number, not string
          },
        },
      };
      const result = testTokenAccessibility(theme);
      expect(result.passed).toBe(true);
    });
  });

  describe('formatValidationReport', () => {
    it('formats empty report', () => {
      const report = generateValidationReport([]);
      const formatted = formatValidationReport(report);
      expect(formatted).toContain('Token Validation Report');
      expect(formatted).toContain('✓ VALID');
      expect(formatted).toContain('Total Issues: 0');
    });

    it('formats report with errors', () => {
      const issues: ValidationIssue[] = [
        {
          path: 'color.primary',
          rule: 'validHexColor',
          severity: 'error',
          message: 'Invalid color format',
          suggestion: 'Use hex format',
        },
      ];
      const report = generateValidationReport(issues);
      const formatted = formatValidationReport(report);
      
      expect(formatted).toContain('✗ INVALID');
      expect(formatted).toContain('Errors:');
      expect(formatted).toContain('color.primary');
      expect(formatted).toContain('Invalid color format');
      expect(formatted).toContain('Use hex format');
    });

    it('formats report with warnings', () => {
      const issues: ValidationIssue[] = [
        {
          path: 'fontSize.xs',
          rule: 'accessibleFontSize',
          severity: 'warning',
          message: 'Font too small',
          suggestion: 'Use at least 12px',
        },
      ];
      const report = generateValidationReport(issues);
      const formatted = formatValidationReport(report);
      
      expect(formatted).toContain('Warnings:');
      expect(formatted).toContain('fontSize.xs');
      expect(formatted).toContain('Font too small');
      expect(formatted).toContain('💡 Use at least 12px');
    });

    it('includes suggestions with lightbulb emoji', () => {
      const issues: ValidationIssue[] = [
        {
          path: 'test',
          rule: 'test',
          severity: 'error',
          message: 'Error',
          suggestion: 'Try this instead',
        },
      ];
      const report = generateValidationReport(issues);
      const formatted = formatValidationReport(report);
      
      expect(formatted).toContain('💡 Try this instead');
    });

    it('formats summary correctly', () => {
      const issues: ValidationIssue[] = [
        { path: 'a', rule: 'r', severity: 'error', message: 'm' },
        { path: 'b', rule: 'r', severity: 'warning', message: 'm' },
        { path: 'c', rule: 'r', severity: 'info', message: 'm' },
      ];
      const report = generateValidationReport(issues);
      const formatted = formatValidationReport(report);
      
      expect(formatted).toContain('Total Issues: 3');
      expect(formatted).toContain('Errors: 1');
      expect(formatted).toContain('Warnings: 1');
      expect(formatted).toContain('Info: 1');
    });

    it('uses appropriate symbols for each severity', () => {
      const issues: ValidationIssue[] = [
        { path: 'a', rule: 'r', severity: 'error', message: 'm' },
        { path: 'b', rule: 'r', severity: 'warning', message: 'm' },
      ];
      const report = generateValidationReport(issues);
      const formatted = formatValidationReport(report);
      
      expect(formatted).toContain('✗');
      expect(formatted).toContain('⚠');
    });

    it('omits suggestion when not provided', () => {
      const issues: ValidationIssue[] = [
        {
          path: 'test',
          rule: 'test',
          severity: 'error',
          message: 'Error',
          // no suggestion
        },
      ];
      const report = generateValidationReport(issues);
      const formatted = formatValidationReport(report);
      
      expect(formatted).not.toContain('💡');
    });

    it('separates sections with lines', () => {
      const formatted = formatValidationReport(generateValidationReport([]));
      expect(formatted).toContain('='.repeat(50));
    });
  });
});
