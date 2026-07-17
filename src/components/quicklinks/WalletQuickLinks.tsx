import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { type Href, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { ResursQuickLink } from './ResursQuickLink';

type QuickLinkId = 'invoices' | 'purchases' | 'budget';

type QuickLinkConfig = {
  id: QuickLinkId;
  label: string;
  metadata?: number;
  trend?: 'up' | 'down' | 'flat';
  detail: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const QUICK_LINKS: QuickLinkConfig[] = [
  {
    id: 'invoices',
    label: 'Invoices',
    metadata: 3,
    detail: '2 450 kr att betala',
    icon: 'file-document-outline',
  },
  {
    id: 'purchases',
    label: 'Purchases',
    metadata: 12,
    detail: '8 320 kr denna månad',
    icon: 'shopping-outline',
  },
  {
    id: 'budget',
    label: 'Budget',
    trend: 'up',
    detail: '12 800 kr i sparande',
    icon: 'chart-pie',
  },
];

const ICON_ACTION_LABELS: Record<QuickLinkId, string> = {
  invoices: 'Pay',
  purchases: 'Handle',
  budget: 'Plan',
};

const EXPANDED_FLEX = 2;
const COLLAPSED_FLEX = 1;

export type WalletQuickLinksProps = {
  defaultExpandedId?: QuickLinkId;
  onNavigate?: (id: QuickLinkId) => void;
};

export function WalletQuickLinks({
  defaultExpandedId = 'invoices',
  onNavigate,
}: WalletQuickLinksProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<QuickLinkId>(defaultExpandedId);

  const handlePress = useCallback(
    (link: QuickLinkConfig) => {
      if (expandedId !== link.id) {
        setExpandedId(link.id);
        return;
      }

      if (onNavigate) {
        onNavigate(link.id);
        return;
      }

      router.push(`/wallet/${link.id}` as Href);
    },
    [expandedId, onNavigate, router],
  );

  return (
    <View style={styles.row}>
      {QUICK_LINKS.map((link) => {
        const expanded = expandedId === link.id;

        return (
          <Animated.View
            key={link.id}
            layout={LinearTransition.springify().damping(26).stiffness(130)}
            style={{ flex: expanded ? EXPANDED_FLEX : COLLAPSED_FLEX }}>
            <ResursQuickLink
              label={link.label}
              metadata={link.metadata}
              trend={link.trend}
              detail={link.detail}
              icon={link.icon}
              iconActionLabel={expanded ? ICON_ACTION_LABELS[link.id] : undefined}
              expanded={expanded}
              onPress={() => handlePress(link)}
              accessibilityHint={
                expanded ? 'Tap again to open' : 'Expands this quick link'
              }
            />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
});
