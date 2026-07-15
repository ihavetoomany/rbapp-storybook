import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { AccountView, EntityFallback, findAccount } from '@/src/features/details';
import { usePersona } from '@/src/tweaks/TweaksProvider';

export default function AccountRoute() {
  const { accountId, productId } = useLocalSearchParams<{ accountId: string; productId?: string }>();
  const persona = usePersona();
  const hit = findAccount(persona, accountId, productId);
  if (!hit) return <EntityFallback />;
  return <AccountView account={hit.account} product={hit.product} />;
}
