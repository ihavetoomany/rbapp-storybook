// ActivityCurrent — the "Current Activity" tweak variant: port of the
// design's PaymentsTab (tabs.jsx) in its Q3 / isOngoing branch. The
// segmented control, header banners and purchases segment are Q1-only and
// intentionally absent (seg is pinned to 'invoices' when isOngoing).

import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  EmptyState,
  HelpSupport,
  PaymentRequestRow,
  PromoCard,
  RyCard,
  RyIcon,
  RyPage,
  SectionTitle,
  StickyHeader,
  StickyHeaderHero,
  useStickyHeaderScroll,
} from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { RY_MERCHANTS } from '@/src/data';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { usePersona, useStatusOverride } from '@/src/tweaks/TweaksProvider';

import { ActivityBell } from './ActivityBell';
import { pushRoute } from './nav';
import { featuredDiscoverCard } from './featuredDiscover';
import { HandleSummary } from './HandleSummary';
import { InvoiceHeroButton } from './InvoiceHeroButton';
import { PurchasesHero } from './PurchasesHero';
import { allPurchasesOf, buildInvoiceModel, useInvoiceModel } from './invoiceModel';

export function ActivityCurrent() {
  const { colors } = useRyTheme();
  const { t } = useT();
  const persona = usePersona();
  const statusOverride = useStatusOverride();
  const insets = useSafeAreaInsets();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();

  const model = useInvoiceModel();
  const { allPRs, currentPRs, handledPRs } = model;

  const allPurchases = useMemo(() => allPurchasesOf(persona), [persona]);

  const isEmpty = allPRs.length === 0 && allPurchases.length === 0;
  const savingsBalance = model.savingsBalance ?? 0;
  const isSavingsOnly = isEmpty && savingsBalance > 0;
  // Ongoing summary: total of every invoice currently on the page (To Pay).
  const totalToHandle = currentPRs.reduce((s, pr) => s + pr.remainingAmount.amount, 0);

  const featuredDiscover = featuredDiscoverCard(t);

  const subtitle = isSavingsOnly
    ? t('activity.sub.savings')
    : isEmpty
      ? t('welcome')
      : t('activity.sub.topay');
  const support = isEmpty
    ? t('activity.support.empty')
    : t('activity.support.invoices', currentPRs.length);

  const openPR = (prId: string) => pushRoute('/payment-request/[prId]', { prId });
  const openTx = (txId: string, productId: string) =>
    pushRoute('/transaction/[txId]', { txId, productId });
  const openDiscover = () => router.navigate('/(tabs)/discover');

  // PurchasesHero — only when every PR belongs to a loan and purchases exist.
  const showPurchasesHero =
    allPRs.length > 0 &&
    allPRs.every((pr) => pr.product && pr.product.type === 'loan') &&
    allPurchases.some((tx) => tx.type === 'purchase');

  // Savings-only hero uses an invoice model emptied of PRs (design port).
  const savingsOnlyModel = useMemo(
    () => ({
      ...buildInvoiceModel(persona, statusOverride),
      allPRs: [],
      currentPRs: [],
      handledPRs: [],
      totalDue: 0,
      overdueCount: 0,
      dueSoon: [],
      daysToNext: null,
    }),
    [persona, statusOverride],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.bgDefault }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 28) + 84 }}
        showsVerticalScrollIndicator={false}>
        <StickyHeaderHero title={t('welcome')} support={support} scrollY={scrollY} />
        <RyPage>
          {isEmpty ? (
            isSavingsOnly ? (
              <InvoiceHeroButton model={savingsOnlyModel} />
            ) : (
              <>
                <RyCard style={{ padding: 20, marginBottom: 16 }}>
                  <Text style={[ryFont('400'), styles.introText, { color: colors.fgSecondary }]}>
                    {t('activity.empty_intro')}
                  </Text>
                </RyCard>

                <SectionTitle style={{ marginTop: 0 }}>{t('section.start')}</SectionTitle>
                <RyCard>
                  {(
                    [
                      { icon: 'fa-piggy-bank', title: 'explore.savings.title', sub: 'explore.savings.sub' },
                      { icon: 'fa-house-chimney', title: 'explore.loan.title', sub: 'explore.loan.sub' },
                      { icon: 'fa-credit-card', title: 'explore.card.title', sub: 'explore.card.sub' },
                    ] as const
                  ).map((it, i, arr) => (
                    <Pressable
                      key={it.title}
                      onPress={openDiscover}
                      style={({ pressed }) => [
                        styles.row,
                        {
                          borderBottomColor:
                            i === arr.length - 1 ? 'transparent' : colors.borderSubtle,
                          borderBottomWidth: i === arr.length - 1 ? 0 : StyleSheet.hairlineWidth,
                        },
                        pressed && { backgroundColor: colors.bgSubtle },
                      ]}>
                      <View
                        style={[styles.rowIcon, { backgroundColor: colors.primaryBackground }]}>
                        <RyIcon name={it.icon} size={15} color={colors.primaryMain} />
                      </View>
                      <View style={styles.rowBody}>
                        <Text style={[ryFont('500'), styles.rowTitle, { color: colors.fgPrimary }]}>
                          {t(it.title)}
                        </Text>
                        <Text style={[ryFont('400'), styles.rowSub, { color: colors.fgSecondary }]}>
                          {t(it.sub)}
                        </Text>
                      </View>
                      <RyIcon name="fa-chevron-right" size={12} color={colors.fgDisabled} />
                    </Pressable>
                  ))}
                </RyCard>

                <SectionTitle>{t('section.popular')}</SectionTitle>
                <RyCard>
                  {Object.values(RY_MERCHANTS)
                    .slice(0, 4)
                    .map((m, i, arr) => (
                      <Pressable
                        key={m.id}
                        onPress={openDiscover}
                        style={({ pressed }) => [
                          styles.row,
                          {
                            borderBottomColor:
                              i === arr.length - 1 ? 'transparent' : colors.borderSubtle,
                            borderBottomWidth:
                              i === arr.length - 1 ? 0 : StyleSheet.hairlineWidth,
                          },
                          pressed && { backgroundColor: colors.bgSubtle },
                        ]}>
                        <View style={[styles.rowIcon, { backgroundColor: m.brandColor }]}>
                          <Text style={[ryFont('700'), styles.rowIconLetter]}>{m.iconLetter}</Text>
                        </View>
                        <View style={styles.rowBody}>
                          <Text
                            style={[ryFont('500'), styles.rowTitle, { color: colors.fgPrimary }]}>
                            {m.name}
                          </Text>
                          <Text
                            style={[ryFont('400'), styles.rowSub, { color: colors.fgSecondary }]}>
                            {t(
                              'merchant.upto_months',
                              m.paymentPlanConfigs[m.paymentPlanConfigs.length - 1].months,
                            )}
                          </Text>
                        </View>
                        <RyIcon name="fa-plus" size={12} color={colors.primaryMain} />
                      </Pressable>
                    ))}
                </RyCard>
              </>
            )
          ) : (
            <>
              {showPurchasesHero ? (
                <PurchasesHero
                  purchases={allPurchases}
                  onOpen={() =>
                    allPurchases[0] && openTx(allPurchases[0].id, allPurchases[0].product.id)
                  }
                />
              ) : null}

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

              <PromoCard
                card={featuredDiscover}
                onOpen={openDiscover}
                style={{ marginTop: 20, marginBottom: 20 }}
              />

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
            </>
          )}

          <HelpSupport />
        </RyPage>
      </Animated.ScrollView>

      <StickyHeader
        title={t('welcome')}
        subtitle={subtitle}
        trailing={<ActivityBell />}
        scrollY={scrollY}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  introText: {
    fontSize: 14,
    lineHeight: 14 * 1.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: '100%',
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowIconLetter: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  rowBody: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 15, lineHeight: 20 },
  rowSub: { fontSize: 12, lineHeight: 16, marginTop: 2 },
});
