import type { Meta, StoryObj } from '@storybook/react-native';

import { ResursChip } from './ResursChip';

const meta = {
  title: 'Chips/ResursChip',
  component: ResursChip,
} satisfies Meta<typeof ResursChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Filter: Story = {
  args: {
    children: 'All merchants',
  },
};

export const Selected: Story = {
  args: {
    children: 'Electronics',
    selected: true,
    showSelectedOverlay: true,
  },
};

export const FilterGroup: Story = {
  args: { children: 'All' },
  render: () => (
    <>
      <ResursChip selected showSelectedOverlay>
        All
      </ResursChip>
      <ResursChip>Electronics</ResursChip>
      <ResursChip>Fashion</ResursChip>
      <ResursChip>Home</ResursChip>
    </>
  ),
};
