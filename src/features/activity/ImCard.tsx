// ImCard — port of the design's invoice-model card row + ImTag
// (activity-invoice-model.jsx ImCard + the `.im-card` / `.im-stack` /
// `.im-list` / `.im-tag` styles in IM_STYLE). Brand logo on the left in
// EVERY state, name / date / third line, amount + one short status tag.

import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { RyProductLogo } from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { radii } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { imFmt, type ImCardData, type ImTagData } from './invoiceModel';

export function ImTag({ tag }: { tag: ImTagData }) {
  const { colors } = useRyTheme();
  const color =
    tag.tone === 'error'
      ? colors.errorMain
      : tag.tone === 'info'
        ? colors.infoMain
        : tag.tone === 'success'
          ? colors.successMain
          : colors.fgSecondary; // muted / urgent / neutral
  return <Text style={[ryFont('600'), styles.tag, { color }]}>{tag.text}</Text>;
}

export type ImCardRowProps = {
  card: ImCardData;
  onPress?: (card: ImCardData) => void;
  /** To-pay stack styling (own bordered card + state tint); default is a
   *  row inside the Handled `.im-list` card. */
  stacked?: boolean;
  /** Suppress the bottom hairline (list rows). */
  last?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ImCard({ card: c, onPress, stacked = false, last = false, style }: ImCardRowProps) {
  const { colors, dark } = useRyTheme();
  const overdue = c.state === 'overdue';
  const failed = c.state === 'failed';
  const missed = c.state === 'missed';

  // Stacked state surfaces (IM_STYLE .im-stack .im-card.* + dark overrides).
  const redBorderStrong = dark ? 'rgba(251, 139, 140, 0.45)' : 'rgba(186, 26, 25, 0.40)';
  const redBorderSoft = dark ? 'rgba(251, 139, 140, 0.45)' : 'rgba(186, 26, 25, 0.35)';
  let bg = 'transparent';
  let borderColor = colors.borderSubtle;
  if (stacked) {
    bg = colors.bgPaper;
    if (overdue) {
      bg = dark ? 'rgba(251, 139, 140, 0.14)' : 'rgba(186, 26, 25, 0.07)';
      borderColor = redBorderStrong;
    } else if (c.hasMissed) {
      borderColor = redBorderStrong;
    } else if (failed || missed) {
      borderColor = redBorderSoft;
    }
  }

  const pressedBg = stacked && overdue ? 'rgba(186, 26, 25, 0.13)' : colors.bgSubtle;

  const shownAmount =
    c.state === 'paid-partial' && c.paid?.amount != null
      ? c.paid.amount
      : c.state === 'scheduled' && c.amount < c.fullAmount
        ? c.amount
        : c.fullAmount;

  return (
    <Pressable
      onPress={onPress ? () => onPress(c) : undefined}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        stacked
          ? [styles.cardStacked, { backgroundColor: bg, borderColor }]
          : { borderBottomColor: last ? 'transparent' : colors.borderSubtle, borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth },
        pressed && { backgroundColor: pressedBg },
        style,
      ]}>
      <View style={styles.logoWrap}>
        <RyProductLogo product={c.product} style={styles.logo} />
      </View>
      <View style={styles.body}>
        <View style={styles.main}>
          <Text style={[ryFont('700'), styles.name, { color: colors.fgPrimary }]} numberOfLines={1}>
            {c.name}
          </Text>
          <Text style={[ryFont('400'), styles.line, { color: colors.fgSecondary }]} numberOfLines={1}>
            {c.date}
          </Text>
          <Text style={[ryFont('500'), styles.line, { color: colors.fgSecondary }]} numberOfLines={1}>
            {c.third}
          </Text>
        </View>
        <View style={styles.right}>
          <Text
            style={[
              c.strike ? ryFont('600') : ryFont('700'),
              styles.amt,
              { color: c.strike ? colors.fgSecondary : colors.fgPrimary },
              c.strike && styles.strike,
            ]}>
            {imFmt(shownAmount)} <Text style={styles.cur}>kr</Text>
          </Text>
          <ImTag tag={c.tag} />
        </View>
      </View>
    </Pressable>
  );
}

/** `.im-stack` — To-pay cards, 8px apart. */
export function ImStack({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.stack, style]}>{children}</View>;
}

/** `.im-list` — Handled rows inside one bordered card. */
export function ImList({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { colors } = useRyTheme();
  return (
    <View
      style={[
        styles.list,
        { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  cardStacked: {
    borderWidth: 1,
    borderRadius: radii.lg,
  },
  stack: { gap: 8 },
  list: {
    borderWidth: 1,
    borderRadius: radii.lg,
    overflow: 'hidden',
    marginBottom: 12,
  },
  logoWrap: { width: 40, height: 40, flexShrink: 0 },
  logo: { width: 40, height: 40 },
  body: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  main: { flex: 1, minWidth: 0, gap: 4 },
  right: {
    flexShrink: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
  },
  name: {
    fontSize: 17,
    lineHeight: 17 * 1.2,
  },
  line: {
    fontSize: 12.5,
    lineHeight: 12.5 * 1.25,
  },
  amt: {
    fontSize: 15,
    lineHeight: 15 * 1.25,
    fontVariant: ['tabular-nums'],
  },
  cur: { fontSize: 15 },
  strike: { textDecorationLine: 'line-through' },
  tag: {
    fontSize: 12,
    lineHeight: 12 * 1.25,
    letterSpacing: 12 * 0.01,
  },
});
