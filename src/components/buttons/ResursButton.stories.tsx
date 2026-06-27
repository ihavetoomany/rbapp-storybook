import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { ResursThemeProvider } from '@/src/theme';
import { ResursButton } from './ResursButton';

const meta = {
  title: 'Buttons/ResursButton',
  component: ResursButton,
  decorators: [
    (Story) => (
      <ResursThemeProvider>
        <View style={{ padding: 16, gap: 12 }}>
          <Story />
        </View>
      </ResursThemeProvider>
    ),
  ],
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

export const Disabled: Story = {
  args: {
    mode: 'contained',
    disabled: true,
    children: 'Disabled',
  },
};
