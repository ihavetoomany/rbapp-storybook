// /card-settings — CardSettingsView route (params: accountId, productId,
// holder, last4, exp, extra? '1'). Entities resolve from usePersona();
// missing account falls back to the design's demo figures.

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

import { CardSettingsView } from '@/src/features/flows';
import { usePersona } from '@/src/tweaks/TweaksProvider';

export default function CardSettingsRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    accountId?: string;
    productId?: string;
    holder?: string;
    last4?: string;
    exp?: string;
    extra?: string;
  }>();
  const persona = usePersona();

  const product = persona.products.find((p) => p.id === params.productId);
  const rawAccount = product?.accounts.find((a) => a.id === params.accountId);
  const account = rawAccount && rawAccount.type === 'creditAccount' ? rawAccount : null;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <CardSettingsView
        card={{
          holder: params.holder,
          last4: params.last4,
          exp: params.exp,
          extra: params.extra === '1',
        }}
        account={account}
        product={product}
        onBack={() => router.back()}
        onOpenPlaceholder={(title) => router.push({ pathname: '/setting', params: { title } })}
      />
    </>
  );
}
