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
 * Common animation presets for consistent motion design
 * Ready-to-use animation configurations for common UI patterns
 */

import { durations, easings, delays, type DurationKey, type EasingKey } from './motion-tokens';

export interface AnimationPreset {
  name: string;
  description: string;
  duration: DurationKey;
  easing: EasingKey;
  delay?: number;
  properties?: string[];
  keyframes?: Record<string, string | number>;
}

/**
 * Fade animations
 */
export const fade = {
  in: {
    name: 'fadeIn',
    description: 'Fade element in from transparent to opaque',
    duration: 'normal',
    easing: 'easeOut',
    properties: ['opacity'],
    keyframes: {
      from: 'opacity: 0',
      to: 'opacity: 1',
    },
  },
  out: {
    name: 'fadeOut',
    description: 'Fade element out from opaque to transparent',
    duration: 'normal',
    easing: 'easeIn',
    properties: ['opacity'],
    keyframes: {
      from: 'opacity: 1',
      to: 'opacity: 0',
    },
  },
  inUp: {
    name: 'fadeInUp',
    description: 'Fade in while moving up',
    duration: 'moderate',
    easing: 'easeOut',
    properties: ['opacity', 'transform'],
    keyframes: {
      from: 'opacity: 0; transform: translateY(20px)',
      to: 'opacity: 1; transform: translateY(0)',
    },
  },
  inDown: {
    name: 'fadeInDown',
    description: 'Fade in while moving down',
    duration: 'moderate',
    easing: 'easeOut',
    properties: ['opacity', 'transform'],
    keyframes: {
      from: 'opacity: 0; transform: translateY(-20px)',
      to: 'opacity: 1; transform: translateY(0)',
    },
  },
  inLeft: {
    name: 'fadeInLeft',
    description: 'Fade in while moving from left',
    duration: 'moderate',
    easing: 'easeOut',
    properties: ['opacity', 'transform'],
    keyframes: {
      from: 'opacity: 0; transform: translateX(-20px)',
      to: 'opacity: 1; transform: translateX(0)',
    },
  },
  inRight: {
    name: 'fadeInRight',
    description: 'Fade in while moving from right',
    duration: 'moderate',
    easing: 'easeOut',
    properties: ['opacity', 'transform'],
    keyframes: {
      from: 'opacity: 0; transform: translateX(20px)',
      to: 'opacity: 1; transform: translateX(0)',
    },
  },
} as const satisfies Record<string, AnimationPreset>;

/**
 * Slide animations
 */
export const slide = {
  inUp: {
    name: 'slideInUp',
    description: 'Slide element in from bottom',
    duration: 'moderate',
    easing: 'easeOut',
    properties: ['transform'],
    keyframes: {
      from: 'transform: translateY(100%)',
      to: 'transform: translateY(0)',
    },
  },
  inDown: {
    name: 'slideInDown',
    description: 'Slide element in from top',
    duration: 'moderate',
    easing: 'easeOut',
    properties: ['transform'],
    keyframes: {
      from: 'transform: translateY(-100%)',
      to: 'transform: translateY(0)',
    },
  },
  inLeft: {
    name: 'slideInLeft',
    description: 'Slide element in from left',
    duration: 'moderate',
    easing: 'easeOut',
    properties: ['transform'],
    keyframes: {
      from: 'transform: translateX(-100%)',
      to: 'transform: translateX(0)',
    },
  },
  inRight: {
    name: 'slideInRight',
    description: 'Slide element in from right',
    duration: 'moderate',
    easing: 'easeOut',
    properties: ['transform'],
    keyframes: {
      from: 'transform: translateX(100%)',
      to: 'transform: translateX(0)',
    },
  },
  outUp: {
    name: 'slideOutUp',
    description: 'Slide element out to top',
    duration: 'moderate',
    easing: 'easeIn',
    properties: ['transform'],
    keyframes: {
      from: 'transform: translateY(0)',
      to: 'transform: translateY(-100%)',
    },
  },
  outDown: {
    name: 'slideOutDown',
    description: 'Slide element out to bottom',
    duration: 'moderate',
    easing: 'easeIn',
    properties: ['transform'],
    keyframes: {
      from: 'transform: translateY(0)',
      to: 'transform: translateY(100%)',
    },
  },
} as const satisfies Record<string, AnimationPreset>;

/**
 * Scale animations
 */
export const scale = {
  in: {
    name: 'scaleIn',
    description: 'Scale element in from small to normal',
    duration: 'normal',
    easing: 'easeOut',
    properties: ['transform', 'opacity'],
    keyframes: {
      from: 'transform: scale(0.9); opacity: 0',
      to: 'transform: scale(1); opacity: 1',
    },
  },
  out: {
    name: 'scaleOut',
    description: 'Scale element out from normal to small',
    duration: 'normal',
    easing: 'easeIn',
    properties: ['transform', 'opacity'],
    keyframes: {
      from: 'transform: scale(1); opacity: 1',
      to: 'transform: scale(0.9); opacity: 0',
    },
  },
  up: {
    name: 'scaleUp',
    description: 'Scale element to larger size',
    duration: 'fast',
    easing: 'easeOut',
    properties: ['transform'],
    keyframes: {
      from: 'transform: scale(1)',
      to: 'transform: scale(1.05)',
    },
  },
  down: {
    name: 'scaleDown',
    description: 'Scale element to smaller size',
    duration: 'fast',
    easing: 'easeOut',
    properties: ['transform'],
    keyframes: {
      from: 'transform: scale(1)',
      to: 'transform: scale(0.95)',
    },
  },
} as const satisfies Record<string, AnimationPreset>;

/**
 * Rotation animations
 */
export const rotate = {
  in: {
    name: 'rotateIn',
    description: 'Rotate element in',
    duration: 'moderate',
    easing: 'easeOut',
    properties: ['transform', 'opacity'],
    keyframes: {
      from: 'transform: rotate(-180deg); opacity: 0',
      to: 'transform: rotate(0); opacity: 1',
    },
  },
  out: {
    name: 'rotateOut',
    description: 'Rotate element out',
    duration: 'moderate',
    easing: 'easeIn',
    properties: ['transform', 'opacity'],
    keyframes: {
      from: 'transform: rotate(0); opacity: 1',
      to: 'transform: rotate(180deg); opacity: 0',
    },
  },
  spin: {
    name: 'spin',
    description: 'Continuous rotation (loading spinner)',
    duration: 'slower',
    easing: 'linear',
    properties: ['transform'],
    keyframes: {
      from: 'transform: rotate(0deg)',
      to: 'transform: rotate(360deg)',
    },
  },
} as const satisfies Record<string, AnimationPreset>;

/**
 * Bounce animations
 */
export const bounce = {
  in: {
    name: 'bounceIn',
    description: 'Bounce element in with spring effect',
    duration: 'moderate',
    easing: 'spring',
    properties: ['transform', 'opacity'],
    keyframes: {
      from: 'transform: scale(0.3); opacity: 0',
      to: 'transform: scale(1); opacity: 1',
    },
  },
  gentle: {
    name: 'bounceGentle',
    description: 'Gentle bounce effect',
    duration: 'fast',
    easing: 'bounce',
    properties: ['transform'],
    keyframes: {
      '0%': 'transform: translateY(0)',
      '50%': 'transform: translateY(-5px)',
      '100%': 'transform: translateY(0)',
    },
  },
} as const satisfies Record<string, AnimationPreset>;

/**
 * Pulse animations
 */
export const pulse = {
  default: {
    name: 'pulse',
    description: 'Subtle pulsing effect',
    duration: 'slower',
    easing: 'easeInOut',
    properties: ['opacity'],
    keyframes: {
      '0%': 'opacity: 1',
      '50%': 'opacity: 0.7',
      '100%': 'opacity: 1',
    },
  },
  scale: {
    name: 'pulseScale',
    description: 'Pulsing with scale',
    duration: 'slower',
    easing: 'easeInOut',
    properties: ['transform'],
    keyframes: {
      '0%': 'transform: scale(1)',
      '50%': 'transform: scale(1.05)',
      '100%': 'transform: scale(1)',
    },
  },
} as const satisfies Record<string, AnimationPreset>;

/**
 * Shimmer effect for loading states
 */
export const shimmer = {
  default: {
    name: 'shimmer',
    description: 'Shimmer loading effect',
    duration: 'slowest',
    easing: 'linear',
    properties: ['background-position'],
    keyframes: {
      '0%': 'background-position: -1000px 0',
      '100%': 'background-position: 1000px 0',
    },
  },
} as const satisfies Record<string, AnimationPreset>;

/**
 * Get CSS animation string for a preset
 */
export function getAnimationCss(preset: AnimationPreset, infinite: boolean = false): string {
  const duration = durations[preset.duration].cssValue;
  const easing = easings[preset.easing].cssValue;
  const iteration = infinite ? 'infinite' : '1';
  return `${preset.name} ${duration} ${easing} ${iteration}`;
}

/**
 * Generate keyframe CSS for a preset
 */
export function generateKeyframesCss(preset: AnimationPreset): string {
  if (!preset.keyframes) return '';

  const keyframeEntries = Object.entries(preset.keyframes);
  const keyframeRules = keyframeEntries
    .map(([key, value]) => `  ${key} { ${value}; }`)
    .join('\n');

  return `@keyframes ${preset.name} {
${keyframeRules}
}`;
}

/**
 * All animation presets grouped by category
 */
export const presets = {
  fade,
  slide,
  scale,
  rotate,
  bounce,
  pulse,
  shimmer,
} as const;

/**
 * Get all presets as a flat array
 */
export function getAllPresets(): AnimationPreset[] {
  return Object.values(presets).flatMap((category) => Object.values(category));
}

/**
 * Generate CSS for all animation presets
 */
export function generateAllKeyframesCss(): string {
  return getAllPresets()
    .map(generateKeyframesCss)
    .filter(Boolean)
    .join('\n\n');
}
