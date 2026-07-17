import type { Meta, StoryObj } from '@storybook/react-native';

import { ResursButton } from '../buttons/ResursButton';
import { ResursCard } from '../cards/ResursCard';
import { ScreenLayout } from './ScreenLayout';

const meta = {
  title: 'Layout/ScreenLayout',
  component: ScreenLayout,
} satisfies Meta<typeof ScreenLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <ScreenLayout title="Wallet" subtitle="Good morning">
      <ResursCard
        title="Resurs Gold"
        subtitle="Credit account"
        description="Available balance: 12 450 kr"
      />
      <ResursButton mode="contained">Make a payment</ResursButton>
    </ScreenLayout>
  ),
};

export const WithHeaderAction: Story = {
  args: { children: null },
  render: () => (
    <ScreenLayout
      title="Merchants"
      subtitle="Discover partners"
      headerRight={<ResursButton mode="text">Filter</ResursButton>}>
      <ResursCard
        title="Elgiganten"
        description="Pay in parts at your favourite electronics store."
      />
    </ScreenLayout>
  ),
};
