// TransactionRow — exact port from components.jsx: Payments-tab purchases
// + AccountView ledger rows. Merchant title, relative (or absolute) date,
// signed right-aligned amount (+ green for refunds), and a right-sub that
// is one of: Reserved (preliminary) · cashback badge · "Part Pay" tag ·
// tx.subLabel · Online / In store.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { rfmt, rfmtDate, rfmtRel, type Purchase } from '@/src/data';
import { useT } from '@/src/i18n';
import { rsColors } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { RyIcon } from './RyIcon';
import { RyRow } from './RyRow';
import { ryFont } from './typography';

export type TransactionRowProps = {
  tx: Purchase;
  onPress?: () => void;
  /** Show the part-pay affordances ("Convert to account" + "Part Pay" tag). */
  partPay?: boolean;
  hideIcon?: boolean;
  hideThirdLine?: boolean;
  /** Absolute date instead of the relative form. */
  absDate?: boolean;
  /** Cashback in kr — renders the yellow lightning badge when > 0. */
  cashback?: number;
  /** Cardholder name appended to the date line (family accounts). */
  holder?: string;
  /** Suppress the bottom hairline. */
  last?: boolean;
};

export function TransactionRow({
  tx,
  onPress,
  partPay = false,
  hideIcon = false,
  hideThirdLine = false,
  absDate = false,
  cashback = 0,
  holder,
  last = false,
}: TransactionRowProps) {
  const { colors } = useRyTheme();
  const { t, tCard } = useT();
  const isRefund = tx.type === 'refund';

  const sub = `${absDate ? rfmtDate(tx.date) : rfmtRel(tx.date)}${holder ? ` · ${holder}` : ''}`;

  const amountColor = tx.amountColor || (isRefund ? colors.successDark : colors.fgPrimary);

  let rightSub: React.ReactNode = null;
  if (tx.preliminary) {
    rightSub = (
      <Text style={[ryFont('400'), styles.rightSub, { color: colors.fgSecondary }]}>
        {tCard('Reserved')}
      </Text>
    );
  } else if (cashback > 0) {
    rightSub = (
      <View style={styles.cashback}>
        <RyIcon name="fa-bolt" size={10} color={rsColors.dusk} />
        <Text style={[ryFont('700'), styles.cashbackText]}>{cashback} kr</Text>
      </View>
    );
  } else if (partPay && !isRefund) {
    rightSub = (
      <View style={[styles.partPayTag, { backgroundColor: colors.infoBackground }]}>
        <Text style={[ryFont('700'), styles.partPayText, { color: colors.infoDark }]}>
          {t('tag.part_pay')}
        </Text>
      </View>
    );
  } else if (tx.subLabel !== undefined) {
    rightSub = tx.subLabel ? (
      <Text style={[ryFont('400'), styles.rightSub, { color: colors.fgSecondary }]}>
        {tCard(tx.subLabel)}
      </Text>
    ) : null;
  } else {
    rightSub = (
      <Text style={[ryFont('400'), styles.rightSub, { color: colors.fgSecondary }]}>
        {tCard(tx.ecomDetail ? 'Online' : 'In store')}
      </Text>
    );
  }

  return (
    <RyRow
      icon={hideIcon ? undefined : tx.icon || 'fa-receipt'}
      iconBg={colors.bgSubtle}
      iconColor={colors.primaryMain}
      title={tx.merchant}
      sub={sub}
      third={partPay && !isRefund && !hideThirdLine ? t('tx.convert_to_account') : undefined}
      rightMain={
        <Text style={[ryFont('500'), styles.amount, { color: amountColor }]}>
          {isRefund ? '+' : '−'}
          {rfmt(tx.amount)}{' '}
          <Text style={[ryFont('500'), styles.currency]}>{tx.amount.currency}</Text>
        </Text>
      }
      rightSub={rightSub}
      onPress={onPress}
      last={last}
    />
  );
}

const styles = StyleSheet.create({
  amount: { fontSize: 15, fontVariant: ['tabular-nums'] },
  currency: { fontSize: 12 },
  rightSub: { fontSize: 11, marginTop: 2, textAlign: 'right' },
  cashback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: rsColors.yellow,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    marginTop: 6,
  },
  cashbackText: { fontSize: 12, lineHeight: 12, color: rsColors.dusk },
  partPayTag: {
    height: 18,
    paddingHorizontal: 8,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  partPayText: { fontSize: 11, lineHeight: 18 },
});
