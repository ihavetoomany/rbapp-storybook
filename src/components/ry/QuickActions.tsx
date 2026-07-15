// QuickActions — quick-actions.jsx (mobile presentation): one row of 2–4
// shortcut actions under an account hero. 52px outlined icon buttons with
// the label below; 2 items centered (32 gap), 3–4 spread evenly. Hard cap
// of 4 (extra actions log an error and are dropped), < 2 renders nothing.

import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { radii } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { RyIcon } from './RyIcon';
import { ryFont } from './typography';

export type QuickAction = {
  /** Design 'fa-*' icon name. */
  icon: string;
  label: string;
  onPress?: () => void;
};

export type QuickActionsProps = {
  actions: QuickAction[];
  style?: StyleProp<ViewStyle>;
};

export function QuickActions({ actions, style }: QuickActionsProps) {
  const { colors } = useRyTheme();
  if (!actions || actions.length < 2) return null;
  if (actions.length > 4) {
    console.error(
      `QuickActions: received ${actions.length} actions, but the hard cap is 4. Only the first 4 will render.`,
    );
  }
  const shown = actions.slice(0, 4);
  const centered = shown.length === 2;

  return (
    <View style={[styles.row, centered && styles.rowCentered, style]}>
      {shown.map((act, i) => (
        <View key={i} style={styles.action}>
          <Pressable
            onPress={act.onPress}
            accessibilityLabel={act.label}
            style={({ pressed }) => [
              styles.btn,
              {
                backgroundColor: colors.bgPaper,
                borderColor: colors.borderDefault,
                transform: [{ scale: pressed ? 0.96 : 1 }],
                opacity: pressed ? 0.85 : 1,
              },
            ]}>
            <RyIcon name={act.icon} size={19} color={colors.primaryMain} />
          </Pressable>
          <Text
            style={[ryFont('500'), styles.label, { color: colors.fgPrimary }]}
            numberOfLines={1}>
            {act.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
    gap: 8,
    marginTop: 8,
  },
  rowCentered: {
    justifyContent: 'center',
    gap: 32,
  },
  action: {
    alignItems: 'center',
    gap: 4,
  },
  btn: {
    width: 52,
    height: 52,
    borderWidth: 1.5,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 72,
  },
});
