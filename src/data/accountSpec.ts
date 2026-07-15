// src/data/accountSpec.ts — SINGLE SOURCE OF TRUTH for the account-detail
// Services section + the per-type primary action button + the canonical page
// structure per account kind. Ported 1:1 from the design prototype's
// account-spec.js (window.RY_ACCOUNT_SPEC).
//
// A service row is { label, icon, danger?, action? }. `action` is a semantic
// id the app maps to a real flow; rows with no action fall back to the generic
// "coming soon" placeholder sheet. Labels are English; tCard() localises them
// to Swedish at render time (translations live in i18n CARD_SV).

import type { ImageSourcePropType } from 'react-native';

import type { Account, Product } from './types';

// ---------------------------------------------------------------------------
// Kinds
// ---------------------------------------------------------------------------

export type AccountKind =
  | 'credit'
  | 'storecredit'
  | 'familycredit'
  | 'flexsavings'
  | 'fixedsavings'
  | 'fambuffer'
  | 'loan'
  | 'invoice';

/** Resolve an account + product to one of the spec "kinds". */
export function accountKind(a?: Account | null, p?: Product | null): AccountKind {
  if (!a) return 'credit';
  if (a.type === 'creditAccount') {
    if (p && p.id === 'p-family') return 'familycredit';
    if (a.storeCredit) return 'storecredit';
    return 'credit';
  }
  if (a.type === 'loanAccount') return 'loan';
  if (a.type === 'depositAccount') {
    if (a.goalAmount) return 'fambuffer'; // Family buffer — left as-is
    if (a.lockedUntil) return 'fixedsavings'; // Fixed term — locked
    return 'flexsavings'; // Flexible — instant access
  }
  if (a.type === 'invoiceAccount') return 'invoice';
  return 'credit';
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export type ServiceAction = 'deposit' | 'withdraw' | 'close';

export type ServiceRow = {
  label: string;
  /** FontAwesome 'fa-*' name. */
  icon: string;
  danger?: boolean;
  /** Semantic id mapped to a real flow; none → placeholder sheet. */
  action?: ServiceAction;
};

const CLOSE: ServiceRow = { label: 'Close account', icon: 'fa-xmark', danger: true, action: 'close' };

export const SERVICES: Record<AccountKind, ServiceRow[]> = {
  // Standalone revolving credit (Resurs Gold / World)
  credit: [
    { label: 'Apply to raise credit limit', icon: 'fa-arrow-up-wide-short' },
    { label: 'Activate payment-free month', icon: 'fa-calendar-xmark' },
    { label: 'Pay extra', icon: 'fa-bolt' },
    { label: 'Pay bills with the card', icon: 'fa-file-invoice' },
    CLOSE,
  ],
  // Merchant-origin revolving credit (Gekås, Bauhaus, Åhléns, Jula)
  storecredit: [
    { label: 'Activate payment-free month', icon: 'fa-calendar-xmark' },
    { label: 'Pay extra', icon: 'fa-bolt' },
    CLOSE,
  ],
  // Resurs Family credit — left as-is for now (kept in sync with today's page)
  familycredit: [
    { label: 'Pay extra', icon: 'fa-bolt' },
    { label: 'Change credit limit', icon: 'fa-sliders' },
    CLOSE,
  ],
  // Flexible savings — Withdraw is the primary button, not a service row
  flexsavings: [
    { label: 'Deposit funds', icon: 'fa-arrow-down', action: 'deposit' },
    { label: 'Move money between savings accounts', icon: 'fa-right-left' },
    { label: 'Open another savings account', icon: 'fa-plus' },
    CLOSE,
  ],
  // Fixed term savings — Deposit is the primary button; Withdraw stays a service
  fixedsavings: [
    { label: 'Withdraw', icon: 'fa-arrow-up', action: 'withdraw' },
    { label: 'Add / change goal', icon: 'fa-bullseye' },
    CLOSE,
  ],
  // Family buffer — left as-is (matches today's savings services)
  fambuffer: [
    { label: 'Deposit', icon: 'fa-arrow-down', action: 'deposit' },
    { label: 'Withdraw', icon: 'fa-arrow-up' },
    { label: 'Change goal', icon: 'fa-bullseye' },
    { label: 'Cancel savings account', icon: 'fa-xmark', danger: true, action: 'close' },
  ],
  loan: [
    { label: 'Apply for new loan', icon: 'fa-plus' },
    { label: 'Raise loan', icon: 'fa-arrow-up' },
    { label: 'Consolidate loans', icon: 'fa-layer-group' },
    CLOSE,
  ],
  // Merchant one-time-credit / flexible invoice account
  invoice: [
    { label: 'Report a return', icon: 'fa-rotate-left' },
    { label: 'Snooze invoice', icon: 'fa-bell-slash' },
    CLOSE,
  ],
};

/** Primary CTA button under the Overview / Transactions tab (savings only). */
export const PRIMARY: Partial<Record<AccountKind, ServiceRow>> = {
  flexsavings: { label: 'Withdraw funds', icon: 'fa-arrow-up', action: 'withdraw' },
  fixedsavings: { label: 'Deposit', icon: 'fa-arrow-down', action: 'deposit' },
};

// ---------------------------------------------------------------------------
// Canonical PAGE STRUCTURE per kind (single source of truth)
// ---------------------------------------------------------------------------
// Ordered section descriptors. Section content that is spec-defined (detail
// rows, document rows, insurance rows, cards, bonus) lives here so every
// surface shows the SAME information + structure. 'services' pulls from
// SERVICES[kind]; 'cta' from PRIMARY[kind]; 'invoices' / 'purchases' /
// 'accounts' read live data.

export type SpecRowOpts = { mono?: boolean; copy?: boolean; info?: boolean };

/** [label, value, opts?] — value null renders as an info-only row. */
export type SpecDetailRow = [string, string | null] | [string, string | null, SpecRowOpts];

export type SpecCardRow = { holder: string; last4: string; exp: string; extra: boolean };

export type SpecDocRow = { icon: string; title: string; sub: string };

export type SpecInsuranceRow = { icon: string; title: string };

export type SpecSection =
  | { t: 'tabs'; labels: string[] }
  | { t: 'cards'; img?: ImageSourcePropType; cardThumb?: 'portrait'; rows: SpecCardRow[] }
  | { t: 'details'; label?: string; rows: SpecDetailRow[] }
  | { t: 'bonusProgram'; points: string }
  | { t: 'bonusChecks' }
  | { t: 'insurances'; rows: SpecInsuranceRow[] }
  | { t: 'services' }
  | { t: 'cta' }
  | { t: 'monthlyDeposit' }
  | { t: 'invoices' }
  | { t: 'documents'; rows: SpecDocRow[] };

export const DOC: Record<'resursGold' | 'gekas' | 'family' | 'flex' | 'fixed' | 'loan' | 'invoice', SpecDocRow[]> = {
  resursGold: [
    { icon: 'fa-file-contract', title: 'Account terms', sub: 'Resurs Gold agreement' },
    { icon: 'fa-file-invoice', title: 'Price & fees', sub: 'Standardised information (SEKKI)' },
    { icon: 'fa-file-lines', title: 'Statements', sub: 'Monthly invoices and receipts' },
  ],
  gekas: [
    { icon: 'fa-file-contract', title: 'Account terms', sub: 'Gekås account agreement' },
    { icon: 'fa-file-invoice', title: 'Price & fees', sub: 'Standardised information (SEKKI)' },
    { icon: 'fa-file-lines', title: 'Statements', sub: 'Monthly invoices and receipts' },
  ],
  family: [
    { icon: 'fa-file-contract', title: 'Account terms', sub: 'Resurs Family agreement' },
    { icon: 'fa-file-invoice', title: 'Price & fees', sub: 'Standardised information (SEKKI)' },
    { icon: 'fa-file-lines', title: 'Statements', sub: 'Monthly invoices and receipts' },
  ],
  flex: [
    { icon: 'fa-file-contract', title: 'Account terms', sub: 'Savings account agreement' },
    { icon: 'fa-file-invoice', title: 'Price & fees', sub: 'Standardised information' },
  ],
  fixed: [
    { icon: 'fa-file-contract', title: 'Account terms', sub: 'Fixed-term savings agreement' },
    { icon: 'fa-file-invoice', title: 'Price & fees', sub: 'Standardised information' },
  ],
  loan: [
    { icon: 'fa-file-contract', title: 'Account terms', sub: 'Private loan agreement' },
    { icon: 'fa-file-invoice', title: 'Price & fees', sub: 'Standardised information (SEKKI)' },
    { icon: 'fa-file-lines', title: 'Statements', sub: 'Loan statements and receipts' },
  ],
  invoice: [
    { icon: 'fa-file-contract', title: 'Account terms', sub: 'Part-payment agreement' },
    { icon: 'fa-file-invoice', title: 'Price & fees', sub: 'Standardised information' },
  ],
};

// Card imagery (design: 'assets/card.png' / window.__r('familyCard')).
const cardImg = require('@/assets/design/card.png') as ImageSourcePropType;
const familyCardImg = require('@/assets/design/family-card.png') as ImageSourcePropType;

// NOTE: matches the design spec exactly — there is no 'fambuffer' entry;
// the Family buffer keeps its bespoke layout in AccountView.
export const STRUCTURE: Partial<Record<AccountKind, SpecSection[]>> = {
  credit: [
    { t: 'tabs', labels: ['Overview', 'Transactions'] },
    {
      t: 'cards',
      img: cardImg,
      cardThumb: 'portrait',
      rows: [
        { holder: 'John', last4: '9001', exp: '11/28', extra: false },
        { holder: 'Anna', last4: '9002', exp: '11/28', extra: true },
      ],
    },
    {
      t: 'details',
      rows: [
        ['Account number', '8501-22 778 9001', { mono: true, copy: true }],
        ['OCR', '4500 7789 0011', { mono: true, copy: true }],
        ['Bankgiro', '5827-4545', { mono: true, copy: true }],
      ],
    },
    { t: 'bonusProgram', points: '1 240 000' },
    { t: 'insurances', rows: [{ icon: 'fa-shield-halved', title: 'Payment protection insurance' }] },
    { t: 'services' },
    { t: 'invoices' },
    { t: 'documents', rows: DOC.resursGold },
  ],
  storecredit: [
    { t: 'tabs', labels: ['Overview', 'Transactions'] },
    {
      t: 'cards',
      rows: [
        { holder: 'John', last4: '5512', exp: '11/28', extra: false },
        { holder: 'Anna', last4: '5513', exp: '11/28', extra: true },
      ],
    },
    {
      t: 'details',
      rows: [
        ['Account number', '8602-31 904 5512', { mono: true, copy: true }],
        ['OCR', '4490 6612 0044', { mono: true, copy: true }],
        ['Bankgiro', '5012-9987', { mono: true, copy: true }],
      ],
    },
    { t: 'bonusChecks' },
    { t: 'insurances', rows: [{ icon: 'fa-shield-halved', title: 'Payment protection insurance' }] },
    { t: 'services' },
    { t: 'invoices' },
    { t: 'documents', rows: DOC.gekas },
  ],
  familycredit: [
    { t: 'tabs', labels: ['Overview', 'Transactions'] },
    {
      t: 'cards',
      img: familyCardImg,
      cardThumb: 'portrait',
      rows: [
        { holder: 'John', last4: '0001', exp: '10/28', extra: false },
        { holder: 'Anna', last4: '0002', exp: '10/28', extra: true },
      ],
    },
    {
      t: 'details',
      label: 'Account details',
      rows: [
        ['Account number', '8421-22 123 4567', { mono: true, copy: true }],
        ['OCR', '4500 1234 0009', { mono: true, copy: true }],
        ['Bankgiro', '5827-9090', { mono: true, copy: true }],
        ['Account holder', 'John Bergström'],
        ['Product', 'Superkonto'],
        ['Limit', '60 000 kr'],
        ['Cashback', null, { info: true }],
      ],
    },
    { t: 'insurances', rows: [{ icon: 'fa-shield-halved', title: 'Family insurance' }] },
    { t: 'services' },
    { t: 'invoices' },
    { t: 'documents', rows: DOC.family },
  ],
  flexsavings: [
    { t: 'tabs', labels: ['Overview', 'Transactions'] },
    { t: 'cta' },
    { t: 'monthlyDeposit' },
    {
      t: 'details',
      rows: [
        ['Account holder', 'John Andersson'],
        ['Account number', '9020-11 552 0034', { mono: true, copy: true }],
        ['Deposit limit', '1 000 000 kr'],
        ['Payout account', '8327-9 441 023 110', { mono: true, copy: true }],
        ['Creation date', '2023-04-18'],
        ['Account role', 'Owner'],
        ['Interest type', 'Variable'],
        ['Accrued interest', '1 284 kr'],
        ['Tax (30%)', '385 kr'],
      ],
    },
    { t: 'services' },
    { t: 'documents', rows: DOC.flex },
  ],
  fixedsavings: [
    { t: 'tabs', labels: ['Overview', 'Transactions'] },
    { t: 'cta' },
    {
      t: 'details',
      rows: [
        ['Account holder', 'John Andersson'],
        ['Account number', '9020-11 552 0090', { mono: true, copy: true }],
        ['Locked until', '2026-10-01'],
        ['Deposit limit', '1 000 000 kr'],
        ['Payout account', '8327-9 441 023 110', { mono: true, copy: true }],
        ['Creation date', '2025-10-01'],
        ['Account role', 'Owner'],
        ['Interest type', 'Fixed'],
        ['Accrued interest', '930 kr'],
        ['Tax (30%)', '279 kr'],
      ],
    },
    { t: 'services' },
    { t: 'documents', rows: DOC.fixed },
  ],
  loan: [
    { t: 'tabs', labels: ['Overview', 'Transactions'] },
    {
      t: 'details',
      rows: [
        ['Monthly installment', '2 150 kr'],
        ['Months left', '44'],
        ['Interest', '5,95 %'],
        ['Next payment date', '2026-07-28'],
        ['Autogiro', 'Active'],
        ['Account number', '8610-22 700 5512', { mono: true, copy: true }],
        ['OCR', '6600 5512 0022 8', { mono: true, copy: true }],
        ['Bankgiro', '5827-9090', { mono: true, copy: true }],
        ['Creation date', '2025-05-14'],
        ['Account role', 'Borrower'],
      ],
    },
    { t: 'insurances', rows: [] },
    { t: 'services' },
    { t: 'invoices' },
    { t: 'documents', rows: DOC.loan },
  ],
  invoice: [
    { t: 'tabs', labels: ['Overview', 'Transactions'] },
    {
      t: 'details',
      rows: [
        ['Merchant / store', 'Bauhaus'],
        ['Purchase amount', '3 490 kr'],
        ['Products', 'Garden furniture set'],
        ['Account number', '8744-90 220 1180', { mono: true, copy: true }],
        ['OCR', '4500 5500 0011 1', { mono: true, copy: true }],
        ['Bankgiro', '5311-2090', { mono: true, copy: true }],
      ],
    },
    { t: 'services' },
    { t: 'invoices' },
    { t: 'documents', rows: DOC.invoice },
  ],
};

/** Bundle mirroring the design's window.RY_ACCOUNT_SPEC. */
export const RY_ACCOUNT_SPEC = { accountKind, SERVICES, PRIMARY, STRUCTURE, DOC };
