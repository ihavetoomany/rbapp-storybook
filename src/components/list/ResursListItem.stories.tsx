import type { Meta, StoryObj } from '@storybook/react-native';
import { List } from 'react-native-paper';

import { ResursListItem } from './ResursListItem';

const meta = {
  title: 'List/ResursListItem',
  component: ResursListItem,
  decorators: [
    (Story) => (
      <List.Section>
        <Story />
      </List.Section>
    ),
  ],
} satisfies Meta<typeof ResursListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithIcon: Story = {
  args: {
    title: 'Elgiganten',
    description: 'Electronics & home appliances',
    icon: 'store',
    showChevron: true,
  },
};

export const MerchantList: Story = {
  args: { title: 'Elgiganten' },
  render: () => (
    <>
      <ResursListItem
        title="Elgiganten"
        description="Electronics"
        icon="store"
        showChevron
      />
      <ResursListItem title="Jula" description="Tools & garden" icon="store" showChevron />
      <ResursListItem title="Boozt" description="Fashion" icon="store" showChevron />
    </>
  ),
};
