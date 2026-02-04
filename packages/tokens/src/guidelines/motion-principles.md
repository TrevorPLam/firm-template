# Motion Design Principles

## Overview

Motion design brings life to interfaces, providing feedback, guiding attention, and creating delightful user experiences. This guide establishes principles for consistent, purposeful animation across the design system.

## Core Principles

### 1. Purposeful Motion

Every animation should serve a clear purpose:
- **Feedback**: Confirm user actions (button press, form submission)
- **Guidance**: Direct attention to important changes or elements
- **Continuity**: Connect related UI states and maintain context
- **Personality**: Express brand character without sacrificing usability

**Bad Example**: Spinning logo animation that serves no functional purpose and distracts from content.

**Good Example**: Subtle slide-in animation when new content loads, helping users understand what changed.

### 2. Natural and Realistic

Animations should mimic real-world physics for intuitive understanding:
- Use easing functions that reflect natural acceleration/deceleration
- Avoid perfectly linear motion (feels robotic)
- Consider weight and momentum of UI elements
- Larger elements should move slower than smaller ones

**Recommended Easings**:
- **Entering**: `easeOut` - Elements decelerate as they settle into place
- **Exiting**: `easeIn` - Elements accelerate as they leave
- **Interactive**: `easeInOut` - Smooth transitions for state changes
- **Emphasis**: `spring` or `bounce` - Add personality to important interactions

### 3. Performance First

Smooth animations are essential for quality user experience:
- Target 60fps for all animations
- Use transform and opacity (GPU-accelerated properties)
- Avoid animating layout properties (width, height, top, left)
- Test on lower-powered devices
- Respect `prefers-reduced-motion` for accessibility

**Performance Best Practices**:
```css
/* ✓ GOOD - GPU accelerated */
.element {
  transform: translateX(100px);
  opacity: 0.5;
}

/* ✗ BAD - Triggers layout */
.element {
  left: 100px;
  width: 50%;
}
```

### 4. Appropriate Duration

Animation speed should match the element's importance and size:
- **100ms** (fast): Small UI feedback (hover states, checkboxes)
- **200ms** (normal): Standard transitions (dropdowns, tooltips)
- **300ms** (moderate): Medium interactions (modals, panels)
- **400-600ms** (slow): Large or complex animations (page transitions)

**Scale by Size**:
- Small elements (icons, buttons): 100-200ms
- Medium elements (cards, forms): 200-400ms
- Large elements (panels, pages): 400-600ms

### 5. Consistency

Maintain consistent motion patterns across the application:
- Use predefined animation presets
- Keep similar interactions consistent
- Establish rhythm through staggered animations
- Document custom animations for reuse

## Animation Patterns

### Entrance Animations

Used when elements first appear:
- **Fade In**: Gentle introduction (default choice)
- **Slide In**: Directional context (where it came from)
- **Scale In**: Emphasize importance or expansion
- **Bounce In**: Playful, attention-grabbing (use sparingly)

**When to Use**:
- New content loading
- Modals and overlays
- Tooltips and popovers
- Dynamic list items

### Exit Animations

Used when elements are removed:
- **Fade Out**: Gentle removal (default choice)
- **Slide Out**: Directional context (where it's going)
- **Scale Out**: Minimize or collapse
- Should generally be faster than entrance (1.5-2x speed)

**When to Use**:
- Dismissing notifications
- Closing modals
- Removing list items
- Hiding tooltips

### State Transitions

Used for element property changes:
- Keep duration short (100-200ms)
- Use `easeInOut` for smooth transitions
- Transition all changing properties simultaneously
- Avoid jarring instant changes

**Common State Transitions**:
- Button hover/active states
- Form input focus
- Tab/navigation selection
- Toggle switches

### Loading States

Communicate progress and maintain engagement:
- **Skeleton Screens**: Show content structure while loading
- **Shimmer Effect**: Animated gradient for loading placeholders
- **Progress Bars**: Show deterministic progress
- **Spinners**: Show indeterminate progress

**Guidelines**:
- Show loading state after 300ms delay
- Use skeleton screens for predictable content
- Avoid blocking interactions unnecessarily
- Provide cancel option for long operations

### Micro-interactions

Small animations that provide immediate feedback:
- **Button Press**: Scale down slightly (0.95) + shadow change
- **Checkbox**: Checkmark draw animation
- **Switch Toggle**: Smooth slide with easing
- **Heart/Like**: Scale bounce for emphasis

**Best Practices**:
- Keep duration under 200ms
- Provide clear visual feedback
- Ensure smooth touch/click response
- Test on various input methods

## Staggered Animations

Create hierarchy and guide attention with sequential animations:
- Use 50-100ms delays between items
- Limit to 5-7 items (longer lists feel slow)
- Consider viewport visibility
- Maintain consistent direction

**Example Use Cases**:
- List item reveal
- Gallery image loading
- Feature card display
- Navigation menu items

## Accessibility Considerations

### Respect User Preferences

Always honor `prefers-reduced-motion`:
```typescript
import { shouldReduceMotion, getMotionScale } from '@repo/tokens';

// Check user preference
if (shouldReduceMotion()) {
  // Skip animations or use instant transitions
  element.style.transition = 'none';
} else {
  // Apply normal animations
  element.style.transition = 'transform 300ms ease-out';
}

// Or use motion scale
const duration = 300 * getMotionScale(); // Reduced if user prefers
```

### Guidelines:
- Never use motion for critical information
- Provide alternative indicators (color, text)
- Avoid flashing or strobing effects
- Test with screen readers
- Allow pausing/stopping animations

## Testing Motion

### Checklist:
- [ ] Animation serves a clear purpose
- [ ] Duration feels natural for element size
- [ ] Performs at 60fps on target devices
- [ ] Respects `prefers-reduced-motion`
- [ ] Consistent with similar UI patterns
- [ ] No layout thrashing or jank
- [ ] Works across browsers
- [ ] Accessible to all users

### Tools:
- Chrome DevTools Performance panel
- Browser frame rate monitors
- Real device testing
- Accessibility audits

## Common Mistakes to Avoid

1. **Over-animation**: Not everything needs to move
2. **Inconsistent timing**: Use design tokens, not arbitrary values
3. **Layout animations**: Stick to transform and opacity
4. **Ignoring performance**: Test on low-end devices
5. **Neglecting accessibility**: Always respect user preferences
6. **Too slow**: Users shouldn't wait for animations
7. **Too fast**: Animations should be perceivable
8. **No purpose**: Don't animate for the sake of animation

## Resources

- [Design Token API](../animations/motion-tokens.ts)
- [Animation Presets](../animations/presets.ts)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [Framer Motion](https://www.framer.com/motion/) - React animation library
- [GSAP](https://greensock.com/gsap/) - Professional animation library

## Examples

See the animation presets for ready-to-use implementations:
- Fade animations
- Slide animations
- Scale animations
- Rotation animations
- Loading states
- Micro-interactions

All presets follow these principles and are tested for performance and accessibility.
