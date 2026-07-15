// RyButton — `.ry-btn`: pill radius, 15/700 label, padding 16/28.
// Variants: primary / outlined / ghost / danger (`.md-btn-danger`) /
// logout. `block` = full width, `sm` = 13px label + 10/18 padding.
// Dark mode: primary/danger text = --rs-green-950 per the app.css
// `[data-theme="dark"] .ry-btn.primary` override (primary only).

import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { rsColors } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { RyIcon } from './RyIcon';
import { ryFont } from './typography';

export type RyButtonVariant = 'primary' | 'outlined' | 'ghost' | 'danger' | 'logout';

export type RyButtonProps = {
  title: string;
  variant?: RyButtonVariant;
  /** Full-width (`.ry-btn.block`). */
  block?: boolean;
  /** Small (`.ry-btn.sm`): 13px label, 10/18 padding. */
  sm?: boolean;
  /** Leading icon — design 'fa-*' name. */
  icon?: string;
  iconRegular?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function RyButton({
  title,
  variant = 'primary',
  block = false,
  sm = false,
  icon,
  iconRegular = false,
  disabled = false,
  onPress,
  style,
  textStyle,
}: RyButtonProps) {
  const { colors, dark } = useRyTheme();

  type Skin = { bg: string; bgActive: string; fg: string; borderColor?: string };
  const skins: Record<RyButtonVariant, Skin> = {
    primary: {
      bg: colors.primaryMain,
      bgActive: colors.primaryDark,
      fg: dark ? rsColors.green950 : '#FFFFFF',
    },
    outlined: {
      bg: 'transparent',
      bgActive: 'transparent',
      fg: colors.primaryMain,
      borderColor: colors.primaryMain,
    },
    ghost: { bg: 'transparent', bgActive: 'transparent', fg: colors.primaryMain },
    danger: { bg: colors.errorMain, bgActive: colors.errorDark, fg: colors.errorContrast },
    logout: { bg: colors.grey200, bgActive: colors.grey300, fg: colors.fgPrimary },
  };
  const skin = skins[variant];

  const outlined = variant === 'outlined';
  const ghost = variant === 'ghost';
  // .ry-btn: 16/28; .outlined compensates the 1.5px border (14.5/26.5);
  // .ghost: 12; .sm: 10/18 (outlined sm: 8.5/16.5).
  const padV = ghost ? 12 : sm ? (outlined ? 8.5 : 10) : outlined ? 14.5 : 16;
  const padH = ghost ? 12 : sm ? (outlined ? 16.5 : 18) : outlined ? 26.5 : 28;
  const fontSize = sm ? 13 : 15;

  const fg = disabled ? colors.fgDisabled : skin.fg;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        {
          paddingVertical: padV,
          paddingHorizontal: padH,
          backgroundColor: disabled
            ? colors.grey200
            : pressed
              ? skin.bgActive
              : skin.bg,
        },
        outlined && {
          borderWidth: 1.5,
          borderColor: disabled ? 'transparent' : skin.borderColor,
        },
        block && styles.block,
        // Logout rows carry a wider 10px gap in the design (`.ry-btn.logout`).
        variant === 'logout' && { gap: 10 },
        style,
      ]}>
      {icon ? <RyIcon name={icon} size={fontSize} color={fg} regular={iconRegular} /> : null}
      <Text style={[ryFont('700'), { fontSize, lineHeight: fontSize + 1, color: fg }, textStyle]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  block: {
    alignSelf: 'stretch',
    width: '100%',
  },
});
