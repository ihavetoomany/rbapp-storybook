// InvoiceListView — port from activity-crosssell.jsx: the 2nd-level
// invoice list (Total-amount-to-handle summary, To pay + Handled lists).

import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CompactHeader,
  EmptyState,
  PaymentRequestRow,
  RyCard,
  SectionTitle,
  useCompactHeaderOffset,
  useStickyHeaderScroll,
} from '@/src/components/ry';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { HandleSummary } from './HandleSummary';
import { pushRoute } from './nav';
import { useInvoiceModel } from './invoiceModel';

export function InvoiceListView() {
  const { colors } = useRyTheme();
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const headerOffset = useCompactHeaderOffset();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();

  const { currentPRs, handledPRs } = useInvoiceModel();
  // Sum of every invoice currently in "To pay" — drives the summary header.
  const totalToHandle = currentPRs.reduce((s, pr) => s + pr.remainingAmount.amount, 0);

  const openPR = (prId: string) => pushRoute('/payment-request/[prId]', { prId });

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
        {currentPRs.length > 0 ? <HandleSummary total={totalToHandle} /> : null}

        {currentPRs.length === 0 ? (
          <EmptyState
            icon="fa-circle-check"
            title={t('empty.topay.title')}
            desc={t('empty.topay.desc')}
          />
        ) : (
          <>
            <SectionTitle style={{ marginTop: 0 }}>{t('section.topay')}</SectionTitle>
            <RyCard>
              {currentPRs.map((pr, i) => (
                <PaymentRequestRow
                  key={pr.id}
                  pr={pr}
                  propName={pr.displayName || pr.product.name}
                  onPress={() => openPR(pr.id)}
                  last={i === currentPRs.length - 1}
                />
              ))}
            </RyCard>
          </>
        )}

        {handledPRs.length > 0 ? (
          <>
            <SectionTitle>{t('section.handled_short')}</SectionTitle>
            <RyCard>
              {handledPRs.map((pr, i) => (
                <PaymentRequestRow
                  key={pr.id}
                  pr={pr}
                  propName={pr.displayName || pr.product.name}
                  onPress={() => openPR(pr.id)}
                  last={i === handledPRs.length - 1}
                />
              ))}
            </RyCard>
          </>
        ) : null}
      </Animated.ScrollView>

      <CompactHeader title={t('il.title')} onBack={() => router.back()} scrollY={scrollY} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
