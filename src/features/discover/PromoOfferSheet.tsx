// PromoOfferSheet — the offer/product detail dialog (tabs.jsx
// PromoOfferSheet): a BaseDialog titled with the offer headline, a 150px
// hero (tint + image + top scrim with the uppercase product label), the
// description, a primary CTA and the placeholder note. In the design it is
// mounted app-wide via window.__ryOpenOffer; here it is owned locally by
// DiscoverTab (and exported for reuse).

import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { BaseDialog, RyButton, type RyPromoCardData } from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';

import type { ImageSourcePropType } from 'react-native';

/** A promo card enriched with its optional media + source product. */
export type PromoSheetCard = RyPromoCardData & {
  img?: ImageSourcePropType;
  /** Persona-offer cards carry the product they belong to. */
  productId?: string;
};

export type PromoOfferSheetProps = {
  card: PromoSheetCard | null;
  onClose: () => void;
  /** CTA press (e.g. open the product page). Defaults to a no-op. */
  onCta?: (card: PromoSheetCard) => void;
};

export function PromoOfferSheet({ card, onClose, onCta }: PromoOfferSheetProps) {
  const { colors } = useRyTheme();
  const { t } = useT();
  return (
    <BaseDialog open={!!card} onClose={onClose} title={card ? card.headline : ''} size="medium">
      {card ? (
        <View style={styles.sheet}>
          <View style={[styles.hero, { backgroundColor: card.tint }]}>
            {card.img ? (
              <Image source={card.img} style={StyleSheet.absoluteFill as never} resizeMode="cover" />
            ) : null}
            <View style={styles.scrim} pointerEvents="none">
              <Svg style={StyleSheet.absoluteFill}>
                <Defs>
                  <LinearGradient id="promoSheetScrim" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#141E1C" stopOpacity="0.7" />
                    <Stop offset="1" stopColor="#141E1C" stopOpacity="0" />
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill="url(#promoSheetScrim)" />
              </Svg>
              <Text style={[ryFont('700'), styles.label]} numberOfLines={2}>
                {card.label.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={[ryFont('400'), styles.desc, { color: colors.fgSecondary }]}>
            {card.desc}
          </Text>
          <RyButton title={card.cta} variant="primary" block onPress={() => onCta?.(card)} />
          <Text style={[ryFont('400'), styles.note, { color: colors.fgSecondary }]}>
            {t('disc.sheet.note', card.label)}
          </Text>
        </View>
      ) : null}
    </BaseDialog>
  );
}

const styles = StyleSheet.create({
  sheet: {
    paddingTop: 4,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  hero: {
    position: 'relative',
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 12 * 0.03,
    textAlign: 'center',
  },
  desc: {
    fontSize: 15,
    lineHeight: 15 * 1.5,
    marginTop: 18,
    marginBottom: 20,
    marginHorizontal: 2,
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 14,
    marginHorizontal: 2,
  },
});
