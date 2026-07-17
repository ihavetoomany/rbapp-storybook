// WalletLogo — the wallet tab's product/account logo tile. Same artwork
// rules as RyProductLogo (the design's ryProductLogo), but the wallet page
// squares the tiles off: `[data-screen-label*="Products tab"] .ry-acct-logo
// { border-radius: 12px; }` (app.css). Generic-letter merchants get a local
// tile so the inner letter square matches the 12px radius too.

import React from 'react';
import { StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { RyProductLogo } from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { RY_MERCHANTS } from '@/src/data';

import type { AcctCardKind } from './walletData';

const IMAGE_MERCHANTS = new Set(['netonnet', 'jula', 'bauhaus']);

export type WalletLogoProps = {
  kind: AcctCardKind;
  merchantId?: string;
  partnerLogo?: ImageSourcePropType;
  tint?: 'beige';
  closing?: boolean;
  /** Fallback initial for generic merchants. */
  name?: string;
};

const SQUARE = { borderRadius: 12 } as const;

export function WalletLogo({ kind, merchantId, partnerLogo, tint, closing, name }: WalletLogoProps) {
  if (kind === 'merchant') {
    if (merchantId && IMAGE_MERCHANTS.has(merchantId)) {
      return <RyProductLogo merchantId={merchantId} style={SQUARE} />;
    }
    // Brand-coloured initial tile (rounded square on the wallet page).
    const m = merchantId ? RY_MERCHANTS[merchantId as keyof typeof RY_MERCHANTS] : undefined;
    return (
      <View style={[styles.letterTile, { backgroundColor: m ? m.brandColor : '#888888' }]}>
        <Text style={[ryFont('800'), styles.letterText]}>
          {m ? m.iconLetter : (name || '?').charAt(0)}
        </Text>
      </View>
    );
  }
  if (kind === 'savings') return <RyProductLogo product={{ type: 'savings' }} style={SQUARE} />;
  if (kind === 'loan') return <RyProductLogo product={{ type: 'loan' }} style={SQUARE} />;
  if (partnerLogo) return <RyProductLogo product={{ partnerLogo }} style={SQUARE} />;
  return <RyProductLogo tint={tint} closing={closing} style={SQUARE} />;
}

const styles = StyleSheet.create({
  letterTile: {
    width: 46,
    height: 46,
    flexShrink: 0,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  letterText: {
    color: '#FFFFFF',
    fontSize: 17,
  },
});
