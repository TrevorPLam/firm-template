import { describe, it, expect } from 'vitest';
import {
  fade,
  slide,
  scale,
  rotate,
  bounce,
  pulse,
  shimmer,
  presets,
  getAnimationCss,
  generateKeyframesCss,
  getAllPresets,
  generateAllKeyframesCss,
  type AnimationPreset,
} from './presets';
import { durations, easings } from './motion-tokens';

describe('presets', () => {
  describe('fade animations', () => {
    it('exports all fade animation presets', () => {
      expect(fade.in).toBeDefined();
      expect(fade.out).toBeDefined();
      expect(fade.inUp).toBeDefined();
      expect(fade.inDown).toBeDefined();
      expect(fade.inLeft).toBeDefined();
      expect(fade.inRight).toBeDefined();
    });

    it('has correct structure for fade.in', () => {
      expect(fade.in.name).toBe('fadeIn');
      expect(fade.in.duration).toBe('normal');
      expect(fade.in.easing).toBe('easeOut');
      expect(fade.in.properties).toEqual(['opacity']);
      expect(fade.in.keyframes).toBeDefined();
      expect(fade.in.keyframes?.from).toBe('opacity: 0');
      expect(fade.in.keyframes?.to).toBe('opacity: 1');
    });

    it('has correct structure for fade.out', () => {
      expect(fade.out.name).toBe('fadeOut');
      expect(fade.out.easing).toBe('easeIn');
      expect(fade.out.keyframes?.from).toBe('opacity: 1');
      expect(fade.out.keyframes?.to).toBe('opacity: 0');
    });

    it('has opacity and transform properties for directional fades', () => {
      expect(fade.inUp.properties).toEqual(['opacity', 'transform']);
      expect(fade.inDown.properties).toEqual(['opacity', 'transform']);
      expect(fade.inLeft.properties).toEqual(['opacity', 'transform']);
      expect(fade.inRight.properties).toEqual(['opacity', 'transform']);
    });

    it('has correct keyframes for directional fades', () => {
      expect(fade.inUp.keyframes?.from).toContain('translateY(20px)');
      expect(fade.inDown.keyframes?.from).toContain('translateY(-20px)');
      expect(fade.inLeft.keyframes?.from).toContain('translateX(-20px)');
      expect(fade.inRight.keyframes?.from).toContain('translateX(20px)');
    });
  });

  describe('slide animations', () => {
    it('exports all slide animation presets', () => {
      expect(slide.inUp).toBeDefined();
      expect(slide.inDown).toBeDefined();
      expect(slide.inLeft).toBeDefined();
      expect(slide.inRight).toBeDefined();
      expect(slide.outUp).toBeDefined();
      expect(slide.outDown).toBeDefined();
    });

    it('has correct structure for slide.inUp', () => {
      expect(slide.inUp.name).toBe('slideInUp');
      expect(slide.inUp.duration).toBe('moderate');
      expect(slide.inUp.easing).toBe('easeOut');
      expect(slide.inUp.properties).toEqual(['transform']);
    });

    it('has correct keyframes for slide animations', () => {
      expect(slide.inUp.keyframes?.from).toBe('transform: translateY(100%)');
      expect(slide.inDown.keyframes?.from).toBe('transform: translateY(-100%)');
      expect(slide.inLeft.keyframes?.from).toBe('transform: translateX(-100%)');
      expect(slide.inRight.keyframes?.from).toBe('transform: translateX(100%)');
    });

    it('uses easeIn for out animations', () => {
      expect(slide.outUp.easing).toBe('easeIn');
      expect(slide.outDown.easing).toBe('easeIn');
    });

    it('has correct out animation keyframes', () => {
      expect(slide.outUp.keyframes?.to).toBe('transform: translateY(-100%)');
      expect(slide.outDown.keyframes?.to).toBe('transform: translateY(100%)');
    });
  });

  describe('scale animations', () => {
    it('exports all scale animation presets', () => {
      expect(scale.in).toBeDefined();
      expect(scale.out).toBeDefined();
      expect(scale.up).toBeDefined();
      expect(scale.down).toBeDefined();
    });

    it('has correct structure for scale.in', () => {
      expect(scale.in.name).toBe('scaleIn');
      expect(scale.in.duration).toBe('normal');
      expect(scale.in.easing).toBe('easeOut');
      expect(scale.in.properties).toEqual(['transform', 'opacity']);
    });

    it('has correct keyframes for scale in/out with opacity', () => {
      expect(scale.in.keyframes?.from).toContain('scale(0.9)');
      expect(scale.in.keyframes?.from).toContain('opacity: 0');
      expect(scale.out.keyframes?.to).toContain('scale(0.9)');
      expect(scale.out.keyframes?.to).toContain('opacity: 0');
    });

    it('has fast duration for scale up/down', () => {
      expect(scale.up.duration).toBe('fast');
      expect(scale.down.duration).toBe('fast');
    });

    it('has correct scale values', () => {
      expect(scale.up.keyframes?.to).toBe('transform: scale(1.05)');
      expect(scale.down.keyframes?.to).toBe('transform: scale(0.95)');
    });
  });

  describe('rotate animations', () => {
    it('exports all rotate animation presets', () => {
      expect(rotate.in).toBeDefined();
      expect(rotate.out).toBeDefined();
      expect(rotate.spin).toBeDefined();
    });

    it('has correct structure for rotate.in', () => {
      expect(rotate.in.name).toBe('rotateIn');
      expect(rotate.in.duration).toBe('moderate');
      expect(rotate.in.properties).toEqual(['transform', 'opacity']);
    });

    it('has correct rotation degrees', () => {
      expect(rotate.in.keyframes?.from).toContain('rotate(-180deg)');
      expect(rotate.in.keyframes?.to).toContain('rotate(0)');
      expect(rotate.out.keyframes?.to).toContain('rotate(180deg)');
    });

    it('has linear easing for spin', () => {
      expect(rotate.spin.easing).toBe('linear');
      expect(rotate.spin.duration).toBe('slower');
    });

    it('spins full 360 degrees', () => {
      expect(rotate.spin.keyframes?.from).toBe('transform: rotate(0deg)');
      expect(rotate.spin.keyframes?.to).toBe('transform: rotate(360deg)');
    });
  });

  describe('bounce animations', () => {
    it('exports all bounce animation presets', () => {
      expect(bounce.in).toBeDefined();
      expect(bounce.gentle).toBeDefined();
    });

    it('uses spring easing for bounce.in', () => {
      expect(bounce.in.easing).toBe('spring');
    });

    it('uses bounce easing for bounce.gentle', () => {
      expect(bounce.gentle.easing).toBe('bounce');
    });

    it('has multi-step keyframes for gentle bounce', () => {
      expect(bounce.gentle.keyframes).toHaveProperty('0%');
      expect(bounce.gentle.keyframes).toHaveProperty('50%');
      expect(bounce.gentle.keyframes).toHaveProperty('100%');
    });

    it('has correct gentle bounce movement', () => {
      expect(bounce.gentle.keyframes?.['0%']).toBe('transform: translateY(0)');
      expect(bounce.gentle.keyframes?.['50%']).toBe('transform: translateY(-5px)');
      expect(bounce.gentle.keyframes?.['100%']).toBe('transform: translateY(0)');
    });
  });

  describe('pulse animations', () => {
    it('exports all pulse animation presets', () => {
      expect(pulse.default).toBeDefined();
      expect(pulse.scale).toBeDefined();
    });

    it('uses easeInOut for smooth pulsing', () => {
      expect(pulse.default.easing).toBe('easeInOut');
      expect(pulse.scale.easing).toBe('easeInOut');
    });

    it('uses slower duration for pulsing', () => {
      expect(pulse.default.duration).toBe('slower');
      expect(pulse.scale.duration).toBe('slower');
    });

    it('has multi-step opacity keyframes', () => {
      expect(pulse.default.keyframes?.['0%']).toBe('opacity: 1');
      expect(pulse.default.keyframes?.['50%']).toBe('opacity: 0.7');
      expect(pulse.default.keyframes?.['100%']).toBe('opacity: 1');
    });

    it('has multi-step scale keyframes', () => {
      expect(pulse.scale.keyframes?.['0%']).toBe('transform: scale(1)');
      expect(pulse.scale.keyframes?.['50%']).toBe('transform: scale(1.05)');
      expect(pulse.scale.keyframes?.['100%']).toBe('transform: scale(1)');
    });
  });

  describe('shimmer animations', () => {
    it('exports shimmer preset', () => {
      expect(shimmer.default).toBeDefined();
    });

    it('has correct structure for shimmer', () => {
      expect(shimmer.default.name).toBe('shimmer');
      expect(shimmer.default.duration).toBe('slowest');
      expect(shimmer.default.easing).toBe('linear');
      expect(shimmer.default.properties).toEqual(['background-position']);
    });

    it('animates background position for shimmer effect', () => {
      expect(shimmer.default.keyframes?.['0%']).toBe('background-position: -1000px 0');
      expect(shimmer.default.keyframes?.['100%']).toBe('background-position: 1000px 0');
    });
  });

  describe('presets object', () => {
    it('groups all animation categories', () => {
      expect(presets.fade).toBe(fade);
      expect(presets.slide).toBe(slide);
      expect(presets.scale).toBe(scale);
      expect(presets.rotate).toBe(rotate);
      expect(presets.bounce).toBe(bounce);
      expect(presets.pulse).toBe(pulse);
      expect(presets.shimmer).toBe(shimmer);
    });
  });

  describe('getAnimationCss', () => {
    it('generates CSS animation string without infinite', () => {
      const result = getAnimationCss(fade.in);
      expect(result).toContain('fadeIn');
      expect(result).toContain('200ms');
      expect(result).toContain(easings.easeOut.cssValue);
      expect(result).toContain('1');
      expect(result).not.toContain('infinite');
    });

    it('generates CSS animation string with infinite', () => {
      const result = getAnimationCss(fade.in, true);
      expect(result).toContain('infinite');
    });

    it('uses correct duration from durations token', () => {
      const result = getAnimationCss(slide.inUp);
      expect(result).toContain(durations.moderate.cssValue);
    });

    it('uses correct easing from easings token', () => {
      const result = getAnimationCss(rotate.spin);
      expect(result).toContain(easings.linear.cssValue);
    });

    it('formats animation string correctly', () => {
      const result = getAnimationCss(fade.in, false);
      expect(result).toContain('fadeIn');
      expect(result).toContain(durations.normal.cssValue);
      expect(result).toContain(easings.easeOut.cssValue);
      expect(result).toContain('1');
    });

    it('handles different preset types', () => {
      expect(getAnimationCss(scale.up)).toContain('scaleUp');
      expect(getAnimationCss(bounce.gentle)).toContain('bounceGentle');
      expect(getAnimationCss(pulse.default)).toContain('pulse');
    });
  });

  describe('generateKeyframesCss', () => {
    it('generates CSS keyframes with from/to syntax', () => {
      const css = generateKeyframesCss(fade.in);
      expect(css).toContain('@keyframes fadeIn');
      expect(css).toContain('from { opacity: 0; }');
      expect(css).toContain('to { opacity: 1; }');
    });

    it('generates CSS keyframes with percentage syntax', () => {
      const css = generateKeyframesCss(pulse.default);
      expect(css).toContain('@keyframes pulse');
      expect(css).toContain('0% { opacity: 1; }');
      expect(css).toContain('50% { opacity: 0.7; }');
      expect(css).toContain('100% { opacity: 1; }');
    });

    it('returns empty string for preset without keyframes', () => {
      const preset: AnimationPreset = {
        name: 'test',
        description: 'test',
        duration: 'normal',
        easing: 'linear',
      };
      const css = generateKeyframesCss(preset);
      expect(css).toBe('');
    });

    it('formats keyframes correctly with proper indentation', () => {
      const css = generateKeyframesCss(slide.inUp);
      const lines = css.split('\n');
      expect(lines[0]).toBe('@keyframes slideInUp {');
      expect(lines[1]).toMatch(/^  /); // Indented
      expect(lines[lines.length - 1]).toBe('}');
    });

    it('handles complex keyframes with multiple properties', () => {
      const css = generateKeyframesCss(fade.inUp);
      expect(css).toContain('opacity: 0; transform: translateY(20px)');
    });

    it('generates keyframes for all preset types', () => {
      expect(generateKeyframesCss(fade.in)).toContain('@keyframes fadeIn');
      expect(generateKeyframesCss(slide.inLeft)).toContain('@keyframes slideInLeft');
      expect(generateKeyframesCss(scale.in)).toContain('@keyframes scaleIn');
      expect(generateKeyframesCss(rotate.spin)).toContain('@keyframes spin');
      expect(generateKeyframesCss(bounce.in)).toContain('@keyframes bounceIn');
      expect(generateKeyframesCss(shimmer.default)).toContain('@keyframes shimmer');
    });
  });

  describe('getAllPresets', () => {
    it('returns array of all presets', () => {
      const allPresets = getAllPresets();
      expect(Array.isArray(allPresets)).toBe(true);
      expect(allPresets.length).toBeGreaterThan(0);
    });

    it('includes presets from all categories', () => {
      const allPresets = getAllPresets();
      expect(allPresets).toContainEqual(fade.in);
      expect(allPresets).toContainEqual(slide.inUp);
      expect(allPresets).toContainEqual(scale.in);
      expect(allPresets).toContainEqual(rotate.spin);
      expect(allPresets).toContainEqual(bounce.in);
      expect(allPresets).toContainEqual(pulse.default);
      expect(allPresets).toContainEqual(shimmer.default);
    });

    it('flattens nested preset objects', () => {
      const allPresets = getAllPresets();
      // Count expected presets: 6 fade + 6 slide + 4 scale + 3 rotate + 2 bounce + 2 pulse + 1 shimmer = 24
      expect(allPresets.length).toBe(24);
    });

    it('returns valid AnimationPreset objects', () => {
      const allPresets = getAllPresets();
      allPresets.forEach((preset) => {
        expect(preset).toHaveProperty('name');
        expect(preset).toHaveProperty('description');
        expect(preset).toHaveProperty('duration');
        expect(preset).toHaveProperty('easing');
        expect(typeof preset.name).toBe('string');
        expect(typeof preset.description).toBe('string');
      });
    });
  });

  describe('generateAllKeyframesCss', () => {
    it('generates CSS for all presets', () => {
      const css = generateAllKeyframesCss();
      expect(typeof css).toBe('string');
      expect(css.length).toBeGreaterThan(0);
    });

    it('includes keyframes for all preset types', () => {
      const css = generateAllKeyframesCss();
      expect(css).toContain('@keyframes fadeIn');
      expect(css).toContain('@keyframes slideInUp');
      expect(css).toContain('@keyframes scaleIn');
      expect(css).toContain('@keyframes rotateIn');
      expect(css).toContain('@keyframes bounceIn');
      expect(css).toContain('@keyframes pulse');
      expect(css).toContain('@keyframes shimmer');
    });

    it('separates keyframes with double newlines', () => {
      const css = generateAllKeyframesCss();
      expect(css).toContain('\n\n');
    });

    it('does not include empty strings', () => {
      const css = generateAllKeyframesCss();
      expect(css).not.toContain('\n\n\n');
    });

    it('generates valid CSS syntax', () => {
      const css = generateAllKeyframesCss();
      const keyframeBlocks = css.split('\n\n');
      keyframeBlocks.forEach((block) => {
        if (block.trim()) {
          expect(block).toMatch(/@keyframes \w+ \{/);
          expect(block).toContain('}');
        }
      });
    });

    it('includes all 24 presets', () => {
      const css = generateAllKeyframesCss();
      const keyframeCount = (css.match(/@keyframes/g) || []).length;
      expect(keyframeCount).toBe(24);
    });
  });

  describe('type safety', () => {
    it('enforces duration keys from motion-tokens', () => {
      // This is a compile-time check, but we can verify runtime values
      const preset = fade.in;
      expect(durations[preset.duration]).toBeDefined();
    });

    it('enforces easing keys from motion-tokens', () => {
      const preset = fade.in;
      expect(easings[preset.easing]).toBeDefined();
    });

    it('all presets have valid duration keys', () => {
      const allPresets = getAllPresets();
      allPresets.forEach((preset) => {
        expect(durations[preset.duration]).toBeDefined();
      });
    });

    it('all presets have valid easing keys', () => {
      const allPresets = getAllPresets();
      allPresets.forEach((preset) => {
        expect(easings[preset.easing]).toBeDefined();
      });
    });
  });
});
