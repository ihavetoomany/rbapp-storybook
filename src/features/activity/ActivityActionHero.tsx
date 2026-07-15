// ActivityActionHero — the "Wallet Hero · Bjarne" sandbox variant
// (sandbox.jsx ActivityOngoingActionHero): a prominent pay-action hero
// card (total due), lean invoice list, promo and explore rows.

import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  PaymentRequestRow,
  PromoCard,
  RyCard,
  RyPage,
  SectionTitle,
  ServiceRow,
  StickyHeader,
  StickyHeaderHero,
  useStickyHeaderScroll,
} from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { rfmt } from '@/src/data';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { useStatusOverride } from '@/src/tweaks/TweaksProvider';

import { ActivityBell } from './ActivityBell';
import { pushRoute } from './nav';
import { ActivityHeroCard, HERO_IMAGES } from './ActivityHeroCard';
import { featuredDiscoverCard } from './featuredDiscover';
import { useInvoiceModel } from './invoiceModel';

export function ActivityActionHero() {
  const { colors } = useRyTheme();
  const { t } = useT();
  const statusOverride = useStatusOverride();
  const insets = useSafeAreaInsets();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();

  const { currentPRs, handledPRs, overdueCount, dueSoon } = useInvoiceModel();
  const totalDue = currentPRs.reduce((s, pr) => s + pr.remainingAmount.amount, 0);

  const missedCount = useMemo(
    () =>
      statusOverride != null
        ? statusOverride === 'missed'
          ? currentPRs.length
          : 0
        : currentPRs.filter((pr) => pr.status === 'missed').length,
    [statusOverride, currentPRs],
  );

  const count = currentPRs.length;
  const has = count > 0;
  const tone =
    overdueCount > 0 || missedCount > 0
      ? 'overdue'
      : dueSoon.length > 0
        ? 'due'
        : has
          ? 'open'
          : 'clear';

  const sub =
    overdueCount > 0
      ? t('hero.sub.overdue', overdueCount, count)
      : count > 0
        ? t('ah.sub.options')
        : handledPRs.length > 0
          ? t('ihb.sub.history')
          : t('ihb.sub.nothing');

  const support =
    currentPRs.length === 0
      ? t('ah.support.clear')
      : overdueCount > 0
        ? t('ah.support.overdue', overdueCount)
        : t('ah.support.count', currentPRs.length);

  const openPR = (prId: string) => pushRoute('/payment-request/[prId]', { prId });
  const openDiscover = () => router.navigate('/(tabs)/discover');

  const promo = featuredDiscoverCard(t, t('ah.promo.cta'));

  return (
    <View style={[styles.screen, { backgroundColor: colors.bgDefault }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 28) + 84 }}
        showsVerticalScrollIndicator={false}>
        <StickyHeaderHero title={t('welcome')} support={support} scrollY={scrollY} />
        <RyPage>
          {/* ── Hero box (no invoice nav button) ── */}
          {has ? (
            <ActivityHeroCard
              tone={tone}
              image={
                overdueCount > 0 || missedCount > 0
                  ? HERO_IMAGES.planbokRed
                  : HERO_IMAGES.planbok
              }
              imageTop={-44}
              label={
                overdueCount > 0 || missedCount > 0
                  ? t('ah.label.overdue')
                  : t('ah.label.tohandle')
              }
              labelIcon={
                overdueCount > 0 || missedCount > 0
                  ? 'fa-triangle-exclamation'
                  : 'fa-file-invoice'
              }
              amountText={rfmt({ amount: totalDue, currency: 'SEK' })}
              currency="SEK"
              sub={sub}
              cardStyle={{ marginBottom: 20 }}
              style={{ marginBottom: 4 }}
            />
          ) : null}

          {/* ── Empty state ── */}
          {!has && handledPRs.length === 0 ? (
            <RyCard style={styles.emptyCard}>
              <Text style={[ryFont('400'), styles.emptyText, { color: colors.fgSecondary }]}>
                {t('ah.empty.future')}
              </Text>
            </RyCard>
          ) : null}

          {/* ── Invoice list ── */}
          {currentPRs.length > 0 ? (
            <>
              <SectionTitle style={{ marginTop: 0 }}>{t('ah.section.needs')}</SectionTitle>
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
          ) : null}

          {/* ── Discover promo card (same position as Default) ── */}
          <PromoCard
            card={promo}
            onOpen={openDiscover}
            style={has ? { marginVertical: 20 } : { marginBottom: 20 }}
          />

          {/* ── Handled ── */}
          {handledPRs.length > 0 ? (
            <>
              <SectionTitle>{t('section.handled')}</SectionTitle>
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

          {/* ── Explore ── */}
          <SectionTitle>{t('ah.section.explore')}</SectionTitle>
          <RyCard>
            <ServiceRow
              variant="explore"
              icon="fa-piggy-bank"
              title={t('explore.savings.title')}
              sub={t('explore.savings.sub')}
              onPress={openDiscover}
            />
            <ServiceRow
              variant="explore"
              icon="fa-house-chimney"
              title={t('explore.loan.title')}
              sub={t('explore.loan.sub')}
              onPress={openDiscover}
            />
            <ServiceRow
              variant="explore"
              icon="fa-credit-card"
              title={t('explore.card.title')}
              sub={t('explore.card.sub')}
              last
              onPress={openDiscover}
            />
          </RyCard>
        </RyPage>
      </Animated.ScrollView>

      <StickyHeader
        title={t('welcome')}
        subtitle={t('ah.subtitle')}
        trailing={<ActivityBell />}
        scrollY={scrollY}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  emptyCard: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
  },
});
