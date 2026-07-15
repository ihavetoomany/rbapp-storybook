// RyTabBar — port of the design's BottomTabBar (`.ry-tabbar`): a floating
// frosted pill above the home indicator with 4 icon+label items, active
// state and an optional count badge (`.ry-tab-badge`). Labels resolve via
// i18n `tab.<id>` keys (override with `labelKey`).

import { BlurView } from 'expo-blur';
import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { RyIcon } from './RyIcon';
import { ryFont } from './typography';

export type RyTabBarItem = {
  id: string;
  /** Design 'fa-*' icon name. */
  icon: string;
  /** i18n key for the label; defaults to `tab.<id>`. */
  labelKey?: string;
};

export type RyTabBarProps = {
  items: RyTabBarItem[];
  activeId: string;
  onSelect: (id: string) => void;
  /** Per-tab numeric badges, keyed by tab id (shown when > 0). */
  badges?: Record<string, number | undefined>;
  style?: StyleProp<ViewStyle>;
};

export function RyTabBar({ items, activeId, onSelect, badges = {}, style }: RyTabBarProps) {
  const { colors, dark } = useRyTheme();
  const { t } = useT();
  const insets = useSafeAreaInsets();

  const inactiveColor = dark ? 'rgba(255,255,255,0.38)' : 'rgba(20, 32, 29, 0.42)';
  const activeColor = dark ? colors.primaryLight : colors.primaryMain;

  return (
    <View
      style={[
        styles.wrap,
        { bottom: Math.max(insets.bottom, 28) },
        // Outer shadow (design: 0 6px 24px rgba(0,0,0,.09) + 0 1px 4px).
        dark ? styles.shadowDark : styles.shadowLight,
        style,
      ]}
      pointerEvents="box-none">
      <View
        style={[
          styles.pill,
          {
            borderColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.55)',
          },
        ]}>
        <BlurView intensity={48} tint={dark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: dark ? 'rgba(28, 30, 34, 0.45)' : 'rgba(255, 255, 255, 0.28)' },
          ]}
        />
        <View style={styles.rowInner}>
          {items.map((it) => {
            const active = it.id === activeId;
            const badge = badges[it.id] ?? 0;
            const color = active ? activeColor : inactiveColor;
            return (
              <Pressable
                key={it.id}
                onPress={() => onSelect(it.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                style={[
                  styles.item,
                  active && {
                    backgroundColor: dark ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.55)',
                  },
                ]}>
                <View style={styles.ico}>
                  <RyIcon name={it.icon} size={17} color={color} />
                  {badge > 0 ? (
                    <View style={[styles.badge, { backgroundColor: colors.errorMain }]}>
                      <Text style={[ryFont('700'), styles.badgeText]}>{badge}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={[ryFont('600'), styles.label, { color }]} numberOfLines={1}>
                  {t(it.labelKey ?? 'tab.' + it.id)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 30,
  },
  shadowLight: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 8,
  },
  shadowDark: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 12,
    elevation: 8,
  },
  pill: {
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  rowInner: {
    flexDirection: 'row',
    padding: 4,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 999,
  },
  ico: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: -6,
    left: '100%',
    transform: [{ translateX: -6 }],
    minWidth: 14,
    height: 14,
    paddingHorizontal: 3,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 9,
    lineHeight: 11,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  label: {
    fontSize: 9.5,
  },
});
