import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { ResursButton } from './ResursButton';

const meta = {
  title: 'Buttons/ResursButton',
  component: ResursButton,
  argTypes: {
    appearance: {
      control: 'radio',
      options: ['elevated', 'neumorphic'],
    },
  },
  parameters: {
    a11y: {
      test: 'error',
    },
  },
} satisfies Meta<typeof ResursButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    mode: 'contained',
    children: 'Primary action',
  },
};

export const Outlined: Story = {
  args: {
    mode: 'outlined',
    children: 'Secondary action',
  },
};

export const Elevated: Story = {
  args: {
    mode: 'contained',
    children: 'Primary action',
    appearance: 'elevated',
  },
};

export const NeumorphicComparison: Story = {
  args: { children: 'Primary (standard)' },
  render: () => (
    <View style={{ gap: 16 }}>
      <ResursButton mode="contained">Primary (standard)</ResursButton>
      <ResursButton mode="outlined">Secondary (neumorphic)</ResursButton>
      <ResursButton mode="outlined" appearance="elevated">
        Secondary (standard)
      </ResursButton>
    </View>
  ),
};

export const Disabled: Story = {
  args: {
    mode: 'contained',
    disabled: true,
    children: 'Disabled',
  },
};

/** Example story configured for automated a11y checks in browser Storybook + CI. */
export const AccessiblePrimary: Story = {
  args: {
    mode: 'contained',
    children: 'Pay invoice',
    accessibilityLabel: 'Pay invoice',
    accessibilityHint: 'Opens the payment flow',
  },
  parameters: {
    a11y: {
      test: 'error',
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
    docs: {
      description: {
        story:
          'Use explicit accessibilityLabel and accessibilityHint for screen readers. This story fails CI if axe detects violations.',
      },
    },
  },
};
