// ExploreUSPSheet — the swipeable USP card deck (tabs.jsx ExploreUSPSheet):
// three product cards (credit cards / loan / savings) in a horizontally
// paged deck with dot indicators and a per-card CTA linking to resurs.se.
// Opens pre-selected on the tapped Explore-list segment. The design mounts
// it app-wide via window.__ryOpenExploreUSP; here it is owned locally by
// DiscoverTab (and exported for reuse).

import React, { useEffect, useRef, useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { BaseDialog, RyButton, RyIcon } from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { useT, type Lang } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';

type Usp = {
  key: string;
  icon: string;
  tint: string;
  dark: string;
  label: string;
  headline: string;
  desc: string;
  points: string[];
  cta: string;
  url: string;
};

/** Port of the design's inline USPs list (copy switches on language). */
function usps(lang: Lang): Usp[] {
  const sv = lang === 'Svenska';
  return [
    {
      key: 'card',
      icon: 'fa-credit-card',
      tint: '#99C8BB',
      dark: '#1E5C4A',
      label: sv ? 'Flexibilitet' : 'Flexibility',
      headline: sv ? 'Handla nu, betala i din takt' : 'Shop now, pay your way',
      desc: sv
        ? 'Med Resurs kreditkort väljer du själv — betala direkt eller dela upp kostnaden på ett sätt som passar din vardag. Kostnadsfri köpförsäkring ingår.'
        : 'With Resurs credit cards, you decide — pay now or split the cost over time. Free purchase insurance included on everything you buy.',
      points: sv
        ? ['Betala nu eller dela upp', 'Köpförsäkring', 'Bonus och cashback']
        : ['Pay now or split the cost', 'Purchase insurance', 'Bonus and cashback'],
      cta: sv ? 'Utforska våra kreditkort' : 'Explore our credit cards',
      url: 'https://www.resurs.se/kreditkort',
    },
    {
      key: 'loan',
      icon: 'fa-coins',
      tint: '#99C8BB',
      dark: '#1E5C4A',
      label: sv ? 'Låna' : 'Loan',
      headline: sv ? 'Förverkliga dina planer' : 'Make your plans happen',
      desc: sv
        ? 'Lån som ger dig frihet att förverkliga dina planer. Fasta månadskostnader och inga dolda avgifter — från 5,95 % ränta.'
        : 'Spread larger costs into manageable monthly payments. Fixed monthly costs, no hidden fees — from 5.95% interest.',
      points: sv
        ? ['Från 5,95 % ränta', 'Inga dolda avgifter', 'Fasta månadskostnader']
        : ['From 5.95% interest', 'No hidden fees', 'Fixed monthly costs'],
      cta: sv ? 'Se dina lånemöjligheter' : 'See your options',
      url: 'https://www.resurs.se/lana',
    },
    {
      key: 'savings',
      icon: 'fa-piggy-bank',
      tint: '#99C8BB',
      dark: '#1E5C4A',
      label: sv ? 'Balans' : 'Balance',
      headline: sv ? 'Bygg din ekonomiska trygghet' : 'Build your financial foundation',
      desc: sv
        ? 'Spara med upp till 4,05 % ränta — utan avgifter och full flexibilitet. Sätt upp automatiskt sparande och nå dina mål snabbare.'
        : 'Save with up to 4.05% interest — no fees, full flexibility. Set up automatic savings and reach your goals faster.',
      points: sv
        ? ['Upp till 4,05 % ränta', 'Inga avgifter', 'Ta ut när du vill']
        : ['Up to 4.05% interest', 'No fees', 'Withdraw anytime'],
      cta: sv ? 'Läs mer om sparande' : 'Learn about savings',
      url: 'https://www.resurs.se/spara',
    },
  ];
}

export type ExploreUSPSheetProps = {
  open: boolean;
  /** USP key ('card' | 'loan' | 'savings') to open on. */
  initialKey?: string | null;
  onClose: () => void;
};

export function ExploreUSPSheet({ open, initialKey, onClose }: ExploreUSPSheetProps) {
  const { colors } = useRyTheme();
  const { lang } = useT();
  const { width: winW } = useWindowDimensions();

  const cards = usps(lang);
  const initialIdx = Math.max(0, cards.findIndex((u) => u.key === (initialKey || 'savings')));
  const [activeIdx, setActiveIdx] = useState(initialIdx);
  const scrollRef = useRef<ScrollView>(null);

  // Re-align on (re)open to the tapped segment.
  useEffect(() => {
    if (open) {
      const idx = Math.max(0, cards.findIndex((u) => u.key === (initialKey || 'savings')));
      setActiveIdx(idx);
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ x: idx * winW, animated: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialKey]);

  const goTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(cards.length - 1, idx));
    setActiveIdx(clamped);
    scrollRef.current?.scrollTo({ x: clamped * winW, animated: true });
  };

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / winW);
    setActiveIdx(Math.max(0, Math.min(cards.length - 1, idx)));
  };

  const current = cards[activeIdx] ?? cards[0];

  return (
    <BaseDialog open={open} onClose={onClose} size="medium" bodyStyle={styles.body}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        contentOffset={{ x: initialIdx * winW, y: 0 }}>
        {cards.map((usp) => (
          <View key={usp.key} style={[styles.card, { width: winW }]}>
            <View style={styles.iconWrap}>
              <View style={[styles.icon, { backgroundColor: usp.tint }]}>
                <RyIcon name={usp.icon} size={48} color={usp.dark} />
              </View>
            </View>
            <Text style={[ryFont('700'), styles.headline, { color: colors.fgPrimary }]}>
              {usp.headline}
            </Text>
            <Text style={[ryFont('400'), styles.desc, { color: colors.fgSecondary }]}>
              {usp.desc}
            </Text>
            <View style={styles.points}>
              {usp.points.map((pt) => (
                <View key={pt} style={styles.point}>
                  <RyIcon name="fa-circle-check" size={20} color={usp.dark} />
                  <Text style={[ryFont('400'), styles.pointText, { color: colors.fgPrimary }]}>
                    {pt}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {cards.map((usp, i) => (
          <Pressable
            key={usp.key}
            onPress={() => goTo(i)}
            hitSlop={8}
            style={[
              styles.dot,
              { backgroundColor: i === activeIdx ? current.dark : 'rgba(127,127,127,0.28)' },
              i === activeIdx && styles.dotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <RyButton
          title={current.cta}
          variant="primary"
          block
          onPress={() => {
            Linking.openURL(current.url).catch(() => {});
          }}
        />
        <Text style={[ryFont('400'), styles.site, { color: colors.fgSecondary }]}>
          resursbank.se
        </Text>
      </View>
    </BaseDialog>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 0,
  },
  card: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 28,
    paddingBottom: 16,
  },
  iconWrap: {
    marginTop: 12,
    marginBottom: 28,
  },
  icon: {
    width: 120,
    height: 120,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    fontSize: 24,
    lineHeight: 24 * 1.2,
    textAlign: 'center',
    marginBottom: 12,
  },
  desc: {
    fontSize: 15,
    lineHeight: 15 * 1.55,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: 20,
  },
  points: {
    width: '100%',
    maxWidth: 280,
    gap: 16,
    marginBottom: 4,
  },
  point: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  pointText: {
    fontSize: 16,
    flexShrink: 1,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 12,
    paddingBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  dotActive: {
    transform: [{ scale: 1.25 }],
  },
  footer: {
    paddingTop: 12,
    paddingHorizontal: 22,
    paddingBottom: 16,
  },
  site: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.45,
  },
});
