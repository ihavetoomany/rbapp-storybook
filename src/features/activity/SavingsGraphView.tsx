// SavingsGraphView — port from activity-carousel.jsx: savings overview
// with a synthetic 12-month area chart (react-native-svg) + account list.

import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import {
  CompactHeader,
  HelpSupport,
  RyCard,
  SectionTitle,
  useCompactHeaderOffset,
  useStickyHeaderScroll,
} from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { rfmt, rfmtDate, RY_TODAY, type DepositAccount, type Product } from '@/src/data';
import { useT } from '@/src/i18n';
import { radii } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { usePersona } from '@/src/tweaks/TweaksProvider';

type DepositWithProduct = DepositAccount & { product: Product };

export function SavingsGraphView() {
  const { colors } = useRyTheme();
  const { t } = useT();
  const persona = usePersona();
  const insets = useSafeAreaInsets();
  const headerOffset = useCompactHeaderOffset();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();
  const { width: winW } = useWindowDimensions();

  const accounts = useMemo(() => {
    const out: DepositWithProduct[] = [];
    (persona.products || []).forEach((p) => {
      (p.accounts || [])
        .filter((a): a is DepositAccount => a.type === 'depositAccount' && !a.hidden)
        .forEach((a) => out.push({ ...a, product: p }));
    });
    return out;
  }, [persona]);

  const totalBalance = accounts.reduce((s, a) => s + (a.balance ? a.balance.amount : 0), 0);

  // Synthetic 12-month history — work backwards from the current balance.
  const history = useMemo(() => {
    const now = new Date(RY_TODAY);
    const avgRate =
      accounts.length > 0
        ? accounts.reduce((s, a) => s + (Number(a.interestRate) || 3.5), 0) / accounts.length
        : 3.5;
    const monthlyRate = avgRate / 100 / 12;
    const monthlyDeposit = totalBalance > 0 ? totalBalance * 0.06 : 500;
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const monthsAgo = 11 - i;
      const interest = totalBalance * monthlyRate * monthsAgo;
      const deposits = monthlyDeposit * monthsAgo;
      const amount = Math.max(
        0,
        totalBalance - deposits - interest + Math.sin(i * 0.9) * monthlyDeposit * 0.15,
      );
      return {
        month: d.toLocaleString('en', { month: 'short' }),
        amount: i === 11 ? totalBalance : amount,
      };
    });
  }, [accounts, totalBalance]);

  // SVG chart — 320×130 viewBox scaled to the card width.
  const W = 320;
  const H = 130;
  const PAD_Y = 12;
  const amts = history.map((p) => p.amount);
  const maxAmt = Math.max(...amts, 1);
  const minAmt = Math.min(...amts) * 0.85;
  const xS = (i: number) => (i * W) / (history.length - 1);
  const yS = (v: number) => PAD_Y + (1 - (v - minAmt) / (maxAmt - minAmt || 1)) * (H - PAD_Y * 2);

  const coords = history.map((p, i) => ({ x: xS(i), y: yS(p.amount) }));
  let linePath = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 1; i < coords.length; i++) {
    const cpx = (coords[i - 1].x + coords[i].x) / 2;
    linePath += ` C ${cpx} ${coords[i - 1].y} ${cpx} ${coords[i].y} ${coords[i].x} ${coords[i].y}`;
  }
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${H} L ${coords[0].x} ${H} Z`;

  const labelIdxs = [0, 3, 6, 9, 11];
  const chartW = winW - 32; // page padding

  return (
    <View style={[styles.screen, { backgroundColor: colors.bgDefault }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: headerOffset,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 32,
        }}
        showsVerticalScrollIndicator={false}>
        {/* ── Hero balance ── */}
        <View style={styles.heroWrap}>
          <Text style={[ryFont('500'), styles.heroLabel, { color: colors.fgSecondary }]}>
            {t('sg.total')}
          </Text>
          <Text style={[ryFont('800'), styles.heroValue, { color: colors.fgPrimary }]}>
            {rfmt({ amount: totalBalance, currency: 'SEK' })}
            <Text style={[ryFont('600'), styles.heroCur]}> kr</Text>
          </Text>
        </View>

        {/* ── Chart card ── */}
        <View
          style={[
            styles.chartCard,
            { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle },
          ]}>
          <Svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            width="100%"
            height={140}>
            <Defs>
              <LinearGradient id="sg-fill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.primaryMain} stopOpacity="0.20" />
                <Stop offset="1" stopColor={colors.primaryMain} stopOpacity="0.01" />
              </LinearGradient>
            </Defs>
            <Path d={areaPath} fill="url(#sg-fill)" />
            <Path
              d={linePath}
              fill="none"
              stroke={colors.primaryMain}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <Circle
              cx={coords[coords.length - 1].x}
              cy={coords[coords.length - 1].y}
              r={4}
              fill={colors.primaryMain}
            />
          </Svg>
          {/* Month labels */}
          <View style={styles.labels}>
            {labelIdxs.map((idx) => (
              <Text
                key={idx}
                style={[
                  ryFont('400'),
                  styles.label,
                  {
                    color: colors.fgDisabled,
                    left: (xS(idx) / W) * (chartW - 24) + 12 - 14,
                  },
                ]}>
                {history[idx].month}
              </Text>
            ))}
          </View>
        </View>

        {/* ── Accounts ── */}
        {accounts.length > 0 ? (
          <>
            <SectionTitle>{t('sg.accounts')}</SectionTitle>
            <RyCard>
              {accounts.map((a, i) => (
                <View
                  key={a.id}
                  style={[
                    styles.acctRow,
                    {
                      borderBottomColor:
                        i === accounts.length - 1 ? 'transparent' : colors.borderSubtle,
                      borderBottomWidth:
                        i === accounts.length - 1 ? 0 : StyleSheet.hairlineWidth,
                    },
                  ]}>
                  <View style={styles.acctBody}>
                    <Text style={[ryFont('600'), styles.acctName, { color: colors.fgPrimary }]}>
                      {a.name || a.product.name}
                    </Text>
                    <Text style={[ryFont('400'), styles.acctSub, { color: colors.fgSecondary }]}>
                      {t('sg.interest', String(a.interestRate).replace('.', ','))}
                      {a.lockedUntil ? ` · ${t('sg.locked', rfmtDate(a.lockedUntil))}` : ''}
                    </Text>
                  </View>
                  <Text style={[ryFont('700'), styles.acctBal, { color: colors.fgPrimary }]}>
                    {rfmt({ amount: a.balance ? a.balance.amount : 0, currency: 'SEK' })} kr
                  </Text>
                </View>
              ))}
            </RyCard>
          </>
        ) : null}

        <HelpSupport />
      </Animated.ScrollView>

      <CompactHeader title={t('sg.title')} onBack={() => router.back()} scrollY={scrollY} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  heroWrap: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  heroLabel: {
    fontSize: 13,
    letterSpacing: 13 * 0.01,
    marginBottom: 8,
  },
  heroValue: {
    fontSize: 40,
    letterSpacing: 40 * -0.03,
    lineHeight: 40,
    fontVariant: ['tabular-nums'],
  },
  heroCur: {
    fontSize: 22,
    opacity: 0.55,
  },
  chartCard: {
    borderWidth: 1,
    borderRadius: radii.xl,
    marginBottom: 20,
    overflow: 'hidden',
  },
  labels: {
    position: 'relative',
    height: 28,
    marginHorizontal: 12,
  },
  label: {
    position: 'absolute',
    fontSize: 11,
    width: 28,
    textAlign: 'center',
  },
  acctRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  acctBody: { flex: 1, minWidth: 0 },
  acctName: { fontSize: 15 },
  acctSub: { fontSize: 12, marginTop: 1 },
  acctBal: { fontSize: 14, fontVariant: ['tabular-nums'] },
});
