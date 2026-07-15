import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { ResursQuickLink } from './ResursQuickLink';
import { WalletQuickLinks } from './WalletQuickLinks';

const meta = {
  title: 'Quick links/WalletQuickLinks',
  component: WalletQuickLinks,
} satisfies Meta<typeof WalletQuickLinks>;

export default meta;

type Story = StoryObj<typeof meta>;

const canvasBackground = { backgroundColor: '#F5F5F5', padding: 16 };

export const InlineTitleLayout: Story = {
  args: {},
  render: () => (
    <View style={[canvasBackground, { gap: 16 }]}>
      <ResursQuickLink
        label="Invoices"
        metadata={3}
        detail="2 450 kr att betala"
        icon="file-document-outline"
        iconActionLabel="Pay"
        expanded
      />
      <ResursQuickLink
        label="Purchases"
        metadata={12}
        detail="8 320 kr denna månad"
        icon="shopping-outline"
        iconActionLabel="Handle"
        expanded
      />
      <ResursQuickLink
        label="Budget"
        trend="up"
        detail="12 800 kr i sparande"
        icon="chart-pie"
        iconActionLabel="Plan"
        expanded
      />
    </View>
  ),
};

export const Default: Story = {
  args: {},
  render: () => (
    <View style={canvasBackground}>
      <WalletQuickLinks onNavigate={(id) => console.log('Navigate to', id)} />
    </View>
  ),
};

export const BudgetExpanded: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default row with budget expanded: mint card and primary "Plan" pill.',
      },
    },
  },
  render: () => (
    <View style={canvasBackground}>
      <WalletQuickLinks
        defaultExpandedId="budget"
        onNavigate={(id) => console.log('Navigate to', id)}
      />
    </View>
  ),
};

export const PurchasesExpanded: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default row with purchases expanded: mint card and primary "Handle" pill.',
      },
    },
  },
  render: () => (
    <View style={canvasBackground}>
      <WalletQuickLinks
        defaultExpandedId="purchases"
        onNavigate={(id) => console.log('Navigate to', id)}
      />
    </View>
  ),
};

export const InvoicesExpanded: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default row with invoices expanded: mint card and primary "Pay" pill.',
      },
    },
  },
  render: () => (
    <View style={canvasBackground}>
      <WalletQuickLinks
        defaultExpandedId="invoices"
        onNavigate={(id) => console.log('Navigate to', id)}
      />
    </View>
  ),
};
