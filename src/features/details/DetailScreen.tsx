// DetailScreen — shared scaffold for every detail route: bgDefault screen,
// scrolling `.ry-page` content under an overlaid CompactHeader (frosted on
// scroll), back = router.back(). EntityFallback renders when a route id
// can't be resolved from the persona.

import { router, Stack } from 'expo-router';
import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CompactHeader,
  EmptyState,
  RyPage,
  useCompactHeaderOffset,
  useStickyHeaderScroll,
} from '@/src/components/ry';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';

export type DetailScreenProps = {
  title: string;
  /** Right header slot (defaults to a spacer so the title stays centered). */
  trailing?: React.ReactNode;
  children?: React.ReactNode;
  /** Extra style on the page content container. */
  pageStyle?: StyleProp<ViewStyle>;
  /** Rendered outside the scroll view (dialogs / sheets). */
  overlay?: React.ReactNode;
};

export function DetailScreen({ title, trailing, children, pageStyle, overlay }: DetailScreenProps) {
  const { colors } = useRyTheme();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();
  const offset = useCompactHeaderOffset();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgDefault }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: offset, paddingBottom: insets.bottom + 24 }}>
        <RyPage style={[{ paddingTop: 0 }, pageStyle]}>{children}</RyPage>
      </Animated.ScrollView>
      <CompactHeader title={title} onBack={() => router.back()} trailing={trailing} scrollY={scrollY} />
      {overlay}
    </View>
  );
}

/** Fallback for unresolvable route ids — simple message + back button. */
export function EntityFallback({ title }: { title?: string }) {
  const { t } = useT();
  return (
    <DetailScreen title={title ?? t('detail.not_found_title')}>
      <EmptyState
        icon="fa-circle-question"
        title={t('detail.not_found_title')}
        desc={t('detail.not_found_desc')}
        cta={t('setting.back')}
        onCta={() => router.back()}
      />
    </DetailScreen>
  );
}
