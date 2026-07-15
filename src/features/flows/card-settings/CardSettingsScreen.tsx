// CardSettingsScreen — per-card settings page (Q3, Family credit), ported 1:1
// from design-reference/card-settings.jsx (+ the `ry-cs-*` CSS in app.css).
//
// Two variants driven by `extra`:
//   · Main card (extra: false) — full control. Payment methods + spending
//     limits are active/editable.
//   · Extra card (extra: true) — the main holder controls payment methods and
//     spending limits, so those two sections render read-only (greyed).
// Card settings + Area of use are available on both.
//
// Ported deviations (RN):
//  · The CSS "pocket lip" (box-shadow ellipse trick) is drawn as an SVG path:
//    a bg-colored strip whose top edge dips in the centre (concave ⌣) plus
//    stacked translucent strokes faking the soft contact shadow.
//  · The design's outlined-lock hack (-webkit-text-stroke on a solid glyph)
//    has no RN equivalent — the lock renders solid in the muted grey.

import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import {
  CompactHeader,
  RyCard,
  RyCardHead,
  RyIcon,
  RyPage,
  useCompactHeaderOffset,
  useStickyHeaderScroll,
} from '@/src/components/ry';
import type { CreditAccount, Product } from '@/src/data/types';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';

const ryFont = (weight: '400' | '500' | '600' | '700' | '800') =>
  ({
    fontFamily: Number(weight) >= 600 ? 'Inter-Bold' : 'Inter-Regular',
    fontWeight: weight,
  }) as const;

const cardArt = require('@/assets/design/family-card-straight.png');

// ── iOS-style pill switch — green (primary) when on ──────────
function CSSwitch({
  on,
  disabled,
  onChange,
}: {
  on: boolean;
  disabled?: boolean;
  onChange?: () => void;
}) {
  const { colors } = useRyTheme();
  const progress = useDerivedValue(() => withTiming(on ? 1 : 0, { duration: 200 }), [on]);
  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 18 }],
  }));
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: on, disabled: !!disabled }}
      disabled={disabled}
      onPress={onChange}
      style={[
        styles.switch,
        {
          backgroundColor: disabled ? colors.grey200 : on ? colors.primaryMain : colors.grey300,
        },
      ]}>
      <Animated.View style={[styles.knob, knobStyle]} />
    </Pressable>
  );
}

// ── A settings row that navigates (icon · label · chevron) ───
function CSNavRow({
  icon,
  iconRegular = true,
  title,
  sub,
  disabled,
  last,
  onPress,
}: {
  icon?: string;
  iconRegular?: boolean;
  title: string;
  sub?: string;
  disabled?: boolean;
  last?: boolean;
  onPress?: () => void;
}) {
  const { colors } = useRyTheme();
  return (
    <Pressable
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.navRow,
        { borderBottomColor: last ? 'transparent' : colors.borderSubtle },
        last && { borderBottomWidth: 0 },
        pressed && !disabled && { backgroundColor: colors.bgSubtle },
      ]}>
      {icon ? (
        <View style={styles.rowIcon}>
          <RyIcon
            name={icon}
            size={18}
            color={disabled ? colors.grey300 : colors.fgSecondary}
            regular={iconRegular}
          />
        </View>
      ) : null}
      <View style={styles.rowBody}>
        <Text style={[ryFont('500'), styles.rowTitle, { color: disabled ? colors.grey400 : colors.fgPrimary }]}>
          {title}
        </Text>
        {sub ? (
          <Text style={[ryFont('400'), styles.rowSub, { color: disabled ? colors.grey300 : colors.fgSecondary }]}>
            {sub}
          </Text>
        ) : null}
      </View>
      <RyIcon name="fa-chevron-right" size={12} color={disabled ? colors.grey300 : colors.fgDisabled} />
    </Pressable>
  );
}

// ── A settings row with a toggle (icon-less; label + switch) ─
function CSToggleRow({
  title,
  on,
  disabled,
  last,
  onChange,
}: {
  title: string;
  on: boolean;
  disabled?: boolean;
  last?: boolean;
  onChange?: () => void;
}) {
  const { colors } = useRyTheme();
  return (
    <View
      style={[
        styles.navRow,
        { borderBottomColor: last ? 'transparent' : colors.borderSubtle },
        last && { borderBottomWidth: 0 },
      ]}>
      <View style={styles.rowBody}>
        <Text style={[ryFont('500'), styles.rowTitle, { color: disabled ? colors.grey400 : colors.fgPrimary }]}>
          {title}
        </Text>
      </View>
      <CSSwitch on={on} disabled={disabled} onChange={onChange} />
    </View>
  );
}

// ── Pocket lip — SVG port of the `.ry-cs-hero::after` ellipse ─
const POCKET_H = 44;
function PocketLip({ width }: { width: number }) {
  const { colors } = useRyTheme();
  if (!width) return null;
  const h = POCKET_H;
  // Concave ⌣ arc: edges at y=10, centre dipping to y≈30.
  const arc = `M 0 10 Q ${width / 2} 34, ${width} 10`;
  return (
    <Svg width={width} height={h} style={styles.pocket} pointerEvents="none">
      {/* soft contact shadow hugging the arc (stacked strokes ≈ blur) */}
      <Path d={arc} stroke="rgba(0,0,0,0.05)" strokeWidth={16} fill="none" />
      <Path d={arc} stroke="rgba(0,0,0,0.06)" strokeWidth={9} fill="none" />
      <Path d={arc} stroke="rgba(0,0,0,0.07)" strokeWidth={4} fill="none" />
      {/* the lip itself — page colour below the arc, occluding the card edge */}
      <Path d={`${arc} L ${width} ${h} L 0 ${h} Z`} fill={colors.bgDefault} />
    </Svg>
  );
}

// ── CardSettingsView ─────────────────────────────────────────
export type CardSettingsViewProps = {
  card?: { holder?: string; last4?: string; exp?: string; extra?: boolean } | null;
  account?: CreditAccount | null;
  product?: Product | null;
  onBack: () => void;
  onOpenPlaceholder?: (title: string) => void;
};

const AREA_KEYS = [
  'Sweden',
  'Denmark',
  'Finland',
  'Norway',
  'Europe',
  'Africa',
  'North America',
  'South America',
  'Asia and Oceania',
] as const;

const SPENDING_LIMITS = [
  { title: 'In-store purchases', sub: '75 000 kr / day' },
  { title: 'Cash withdrawals', sub: '15 000 kr / Month' },
  { title: 'Online purchases', sub: '75 000 kr / Week' },
] as const;

export function CardSettingsView({
  card,
  account,
  product,
  onBack,
  onOpenPlaceholder,
}: CardSettingsViewProps) {
  void product;
  const { colors } = useRyTheme();
  const { tCard: T } = useT();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();
  const headerOffset = useCompactHeaderOffset();

  const extra = !!card?.extra;
  const holder = card?.holder || 'John';
  const last4 = card?.last4 || '0000';
  const exp = card?.exp || '11/28';

  // Available figure — the account's availableCredit field (the design's
  // ryCreditFigures ledger helper lives with the DETAILS feature; this is
  // the design's own fallback path), else the demo default.
  const nfmt = (n: number) => String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const avail = account ? account.availableCredit?.amount || 0 : 37819;

  // Local toggle state (payment methods editable only on the main card).
  const [pay, setPay] = useState({ online: true, atm: true, contactless: true });
  const [areas, setAreas] = useState<Record<string, boolean>>({
    Sweden: true,
    Denmark: true,
    Finland: true,
    Norway: false,
    Europe: false,
    Africa: false,
    'North America': false,
    'South America': false,
    'Asia and Oceania': false,
  });
  const setArea = (k: string) => setAreas((s) => ({ ...s, [k]: !s[k] }));
  const setPayKey = (k: keyof typeof pay) => setPay((s) => ({ ...s, [k]: !s[k] }));

  const open = (title: string) => onOpenPlaceholder && onOpenPlaceholder(title);

  const [heroWidth, setHeroWidth] = useState(0);
  const artAspect = useMemo(() => {
    const src = Image.resolveAssetSource(cardArt);
    return src && src.width && src.height ? src.width / src.height : 1.6;
  }, []);

  const headPad = { paddingTop: 24, paddingHorizontal: 4, paddingBottom: 8 };

  return (
    <View style={[styles.screen, { backgroundColor: colors.bgDefault }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: headerOffset }}>
        <RyPage style={{ paddingTop: 0 }}>
          {/* Hero — big title + available figure + card art tucked into a
              "pocket": clipped at the bottom with a soft curved shadow. */}
          <Text style={[ryFont('800'), styles.title, { color: colors.fgPrimary }]}>
            {holder} B ····{last4}
          </Text>
          <View
            style={styles.hero}
            onLayout={(e) => setHeroWidth(e.nativeEvent.layout.width)}>
            <View style={styles.heroInfo}>
              <Text style={[ryFont('400'), styles.heroLabel, { color: colors.fgSecondary }]}>
                {extra ? T('Available amount') : T('Available credit')}
              </Text>
              <Text style={[ryFont('700'), styles.heroAmount, { color: colors.fgPrimary }]}>
                {nfmt(avail)} kr
              </Text>
              {extra ? (
                <Text style={[ryFont('400'), styles.heroNote, { color: colors.fgSecondary }]}>
                  {T('Extra card')}
                </Text>
              ) : null}
              <Text
                style={[ryFont('400'), styles.heroLabel, { color: colors.fgSecondary, marginTop: 14 }]}>
                {T('Expires')}
              </Text>
              <Text style={[ryFont('700'), styles.heroAmountSm, { color: colors.fgPrimary }]}>
                {exp}
              </Text>
            </View>
            {/* Straight card, pushed right and tucked below the hero's bottom edge. */}
            <Image
              source={cardArt}
              style={[styles.heroCard, { aspectRatio: artAspect }]}
              resizeMode="contain"
            />
            <PocketLip width={heroWidth} />
          </View>

          {/* Card settings */}
          <RyCardHead label={T('Card settings')} style={headPad} />
          <RyCard>
            <CSNavRow icon="fa-eye-slash" title={T('See card details')} onPress={() => open('See card details')} />
            <CSNavRow icon="fa-eye-slash" title={T('Show pin')} onPress={() => open('Show pin')} />
            <CSNavRow icon="fa-lock" iconRegular={false} title={T('Change pin')} onPress={() => open('Change pin')} />
            <CSNavRow icon="fa-lock" iconRegular={false} title={T('Block card')} onPress={() => open('Block card')} last />
          </RyCard>

          {/* Payment methods — editable on the main card only */}
          <RyCardHead label={T('Payment methods')} style={headPad} />
          <RyCard>
            <CSToggleRow
              title={T('Online purchases')}
              on={extra ? false : pay.online}
              disabled={extra}
              onChange={() => setPayKey('online')}
            />
            <CSToggleRow
              title={T('ATM withdrawals')}
              on={extra ? false : pay.atm}
              disabled={extra}
              onChange={() => setPayKey('atm')}
            />
            <CSToggleRow
              title={T('Contactless payments')}
              on={extra ? false : pay.contactless}
              disabled={extra}
              onChange={() => setPayKey('contactless')}
              last
            />
          </RyCard>

          {/* Spending limits — set by the main holder; read-only on the extra card */}
          <RyCardHead label={T('Spending limits')} style={headPad} />
          <RyCard>
            {SPENDING_LIMITS.map((r, i) => (
              <CSNavRow
                key={r.title}
                title={T(r.title)}
                sub={T(r.sub)}
                disabled={extra}
                last={i === SPENDING_LIMITS.length - 1}
                onPress={() => open(r.title)}
              />
            ))}
          </RyCard>

          {/* Area of use — available on both cards */}
          <RyCardHead label={T('Area of use')} style={headPad} />
          <RyCard>
            {AREA_KEYS.map((k, i) => (
              <CSToggleRow
                key={k}
                title={T(k)}
                on={!!areas[k]}
                last={i === AREA_KEYS.length - 1}
                onChange={() => setArea(k)}
              />
            ))}
          </RyCard>

          <View style={{ height: 8 }} />
        </RyPage>
      </Animated.ScrollView>
      <CompactHeader title={T('Family card overview')} onBack={onBack} scrollY={scrollY} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  title: {
    marginTop: 4,
    marginHorizontal: 4,
    fontSize: 26,
    letterSpacing: 26 * -0.02,
    lineHeight: 26 * 1.1,
  },
  hero: {
    position: 'relative',
    minHeight: 176,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingTop: 14,
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  heroInfo: { flexDirection: 'column', zIndex: 2 },
  heroLabel: { fontSize: 13, lineHeight: 18 },
  heroAmount: { fontSize: 20, lineHeight: 20 * 1.25 },
  heroAmountSm: { fontSize: 17, lineHeight: 17 * 1.25 },
  heroNote: { fontSize: 13, marginTop: 1 },
  heroCard: {
    position: 'absolute',
    right: 8,
    top: 6,
    width: 150,
    zIndex: 1,
  },
  pocket: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 3 },
  // rows (design: padding '15px 16px', gap 14)
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
  rowIcon: { width: 26, flexShrink: 0, alignItems: 'center' },
  rowBody: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 15, lineHeight: 20 },
  rowSub: { fontSize: 12, lineHeight: 16, marginTop: 2 },
  // switch (`.ry-cs-switch`: 46×28, knob 24, translate 18)
  switch: {
    flexShrink: 0,
    width: 46,
    height: 28,
    borderRadius: 999,
    justifyContent: 'center',
  },
  knob: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    // 0 1px 3px rgba(0,0,0,0.2)
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
});
