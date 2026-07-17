// SectionTitle — `.ry-section-title` (13/600 uppercase secondary,
// margin 20 4 8). `mr` variant = `.ry-mr-section` (My Resurs sentence-case
// section header: 20/600 primary, margin 28 4 12).

import React from 'react';
import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { useRyTheme } from '@/src/theme/useRyTheme';

import { ryFont } from './typography';

export type SectionTitleProps = {
  children: string;
  /** `.ry-mr-section` — larger sentence-case My Resurs section header. */
  mr?: boolean;
  style?: StyleProp<TextStyle>;
};

export function SectionTitle({ children, mr = false, style }: SectionTitleProps) {
  const { colors } = useRyTheme();
  if (mr) {
    return (
      <Text style={[ryFont('600'), styles.mr, { color: colors.fgPrimary }, style]}>
        {children}
      </Text>
    );
  }
  return (
    <Text style={[ryFont('600'), styles.section, { color: colors.fgSecondary }, style]}>
      {children.toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  section: {
    fontSize: 13,
    letterSpacing: 13 * 0.04,
    marginTop: 20,
    marginBottom: 8,
    marginHorizontal: 4,
  },
  mr: {
    fontSize: 20,
    letterSpacing: 20 * -0.01,
    marginTop: 28,
    marginBottom: 12,
    marginHorizontal: 4,
  },
});
