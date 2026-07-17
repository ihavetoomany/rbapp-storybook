// KvRow / KvCopyRow — `.ry-kv` key-value info rows (+ the details.jsx
// copy variant with a trailing copy affordance). Copy uses the RN core
// Clipboard (expo-clipboard is not installed in this repo).

import React, { useEffect, useRef, useState } from 'react';
import {
  Clipboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useRyTheme } from '@/src/theme/useRyTheme';

import { RyIcon } from './RyIcon';
import { ryFont } from './typography';

const MONO_FONT = Platform.select({ ios: 'Menlo', default: 'monospace' });

export type KvRowProps = {
  label: string;
  value: string | number;
  /** Monospace value (`.ry-mono`). */
  mono?: boolean;
  /** `.ry-kv-tx` — value not bold/tabular, both sides same weight. */
  tx?: boolean;
  /** Suppress the bottom hairline (`.ry-kv:last-child`). */
  last?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function KvRow({ label, value, mono = false, tx = false, last = false, style }: KvRowProps) {
  void tx;
  const { colors } = useRyTheme();
  return (
    <View
      style={[
        styles.kv,
        { borderBottomColor: colors.borderSubtle },
        last && { borderBottomWidth: 0 },
        style,
      ]}>
      <Text style={[ryFont('400'), styles.k, { color: colors.fgSecondary }]}>{label}</Text>
      <Text
        style={[
          ryFont('400'),
          styles.v,
          { color: colors.fgPrimary },
          mono && { fontFamily: MONO_FONT },
        ]}>
        {value}
      </Text>
    </View>
  );
}

export type KvCopyRowProps = {
  label: string;
  value: string | number;
  mono?: boolean;
  /** Show the copy affordance (Q3 account-number / OCR / Bankgiro rows). */
  copy?: boolean;
  last?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function KvCopyRow({
  label,
  value,
  mono = true,
  copy = false,
  last = false,
  style,
}: KvCopyRowProps) {
  const { colors } = useRyTheme();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  if (!copy) {
    return <KvRow label={label} value={value} mono={mono} last={last} style={style} />;
  }

  const onCopy = () => {
    try {
      Clipboard.setString(String(value));
    } catch {
      /* best-effort, like the design */
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1200);
  };

  return (
    <View
      style={[
        styles.kv,
        styles.kvCopy,
        { borderBottomColor: colors.borderSubtle },
        // Copy rows drop the default hairline; the design re-adds it
        // between consecutive copy rows (all but the last).
        last && { borderBottomWidth: 0 },
        style,
      ]}>
      <Text style={[ryFont('400'), styles.k, { color: colors.fgSecondary }]}>{label}</Text>
      <Text
        style={[
          ryFont('400'),
          styles.vCopy,
          { color: colors.fgPrimary },
          mono && { fontFamily: MONO_FONT },
        ]}>
        {value}
      </Text>
      <Pressable
        onPress={onCopy}
        accessibilityLabel={`Copy ${label}`}
        hitSlop={8}
        style={styles.copyBtn}>
        <RyIcon
          name="fa-copy"
          regular
          size={14}
          color={copied ? colors.successMain : colors.fgDisabled}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  kv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  kvCopy: {
    justifyContent: 'flex-start',
    gap: 12,
  },
  k: { fontSize: 14 },
  v: { fontSize: 14, fontVariant: ['tabular-nums'] },
  vCopy: { fontSize: 14, marginLeft: 'auto', fontVariant: ['tabular-nums'] },
  copyBtn: { flexShrink: 0, padding: 2 },
});
