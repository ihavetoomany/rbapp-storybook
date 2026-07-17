// StatusChip — `.ry-chip` status tag + the design's statusStyle() helper
// (components.jsx RY_STATUS_STYLES). Colors are ported 1:1; labels go
// through i18n (`inv.st.*` keys).

import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { RY_TODAY, type PaymentRequestStatus } from '@/src/data';
import { useT } from '@/src/i18n';
import type { SemanticColors } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { useStatusOverride } from '@/src/tweaks/TweaksProvider';

import { RyIcon } from './RyIcon';
import { ryFont } from './typography';

export type RyStatusKey =
  | 'paid'
  | 'scheduled'
  | 'snoozed'
  | 'partiallyPaid'
  | 'overdue'
  | 'missed'
  | 'unpaid'
  | 'voided';

export type RyStatusStyle = {
  key: RyStatusKey;
  bg: string;
  fg: string;
  /** Design 'fa-*' icon name. */
  icon: string;
  /** i18n key for the chip label. */
  labelKey: string;
};

/** RY_STATUS_STYLES — bg/fg traced from components.jsx CSS-var pairs. */
export function ryStatusStyles(colors: SemanticColors): Record<RyStatusKey, RyStatusStyle> {
  return {
    paid: { key: 'paid', bg: colors.successBackground, fg: colors.successDark, icon: 'fa-circle-check', labelKey: 'inv.st.paid' },
    scheduled: { key: 'scheduled', bg: colors.infoBackground, fg: colors.infoDark, icon: 'fa-clock', labelKey: 'inv.st.scheduled' },
    snoozed: { key: 'snoozed', bg: colors.grey200, fg: colors.grey700, icon: 'fa-bell-slash', labelKey: 'inv.st.snoozed' },
    partiallyPaid: { key: 'partiallyPaid', bg: colors.infoBackground, fg: colors.infoDark, icon: 'fa-circle-half-stroke', labelKey: 'inv.st.partial' },
    overdue: { key: 'overdue', bg: colors.errorBackground, fg: colors.errorDark, icon: 'fa-triangle-exclamation', labelKey: 'inv.st.overdue' },
    missed: { key: 'missed', bg: colors.errorBackground, fg: colors.errorDark, icon: 'fa-triangle-exclamation', labelKey: 'inv.st.missed' },
    unpaid: { key: 'unpaid', bg: colors.bgSubtle, fg: colors.primaryMain, icon: 'fa-file-invoice', labelKey: 'inv.st.unpaid' },
    voided: { key: 'voided', bg: colors.grey200, fg: colors.grey700, icon: 'fa-ban', labelKey: 'inv.st.voided' },
  };
}

/**
 * statusStyle() port. `override` replaces the design's window.RY_STATUS_OVERRIDE
 * (pass the value from useStatusOverride(); omit/null to ignore).
 */
export function getStatusStyle(
  colors: SemanticColors,
  status: PaymentRequestStatus | string,
  dueDate?: string | null,
  override?: PaymentRequestStatus | null,
): RyStatusStyle {
  const S = ryStatusStyles(colors);
  const byKey = S as Record<string, RyStatusStyle | undefined>;
  if (override && byKey[override]) return byKey[override]!;
  if (byKey[status] && (status === 'paid' || status === 'voided')) return byKey[status]!;

  const today = new Date(RY_TODAY);
  const due = dueDate ? new Date(dueDate) : null;
  const daysToDue = due ? Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
  if (status === 'paid') return S.paid;
  if (status === 'scheduled') return S.scheduled;
  if (status === 'snoozed') return S.snoozed;
  if (status === 'partiallyPaid') return S.partiallyPaid;
  if (daysToDue !== null && daysToDue < 0) return S.overdue;
  return S.unpaid;
}

export type StatusChipProps = {
  status: PaymentRequestStatus | string;
  dueDate?: string | null;
  /** Skip the invoiceStatus tweak override. */
  ignoreOverride?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function StatusChip({ status, dueDate, ignoreOverride = false, style }: StatusChipProps) {
  const { colors } = useRyTheme();
  const { t } = useT();
  const override = useStatusOverride();
  const s = getStatusStyle(colors, status, dueDate, ignoreOverride ? null : override);
  return (
    <View style={[styles.chip, { backgroundColor: s.bg }, style]}>
      <RyIcon name={s.icon} size={10} color={s.fg} />
      <Text style={[ryFont('600'), styles.label, { color: s.fg }]}>{t(s.labelKey)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  label: { fontSize: 12 },
});
