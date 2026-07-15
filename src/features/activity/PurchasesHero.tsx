// PurchasesHero — port from activity-crosssell.jsx: the hero card surfaced
// on the Current Activity tab when every payment request belongs to a loan
// but the persona has card purchases.

import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { rfmt, RY_TODAY } from '@/src/data';
import { useT } from '@/src/i18n';

import { ActivityHeroCard, HERO_IMAGES } from './ActivityHeroCard';
import type { PurchaseWithProduct } from './invoiceModel';

export type PurchasesHeroProps = {
  purchases: PurchaseWithProduct[];
  onOpen?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function PurchasesHero({ purchases, onOpen, style }: PurchasesHeroProps) {
  const { t } = useT();
  const recent = purchases.filter((tx) => tx.type !== 'refund');
  const weekCount = purchases.filter((tx) => {
    const d = (new Date(RY_TODAY).getTime() - new Date(tx.date).getTime()) / 86400000;
    return d >= 0 && d <= 7;
  }).length;
  const totalRecent = recent.reduce((s, tx) => s + tx.amount.amount, 0);
  const latest = recent[0];
  const sub =
    weekCount > 0
      ? t('ph.sub.week', weekCount)
      : latest
        ? t('ph.sub.latest', latest.merchant)
        : t('ph.sub.none');

  return (
    <ActivityHeroCard
      tone="clear"
      image={HERO_IMAGES.promoShopping}
      label={t('hero.label.purchases')}
      labelIcon="fa-bag-shopping"
      amountText={rfmt({ amount: totalRecent, currency: 'SEK' })}
      currency="SEK"
      sub={sub}
      goText={t('ph.go')}
      onPress={onOpen}
      cardStyle={{ marginTop: 70, marginBottom: 20 }}
      style={style}
    />
  );
}
