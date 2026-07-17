// BonusChecksScreen — Bonus checks screen + detail sheet, ported 1:1 from
// design-reference/bonus-checks-flow.jsx (BonusChecksView, BonusCheckCarousel,
// BonusCheckSheetHeader, BonusCheckTerms) + the `ry-bc-*` CSS in app.css.
//
// Composition + navigation only; reuses the presentational components from
// BonusCheckBits and the app's shared CompactHeader + BaseDialog + Segmented.

import React, { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated from 'react-native-reanimated';

import {
  BaseDialog,
  CompactHeader,
  RyCard,
  RyIcon,
  RyPage,
  Segmented,
  useCompactHeaderOffset,
  useStickyHeaderScroll,
} from '@/src/components/ry';
import { rfmt } from '@/src/data';
import type { BonusCheck, CreditAccount, Money, Product } from '@/src/data/types';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { BonusCheckCard, BonusCheckListRow, BonusChecksEmptyState } from './BonusCheckBits';

const ryFont = (weight: '400' | '700') =>
  ({
    fontFamily: weight === '700' ? 'Inter-Bold' : 'Inter-Regular',
    fontWeight: weight,
  }) as const;

// Format a bonus-check money object as the amount string the card/row want.
const bcAmount = (money: Money) => `${rfmt(money)} kr`;

// ─────────────────────────────────────────────────────────────
// Swipeable carousel of active BonusCheckCards, with a page-dot
// indicator that updates per index. Used inside the active sheet.
// ─────────────────────────────────────────────────────────────
export function BonusCheckCarousel({
  checks,
  logo,
  initialIndex = 0,
  onIndexChange,
}: {
  checks: BonusCheck[];
  logo?: ImageSourcePropType | null;
  initialIndex?: number;
  onIndexChange?: (i: number) => void;
}) {
  const { colors } = useRyTheme();
  const { t } = useT();
  const trackRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(initialIndex);
  const [width, setWidth] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) {
      setIndex(i);
      onIndexChange?.(i);
    }
  };

  const goTo = (i: number) => {
    trackRef.current?.scrollTo({ x: i * width, animated: true });
  };

  return (
    <View>
      <ScrollView
        ref={trackRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          setWidth(w);
          // Jump to the tapped check on mount (no smooth scroll for the align).
          if (initialIndex > 0) {
            requestAnimationFrame(() =>
              trackRef.current?.scrollTo({ x: initialIndex * w, animated: false }),
            );
          }
        }}>
        {checks.map((c) => (
          <View key={c.id} style={[styles.slide, width ? { width } : null]}>
            <BonusCheckCard
              variant="active"
              amount={bcAmount(c.amount)}
              logo={logo}
              validUntil={c.expires ? t('bc.valid_until', c.expires) : undefined}
              reference={t('bc.reference', c.reference)}
            />
          </View>
        ))}
      </ScrollView>
      {checks.length > 1 ? (
        <View style={styles.dots} accessibilityLabel={t('bc.title')}>
          {checks.map((c, i) => (
            <Pressable
              key={c.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: i === index }}
              onPress={() => goTo(i)}
              hitSlop={6}
              style={[
                styles.dot,
                { backgroundColor: i === index ? colors.primaryMain : colors.borderSubtle },
                i === index && { transform: [{ scale: 1.15 }] },
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Sheet header — download (left), centered title with index, and the
// BaseDialog close (X) on the right (the dialog's own X floats over the
// spacer). Download is a presentational no-op affordance.
// ─────────────────────────────────────────────────────────────
function BonusCheckSheetHeader({ title }: { title: string }) {
  const { colors } = useRyTheme();
  const { t } = useT();
  return (
    <View style={styles.sheetHead}>
      <Pressable
        accessibilityLabel={t('bc.download')}
        style={({ pressed }) => [
          styles.sheetDl,
          { backgroundColor: pressed ? colors.grey300 : colors.grey200 },
        ]}>
        <RyIcon name="fa-arrow-up-from-bracket" size={15} color={colors.iconMuted} />
      </Pressable>
      <Text style={[ryFont('700'), styles.sheetTitle, { color: colors.fgPrimary }]}>{title}</Text>
      <View style={styles.sheetSpacer} />
    </View>
  );
}

// Explanatory terms text shown below the card in the detail sheet.
function BonusCheckTerms({ partner }: { partner: string }) {
  const { colors } = useRyTheme();
  const { t } = useT();
  return (
    <View style={styles.terms}>
      {(['bc.terms.p1', 'bc.terms.p2', 'bc.terms.p3'] as const).map((k) => (
        <Text key={k} style={[ryFont('400'), styles.termsP, { color: colors.fgSecondary }]}>
          {k === 'bc.terms.p1' ? t(k, partner) : t(k)}
        </Text>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// BonusChecksView — the screen. Active / Used segmented tabs; each
// lists its checks; empty tabs show BonusChecksEmptyState. Tapping a
// row opens a slide-up detail sheet (carousel for active, static for
// used).
// ─────────────────────────────────────────────────────────────
export function BonusChecksView({
  account: a,
  product: p,
  onBack,
}: {
  account: CreditAccount;
  product?: Product | null;
  onBack: () => void;
}) {
  const { colors } = useRyTheme();
  const { t, tName } = useT();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();
  const headerOffset = useCompactHeaderOffset();

  const [tab, setTab] = useState<'active' | 'used'>('active');
  const [sheet, setSheet] = useState<{ variant: 'active' | 'used'; index: number } | null>(null);
  const [viewIndex, setViewIndex] = useState(0); // active carousel index (drives the title)

  const bonus = a.bonusChecks || { active: [], used: [] };
  const active = bonus.active || [];
  const used = bonus.used || [];
  const partner = p ? tName(p.name) : t('bc.the_partner');
  const logo = a.partnerLogo || null;

  const list = tab === 'active' ? active : used;

  const openSheet = (variant: 'active' | 'used', index: number) => {
    setViewIndex(index);
    setSheet({ variant, index });
  };

  const usedCheck = sheet && sheet.variant === 'used' ? used[sheet.index] : null;

  return (
    <View style={[styles.screen, { backgroundColor: colors.bgDefault }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: headerOffset }}>
        <RyPage style={{ paddingTop: 0 }}>
          {/* Active / Used tabs — same control as Account / Transactions */}
          <Segmented
            options={[
              { id: 'active', label: t('bc.tab.active') },
              { id: 'used', label: t('bc.tab.used') },
            ]}
            value={tab}
            onChange={(id) => setTab(id as 'active' | 'used')}
            style={{ marginTop: 8, marginBottom: 12 }}
          />

          {list.length === 0 ? (
            tab === 'used' ? (
              <BonusChecksEmptyState
                icon="fa-tag"
                heading={t('bc.empty.used.title')}
                body={t('bc.empty.used.body')}
              />
            ) : (
              <BonusChecksEmptyState
                icon="fa-tag"
                heading={t('bc.empty.active.title')}
                body={t('bc.empty.active.body')}
              />
            )
          ) : (
            <RyCard>
              {list.map((c, i) => (
                <BonusCheckListRow
                  key={c.id}
                  amount={bcAmount(c.amount)}
                  status={
                    tab === 'active' ? t('bc.expires', c.expires ?? '') : t('bc.usedline', c.used ?? '')
                  }
                  variant={tab === 'active' ? 'active' : 'used'}
                  last={i === list.length - 1}
                  onPress={() => openSheet(tab, i)}
                />
              ))}
            </RyCard>
          )}
        </RyPage>
      </Animated.ScrollView>
      <CompactHeader title={t('bc.title')} onBack={onBack} scrollY={scrollY} />

      {/* Detail sheet — active: swipeable carousel; used: static single card */}
      <BaseDialog open={!!sheet} onClose={() => setSheet(null)} size="medium">
        {sheet && sheet.variant === 'active' ? (
          <>
            <BonusCheckSheetHeader title={t('bc.sheet.title_n', viewIndex + 1, active.length)} />
            <BonusCheckCarousel
              checks={active}
              logo={logo}
              initialIndex={sheet.index}
              onIndexChange={setViewIndex}
            />
            <BonusCheckTerms partner={partner} />
          </>
        ) : null}
        {usedCheck ? (
          <View style={styles.usedSheet}>
            <BonusCheckSheetHeader title={t('bc.sheet.title')} />
            <BonusCheckCard
              variant="used"
              amount={bcAmount(usedCheck.amount)}
              reference={t('bc.reference', usedCheck.reference)}
              usedDate={t('bc.usedline', usedCheck.used ?? '')}
            />
            <BonusCheckTerms partner={partner} />
          </View>
        ) : null}
      </BaseDialog>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  // carousel
  slide: { paddingTop: 2, paddingHorizontal: 2, paddingBottom: 4 },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  dot: { width: 8, height: 8, borderRadius: 999 },
  // sheet header
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 14,
  },
  sheetDl: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sheetTitle: { flex: 1, textAlign: 'center', fontSize: 18 },
  sheetSpacer: { width: 30, flexShrink: 0 },
  // terms
  terms: { marginTop: 18, gap: 16 },
  termsP: { fontSize: 14, lineHeight: 14 * 1.5 },
  usedSheet: { paddingBottom: 24 },
});
