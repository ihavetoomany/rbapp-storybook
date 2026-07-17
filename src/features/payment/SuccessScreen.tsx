// SuccessScreen — "Payment sent" receipt. Port of SuccessScreen in
// design-reference/revolving-credit-pay.jsx (`.rc-success` styles).

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, ZoomIn } from 'react-native-reanimated';

import { RyIcon } from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { formatSEK } from './constants';
import { RcCtaButton } from './RcCta';
import { RcHeader } from './RcHeader';

export type SuccessScreenProps = {
  amount: number;
  onDone: () => void;
  productName: string;
  fromAccount: string;
  dateLabel: string;
};

export function SuccessScreen({
  amount,
  onDone,
  productName,
  fromAccount,
  dateLabel,
}: SuccessScreenProps) {
  const { colors } = useRyTheme();
  const { t } = useT();

  const receiptRows: { k: string; v: string }[] = [
    { k: t('rc.success.product'), v: productName },
    { k: t('rc.cfs.from_account'), v: fromAccount },
    { k: t('rc.cfs.payment_date'), v: dateLabel },
    { k: t('rc.success.reference'), v: 'RC-28401' },
  ];

  return (
    <View style={styles.screen}>
      <RcHeader onClose={onDone} />
      <View style={styles.inner}>
        {/* popIn .4s cubic-bezier(0.34,1.56,0.64,1) */}
        <Animated.View
          entering={ZoomIn.duration(400).easing(Easing.bezier(0.34, 1.56, 0.64, 1).factory())}
          style={[styles.check, { backgroundColor: colors.successBackground }]}>
          <RyIcon name="fa-check" size={40} color={colors.successDark} />
        </Animated.View>
        <Text style={[ryFont('700'), styles.title, { color: colors.fgPrimary }]}>
          {t('rc.success.title')}
        </Text>
        <Text style={[ryFont('400'), styles.sub, { color: colors.fgSecondary }]}>
          {t('rc.success.body')}
        </Text>
        <Text style={[ryFont('700'), styles.paidAmt, { color: colors.fgPrimary }]}>
          {formatSEK(amount)}
          <Text style={[ryFont('500'), styles.paidCur, { color: colors.fgSecondary }]}> SEK</Text>
        </Text>
        <View
          style={[
            styles.receipt,
            { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle },
          ]}>
          {receiptRows.map((row, i) => (
            <View
              key={row.k}
              style={[
                styles.receiptRow,
                i < receiptRows.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.borderSubtle,
                },
              ]}>
              <Text style={[ryFont('400'), styles.receiptK, { color: colors.fgSecondary }]}>
                {row.k}
              </Text>
              <Text
                style={[ryFont('600'), styles.receiptV, { color: colors.fgPrimary }]}
                numberOfLines={1}>
                {row.v}
              </Text>
            </View>
          ))}
        </View>
        <RcCtaButton title={t('rc.success.done')} onPress={onDone} maxWidth={300} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // .ry-rcsheet .rc-success: padding-top 18px
  screen: {
    flex: 1,
    paddingTop: 18,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  check: {
    width: 96,
    height: 96,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    letterSpacing: 28 * -0.02,
    marginBottom: 8,
    textAlign: 'center',
  },
  sub: {
    fontSize: 15,
    lineHeight: 15 * 1.4,
    maxWidth: 280,
    marginBottom: 28,
    textAlign: 'center',
  },
  paidAmt: {
    fontSize: 48,
    lineHeight: 48 * 1.1,
    letterSpacing: 48 * -0.03,
    fontVariant: ['tabular-nums'],
    marginBottom: 28,
    textAlign: 'center',
  },
  paidCur: {
    fontSize: 20,
    letterSpacing: 0,
  },
  receipt: {
    width: '100%',
    maxWidth: 300,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
  },
  receiptK: {
    fontSize: 13,
  },
  receiptV: {
    fontSize: 13,
    flexShrink: 1,
    textAlign: 'right',
  },
});
