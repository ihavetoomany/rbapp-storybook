import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { EntityFallback, findTransaction, TransactionView } from '@/src/features/details';
import { usePersona } from '@/src/tweaks/TweaksProvider';

export default function TransactionRoute() {
  const { txId, productId, fromAccount } = useLocalSearchParams<{
    txId: string;
    productId?: string;
    fromAccount?: string;
  }>();
  const persona = usePersona();
  const hit = findTransaction(persona, txId, productId);
  if (!hit) return <EntityFallback />;
  return <TransactionView tx={hit.tx} product={hit.product} fromAccount={fromAccount === '1'} />;
}
