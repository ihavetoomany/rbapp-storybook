// PurchasesListView — port from activity-crosssell.jsx: every purchase
// across products, newest first, with part-pay affordances over 1 000 kr.

import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CompactHeader,
  EmptyState,
  RyCard,
  TransactionRow,
  useCompactHeaderOffset,
  useStickyHeaderScroll,
} from '@/src/components/ry';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { usePersona } from '@/src/tweaks/TweaksProvider';

import { allPurchasesOf, famHolderOf } from './invoiceModel';
import { pushRoute } from './nav';

export function PurchasesListView() {
  const { colors } = useRyTheme();
  const { t } = useT();
  const persona = usePersona();
  const insets = useSafeAreaInsets();
  const headerOffset = useCompactHeaderOffset();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();

  const all = useMemo(() => allPurchasesOf(persona), [persona]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.bgDefault }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: headerOffset,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 32,
        }}
        showsVerticalScrollIndicator={false}>
        {all.length === 0 ? (
          <EmptyState
            icon="fa-bag-shopping"
            title={t('empty.purchases.title')}
            desc={t('empty.purchases.desc')}
          />
        ) : (
          <RyCard>
            {all.map((tx, i) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                partPay={tx.amount.amount > 1000}
                holder={famHolderOf(tx)}
                onPress={() => pushRoute('/transaction/[txId]', { txId: tx.id, productId: tx.product.id })}
                last={i === all.length - 1}
              />
            ))}
          </RyCard>
        )}
      </Animated.ScrollView>

      <CompactHeader title={t('pl.title')} onBack={() => router.back()} scrollY={scrollY} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
