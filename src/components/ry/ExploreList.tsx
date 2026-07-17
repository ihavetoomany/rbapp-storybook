// ExploreList — the shared "Explore" list (tabs.jsx): three USP product
// rows (credit cards / loans / savings) rendered as explore-variant
// ServiceRows inside a RyCard. `exclude` hides products already surfaced
// elsewhere; tapping a row calls `onOpen(key)` (placeholder callback —
// no navigation inside the component).
//
// ryExploreCards — 1:1 port of RY_EXPLORE_CARDS(): the single source of
// truth for both the Discover promos and the explore rows (copy is
// language-dependent, exactly as the design's inline sv/en switch).

import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import React from 'react';

import { useT, type Lang } from '@/src/i18n';

import type { RyPromoCardData } from './PromoCard';
import { RyCard } from './RyCard';
import { ServiceRow } from './ServiceRow';

export type RyExploreCard = RyPromoCardData & {
  img: ImageSourcePropType;
  icon: string;
  rowTitle: string;
  rowSub: string;
};

export type RyExploreKey = 'savings' | 'loan' | 'card' | 'insurance';

/** Port of RY_EXPLORE_CARDS() — curated, persona-independent products. */
export function ryExploreCards(lang: Lang): RyExploreCard[] {
  const sv = lang === 'Svenska';
  return [
    {
      key: 'savings',
      label: sv ? 'Sparande' : 'Savings',
      icon: 'fa-piggy-bank',
      tint: '#BCD3A8',
      img: require('@/assets/design/promo-savings.png'),
      rowTitle: sv ? 'Spara' : 'Savings',
      rowSub: sv ? 'Spara med upp till 4,05 % ränta' : 'Save with up to 4.05% interest',
      headline: sv ? 'Sätt ditt sparande i arbete' : 'Put your savings to work',
      desc: sv
        ? 'Spara med upp till 4,05 % ränta — utan avgifter och full flexibilitet. Ta ut när du vill.'
        : 'Earn up to 4.05% interest with flexible savings. No fees, and withdraw whenever you want.',
      cta: sv ? 'Se hur det fungerar' : 'See how it works',
    },
    {
      key: 'loan',
      label: sv ? 'Privatlån' : 'Private loan',
      icon: 'fa-house-chimney',
      tint: '#9CC2BD',
      img: require('@/assets/design/promo-loan.png'),
      rowTitle: sv ? 'Låna' : 'Loans',
      rowSub: sv ? 'Privatlån från 5,95 % ränta' : 'Private loans from 5.95% interest',
      headline: sv
        ? 'När större utgifter kommer på en gång'
        : 'When bigger expenses come all at once',
      desc: sv
        ? 'Sprid större kostnader i hanterbara månadskostnader. Välj det som passar din budget.'
        : 'Spread larger costs into manageable monthly payments. Choose what fits your budget.',
      cta: sv ? 'Se dina möjligheter' : 'See your options',
    },
    {
      key: 'card',
      label: sv ? 'Resurs kreditkort' : 'Resurs credit cards',
      icon: 'fa-credit-card',
      tint: '#9FCCBE',
      img: require('@/assets/design/promo-card.png'),
      rowTitle: sv ? 'Kreditkort' : 'Credit cards',
      rowSub: sv ? 'Flexibla betalningar och förmåner' : 'Flexible payments and benefits',
      headline: sv ? 'Ett kort, total flexibilitet' : 'One card, total flexibility',
      desc: sv
        ? 'Betala nu eller dela upp kostnaden — med kostnadsfri köpförsäkring på allt du handlar.'
        : 'Pay now or split the cost later — with free purchase insurance on everything you buy.',
      cta: sv ? 'Utforska hur det fungerar' : 'Explore how it works',
    },
    {
      key: 'insurance',
      label: sv ? 'Försäkring' : 'Insurance',
      icon: 'fa-shield-heart',
      tint: '#9DBBD0',
      img: require('@/assets/design/promo-insurance.png'),
      rowTitle: sv ? 'Trygghet' : 'Security',
      rowSub: sv ? 'Bygg ett skyddsnät om något händer' : 'Build a safety net for the unexpected',
      headline: sv ? 'Skydda det som betyder mest' : 'Protect what matters most',
      desc: sv
        ? 'Skydda dina köp och månadskostnader så att en oväntad händelse aldrig spårar ur dina planer.'
        : 'Cover your purchases and monthly payments, so an unexpected event never derails your plans.',
      cta: sv ? 'Se hur det fungerar' : 'See how it works',
    },
  ];
}

export type ExploreListProps = {
  /** Product key(s) to hide (already surfaced elsewhere, e.g. a promo). */
  exclude?: string | string[];
  /** Called with the tapped product key ('card' | 'loan' | 'savings'). */
  onOpen?: (key: string) => void;
  style?: StyleProp<ViewStyle>;
};

/** The rows shown in every Explore list (design USP_KEYS order). */
const USP_KEYS = ['card', 'loan', 'savings'];

export function ExploreList({ exclude, onOpen, style }: ExploreListProps) {
  const { lang } = useT();
  const ex = Array.isArray(exclude) ? exclude : exclude ? [exclude] : [];
  const cards = ryExploreCards(lang);
  const shown = USP_KEYS.filter((k) => !ex.includes(k))
    .map((k) => cards.find((c) => c.key === k))
    .filter((c): c is RyExploreCard => Boolean(c));
  if (shown.length === 0) return null;
  return (
    <RyCard style={style}>
      {shown.map((c, i) => (
        <ServiceRow
          key={c.key}
          variant="explore"
          icon={c.icon}
          title={c.rowTitle}
          sub={c.rowSub}
          last={i === shown.length - 1}
          onPress={onOpen ? () => onOpen(c.key) : undefined}
        />
      ))}
    </RyCard>
  );
}
