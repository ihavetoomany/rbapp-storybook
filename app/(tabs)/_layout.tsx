// Tabs layout — expo-router Tabs with the design's floating RyTabBar
// (`.ry-tabbar`) instead of the default bar. Four Q3 tabs:
// To handle (activity) · Wallet (wallet) · Discover (discover) ·
// My Resurs (my-resurs), with the to-handle invoice count badged on
// activity (port of app.jsx `activityBadge`, lines ~542-551).

import { Tabs } from 'expo-router';
import { useMemo, type ComponentProps } from 'react';

import { RyTabBar, type RyTabBarItem } from '@/src/components/ry';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { usePersona, useStatusOverride } from '@/src/tweaks/TweaksProvider';

const TAB_ITEMS: RyTabBarItem[] = [
  { id: 'activity', icon: 'fa-file-invoice', labelKey: 'tab.activity' },
  { id: 'wallet', icon: 'fa-wallet', labelKey: 'tab.products' },
  { id: 'discover', icon: 'fa-compass', labelKey: 'tab.discover' },
  { id: 'my-resurs', icon: 'fa-user', labelKey: 'tab.myresurs' },
];

/** Handled statuses that do NOT count toward the activity badge. */
const HANDLED = new Set(['paid', 'voided', 'scheduled', 'partiallyPaid']);

/** app.jsx `activityBadge` — to-pay invoice count, honouring the override. */
function useActivityBadge(): number {
  const persona = usePersona();
  const statusOverride = useStatusOverride();
  return useMemo(() => {
    let n = 0;
    persona.products.forEach((p) =>
      (p.paymentRequests || []).forEach((pr) => {
        if (!HANDLED.has(statusOverride || pr.status)) n++;
      }),
    );
    return n;
  }, [persona, statusOverride]);
}

/** Props of the custom `tabBar` render prop (vendored react-navigation). */
type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

function ShellTabBar({ state, navigation }: TabBarProps) {
  const activityBadge = useActivityBadge();
  const activeId = state.routes[state.index]?.name ?? 'activity';
  return (
    <RyTabBar
      items={TAB_ITEMS}
      activeId={activeId}
      onSelect={(id) => navigation.navigate(id as never)}
      badges={{ activity: activityBadge }}
    />
  );
}

export default function TabLayout() {
  const { colors } = useRyTheme();
  return (
    <Tabs
      tabBar={(props) => <ShellTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bgDefault },
      }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="activity" />
      <Tabs.Screen name="wallet" />
      <Tabs.Screen name="discover" />
      <Tabs.Screen name="my-resurs" />
    </Tabs>
  );
}
