// Navigation helpers for the detail screens — every push goes through
// pushRoute() so ids (never objects) travel through the router params.
//
// NOTE on the cast: expo-router typed routes (`app.json » experiments.
// typedRoutes`) generate the Href union at dev-server time; the checked-in
// .expo/types/router.d.ts predates these routes, so we erase the literal
// type here once instead of casting at every call site.

import { router } from 'expo-router';

import type { Account, FamilyMember, Invoice, PaymentRequest, Product, Purchase } from '@/src/data';

export function pushRoute(pathname: string, params?: Record<string, string>): void {
  router.push({ pathname, params } as never);
}

export const openProduct = (p: Product) => pushRoute(`/product/${p.id}`);

export const openAccount = (a: Account, p: Product) =>
  pushRoute(`/account/${a.id}`, { productId: p.id });

export const openTx = (tx: Purchase, p: Product, fromAccount = false) =>
  pushRoute(`/transaction/${tx.id}`, {
    productId: p.id,
    ...(fromAccount ? { fromAccount: '1' } : {}),
  });

export const openPR = (pr: PaymentRequest) => pushRoute(`/payment-request/${pr.id}`);

export const openInvoice = (inv: Invoice, p: Product) =>
  pushRoute(`/invoice/${inv.id}`, { productId: p.id });

/** Placeholder rows with no built flow → the generic SettingDetailView. */
export const openPlaceholder = (title: string) => pushRoute('/setting', { title });

export const openFamilyMember = (m: FamilyMember, familyName: string) =>
  pushRoute(`/family-member/${m.id}`, { familyName });

export const openTxList = (a: Account, p: Product, opts?: { purchasesOnly?: boolean }) =>
  pushRoute('/account-transactions', {
    accountId: a.id,
    productId: p.id,
    ...(opts?.purchasesOnly ? { purchasesOnly: '1' } : {}),
  });

export const openBonusChecks = (a: Account, p: Product) =>
  pushRoute('/bonus-checks', { accountId: a.id, productId: p.id });

export const openCloseAccount = (p: Product, a?: Account) =>
  pushRoute('/close-account', { productId: p.id, ...(a ? { accountId: a.id } : {}) });

export const openCardSettings = (
  card: { holder: string; last4: string; exp: string; extra?: boolean },
  a: Account,
  p: Product,
) =>
  pushRoute('/card-settings', {
    accountId: a.id,
    productId: p.id,
    holder: card.holder,
    last4: card.last4,
    exp: card.exp,
    ...(card.extra ? { extra: '1' } : {}),
  });
