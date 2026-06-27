import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Card } from 'react-native-paper';

import { ResursThemeProvider } from '@/src/theme';
import { ResursButton } from '../buttons/ResursButton';
import { ResursCard } from './ResursCard';

const meta = {
  title: 'Cards/ResursCard',
  component: ResursCard,
  decorators: [
    (Story) => (
      <ResursThemeProvider>
        <View style={{ padding: 16 }}>
          <Story />
        </View>
      </ResursThemeProvider>
    ),
  ],
} satisfies Meta<typeof ResursCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Resurs Gold',
    subtitle: 'Credit account',
    description: 'Available balance: 12 450 kr',
  },
};

export const WithActions: Story = {
  args: {},
  render: () => (
    <ResursCard title="Resurs Gold" subtitle="Credit account">
      <Card.Actions>
        <ResursButton mode="text">Details</ResursButton>
        <ResursButton mode="contained">Pay</ResursButton>
      </Card.Actions>
    </ResursCard>
  ),
};
