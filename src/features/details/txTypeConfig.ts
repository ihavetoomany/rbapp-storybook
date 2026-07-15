// txTypeConfig — port of details.jsx: transaction-type categories, adapted
// per account type. Drives the AccountTransactionsView filter and the
// cashback figures on family credit accounts.

import type { Account, Purchase } from '@/src/data';

export type TxCategory =
  | 'purchase'
  | 'deposit'
  | 'withdrawal'
  | 'payment'
  | 'interest'
  | 'cashback'
  | 'fee'
  | 'tax'
  | 'other'
  | 'refund';

export type TxCategoryMeta = { label: string; icon: string };

export type TxTypeConfig = {
  classify: (tx: Purchase) => TxCategory;
  cashbackOf: (tx: Purchase) => number;
  matches: (tx: Purchase, key: TxCategory) => boolean;
  meta: Record<TxCategory, TxCategoryMeta>;
  order: TxCategory[];
  base: TxCategory[];
};

export function txTypeConfig(a?: Account | null): TxTypeConfig {
  const t = a?.type;
  // Resurs Family Superkonto earns cashback (1 kr per 100 kr) on card purchases.
  const cashbackOn = a?.type === 'creditAccount' && a.subtype === 'superkonto';
  const cashbackOf = (tx: Purchase): number =>
    cashbackOn && tx && tx.type === 'purchase' && !tx.preliminary
      ? Math.floor((tx.amount?.amount || 0) / 100)
      : 0;

  const meta: Record<TxCategory, TxCategoryMeta> = {
    purchase: { label: 'Credit purchase', icon: 'fa-credit-card' },
    deposit: { label: 'Deposit', icon: 'fa-arrow-down' },
    withdrawal: { label: 'Withdrawal', icon: 'fa-arrow-up' },
    payment: { label: 'Payment', icon: 'fa-money-bill-transfer' },
    interest: { label: 'Interest', icon: 'fa-percent' },
    cashback: { label: 'Cashback', icon: 'fa-bolt' },
    fee: { label: 'Fee', icon: 'fa-file-invoice-dollar' },
    tax: { label: 'Withheld tax', icon: 'fa-building-columns' },
    other: { label: 'Other', icon: 'fa-circle-question' },
    refund: { label: 'Refund', icon: 'fa-rotate-left' },
  };
  const order: TxCategory[] = [
    'purchase',
    'deposit',
    'withdrawal',
    'payment',
    'interest',
    'cashback',
    'fee',
    'tax',
    'other',
    'refund',
  ];
  const base: TxCategory[] =
    t === 'depositAccount'
      ? ['deposit', 'withdrawal', 'interest']
      : t === 'loanAccount'
        ? ['payment', 'interest', 'fee', 'tax', 'other']
        : ['purchase', 'payment', 'interest', 'fee', 'tax', 'other'];

  const classify = (tx: Purchase): TxCategory => {
    const sl = (tx.subLabel || '').toLowerCase();
    if (tx.type === 'withdrawal' || sl === 'withdrawal') return 'withdrawal';
    if (sl === 'cashback' || /cashback/i.test(tx.merchant || '')) return 'cashback';
    if (sl === 'interest' || /interest/i.test(tx.merchant || '')) return 'interest';
    if (sl === 'fee') return 'fee';
    if (sl === 'tax') return 'tax';
    if (sl === 'other') return 'other';
    if (sl === 'payment' || /payment/i.test(tx.merchant || '')) return 'payment';
    if (sl === 'deposit') return 'deposit';
    if (tx.type === 'purchase') return 'purchase';
    if (tx.type === 'refund') return t === 'depositAccount' ? 'deposit' : 'payment';
    return t === 'depositAccount' ? 'deposit' : 'purchase';
  };

  const matches = (tx: Purchase, key: TxCategory): boolean =>
    key === 'cashback' ? classify(tx) === 'cashback' || cashbackOf(tx) > 0 : classify(tx) === key;

  return { classify, cashbackOf, matches, meta, order, base };
}
