import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { EntityFallback, findPaymentRequest, PaymentRequestView } from '@/src/features/details';
import { usePersona } from '@/src/tweaks/TweaksProvider';

export default function PaymentRequestRoute() {
  const { prId } = useLocalSearchParams<{ prId: string }>();
  const persona = usePersona();
  const hit = findPaymentRequest(persona, prId);
  if (!hit) return <EntityFallback />;
  return <PaymentRequestView pr={hit.pr} product={hit.product} />;
}
