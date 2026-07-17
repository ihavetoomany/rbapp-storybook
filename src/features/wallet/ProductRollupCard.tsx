// ProductRollupCard — the default "Product cards" wallet layout row
// (components.jsx ProductRollupCard). Same visual vocabulary as
// AccountCardV2 (tinted tile, name + type, right figure + qualifier,
// context) plus an account-count, since it drills into the PRODUCT page.

import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { rfmt, type Product } from '@/src/data';
import { useT } from '@/src/i18n';

import { AcctCardBase, type AcctCardPill } from './AcctCardBase';
import { WalletLogo } from './WalletLogo';
import { isFamilyProduct, productRollup } from './walletData';

export type ProductRollupCardProps = {
  product: Product;
  /** Family name personalisation ("Family Bergström") — Q3 ongoing. */
  ongoing?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ProductRollupCard({ product: p, ongoing, onPress, style }: ProductRollupCardProps) {
  const { t, tName, tCard } = useT();
  const r = productRollup(p, t);
  const isFamily = isFamilyProduct(p);
  const name = isFamily && ongoing ? 'Family Bergström' : p.name;
  const sub = isFamily
    ? 'Resurs Family'
    : r.kind === 'savings'
      ? 'Savings'
      : r.kind === 'loan'
        ? 'Loan'
        : p.origin === 'merchant'
          ? (p.accounts ?? []).some((a) => a.type === 'creditAccount' && a.storeCredit)
            ? 'Store credit account'
            : 'One time credit'
          : 'Credit account';

  const pills: AcctCardPill[] = [];
  if (r.closing) pills.push({ label: tCard('Closing'), tone: 'closing' });
  if (r.attention > 0)
    pills.push({ label: t('wallet.needs_attention', r.attention), tone: 'attention' });

  const thirdLine = [r.context, r.countLabel].filter(Boolean).join(' · ');

  return (
    <AcctCardBase
      logo={
        <WalletLogo
          kind={r.kind}
          merchantId={r.merchantId}
          partnerLogo={p.partnerLogo}
          tint={r.tint}
          closing={r.closing}
          name={p.name}
        />
      }
      name={tName(name)}
      pills={pills}
      sub={tCard(sub)}
      figureText={`${rfmt(r.figure)} kr`}
      qualifier={tCard(r.qualifier)}
      context={thirdLine || null}
      onPress={onPress}
      style={style}
    />
  );
}
