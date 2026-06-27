import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Divider, List } from 'react-native-paper';

import { ResursThemeProvider } from '@/src/theme';
import { ResursListItem } from './ResursListItem';

const meta = {
  title: 'List/ResursListItem',
  component: ResursListItem,
  decorators: [
    (Story) => (
      <ResursThemeProvider>
        <View style={{ padding: 16 }}>
          <List.Section>
            <Story />
          </List.Section>
        </View>
      </ResursThemeProvider>
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
      <Divider />
      <ResursListItem
        title="Jula"
        description="Tools & garden"
        icon="store"
        showChevron
      />
      <Divider />
      <ResursListItem
        title="Boozt"
        description="Fashion"
        icon="store"
        showChevron
      />
    </>
  ),
};
