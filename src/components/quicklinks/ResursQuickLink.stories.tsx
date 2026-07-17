import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { ResursQuickLink } from './ResursQuickLink';
import { WalletQuickLinks } from './WalletQuickLinks';

const meta = {
  title: 'Quick links/ResursQuickLink',
  component: ResursQuickLink,
} satisfies Meta<typeof ResursQuickLink>;

export default meta;

type Story = StoryObj<typeof meta>;

const canvasBackground = { backgroundColor: '#F5F5F5', padding: 16 };

export const Single: Story = {
  args: {
    label: 'Invoices',
    metadata: 3,
    detail: '2 450 kr att betala',
    icon: 'file-document-outline',
    iconActionLabel: 'Pay',
    expanded: true,
  },
  decorators: [
    (Story) => (
      <View style={[canvasBackground, { width: 112 }]}>
        <Story />
      </View>
    ),
  ],
};

export const Collapsed: Story = {
  args: {
    label: 'Invoices',
    metadata: 3,
    detail: '2 450 kr att betala',
    icon: 'file-document-outline',
    expanded: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Collapsed: title on row 1, count "(3)" on row 2.',
      },
    },
  },
  decorators: [
    (Story) => (
      <View style={[canvasBackground, { width: 96 }]}>
        <Story />
      </View>
    ),
  ],
};

export const CollapsedPurchases: Story = {
  args: {
    label: 'Purchases',
    metadata: 12,
    detail: '8 320 kr denna månad',
    icon: 'shopping-outline',
    expanded: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Collapsed narrow tile: title may wrap to two lines; count stays on row 2.',
      },
    },
  },
  decorators: [
    (Story) => (
      <View style={[canvasBackground, { width: 96 }]}>
        <Story />
      </View>
    ),
  ],
};

export const CollapsedBudgetTrendUp: Story = {
  args: {
    label: 'Budget',
    trend: 'up',
    detail: '12 800 kr i sparande',
    icon: 'chart-pie',
    expanded: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Collapsed budget: title on row 1, trend arrow on row 2.',
      },
    },
  },
  decorators: [
    (Story) => (
      <View style={[canvasBackground, { width: 96 }]}>
        <Story />
      </View>
    ),
  ],
};

export const Expanded: Story = {
  args: {
    label: 'Invoices',
    metadata: 3,
    detail: '2 450 kr att betala',
    icon: 'file-document-outline',
    iconActionLabel: 'Pay',
    expanded: true,
  },
  decorators: [
    (Story) => (
      <View style={[canvasBackground, { width: 160 }]}>
        <Story />
      </View>
    ),
  ],
};

export const ExpandedVsCollapsed: Story = {
  args: { label: 'Invoices', icon: 'file-document-outline' },
  parameters: {
    docs: {
      description: {
        story:
          'Side-by-side: collapsed white elevated tile vs expanded mint card with primary action pill.',
      },
    },
  },
  render: () => (
    <View style={[canvasBackground, { flexDirection: 'row', gap: 12, flexWrap: 'wrap' }]}>
      <View style={{ width: 96 }}>
        <ResursQuickLink
          label="Invoices"
          metadata={3}
          detail="2 450 kr att betala"
          icon="file-document-outline"
          expanded={false}
        />
      </View>
      <View style={{ width: 160 }}>
        <ResursQuickLink
          label="Invoices"
          metadata={3}
          detail="2 450 kr att betala"
          icon="file-document-outline"
          iconActionLabel="Pay"
          expanded
        />
      </View>
      <View style={{ width: 96 }}>
        <ResursQuickLink
          label="Budget"
          trend="up"
          detail="12 800 kr i sparande"
          icon="chart-pie"
          expanded={false}
        />
      </View>
      <View style={{ width: 120 }}>
        <ResursQuickLink
          label="Budget"
          trend="up"
          detail="12 800 kr i sparande"
          icon="chart-pie"
          iconActionLabel="Plan"
          expanded
        />
      </View>
    </View>
  ),
};

export const PurchasesExpanded: Story = {
  args: {
    label: 'Purchases',
    metadata: 12,
    detail: '8 320 kr denna månad',
    icon: 'shopping-outline',
    iconActionLabel: 'Handle',
    expanded: true,
  },
  decorators: [
    (Story) => (
      <View style={[canvasBackground, { width: 160 }]}>
        <Story />
      </View>
    ),
  ],
};

export const BudgetTrendUp: Story = {
  args: {
    label: 'Budget',
    trend: 'up',
    detail: '12 800 kr i sparande',
    icon: 'chart-pie',
    iconActionLabel: 'Plan',
    expanded: true,
  },
  decorators: [
    (Story) => (
      <View style={[canvasBackground, { width: 120 }]}>
        <Story />
      </View>
    ),
  ],
};

export const BudgetTrendDown: Story = {
  args: {
    label: 'Budget',
    trend: 'down',
    detail: '12 800 kr i sparande',
    icon: 'chart-pie',
    iconActionLabel: 'Plan',
    expanded: true,
  },
  decorators: [
    (Story) => (
      <View style={[canvasBackground, { width: 140 }]}>
        <Story />
      </View>
    ),
  ],
};

export const BudgetTrendFlat: Story = {
  args: {
    label: 'Budget',
    trend: 'flat',
    detail: '12 800 kr i sparande',
    icon: 'chart-pie',
    iconActionLabel: 'Plan',
    expanded: true,
  },
  decorators: [
    (Story) => (
      <View style={[canvasBackground, { width: 140 }]}>
        <Story />
      </View>
    ),
  ],
};

export const AllExpandedTypes: Story = {
  args: { label: 'Invoices', icon: 'file-document-outline' },
  render: () => (
    <View style={[canvasBackground, { flexDirection: 'row', gap: 12 }]}>
      <View style={{ flex: 2 }}>
        <ResursQuickLink
          label="Invoices"
          metadata={3}
          detail="2 450 kr att betala"
          icon="file-document-outline"
          iconActionLabel="Pay"
          expanded
        />
      </View>
      <View style={{ flex: 1 }}>
        <ResursQuickLink
          label="Purchases"
          metadata={12}
          icon="shopping-outline"
          expanded={false}
        />
      </View>
      <View style={{ flex: 1 }}>
        <ResursQuickLink label="Budget" trend="flat" icon="chart-pie" expanded={false} />
      </View>
    </View>
  ),
};

export const InvoicesWithPayAction: Story = {
  args: {
    label: 'Invoices',
    metadata: 3,
    detail: '2 450 kr att betala',
    icon: 'file-document-outline',
    iconActionLabel: 'Pay',
    expanded: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Expanded invoices: full mint card (primaryContainer) with primary pill showing "Pay" and white icon/text.',
      },
    },
  },
  decorators: [
    (Story) => (
      <View style={[canvasBackground, { width: 160 }]}>
        <Story />
      </View>
    ),
  ],
};

export const PurchasesWithHandleAction: Story = {
  args: {
    label: 'Purchases',
    metadata: 12,
    detail: '8 320 kr denna månad',
    icon: 'shopping-outline',
    iconActionLabel: 'Handle',
    expanded: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Expanded purchases: full mint card with primary pill showing "Handle" and white icon/text.',
      },
    },
  },
  decorators: [
    (Story) => (
      <View style={[canvasBackground, { width: 160 }]}>
        <Story />
      </View>
    ),
  ],
};

export const BudgetWithPlanAction: Story = {
  args: {
    label: 'Budget',
    trend: 'up',
    detail: '12 800 kr i sparande',
    icon: 'chart-pie',
    iconActionLabel: 'Plan',
    expanded: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Expanded budget: full mint card with primary pill showing "Plan" and white icon/text.',
      },
    },
  },
  decorators: [
    (Story) => (
      <View style={[canvasBackground, { width: 120 }]}>
        <Story />
      </View>
    ),
  ],
};

export const WalletRow: Story = {
  args: { label: 'Invoices', icon: 'file-document-outline' },
  render: () => (
    <View style={canvasBackground}>
      <WalletQuickLinks onNavigate={(id) => console.log('Navigate to', id)} />
    </View>
  ),
};
