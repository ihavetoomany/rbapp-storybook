// EmptyState — port from tabs.jsx: centered 64px mint disc + icon,
// 17/700 title, 14 secondary description, optional outlined-sm CTA.

import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useRyTheme } from '@/src/theme/useRyTheme';

import { RyButton } from './RyButton';
import { RyIcon } from './RyIcon';
import { ryTints } from './tints';
import { ryFont } from './typography';

export type EmptyStateProps = {
  /** Design 'fa-*' icon name. */
  icon: string;
  title: string;
  desc?: string;
  /** CTA label — renders an outlined-sm RyButton when set. */
  cta?: string;
  onCta?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function EmptyState({ icon, title, desc, cta, onCta, style }: EmptyStateProps) {
  const { colors, dark } = useRyTheme();
  const tints = ryTints(dark);
  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.disc, { backgroundColor: tints.mint100 }]}>
        <RyIcon name={icon} size={26} color={colors.primaryMain} />
      </View>
      <Text style={[ryFont('700'), styles.title, { color: colors.fgPrimary }]}>{title}</Text>
      {desc ? (
        <Text style={[ryFont('400'), styles.desc, { color: colors.fgSecondary }]}>{desc}</Text>
      ) : null}
      {cta ? <RyButton title={cta} variant="outlined" sm onPress={onCta} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  disc: {
    width: 64,
    height: 64,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    marginBottom: 6,
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    lineHeight: 14 * 1.4,
    maxWidth: 280,
    textAlign: 'center',
    marginBottom: 16,
  },
});
