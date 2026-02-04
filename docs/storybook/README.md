---
title: Storybook Guide
description: Component documentation workflow using Storybook with build and deployment instructions.
---

# Storybook Guide

Storybook provides interactive documentation for UI primitives and patterns. This guide covers setup, development, building, and deployment workflows.

## Quick Start

### Initial Setup

```bash
# Install Storybook dependencies in the workspace (one-time setup)
pnpm --filter @repo/ui storybook:install

# Run the Storybook dev server
pnpm --filter @repo/ui storybook
```

The Storybook UI will be available at http://localhost:6006

### Build for Production

```bash
# Build static Storybook assets
pnpm --filter @repo/ui build-storybook
```

This generates a static site in `packages/ui/storybook-static/` that can be deployed to any static hosting service.

## Configuration

### Main Configuration (`packages/ui/.storybook/main.ts`)

The main configuration file defines:
- Story file locations
- Enabled addons (essentials, a11y, interactions, links)
- Framework settings (React + Vite)
- TypeScript configuration
- Documentation settings

### Preview Configuration (`packages/ui/.storybook/preview.ts`)

The preview configuration defines:
- Global parameters for all stories
- Theme switcher in toolbar
- Accessibility testing settings
- Default layouts and backgrounds

## Writing Stories

### Basic Story Structure

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

// Define meta information for the component
const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ['autodocs'], // Enable automatic documentation
  args: {
    variant: "primary",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Define individual stories
export const Primary: Story = {
  args: {
    // Inline note: keep text short for visual regression clarity
    children: "Get started",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Learn more",
  },
};
```

### Story Best Practices

1. **Use descriptive names**: Story names should clearly indicate what variant/state they showcase
2. **Include documentation**: Add descriptions using JSDoc comments or the `parameters.docs.description` field
3. **Cover all variants**: Create stories for each prop combination
4. **Test interactions**: Use the `play` function to test user interactions
5. **Keep stories focused**: Each story should demonstrate one specific use case

## CI/CD Integration

### Building in CI Pipeline

Add to your GitHub Actions workflow:

```yaml
- name: Build Storybook
  run: pnpm --filter @repo/ui build-storybook
  
- name: Upload Storybook artifacts
  uses: actions/upload-artifact@v3
  with:
    name: storybook-static
    path: packages/ui/storybook-static/
```

### Deployment Options

**Option 1: Chromatic (Recommended)**
```bash
# Install Chromatic
pnpm add -D chromatic

# Deploy to Chromatic
pnpm exec chromatic --project-token=<your-token>
```

**Option 2: GitHub Pages**
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./packages/ui/storybook-static
```

**Option 3: Vercel/Netlify**
- Build command: `pnpm --filter @repo/ui build-storybook`
- Publish directory: `packages/ui/storybook-static`

## Accessibility Testing

Storybook includes the a11y addon for automated accessibility testing:

### Features
- Automatic WCAG 2.1 AA compliance checking
- Color contrast validation
- ARIA attribute validation
- Keyboard navigation testing

### Usage
1. Open any story in Storybook
2. Click the "Accessibility" tab in the addons panel
3. Review violations and warnings
4. Fix issues in the component code
5. Re-run tests to verify fixes

### Adding Custom A11y Rules

In your story file:

```tsx
export const MyStory: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
            // Add custom thresholds or options
          },
        ],
      },
    },
  },
};
```

## Keyboard Navigation Testing

Document keyboard interactions in story descriptions:

```tsx
export const MyComponent: Story = {
  parameters: {
    docs: {
      description: {
        story: `
          **Keyboard Navigation:**
          - Tab: Move focus between elements
          - Enter/Space: Activate button
          - Escape: Close modal/dropdown
        `,
      },
    },
  },
};
```

## Access and Review Workflow

### Local Development
1. Start Storybook: `pnpm --filter @repo/ui storybook`
2. Open http://localhost:6006 in your browser
3. Navigate through components and stories
4. Test interactions and review accessibility

### Design Review Checklist
- [ ] Component matches design specifications
- [ ] All variants are documented
- [ ] Accessibility tests pass (no violations)
- [ ] Color contrast meets WCAG AA standards
- [ ] Keyboard navigation works correctly
- [ ] Responsive behavior is appropriate
- [ ] Dark/light theme support (if applicable)

### Code Review Checklist
- [ ] Story files follow naming convention (`*.stories.tsx`)
- [ ] All props are documented with controls
- [ ] Interactive stories include play functions
- [ ] Accessibility annotations are present
- [ ] JSDoc comments explain component behavior

## Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear Storybook cache
rm -rf node_modules/.cache/storybook

# Reinstall dependencies
pnpm install
```

**Type Errors**
- Ensure `@storybook/react-vite` matches your Storybook version
- Check that component types are properly exported

**Accessibility Addon Not Working**
- Verify `@storybook/addon-a11y` is in devDependencies
- Check that it's registered in `.storybook/main.ts` addons array

## Further Resources

- [Storybook Documentation](https://storybook.js.org/docs/react/get-started/introduction)
- [Accessibility Addon Guide](https://storybook.js.org/addons/@storybook/addon-a11y)
- [Writing Stories Best Practices](https://storybook.js.org/docs/react/writing-stories/introduction)
- [Testing with Storybook](https://storybook.js.org/docs/react/writing-tests/introduction)
