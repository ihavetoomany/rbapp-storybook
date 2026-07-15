// PaymentRequestRow — exact port from components.jsx: the Payments-tab
// invoice row. Status icon disc (handled → success, open → info, overdue/
// missed → error), title / due date / type-or-outcome lines, right-aligned
// amount (struck through for part-paid & voided) and a status label or
// days-left countdown. Respects the invoiceStatus tweak override unless
// `ignoreOverride` is set.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { rfmt, rfmtDate, RY_TODAY, type Money, type PaymentRequest } from '@/src/data';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { useStatusOverride } from '@/src/tweaks/TweaksProvider';

import { getStatusStyle } from './StatusChip';
import { RyRow } from './RyRow';
import { ryFont } from './typography';

// PR_TYPE_LABELS → i18n keys ('kontoavi' and unknown kinds fall back to Invoice).
const PR_TYPE_KEYS: Record<string, string> = {
  laneavi: 'inv.installment',
  manadsavi: 'inv.statement',
  delbetalning: 'inv.partpayment',
  faktura: 'inv.invoice',
};

const HANDLED_STATUSES = ['paid', 'partiallyPaid', 'scheduled'];

export type PaymentRequestRowProps = {
  pr: PaymentRequest;
  /** Product display name (row title). */
  propName: string;
  onPress?: () => void;
  /** Skip the invoiceStatus tweak override. */
  ignoreOverride?: boolean;
  /** Suppress the bottom hairline. */
  last?: boolean;
};

export function PaymentRequestRow({
  pr,
  propName,
  onPress,
  ignoreOverride = false,
  last = false,
}: PaymentRequestRowProps) {
  const { colors } = useRyTheme();
  const { t } = useT();
  const override = useStatusOverride();

  const ov = ignoreOverride ? null : override;
  const s = getStatusStyle(colors, pr.status, pr.dueDate, ov);

  // Days until due (replaces the generic "Unpaid" label with a countdown).
  const today = new Date(RY_TODAY);
  const due = pr.dueDate ? new Date(pr.dueDate) : null;
  const daysToDue = due
    ? Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const eff = ov || pr.status;

  const rightLabel =
    s.key === 'unpaid' && daysToDue !== null
      ? t('tag.days_left', daysToDue)
      : eff === 'partiallyPaid'
        ? t('inv.st.paid') // a part payment still counts as paid
        : t(s.labelKey);

  // Icon color:
  //  · handled (paid / part-paid / scheduled) → success green
  //  · voided → keep neutral grey
  //  · To Pay items that aren't overdue/missed → info blue
  const iconStyle = HANDLED_STATUSES.includes(eff)
    ? { bg: colors.successBackground, fg: colors.successDark }
    : eff !== 'voided' && s.key !== 'overdue' && s.key !== 'missed'
      ? { bg: colors.infoBackground, fg: colors.infoDark }
      : { bg: s.bg, fg: s.fg };

  // Handled rows describe the payment outcome on line 2 instead of the type.
  const paidSoFar = pr.originalAmount ? pr.originalAmount.amount - pr.remainingAmount.amount : 0;
  // paidAmount is not in the demo-data schema but the design reads it
  // defensively — keep the same behaviour for future data.
  const paidAmount = (pr as PaymentRequest & { paidAmount?: Money }).paidAmount;
  const partialPaid = paidAmount
    ? paidAmount.amount
    : paidSoFar > 0
      ? paidSoFar
      : Math.round(pr.remainingAmount.amount * 0.6);
  const payInfo =
    eff === 'paid'
      ? t('inv.full_payment')
      : eff === 'partiallyPaid'
        ? t('inv.paid_amount', rfmt({ amount: partialPaid, currency: 'SEK' }))
        : eff === 'voided'
          ? t('inv.new_invoice_created')
          : eff === 'scheduled'
            ? paidSoFar > 0
              ? t('inv.partpayment_amount', rfmt({ amount: paidSoFar, currency: 'SEK' }))
              : t('inv.full_payment')
            : eff === 'missed'
              ? t('inv.missed_payment')
              : null;
  const secondLine = payInfo || t(PR_TYPE_KEYS[pr.kind] ?? 'inv.invoice');

  // Partpayment & voided strike the original (initial) amount.
  const strike = eff === 'partiallyPaid' || eff === 'voided';
  const shownAmount = strike ? pr.originalAmount || pr.remainingAmount : pr.remainingAmount;

  return (
    <RyRow
      icon={s.icon}
      iconBg={iconStyle.bg}
      iconColor={iconStyle.fg}
      title={propName}
      sub={t('date.due', rfmtDate(pr.dueDate))}
      third={secondLine}
      rightMain={
        <View style={styles.amountRow}>
          <Text
            style={[
              ryFont('700'),
              styles.amount,
              { color: strike ? colors.fgSecondary : colors.fgPrimary },
              strike && styles.strike,
            ]}>
            {rfmt(shownAmount)}{' '}
            <Text style={[ryFont('500'), styles.currency]}>{shownAmount.currency}</Text>
          </Text>
        </View>
      }
      rightSub={rightLabel}
      onPress={onPress}
      last={last}
    />
  );
}

const styles = StyleSheet.create({
  amountRow: { flexDirection: 'row', alignItems: 'baseline' },
  amount: { fontSize: 15, fontVariant: ['tabular-nums'] },
  currency: { fontSize: 12 },
  strike: { textDecorationLine: 'line-through' },
});
