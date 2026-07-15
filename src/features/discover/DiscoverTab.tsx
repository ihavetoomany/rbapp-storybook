// DiscoverTab — the Discover tab (tabs.jsx DiscoverTab): persona offers +
// the curated Explore products merged into one promo-card list. Tapping a
// card opens PromoOfferSheet; the empty state (no products) shows the
// info box + "Start with Resurs" rows, which open ExploreUSPSheet on the
// matching product segment. Both sheets are owned locally (the design
// lifts them to the app root via window.__ryOpenOffer/__ryOpenExploreUSP,
// but all Q3 usage is from Discover/Explore surfaces).

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BellButton,
  HelpSupport,
  PromoCard,
  RyCard,
  RyIcon,
  RyPage,
  RyRow,
  ryExploreCards,
  SectionTitle,
  StickyHeader,
  StickyHeaderHero,
  useStickyHeaderScroll,
} from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import type { Offer, Product } from '@/src/data';
import { useNotifications } from '@/src/features/notifications/NotificationsProvider';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { usePersona } from '@/src/tweaks/TweaksProvider';

import { ExploreUSPSheet } from './ExploreUSPSheet';
import { PromoOfferSheet, type PromoSheetCard } from './PromoOfferSheet';

const PROMO_IMAGES = {
  shopping: require('@/assets/design/promo-shopping.png') as ImageSourcePropType,
  savings: require('@/assets/design/promo-savings.png') as ImageSourcePropType,
  loan: require('@/assets/design/promo-loan.png') as ImageSourcePropType,
  card: require('@/assets/design/promo-card.png') as ImageSourcePropType,
};

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Persona offer → promo hero image by product type (design offerImg). */
const offerImg = (p: Product): ImageSourcePropType =>
  p.origin === 'merchant'
    ? PROMO_IMAGES.shopping
    : p.type === 'savings'
      ? PROMO_IMAGES.savings
      : p.type === 'loan'
        ? PROMO_IMAGES.loan
        : PROMO_IMAGES.card;

export function DiscoverTab() {
  const { colors } = useRyTheme();
  const { t, tName, tCard, lang } = useT();
  const persona = usePersona();
  const router = useRouter();
  const { openBell, bellDot } = useNotifications();
  const insets = useSafeAreaInsets();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();

  const [offerSheet, setOfferSheet] = useState<PromoSheetCard | null>(null);
  const [exploreUSP, setExploreUSP] = useState<string | null>(null);

  // Aggregate time-limited offers across the persona's products.
  const allOffers: Array<Offer & { _product: Product }> = [];
  for (const p of persona.products) {
    for (const o of p.offers ?? []) allOffers.push({ ...o, _product: p });
  }
  const timeLimited = allOffers.filter((o) => o.type === 'offer');
  const isEmpty = persona.products.length === 0;

  // Persona offers → promo cards (shown above the curated explore products).
  const offerCards: PromoSheetCard[] = timeLimited.map((o) => ({
    key: `offer-${o._product.id}-${slugify(o.title)}`,
    label: o._product.type === 'savings' ? tCard('Savings') : tName(o._product.name),
    icon: o.icon || 'fa-gift',
    tint: '#DCC3A6',
    img: offerImg(o._product),
    headline: o.title,
    desc: o.desc,
    cta: t('disc.offer.cta'),
    productId: o._product.id,
  }));

  const promoCards: PromoSheetCard[] = [...offerCards, ...ryExploreCards(lang)];

  const title = t('tab.discover');

  const startRows: Array<{ key: string; icon: string; title: string; sub: string }> = [
    { key: 'savings', icon: 'fa-piggy-bank', title: t('disc.start.savings.t'), sub: t('disc.start.savings.s') },
    { key: 'loan', icon: 'fa-house-chimney', title: t('disc.start.loan.t'), sub: t('disc.start.loan.s') },
    { key: 'card', icon: 'fa-credit-card', title: t('disc.start.card.t'), sub: t('disc.start.card.s') },
  ];

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
            <>
              <View style={[styles.empty, { backgroundColor: colors.infoBackground }]}>
                <View style={styles.emptyIc}>
                  <RyIcon name="fa-gift" size={20} color={colors.infoDark} />
                </View>
                <Text style={[ryFont('700'), styles.emptyTitle, { color: colors.infoDark }]}>
                  {t('disc.empty.title')}
                </Text>
                <Text style={[ryFont('400'), styles.emptySub, { color: colors.infoDark }]}>
                  {t('disc.empty.sub')}
                </Text>
              </View>

              <SectionTitle>{t('section.start')}</SectionTitle>
              <RyCard>
                {startRows.map((it, i) => (
                  <RyRow
                    key={it.key}
                    icon={it.icon}
                    iconBg={colors.primaryBackground}
                    iconColor={colors.primaryMain}
                    title={it.title}
                    sub={it.sub}
                    chevron
                    last={i === startRows.length - 1}
                    onPress={() => setExploreUSP(it.key)}
                  />
                ))}
              </RyCard>

              <HelpSupport style={styles.help} />
            </>
          ) : (
            <>
              {/* Merged offers + explore products — one list, no headline. */}
              <View style={styles.promoList}>
                {promoCards.map((card) => (
                  <PromoCard key={card.key} card={card} onOpen={() => setOfferSheet(card)} />
                ))}
              </View>

              <HelpSupport style={styles.help} />
            </>
          )}
        </RyPage>
      </Animated.ScrollView>
      <StickyHeader
        title={title}
        trailing={<BellButton dot={bellDot} onPress={openBell} />}
        scrollY={scrollY}
      />

      <PromoOfferSheet
        card={offerSheet}
        onClose={() => setOfferSheet(null)}
        onCta={(card) => {
          if (card.productId) {
            setOfferSheet(null);
            router.push(`/product/${card.productId}` as never);
          }
        }}
      />
      <ExploreUSPSheet
        open={!!exploreUSP}
        initialKey={exploreUSP}
        onClose={() => setExploreUSP(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    marginTop: 4,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignItems: 'center',
  },
  emptyIc: {
    width: 48,
    height: 48,
    marginBottom: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 17,
    lineHeight: 17 * 1.3,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    lineHeight: 13 * 1.5,
    marginTop: 8,
    textAlign: 'center',
  },
  promoList: {
    marginTop: 4,
    gap: 14,
  },
  help: {
    marginTop: 40,
  },
});
