// ConfirmScreenFixed — full-page confirm (all invoice types; primary screen
// for laneavi / delbetalning). Port of ConfirmScreenFixed in
// design-reference/revolving-credit-pay.jsx: amount hero + "Change" pill,
// Relates to / From account / Payment date rows with inline pickers, and the
// PPIPromoBox for the 'PPI version' tweak variant.

import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { RyIcon } from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { RY_PERSONAS, type PaymentRequest } from '@/src/data';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';

import type { PayConfig } from './configFor';
import {
  DATE_OPTIONS,
  FROM_OPTIONS,
  formatSEK,
  type DateOptionId,
  type FromOptionId,
} from './constants';
import { PPIPromoBox } from './PPIPromoBox';
import { RcCtaZone, RcCtaButton } from './RcCta';
import { RcHeader } from './RcHeader';

export type ConfirmScreenFixedProps = {
  amount: number;
  config: PayConfig;
  onClose: () => void;
  onConfirm: () => void;
  onChange: () => void;
  onBack?: () => void;
  pr: PaymentRequest | null;
  fromAccount: FromOptionId;
  setFromAccount: (id: FromOptionId) => void;
  dateOption: DateOptionId;
  setDateOption: (id: DateOptionId) => void;
  variant?: 'Default' | 'PPI version';
};

/** "Relates to" label — resolve product name from the personas data. */
export function resolveProductName(
  pr: PaymentRequest | null | undefined,
  tName: (n: string) => string,
  fallback: string,
): string {
  if (!pr || !pr.productId) return fallback;
  for (const persona of Object.values(RY_PERSONAS)) {
    const product = (persona.products || []).find((p) => p.id === pr.productId);
    if (product) return tName(product.name);
  }
  return fallback;
}

export function ConfirmScreenFixed({
  amount,
  config,
  onClose,
  onConfirm,
  onChange,
  onBack,
  pr,
  fromAccount,
  setFromAccount,
  dateOption,
  setDateOption,
  variant = 'Default',
}: ConfirmScreenFixedProps) {
  const { colors } = useRyTheme();
  const { t, tName } = useT();

  const { fixedAmount } = config;
  const isChanged = fixedAmount != null && amount !== fixedAmount;

  const toLabel = resolveProductName(pr, tName, t('rc.fallback_product'));

  // Picker open/close — UI only, stays local.
  const [fromOpen, setFromOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const fromLabel = t(
    (FROM_OPTIONS.find((o) => o.id === fromAccount) ?? FROM_OPTIONS[0]).labelKey,
  );
  const dateLabel = t(
    (DATE_OPTIONS.find((d) => d.id === dateOption) ?? DATE_OPTIONS[0]).labelKey,
  );

  const rowBorder = { borderBottomColor: colors.borderSubtle };

  const renderTapRow = (
    label: string,
    value: string,
    open: boolean,
    onPress: () => void,
  ) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[
        styles.row,
        rowBorder,
        open && {
          backgroundColor: colors.bgSubtle,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderBottomColor: 'transparent',
        },
      ]}>
      <Text style={[ryFont('400'), styles.rowK, { color: colors.fgSecondary }]}>{label}</Text>
      <View style={styles.rowEnd}>
        <Text style={[ryFont('600'), styles.rowV, { color: colors.fgPrimary }]}>{value}</Text>
        <RyIcon
          name={open ? 'fa-chevron-up' : 'fa-chevron-down'}
          size={11}
          color={colors.fgDisabled}
        />
      </View>
    </Pressable>
  );

  const renderPicker = <T extends string>(
    options: readonly { id: T; labelKey: string }[],
    selected: T,
    onSelect: (id: T) => void,
  ) => (
    <View
      style={[
        styles.picker,
        { backgroundColor: colors.bgSubtle, borderBottomColor: colors.borderSubtle },
      ]}>
      {options.map((opt, i) => {
        const isSel = selected === opt.id;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            style={[
              styles.opt,
              i > 0 && { borderTopWidth: 1, borderTopColor: colors.borderSubtle },
            ]}>
            <Text
              style={[
                ryFont(isSel ? '600' : '500'),
                styles.optLabel,
                { color: isSel ? colors.primaryMain : colors.fgPrimary },
              ]}>
              {t(opt.labelKey)}
            </Text>
            {isSel ? <RyIcon name="fa-check" size={13} color={colors.primaryMain} /> : null}
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View style={styles.screen}>
      <RcHeader title={t('rc.confirm_payment')} onBack={onBack} onClose={onClose} />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        {/* Amount hero */}
        <View style={[styles.hero, { borderBottomColor: colors.borderSubtle }]}>
          <Text style={[ryFont('500'), styles.heroLabel, { color: colors.fgSecondary }]}>
            {t('rc.cfs.amount_label')}
          </Text>
          <View style={styles.amountRow}>
            <Text style={[ryFont('700'), styles.amount, { color: colors.fgPrimary }]}>
              {formatSEK(amount)}
              <Text style={[ryFont('500'), styles.amountCur, { color: colors.fgSecondary }]}>
                {' '}
                SEK
              </Text>
            </Text>
            <Pressable
              onPress={onChange}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.changePill,
                { backgroundColor: pressed ? colors.grey200 : colors.bgSubtle },
              ]}>
              <RyIcon name="fa-sliders" size={11} color={colors.primaryMain} />
              <Text style={[ryFont('600'), styles.changeLabel, { color: colors.primaryMain }]}>
                {t('rc.cfs.change')}
              </Text>
            </Pressable>
          </View>
          {isChanged ? (
            <Text style={[ryFont('400'), styles.changed, { color: colors.fgSecondary }]}>
              {t('rc.cfs.changed_from', formatSEK(fixedAmount!))}
            </Text>
          ) : null}
        </View>

        {/* Relates to / From account / Date rows */}
        <View>
          {/* Relates to — static, first */}
          <View style={[styles.row, rowBorder]}>
            <Text style={[ryFont('400'), styles.rowK, { color: colors.fgSecondary }]}>
              {t('rc.cfs.relates_to')}
            </Text>
            <Text style={[ryFont('600'), styles.rowV, { color: colors.fgPrimary }]}>{toLabel}</Text>
          </View>

          {/* From account — editable */}
          {renderTapRow(t('rc.cfs.from_account'), fromLabel, fromOpen, () => {
            setFromOpen((o) => !o);
            setDateOpen(false);
          })}
          {fromOpen
            ? renderPicker(FROM_OPTIONS, fromAccount, (id) => {
                setFromAccount(id);
                setFromOpen(false);
              })
            : null}

          {/* Date — editable */}
          {renderTapRow(t('rc.cfs.payment_date'), dateLabel, dateOpen, () => {
            setDateOpen((o) => !o);
            setFromOpen(false);
          })}
          {dateOpen
            ? renderPicker(DATE_OPTIONS, dateOption, (id) => {
                setDateOption(id);
                setDateOpen(false);
              })
            : null}
        </View>

        {variant === 'PPI version' ? <PPIPromoBox /> : null}
      </ScrollView>

      <RcCtaZone>
        <RcCtaButton title={t('rc.confirm.bankid')} onPress={onConfirm} icon="fa-fingerprint" />
      </RcCtaZone>
    </View>
  );
}

const styles = StyleSheet.create({
  // .ry-rcsheet .rc-screen: padding-top 6px
  screen: {
    flex: 1,
    paddingTop: 6,
  },
  body: {
    flex: 1,
  },
  // .rc-cfs-body: padding 32px 20px 16px
  bodyContent: {
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  hero: {
    paddingBottom: 28,
    borderBottomWidth: 1,
  },
  heroLabel: {
    fontSize: 13,
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  amount: {
    fontSize: 48,
    lineHeight: 48,
    letterSpacing: 48 * -0.03,
    fontVariant: ['tabular-nums'],
  },
  amountCur: {
    fontSize: 20,
    letterSpacing: 0,
  },
  changePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 16,
    flexShrink: 0,
  },
  changeLabel: {
    fontSize: 13,
  },
  changed: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  // .rc-cfs-row: padding 15px 0, 14px, border-bottom subtle
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    width: '100%',
  },
  rowK: {
    fontSize: 14,
  },
  rowV: {
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  picker: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomWidth: 1,
    overflow: 'hidden',
  },
  opt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 13,
    paddingHorizontal: 4,
  },
  optLabel: {
    fontSize: 14,
  },
});
