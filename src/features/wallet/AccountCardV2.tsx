// AccountCardV2 — one row of the "Account Cards" wallet layout
// (tabs.jsx AccountCardV2). Real account rows stand taller
// (`.ry-acct-card--account`); one-time-credit purchase rows keep the
// compact height, so accounts read as the primary destinations.

import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { rfmt } from '@/src/data';
import { useT } from '@/src/i18n';

import { AcctCardBase, type AcctCardPill } from './AcctCardBase';
import { WalletLogo } from './WalletLogo';
import type { AcctCardData } from './walletData';

export type AccountCardV2Props = {
  card: AcctCardData;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function AccountCardV2({ card, onPress, style }: AccountCardV2Props) {
  const { tName, tCard } = useT();

  const pills: AcctCardPill[] = [];
  if (card.closing) pills.push({ label: tCard('Closing'), tone: 'closing' });
  if (card.overdue) pills.push({ label: tCard('Overdue'), tone: 'overdue' });

  const isPurchase = card.kind === 'merchant' && !card.isAccount;

  return (
    <AcctCardBase
      logo={
        <WalletLogo
          kind={card.kind}
          merchantId={card.merchantId}
          partnerLogo={card.partnerLogo}
          tint={card.tint}
          closing={card.closing}
          name={card.name}
        />
      }
      name={tName(card.name)}
      pills={pills}
      sub={tCard(card.sub)}
      figureText={`${rfmt(card.figure)} kr`}
      qualifier={tCard(card.qualifier)}
      context={card.context ?? null}
      tall={!isPurchase}
      onPress={onPress}
      style={style}
    />
  );
}
