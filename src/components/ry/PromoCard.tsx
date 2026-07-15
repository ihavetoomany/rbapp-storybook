// PromoCard — `.ry-promo-*` (tabs.jsx): rich offer card. Left 110px media
// column (tint + image, 50px bottom-right scoop, top scrim with uppercase
// label), right body with headline / description / pill CTA, optional
// dismiss button. The scrim gradient is drawn with react-native-svg.

import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { rsColors } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { RyIcon } from './RyIcon';
import { ryFont } from './typography';

export type RyPromoCardData = {
  key: string;
  /** Uppercase product tag over the image. */
  label: string;
  headline: string;
  desc: string;
  cta: string;
  /** Media background tint behind/around the image. */
  tint: string;
  img?: ImageSourcePropType;
  /** Design 'fa-*' name (used by list rows / sheets, carried on the data). */
  icon?: string;
};

export type PromoCardProps = {
  card: RyPromoCardData;
  onOpen?: () => void;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function PromoCard({ card, onOpen, onDismiss, style }: PromoCardProps) {
  const { colors, dark } = useRyTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle },
        style,
      ]}>
      <View style={[styles.media, { backgroundColor: card.tint }]}>
        {card.img ? <Image source={card.img} style={styles.mediaImg} resizeMode="cover" /> : null}
        <View style={styles.scrim} pointerEvents="none">
          <Svg style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="promoScrim" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#141E1C" stopOpacity="0.7" />
                <Stop offset="1" stopColor="#141E1C" stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#promoScrim)" />
          </Svg>
          <Text style={[ryFont('700'), styles.label]} numberOfLines={2}>
            {card.label.toUpperCase()}
          </Text>
        </View>
      </View>

      <Pressable style={styles.body} onPress={onOpen} disabled={!onOpen}>
        <Text style={[ryFont('700'), styles.title, { color: colors.fgPrimary }]}>
          {card.headline}
        </Text>
        <Text style={[ryFont('400'), styles.desc, { color: colors.fgSecondary }]}>
          {card.desc}
        </Text>
        <Pressable
          onPress={onOpen}
          disabled={!onOpen}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: colors.primaryMain, opacity: pressed ? 0.93 : 1 },
          ]}>
          <Text
            style={[
              ryFont('700'),
              styles.ctaText,
              { color: dark ? rsColors.green950 : '#FFFFFF' },
            ]}>
            {card.cta}
          </Text>
        </Pressable>
      </Pressable>

      {onDismiss ? (
        <Pressable
          onPress={onDismiss}
          accessibilityLabel="Dismiss"
          hitSlop={6}
          style={styles.dismiss}>
          <RyIcon name="fa-xmark" size={13} color={colors.iconMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    // 0 1px 3px rgba(20,30,28,0.06)
    shadowColor: '#141E1C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 1.5,
    elevation: 1,
  },
  media: {
    position: 'relative',
    width: 110,
    flexShrink: 0,
    alignSelf: 'stretch',
    minHeight: 156,
    borderBottomRightRadius: 50,
    overflow: 'hidden',
  },
  mediaImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: undefined,
    height: undefined,
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
  body: {
    flex: 1,
    minWidth: 0,
    paddingTop: 16,
    paddingRight: 12,
    paddingBottom: 12,
    paddingLeft: 16,
  },
  title: {
    fontSize: 17,
    lineHeight: 17 * 1.25,
  },
  desc: {
    fontSize: 13,
    lineHeight: 13 * 1.45,
    marginTop: 6,
  },
  cta: {
    alignSelf: 'flex-end',
    marginTop: 'auto',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  ctaText: {
    fontSize: 13,
    lineHeight: 14,
  },
  dismiss: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
});
