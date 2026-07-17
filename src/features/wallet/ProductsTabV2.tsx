// ProductsTabV2 — the "Account Cards" wallet layout (tabs.jsx
// ProductsTabV2): ONE card per account, mirroring production. Each savings
// account, loan, merchant purchase and credit account is its own card;
// Resurs Family is the sole exception — it keeps account-card APPEARANCE
// (beige Rə tile) but PRODUCT-card behaviour (taps through to the product
// page). The design's familyAppOnly state only applies off-App, so it is
// always false in this App-only port and is omitted.

import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BellButton,
  EmptyState,
  RyPage,
  SectionTitle,
  StickyHeader,
  StickyHeaderHero,
  useStickyHeaderScroll,
} from '@/src/components/ry';
import { m, type CreditAccount, type Product } from '@/src/data';
import { useNotifications } from '@/src/features/notifications/NotificationsProvider';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { usePersona } from '@/src/tweaks/TweaksProvider';

import { AccountCardV2 } from './AccountCardV2';
import { ProductRollupCard } from './ProductRollupCard';
import {
  buildAccountCards,
  isFamilyProduct,
  purchasesThisMonthCount,
  ryCreditFigures,
  type AcctCardData,
} from './walletData';

type WalletItem =
  | { type: 'account'; key: string; card: AcctCardData }
  | { type: 'product'; key: string; product: Product };

export function ProductsTabV2() {
  const { colors } = useRyTheme();
  const { t } = useT();
  const persona = usePersona();
  const router = useRouter();
  const { openBell, bellDot } = useNotifications();
  const insets = useSafeAreaInsets();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();

  const products = persona.products ?? [];
  const isEmpty = products.length === 0;

  // Build the mixed list in product order: Resurs Family stays a product
  // card, everything else expands into one account card per account.
  const items: WalletItem[] = [];
  products.forEach((p) => {
    if (isFamilyProduct(p)) {
      const credit = (p.accounts ?? []).find(
        (a): a is CreditAccount => a.type === 'creditAccount',
      );
      // Available is DERIVED from the ledger (same helper the hero + rollup
      // use) so the card and the product-page hero show the same number.
      const famAvail = ryCreditFigures(credit, p).avail;
      items.push({
        type: 'account',
        key: p.id,
        card: {
          key: p.id,
          product: p,
          kind: 'credit',
          tint: 'beige',
          name: 'Family Bergström',
          sub: 'Resurs Family',
          figure: m(famAvail),
          qualifier: 'Available',
          context: purchasesThisMonthCount(p, credit, t),
        },
      });
    } else {
      const cards = buildAccountCards(p, t);
      if (cards.length === 0) {
        // No visible account cards — keep the product visible as a product
        // card so nothing silently disappears.
        items.push({ type: 'product', key: p.id, product: p });
      } else {
        cards.forEach((card) => items.push({ type: 'account', key: card.key, card }));
      }
    }
  });

  const onPressCard = (card: AcctCardData) => {
    if (isFamilyProduct(card.product)) {
      // Resurs Family keeps product routing → ProductDetailView.
      router.push(`/product/${card.product.id}` as never);
    } else if (card.kind === 'merchant' && !card.isAccount && card.tx) {
      // One-time-credit purchase is a single transaction, not an account →
      // open the transaction detail so amount + date match the card.
      router.push(
        `/transaction/${card.tx.id}?productId=${card.product.id}` as never,
      );
    } else if (card.account) {
      // Every other account card taps straight through to AccountView.
      router.push(
        `/account/${card.account.id}?productId=${card.product.id}` as never,
      );
    }
  };

  const title = t('tab.products');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgDefault }}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 28) + 76 }}
        showsVerticalScrollIndicator={false}>
        <StickyHeaderHero title={title} scrollY={scrollY} />
        <RyPage>
          {isEmpty ? (
            <EmptyState
              icon="fa-circle-plus"
              title={t('wallet.empty.title')}
              desc={t('wallet.empty.desc')}
              cta={t('wallet.empty.cta')}
              onCta={() => router.push('/discover' as never)}
            />
          ) : (
            <>
              <SectionTitle style={{ marginTop: 0 }}>{t('wallet.section.products')}</SectionTitle>
              {items.map((it) =>
                it.type === 'product' ? (
                  <ProductRollupCard
                    key={it.key}
                    product={it.product}
                    ongoing
                    onPress={() => router.push(`/product/${it.product.id}` as never)}
                  />
                ) : (
                  <AccountCardV2 key={it.key} card={it.card} onPress={() => onPressCard(it.card)} />
                ),
              )}
            </>
          )}
        </RyPage>
      </Animated.ScrollView>
      <StickyHeader
        title={title}
        trailing={<BellButton dot={bellDot} onPress={openBell} />}
        scrollY={scrollY}
      />
    </View>
  );
}
