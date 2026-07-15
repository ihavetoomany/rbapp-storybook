import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { EntityFallback, findProduct, ProductDetailView } from '@/src/features/details';
import { usePersona } from '@/src/tweaks/TweaksProvider';

export default function ProductRoute() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const persona = usePersona();
  const product = findProduct(persona, productId);
  if (!product) return <EntityFallback />;
  return <ProductDetailView product={product} />;
}
