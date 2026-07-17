// CompactHeader — port of the design's detail-view header
// (components.jsx CompactHeader + `.ry-compact-head` / `.ry-icon-btn`).
// Back chevron in a 36px frosted round button · centered 17/700 title ·
// trailing slot (or a 36px spacer so the title stays centered).
//
// Overlay usage (content scrolls underneath, frosted glass on scroll):
//
//   const { scrollY, scrollHandler } = useStickyHeaderScroll();
//   <View style={{ flex: 1 }}>
//     <Animated.ScrollView
//       onScroll={scrollHandler}
//       scrollEventThrottle={16}
//       contentContainerStyle={{ paddingTop: useCompactHeaderOffset() }}>
//       …
//     </Animated.ScrollView>
//     <CompactHeader title="Invoice" onBack={router.back} scrollY={scrollY} />
//   </View>
//
// Without `scrollY` the frosted state never engages (header stays
// transparent) — fine for non-scrolling screens.

import { BlurView } from 'expo-blur';
import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRyTheme } from '@/src/theme/useRyTheme';

import { RyIcon } from './RyIcon';
import { ryFont } from './typography';

/** Height of the header's content strip below the status-bar inset. */
export const COMPACT_HEADER_BAR_HEIGHT = 48; // 36px button + 12px bottom padding

/** Total header height (safe-area inset + strip) = content top offset. */
export function useCompactHeaderOffset(): number {
  const insets = useSafeAreaInsets();
  return insets.top + COMPACT_HEADER_BAR_HEIGHT;
}

export type CompactHeaderProps = {
  title: string;
  onBack?: () => void;
  /** Right slot; defaults to a 36px spacer (`.ry-head-spacer`). */
  trailing?: React.ReactNode;
  /** Scroll position — engages the frosted-glass state past 8px. */
  scrollY?: SharedValue<number>;
  style?: StyleProp<ViewStyle>;
};

export function CompactHeader({ title, onBack, trailing, scrollY, style }: CompactHeaderProps) {
  const { colors, dark } = useRyTheme();
  const insets = useSafeAreaInsets();

  const glassStyle = useAnimatedStyle(() => ({
    opacity: scrollY
      ? interpolate(scrollY.value, [8, 24], [0, 1], Extrapolation.CLAMP)
      : 0,
  }));

  return (
    <View
      style={[
        styles.head,
        { height: insets.top + COMPACT_HEADER_BAR_HEIGHT, paddingTop: insets.top },
        style,
      ]}
      pointerEvents="box-none">
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, glassStyle]}>
        <BlurView intensity={48} tint={dark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: dark ? 'rgba(28, 30, 34, 0.45)' : 'rgba(255, 255, 255, 0.28)',
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.35)',
            },
          ]}
        />
      </Animated.View>

      <View style={styles.row} pointerEvents="box-none">
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityLabel="Back"
            style={({ pressed }) => [
              styles.iconBtn,
              {
                backgroundColor: pressed
                  ? colors.grey100
                  : dark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(255,255,255,0.85)',
                borderColor: colors.borderSubtle,
              },
            ]}>
            <RyIcon name="fa-chevron-left" size={14} color={colors.fgPrimary} />
          </Pressable>
        ) : (
          <View style={styles.spacer} />
        )}
        <Text
          numberOfLines={1}
          style={[ryFont('700'), styles.title, { color: colors.fgPrimary }]}>
          {title}
        </Text>
        {trailing ?? <View style={styles.spacer} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: {
    flex: 1,
    fontSize: 17,
    letterSpacing: 17 * -0.01,
    textAlign: 'center',
  },
  spacer: { width: 36, height: 36, flexShrink: 0 },
});
