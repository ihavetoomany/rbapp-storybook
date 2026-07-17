import { Platform } from 'react-native';

/** Visible height of the floating pill (excluding safe area). */
export const TAB_BAR_PILL_HEIGHT = 56;

export const TAB_BAR_PILL_HORIZONTAL_INSET = Platform.select({
  ios: 24,
  default: 16,
}) ?? 16;

/** Gap between pill bottom edge and home indicator / screen edge. */
export const TAB_BAR_PILL_BOTTOM_GAP = Platform.select({
  ios: 8,
  default: 12,
}) ?? 12;

export function getFloatingTabBarBottomOffset(safeAreaBottom: number): number {
  return TAB_BAR_PILL_BOTTOM_GAP + safeAreaBottom;
}

export function getContentBottomInsetForTabBar(
  tabBarHeight: number | undefined,
  safeAreaBottom: number,
  extraPadding = 32,
): number {
  if (Platform.OS === 'ios') {
    // NativeTabs applies scroll content insets via react-native-screens.
    if (tabBarHeight == null) {
      return extraPadding;
    }
  }

  const height = tabBarHeight ?? TAB_BAR_PILL_HEIGHT;
  return height + getFloatingTabBarBottomOffset(safeAreaBottom) + extraPadding;
}
