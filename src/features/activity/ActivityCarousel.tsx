// ActivityCarousel — the "Carousel" Activity variant
// (activity-carousel.jsx): a paged hero carousel (Invoices / Purchases /
// Savings / Explore), part-pay upsell, "My products" large cards with
// show-more, cross-sell promo, Explore and Need-help footer.
//
// Asset note: the design's carousel uses two uploads that are not part of
// the mirrored assets (uploads/invoices.png, uploads/budget.png); the
// invoices card uses calc.png and the savings card plantpot.png instead.

import { router } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ExploreList,
  HelpSupport,
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
import { RY_TODAY } from '@/src/data';
import { useT } from '@/src/i18n';
import { radii } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { usePersona, useStatusOverride } from '@/src/tweaks/TweaksProvider';

import { ActivityBell } from './ActivityBell';
import { pushRoute } from './nav';
import { ActivityHeroCard, HERO_IMAGES } from './ActivityHeroCard';
import { featuredDiscoverCard } from './featuredDiscover';
import { InvoiceHeroButton } from './InvoiceHeroButton';
import { buildInvoiceModel, imFmt, useImCards } from './invoiceModel';
import { ProductLargeCard } from './ProductLargeCard';

// The dark-mode text lift AlertBanner uses for the info variant (app.css).
const INFO_DARK_FG = '#B8E6FE';

export function ActivityCarousel() {
  const { colors, dark } = useRyTheme();
  const { t } = useT();
  const persona = usePersona();
  const statusOverride = useStatusOverride();
  const insets = useSafeAreaInsets();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();

  const { toPay, handled } = useImCards();

  const toPayTotal = toPay.reduce((s, c) => s + c.amount, 0);
  const toPayCount = toPay.length;
  const overdueCount = toPay.filter((c) => c.state === 'overdue').length;

  // Savings total across all deposit accounts.
  const savingsTotal = useMemo(() => {
    let total = 0;
    let count = 0;
    persona.products.forEach((p) => {
      (p.accounts || [])
        .filter((a) => a.type === 'depositAccount')
        .forEach((a) => {
          total += 'balance' in a && a.balance ? a.balance.amount : 0;
          count++;
        });
    });
    return { total, count };
  }, [persona]);

  // Purchases this calendar month.
  const purchasesThisMonth = useMemo(() => {
    const now = new Date(RY_TODAY);
    const yr = now.getFullYear();
    const mo = now.getMonth();
    let total = 0;
    let count = 0;
    persona.products.forEach((p) => {
      (p.purchases || []).forEach((px) => {
        const dd = new Date(px.date);
        if (dd.getFullYear() === yr && dd.getMonth() === mo) {
          total += px.amount ? px.amount.amount : 0;
          count++;
        }
      });
    });
    return { total, count };
  }, [persona]);

  const [showAll, setShowAll] = useState(false);
  const [promoDismissed, setPromoDismissed] = useState(false);

  const heroSub =
    overdueCount > 0
      ? t('hero.sub.overdue', overdueCount, toPayCount)
      : t('hero.sub.normal', toPayCount);

  const model = useMemo(
    () => buildInvoiceModel(persona, statusOverride),
    [persona, statusOverride],
  );

  const featuredDiscover = featuredDiscoverCard(t);

  const openWallet = () => router.navigate('/(tabs)/wallet');
  const openDiscover = () => router.navigate('/(tabs)/discover');
  const openInvoiceList = () => router.push('/invoice-list');
  const openSavings = () => router.push('/savings-graph');
  const openProduct = (productId: string) => pushRoute('/product/[productId]', { productId });

  const showCarousel =
    toPay.length > 0 || handled.length > 0 || purchasesThisMonth.count > 0 || savingsTotal.count > 0;

  const infoFg = dark ? INFO_DARK_FG : colors.infoDark;

  return (
    <View style={[styles.screen, { backgroundColor: colors.bgDefault }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 28) + 84 }}
        showsVerticalScrollIndicator={false}>
        <StickyHeaderHero title={t('welcome')} scrollY={scrollY} />
        <RyPage>
          {/* ── Hero carousel: Invoices / Purchases / Savings / Explore ── */}
          {showCarousel ? (
            <HeroCarousel
              cards={[
                {
                  label: t('hero.label'),
                  amountText: imFmt(toPayTotal),
                  sub: heroSub,
                  image: HERO_IMAGES.calc,
                  imageRight: 28,
                  onPress: openInvoiceList,
                },
                {
                  label: t('hero.label.purchases'),
                  amountText: imFmt(purchasesThisMonth.total),
                  sub: t('hero.sub.purchases', purchasesThisMonth.count),
                  image: HERO_IMAGES.planbok,
                  imageRight: 28,
                  onPress: openWallet,
                },
                {
                  label: t('hero.label.savings'),
                  amountText: imFmt(savingsTotal.total),
                  sub: t('hero.sub.savings', savingsTotal.count),
                  image: HERO_IMAGES.plantpot,
                  imageRight: 18,
                  onPress: savingsTotal.count > 0 ? openSavings : undefined,
                },
                {
                  label: t('car.explore.label'),
                  body: t('car.explore.body'),
                  image: HERO_IMAGES.planbok,
                  imageRight: 28,
                  onPress: openDiscover,
                },
              ]}
            />
          ) : null}

          {/* ── Part-pay upsell alert ── */}
          {toPay.some((c) => c.amount >= 1000) ? (
            <View style={[styles.banner, { backgroundColor: colors.infoBackground }]}>
              <RyIcon name="fa-coins" size={16} color={infoFg} style={{ paddingTop: 1 }} />
              <Text style={[ryFont('400'), styles.bannerText, { color: infoFg }]}>
                {t('banner.partpay_upsell_pre')}
                <Text style={ryFont('700')}>{t('banner.partpay_upsell_link')}</Text>
                {t('banner.partpay_upsell_post')}
              </Text>
            </View>
          ) : null}

          {/* ── Empty state ── */}
          {toPay.length === 0 && handled.length === 0 ? (
            model.savingsBalance ? (
              <InvoiceHeroButton model={model} onOpen={openSavings} />
            ) : (
              <RyCard style={{ padding: 20, marginBottom: 16 }}>
                <Text style={[ryFont('400'), styles.introText, { color: colors.fgSecondary }]}>
                  {t('activity.empty_intro')}
                </Text>
              </RyCard>
            )
          ) : null}

          {/* ── My products ── */}
          {persona.products.length > 0 ? (
            <>
              <SectionTitle style={{ marginTop: 0 }}>{t('car.section.products')}</SectionTitle>
              {(showAll ? persona.products : persona.products.slice(0, 2)).map((p) => (
                <ProductLargeCard
                  key={p.id}
                  product={p}
                  ongoing
                  onPress={() => openProduct(p.id)}
                />
              ))}
              {persona.products.length > 2 ? (
                <Pressable
                  onPress={() => setShowAll((v) => !v)}
                  style={({ pressed }) => [
                    styles.showMore,
                    { borderColor: colors.borderSubtle },
                    pressed && { backgroundColor: colors.bgSubtle },
                  ]}>
                  <RyIcon
                    name={showAll ? 'fa-chevron-up' : 'fa-chevron-down'}
                    size={11}
                    color={colors.primaryMain}
                  />
                  <Text style={[ryFont('600'), styles.showMoreText, { color: colors.primaryMain }]}>
                    {showAll
                      ? t('car.show_less')
                      : t('car.show_more', persona.products.length - 2)}
                  </Text>
                </Pressable>
              ) : null}
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

          {/* ── Explore ── */}
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

// ── Hero carousel ────────────────────────────────────────────────────────────

type HeroSlide = {
  label: string;
  amountText?: string;
  sub?: string;
  body?: string;
  image: (typeof HERO_IMAGES)[keyof typeof HERO_IMAGES];
  imageRight: number;
  onPress?: () => void;
};

function HeroCarousel({ cards }: { cards: HeroSlide[] }) {
  const { colors } = useRyTheme();
  const { width: winW } = useWindowDimensions();
  const [active, setActive] = useState(0);
  const trackRef = useRef<ScrollView>(null);

  // RyPage pads 16 each side; the track bleeds full width (design -16 margins).
  const slideW = winW;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { x } = e.nativeEvent.contentOffset;
    setActive(Math.round(x / slideW));
  };

  const goTo = (i: number) =>
    trackRef.current?.scrollTo({ x: i * slideW, animated: true });

  return (
    <View style={styles.carouselWrap}>
      <ScrollView
        ref={trackRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={32}>
        {cards.map((card, i) => (
          <View key={i} style={[styles.slide, { width: slideW }]}>
            <ActivityHeroCard
              tone="due"
              image={card.image}
              // design: img top 15 within the 54px-padded slide → -39 from card
              imageTop={-39}
              imageRight={card.imageRight}
              imageWidth={140}
              label={card.label}
              labelChevron={!!card.onPress}
              amountText={card.amountText}
              currency={card.amountText != null ? 'kr' : undefined}
              sub={card.sub}
              body={card.body}
              onPress={card.onPress}
              borderWidth={2}
              cardStyle={{ marginBottom: 10 }}
              style={styles.slideHero}
            />
          </View>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.dots}>
        {cards.map((_, i) => (
          <Pressable
            key={i}
            onPress={() => goTo(i)}
            hitSlop={6}
            style={[
              styles.dot,
              {
                width: active === i ? 20 : 6,
                backgroundColor: active === i ? colors.primaryMain : 'rgba(128,128,128,0.3)',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  carouselWrap: {
    marginTop: -24,
    marginHorizontal: -16,
    marginBottom: 4,
  },
  slide: {
    paddingTop: 54,
    paddingHorizontal: 16,
  },
  slideHero: {
    // room for the illustration hanging over the card
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 12,
  },
  dot: {
    height: 6,
    borderRadius: 999,
  },
  banner: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radii.lg,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bannerText: {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    lineHeight: 13 * 1.4,
  },
  introText: {
    fontSize: 14,
    lineHeight: 14 * 1.5,
  },
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
  showMoreText: { fontSize: 14 },
});
