import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  durations,
  easings,
  delays,
  motionScale,
  getDuration,
  getCssDuration,
  getDelay,
  getCssDelay,
  getStaggerDelay,
  shouldReduceMotion,
  getMotionScale,
  type DurationKey,
  type EasingKey,
  type DelayKey,
} from './motion-tokens';

describe('motion-tokens', () => {
  describe('durations', () => {
    it('exports all duration tokens with correct structure', () => {
      const durationKeys: DurationKey[] = ['instant', 'fast', 'normal', 'moderate', 'slow', 'slower', 'slowest'];
      
      durationKeys.forEach((key) => {
        expect(durations[key]).toBeDefined();
        expect(durations[key].name).toBe(key);
        expect(typeof durations[key].value).toBe('number');
        expect(durations[key].cssValue).toMatch(/^\d+ms$/);
        expect(typeof durations[key].description).toBe('string');
      });
    });

    it('has correct duration values', () => {
      expect(durations.instant.value).toBe(0);
      expect(durations.fast.value).toBe(100);
      expect(durations.normal.value).toBe(200);
      expect(durations.moderate.value).toBe(300);
      expect(durations.slow.value).toBe(400);
      expect(durations.slower.value).toBe(600);
      expect(durations.slowest.value).toBe(800);
    });

    it('has correct CSS values', () => {
      expect(durations.instant.cssValue).toBe('0ms');
      expect(durations.fast.cssValue).toBe('100ms');
      expect(durations.normal.cssValue).toBe('200ms');
    });
  });

  describe('easings', () => {
    it('exports all easing tokens with correct structure', () => {
      const easingKeys: EasingKey[] = [
        'linear',
        'easeIn',
        'easeOut',
        'easeInOut',
        'easeInQuad',
        'easeOutQuad',
        'easeInOutQuad',
        'easeInCubic',
        'easeOutCubic',
        'easeInOutCubic',
        'spring',
        'bounce',
        'emphasize',
      ];

      easingKeys.forEach((key) => {
        expect(easings[key]).toBeDefined();
        expect(easings[key].name).toBe(key);
        expect(typeof easings[key].value).toBe('string');
        expect(typeof easings[key].cssValue).toBe('string');
        expect(typeof easings[key].description).toBe('string');
      });
    });

    it('has correct easing values', () => {
      expect(easings.linear.value).toBe('linear');
      expect(easings.easeIn.value).toBe('cubic-bezier(0.4, 0, 1, 1)');
      expect(easings.easeOut.value).toBe('cubic-bezier(0, 0, 0.2, 1)');
      expect(easings.easeInOut.value).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    });

    it('has cubic-bezier format for custom easings', () => {
      expect(easings.spring.value).toMatch(/^cubic-bezier\([\d.,\s-]+\)$/);
      expect(easings.bounce.value).toMatch(/^cubic-bezier\([\d.,\s-]+\)$/);
    });
  });

  describe('delays', () => {
    it('exports all delay tokens with correct structure', () => {
      const delayKeys: DelayKey[] = ['none', 'short', 'medium', 'long', 'extraLong'];

      delayKeys.forEach((key) => {
        expect(delays[key]).toBeDefined();
        expect(delays[key].name).toBe(key);
        expect(typeof delays[key].value).toBe('number');
        expect(delays[key].cssValue).toMatch(/^\d+ms$/);
        expect(typeof delays[key].description).toBe('string');
      });
    });

    it('has correct delay values', () => {
      expect(delays.none.value).toBe(0);
      expect(delays.short.value).toBe(50);
      expect(delays.medium.value).toBe(100);
      expect(delays.long.value).toBe(150);
      expect(delays.extraLong.value).toBe(200);
    });
  });

  describe('motionScale', () => {
    it('exports all motion scale values', () => {
      expect(motionScale.none).toBe(0);
      expect(motionScale.reduced).toBe(0.5);
      expect(motionScale.normal).toBe(1);
      expect(motionScale.emphasized).toBe(1.5);
    });
  });

  describe('getDuration', () => {
    it('returns duration value without scale', () => {
      expect(getDuration('fast')).toBe(100);
      expect(getDuration('normal')).toBe(200);
      expect(getDuration('slow')).toBe(400);
    });

    it('applies scale factor to duration', () => {
      expect(getDuration('normal', 1.5)).toBe(300);
      expect(getDuration('fast', 2)).toBe(200);
      expect(getDuration('slow', 0.5)).toBe(200);
    });

    it('uses motionScale.normal as default', () => {
      expect(getDuration('normal')).toBe(getDuration('normal', 1));
    });

    it('handles zero scale', () => {
      expect(getDuration('normal', 0)).toBe(0);
    });

    it('handles instant duration', () => {
      expect(getDuration('instant')).toBe(0);
      expect(getDuration('instant', 2)).toBe(0);
    });
  });

  describe('getCssDuration', () => {
    it('returns CSS duration string without scale', () => {
      expect(getCssDuration('fast')).toBe('100ms');
      expect(getCssDuration('normal')).toBe('200ms');
      expect(getCssDuration('slow')).toBe('400ms');
    });

    it('applies scale factor and returns CSS string', () => {
      expect(getCssDuration('normal', 1.5)).toBe('300ms');
      expect(getCssDuration('fast', 2)).toBe('200ms');
      expect(getCssDuration('slow', 0.5)).toBe('200ms');
    });

    it('handles decimal values', () => {
      expect(getCssDuration('normal', 0.5)).toBe('100ms');
    });

    it('uses motionScale.normal as default', () => {
      expect(getCssDuration('normal')).toBe('200ms');
    });
  });

  describe('getDelay', () => {
    it('returns delay value without scale', () => {
      expect(getDelay('short')).toBe(50);
      expect(getDelay('medium')).toBe(100);
      expect(getDelay('long')).toBe(150);
    });

    it('applies scale factor to delay', () => {
      expect(getDelay('medium', 1.5)).toBe(150);
      expect(getDelay('short', 2)).toBe(100);
      expect(getDelay('long', 0.5)).toBe(75);
    });

    it('uses motionScale.normal as default', () => {
      expect(getDelay('medium')).toBe(getDelay('medium', 1));
    });

    it('handles none delay', () => {
      expect(getDelay('none')).toBe(0);
      expect(getDelay('none', 2)).toBe(0);
    });
  });

  describe('getCssDelay', () => {
    it('returns CSS delay string without scale', () => {
      expect(getCssDelay('short')).toBe('50ms');
      expect(getCssDelay('medium')).toBe('100ms');
      expect(getCssDelay('long')).toBe('150ms');
    });

    it('applies scale factor and returns CSS string', () => {
      expect(getCssDelay('medium', 1.5)).toBe('150ms');
      expect(getCssDelay('short', 2)).toBe('100ms');
      expect(getCssDelay('long', 0.5)).toBe('75ms');
    });

    it('uses motionScale.normal as default', () => {
      expect(getCssDelay('medium')).toBe('100ms');
    });
  });

  describe('getStaggerDelay', () => {
    it('calculates staggered delay with default base', () => {
      expect(getStaggerDelay(0)).toBe('0ms');
      expect(getStaggerDelay(1)).toBe('50ms');
      expect(getStaggerDelay(2)).toBe('100ms');
      expect(getStaggerDelay(5)).toBe('250ms');
    });

    it('calculates staggered delay with custom base', () => {
      expect(getStaggerDelay(0, 100)).toBe('0ms');
      expect(getStaggerDelay(1, 100)).toBe('100ms');
      expect(getStaggerDelay(3, 75)).toBe('225ms');
    });

    it('handles negative index', () => {
      expect(getStaggerDelay(-1)).toBe('-50ms');
      expect(getStaggerDelay(-2, 100)).toBe('-200ms');
    });

    it('handles zero base delay', () => {
      expect(getStaggerDelay(5, 0)).toBe('0ms');
    });
  });

  describe('shouldReduceMotion', () => {
    let matchMediaMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      matchMediaMock = vi.fn();
      global.window = {
        matchMedia: matchMediaMock,
      } as any;
    });

    afterEach(() => {
      delete (global as any).window;
    });

    it('returns false when window is undefined (SSR)', () => {
      delete (global as any).window;
      expect(shouldReduceMotion()).toBe(false);
    });

    it('returns true when user prefers reduced motion', () => {
      matchMediaMock.mockReturnValue({ matches: true });
      expect(shouldReduceMotion()).toBe(true);
      expect(matchMediaMock).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });

    it('returns false when user does not prefer reduced motion', () => {
      matchMediaMock.mockReturnValue({ matches: false });
      expect(shouldReduceMotion()).toBe(false);
      expect(matchMediaMock).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });
  });

  describe('getMotionScale', () => {
    let matchMediaMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      matchMediaMock = vi.fn();
      global.window = {
        matchMedia: matchMediaMock,
      } as any;
    });

    afterEach(() => {
      delete (global as any).window;
    });

    it('returns reduced scale when user prefers reduced motion', () => {
      matchMediaMock.mockReturnValue({ matches: true });
      expect(getMotionScale()).toBe(motionScale.reduced);
    });

    it('returns normal scale when user does not prefer reduced motion', () => {
      matchMediaMock.mockReturnValue({ matches: false });
      expect(getMotionScale()).toBe(motionScale.normal);
    });

    it('returns normal scale when window is undefined (SSR)', () => {
      delete (global as any).window;
      expect(getMotionScale()).toBe(motionScale.normal);
    });
  });
});
