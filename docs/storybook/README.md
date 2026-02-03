---
title: Storybook Guide
description: Component documentation workflow using Storybook.
---

# Storybook Guide

Storybook provides interactive documentation for UI primitives and patterns.

## Setup steps

```bash
# Install Storybook dependencies in the workspace.
pnpm --filter @firm/ui storybook:install

# Run the Storybook dev server.
pnpm --filter @firm/ui storybook
```

## Writing stories

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  args: {
    variant: "primary",
  },
};

export default meta;

export const Primary: StoryObj<typeof Button> = {
  args: {
    // Inline note: keep text short for visual regression clarity.
    children: "Get started",
  },
};
```

## Accessibility notes

- Add `aria-*` attributes to stories that require them.
- Document keyboard interactions in the story description.
- Include contrast validation in the design review checklist.
