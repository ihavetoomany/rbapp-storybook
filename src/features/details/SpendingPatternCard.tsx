// SpendingPatternCard — port of family-budget.jsx Version 1 (passive,
// read-only spending pattern). The prototype renders it with the fixed
// 'lower' demo state on the Resurs Family "Family" pane; the period is
// 25th → 24th, derived live from RY_TODAY.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ryFont } from '@/src/components/ry/typography';
import { RY_TODAY } from '@/src/data';
import { useT } from '@/src/i18n';
import { radii } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { fmt0 } from './heroes';

// Demo state 'lower' — family-budget.jsx PATTERN_STATES.lower.
const STATE = { spent: 1100, avg: 500, forecast: 8100, diff: -20 };

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_SV = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

function cyclePeriod(startDay: number, today: Date): { start: Date; end: Date; daysLeft: number } {
  const t = new Date(today);
  t.setHours(0, 0, 0, 0);
  const clampDay = (y: number, m: number, day: number) => Math.min(day, new Date(y, m + 1, 0).getDate());
  let start = new Date(t.getFullYear(), t.getMonth(), clampDay(t.getFullYear(), t.getMonth(), startDay));
  if (start > t)
    start = new Date(t.getFullYear(), t.getMonth() - 1, clampDay(t.getFullYear(), t.getMonth() - 1, startDay));
  const em = start.getMonth() + 1;
  const end = new Date(start.getFullYear(), em, clampDay(start.getFullYear(), em, startDay));
  end.setDate(end.getDate() - 1);
  const daysLeft = Math.max(0, Math.round((end.getTime() - t.getTime()) / 86400000));
  return { start, end, daysLeft };
}

export function SpendingPatternCard() {
  const { colors } = useRyTheme();
  const { t, lang } = useT();
  const months = lang === 'Svenska' ? MONTHS_SV : MONTHS_EN;
  const shortDate = (d: Date) => `${d.getDate()} ${months[d.getMonth()]}`;
  const { start, end, daysLeft } = cyclePeriod(25, new Date(RY_TODAY));
  const range = `${shortDate(start)}–${shortDate(end)}`;

  const Tile = ({ label, value, sub }: { label: string; value: string; sub: string }) => (
    <View style={[styles.tile, { backgroundColor: colors.bgDefault }]}>
      <Text style={[ryFont('400'), styles.tileLabel, { color: colors.fgSecondary }]}>{label}</Text>
      <Text style={[ryFont('700'), styles.tileValue, { color: colors.fgPrimary }]}>{value}</Text>
      <Text style={[ryFont('400'), styles.tileSub, { color: colors.fgSecondary }]}>{sub}</Text>
    </View>
  );

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle },
      ]}>
      <Text style={[ryFont('400'), styles.periodLabel, { color: colors.fgSecondary }]}>
        {t('fbp.period')}
      </Text>
      <Text style={[ryFont('400'), styles.periodRange, { color: colors.fgSecondary }]}>
        {t('fbp.period_line', range, daysLeft)}
      </Text>
      <View style={styles.tiles}>
        <Tile
          label={t('fbp.spent_so_far')}
          value={`${fmt0(STATE.spent)} kr`}
          sub={t('fbp.avg_per_day', fmt0(STATE.avg))}
        />
        <Tile label={t('fbp.forecast')} value={`${fmt0(STATE.forecast)} kr`} sub={t('fbp.at_end')} />
      </View>
      <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />
      <Text style={[ryFont('400'), styles.compare, { color: colors.fgSecondary }]}>
        {t('fbp.compare_lower', fmt0(Math.abs(STATE.diff)))}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radii.xl,
    padding: 16,
    marginBottom: 12,
  },
  periodLabel: { fontSize: 13, lineHeight: 17 },
  periodRange: { fontSize: 13, lineHeight: 17, marginTop: 2 },
  tiles: { flexDirection: 'row', gap: 12, marginTop: 12 },
  tile: { flex: 1, borderRadius: 14, paddingVertical: 8, paddingHorizontal: 8, alignItems: 'center' },
  tileLabel: { fontSize: 13 },
  tileValue: { fontSize: 22, letterSpacing: 22 * -0.01, marginTop: 2, fontVariant: ['tabular-nums'] },
  tileSub: { fontSize: 12, marginTop: 2, textAlign: 'center' },
  divider: { height: 1, marginVertical: 8 },
  compare: { fontSize: 13, lineHeight: 18 },
});
