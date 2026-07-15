import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { AccountTransactionsView, EntityFallback, findAccount } from '@/src/features/details';
import { usePersona } from '@/src/tweaks/TweaksProvider';

export default function AccountTransactionsRoute() {
  const { accountId, productId, purchasesOnly } = useLocalSearchParams<{
    accountId: string;
    productId?: string;
    purchasesOnly?: string;
  }>();
  const persona = usePersona();
  const hit = findAccount(persona, accountId, productId);
  if (!hit) return <EntityFallback />;
  return (
    <AccountTransactionsView
      account={hit.account}
      product={hit.product}
      purchasesOnly={purchasesOnly === '1'}
    />
  );
}
