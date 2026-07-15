// /im-invoice/[cardId] — InvoiceModelDetail. cardId is the payment-request
// id; the card is rebuilt from the persona + builder util (never serialized
// through params).

import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { View } from 'react-native';

import { CompactHeader, EmptyState, useCompactHeaderOffset } from '@/src/components/ry';
import { useT } from '@/src/i18n';
import { findImCard, InvoiceModelDetail } from '@/src/features/activity';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { usePersona, useStatusOverride } from '@/src/tweaks/TweaksProvider';

export default function ImInvoiceRoute() {
  const { cardId } = useLocalSearchParams<{ cardId: string }>();
  const { colors } = useRyTheme();
  const { t, tName, lang } = useT();
  const persona = usePersona();
  const statusOverride = useStatusOverride();
  const headerOffset = useCompactHeaderOffset();

  const card = useMemo(
    () => (cardId ? findImCard(persona, cardId, statusOverride, { t, tName }) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [persona, statusOverride, cardId, lang],
  );

  if (!card) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgDefault }}>
        <View style={{ paddingTop: headerOffset }}>
          <EmptyState
            icon="fa-file-invoice"
            title={t('empty.topay.title')}
            desc={t('empty.topay.desc')}
          />
        </View>
        <CompactHeader title={t('inv.invoice')} onBack={() => router.back()} />
      </View>
    );
  }

  return <InvoiceModelDetail card={card} />;
}
