import { useContext } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabBarHeightContext } from 'expo-router/build/react-navigation/bottom-tabs';

import { getContentBottomInsetForTabBar } from './tabBarMetrics';

export function useContentBottomInset(extraPadding = 32): number {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useContext(BottomTabBarHeightContext);

  return getContentBottomInsetForTabBar(tabBarHeight ?? undefined, insets.bottom, extraPadding);
}
