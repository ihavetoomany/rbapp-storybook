// RcCtaZone + RcCtaButton — the payment sheet CTA (`.rc-cta-zone` / `.rc-cta`).
// The zone sits below the scrolling body (padding 16/20/30 inside the sheet);
// the CSS gradient fade is approximated with a solid bg-default fill.

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RyIcon } from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { useRyTheme } from '@/src/theme/useRyTheme';

export function RcCtaZone({ children }: { children: React.ReactNode }) {
  const { colors } = useRyTheme();
  return (
    <View style={[styles.zone, { backgroundColor: colors.bgDefault }]}>{children}</View>
  );
}

export type RcCtaButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  /** Leading icon (e.g. 'fa-fingerprint'). */
  icon?: string;
  /** Trailing icon (e.g. 'fa-arrow-right', 13px like the design). */
  trailingIcon?: string;
  maxWidth?: number;
};

export function RcCtaButton({
  title,
  onPress,
  disabled = false,
  icon,
  trailingIcon,
  maxWidth,
}: RcCtaButtonProps) {
  const { colors } = useRyTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.cta,
        {
          backgroundColor: disabled
            ? colors.grey400
            : pressed
              ? colors.primaryDark
              : colors.primaryMain,
        },
        maxWidth != null && { maxWidth, alignSelf: 'center', width: '100%' },
        pressed && !disabled && { transform: [{ scale: 0.99 }] },
      ]}>
      {icon ? <RyIcon name={icon} size={15} color="#FFFFFF" /> : null}
      <Text style={[ryFont('700'), styles.label]}>{title}</Text>
      {trailingIcon ? <RyIcon name={trailingIcon} size={13} color="#FFFFFF" /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // .ry-rcsheet .rc-cta-zone: padding 16px 20px 30px
  zone: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 30,
    flexShrink: 0,
  },
  cta: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontSize: 15,
    lineHeight: 15,
    letterSpacing: 15 * -0.01,
    color: '#FFFFFF',
  },
});
