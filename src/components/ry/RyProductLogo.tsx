// RyProductLogo — port of the design's ryProductLogo helper
// (components.jsx): the single source of truth for a product's round
// 46px logo tile (`.ry-acct-logo`). Resurs mark / merchant brand image /
// partner logo / savings · loan glyph, kept in sync across every surface
// that shows a product.

import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { RY_MERCHANTS, type Product } from '@/src/data';
import { rsColors } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { RyIcon } from './RyIcon';
import { ryFont } from './typography';

const MERCHANT_IMAGES: Record<string, ImageSourcePropType> = {
  netonnet: require('@/assets/design/netonnet.png'),
  jula: require('@/assets/design/jula.png'),
  bauhaus: require('@/assets/design/bauhuas-logo.png'),
};

const RESURS_MARK: ImageSourcePropType = require('@/assets/design/resurs-logo.png');

export type RyProductLogoProps = {
  product?: Partial<Product> | null;
  /** Merchant override (design opts.merchantId). */
  merchantId?: string;
  /** 'beige' forces the Family beige Resurs tile (design opts.tint). */
  tint?: 'beige';
  /** Muted/greyed tile for closing accounts (design opts.closing). */
  closing?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function RyProductLogo({
  product,
  merchantId: merchantIdProp,
  tint,
  closing = false,
  style,
}: RyProductLogoProps) {
  const { colors } = useRyTheme();
  const p = product ?? {};
  const merchantId = merchantIdProp || p.merchantId;
  const beige = tint === 'beige' || p.id === 'p-family' || p.id === 'p-family-v2';

  // Partner-branded products (e.g. Gekås Mastercard) — round logo + border.
  if (p.partnerLogo) {
    return (
      <View
        style={[
          styles.logo,
          { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.borderSubtle },
          style,
        ]}>
        <Image source={p.partnerLogo} style={styles.fullBleed} resizeMode="cover" />
      </View>
    );
  }

  // Merchants — brand image, else brand-coloured initial.
  if (merchantId || p.origin === 'merchant') {
    if (merchantId === 'netonnet') {
      return (
        <View
          style={[
            styles.logo,
            styles.merchant,
            { borderColor: colors.borderSubtle },
            style,
          ]}>
          <Image source={MERCHANT_IMAGES.netonnet} style={styles.merchantImg} resizeMode="contain" />
        </View>
      );
    }
    if (merchantId === 'jula') {
      return (
        <View style={[styles.logo, { backgroundColor: '#E2231A' }, style]}>
          <Image source={MERCHANT_IMAGES.jula} style={styles.fullBleed} resizeMode="cover" />
        </View>
      );
    }
    if (merchantId === 'bauhaus') {
      return (
        <View style={[styles.logo, { backgroundColor: '#E1201D' }, style]}>
          <Image source={MERCHANT_IMAGES.bauhaus} style={styles.fullBleed} resizeMode="contain" />
        </View>
      );
    }
    const m = merchantId ? RY_MERCHANTS[merchantId as keyof typeof RY_MERCHANTS] : undefined;
    return (
      <View style={[styles.logo, style]}>
        <View style={[styles.letter, { backgroundColor: m ? m.brandColor : '#888888' }]}>
          <Text style={[ryFont('800'), styles.letterText]}>
            {m ? m.iconLetter : (p.name || '?').charAt(0)}
          </Text>
        </View>
      </View>
    );
  }

  // Direct savings / loan glyphs.
  if (p.type === 'savings') {
    return (
      <View style={[styles.logo, { backgroundColor: '#D5E7DF' }, style]}>
        <RyIcon name="fa-piggy-bank" size={19} color={rsColors.green700} />
      </View>
    );
  }
  if (p.type === 'loan') {
    return (
      <View style={[styles.logo, { backgroundColor: '#D9E8DD' }, style]}>
        <RyIcon name="fa-coins" size={18} color={rsColors.green700} />
      </View>
    );
  }

  // Default — Resurs mark (beige for Family, muted when closing).
  return (
    <View
      style={[
        styles.logo,
        { backgroundColor: closing ? colors.grey100 : beige ? '#EBE3D4' : '#D9E8DD' },
        style,
      ]}>
      <Image
        source={RESURS_MARK}
        style={[styles.resursImg, closing && { opacity: 0.4 }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 46,
    height: 46,
    flexShrink: 0,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  merchant: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    padding: 6,
  },
  merchantImg: {
    width: '100%',
    height: '100%',
  },
  fullBleed: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: undefined,
    height: undefined,
  },
  resursImg: {
    width: 30,
    height: 30,
  },
  letter: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterText: {
    color: '#FFFFFF',
    fontSize: 17,
  },
});
