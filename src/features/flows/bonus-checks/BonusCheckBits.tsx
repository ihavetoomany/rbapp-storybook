// BonusCheckBits — "Bonus checks" presentational components, ported 1:1 from
// design-reference/bonus-checks.jsx (+ the `ry-bc-*` CSS in app.css).
//
// Every component here is PURELY PRESENTATIONAL: all values arrive via props,
// there is no business logic and no navigation wiring. onPress props are
// pass-through only (the host decides what they do).
//
// "Teal" in the spec resolves to the brand's primary green family
// (--primary-main on an --rs-mint-100 disc; dark-mode tints via ryTints).

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
import Svg, { Rect } from 'react-native-svg';

import { RyCount, RyIcon, ryTints } from '@/src/components/ry';
import { useT } from '@/src/i18n';
import { radii } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

const ryFont = (weight: '400' | '500' | '600' | '700' | '800') =>
  ({
    fontFamily: Number(weight) >= 600 ? 'Inter-Bold' : 'Inter-Regular',
    fontWeight: weight,
  }) as const;

// ─────────────────────────────────────────────────────────────
// 1. BonusCheckListRow — borderless row, divided when stacked.
//    Leading: tag glyph in a light-teal (mint) circle. Title: amount
//    (struck through in the "used" variant). Subtitle: status string.
// ─────────────────────────────────────────────────────────────
export function BonusCheckListRow({
  amount,
  status,
  variant = 'active',
  last = false,
  onPress,
}: {
  amount: string;
  status: string;
  variant?: 'active' | 'used';
  /** Suppress the divider (`.ry-bc-list .ry-bc-row:not(:last-child)`). */
  last?: boolean;
  onPress?: () => void;
}) {
  const { colors, dark } = useRyTheme();
  const tints = ryTints(dark);
  const used = variant === 'used';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: last ? 'transparent' : colors.borderSubtle },
        last && { borderBottomWidth: 0 },
        pressed && { backgroundColor: colors.bgSubtle },
      ]}>
      <View style={[styles.tagDisc, { backgroundColor: tints.mint100 }]}>
        <RyIcon name="fa-tag" size={15} color={colors.primaryMain} />
      </View>
      <View style={styles.rowBody}>
        <Text
          style={[
            ryFont('500'),
            styles.rowTitle,
            { color: used ? colors.fgSecondary : colors.fgPrimary },
            used && styles.struck,
          ]}>
          {amount}
        </Text>
        <Text style={[ryFont('400'), styles.rowSub, { color: colors.fgSecondary }]}>{status}</Text>
      </View>
      <RyIcon name="fa-chevron-right" size={12} color={colors.fgDisabled} />
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. BonusCheckEntryRow — BORDERED card (entry point into the feature).
//    Trailing: numeric count badge + chevron.
// ─────────────────────────────────────────────────────────────
export function BonusCheckEntryRow({
  count,
  onPress,
  style,
}: {
  count?: number | null;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, dark } = useRyTheme();
  const tints = ryTints(dark);
  const { tCard } = useT();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.entry,
        { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle },
        pressed && { backgroundColor: colors.bgSubtle },
        style,
      ]}>
      <View style={[styles.tagDisc, { backgroundColor: tints.mint100 }]}>
        <RyIcon name="fa-tag" size={15} color={colors.primaryMain} />
      </View>
      <View style={styles.rowBody}>
        <Text style={[ryFont('500'), styles.rowTitle, { color: colors.fgPrimary }]}>
          {tCard('View and use bonus checks')}
        </Text>
      </View>
      <View style={styles.entryTrailing}>
        {count != null ? <RyCount value={count} /> : null}
        <RyIcon name="fa-chevron-right" size={12} color={colors.fgDisabled} />
      </View>
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Barcode — DUMMY decorative SVG of vertical bars. Encodes nothing.
//    Responsive width (fills its container); fixed bar height.
// ─────────────────────────────────────────────────────────────
const BC_BAR_PATTERN = [
  3, 1, 1, 2, 1, 4, 1, 1, 2, 1, 1, 3, 2, 1, 1, 1, 4, 1, 2, 1, 1, 2, 3, 1, 1, 1, 2, 4, 1, 1, 2, 1,
  3, 1, 1, 2, 1, 1, 4, 1, 2, 1, 1, 3, 1, 2, 1, 1, 1, 3,
];

export function Barcode({ height = 56 }: { height?: number }) {
  const { colors } = useRyTheme();
  // Build alternating bar / gap rects from a fixed (meaningless) width pattern.
  const unit = 2;
  let x = 0;
  const rects: React.ReactElement[] = [];
  BC_BAR_PATTERN.forEach((w, i) => {
    const width = w * unit;
    if (i % 2 === 0) {
      rects.push(<Rect key={i} x={x} y={0} width={width} height={height} fill={colors.fgPrimary} />);
    }
    x += width;
  });
  return (
    <Svg
      viewBox={`0 0 ${x} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      accessibilityLabel="Barcode (decorative placeholder)">
      {rects}
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. BonusCheckCard — hero card inside a detail sheet. Two variants.
//    "active": centered partner-logo slot, large amount, "Valid until",
//              divider, Barcode, "Reference nr". Light-grey background.
//    "used":   greyed-out card, centered tag glyph, struck amount,
//              reference; the "Used {date}" line renders BELOW the card.
// ─────────────────────────────────────────────────────────────
export function BonusCheckCard({
  variant = 'active',
  amount,
  logo,
  logoPlaceholder = 'Partner logo',
  validUntil,
  reference,
  usedDate,
}: {
  variant?: 'active' | 'used';
  amount: string;
  logo?: ImageSourcePropType | null;
  logoPlaceholder?: string;
  /** Pre-formatted "Valid until …" line (i18n applied by the caller). */
  validUntil?: string;
  /** Pre-formatted "Reference nr: …" line (i18n applied by the caller). */
  reference?: string;
  /** Pre-formatted "Used …" line rendered BELOW the card. */
  usedDate?: string;
}) {
  const { colors } = useRyTheme();
  const used = variant === 'used';
  return (
    <View>
      <View style={[styles.card, { backgroundColor: colors.grey100 }]}>
        <View
          style={[
            styles.emblem,
            { backgroundColor: used ? colors.grey200 : '#FFFFFF' },
          ]}>
          {used ? (
            <RyIcon name="fa-tag" size={26} color={colors.fgDisabled} />
          ) : logo ? (
            <Image source={logo} style={styles.logo} />
          ) : (
            <View style={[styles.logoSlot, { backgroundColor: colors.bgPaper, borderColor: colors.borderDefault }]}>
              <Text style={[styles.logoSlotText, { color: colors.fgSecondary }]}>{logoPlaceholder}</Text>
            </View>
          )}
        </View>

        <Text
          style={[
            ryFont('800'),
            styles.amount,
            { color: used ? colors.fgDisabled : colors.fgPrimary },
            used && styles.struck,
          ]}>
          {amount}
        </Text>

        {!used && validUntil ? (
          <Text style={[ryFont('400'), styles.valid, { color: colors.fgSecondary }]}>{validUntil}</Text>
        ) : null}

        {!used ? (
          <>
            <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />
            <View style={styles.barcodeWrap}>
              <Barcode />
            </View>
          </>
        ) : null}

        {reference != null ? (
          <Text
            style={[
              ryFont('400'),
              styles.ref,
              { color: used ? colors.fgDisabled : colors.fgSecondary },
              used && { marginTop: 10 },
            ]}>
            {reference}
          </Text>
        ) : null}
      </View>

      {used && usedDate ? (
        <Text style={[ryFont('400'), styles.usedLine, { color: colors.fgSecondary }]}>{usedDate}</Text>
      ) : null}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. BonusChecksEmptyState — icon + heading + body inside a panel.
// ─────────────────────────────────────────────────────────────
export function BonusChecksEmptyState({
  icon = 'fa-tag',
  heading,
  body,
}: {
  icon?: string;
  heading: string;
  body: string;
}) {
  const { colors, dark } = useRyTheme();
  const tints = ryTints(dark);
  return (
    <View style={[styles.empty, { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle }]}>
      <View style={[styles.emptyIco, { backgroundColor: tints.mint100 }]}>
        <RyIcon name={icon} size={26} color={colors.primaryMain} />
      </View>
      <Text style={[ryFont('700'), styles.emptyHeading, { color: colors.fgPrimary }]}>{heading}</Text>
      <Text style={[ryFont('400'), styles.emptyBody, { color: colors.fgSecondary }]}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // list row (`.ry-row` metrics; borderless by default, divided when stacked)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
  tagDisc: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowBody: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 15, lineHeight: 20 },
  rowSub: { fontSize: 12, lineHeight: 16, marginTop: 2 },
  struck: { textDecorationLine: 'line-through' },
  // entry row — bordered card
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: radii.xl,
    marginBottom: 12,
  },
  entryTrailing: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 0 },
  // hero card
  card: {
    borderRadius: radii.xl,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 22,
    alignItems: 'center',
  },
  emblem: {
    width: 64,
    height: 64,
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logo: { width: 64, height: 64, resizeMode: 'cover' },
  logoSlot: {
    width: 64,
    height: 64,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 6,
  },
  logoSlotText: { fontSize: 9, lineHeight: 9 * 1.2, textAlign: 'center' },
  amount: {
    fontSize: 38,
    letterSpacing: 38 * -0.02,
    lineHeight: 38 * 1.05,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  valid: { fontSize: 14, marginTop: 6 },
  divider: { alignSelf: 'stretch', height: 1, marginTop: 20, marginBottom: 18 },
  barcodeWrap: { alignSelf: 'stretch' },
  ref: { fontSize: 13, marginTop: 16, fontVariant: ['tabular-nums'] },
  usedLine: { fontSize: 13, marginTop: 12, textAlign: 'center' },
  // empty state
  empty: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radii.xl,
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyIco: {
    width: 64,
    height: 64,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyHeading: { fontSize: 17, marginBottom: 6, textAlign: 'center' },
  emptyBody: {
    fontSize: 14,
    lineHeight: 14 * 1.4,
    maxWidth: 280,
    textAlign: 'center',
  },
});
