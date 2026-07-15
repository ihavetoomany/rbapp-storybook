// Money — formatted amount with optional currency suffix.
// Port of the design's Money component (components.jsx):
//   sizes { sm:14, md:18, lg:26, xl:36, xxl:44 }, 700 weight,
//   -0.02em letter-spacing, currency at half size / 600 / 0.7 opacity.

import React from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

import { rfmt, type Money as MoneyValue } from '@/src/data';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { ryFont } from './typography';

export type MoneySize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

const SIZES: Record<MoneySize, number> = { sm: 14, md: 18, lg: 26, xl: 36, xxl: 44 };

export type MoneyProps = {
  value?: MoneyValue | null;
  size?: MoneySize;
  /** Show the currency suffix (default true). */
  currency?: boolean;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export function Money({ value, size = 'md', currency = true, color, style }: MoneyProps) {
  const { colors } = useRyTheme();
  if (!value) return null;
  const fs = SIZES[size];
  return (
    <Text style={[{ color: color ?? colors.fgPrimary, fontVariant: ['tabular-nums'] }, style]}>
      <Text style={[ryFont('700'), { fontSize: fs, letterSpacing: fs * -0.02 }]}>
        {rfmt(value)}
      </Text>
      {currency && (
        <Text style={[ryFont('600'), { fontSize: fs * 0.5, opacity: 0.7 }]}>
          {' '}
          {value.currency}
        </Text>
      )}
    </Text>
  );
}
