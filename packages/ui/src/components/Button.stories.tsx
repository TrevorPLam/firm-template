// AI-META-BEGIN
// 
// AI-META: React component: Button.stories
// OWNERSHIP: packages/ui (shared UI components)
// ENTRYPOINTS: Imported by pages and other components
// DEPENDENCIES: React
// DANGER: None identified
// CHANGE-SAFETY: Props and styling: generally safe. Logic changes: test thoroughly
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

/**
 * Button Component Stories
 * 
 * Interactive documentation and testing for the Button component.
 * Demonstrates all variants, sizes, and states.
 * 
 * @see packages/ui/src/components/Button.tsx
 */

import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

// Meta configuration for Button stories
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and built-in accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'text'],
      description: 'Visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * Primary button - Main call-to-action style
 * Use for primary actions like form submissions or main navigation.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Get Started',
  },
};

/**
 * Secondary button - Alternative style
 * Use for secondary actions or when primary button is already present.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    children: 'Learn More',
  },
};

/**
 * Text button - Minimal style
 * Use for tertiary actions or inline links.
 */
export const Text: Story = {
  args: {
    variant: 'text',
    size: 'medium',
    children: 'Cancel',
  },
};

/**
 * Small size button
 * Use in compact layouts or alongside smaller text.
 */
export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Small Button',
  },
};

/**
 * Large size button
 * Use for hero sections or when button needs more prominence.
 */
export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large Button',
  },
};

/**
 * Disabled button
 * Demonstrates disabled state across all variants.
 */
export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Disabled Button',
    disabled: true,
  },
};

/**
 * With onClick handler
 * Demonstrates button with click interaction.
 */
export const WithClickHandler: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Click Me',
    onClick: () => alert('Button clicked!'),
  },
};

/**
 * All variants showcase
 * Visual comparison of all button variants side by side.
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="text">Text</Button>
    </div>
  ),
};

/**
 * All sizes showcase
 * Visual comparison of all button sizes side by side.
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};
