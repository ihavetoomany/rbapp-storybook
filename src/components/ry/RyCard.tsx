// RyCard — `.ry-card`: bg paper, 1px borderSubtle, radius 20 (--radius-xl),
// margin-bottom 12, overflow hidden. `elevated` = `.ry-card.elev`
// (shadow-card, no border). RyCardHead — `.ry-card-head` label row.

import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { radii, shadowCard } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { ryFont } from './typography';

export type RyCardProps = {
  children?: React.ReactNode;
  /** `.ry-card.elev` — shadow-card instead of the hairline border. */
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function RyCard({ children, elevated = false, style }: RyCardProps) {
  const { colors } = useRyTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.bgPaper },
        elevated
          ? { ...shadowCard, borderWidth: 0 }
          : { borderWidth: 1, borderColor: colors.borderSubtle },
        style,
      ]}>
      {children}
    </View>
  );
}

export type RyCardHeadProps = {
  label: string;
  /** Right-aligned action link (`.ry-card-head .link`). */
  link?: string;
  onLinkPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function RyCardHead({ label, link, onLinkPress, style }: RyCardHeadProps) {
  const { colors } = useRyTheme();
  return (
    <View style={[styles.head, style]}>
      <Text style={[ryFont('600'), styles.headLabel, { color: colors.fgSecondary }]}>
        {label.toUpperCase()}
      </Text>
      {link ? (
        <Pressable onPress={onLinkPress} hitSlop={8}>
          <Text style={[ryFont('600'), styles.headLink, { color: colors.primaryMain }]}>
            {link}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    marginBottom: 12,
    overflow: 'hidden',
  },
  head: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  headLabel: {
    fontSize: 13,
    letterSpacing: 13 * 0.04,
  },
  headLink: {
    fontSize: 13,
  },
});
