import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { EntityFallback, findInvoice, InvoiceView } from '@/src/features/details';
import { usePersona } from '@/src/tweaks/TweaksProvider';

export default function InvoiceRoute() {
  const { invId, productId } = useLocalSearchParams<{ invId: string; productId?: string }>();
  const persona = usePersona();
  const hit = findInvoice(persona, invId, productId);
  if (!hit) return <EntityFallback />;
  return <InvoiceView inv={hit.inv} product={hit.product} />;
}
