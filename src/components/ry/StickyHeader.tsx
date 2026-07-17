// StickyHeader — port of the design's large collapsing tab header
// (components.jsx StickyHeader + `.ry-app-bar` / `.ry-sticky-head` CSS).
//
// The design's single component splits in RN into two pieces driven by one
// Reanimated scrollY shared value:
//
//   const { scrollY, scrollHandler } = useStickyHeaderScroll();
//   <View style={{ flex: 1 }}>
//     <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
//       <StickyHeaderHero title="Wallet" support="…" scrollY={scrollY} />
//       <RyPage>…</RyPage>
//     </Animated.ScrollView>
//     <StickyHeader title="Wallet" trailing={<BellButton />} scrollY={scrollY} />
//   </View>
//
// StickyHeader = the absolutely-positioned top app bar (fades to frosted
// glass as content scrolls under it; the compact title fades/slides in).
// StickyHeaderHero = the large 34px title block rendered as the FIRST child
// of the scroll content (it pads itself below the bar and fades out).
//
// Collapse curve (traced from the design):
//   fade   = clamp((y - 28) / 36, 0, 1)   — bar bg/title opacity
//   heroOp = max(0, 1 - y / 80)           — hero opacity
//   trailing scale 1.34 → 1, translateY 12 → 0 as it collapses.

import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRyTheme } from '@/src/theme/useRyTheme';

import { ryFont } from './typography';

/** Height of the app bar's content strip below the status-bar inset. */
export const STICKY_HEADER_BAR_HEIGHT = 50;

export function useStickyHeaderScroll(): {
  scrollY: SharedValue<number>;
  scrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
} {
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  return { scrollY, scrollHandler };
}

/** Total bar height (safe-area inset + bar strip) = hero top offset. */
export function useStickyHeaderOffset(): number {
  const insets = useSafeAreaInsets();
  return insets.top + STICKY_HEADER_BAR_HEIGHT;
}

export type StickyHeaderProps = {
  /** Compact bar title (and hero title when it is a plain string). */
  title: string;
  /** Optional small uppercase line in the bar's left slot (non-Q3 tabs). */
  subtitle?: string;
  /** Right slot — e.g. <BellButton/>. Scales 1.34x while expanded. */
  trailing?: React.ReactNode;
  scrollY: SharedValue<number>;
  style?: StyleProp<ViewStyle>;
};

/**
 * The pinned top app bar. Render it AFTER (on top of) the scroll view.
 */
export function StickyHeader({ title, subtitle, trailing, scrollY, style }: StickyHeaderProps) {
  const { colors, dark } = useRyTheme();
  const insets = useSafeAreaInsets();

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [28, 64], [0, 1], Extrapolation.CLAMP),
  }));
  const solidStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [28, 64], [1, 0], Extrapolation.CLAMP),
  }));
  const titleStyle = useAnimatedStyle(() => {
    const fade = interpolate(scrollY.value, [28, 64], [0, 1], Extrapolation.CLAMP);
    return {
      opacity: fade,
      transform: [{ translateY: (1 - fade) * 6 }],
    };
  });
  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [28, 64], [1, 0], Extrapolation.CLAMP),
  }));
  const trailingStyle = useAnimatedStyle(() => {
    const fade = interpolate(scrollY.value, [28, 64], [0, 1], Extrapolation.CLAMP);
    return {
      transform: [
        { translateY: 12 * (1 - fade) },
        { scale: 1 + 0.34 * (1 - fade) },
      ],
    };
  });

  return (
    <View
      style={[
        styles.bar,
        {
          height: insets.top + STICKY_HEADER_BAR_HEIGHT,
          paddingTop: insets.top,
        },
        style,
      ]}
      pointerEvents="box-none">
      {/* Expanded: opaque page background (invisible against the page). */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.bgDefault }, solidStyle]}
      />
      {/* Collapsed: frosted glass + hairline. */}
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, fadeStyle]}>
        <BlurView
          intensity={48}
          tint={dark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
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

      <View style={styles.barRow} pointerEvents="box-none">
        <View style={styles.barSide}>
          {subtitle ? (
            <Animated.Text
              numberOfLines={1}
              style={[ryFont('600'), styles.barSubtitle, { color: colors.fgSecondary }, subtitleStyle]}>
              {subtitle.toUpperCase()}
            </Animated.Text>
          ) : null}
        </View>
        <Animated.Text
          numberOfLines={1}
          style={[ryFont('700'), styles.barTitle, { color: colors.fgPrimary }, titleStyle]}
          pointerEvents="none">
          {title}
        </Animated.Text>
        <View style={[styles.barSide, styles.barTrailing]}>
          {trailing ? <Animated.View style={trailingStyle}>{trailing}</Animated.View> : null}
        </View>
      </View>
    </View>
  );
}

export type StickyHeaderHeroProps = {
  /** Large title — string (34/700) or custom node (metric tabs). */
  title: React.ReactNode;
  /** Support line under the title (14, secondary). */
  support?: string;
  /** `.ry-sticky-head.metric` — 42px tabular-nums title. */
  metric?: boolean;
  scrollY: SharedValue<number>;
  style?: StyleProp<ViewStyle>;
};

/**
 * The large hero title block. Render as the FIRST child of the scroll
 * content — it pads itself below the pinned bar.
 */
export function StickyHeaderHero({ title, support, metric = false, scrollY, style }: StickyHeaderHeroProps) {
  const { colors } = useRyTheme();
  const offset = useStickyHeaderOffset();

  const heroStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 80], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <View style={[{ paddingTop: offset }, style]}>
      <Animated.View style={[styles.hero, heroStyle]}>
        {typeof title === 'string' || typeof title === 'number' ? (
          <Text
            style={[
              ryFont('700'),
              metric ? styles.heroTitleMetric : styles.heroTitle,
              { color: colors.fgPrimary },
            ]}>
            {title}
          </Text>
        ) : (
          <View style={styles.heroTitleBox}>{title}</View>
        )}
        {support ? (
          <Text style={[ryFont('400'), styles.heroSupport, { color: colors.fgSecondary }]}>
            {support}
          </Text>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  barRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  barSide: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 36,
    flexShrink: 1,
  },
  barTrailing: {
    justifyContent: 'flex-end',
    flexShrink: 0,
  },
  barSubtitle: {
    fontSize: 12,
    letterSpacing: 12 * 0.04,
  },
  barTitle: {
    position: 'absolute',
    left: '20%',
    right: '20%',
    bottom: 8,
    textAlign: 'center',
    fontSize: 17,
    letterSpacing: 17 * -0.01,
  },
  hero: {
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 36,
    letterSpacing: 34 * -0.02,
    marginTop: 4,
    marginBottom: 6,
  },
  heroTitleMetric: {
    fontSize: 42,
    lineHeight: 44,
    letterSpacing: 42 * -0.02,
    marginTop: 4,
    marginBottom: 6,
    fontVariant: ['tabular-nums'],
  },
  heroTitleBox: {
    marginTop: 4,
    marginBottom: 6,
  },
  heroSupport: {
    fontSize: 14,
    lineHeight: 14 * 1.4,
    maxWidth: '90%',
  },
});
