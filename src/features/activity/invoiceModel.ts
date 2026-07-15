// invoiceModel — port of the design's invoice-card-model builder
// (activity-invoice-model.jsx: PR_KIND_TO_BILLTYPE, IM_HANDLED_STATES,
// imCardFromPR, card sorting) plus the useInvoiceModel() aggregation hook
// from activity-crosssell.jsx. Pure data + hooks; no JSX.

import { useMemo } from 'react';

import {
  rfmt,
  rfmtDate,
  RY_TODAY,
  type PaymentRequest,
  type PaymentRequestStatus,
  type Persona,
  type Product,
  type Purchase,
  type StatementBreakdownItem,
} from '@/src/data';
import { useT } from '@/src/i18n';
import { usePersona, useStatusOverride } from '@/src/tweaks/TweaksProvider';

// ── Shared helpers ───────────────────────────────────────────────────────────

/** Design's imFmt — sv-SE grouped integer (regular spaces). */
export const imFmt = (n: number): string => rfmt({ amount: n, currency: 'SEK' });

export const imParseDate = (s?: string | null): number => {
  const m = s ? s.match(/(\d{4})-(\d{2})-(\d{2})/) : null;
  return m ? Date.parse(`${m[1]}-${m[2]}-${m[3]}`) : Infinity;
};

/** Sort rank: overdue state first, failed second, everything else by due date. */
export const imRank = (c: ImCardData): number =>
  c.state === 'overdue' ? 0 : c.state === 'failed' ? 1 : 2;

// Statuses that belong in the Handled section (nothing left for the customer
// to do, or action is already in flight).
export const IM_HANDLED_STATES: ReadonlySet<PaymentRequestStatus> = new Set([
  'paid',
  'voided',
  'scheduled',
  'partiallyPaid',
]);

// ── Bill types ───────────────────────────────────────────────────────────────

export type ImBillType =
  | 'InstallmentBill'
  | 'StatementBill'
  | 'PartpaymentBill'
  | 'InvoiceBill'
  | 'AccountBill';

export const PR_KIND_TO_BILLTYPE: Record<string, ImBillType> = {
  laneavi: 'InstallmentBill',
  manadsavi: 'StatementBill',
  delbetalning: 'PartpaymentBill',
  faktura: 'InvoiceBill',
  kontoavi: 'AccountBill',
};

export const BILLTYPE_LABEL_KEY: Record<ImBillType, string> = {
  InstallmentBill: 'inv.installment',
  StatementBill: 'inv.statement',
  PartpaymentBill: 'inv.partpayment',
  InvoiceBill: 'inv.invoice',
  AccountBill: 'inv.account',
};

export const imBillType = (pr: PaymentRequest): ImBillType =>
  PR_KIND_TO_BILLTYPE[pr.kind] || 'InvoiceBill';

export const imBillKey = (pr: PaymentRequest): string => BILLTYPE_LABEL_KEY[imBillType(pr)];

// ── Card shape ───────────────────────────────────────────────────────────────

export type ImTagTone = 'error' | 'muted' | 'urgent' | 'info' | 'success' | 'neutral';

export type ImTagData = { text: string; tone: ImTagTone };

export type ImCardState =
  | 'topay'
  | 'overdue'
  | 'missed'
  | 'scheduled'
  | 'paid-partial'
  | 'paid-full'
  | 'cancelled'
  | 'failed'
  | 'snoozed'
  | 'purchase';

export type ImLineItem = { name: string; qty: number; price: number };

export type ImLoanBlock = {
  amount: number;
  remaining: number;
  paymentNo: number;
  paymentsTotal: number;
  principal: number | null;
  interest: number | null;
};

export type ImTransaction = { date: string; name: string; amount: number };

export type ImBreakdownRow = StatementBreakdownItem & { transactions?: ImTransaction[] };

export type ImCardData = {
  id: string;
  product: Product;
  isResurs: boolean;
  kind: 'loan' | 'statement' | 'merchant';
  state: ImCardState;
  urgent: boolean;
  billType: ImBillType;
  /** i18n key for the customer-facing bill label. */
  typeKey: string;
  hasMissed: boolean;
  name: string;
  date: string;
  third: string;
  amount: number;
  fullAmount: number;
  dueDate: string;
  daysLeft: number;
  daysOverdue: number;
  tag: ImTagData;
  ocr: string;
  bankgiro: string;
  desc: string;
  items: ImLineItem[] | null;
  transactions: ImTransaction[] | null;
  loan: ImLoanBlock | null;
  statementBreakdown: ImBreakdownRow[] | null;
  partPay: boolean;
  strike: boolean;
  cancelledDate?: string;
  scheduled?: { amount: number; date: string };
  paid?: { full?: boolean; amount?: number; of?: number; date?: string };
  /** Static demo state only — never produced by the builder. */
  snooze?: { prevDue: string; newDue: string; cost: number; length: number };
  initiated?: boolean;
};

export type ImTranslator = {
  t: (key: string, ...args: (string | number)[]) => string;
  tName: (n: string) => string;
};

// Fields the design reads defensively that are not part of the typed schema.
type PRExtra = PaymentRequest & {
  includesMissed?: boolean;
  canPartPay?: boolean;
  transactions?: ImTransaction[];
};

// ── Card builder ─────────────────────────────────────────────────────────────

/** Convert one PR + its product into the IM card shape, applying statusOverride. */
export function imCardFromPR(
  prIn: PaymentRequest,
  product: Product,
  statusOverride: PaymentRequestStatus | null,
  tr: ImTranslator,
): ImCardData {
  const pr = prIn as PRExtra;
  const { t, tName } = tr;
  const eff = statusOverride || pr.status;
  const todayMs = new Date(RY_TODAY).getTime();
  const dueMs = new Date(pr.dueDate).getTime();
  const daysLeft = Math.ceil((dueMs - todayMs) / 86400000);
  const daysOverdue = Math.max(0, -daysLeft);

  // Canonical state
  let state: ImCardState;
  if (eff === 'overdue' || (eff === 'unpaid' && daysLeft < 0)) state = 'overdue';
  else if (eff === 'missed') state = 'missed';
  else if (eff === 'scheduled') state = 'scheduled';
  else if (eff === 'partiallyPaid') state = 'paid-partial';
  else if (eff === 'paid') state = 'paid-full';
  else if (eff === 'voided') state = 'cancelled';
  else if ((eff as string) === 'failed') state = 'failed';
  else state = 'topay'; // unpaid / dueSoon

  const urgent = state === 'topay' && ((eff as string) === 'dueSoon' || daysLeft <= 2);
  // This invoice is current (X days left) but part of its amount is a missed
  // payment rolled over from last month — flag it red without marking overdue.
  const includesMissed = !!pr.includesMissed;

  const tag: ImTagData = (() => {
    if (state === 'overdue') return { text: t('tag.overdue'), tone: 'error' };
    if (includesMissed && state === 'topay')
      return { text: t('tag.days_left', Math.max(0, daysLeft)), tone: 'muted' };
    if (state === 'failed')
      return daysLeft < 0
        ? { text: t('tag.pay_now'), tone: 'error' }
        : { text: t('tag.days_left', Math.max(0, daysLeft)), tone: 'muted' };
    if (state === 'topay')
      return { text: t('tag.days_left', Math.max(0, daysLeft)), tone: urgent ? 'urgent' : 'muted' };
    if (state === 'scheduled') return { text: t('tag.scheduled'), tone: 'info' };
    if (state === 'paid-partial' || state === 'paid-full')
      return { text: t('tag.paid'), tone: 'success' };
    if (state === 'missed')
      return { text: t('tag.days_left', Math.max(0, daysLeft)), tone: 'muted' };
    if (state === 'cancelled') return { text: t('tag.cancelled'), tone: 'neutral' };
    return { text: '', tone: 'muted' };
  })();

  const third = (() => {
    if (includesMissed && (state === 'topay' || state === 'overdue'))
      return t('inv.missed_count', 1);
    if (state === 'overdue') return t('inv.overdue_days', daysOverdue);
    if (state === 'failed') return t('inv.failed_retry');
    if (state === 'topay') {
      if (pr.thirdLineOverride) return t(pr.thirdLineOverride);
      if (imBillType(pr) === 'PartpaymentBill' && pr.paymentNo != null && pr.paymentsTotal != null) {
        return t('inv.partpay_n_of', pr.paymentNo, pr.paymentsTotal);
      }
      return t(imBillKey(pr));
    }
    if (state === 'scheduled') {
      const full = pr.originalAmount ? pr.originalAmount.amount : pr.remainingAmount.amount;
      const sched = pr.remainingAmount.amount;
      return sched < full ? t('inv.part_payment', imFmt(full)) : t('inv.full_payment');
    }
    if (state === 'paid-partial') {
      return t('inv.invoiced', imFmt(pr.originalAmount.amount));
    }
    if (state === 'paid-full') return t('inv.paid_full');
    if (state === 'missed') return t('inv.includes_overdue');
    if (state === 'cancelled') return t('inv.do_not_pay');
    return t(imBillKey(pr));
  })();

  const dateStr =
    (state === 'paid-full' || state === 'paid-partial') && pr.paidDate
      ? t('date.paid', rfmtDate(pr.paidDate))
      : state === 'scheduled'
        ? t('date.scheduled', rfmtDate(pr.dueDate))
        : t('date.due', rfmtDate(pr.dueDate));

  // Line items (merchant invoices carry purchase detail).
  const items: ImLineItem[] | null = pr.purchase
    ? pr.purchase.items.map((li) => ({ name: li.name, qty: li.qty, price: li.price.amount }))
    : null;

  // Loan progress block (installment PRs carry paymentNo / paymentsTotal).
  const loanAccount = product.accounts?.find((a) => a.type === 'loanAccount');
  const loan: ImLoanBlock | null =
    pr.paymentNo != null
      ? {
          amount: loanAccount
            ? loanAccount.originalAmount.amount
            : pr.loanAmount
              ? pr.loanAmount.amount
              : pr.originalAmount.amount,
          remaining: loanAccount
            ? loanAccount.remainingBalance.amount
            : pr.loanRemaining
              ? pr.loanRemaining.amount
              : pr.remainingAmount.amount,
          paymentNo: pr.paymentNo,
          paymentsTotal: pr.paymentsTotal ?? 0,
          principal: pr.principal ? pr.principal.amount : null,
          interest: pr.interestPart ? pr.interestPart.amount : null,
        }
      : null;

  const kind = loan ? 'loan' : pr.kind === 'manadsavi' ? 'statement' : 'merchant';

  return {
    id: pr.id,
    product,
    isResurs: product.origin === 'direct',
    kind,
    state,
    urgent,
    billType: imBillType(pr),
    typeKey: imBillKey(pr),
    hasMissed: includesMissed,
    name: tName(pr.displayName || product.name),
    date: dateStr,
    third,
    amount: pr.remainingAmount.amount,
    fullAmount: (pr.originalAmount || pr.remainingAmount).amount,
    dueDate: pr.dueDate,
    daysLeft: Math.max(0, daysLeft),
    daysOverdue,
    tag,
    ocr: pr.ocr || '—',
    bankgiro: pr.bankgiro || '—',
    desc: pr.description || pr.title || product.name,
    items,
    transactions: pr.transactions || null,
    loan,
    statementBreakdown: (pr.statementBreakdown as ImBreakdownRow[] | undefined) || null,
    partPay: !!(pr.canPartPay || (pr.tiers && pr.tiers.length > 0)),
    strike: state === 'cancelled',
    cancelledDate: state === 'cancelled' ? pr.dueDate : undefined,
    scheduled:
      state === 'scheduled'
        ? { amount: pr.remainingAmount.amount, date: pr.dueDate }
        : undefined,
    paid:
      state === 'paid-full'
        ? { full: true, date: pr.paidDate }
        : state === 'paid-partial'
          ? {
              amount: pr.originalAmount.amount - pr.remainingAmount.amount,
              of: pr.originalAmount.amount,
              date: pr.paidDate,
            }
          : undefined,
  };
}

// ── Card lists ───────────────────────────────────────────────────────────────

export type ImCardLists = { toPay: ImCardData[]; handled: ImCardData[] };

/** Derive To-pay / Handled card lists from a persona (ActivityInvoiceModel). */
export function buildImCards(
  persona: Persona,
  statusOverride: PaymentRequestStatus | null,
  tr: ImTranslator,
): ImCardLists {
  const all: { pr: PaymentRequest; product: Product }[] = [];
  persona.products.forEach((p) =>
    (p.paymentRequests || []).forEach((pr) => all.push({ pr, product: p })),
  );
  const effSt = (pr: PaymentRequest) => statusOverride || pr.status;
  const toPay = all
    .filter(({ pr }) => !IM_HANDLED_STATES.has(effSt(pr)))
    .map(({ pr, product }) => imCardFromPR(pr, product, statusOverride, tr))
    .sort((a, b) => imRank(a) - imRank(b) || imParseDate(a.dueDate) - imParseDate(b.dueDate));
  const handled = all
    .filter(({ pr }) => IM_HANDLED_STATES.has(effSt(pr)))
    .map(({ pr, product }) => imCardFromPR(pr, product, statusOverride, tr))
    .sort((a, b) => {
      const as = a.state === 'scheduled' ? 0 : 1;
      const bs = b.state === 'scheduled' ? 0 : 1;
      if (as !== bs) return as - bs;
      // Design sorts on the localized date string (always Infinity) — we sort
      // on the underlying date with the same intent: most recent first.
      const ad = a.paid?.date || a.dueDate;
      const bd = b.paid?.date || b.dueDate;
      return imParseDate(bd) - imParseDate(ad);
    });
  return { toPay, handled };
}

/** Rebuild one card from a PR id (route /im-invoice/[cardId]). */
export function findImCard(
  persona: Persona,
  cardId: string,
  statusOverride: PaymentRequestStatus | null,
  tr: ImTranslator,
): ImCardData | null {
  for (const p of persona.products) {
    for (const pr of p.paymentRequests || []) {
      if (pr.id === cardId) return imCardFromPR(pr, p, statusOverride, tr);
    }
  }
  return null;
}

/** Hook — buildImCards wired to persona / status override / language. */
export function useImCards(): ImCardLists {
  const persona = usePersona();
  const statusOverride = useStatusOverride();
  const { t, tName, lang } = useT();
  return useMemo(
    () => buildImCards(persona, statusOverride, { t, tName }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [persona, statusOverride, lang],
  );
}

// ── Invoice model aggregation (activity-crosssell.jsx useInvoiceModel) ──────

export type PRWithProduct = PaymentRequest & { product: Product };

export type InvoiceModel = {
  allPRs: PRWithProduct[];
  currentPRs: PRWithProduct[];
  handledPRs: PRWithProduct[];
  totalDue: number;
  overdueCount: number;
  dueSoon: PRWithProduct[];
  daysToNext: number | null;
  /** Sum of deposit-account balances; null when 0 (InvoiceHeroButton). */
  savingsBalance: number | null;
};

export function buildInvoiceModel(
  persona: Persona,
  statusOverride: PaymentRequestStatus | null,
): InvoiceModel {
  const allPRs: PRWithProduct[] = [];
  persona.products.forEach((p) => {
    (p.paymentRequests || []).forEach((pr) => allPRs.push({ ...pr, product: p }));
  });
  allPRs.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const effStatus = (pr: PaymentRequest) => statusOverride || pr.status;
  const currentPRs = allPRs.filter((pr) => !IM_HANDLED_STATES.has(effStatus(pr)));
  const handledPRs = allPRs
    .filter((pr) => IM_HANDLED_STATES.has(effStatus(pr)))
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  const owes =
    statusOverride == null
      ? (pr: PaymentRequest) => pr.status === 'unpaid' || pr.status === 'partiallyPaid'
      : () => ['unpaid', 'partiallyPaid', 'overdue', 'dueSoon'].includes(statusOverride);
  const totalDue = currentPRs.filter(owes).reduce((s, pr) => s + pr.remainingAmount.amount, 0);

  const days = (pr: PaymentRequest) =>
    pr.dueDate
      ? (new Date(pr.dueDate).getTime() - new Date(RY_TODAY).getTime()) / 86400000
      : Infinity;

  const overdueCount =
    statusOverride != null
      ? statusOverride === 'overdue'
        ? currentPRs.length
        : 0
      : currentPRs.filter((pr) => days(pr) < 0).length;

  const dueSoon =
    statusOverride != null
      ? (statusOverride as string) === 'dueSoon'
        ? currentPRs
        : []
      : currentPRs.filter((pr) => {
          const dd = days(pr);
          return dd >= 0 && dd <= 7 && pr.status === 'unpaid';
        });

  const validDays = currentPRs.map(days).filter((dd) => isFinite(dd));
  const daysToNext = validDays.length ? Math.max(0, Math.ceil(Math.min(...validDays))) : null;

  const savingsBalance = persona.products.reduce(
    (sum, p) =>
      sum +
      (p.accounts || [])
        .filter((a) => a.type === 'depositAccount')
        .reduce((s, a) => s + (a.balance ? a.balance.amount : 0), 0),
    0,
  );

  return {
    allPRs,
    currentPRs,
    handledPRs,
    totalDue,
    overdueCount,
    dueSoon,
    daysToNext,
    savingsBalance: savingsBalance || null,
  };
}

export function useInvoiceModel(): InvoiceModel {
  const persona = usePersona();
  const statusOverride = useStatusOverride();
  return useMemo(() => buildInvoiceModel(persona, statusOverride), [persona, statusOverride]);
}

// ── Purchases helpers ────────────────────────────────────────────────────────

export type PurchaseWithProduct = Purchase & { product: Product };

/** Every purchase across products, newest first. */
export function allPurchasesOf(persona: Persona): PurchaseWithProduct[] {
  const out: PurchaseWithProduct[] = [];
  persona.products.forEach((p) =>
    (p.purchases || []).forEach((tx) => out.push({ ...tx, product: p })),
  );
  return out.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Cardholder name for the family product's purchases (tx.user → card name;
 * else main cardholder). Port of famHolderOf in activity-invoice-model.jsx.
 */
export function famHolderOf(tx: PurchaseWithProduct): string {
  const prod = tx.product;
  if (!prod || prod.id !== 'p-family') return '';
  const acct = (prod.accounts || []).find((a) => a.type === 'creditAccount');
  const cards = (acct && 'cards' in acct && acct.cards) || [];
  const named = cards.filter(
    (c): c is { id: string; name: string } => 'name' in c && 'id' in c,
  );
  const main = named[0] ? named[0].name : '';
  if (tx.type === 'purchase' && tx.user) {
    const match = named.find((c) => c.id === tx.user);
    if (match) return match.name;
  }
  return main;
}
