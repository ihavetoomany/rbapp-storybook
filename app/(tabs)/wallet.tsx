// Wallet tab route — switches layout on the walletLayout tweak
// (app.jsx: 'Account Cards' → ProductsTabV2, else ProductsTab).

import React from 'react';

import { ProductsTab, ProductsTabV2 } from '@/src/features/wallet';
import { useTweaks } from '@/src/tweaks/TweaksProvider';

export default function WalletRoute() {
  const { tweaks } = useTweaks();
  if (tweaks.walletLayout === 'Account Cards') return <ProductsTabV2 />;
  return <ProductsTab walletLayout={tweaks.walletLayout} />;
}
