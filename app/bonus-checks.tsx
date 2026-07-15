// /bonus-checks — BonusChecksView route (params: accountId, productId).
// Entities resolve from usePersona(); an unknown id renders a simple
// fallback with a back button.

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { CompactHeader, EmptyState, useCompactHeaderOffset } from '@/src/components/ry';
import { BonusChecksView } from '@/src/features/flows';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { usePersona } from '@/src/tweaks/TweaksProvider';

export default function BonusChecksRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ accountId?: string; productId?: string }>();
  const persona = usePersona();
  const { colors } = useRyTheme();
  const { t } = useT();
  const headerOffset = useCompactHeaderOffset();

  const product = persona.products.find((p) => p.id === params.productId);
  const rawAccount = product?.accounts.find((a) => a.id === params.accountId);
  const account = rawAccount && rawAccount.type === 'creditAccount' ? rawAccount : null;

  if (!account) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgDefault }}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={{ paddingTop: headerOffset }}>
          <EmptyState icon="fa-tag" title={t('bc.empty.active.title')} desc={t('bc.empty.active.body')} />
        </View>
        <CompactHeader title={t('bc.title')} onBack={() => router.back()} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <BonusChecksView account={account} product={product} onBack={() => router.back()} />
    </>
  );
}
