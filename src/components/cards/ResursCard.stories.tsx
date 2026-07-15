import type { Meta, StoryObj } from '@storybook/react-native';
import { Card } from 'react-native-paper';
import { View } from 'react-native';

import { ResursButton } from '../buttons/ResursButton';
import { ResursCard } from './ResursCard';

const meta = {
  title: 'Cards/ResursCard',
  component: ResursCard,
  argTypes: {
    appearance: {
      control: 'radio',
      options: ['elevated', 'neumorphic'],
    },
  },
} satisfies Meta<typeof ResursCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Resurs Gold',
    subtitle: 'Credit account',
    description: 'Available balance: 12 450 kr',
    icon: 'credit-card-outline',
    appearance: 'neumorphic',
  },
};

export const Elevated: Story = {
  args: {
    title: 'Resurs Gold',
    subtitle: 'Credit account',
    description: 'Available balance: 12 450 kr',
    icon: 'credit-card-outline',
    appearance: 'elevated',
  },
};

export const Neumorphic: Story = {
  args: {
    title: 'Resurs Gold',
    subtitle: 'Credit account',
    description: 'Available balance: 12 450 kr',
    icon: 'credit-card-outline',
    appearance: 'neumorphic',
  },
};

export const NeumorphicComparison: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      <ResursCard
        appearance="elevated"
        title="Elevated"
        subtitle="Subtle drop shadow"
        description="White card with soft shadow, no border"
      />
      <ResursCard
        appearance="neumorphic"
        title="Neumorphic"
        subtitle="Soft UI experiment"
        description="Dual light/dark soft shadows"
      />
    </View>
  ),
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
