// HandleSummary — `.ry-handle-summary` (app.css): the centred "Total amount
// to handle" card used by the Current Activity tab and InvoiceListView.

import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { ryFont } from '@/src/components/ry/typography';
import { rfmt } from '@/src/data';
import { useT } from '@/src/i18n';
import { radii, shadowCard } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

export function HandleSummary({ total, style }: { total: number; style?: StyleProp<ViewStyle> }) {
  const { colors } = useRyTheme();
  const { t } = useT();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle },
        style,
      ]}>
      <Text style={[ryFont('700'), styles.lbl, { color: colors.fgSecondary }]}>
        {t('summary.total_label').toUpperCase()}
      </Text>
      <Text style={[ryFont('800'), styles.total, { color: colors.fgPrimary }]}>
        {rfmt({ amount: total, currency: 'SEK' })} kr
      </Text>
      <Text style={[ryFont('400'), styles.hint, { color: colors.fgSecondary }]}>
        {t('summary.hint')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radii.xl,
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 28,
    marginBottom: 22,
    ...shadowCard,
  },
  lbl: {
    fontSize: 13,
    letterSpacing: 13 * 0.04,
    textAlign: 'center',
  },
  total: {
    fontSize: 38,
    letterSpacing: 38 * -0.02,
    marginTop: 6,
    marginBottom: 8,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  hint: {
    fontSize: 13,
    textAlign: 'center',
  },
});
