// RcHeader — the payment sheet's screen header (`.rc-header`):
// 40px round icon buttons left/right, centered 15/700 title.
// Inside the sheet the header carries `padding-top: 10px`
// (`.ry-rcsheet .rc-header`).

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RyIcon } from '@/src/components/ry';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { ryFont } from '@/src/components/ry/typography';

export type RcHeaderProps = {
  title?: string;
  onBack?: () => void;
  onClose?: () => void;
};

function IconBtn({
  icon,
  onPress,
  label,
}: {
  icon: string;
  onPress: () => void;
  label: string;
}) {
  const { colors } = useRyTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.iconBtn,
        pressed && { backgroundColor: colors.grey100 },
      ]}>
      <RyIcon name={icon} size={18} color={colors.fgPrimary} />
    </Pressable>
  );
}

export function RcHeader({ title, onBack, onClose }: RcHeaderProps) {
  const { colors } = useRyTheme();
  return (
    <View style={styles.header}>
      {onBack ? (
        <IconBtn icon="fa-arrow-left" onPress={onBack} label="Back" />
      ) : (
        <View style={styles.iconBtn} />
      )}
      <Text style={[ryFont('700'), styles.title, { color: colors.fgPrimary }]} numberOfLines={1}>
        {title ?? ''}
      </Text>
      {onClose ? (
        <IconBtn icon="fa-xmark" onPress={onClose} label="Close" />
      ) : (
        <View style={styles.iconBtn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 8,
    flexShrink: 0,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    letterSpacing: 15 * -0.01,
    flex: 1,
    textAlign: 'center',
  },
});
