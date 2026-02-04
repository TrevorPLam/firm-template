---
title: Accessibility Guidelines
summary: WCAG 2.1 Level AA compliance guidelines and testing procedures for inclusive design
---

# Accessibility Guidelines

## Overview

This document outlines accessibility standards, testing procedures, and best practices to ensure our applications are usable by everyone, including people with disabilities.

## Compliance Standards

### WCAG 2.1 Level AA
We aim for **WCAG 2.1 Level AA** compliance as our baseline standard:
- **Level A**: Minimum accessibility requirements
- **Level AA**: Addresses the biggest and most common barriers (our target)
- **Level AAA**: Enhanced accessibility (goal for future)

### Legal Requirements
- **ADA (Americans with Disabilities Act)**: U.S. legal requirement
- **Section 508**: Federal accessibility standards
- **European Accessibility Act**: EU requirements

## The Four Principles (POUR)

### 1. Perceivable
Information must be presentable to users in ways they can perceive.

**Guidelines:**
- Provide text alternatives for non-text content
- Provide captions and alternatives for multimedia
- Make content adaptable and distinguishable
- Ensure sufficient color contrast (4.5:1 for normal text, 3:1 for large text)

### 2. Operable
User interface components must be operable.

**Guidelines:**
- Make all functionality keyboard accessible
- Provide users enough time to read and use content
- Design content that doesn't cause seizures
- Help users navigate and find content

### 3. Understandable
Information and UI operation must be understandable.

**Guidelines:**
- Make text readable and understandable
- Make content appear and operate in predictable ways
- Help users avoid and correct mistakes

### 4. Robust
Content must be robust enough for reliable interpretation by assistive technologies.

**Guidelines:**
- Maximize compatibility with current and future user tools
- Use valid, semantic HTML
- Provide proper ARIA labels when needed

## Automated Testing

### Setting Up Tests

We use **axe-core** with **Playwright** for automated accessibility testing:

```bash
# Dependencies already installed in workspace
pnpm add -D @axe-core/playwright axe-core

# Run accessibility tests
pnpm exec playwright test tests/accessibility
```

### Test Configuration

Location: `tests/accessibility/helpers.ts`

The test helpers automatically:
- Scan for WCAG 2.1 Level A and AA violations
- Generate detailed violation reports
- Integrate with Playwright test framework

### Example Test

```typescript
import { test, checkA11y } from './helpers';

test('homepage should be accessible', async ({ page, makeAxeBuilder }) => {
  await page.goto('http://localhost:3000');
  await checkA11y(makeAxeBuilder, 'homepage');
});
```

### What Automated Tests Check

✅ **Automated checks cover (~40% of issues):**
- Color contrast ratios
- ARIA attribute validity
- Form labels and inputs
- Alt text for images
- Heading hierarchy
- Semantic HTML structure
- Keyboard accessibility (basic)
- Language declaration

❌ **Automated tests cannot check:**
- Logical tab order
- Focus management in dynamic content
- Screen reader experience
- Content readability and clarity
- Context and meaning of ARIA labels
- User experience with assistive technologies

## Manual Testing

### Keyboard Navigation Testing

**Required functionality:**
- ✓ Tab through all interactive elements
- ✓ Use Enter/Space to activate buttons and links
- ✓ Use arrow keys for menus and lists
- ✓ Press Escape to close modals and menus
- ✓ Use shortcuts (when provided)

**Test checklist:**
1. Navigate entire page using only keyboard
2. Verify visible focus indicators on all elements
3. Ensure logical tab order
4. Test that no keyboard traps exist
5. Verify all functionality is keyboard accessible

### Screen Reader Testing

**Tools:**
- **NVDA** (Windows, free): Most commonly used
- **JAWS** (Windows, paid): Industry standard
- **VoiceOver** (macOS, built-in): Apple's solution
- **TalkBack** (Android, built-in): Mobile testing

**Test checklist:**
1. Navigate by headings (H key in NVDA/JAWS)
2. Navigate by landmarks (D key)
3. Navigate by links (K key)
4. Navigate by form controls (F key)
5. Verify all content is announced correctly
6. Test form validation messages
7. Verify dynamic content updates are announced

### Visual Testing

**Zoom Testing:**
- Test at 200% zoom (WCAG requirement)
- Test at 400% zoom (enhanced)
- Verify no horizontal scrolling needed
- Ensure all content remains visible

**Color Contrast:**
- Use browser DevTools or contrast checker tools
- Verify 4.5:1 ratio for normal text
- Verify 3:1 ratio for large text (18pt+ or 14pt+ bold)
- Test with color blindness simulators

## Common Accessibility Issues

### Critical Issues

1. **Missing alt text**
   ```html
   <!-- ❌ Bad -->
   <img src="logo.png">
   
   <!-- ✅ Good -->
   <img src="logo.png" alt="Company Logo">
   ```

2. **Poor color contrast**
   ```css
   /* ❌ Bad - 2.5:1 ratio */
   color: #999;
   background: #fff;
   
   /* ✅ Good - 4.6:1 ratio */
   color: #666;
   background: #fff;
   ```

3. **Missing form labels**
   ```html
   <!-- ❌ Bad -->
   <input type="text" placeholder="Email">
   
   <!-- ✅ Good -->
   <label for="email">Email</label>
   <input id="email" type="text">
   ```

4. **Non-keyboard accessible elements**
   ```html
   <!-- ❌ Bad -->
   <div onclick="handleClick()">Click me</div>
   
   <!-- ✅ Good -->
   <button onClick="handleClick()">Click me</button>
   ```

5. **Missing page titles**
   ```html
   <!-- ❌ Bad -->
   <title>Page</title>
   
   <!-- ✅ Good -->
   <title>Contact Us | Company Name</title>
   ```

## Best Practices

### Semantic HTML

Use semantic HTML elements instead of generic divs:

```html
<!-- ✅ Good - Semantic -->
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Content...</p>
  </article>
</main>

<footer>
  <p>Copyright 2026</p>
</footer>
```

### ARIA When Needed

Use ARIA to enhance semantics when HTML alone is insufficient:

```html
<!-- ✅ Good - ARIA enhances custom widget -->
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel1">
    Tab 1
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel2">
    Tab 2
  </button>
</div>

<div id="panel1" role="tabpanel">Content 1</div>
<div id="panel2" role="tabpanel" hidden>Content 2</div>
```

### Focus Management

Manage focus for dynamic content:

```typescript
// Open modal and move focus
function openModal() {
  modal.show();
  modalHeading.focus();
}

// Close modal and restore focus
function closeModal() {
  const previouslyFocused = document.activeElement;
  modal.hide();
  previouslyFocused.focus();
}
```

### Skip Links

Provide skip navigation for keyboard users:

```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<nav>
  <!-- Navigation -->
</nav>

<main id="main-content">
  <!-- Main content -->
</main>
```

### Responsive Text

Ensure text scales properly:

```css
/* ✅ Good - Relative units */
body {
  font-size: 1rem;
}

h1 {
  font-size: 2rem;
}

/* ❌ Bad - Fixed pixels */
body {
  font-size: 16px;
}
```

## Resources

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension
- [WAVE](https://wave.webaim.org/) - Web accessibility evaluation tool
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Built into Chrome DevTools
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Screen Readers
- [NVDA](https://www.nvaccess.org/) - Free, Windows
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) - Paid, Windows
- VoiceOver - Built into macOS and iOS
- TalkBack - Built into Android

### Guidelines and Standards
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [WebAIM Articles](https://webaim.org/articles/)

### Training
- [Web Accessibility by Google (Udacity)](https://www.udacity.com/course/web-accessibility--ud891)
- [Deque University](https://dequeuniversity.com/)
- [A11ycasts with Rob Dodson](https://www.youtube.com/playlist?list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g)

## Accessibility Checklist

### Before Launch
- [ ] All images have appropriate alt text
- [ ] Color contrast meets WCAG AA standards (4.5:1)
- [ ] All functionality is keyboard accessible
- [ ] Focus indicators are visible
- [ ] Form inputs have associated labels
- [ ] Page has proper heading hierarchy (h1-h6)
- [ ] Page title is descriptive and unique
- [ ] Language is declared in HTML
- [ ] ARIA labels are used appropriately
- [ ] No keyboard traps exist
- [ ] Skip links are provided
- [ ] Error messages are clear and accessible
- [ ] Dynamic content updates are announced
- [ ] Content works at 200% zoom
- [ ] Automated tests pass
- [ ] Manual keyboard testing completed
- [ ] Screen reader testing completed

## Continuous Improvement

### Monitoring
- Run automated tests in CI/CD pipeline
- Review accessibility reports monthly
- Track and prioritize violations
- Monitor user feedback

### Training
- Provide team accessibility training
- Share accessibility resources
- Conduct regular testing sessions
- Update guidelines as needed

---

**Last Updated**: 2026-02-04  
**Version**: 1.0  
**Owner**: Quality Team
