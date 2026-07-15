// ServiceRow — `.ry-row.ry-service-row` (details.jsx): the unified
// sub-action row used by every "Services" section. 36px icon disc
// (paper bg / muted icon), 15/400 title, optional sub, chevron.
// Variants: `explore` (primary-tinted disc), `offers` (grey disc),
// `danger` (per app.css: neutral disc + primary title — the tint is
// intentionally removed in the current design).

import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { RyIcon } from './RyIcon';
import { ryFont } from './typography';

export type ServiceRowVariant = 'default' | 'explore' | 'offers';

export type ServiceRowProps = {
  /** Design 'fa-*' icon name. */
  icon: string;
  title: string;
  sub?: string;
  danger?: boolean;
  variant?: ServiceRowVariant;
  /** Suppress the bottom hairline (`.ry-row:last-child`). */
  last?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ServiceRow({
  icon,
  title,
  sub,
  danger = false,
  variant = 'default',
  last = false,
  onPress,
  style,
}: ServiceRowProps) {
  const { colors } = useRyTheme();
  const { tCard } = useT();

  const iconBg =
    variant === 'explore'
      ? colors.primaryBackground
      : variant === 'offers'
        ? colors.grey200
        : colors.bgPaper;
  const iconColor =
    variant === 'explore'
      ? colors.primaryMain
      : variant === 'offers'
        ? colors.grey500
        : colors.iconMuted;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.borderSubtle },
        last && { borderBottomWidth: 0 },
        pressed && { backgroundColor: colors.bgSubtle },
        style,
      ]}>
      <View style={[styles.icon, { backgroundColor: iconBg }]}>
        <RyIcon name={icon} size={14} color={danger ? colors.iconMuted : iconColor} />
      </View>
      <View style={styles.body}>
        <Text style={[ryFont('400'), styles.title, { color: colors.fgPrimary }]} numberOfLines={1}>
          {tCard(title)}
        </Text>
        {sub ? (
          <Text style={[ryFont('400'), styles.sub, { color: colors.fgSecondary }]} numberOfLines={2}>
            {tCard(sub)}
          </Text>
        ) : null}
      </View>
      <RyIcon name="fa-chevron-right" size={12} color={colors.fgDisabled} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  body: { flex: 1, minWidth: 0 },
  title: { fontSize: 15, lineHeight: 20 },
  sub: { fontSize: 12, lineHeight: 16, marginTop: 2 },
});
