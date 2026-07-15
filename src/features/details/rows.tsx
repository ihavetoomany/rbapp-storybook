// Shared detail-screen rows — ports of the design's components.jsx AccountRow
// and InvoiceRow, bonus-checks.jsx BonusCheckEntryRow, details.jsx LinkRow,
// the `.ry-fam-seeall` footer button, the `.ry-fam-cashback-note` and the
// family card row (`.ry-fam-cardrow` + `.ry-fam-cardthumb`).

import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { getStatusStyle, RyCard, RyCount, RyIcon, RyRow } from '@/src/components/ry';
import { ryTints } from '@/src/components/ry/tints';
import { ryFont } from '@/src/components/ry/typography';
import { rfmt, rfmtDate, type Account, type Invoice } from '@/src/data';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';

/* ============================================================
 * AccountRow — components.jsx: product-page account list row.
 * ============================================================ */

const ACCOUNT_ICONS: Record<Account['type'], string> = {
  invoiceAccount: 'fa-file-invoice',
  loanAccount: 'fa-house-chimney',
  depositAccount: 'fa-piggy-bank',
  creditAccount: 'fa-credit-card',
};

export function AccountRow({
  account: a,
  onPress,
  last = false,
}: {
  account: Account;
  onPress?: () => void;
  last?: boolean;
}) {
  const { colors, dark } = useRyTheme();
  const { tCard } = useT();
  const tints = ryTints(dark);

  const hasPartPayment = a.type === 'invoiceAccount' && a.monthlyPayment != null;
  const balance =
    a.type === 'invoiceAccount' || a.type === 'loanAccount'
      ? a.remainingBalance
      : a.type === 'depositAccount'
        ? a.balance
        : a.availableCredit;
  const balanceLabel =
    a.type === 'depositAccount'
      ? 'Balance'
      : a.type === 'loanAccount'
        ? 'Remaining'
        : hasPartPayment
          ? 'Remaining'
          : a.type === 'invoiceAccount'
            ? 'Monthly'
            : 'Available';
  const subLine =
    a.type === 'creditAccount' && a.creditLimit
      ? `Credit limit · ${rfmt(a.creditLimit)} ${a.creditLimit.currency}`
      : hasPartPayment
        ? `Part payment · ${rfmt(a.monthlyPayment)} ${a.monthlyPayment.currency}/mo`
        : a.type === 'invoiceAccount' && a.remainingBalance
          ? `Current debt · ${rfmt(a.remainingBalance)} ${a.remainingBalance.currency}`
          : a.number;

  return (
    <RyRow
      icon={ACCOUNT_ICONS[a.type]}
      iconBg={tints.green50}
      iconColor={colors.primaryMain}
      title={a.name}
      sub={tCard(subLine)}
      rightMain={
        <Text style={[ryFont('700'), styles.rightMain, { color: colors.fgPrimary }]}>
          {rfmt(balance)} <Text style={[ryFont('500'), styles.rightCur]}>{balance.currency}</Text>
        </Text>
      }
      rightSub={tCard(balanceLabel)}
      onPress={onPress}
      last={last}
    />
  );
}

/* ============================================================
 * InvoiceRow — components.jsx: AccountView invoice-history row.
 * ============================================================ */

export function InvoiceRow({
  inv,
  onPress,
  last = false,
}: {
  inv: Invoice;
  onPress?: () => void;
  last?: boolean;
}) {
  const { colors } = useRyTheme();
  const { t, tName } = useT();
  const s = getStatusStyle(colors, inv.status, inv.due);
  const paid = s.key === 'paid';
  const unpaidStyle = getStatusStyle(colors, 'unpaid', null, null);

  return (
    <RyRow
      icon="fa-file-lines"
      iconBg={unpaidStyle.bg}
      iconColor={unpaidStyle.fg}
      title={tName(inv.period)}
      sub={t('date.due', rfmtDate(inv.due))}
      rightMain={
        <Text style={[ryFont('700'), styles.rightMain, { color: colors.fgPrimary }]}>
          {rfmt(inv.amount)}
        </Text>
      }
      rightSub={
        <Text
          style={[
            ryFont('700'),
            styles.invStatus,
            { color: paid ? colors.successDark : colors.fgSecondary },
          ]}>
          {t(s.labelKey)}
        </Text>
      }
      onPress={onPress}
      last={last}
    />
  );
}

/* ============================================================
 * LinkRow — details.jsx: Documents-and-agreements row (36px plain disc).
 * ============================================================ */

export function LinkRow({
  icon,
  title,
  sub,
  onPress,
  last = false,
}: {
  icon: string;
  title: string;
  sub?: string;
  onPress?: () => void;
  last?: boolean;
}) {
  const { colors } = useRyTheme();
  const { tCard } = useT();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.linkRow,
        { borderBottomColor: last ? 'transparent' : colors.borderSubtle },
        last && { borderBottomWidth: 0 },
        pressed && { backgroundColor: colors.bgSubtle },
      ]}>
      <View style={styles.linkIcon}>
        <RyIcon name={icon} size={15} color={colors.iconMuted} />
      </View>
      <View style={styles.linkBody}>
        <Text style={[ryFont('400'), styles.linkTitle, { color: colors.fgPrimary }]}>
          {tCard(title)}
        </Text>
        {sub ? (
          <Text style={[ryFont('400'), styles.linkSub, { color: colors.fgSecondary }]}>
            {tCard(sub)}
          </Text>
        ) : null}
      </View>
      <RyIcon name="fa-chevron-right" size={12} color={colors.fgDisabled} />
    </Pressable>
  );
}

/* ============================================================
 * CardRow — `.ry-fam-cardrow` + `.ry-fam-cardthumb` (portrait / contain /
 * landscape thumb variants) used by the Cards sections.
 * ============================================================ */

export type CardThumbVariant = 'landscape' | 'portrait' | 'contain';

export function CardThumb({
  img,
  variant = 'landscape',
}: {
  img?: ImageSourcePropType;
  variant?: CardThumbVariant;
}) {
  const { colors } = useRyTheme();
  if (variant === 'portrait') {
    return (
      <View style={styles.thumbPortrait}>
        {img ? (
          <Image source={img} style={styles.thumbFit} resizeMode="contain" />
        ) : (
          <RyIcon name="fa-credit-card" size={16} color={colors.iconMuted} />
        )}
      </View>
    );
  }
  if (variant === 'contain') {
    return (
      <View style={styles.thumbContain}>
        {img ? (
          <Image source={img} style={styles.thumbFit} resizeMode="contain" />
        ) : (
          <RyIcon name="fa-credit-card" size={16} color={colors.iconMuted} />
        )}
      </View>
    );
  }
  return (
    <View style={[styles.thumbLandscape, { backgroundColor: colors.bgSubtle }]}>
      {img ? (
        <Image source={img} style={styles.thumbRotated} resizeMode="contain" />
      ) : (
        <RyIcon name="fa-credit-card" size={14} color={colors.iconMuted} />
      )}
    </View>
  );
}

export function CardRow({
  img,
  thumbVariant = 'landscape',
  title,
  sub,
  onPress,
  last = false,
}: {
  img?: ImageSourcePropType;
  thumbVariant?: CardThumbVariant;
  title: string;
  sub?: string;
  onPress?: () => void;
  last?: boolean;
}) {
  const { colors } = useRyTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.cardRow,
        { borderBottomColor: last ? 'transparent' : colors.borderSubtle },
        last && { borderBottomWidth: 0 },
        pressed && { backgroundColor: colors.bgSubtle },
      ]}>
      <CardThumb img={img} variant={thumbVariant} />
      <View style={styles.linkBody}>
        <Text style={[ryFont('600'), styles.cardTitle, { color: colors.fgPrimary }]}>{title}</Text>
        {sub ? (
          <Text style={[ryFont('400'), styles.cardSub, { color: colors.fgSecondary }]}>{sub}</Text>
        ) : null}
      </View>
      <RyIcon name="fa-chevron-right" size={12} color={colors.fgDisabled} />
    </Pressable>
  );
}

/* ============================================================
 * BonusCheckEntryRow — bonus-checks.jsx: bordered entry card.
 * ============================================================ */

export function BonusCheckEntryRow({ count, onPress }: { count?: number; onPress?: () => void }) {
  const { colors, dark } = useRyTheme();
  const { tCard } = useT();
  const tints = ryTints(dark);
  return (
    <RyCard>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.bcRow, pressed && { backgroundColor: colors.bgSubtle }]}>
        <View style={[styles.bcTag, { backgroundColor: tints.mint100 }]}>
          <RyIcon name="fa-tag" size={15} color={colors.primaryMain} />
        </View>
        <Text
          style={[ryFont('500'), styles.bcTitle, { color: colors.fgPrimary }]}
          numberOfLines={1}>
          {tCard('View and use bonus checks')}
        </Text>
        <View style={styles.bcTrailing}>
          {count != null ? <RyCount value={count} /> : null}
          <RyIcon name="fa-chevron-right" size={12} color={colors.fgDisabled} />
        </View>
      </Pressable>
    </RyCard>
  );
}

/* ============================================================
 * SeeAllButton — `.ry-fam-seeall` list-footer button.
 * ============================================================ */

export function SeeAllButton({ onPress, style }: { onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  const { colors } = useRyTheme();
  const { tCard } = useT();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.seeAll, pressed && { backgroundColor: colors.bgSubtle }, style]}>
      <Text style={[ryFont('600'), styles.seeAllText, { color: colors.primaryMain }]}>
        {tCard('See all')}
      </Text>
      <RyIcon name="fa-chevron-right" size={11} color={colors.primaryMain} />
    </Pressable>
  );
}

/** `.ry-fam-seeall-inline` — inline "See all" link in a card head. */
export function SeeAllInline({ label, onPress }: { label?: string; onPress?: () => void }) {
  const { colors } = useRyTheme();
  const { tCard } = useT();
  return (
    <Pressable onPress={onPress} hitSlop={8} style={styles.seeAllInline}>
      <Text style={[ryFont('600'), styles.seeAllInlineText, { color: colors.primaryMain }]}>
        {label ?? tCard('See all')}
      </Text>
      <RyIcon name="fa-chevron-right" size={10} color={colors.primaryMain} />
    </Pressable>
  );
}

/** `.ry-fam-cashback-note` — small note under a section headline. */
export function CashbackNote({ children }: { children: string }) {
  const { colors } = useRyTheme();
  return (
    <Text style={[ryFont('400'), styles.cashbackNote, { color: colors.fgSecondary }]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  rightMain: { fontSize: 15, fontVariant: ['tabular-nums'], textAlign: 'right' },
  rightCur: { fontSize: 12 },
  invStatus: { fontSize: 11, marginTop: 2, textAlign: 'right' },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
  linkIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  linkBody: { flex: 1, minWidth: 0 },
  linkTitle: { fontSize: 15, lineHeight: 20 },
  linkSub: { fontSize: 12, lineHeight: 16, marginTop: 2 },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
  cardTitle: { fontSize: 16, lineHeight: 22 },
  cardSub: { fontSize: 14, lineHeight: 18, marginTop: 1 },
  thumbLandscape: {
    width: 44,
    height: 30,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  thumbRotated: { width: 64, height: 40, transform: [{ rotate: '-8deg' }] },
  thumbPortrait: {
    width: 30,
    height: 44,
    borderRadius: 4,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  thumbContain: {
    width: 42,
    height: 44,
    borderRadius: 4,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  thumbFit: { width: '100%', height: '100%' },
  bcRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
  },
  bcTag: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bcTitle: { flex: 1, minWidth: 0, fontSize: 15 },
  bcTrailing: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 0 },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  seeAllText: { fontSize: 14 },
  seeAllInline: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  seeAllInlineText: { fontSize: 13 },
  cashbackNote: {
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 4,
    paddingBottom: 12,
  },
});
