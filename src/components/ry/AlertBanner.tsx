// AlertBanner — `.ry-banner` (info | warning | success | error): tinted
// 16px-radius block, 16px leading icon, 13px body, optional bold title.
// Dark mode lifts the text/icon to the design's lighter alert hexes
// (app.css `[data-theme="dark"] .ry-banner.*` overrides).

import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useRyTheme } from '@/src/theme/useRyTheme';

import { RyIcon } from './RyIcon';
import { ryFont } from './typography';

export type AlertBannerVariant = 'info' | 'warning' | 'success' | 'error';

const DEFAULT_ICON: Record<AlertBannerVariant, string> = {
  info: 'fa-circle-info',
  warning: 'fa-circle-info',
  success: 'fa-circle-check',
  error: 'fa-triangle-exclamation',
};

// Dark-mode text/icon lift (app.css hardcodes these per variant).
const DARK_FG: Record<AlertBannerVariant, string> = {
  error: '#FFA2A2',
  warning: '#FEE685',
  info: '#B8E6FE',
  success: '#B0E2C7',
};

export type AlertBannerProps = {
  variant?: AlertBannerVariant;
  title?: string;
  /** Body text; `children` may be used instead for rich content. */
  body?: string;
  children?: React.ReactNode;
  /** Icon override — design 'fa-*' name. */
  icon?: string;
  style?: StyleProp<ViewStyle>;
};

export function AlertBanner({
  variant = 'info',
  title,
  body,
  children,
  icon,
  style,
}: AlertBannerProps) {
  const { colors, dark } = useRyTheme();
  const bg = colors[`${variant}Background`];
  const fg = dark ? DARK_FG[variant] : colors[`${variant}Dark`];
  const content = body != null ? body : children;

  return (
    <View style={[styles.banner, { backgroundColor: bg }, style]}>
      <RyIcon
        name={icon ?? DEFAULT_ICON[variant]}
        size={16}
        color={fg}
        style={styles.icon}
      />
      <View style={styles.body}>
        {title != null ? (
          <Text style={[ryFont('700'), styles.text, { color: fg }]}>{title}</Text>
        ) : null}
        {typeof content === 'string' ? (
          <Text style={[ryFont('400'), styles.text, { color: fg }]}>{content}</Text>
        ) : (
          content ?? null
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  icon: { paddingTop: 1, flexShrink: 0 },
  body: { flex: 1, minWidth: 0 },
  text: { fontSize: 13, lineHeight: 13 * 1.4 },
});
