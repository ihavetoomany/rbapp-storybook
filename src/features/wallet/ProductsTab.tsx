// ProductsTab — the Wallet tab (tabs.jsx ProductsTab), Q3 merged wallet:
// one "My products" list over all direct + merchant products.
//   • walletLayout 'Product cards' (default) → ProductRollupCard rows
//   • walletLayout 'Large cards' → SwipeLargeCard (swipe-left to hide,
//     per-persona hidden ids persisted under `ry-hidden-lc-<personaId>`).

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BellButton,
  EmptyState,
  RyIcon,
  RyPage,
  SectionTitle,
  StickyHeader,
  StickyHeaderHero,
  useStickyHeaderScroll,
} from '@/src/components/ry';
import { ryTints } from '@/src/components/ry/tints';
import { ryFont } from '@/src/components/ry/typography';
import type { Product } from '@/src/data';
import { useNotifications } from '@/src/features/notifications/NotificationsProvider';
import { useT } from '@/src/i18n';
import { radii } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { usePersona } from '@/src/tweaks/TweaksProvider';

import { ProductRollupCard } from './ProductRollupCard';
import { SwipeLargeCard } from './SwipeLargeCard';

export type ProductsTabProps = {
  /** 'Large cards' renders the swipeable large-card layout. */
  walletLayout: 'Product cards' | 'Large cards';
};

export function ProductsTab({ walletLayout }: ProductsTabProps) {
  const { colors, dark } = useRyTheme();
  const { t } = useT();
  const persona = usePersona();
  const router = useRouter();
  const { openBell, bellDot } = useNotifications();
  const insets = useSafeAreaInsets();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();
  const tints = ryTints(dark);

  const isLarge = walletLayout === 'Large cards';
  const direct = persona.products.filter((p) => p.origin === 'direct');
  const merch = persona.products.filter((p) => p.origin === 'merchant');
  const allProducts = [...direct, ...merch];

  // Per-persona hidden-product ids (Large cards) — AsyncStorage-backed.
  const storageKey = `ry-hidden-lc-${persona.id}`;
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [showHidden, setShowHidden] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setShowHidden(false);
    AsyncStorage.getItem(storageKey)
      .then((raw) => {
        if (cancelled) return;
        try {
          setHiddenIds(new Set(raw ? (JSON.parse(raw) as string[]) : []));
        } catch {
          setHiddenIds(new Set());
        }
      })
      .catch(() => {
        if (!cancelled) setHiddenIds(new Set());
      });
    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  const persistHidden = useCallback(
    (next: Set<string>) => {
      setHiddenIds(next);
      AsyncStorage.setItem(storageKey, JSON.stringify([...next])).catch(() => {});
    },
    [storageKey],
  );
  const hideProduct = (id: string) => persistHidden(new Set(hiddenIds).add(id));
  const unhideProduct = (id: string) => {
    const next = new Set(hiddenIds);
    next.delete(id);
    persistHidden(next);
  };

  const visibleProducts = isLarge ? allProducts.filter((p) => !hiddenIds.has(p.id)) : allProducts;
  const hiddenProducts = isLarge ? allProducts.filter((p) => hiddenIds.has(p.id)) : [];

  const openProduct = (p: Product) => router.push(`/product/${p.id}` as never);
  const isEmpty = direct.length === 0 && merch.length === 0;
  const title = t('tab.products');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgDefault }}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 28) + 76 }}
        showsVerticalScrollIndicator={false}>
        <StickyHeaderHero title={title} scrollY={scrollY} />
        <RyPage>
          {isEmpty ? (
            <EmptyState
              icon="fa-circle-plus"
              title={t('wallet.empty.title')}
              desc={t('wallet.empty.desc')}
              cta={t('wallet.empty.cta')}
              onCta={() => router.push('/discover' as never)}
            />
          ) : (
            <>
              <SectionTitle style={{ marginTop: 0 }}>{t('wallet.section.products')}</SectionTitle>
              {visibleProducts.map((p) =>
                isLarge ? (
                  <SwipeLargeCard
                    key={p.id}
                    product={p}
                    ongoing
                    onPress={() => openProduct(p)}
                    onHide={() => hideProduct(p.id)}
                  />
                ) : (
                  <ProductRollupCard key={p.id} product={p} ongoing onPress={() => openProduct(p)} />
                ),
              )}
              {isLarge && hiddenProducts.length > 0 ? (
                <Pressable
                  onPress={() => setShowHidden((v) => !v)}
                  style={({ pressed }) => [
                    styles.showMore,
                    {
                      borderColor: colors.borderSubtle,
                      backgroundColor: pressed ? tints.mint100 : 'transparent',
                    },
                  ]}>
                  <RyIcon
                    name={showHidden ? 'fa-chevron-up' : 'fa-chevron-down'}
                    size={11}
                    color={colors.primaryMain}
                  />
                  <Text style={[ryFont('600'), styles.showMoreText, { color: colors.primaryMain }]}>
                    {showHidden
                      ? t('wallet.hide_hidden')
                      : t('wallet.show_hidden', hiddenProducts.length)}
                  </Text>
                </Pressable>
              ) : null}
              {isLarge && showHidden
                ? hiddenProducts.map((p) => (
                    <SwipeLargeCard
                      key={p.id}
                      product={p}
                      ongoing
                      isHidden
                      onPress={() => openProduct(p)}
                      onUnhide={() => unhideProduct(p.id)}
                    />
                  ))
                : null}
            </>
          )}
        </RyPage>
      </Animated.ScrollView>
      <StickyHeader
        title={title}
        trailing={<BellButton dot={bellDot} onPress={openBell} />}
        scrollY={scrollY}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  showMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    width: '100%',
    padding: 13,
    marginBottom: 12,
    borderRadius: radii.xl,
    borderWidth: 1,
  },
  showMoreText: {
    fontSize: 14,
  },
});
