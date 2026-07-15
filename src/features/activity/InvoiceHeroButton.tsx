// InvoiceHeroButton — port of the design's hero invoice button
// (activity-crosssell.jsx): the prominent route to the invoice list.
// Savings-only personas surface their total savings (plant-pot image);
// otherwise the wallet illustration with tone by overdue / due-soon state.

import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { rfmt } from '@/src/data';
import { useT } from '@/src/i18n';

import { ActivityHeroCard, HERO_IMAGES } from './ActivityHeroCard';
import type { InvoiceModel } from './invoiceModel';

export type InvoiceHeroButtonProps = {
  model: InvoiceModel;
  onOpen?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function InvoiceHeroButton({ model, onOpen, style }: InvoiceHeroButtonProps) {
  const { t } = useT();
  const { currentPRs, handledPRs, totalDue, overdueCount, dueSoon, daysToNext, savingsBalance } =
    model;
  const count = currentPRs.length;
  const has = count > 0;
  // Savings-only personas (no invoices/purchases) surface total savings here.
  const isSavings = !has && savingsBalance != null;
  const tone = overdueCount > 0 ? 'overdue' : dueSoon.length > 0 ? 'due' : has ? 'open' : 'clear';

  let sub: string;
  if (isSavings) {
    sub = t('ihb.savings_sub');
  } else if (overdueCount > 0) {
    sub = t('hero.sub.overdue', overdueCount, count);
  } else if (count > 0) {
    const when =
      daysToNext === 0
        ? t('ihb.when.today')
        : daysToNext === 1
          ? t('ihb.when.tomorrow')
          : t('ihb.when.in_days', daysToNext ?? 0);
    sub = t('ihb.sub.count_next', count, when);
  } else {
    sub = handledPRs.length > 0 ? t('ihb.sub.history') : t('ihb.sub.nothing');
  }

  const label = isSavings
    ? t('ihb.label.savings')
    : overdueCount > 0
      ? t('ihb.label.overdue')
      : has
        ? t('ihb.label.topay')
        : t('ihb.label.invoices');

  return (
    <ActivityHeroCard
      tone={tone}
      image={
        isSavings
          ? HERO_IMAGES.plantpot
          : tone === 'overdue'
            ? HERO_IMAGES.planbokRed
            : HERO_IMAGES.planbok
      }
      // `.ActivityHero-img` default / `.is-pot` overrides.
      imageTop={isSavings ? -33 : 0}
      imageRight={isSavings ? 12 : 16}
      imageWidth={isSavings ? 140 : 130}
      label={label}
      labelIcon={
        isSavings
          ? undefined
          : has
            ? overdueCount > 0
              ? 'fa-triangle-exclamation'
              : 'fa-file-invoice'
            : 'fa-circle-check'
      }
      amountText={
        isSavings
          ? rfmt({ amount: savingsBalance ?? 0, currency: 'SEK' })
          : has
            ? rfmt({ amount: totalDue, currency: 'SEK' })
            : undefined
      }
      currency={isSavings || has ? 'SEK' : undefined}
      clearText={!isSavings && !has ? t('ihb.clear') : undefined}
      sub={sub}
      goText={!isSavings ? (has ? t('ihb.go.handle') : t('ihb.go.view')) : undefined}
      onPress={onOpen}
      // `.ActivityHero { margin-top: 70px }` leaves room for the illustration.
      cardStyle={{ marginTop: 70 }}
      style={style}
    />
  );
}
