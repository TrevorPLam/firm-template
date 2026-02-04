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
 * Motion and animation design tokens
 * Provides consistent timing, easing, and animation parameters across the design system
 */

export interface MotionToken {
  name: string;
  value: string | number;
  description?: string;
}

export interface EasingToken extends MotionToken {
  value: string;
  cssValue: string;
}

export interface DurationToken extends MotionToken {
  value: number;
  cssValue: string;
}

export interface DelayToken extends MotionToken {
  value: number;
  cssValue: string;
}

/**
 * Animation durations in milliseconds
 * Based on Material Design and Human Interface Guidelines
 */
export const durations = {
  instant: {
    name: 'instant',
    value: 0,
    cssValue: '0ms',
    description: 'No animation, immediate change',
  },
  fast: {
    name: 'fast',
    value: 100,
    cssValue: '100ms',
    description: 'Quick transitions for small elements',
  },
  normal: {
    name: 'normal',
    value: 200,
    cssValue: '200ms',
    description: 'Standard transition duration',
  },
  moderate: {
    name: 'moderate',
    value: 300,
    cssValue: '300ms',
    description: 'Moderate transitions for medium elements',
  },
  slow: {
    name: 'slow',
    value: 400,
    cssValue: '400ms',
    description: 'Slower transitions for large elements',
  },
  slower: {
    name: 'slower',
    value: 600,
    cssValue: '600ms',
    description: 'Very slow transitions for complex animations',
  },
  slowest: {
    name: 'slowest',
    value: 800,
    cssValue: '800ms',
    description: 'Slowest transitions for emphasized effects',
  },
} as const satisfies Record<string, DurationToken>;

/**
 * Easing functions for natural motion
 * Includes standard and custom curves
 */
export const easings = {
  linear: {
    name: 'linear',
    value: 'linear',
    cssValue: 'linear',
    description: 'Constant speed, no acceleration',
  },
  easeIn: {
    name: 'easeIn',
    value: 'cubic-bezier(0.4, 0, 1, 1)',
    cssValue: 'cubic-bezier(0.4, 0, 1, 1)',
    description: 'Accelerates into motion',
  },
  easeOut: {
    name: 'easeOut',
    value: 'cubic-bezier(0, 0, 0.2, 1)',
    cssValue: 'cubic-bezier(0, 0, 0.2, 1)',
    description: 'Decelerates out of motion',
  },
  easeInOut: {
    name: 'easeInOut',
    value: 'cubic-bezier(0.4, 0, 0.2, 1)',
    cssValue: 'cubic-bezier(0.4, 0, 0.2, 1)',
    description: 'Smooth acceleration and deceleration',
  },
  easeInQuad: {
    name: 'easeInQuad',
    value: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    cssValue: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    description: 'Quadratic ease-in',
  },
  easeOutQuad: {
    name: 'easeOutQuad',
    value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    cssValue: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    description: 'Quadratic ease-out',
  },
  easeInOutQuad: {
    name: 'easeInOutQuad',
    value: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
    cssValue: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
    description: 'Quadratic ease-in-out',
  },
  easeInCubic: {
    name: 'easeInCubic',
    value: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    cssValue: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    description: 'Cubic ease-in',
  },
  easeOutCubic: {
    name: 'easeOutCubic',
    value: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    cssValue: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    description: 'Cubic ease-out',
  },
  easeInOutCubic: {
    name: 'easeInOutCubic',
    value: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    cssValue: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    description: 'Cubic ease-in-out',
  },
  spring: {
    name: 'spring',
    value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    cssValue: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    description: 'Spring-like bounce effect',
  },
  bounce: {
    name: 'bounce',
    value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    cssValue: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    description: 'Bouncy animation',
  },
  emphasize: {
    name: 'emphasize',
    value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    cssValue: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    description: 'Emphasized motion for important UI changes',
  },
} as const satisfies Record<string, EasingToken>;

/**
 * Animation delays for staggered effects
 */
export const delays = {
  none: {
    name: 'none',
    value: 0,
    cssValue: '0ms',
    description: 'No delay',
  },
  short: {
    name: 'short',
    value: 50,
    cssValue: '50ms',
    description: 'Short delay for subtle stagger',
  },
  medium: {
    name: 'medium',
    value: 100,
    cssValue: '100ms',
    description: 'Medium delay for noticeable stagger',
  },
  long: {
    name: 'long',
    value: 150,
    cssValue: '150ms',
    description: 'Long delay for emphasized stagger',
  },
  extraLong: {
    name: 'extraLong',
    value: 200,
    cssValue: '200ms',
    description: 'Extra long delay for sequential animations',
  },
} as const satisfies Record<string, DelayToken>;

/**
 * Motion scale values for responsive animations
 * Allows adjusting animation speed based on context
 */
export const motionScale = {
  none: 0,
  reduced: 0.5,
  normal: 1,
  emphasized: 1.5,
} as const;

/**
 * Get duration value with optional scale factor
 */
export function getDuration(
  duration: keyof typeof durations,
  scale: number = motionScale.normal
): number {
  return durations[duration].value * scale;
}

/**
 * Get CSS duration string with optional scale factor
 */
export function getCssDuration(
  duration: keyof typeof durations,
  scale: number = motionScale.normal
): string {
  const value = getDuration(duration, scale);
  return `${value}ms`;
}

/**
 * Get delay value with optional scale factor
 */
export function getDelay(
  delay: keyof typeof delays,
  scale: number = motionScale.normal
): number {
  return delays[delay].value * scale;
}

/**
 * Get CSS delay string with optional scale factor
 */
export function getCssDelay(
  delay: keyof typeof delays,
  scale: number = motionScale.normal
): string {
  const value = getDelay(delay, scale);
  return `${value}ms`;
}

/**
 * Create staggered delay for list animations
 */
export function getStaggerDelay(index: number, baseDelay: number = 50): string {
  return `${index * baseDelay}ms`;
}

/**
 * Respect user's motion preferences
 */
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get motion scale based on user preference
 */
export function getMotionScale(): number {
  return shouldReduceMotion() ? motionScale.reduced : motionScale.normal;
}

export type DurationKey = keyof typeof durations;
export type EasingKey = keyof typeof easings;
export type DelayKey = keyof typeof delays;
export type MotionScaleKey = keyof typeof motionScale;
