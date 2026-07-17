// BellButton — `.ry-pill-btn.icon.ry-bell`: 36px frosted round button with
// a bell glyph and either an unread dot (`.ry-bell-dot`) or a numeric
// badge (`.ry-bell-badge`).

import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useRyTheme } from '@/src/theme/useRyTheme';

import { RyIcon } from './RyIcon';
import { ryFont } from './typography';

export type BellButtonProps = {
  /** Show the plain unread dot (design: notifCount === null). */
  dot?: boolean;
  /** Numeric badge; rendered when > 0 (takes precedence over `dot`). */
  count?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function BellButton({ dot = false, count = 0, onPress, style }: BellButtonProps) {
  const { colors, dark } = useRyTheme();
  return (
    <Pressable
      accessibilityLabel="Notifications"
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.7)',
          borderColor: dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}>
      <View style={styles.ico}>
        <RyIcon name="fa-bell" size={17} color={colors.fgPrimary} />
        {count > 0 ? (
          <View style={[styles.badge, { backgroundColor: colors.errorMain, borderColor: colors.bgDefault }]}>
            <Text style={[ryFont('700'), styles.badgeText]}>{count}</Text>
          </View>
        ) : dot ? (
          <View style={[styles.dot, { backgroundColor: colors.errorMain }]} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  ico: { position: 'relative' },
  dot: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  badge: {
    position: 'absolute',
    top: -7,
    right: -11,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    lineHeight: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
