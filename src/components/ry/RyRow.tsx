// RyRow — `.ry-row` list row: 40px icon disc · body (title / sub / third
// line) · right column (right-main / right-sub) · chevron. Press feedback
// = `.ry-row:active { background: var(--bg-subtle) }`.
//
// `settings` variant = `.ry-row.settings` (plain 26px-wide line icon, no
// tinted disc, body1/body2 type). `danger` renders the title/icon in the
// error palette (the design's close-account row convention).
//
// RyBadgeNew — `.ry-badge-new` ("N new" pill). RyCount — `.ry-count`
// (numeric mint badge).

import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { rsColors } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { RyIcon } from './RyIcon';
import { ryFont } from './typography';

export type RyRowProps = {
  /** Icon: a design 'fa-*' name, or any custom node (e.g. RyProductLogo). */
  icon?: string | React.ReactNode;
  /** Icon disc background (default row: bgSubtle). Ignored for `settings`. */
  iconBg?: string;
  iconColor?: string;
  /** FA regular (outline) icon style — the design's `far` settings icons. */
  iconRegular?: boolean;
  title: string;
  sub?: string;
  /** Second `.sub` line (e.g. invoice type / payment outcome). */
  third?: string;
  rightMain?: React.ReactNode;
  rightSub?: React.ReactNode;
  /** Strike the right-main amount (part-paid / voided invoices). */
  rightStrike?: boolean;
  /** Trailing chevron (`.chev`). */
  chevron?: boolean;
  /** External-link trailing icon (`.ext`) instead of the chevron. */
  ext?: boolean;
  /** `.ry-row.settings` styling. */
  variant?: 'default' | 'settings';
  danger?: boolean;
  /** "N new" pill before the trailing icon (`.ry-badge-new`). */
  badgeNew?: string;
  /** Numeric badge before the trailing icon (`.ry-count`). */
  count?: number;
  /** Custom trailing node (replaces chevron/ext). */
  trailing?: React.ReactNode;
  /** Suppress the bottom hairline (`.ry-row:last-child`). */
  last?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

export function RyRow({
  icon,
  iconBg,
  iconColor,
  iconRegular = false,
  title,
  sub,
  third,
  rightMain,
  rightSub,
  rightStrike = false,
  chevron = false,
  ext = false,
  variant = 'default',
  danger = false,
  badgeNew,
  count,
  trailing,
  last = false,
  onPress,
  disabled = false,
  style,
  titleStyle,
}: RyRowProps) {
  const { colors } = useRyTheme();
  const settings = variant === 'settings';

  const resolvedIconColor =
    iconColor ?? (danger ? colors.errorDark : settings ? colors.iconMuted : colors.primaryMain);
  const resolvedIconBg = iconBg ?? (danger ? colors.errorBackground : colors.bgSubtle);

  let iconNode: React.ReactNode = null;
  if (icon != null) {
    if (settings) {
      iconNode = (
        <View style={styles.sIcon}>
          {typeof icon === 'string' ? (
            <RyIcon name={icon} size={19} color={resolvedIconColor} regular={iconRegular} />
          ) : (
            icon
          )}
        </View>
      );
    } else {
      iconNode =
        typeof icon === 'string' ? (
          <View style={[styles.iconDisc, { backgroundColor: resolvedIconBg }]}>
            <RyIcon name={icon} size={15} color={resolvedIconColor} regular={iconRegular} />
          </View>
        ) : (
          icon
        );
    }
  }

  const titleColor = danger ? colors.errorMain : colors.fgPrimary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      style={({ pressed }) => [
        styles.row,
        settings && styles.rowSettings,
        { borderBottomColor: last ? 'transparent' : colors.borderSubtle },
        last && { borderBottomWidth: 0 },
        pressed && { backgroundColor: colors.bgSubtle },
        style,
      ]}>
      {iconNode}
      <View style={styles.body}>
        <Text
          style={[
            settings ? [ryFont('400'), styles.titleSettings] : [ryFont('500'), styles.title],
            { color: titleColor },
            titleStyle,
          ]}
          numberOfLines={1}>
          {title}
        </Text>
        {sub ? (
          <Text
            style={[
              ryFont('400'),
              settings ? styles.subSettings : styles.sub,
              { color: colors.fgSecondary },
            ]}
            numberOfLines={2}>
            {sub}
          </Text>
        ) : null}
        {third ? (
          <Text style={[ryFont('400'), styles.sub, { color: colors.fgSecondary }]} numberOfLines={1}>
            {third}
          </Text>
        ) : null}
      </View>
      {badgeNew ? <RyBadgeNew label={badgeNew} /> : null}
      {count != null && count > 0 ? <RyCount value={count} /> : null}
      {rightMain != null || rightSub != null ? (
        <View style={styles.right}>
          {rightMain != null ? (
            typeof rightMain === 'string' || typeof rightMain === 'number' ? (
              <Text
                style={[
                  ryFont('700'),
                  styles.rightMain,
                  { color: rightStrike ? colors.fgSecondary : colors.fgPrimary },
                  rightStrike && styles.strike,
                ]}>
                {rightMain}
              </Text>
            ) : (
              rightMain
            )
          ) : null}
          {rightSub != null ? (
            typeof rightSub === 'string' || typeof rightSub === 'number' ? (
              <Text style={[ryFont('400'), styles.rightSub, { color: colors.fgSecondary }]}>
                {rightSub}
              </Text>
            ) : (
              rightSub
            )
          ) : null}
        </View>
      ) : null}
      {trailing != null ? (
        trailing
      ) : ext ? (
        <RyIcon name="fa-arrow-up-right-from-square" size={15} color={colors.iconMuted} />
      ) : chevron ? (
        <RyIcon name="fa-chevron-right" size={12} color={colors.fgDisabled} />
      ) : null}
    </Pressable>
  );
}

/** `.ry-badge-new` — "N new" pill (chip-blue). */
export function RyBadgeNew({ label, style }: { label: string; style?: StyleProp<ViewStyle> }) {
  const { colors } = useRyTheme();
  return (
    <View style={[styles.badgeNew, { backgroundColor: colors.chipBlueBg }, style]}>
      <Text style={[ryFont('700'), styles.badgeNewText, { color: colors.chipBlueText }]}>
        {label}
      </Text>
    </View>
  );
}

/** `.ry-count` — numeric count badge (mint). */
export function RyCount({ value, style }: { value: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.count, style]}>
      <Text style={[ryFont('600'), styles.countText]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
  rowSettings: {
    padding: 16,
  },
  iconDisc: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sIcon: {
    width: 26,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, minWidth: 0 },
  title: { fontSize: 15, lineHeight: 20 },
  titleSettings: { fontSize: 16, lineHeight: 24 },
  sub: { fontSize: 12, lineHeight: 16, marginTop: 2 },
  subSettings: { fontSize: 14, lineHeight: 24, marginTop: 0 },
  right: {
    flexShrink: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  rightMain: { fontSize: 15, fontVariant: ['tabular-nums'], textAlign: 'right' },
  rightSub: { fontSize: 11, marginTop: 2, textAlign: 'right' },
  strike: { textDecorationLine: 'line-through' },
  badgeNew: {
    height: 20,
    paddingHorizontal: 8,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  badgeNewText: { fontSize: 11, lineHeight: 20 },
  count: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    backgroundColor: rsColors.mint200,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  countText: { fontSize: 12, color: rsColors.green900 },
});
