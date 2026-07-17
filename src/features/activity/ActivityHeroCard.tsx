// ActivityHeroCard — port of the design's `.ActivityHero-wrap` /
// `.ActivityHero` / `.ActivityHero-img` block (app.css ~4079-4200 + the
// `[data-theme="dark"]` overrides at ~5436): the mint hero card with an
// illustration floating above its top edge, uppercase label, big amount,
// sub line and optional pill CTA ("go" link).
//
// Tones: 'overdue' (error tint) · 'due' (dark: teal glow border) ·
// 'open' / 'clear' (default mint). Light theme styles overdue vs rest.

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

import { RyIcon } from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { radii, rsColors } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

// Shared hero illustrations (assets are known-truncated at the bottom; they
// are positioned exactly as the CSS does regardless).
export const HERO_IMAGES = {
  planbok: require('@/assets/design/planbok.png') as ImageSourcePropType,
  planbokRed: require('@/assets/design/planbok_red.png') as ImageSourcePropType,
  plantpot: require('@/assets/design/plantpot.png') as ImageSourcePropType,
  calc: require('@/assets/design/calc.png') as ImageSourcePropType,
  promoShopping: require('@/assets/design/promo-shopping.png') as ImageSourcePropType,
};

// Intrinsic aspect ratios (h / w) so the absolutely-positioned images size
// themselves like the CSS `width`-only rule.
const IMAGE_RATIO = new Map<ImageSourcePropType, number>([
  [HERO_IMAGES.planbok, 625 / 507],
  [HERO_IMAGES.planbokRed, 625 / 507],
  [HERO_IMAGES.plantpot, 870 / 738],
  [HERO_IMAGES.calc, 1278 / 1084],
  [HERO_IMAGES.promoShopping, 560 / 320],
]);

export type ActivityHeroTone = 'overdue' | 'due' | 'open' | 'clear';

export type ActivityHeroCardProps = {
  tone?: ActivityHeroTone;
  /** Illustration above the card (`.ActivityHero-img`). */
  image?: ImageSourcePropType;
  /** CSS offsets: default top 0 / right 16 / width 130. */
  imageTop?: number;
  imageRight?: number;
  imageWidth?: number;
  /** Uppercase label in the top row. */
  label: string;
  /** Leading label icon — design 'fa-*' name. */
  labelIcon?: string;
  /** Chevron after the label (carousel cards with a handler). */
  labelChevron?: boolean;
  /** Big amount (rendered via imFmt-style grouping upstream). */
  amountText?: string;
  /** Currency suffix after the amount ('kr' | 'SEK'). */
  currency?: string;
  /** `.ActivityHero-amt.clear` — text instead of an amount (28px). */
  clearText?: string;
  /** Explore-card body text (no amount). */
  body?: string;
  sub?: string;
  /** Pill CTA at the bottom (`.ActivityHero-go`). */
  goText?: string;
  onPress?: () => void;
  /** Card border override (invoice model & carousel use 2px). */
  borderWidth?: number;
  /** Extra style on the card (margins). */
  cardStyle?: StyleProp<ViewStyle>;
  /** Extra style on the wrapper. */
  style?: StyleProp<ViewStyle>;
};

export function ActivityHeroCard({
  tone = 'open',
  image,
  imageTop = 0,
  imageRight = 16,
  imageWidth = 130,
  label,
  labelIcon,
  labelChevron = false,
  amountText,
  currency,
  clearText,
  body,
  sub,
  goText,
  onPress,
  borderWidth,
  cardStyle,
  style,
}: ActivityHeroCardProps) {
  const { colors, dark } = useRyTheme();
  const overdue = tone === 'overdue';

  // Card surface per app.css light/dark rules.
  let bg: string;
  let borderColor: string;
  let bw = borderWidth ?? 4;
  if (!dark) {
    bg = overdue ? colors.errorBackground : rsColors.mint100;
    borderColor = overdue ? 'rgba(186, 26, 25, 0.15)' : '#FFFFFF';
  } else if (overdue) {
    bg = '#3D1010';
    borderColor = 'rgba(251, 139, 140, 0.15)';
  } else if (tone === 'due') {
    bg = '#111F1C';
    borderColor = 'rgba(77, 218, 193, 0.35)';
    bw = borderWidth ?? 1;
  } else {
    bg = colors.bgPaper;
    borderColor = 'rgba(77, 218, 193, 0.15)';
  }

  const lblColor = overdue
    ? dark
      ? colors.errorMain
      : colors.errorDark
    : dark
      ? colors.primaryMain
      : rsColors.green800;
  const amtColor = overdue
    ? dark
      ? colors.errorLight
      : colors.errorDark
    : dark
      ? '#E3ECEB'
      : rsColors.green950;
  const subColor = overdue
    ? dark
      ? colors.errorMain
      : colors.errorDark
    : dark
      ? 'rgba(227, 236, 235, 0.65)'
      : rsColors.night600;
  const goBg = overdue ? colors.errorDark : rsColors.green950;

  const ratio = image ? (IMAGE_RATIO.get(image) ?? 1.2) : 1.2;

  const card = (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: bg, borderColor, borderWidth: bw },
        pressed && onPress ? { transform: [{ scale: 0.985 }] } : null,
        cardStyle,
      ]}>
      <View style={styles.body}>
        <View style={styles.top}>
          {labelIcon ? <RyIcon name={labelIcon} size={12} color={lblColor} /> : null}
          <Text style={[ryFont('700'), styles.lbl, { color: lblColor }]}>{label.toUpperCase()}</Text>
          {labelChevron ? (
            <RyIcon name="fa-chevron-right" size={13} color={lblColor} style={{ opacity: 0.85 }} />
          ) : null}
        </View>
        {amountText != null ? (
          <Text style={[ryFont('700'), styles.amt, { color: amtColor }]}>
            {amountText}
            {currency ? <Text style={[ryFont('600'), styles.cur]}>{' ' + currency}</Text> : null}
          </Text>
        ) : clearText != null ? (
          <Text style={[ryFont('700'), styles.amt, styles.amtClear, { color: amtColor }]}>{clearText}</Text>
        ) : null}
        {body != null ? (
          <Text style={[ryFont('400'), styles.explBody, { color: subColor }]}>{body}</Text>
        ) : null}
        {sub != null ? (
          <Text style={[ryFont('400'), styles.sub, { color: subColor }, overdue && { opacity: 0.75 }]}>
            {sub}
          </Text>
        ) : null}
        {goText ? (
          <View style={[styles.go, { backgroundColor: goBg }]}>
            <Text style={[ryFont('700'), styles.goText]}>{goText}</Text>
            <RyIcon name="fa-chevron-right" size={11} color="#FFFFFF" />
          </View>
        ) : null}
      </View>
    </Pressable>
  );

  return (
    <View style={style}>
      {card}
      {image ? (
        <View
          pointerEvents="none"
          style={[
            styles.img,
            {
              top: imageTop,
              right: imageRight,
              width: imageWidth,
              height: imageWidth * ratio,
            },
          ]}>
          <Image source={image} resizeMode="contain" style={styles.imgInner} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    position: 'absolute',
    zIndex: 1,
    elevation: 4,
    // drop-shadow(0 4px 12px rgba(0,60,50,0.18))
    shadowColor: '#003C32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  imgInner: {
    width: '100%',
    height: '100%',
  },
  card: {
    width: '100%',
    borderRadius: radii.xl,
    padding: 20,
    // 0 4px 16px rgba(0,0,0,0.10)
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  body: { minWidth: 0 },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  lbl: {
    fontSize: 12,
    letterSpacing: 12 * 0.06,
  },
  amt: {
    fontSize: 38,
    letterSpacing: 38 * -0.02,
    lineHeight: 38 * 1.05,
    fontVariant: ['tabular-nums'],
  },
  amtClear: {
    fontSize: 28,
    lineHeight: 28 * 1.15,
    letterSpacing: 28 * -0.02,
  },
  cur: {
    fontSize: 17,
    opacity: 0.5,
    letterSpacing: 0,
  },
  sub: {
    fontSize: 13,
    lineHeight: 13 * 1.45,
    marginTop: 6,
  },
  explBody: {
    fontSize: 14,
    lineHeight: 14 * 1.4,
    marginTop: 6,
    maxWidth: '55%',
  },
  go: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    marginTop: 14,
  },
  goText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});
