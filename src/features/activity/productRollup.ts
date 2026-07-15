// productRollup — local port of the design's productRollup() +
// ryCreditFigures() helpers (components.jsx / details.jsx), used by the
// Carousel variant's "My products" ProductLargeCard section. Pure data.

import {
  rfmt,
  rfmtDate,
  RY_TODAY,
  type CreditAccount,
  type DepositAccount,
  type InvoiceAccount,
  type LoanAccount,
  type Money,
  type Product,
} from '@/src/data';

const ryMoney = (n: number): Money => ({ amount: n, currency: 'SEK' });
const ryRate = (r: number | string) => String(r).replace('.', ',');

/**
 * ryCreditFigures — derive a Resurs Family credit account's hero numbers
 * straight from its ledger (details.jsx port).
 */
export function ryCreditFigures(cred: CreditAccount | undefined, p: Product) {
  if (!cred) return { limit: 1, billed: 0, purchases: 0, used: 0, avail: 1, cashback: 0 };
  const limit = cred.creditLimit ? cred.creditLimit.amount || 0 : 0;
  const rows = [
    ...(p.purchases || []).filter((tx) => tx.accountId === cred.id && tx.type === 'purchase'),
    ...(((cred as CreditAccount & { transactions?: Product['purchases'] }).transactions) || []).filter(
      (tx) => tx.type === 'purchase',
    ),
  ];
  const purchases = rows.reduce((s, tx) => s + (tx.amount?.amount || 0), 0);
  const SETTLED = ['paid', 'voided'];
  const statements = (p.paymentRequests || []).filter(
    (pr) => pr.accountId === cred.id && pr.kind === 'manadsavi' && !SETTLED.includes(pr.status),
  );
  const statementTotal = statements.reduce((s, pr) => s + (pr.remainingAmount?.amount || 0), 0);
  const statementPartPay = statements.reduce(
    (s, pr) =>
      s +
      (pr.statementBreakdown || [])
        .filter((b) => /part.?payment/i.test(b.label))
        .reduce((a, b) => a + (b.amount || 0), 0),
    0,
  );
  const partPayRemaining = (p.accounts || [])
    .filter(
      (a): a is InvoiceAccount =>
        a.type === 'invoiceAccount' && a.origin === 'superkontoBreakout',
    )
    .reduce((s, a) => s + (a.remainingBalance?.amount || 0), 0);
  const billed = statementTotal - statementPartPay + partPayRemaining;
  const used = billed + purchases;
  const avail = Math.max(0, limit - used);
  const cashback = rows
    .filter((tx) => !tx.preliminary)
    .reduce((s, tx) => s + Math.floor((tx.amount?.amount || 0) / 100), 0);
  return { limit, billed, purchases, used, avail, cashback };
}

export type ProductRollup = {
  kind: 'credit' | 'savings' | 'loan' | 'merchant';
  merchantId?: string;
  tint?: 'beige';
  closing?: boolean;
  figure: Money | undefined;
  qualifier: string;
  context: string | null;
  count: number;
  countLabel: string;
  attention: number;
};

const ryPurchasesThisMonth = (p: Product, creditAcct?: CreditAccount): string | null => {
  if (creditAcct) {
    const noUsed =
      (creditAcct.usedCredit && creditAcct.usedCredit.amount === 0) ||
      (creditAcct.availableCredit &&
        creditAcct.creditLimit &&
        creditAcct.availableCredit.amount === creditAcct.creditLimit.amount);
    if (noUsed) return 'No credit used';
  }
  const now = new Date(RY_TODAY);
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const hits = (p.purchases || []).filter(
    (tx) => tx.date && tx.date.startsWith(ym) && tx.type !== 'refund' && tx.amount && tx.amount.amount > 0,
  );
  const total = hits.reduce((s, tx) => s + tx.amount.amount, 0);
  return hits.length > 0
    ? `Purchases this month ${rfmt({ amount: total, currency: 'SEK' })} kr`
    : null;
};

type AcctExtra = { closing?: boolean; status?: string };

/** Aggregate a product's accounts into one headline (components.jsx port). */
export function productRollup(p: Product): ProductRollup {
  const accts = p.accounts || [];
  const visible = accts.filter(
    (a) => !a.hidden && !(a.type === 'invoiceAccount' && a.origin === 'kort2000'),
  );

  const today = new Date(RY_TODAY);
  const overduePRs = (p.paymentRequests || []).filter(
    (pr) =>
      pr.status === 'overdue' ||
      (pr.status === 'unpaid' && pr.dueDate && new Date(pr.dueDate) < today),
  );
  const attnAccts = accts.filter((a) => (a as unknown as AcctExtra).status === 'overdue');
  const attention = overduePRs.length + attnAccts.length;
  const countLabel = (n: number) => `${n} ${n === 1 ? 'account' : 'accounts'}`;

  // Resurs Family — credit account headline + connected buffer.
  if (p.id === 'p-family' || p.id === 'p-family-v2') {
    const credit = accts.find((a): a is CreditAccount => a.type === 'creditAccount');
    const buffer = accts.find((a) => a.type === 'depositAccount');
    const count = (credit ? 1 : 0) + (buffer ? 1 : 0);
    const avail = ryCreditFigures(credit, p).avail;
    return {
      kind: 'credit',
      tint: 'beige',
      figure: ryMoney(avail),
      qualifier: 'Available',
      context: ryPurchasesThisMonth(p, credit),
      count,
      countLabel: countLabel(count),
      attention,
    };
  }

  // Merchant store-credit account (Jula) — single revolving credit account.
  const storeCredit = accts.find(
    (a): a is CreditAccount => a.type === 'creditAccount' && !!a.storeCredit && !a.hidden,
  );
  if (storeCredit) {
    const extra = storeCredit as CreditAccount & AcctExtra;
    const closing = !!extra.closing || extra.status === 'closing';
    return {
      kind: 'merchant',
      merchantId: p.merchantId,
      closing,
      figure: closing ? storeCredit.usedCredit : storeCredit.availableCredit,
      qualifier: closing ? 'To settle' : 'Available',
      context: closing ? 'Pay remaining balance' : ryPurchasesThisMonth(p, storeCredit),
      count: 1,
      countLabel: countLabel(1),
      attention,
    };
  }

  // Merchant purchases — one "account" per purchase.
  if (p.origin === 'merchant') {
    const purchases = (p.purchases || []).filter((tx) => tx.type !== 'refund');
    const sum = purchases.reduce((s, tx) => s + (tx.amount ? tx.amount.amount : 0), 0);
    const single = purchases.length === 1;
    const paidContext = (() => {
      if (!single || !purchases[0]) return null;
      const prs = (p.paymentRequests || []).filter(
        (pr) => pr.accountId === purchases[0].accountId,
      );
      const allPaid = prs.length > 0 && prs.every((pr) => pr.status === 'paid');
      const paidPR = allPaid ? prs.find((pr) => pr.paidDate) : undefined;
      return paidPR ? `Paid on ${rfmtDate(paidPR.paidDate)}` : null;
    })();
    return {
      kind: 'merchant',
      merchantId: p.merchantId,
      figure: ryMoney(sum),
      qualifier: single ? 'Purchase' : 'Total outstanding',
      context:
        paidContext ||
        (single && purchases[0] ? `Purchased ${rfmtDate(purchases[0].date)}` : null),
      count: purchases.length,
      countLabel: countLabel(purchases.length),
      attention,
    };
  }

  // Direct credit — sum availableCredit; closing roll-up.
  if (p.type === 'credit') {
    const credits = accts.filter((a): a is CreditAccount => a.type === 'creditAccount');
    const closing = credits.some((a) => {
      const extra = a as CreditAccount & AcctExtra;
      return !!extra.closing || extra.status === 'closing';
    });
    const count = visible.length || credits.length;
    if (closing) {
      const used = credits.reduce((s, a) => s + (a.usedCredit ? a.usedCredit.amount : 0), 0);
      return {
        kind: 'credit',
        closing: true,
        figure: ryMoney(used),
        qualifier: 'To settle',
        context: 'Pay remaining balance',
        count,
        countLabel: countLabel(count),
        attention,
      };
    }
    const avail = credits.reduce((s, a) => s + (a.availableCredit ? a.availableCredit.amount : 0), 0);
    return {
      kind: 'credit',
      figure: ryMoney(avail),
      qualifier: credits.length > 1 ? 'Total available' : 'Available',
      context: ryPurchasesThisMonth(p, credits[0]),
      count,
      countLabel: countLabel(count),
      attention,
    };
  }

  // Direct savings — sum balance; interest range when rates differ.
  if (p.type === 'savings') {
    const deps = accts.filter((a): a is DepositAccount => a.type === 'depositAccount' && !a.hidden);
    const sum = deps.reduce((s, a) => s + (a.balance ? a.balance.amount : 0), 0);
    const rates = [...new Set(deps.map((a) => a.interestRate).filter((r) => r != null))].sort(
      (x, y) => x - y,
    );
    const ctx =
      rates.length === 0
        ? null
        : rates.length === 1
          ? `Interest ${ryRate(rates[0])}%`
          : `Interest ${ryRate(rates[0])}%–${ryRate(rates[rates.length - 1])}%`;
    return {
      kind: 'savings',
      figure: ryMoney(sum),
      qualifier: deps.length > 1 ? 'Total balance' : 'Balance',
      context: ctx,
      count: deps.length,
      countLabel: countLabel(deps.length),
      attention,
    };
  }

  // Direct loan — sum remaining debt; original loan as context.
  if (p.type === 'loan') {
    const loans = accts.filter((a): a is LoanAccount => a.type === 'loanAccount');
    const debt = loans.reduce((s, a) => s + (a.remainingBalance ? a.remainingBalance.amount : 0), 0);
    const orig = loans.reduce((s, a) => s + (a.originalAmount ? a.originalAmount.amount : 0), 0);
    return {
      kind: 'loan',
      figure: ryMoney(debt),
      qualifier: loans.length > 1 ? 'Total debt' : 'Current debt',
      context: orig ? `Original loan ${rfmt(ryMoney(orig))} kr` : null,
      count: loans.length,
      countLabel: countLabel(loans.length),
      attention,
    };
  }

  // Fallback — authored metric.
  return {
    kind: 'credit',
    figure: p.primaryMetric?.value,
    qualifier: p.primaryMetric?.label || '',
    context: null,
    count: visible.length,
    countLabel: countLabel(visible.length),
    attention,
  };
}
