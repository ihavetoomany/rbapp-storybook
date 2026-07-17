// ProductLargeCard — "Large cards" wallet layout variant (components.jsx
// ProductLargeCard + `.ry-product-large-card` CSS). One card per product
// with rollup metrics. The prototype's final "White product cards"
// override (app.css) forces every variant to a white surface with a
// green-tinted logo chip (dark theme: bg-paper + mint chip), so the
// pastel/gradient backgrounds and the decorative circle are dropped.

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { RyIcon } from '@/src/components/ry';
import { ryTints } from '@/src/components/ry/tints';
import { ryFont } from '@/src/components/ry/typography';
import { rfmt, rfmtDate, today, type Product } from '@/src/data';
import { useT } from '@/src/i18n';
import { radii } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { isFamilyProduct, productRollup } from './walletData';

const MERCHANT_IMAGES: Record<string, number> = {
  netonnet: require('@/assets/design/netonnet.png'),
  jula: require('@/assets/design/jula.png'),
  bauhaus: require('@/assets/design/bauhuas-logo.png'),
};

const RESURS_MARK = require('@/assets/design/resurs-logo.png');

export type ProductLargeCardProps = {
  product: Product;
  /** Family name personalisation ("Family Bergström") — Q3 ongoing. */
  ongoing?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ProductLargeCard({ product: p, ongoing, onPress, style }: ProductLargeCardProps) {
  const { colors, dark } = useRyTheme();
  const { t, tName, tCard } = useT();
  const tints = ryTints(dark);

  const r = productRollup(p, t);
  const isFamily = isFamilyProduct(p);
  const name = isFamily && ongoing ? 'Family Bergström' : p.name;

  // Purchases this month — shown in footer for credit/merchant products.
  const purchasesThisMonth = (() => {
    if (r.kind !== 'credit' && r.kind !== 'merchant') return null;
    const now = today();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const hits = (p.purchases ?? []).filter(
      (tx) => tx.date && tx.date.startsWith(ym) && tx.type !== 'refund' && tx.amount && tx.amount.amount > 0,
    );
    const total = hits.reduce((s, tx) => s + tx.amount.amount, 0);
    return hits.length > 0 ? { count: hits.length, total } : null;
  })();

  // "No transactions since X" on zero-balance merchant products.
  const noTxSince = (() => {
    if (r.kind !== 'merchant' || purchasesThisMonth) return null;
    const fig = r.figure && r.figure.amount != null ? r.figure.amount : 0;
    if (fig > 0) return null;
    const all = (p.purchases ?? []).filter((tx) => tx.date);
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
          ? (p.accounts ?? []).some((a) => a.type === 'creditAccount' && a.storeCredit)
            ? 'Credit card'
            : 'Store purchase'
          : 'Credit card';

  // Logo chip content (white-card override: green-tinted chip).
  let logoInner: React.ReactNode;
  if (r.kind === 'merchant') {
    const img = r.merchantId ? MERCHANT_IMAGES[r.merchantId] : undefined;
    logoInner = img ? (
      <Image source={img} style={styles.merchantImg} resizeMode="contain" />
    ) : (
      <Text style={[ryFont('700'), { fontSize: 18, color: colors.primaryMain }]}>
        {p.name.charAt(0)}
      </Text>
    );
  } else if (r.kind === 'savings') {
    logoInner = <RyIcon name="fa-piggy-bank" size={16} color={colors.primaryMain} />;
  } else if (r.kind === 'loan') {
    logoInner = <RyIcon name="fa-coins" size={16} color={colors.primaryMain} />;
  } else if (isFamily) {
    logoInner = <RyIcon name="fa-heart" size={16} color={colors.primaryMain} />;
  } else {
    logoInner = (
      <Image
        source={RESURS_MARK}
        style={[styles.resursImg, dark && { tintColor: colors.primaryMain }]}
        resizeMode="contain"
      />
    );
  }

  const foot = purchasesThisMonth
    ? t('plc.purchases_month', purchasesThisMonth.count, rfmt({ amount: purchasesThisMonth.total, currency: 'SEK' }))
    : noTxSince
      ? noTxSince === 'none'
        ? t('plc.no_tx')
        : t('plc.no_tx_since', rfmtDate(noTxSince))
      : r.context;

  const pill =
    r.attention > 0
      ? { label: t('wallet.needs_attention', r.attention), bg: colors.errorBackground, fg: colors.errorDark }
      : r.closing
        ? { label: tCard('Closing'), bg: colors.warningBackground, fg: colors.warningDark }
        : null;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: dark ? colors.bgPaper : '#FFFFFF',
          borderColor: colors.borderSubtle,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        style,
      ]}>
      <View style={styles.head}>
        <View style={[styles.logo, { backgroundColor: dark ? tints.mint100 : tints.green50 }]}>
          {logoInner}
        </View>
        <View style={styles.headings}>
          <Text numberOfLines={1} style={[ryFont('700'), styles.name, { color: colors.fgPrimary }]}>
            {tName(name)}
          </Text>
          <Text numberOfLines={1} style={[ryFont('600'), styles.sub, { color: colors.fgSecondary }]}>
            {tCard(sub).toUpperCase()}
          </Text>
        </View>
        {pill ? (
          <View style={[styles.pill, { backgroundColor: pill.bg }]}>
            <Text style={[ryFont('700'), styles.pillText, { color: pill.fg }]}>{pill.label}</Text>
          </View>
        ) : null}
      </View>

      <Text style={[ryFont('600'), styles.qual, { color: colors.fgSecondary }]}>
        {tCard(r.qualifier).toUpperCase()}
      </Text>
      <Text style={[ryFont('700'), styles.fig, { color: colors.fgPrimary }]}>
        {rfmt(r.figure)}
        <Text style={[ryFont('600'), styles.currency]}> kr</Text>
      </Text>

      <View style={styles.foot}>
        {foot ? (
          <Text numberOfLines={1} style={[ryFont('400'), styles.footText, { color: colors.fgSecondary }]}>
            {foot}
          </Text>
        ) : (
          <View />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    borderRadius: radii.xl,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 18,
    overflow: 'hidden',
    width: '100%',
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
  merchantImg: { width: 26, height: 26 },
  resursImg: { width: 22, height: 22 },
  headings: { flex: 1, minWidth: 0 },
  name: {
    fontSize: 15,
    lineHeight: 15 * 1.2,
    letterSpacing: 15 * -0.01,
  },
  sub: {
    fontSize: 10,
    letterSpacing: 10 * 0.05,
    marginTop: 2,
  },
  pill: {
    marginLeft: 'auto',
    flexShrink: 0,
    paddingVertical: 2,
    paddingHorizontal: 9,
    borderRadius: 999,
  },
  pillText: {
    fontSize: 11,
    letterSpacing: 11 * 0.01,
  },
  qual: {
    fontSize: 10,
    letterSpacing: 10 * 0.04,
    marginBottom: 3,
  },
  fig: {
    fontSize: 28,
    lineHeight: 28,
    letterSpacing: 28 * -0.04,
    fontVariant: ['tabular-nums'],
  },
  currency: {
    fontSize: 13,
    opacity: 0.8,
  },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    minHeight: 15,
  },
  footText: {
    fontSize: 11,
    flexShrink: 1,
  },
});
