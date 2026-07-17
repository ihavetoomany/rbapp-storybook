// ActivityInvoiceModel — THE default Q3 Activity tab ("invoice card model ·
// Sara", activity-invoice-model.jsx). Welcome header, invoice/purchases
// hero, part-pay upsell, To pay card stack, cross-sell promo, Handled list,
// Explore and Need-help footer.

import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AlertBanner,
  ExploreList,
  HelpSupport,
  PromoCard,
  RyCard,
  RyPage,
  SectionTitle,
  StickyHeader,
  StickyHeaderHero,
  useStickyHeaderScroll,
} from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { RY_TODAY } from '@/src/data';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { usePersona, useStatusOverride } from '@/src/tweaks/TweaksProvider';

import { ActivityBell } from './ActivityBell';
import { ActivityHeroCard, HERO_IMAGES } from './ActivityHeroCard';
import { ImCard, ImList, ImStack } from './ImCard';
import { ImPartPayOverlay } from './ImPartPayOverlay';
import { InvoiceHeroButton } from './InvoiceHeroButton';
import {
  allPurchasesOf,
  buildInvoiceModel,
  imFmt,
  useImCards,
  type ImCardData,
} from './invoiceModel';
import { featuredDiscoverCard } from './featuredDiscover';

export function ActivityInvoiceModel() {
  const { colors } = useRyTheme();
  const { t } = useT();
  const persona = usePersona();
  const statusOverride = useStatusOverride();
  const insets = useSafeAreaInsets();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();

  const { toPay, handled } = useImCards();

  const toPayTotal = toPay.reduce((s, c) => s + c.amount, 0);
  const toPayCount = toPay.length;
  const overdueCount = toPay.filter((c) => c.state === 'overdue').length;

  // Purchases last 30 days — shown in the hero when no invoices to pay.
  const purchasesThisMonth = useMemo(() => {
    const now = new Date(RY_TODAY).getTime();
    let total = 0;
    let count = 0;
    persona.products.forEach((p) => {
      (p.purchases || []).forEach((px) => {
        if (px.type === 'refund') return;
        const dd = (now - new Date(px.date).getTime()) / 86400000;
        if (dd >= 0 && dd <= 30) {
          total += px.amount ? px.amount.amount : 0;
          count++;
        }
      });
    });
    return { total, count };
  }, [persona]);

  const heroSub =
    overdueCount > 0
      ? t('hero.sub.overdue', overdueCount, toPayCount)
      : t('hero.sub.normal', toPayCount);

  // Invoice model for the savings-only fallback hero (design q4Model).
  const model = useMemo(
    () => buildInvoiceModel(persona, statusOverride),
    [persona, statusOverride],
  );

  // Purchases eligible for part-pay (>= 1000 kr).
  const partPayPurchases = useMemo(
    () =>
      allPurchasesOf(persona).filter(
        (tx) => tx.type !== 'refund' && tx.amount && tx.amount.amount >= 1000,
      ),
    [persona],
  );
  const [partPayOpen, setPartPayOpen] = useState(false);
  const [promoDismissed, setPromoDismissed] = useState(false);

  const featuredDiscover = featuredDiscoverCard(t);

  const openInvoice = (c: ImCardData) =>
    router.push({ pathname: '/im-invoice/[cardId]', params: { cardId: c.id } });
  const openWallet = () => router.navigate('/(tabs)/wallet');
  const openDiscover = () => router.navigate('/(tabs)/discover');

  const hasAny = toPay.length > 0 || handled.length > 0 || purchasesThisMonth.count > 0;

  return (
    <View style={[styles.screen, { backgroundColor: colors.bgDefault }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 28) + 84 }}
        showsVerticalScrollIndicator={false}>
        <StickyHeaderHero title={t('welcome')} scrollY={scrollY} />
        <RyPage>
          {/* ── Invoice / Purchases hero ── */}
          {hasAny ? (
            <ActivityHeroCard
              tone="due"
              image={HERO_IMAGES.planbok}
              imageTop={-44}
              label={toPay.length > 0 ? t('hero.label') : t('hero.label.purchases')}
              amountText={imFmt(toPay.length > 0 ? toPayTotal : purchasesThisMonth.total)}
              currency="kr"
              sub={
                toPay.length > 0 ? heroSub : t('hero.sub.purchases', purchasesThisMonth.count)
              }
              onPress={toPay.length === 0 ? openWallet : undefined}
              borderWidth={2}
              cardStyle={{ marginBottom: 20 }}
              style={{ marginTop: 10, marginBottom: 4 }}
            />
          ) : null}

          {/* ── Part-pay upsell alert ── */}
          {toPay.length === 0 &&
          (toPay.length + handled.length > 0 || purchasesThisMonth.count === 0) &&
          partPayPurchases.length > 0 ? (
            <Pressable onPress={() => setPartPayOpen(true)}>
              <AlertBanner
                variant="info"
                icon="fa-circle-info"
                title={t('banner.partpay_upsell_title')}
                body={t('banner.partpay_upsell_body', partPayPurchases.length)}
                style={{ marginTop: 4, marginBottom: 12 }}
              />
            </Pressable>
          ) : null}

          <ImPartPayOverlay
            open={partPayOpen}
            onClose={() => setPartPayOpen(false)}
            purchases={partPayPurchases}
          />

          {/* ── Empty states ── */}
          {toPay.length === 0 && handled.length === 0 ? (
            model.savingsBalance ? (
              <InvoiceHeroButton model={model} onOpen={openWallet} />
            ) : purchasesThisMonth.count > 0 ? (
              <AlertBanner
                variant="info"
                title={t('alert.purchases_pending.title')}
                body={t('alert.purchases_pending.body')}
                style={{ marginTop: 4, marginBottom: 16 }}
              />
            ) : (
              <RyCard style={{ padding: 20, marginBottom: 16 }}>
                <Text style={[ryFont('400'), styles.introText, { color: colors.fgSecondary }]}>
                  {t('activity.empty_intro')}
                </Text>
              </RyCard>
            )
          ) : null}

          {/* ── To pay — individual cards, sorted by urgency ── */}
          {toPay.length > 0 ? (
            <>
              <SectionTitle style={{ marginTop: 0 }}>{t('section.topay')}</SectionTitle>
              <ImStack>
                {toPay.map((c) => (
                  <ImCard key={c.id} card={c} stacked onPress={openInvoice} />
                ))}
              </ImStack>
            </>
          ) : null}

          {/* ── Cross-sell promo card ── */}
          {!promoDismissed ? (
            <PromoCard
              card={featuredDiscover}
              onDismiss={() => setPromoDismissed(true)}
              onOpen={openDiscover}
              style={{ marginTop: 24, marginBottom: 24 }}
            />
          ) : null}

          {/* ── Handled ── */}
          {handled.length > 0 ? (
            <>
              <SectionTitle>{t('section.handled')}</SectionTitle>
              <ImList>
                {handled.map((c, i) => (
                  <ImCard
                    key={c.id}
                    card={c}
                    onPress={openInvoice}
                    last={i === handled.length - 1}
                  />
                ))}
              </ImList>
            </>
          ) : null}

          {/* ── Explore (always shown, just above Need help) ── */}
          <SectionTitle style={{ marginTop: 16 }}>{t('section.explore')}</SectionTitle>
          <ExploreList onOpen={openDiscover} />

          <HelpSupport />
        </RyPage>
      </Animated.ScrollView>

      <StickyHeader
        title={t('welcome')}
        subtitle={t('activity.subtitle')}
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
});
