// walletData — pure card-building logic for the Wallet tab, ported 1:1 from
// the design prototype:
//   • ryCreditFigures        (details.jsx)  — Family credit hero numbers
//   • productRollup          (components.jsx) — Product-cards rollup headline
//   • buildAccountCards      (tabs.jsx)     — Account-Cards (V2) layout rows
//
// Qualifier / sub / pill labels stay as the design's English strings and are
// localised at render time via tCard() (the ported CARD_SV machinery).
// Composed CONTEXT lines are localised here via t() function keys
// (`wallet.*`), since the design left several of them untranslated.

import type { ImageSourcePropType } from 'react-native';

import {
  m,
  rfmt,
  rfmtDate,
  today,
  type Account,
  type CreditAccount,
  type Money,
  type Product,
  type Purchase,
} from '@/src/data';

export type WalletTFn = (key: string, ...args: (string | number)[]) => string;

/** Decimal comma rate formatting (design ryRate). */
export const ryRate = (r: number | string): string => String(r).replace('.', ',');

/** Accounts in the demo data only carry these states in other dev states. */
type AccountStateFields = { closing?: boolean; status?: string };
const acctState = (a: Account): AccountStateFields => a as AccountStateFields;

// ---------------------------------------------------------------------------
// ryCreditFigures — derive a Resurs Family credit account's hero numbers
// straight from its ledger (port of details.jsx ryCreditFigures) so the
// wallet card and the product-page hero always show the same number.
// ---------------------------------------------------------------------------
export function ryCreditFigures(
  cred: CreditAccount | undefined,
  p: Product | undefined,
): { limit: number; billed: number; purchases: number; used: number; avail: number; cashback: number } {
  if (!cred) return { limit: 1, billed: 0, purchases: 0, used: 0, avail: 1, cashback: 0 };
  const limit = cred.creditLimit ? cred.creditLimit.amount || 0 : 0;
  const rows: Purchase[] = [
    ...(p?.purchases ?? []).filter((t) => t.accountId === cred.id && t.type === 'purchase'),
    ...(((cred as { transactions?: Purchase[] }).transactions ?? []).filter(
      (t) => t.type === 'purchase',
    )),
  ];
  const purchases = rows.reduce((s, t) => s + (t.amount?.amount || 0), 0);
  const SETTLED = ['paid', 'voided'];
  const statements = (p?.paymentRequests ?? []).filter(
    (pr) => pr.accountId === cred.id && pr.kind === 'manadsavi' && !SETTLED.includes(pr.status),
  );
  const statementTotal = statements.reduce((s, pr) => s + (pr.remainingAmount?.amount || 0), 0);
  const statementPartPay = statements.reduce(
    (s, pr) =>
      s +
      (pr.statementBreakdown ?? [])
        .filter((b) => /part.?payment/i.test(b.label))
        .reduce((a, b) => a + (b.amount || 0), 0),
    0,
  );
  const partPayRemaining = (p?.accounts ?? [])
    .filter(
      (a) =>
        a.type === 'invoiceAccount' && a.origin === 'superkontoBreakout' && a.remainingBalance,
    )
    .reduce((s, a) => s + ((a as { remainingBalance: Money }).remainingBalance.amount || 0), 0);
  const billed = statementTotal - statementPartPay + partPayRemaining;
  const used = billed + purchases;
  const avail = Math.max(0, limit - used);
  const cashback = rows
    .filter((t) => !t.preliminary)
    .reduce((s, t) => s + Math.floor((t.amount?.amount || 0) / 100), 0);
  return { limit, billed, purchases, used, avail, cashback };
}

// ---------------------------------------------------------------------------
// "Purchases this month" context lines
// ---------------------------------------------------------------------------

const ymPrefix = (): string => {
  const now = today();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const monthHits = (p: Product): { count: number; total: number } => {
  const ym = ymPrefix();
  const hits = (p.purchases ?? []).filter(
    (tx) => tx.date && tx.date.startsWith(ym) && tx.type !== 'refund' && tx.amount && tx.amount.amount > 0,
  );
  return { count: hits.length, total: hits.reduce((s, tx) => s + tx.amount.amount, 0) };
};

const noCreditUsed = (credit?: CreditAccount): boolean =>
  !!credit &&
  ((!!credit.usedCredit && credit.usedCredit.amount === 0) ||
    (!!credit.availableCredit &&
      !!credit.creditLimit &&
      credit.availableCredit.amount === credit.creditLimit.amount));

/**
 * Context line used by the V2 account-card builders:
 * "No credit used" / "3 purchases this month · 2 450 kr" / null.
 */
export function purchasesThisMonthCount(
  p: Product,
  credit: CreditAccount | undefined,
  t: WalletTFn,
): string | null {
  if (noCreditUsed(credit)) return t('wallet.no_credit_used');
  const { count, total } = monthHits(p);
  return count ? t('wallet.purchases_month', count, rfmt(m(total))) : null;
}

/**
 * Context line used by the rollup (design ryPurchasesThisMonth):
 * "No credit used" / "Purchases this month 2 450 kr" / null.
 */
export function purchasesThisMonthPlain(
  p: Product,
  credit: CreditAccount | undefined,
  t: WalletTFn,
): string | null {
  if (noCreditUsed(credit)) return t('wallet.no_credit_used');
  const { count, total } = monthHits(p);
  return count > 0 ? t('wallet.rollup_purchases', rfmt(m(total))) : null;
}

// ---------------------------------------------------------------------------
// Account-Cards (V2) layout — buildAccountCards (tabs.jsx)
// ---------------------------------------------------------------------------

export type AcctCardKind = 'merchant' | 'savings' | 'loan' | 'credit';

export type AcctCardData = {
  key: string;
  product: Product;
  account?: Account;
  /** One-time-credit purchase rows carry the transaction instead. */
  tx?: Purchase;
  kind: AcctCardKind;
  merchantId?: string;
  /** Merchant store-credit account (routes to AccountView, taller row). */
  isAccount?: boolean;
  name: string;
  /** Design English type label — tCard() at render. */
  sub: string;
  figure: Money;
  /** Design English qualifier — tCard() at render. */
  qualifier: string;
  /** Localised third line (built via t()). */
  context?: string | null;
  closing?: boolean;
  overdue?: boolean;
  tint?: 'beige';
  partnerLogo?: ImageSourcePropType;
};

/**
 * Build the list of account-cards for one product. Returns [] for products
 * that should render as a product card instead (handled by the caller).
 */
export function buildAccountCards(p: Product, t: WalletTFn): AcctCardData[] {
  const cards: AcctCardData[] = [];
  const accts = p.accounts ?? [];

  // Merchant payment plans → one card per purchase ("one time credit").
  if (p.origin === 'merchant') {
    // Store-credit account at a merchant: a revolving credit account, not a
    // single purchase — ONE account card routing to AccountView.
    const storeCredit = accts.find(
      (a): a is CreditAccount => a.type === 'creditAccount' && !!a.storeCredit && !a.hidden,
    );
    if (storeCredit) {
      const st = acctState(storeCredit);
      const closing = !!st.closing || st.status === 'closing';
      cards.push({
        key: storeCredit.id,
        product: p,
        account: storeCredit,
        kind: 'merchant',
        merchantId: p.merchantId,
        isAccount: true,
        name: p.name,
        sub: 'Store credit account',
        figure: closing ? storeCredit.usedCredit : storeCredit.availableCredit,
        qualifier: closing ? 'To settle' : 'Available',
        context: closing
          ? t('wallet.pay_remaining')
          : purchasesThisMonthCount(p, storeCredit, t),
        closing,
      });
      return cards;
    }
    (p.purchases ?? [])
      .filter((tx) => tx.type !== 'refund')
      .forEach((tx) => {
        const acct = accts.find((a) => a.id === tx.accountId) ?? accts[0];
        // Fully paid when every payment request on the account is paid.
        const prs = (p.paymentRequests ?? []).filter((pr) => pr.accountId === tx.accountId);
        const allPaid = prs.length > 0 && prs.every((pr) => pr.status === 'paid');
        const paidPR = allPaid ? prs.find((pr) => pr.paidDate) : undefined;
        cards.push({
          key: `${p.id}-${tx.id}`,
          product: p,
          account: acct,
          tx,
          kind: 'merchant',
          merchantId: p.merchantId,
          name: p.name,
          sub: 'One time credit',
          figure: tx.amount,
          qualifier: 'Purchase',
          context:
            allPaid && paidPR
              ? t('wallet.paid_on', rfmtDate(paidPR.paidDate))
              : t('wallet.purchased', rfmtDate(tx.date)),
          overdue: acct ? acctState(acct).status === 'overdue' : false,
        });
      });
    return cards;
  }

  // Direct products → expand their real accounts.
  accts.forEach((a) => {
    if (a.hidden) return;
    // Internal monthly-statement sub-accounts of a credit account are not
    // standalone accounts — skip them.
    if (a.type === 'invoiceAccount' && a.origin === 'kort2000') return;

    if (a.type === 'depositAccount') {
      const ctx = [t('wallet.interest_ctx', ryRate(a.interestRate))];
      if (a.lockedUntil) ctx.push(t('wallet.locked_to', rfmtDate(a.lockedUntil)));
      cards.push({
        key: a.id,
        product: p,
        account: a,
        kind: 'savings',
        name: a.name,
        sub: 'Savings account',
        figure: a.balance,
        qualifier: 'Balance',
        context: ctx.join(', '),
      });
    } else if (a.type === 'loanAccount') {
      cards.push({
        key: a.id,
        product: p,
        account: a,
        kind: 'loan',
        name: a.name,
        sub: 'Loan',
        figure: a.remainingBalance,
        qualifier: 'Current debt',
        context: a.originalAmount ? t('wallet.original_loan', rfmt(a.originalAmount)) : null,
      });
    } else if (a.type === 'creditAccount') {
      const st = acctState(a);
      const closing = !!st.closing || st.status === 'closing';
      cards.push({
        key: a.id,
        product: p,
        account: a,
        kind: 'credit',
        name: p.name,
        sub: 'Credit account',
        figure: closing ? a.usedCredit : a.availableCredit,
        qualifier: closing ? 'To settle' : 'Available',
        context: closing ? t('wallet.pay_remaining') : purchasesThisMonthCount(p, a, t),
        closing,
        partnerLogo: a.partnerLogo,
      });
    } else if (a.type === 'invoiceAccount') {
      // Standalone ecom/flex invoice on a direct product.
      cards.push({
        key: a.id,
        product: p,
        account: a,
        kind: 'credit',
        name: p.name,
        sub: 'One time credit',
        figure: a.remainingBalance,
        qualifier: 'To settle',
        context: t('wallet.pay_remaining'),
      });
    }
  });
  return cards;
}

// ---------------------------------------------------------------------------
// Product-cards (rollup) layout — productRollup (components.jsx). Pure data:
// figure/qualifier/context/state are computed from children, never from the
// authored primaryMetric.
// ---------------------------------------------------------------------------

export type ProductRollupData = {
  kind: AcctCardKind;
  merchantId?: string;
  closing?: boolean;
  tint?: 'beige';
  figure: Money;
  /** Design English qualifier — tCard() at render. */
  qualifier: string;
  /** Localised context (built via t()). */
  context: string | null;
  count: number;
  /** Localised "N accounts". */
  countLabel: string;
  attention: number;
};

export const isFamilyProduct = (p: Product): boolean =>
  p.id === 'p-family' || p.id === 'p-family-v2';

export function productRollup(p: Product, t: WalletTFn): ProductRollupData {
  const accts = p.accounts ?? [];
  const visible = accts.filter(
    (a) => !a.hidden && !(a.type === 'invoiceAccount' && a.origin === 'kort2000'),
  );

  // Attention roll-up — wired even though no persona is overdue today.
  const now = today();
  const overduePRs = (p.paymentRequests ?? []).filter(
    (pr) =>
      pr.status === 'overdue' ||
      (pr.status === 'unpaid' && pr.dueDate && new Date(pr.dueDate) < now),
  );
  const attnAccts = accts.filter((a) => acctState(a).status === 'overdue');
  const attention = overduePRs.length + attnAccts.length;
  const countLabel = (n: number) => t('wallet.accounts_count', n);

  // Resurs Family — credit account headline + its connected buffer.
  if (isFamilyProduct(p)) {
    const credit = accts.find((a): a is CreditAccount => a.type === 'creditAccount');
    const buffer = accts.find((a) => a.type === 'depositAccount');
    const count = (credit ? 1 : 0) + (buffer ? 1 : 0);
    // Available is DERIVED from the ledger (same helper the hero uses).
    const avail = ryCreditFigures(credit, p).avail;
    return {
      kind: 'credit',
      tint: 'beige',
      figure: m(avail),
      qualifier: 'Available',
      context: purchasesThisMonthPlain(p, credit, t),
      count,
      countLabel: countLabel(count),
      attention,
    };
  }

  // Merchant store-credit account (e.g. Jula) — single revolving account.
  const storeCredit = accts.find(
    (a): a is CreditAccount => a.type === 'creditAccount' && !!a.storeCredit && !a.hidden,
  );
  if (storeCredit) {
    const st = acctState(storeCredit);
    const closing = !!st.closing || st.status === 'closing';
    return {
      kind: 'merchant',
      merchantId: p.merchantId,
      closing,
      figure: closing ? storeCredit.usedCredit : storeCredit.availableCredit,
      qualifier: closing ? 'To settle' : 'Available',
      context: closing ? t('wallet.pay_remaining') : purchasesThisMonthPlain(p, storeCredit, t),
      count: 1,
      countLabel: countLabel(1),
      attention,
    };
  }

  // Merchant purchases — one "account" per purchase.
  if (p.origin === 'merchant') {
    const purchases = (p.purchases ?? []).filter((tx) => tx.type !== 'refund');
    const sum = purchases.reduce((s, tx) => s + (tx.amount ? tx.amount.amount : 0), 0);
    const single = purchases.length === 1;
    const paidContext = (() => {
      if (!single || !purchases[0]) return null;
      const prs = (p.paymentRequests ?? []).filter(
        (pr) => pr.accountId === purchases[0].accountId,
      );
      const allPaid = prs.length > 0 && prs.every((pr) => pr.status === 'paid');
      const paidPR = allPaid ? prs.find((pr) => pr.paidDate) : undefined;
      return paidPR ? t('wallet.paid_on', rfmtDate(paidPR.paidDate)) : null;
    })();
    return {
      kind: 'merchant',
      merchantId: p.merchantId,
      figure: m(sum),
      qualifier: single ? 'Purchase' : 'Total outstanding',
      context:
        paidContext ??
        (single && purchases[0] ? t('wallet.purchased', rfmtDate(purchases[0].date)) : null),
      count: purchases.length,
      countLabel: countLabel(purchases.length),
      attention,
    };
  }

  // Direct credit (Resurs Gold / World) — sum availableCredit; closing roll-up.
  if (p.type === 'credit') {
    const credits = accts.filter((a): a is CreditAccount => a.type === 'creditAccount');
    const closing = credits.some((a) => !!acctState(a).closing || acctState(a).status === 'closing');
    const count = visible.length || credits.length;
    if (closing) {
      const used = credits.reduce((s, a) => s + (a.usedCredit ? a.usedCredit.amount : 0), 0);
      return {
        kind: 'credit',
        closing: true,
        figure: m(used),
        qualifier: 'To settle',
        context: t('wallet.pay_remaining'),
        count,
        countLabel: countLabel(count),
        attention,
      };
    }
    const avail = credits.reduce((s, a) => s + (a.availableCredit ? a.availableCredit.amount : 0), 0);
    const mainCredit = credits[0];
    return {
      kind: 'credit',
      figure: m(avail),
      qualifier: credits.length > 1 ? 'Total available' : 'Available',
      context: purchasesThisMonthPlain(p, mainCredit, t),
      count,
      countLabel: countLabel(count),
      attention,
    };
  }

  // Direct savings — sum balance; interest range when rates differ.
  if (p.type === 'savings') {
    const deps = accts.filter((a) => a.type === 'depositAccount' && !a.hidden);
    const sum = deps.reduce(
      (s, a) => s + (a.type === 'depositAccount' && a.balance ? a.balance.amount : 0),
      0,
    );
    const rates = [
      ...new Set(
        deps
          .map((a) => (a.type === 'depositAccount' ? a.interestRate : null))
          .filter((r): r is number => r != null),
      ),
    ].sort((x, y) => x - y);
    const ctx =
      rates.length === 0
        ? null
        : rates.length === 1
          ? t('wallet.interest_ctx', ryRate(rates[0]))
          : t('wallet.interest_range', ryRate(rates[0]), ryRate(rates[rates.length - 1]));
    return {
      kind: 'savings',
      figure: m(sum),
      qualifier: deps.length > 1 ? 'Total balance' : 'Balance',
      context: ctx,
      count: deps.length,
      countLabel: countLabel(deps.length),
      attention,
    };
  }

  // Direct loan — sum remaining debt; original loan as context.
  if (p.type === 'loan') {
    const loans = accts.filter((a) => a.type === 'loanAccount');
    const debt = loans.reduce(
      (s, a) => s + (a.type === 'loanAccount' && a.remainingBalance ? a.remainingBalance.amount : 0),
      0,
    );
    const orig = loans.reduce(
      (s, a) => s + (a.type === 'loanAccount' && a.originalAmount ? a.originalAmount.amount : 0),
      0,
    );
    return {
      kind: 'loan',
      figure: m(debt),
      qualifier: loans.length > 1 ? 'Total debt' : 'Current debt',
      context: orig ? t('wallet.original_loan', rfmt(m(orig))) : null,
      count: loans.length,
      countLabel: countLabel(loans.length),
      attention,
    };
  }

  // Fallback — authored metric.
  return {
    kind: 'credit',
    figure: p.primaryMetric ? p.primaryMetric.value : m(0),
    qualifier: p.primaryMetric ? p.primaryMetric.label : '',
    context: null,
    count: visible.length,
    countLabel: countLabel(visible.length),
    attention,
  };
}
