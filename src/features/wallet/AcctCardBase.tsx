// AcctCardBase — the shared `.ry-acct-card` visual (app.css): left logo
// tile, name row (17/700 + status pills), type line, right figure column
// (17/700 amount + 13 qualifier), optional third context line. Used by
// both ProductRollupCard and AccountCardV2 (their markup is identical).
//
// `tall` = `.ry-acct-card--account` (22px vertical padding — real account
// rows stand taller than one-time-credit purchase rows).

import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { radii } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { ryFont } from '@/src/components/ry/typography';

export type AcctCardPill = {
  label: string;
  tone: 'closing' | 'overdue' | 'attention';
};

export type AcctCardBaseProps = {
  logo: React.ReactNode;
  name: string;
  pills?: AcctCardPill[];
  sub: string;
  /** Formatted amount, e.g. "12 450 kr". */
  figureText: string;
  qualifier: string;
  context?: string | null;
  /** `.ry-acct-card--account` — taller row. */
  tall?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function AcctCardBase({
  logo,
  name,
  pills = [],
  sub,
  figureText,
  qualifier,
  context,
  tall = false,
  onPress,
  style,
}: AcctCardBaseProps) {
  const { colors } = useRyTheme();

  const pillColors = (tone: AcctCardPill['tone']) =>
    tone === 'closing'
      ? { backgroundColor: colors.warningBackground, color: colors.warningDark }
      : { backgroundColor: colors.errorBackground, color: colors.errorDark };

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: pressed ? colors.grey50 : colors.bgPaper,
          borderColor: colors.borderSubtle,
        },
        tall && styles.cardTall,
        style,
      ]}>
      {logo}
      <View style={styles.body}>
        <View style={styles.top}>
          <View style={styles.headings}>
            <View style={styles.nameRow}>
              <Text
                numberOfLines={1}
                style={[ryFont('700'), styles.name, { color: colors.fgPrimary }]}>
                {name}
              </Text>
              {pills.map((pill) => {
                const c = pillColors(pill.tone);
                return (
                  <View
                    key={pill.tone + pill.label}
                    style={[styles.pill, { backgroundColor: c.backgroundColor }]}>
                    <Text style={[ryFont('700'), styles.pillText, { color: c.color }]}>
                      {pill.label}
                    </Text>
                  </View>
                );
              })}
            </View>
            <Text numberOfLines={1} style={[ryFont('400'), styles.sub, { color: colors.fgSecondary }]}>
              {sub}
            </Text>
          </View>
          <View style={styles.fig}>
            <Text numberOfLines={1} style={[ryFont('700'), styles.amt, { color: colors.fgPrimary }]}>
              {figureText}
            </Text>
            <Text numberOfLines={1} style={[ryFont('400'), styles.qual, { color: colors.fgSecondary }]}>
              {qualifier}
            </Text>
          </View>
        </View>
        {context ? (
          <Text style={[ryFont('400'), styles.context, { color: colors.fgSecondary }]}>
            {context}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    width: '100%',
    borderWidth: 1,
    borderRadius: radii.xl,
    padding: 16,
    marginBottom: 12,
  },
  cardTall: {
    paddingTop: 22,
    paddingBottom: 22,
  },
  body: { flex: 1, minWidth: 0 },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  headings: { flex: 1, minWidth: 0 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  },
  name: {
    fontSize: 17,
    letterSpacing: 17 * -0.01,
    flexShrink: 1,
  },
  sub: {
    fontSize: 13,
    marginTop: 2,
  },
  fig: {
    flexShrink: 0,
    alignItems: 'flex-end',
    minWidth: 92,
  },
  amt: {
    fontSize: 17,
    letterSpacing: 17 * -0.01,
    fontVariant: ['tabular-nums'],
  },
  qual: {
    fontSize: 13,
    marginTop: 2,
  },
  context: {
    fontSize: 13,
    lineHeight: 13 * 1.35,
    marginTop: 20,
  },
  pill: {
    flexShrink: 0,
    paddingVertical: 2,
    paddingHorizontal: 9,
    borderRadius: 999,
  },
  pillText: {
    fontSize: 11,
    letterSpacing: 11 * 0.01,
  },
});
