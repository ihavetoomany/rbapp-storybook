// ProductLargeCard — local port of the design's "Large cards" product card
// (components.jsx ProductLargeCard + `.ry-product-large-card` / `.ry-plc-*`
// CSS), used by the Carousel Activity variant's "My products" section.

import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';

import { RyIcon } from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { rfmt, rfmtDate, RY_TODAY, type Product } from '@/src/data';
import { useT } from '@/src/i18n';
import { radii, rsColors } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { productRollup } from './productRollup';

const FINANCE_FLAT: Record<string, string> = {
  savings: '#C9D8B6',
  loan: '#A7C7C4',
  credit: '#ABD3C6',
};
const MERCHANT_FLAT: Record<string, string> = {
  bauhaus: '#DDB3A0',
  netonnet: '#B7C3C0',
  jula: '#D9C8A0',
};

const MERCHANT_LOGOS: Record<string, ImageSourcePropType> = {
  netonnet: require('@/assets/design/netonnet.png'),
  jula: require('@/assets/design/jula.png'),
  bauhaus: require('@/assets/design/bauhuas-logo.png'),
};
const RESURS_MARK: ImageSourcePropType = require('@/assets/design/resurs-logo.png');

export type ProductLargeCardProps = {
  product: Product;
  /** Ongoing IA — Family products read "Family Bergström". */
  ongoing?: boolean;
  onPress?: () => void;
};

export function ProductLargeCard({ product: p, ongoing = false, onPress }: ProductLargeCardProps) {
  const { colors } = useRyTheme();
  const { t, tName, tCard } = useT();
  const r = productRollup(p);

  const isFamily = p.id === 'p-family' || p.id === 'p-family-v2';
  const name = isFamily && ongoing ? 'Family Bergström' : p.name;

  // Purchases this month — footer line for credit/merchant products.
  const purchasesThisMonth = (() => {
    if (r.kind !== 'credit' && r.kind !== 'merchant') return null;
    const now = new Date(RY_TODAY);
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const hits = (p.purchases || []).filter(
      (tx) =>
        tx.date && tx.date.startsWith(ym) && tx.type !== 'refund' && tx.amount && tx.amount.amount > 0,
    );
    const total = hits.reduce((s, tx) => s + tx.amount.amount, 0);
    return hits.length > 0 ? { count: hits.length, total } : null;
  })();

  // "No transactions since X" on zero-balance merchant products.
  const noTxSince = (() => {
    if (r.kind !== 'merchant' || purchasesThisMonth) return null;
    const fig = r.figure && r.figure.amount != null ? r.figure.amount : 0;
    if (fig > 0) return null;
    const all = (p.purchases || []).filter((tx) => tx.date);
    if (!all.length) return 'none';
    const latest = [...all].sort((a, b) => b.date.localeCompare(a.date))[0];
    return latest.date;
  })();

  const sub = isFamily
    ? 'Resurs Family'
    : r.kind === 'savings'
      ? 'Savings account'
      : r.kind === 'loan'
        ? 'Loan'
        : p.origin === 'merchant'
          ? (p.accounts || []).some((a) => a.type === 'creditAccount' && a.storeCredit)
            ? 'Credit card'
            : 'Store purchase'
          : 'Credit card';

  const isFinance = p.origin === 'direct';
  const flatColor = isFinance
    ? FINANCE_FLAT[p.type] || '#ABD3C6'
    : p.origin === 'merchant'
      ? MERCHANT_FLAT[p.merchantId ?? ''] || '#CDBBA5'
      : undefined;
  const themed = !!p.theme && !flatColor;
  const bg = flatColor || (themed ? p.theme.brandColor : colors.bgPaper);
  const isDark = themed;
  const textPrimary = isDark ? '#FFFFFF' : rsColors.green950;
  const textSecondary = isDark ? 'rgba(255,255,255,0.62)' : 'rgba(20,32,29,0.52)';
  const logoBg = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.52)';
  const logoColor = isDark ? '#FFFFFF' : rsColors.green950;

  let logoInner: React.ReactNode;
  if (r.kind === 'merchant' && r.merchantId && MERCHANT_LOGOS[r.merchantId]) {
    logoInner = (
      <Image source={MERCHANT_LOGOS[r.merchantId]} style={styles.logoImg} resizeMode="contain" />
    );
  } else if (r.kind === 'merchant') {
    logoInner = (
      <Text style={[ryFont('700'), { fontSize: 18, color: logoColor }]}>{p.name[0]}</Text>
    );
  } else if (r.kind === 'savings') {
    logoInner = <RyIcon name="fa-piggy-bank" size={16} color={logoColor} />;
  } else if (r.kind === 'loan') {
    logoInner = <RyIcon name="fa-coins" size={16} color={logoColor} />;
  } else if (isFamily) {
    logoInner = <RyIcon name="fa-heart" size={16} color={logoColor} />;
  } else {
    logoInner = (
      <Image
        source={RESURS_MARK}
        style={[styles.logoMark, isDark && { tintColor: '#FFFFFF' }]}
        resizeMode="contain"
      />
    );
  }

  const foot = purchasesThisMonth
    ? t(
        'plc.purchases_month',
        purchasesThisMonth.count,
        rfmt({ amount: purchasesThisMonth.total, currency: 'SEK' }),
      )
    : noTxSince
      ? noTxSince === 'none'
        ? t('plc.no_tx')
        : t('plc.no_tx_since', rfmtDate(noTxSince))
      : r.context
        ? tCard(r.context)
        : '';

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: bg },
        pressed && { transform: [{ scale: 0.985 }] },
      ]}>
      <View style={styles.deco} pointerEvents="none" />

      <View style={styles.head}>
        <View style={[styles.logo, { backgroundColor: logoBg }]}>{logoInner}</View>
        <View style={styles.headings}>
          <Text style={[ryFont('700'), styles.name, { color: textPrimary }]} numberOfLines={1}>
            {tName(name)}
          </Text>
          <Text style={[ryFont('600'), styles.sub, { color: textSecondary }]} numberOfLines={1}>
            {tCard(sub).toUpperCase()}
          </Text>
        </View>
        {r.attention > 0 ? (
          <View style={[styles.pill, { backgroundColor: colors.errorBackground }]}>
            <Text style={[ryFont('700'), styles.pillText, { color: colors.errorDark }]}>
              {tCard(`${r.attention} needs attention`)}
            </Text>
          </View>
        ) : r.closing ? (
          <View style={[styles.pill, { backgroundColor: colors.grey200 }]}>
            <Text style={[ryFont('700'), styles.pillText, { color: colors.grey700 }]}>
              {tCard('Closing')}
            </Text>
          </View>
        ) : null}
      </View>

      <Text style={[ryFont('600'), styles.qual, { color: textSecondary }]}>
        {tCard(r.qualifier).toUpperCase()}
      </Text>
      <Text style={[ryFont('700'), styles.fig, { color: textPrimary }]}>
        {rfmt(r.figure)}
        <Text style={[ryFont('600'), styles.figCur]}> kr</Text>
      </Text>

      <View style={styles.foot}>
        <Text style={[ryFont('400'), styles.footText, { color: textSecondary }]} numberOfLines={1}>
          {foot}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    borderRadius: radii.xl,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 10,
    overflow: 'hidden',
    width: '100%',
  },
  deco: {
    position: 'absolute',
    bottom: -55,
    right: -25,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(0,0,0,0.055)',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 14,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },
  logoImg: { width: 26, height: 26 },
  logoMark: { width: 22, height: 22 },
  headings: { flex: 1, minWidth: 0 },
  name: {
    fontSize: 15,
    letterSpacing: 15 * -0.01,
    lineHeight: 15 * 1.2,
  },
  sub: {
    fontSize: 10,
    letterSpacing: 10 * 0.05,
    marginTop: 2,
  },
  pill: {
    marginLeft: 'auto',
    flexShrink: 0,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  pillText: { fontSize: 11, lineHeight: 14 },
  qual: {
    fontSize: 10,
    letterSpacing: 10 * 0.04,
    marginBottom: 3,
  },
  fig: {
    fontSize: 28,
    letterSpacing: 28 * -0.04,
    lineHeight: 28,
    fontVariant: ['tabular-nums'],
  },
  figCur: {
    fontSize: 13,
    opacity: 0.8,
  },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  footText: { fontSize: 11 },
});
