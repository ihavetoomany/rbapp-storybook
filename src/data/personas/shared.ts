// src/data/personas/shared.ts — theme tokens, product factories and the
// documents/messages inbox builders shared by all personas.
// Ported 1:1 from the design prototype's data.js.

import { d, m } from '../format';
import type {
  Account,
  DepositAccount,
  Invoice,
  InvoiceStatus,
  Product,
  ProductTheme,
  RyDocument,
  RyMessage,
} from '../types';

// ---------------------------------------------------------------------------
// Theme tokens for direct products
// ---------------------------------------------------------------------------

export const themes: Record<'family' | 'savings' | 'loan', ProductTheme> = {
  // Resurs Family / Credit — deep Resurs teal-green (brand primary)
  family: { brandColor: '#0C5D57', brandColor2: '#3B817A', icon: 'fa-people-roof' },
  // Savings — muted sage (Resurs Mint scale, deepened)
  savings: { brandColor: '#3F4E4B', brandColor2: '#69827D', icon: 'fa-piggy-bank' },
  // Loan — warm earthy taupe (Resurs Sand scale, deepened)
  loan: { brandColor: '#4B4848', brandColor2: '#7D7878', icon: 'fa-house-chimney' },
};

// ---------------------------------------------------------------------------
// Standard direct products attached to personas:
//   - one deposit (savings) product
//   - one private loan product
// Factory keeps ids unique per persona so React keys and the Payments
// aggregation don't collide.
// ---------------------------------------------------------------------------

export type MakeDepositOpts = {
  includeFixed?: boolean;
  flexBalance?: number;
  fixedBalance?: number;
  /** Enables the Monthly-deposits flow (John only). */
  autoSave?: boolean;
  /** Optional seeded auto-deposit. */
  monthlyDeposit?: DepositAccount['monthlyDeposit'];
};

export const makeDeposit = (sfx: string, opts: MakeDepositOpts = {}): Product => {
  const flexBalance = opts.flexBalance != null ? opts.flexBalance : 42500;
  const fixedBalance = opts.fixedBalance != null ? opts.fixedBalance : 100000;

  const flexAccount: DepositAccount = {
    id: `a-deposit-${sfx}`,
    type: 'depositAccount',
    name: 'Savings · Flexible',
    number: '9020-11 552 0034',
    balance: m(flexBalance),
    interestRate: 4.05,
    earnedThisYear: m(Math.round((flexBalance * 4.05) / 100)),
    autoDeposit: m(1500),
    autoSave: opts.autoSave || false,
    monthlyDeposit: opts.monthlyDeposit || null,
    // Transaction history — only for funded accounts; a brand-new account
    // (flexBalance 0) intentionally has none.
    transactions:
      opts.flexBalance == null || opts.flexBalance > 0
        ? [
            { id: `flx-int-${sfx}-1`, type: 'refund', date: d(-9), merchant: 'Interest payment', amount: m(143), icon: 'fa-percent', subLabel: 'Interest', amountColor: '#000000' },
            { id: `flx-wd-${sfx}-1`, type: 'withdrawal', date: d(-18), merchant: 'Withdrawal to account', amount: m(3000), icon: 'fa-arrow-up', subLabel: 'Withdrawal' },
            { id: `flx-dep-${sfx}-1`, type: 'refund', date: d(-25), merchant: 'Monthly deposit', amount: m(1500), icon: 'fa-arrow-down', subLabel: 'Deposit', amountColor: '#000000' },
            { id: `flx-dep-${sfx}-2`, type: 'refund', date: d(-55), merchant: 'Monthly deposit', amount: m(1500), icon: 'fa-arrow-down', subLabel: 'Deposit', amountColor: '#000000' },
            { id: `flx-wd-${sfx}-2`, type: 'withdrawal', date: d(-70), merchant: 'Withdrawal to account', amount: m(5000), icon: 'fa-arrow-up', subLabel: 'Withdrawal' },
            { id: `flx-dep-${sfx}-3`, type: 'refund', date: d(-85), merchant: 'Monthly deposit', amount: m(1500), icon: 'fa-arrow-down', subLabel: 'Deposit', amountColor: '#000000' },
            { id: `flx-dep-${sfx}-4`, type: 'refund', date: d(-115), merchant: 'Deposit', amount: m(10000), icon: 'fa-arrow-down', subLabel: 'Deposit', amountColor: '#000000' },
            { id: `flx-dep-${sfx}-5`, type: 'refund', date: d(-205), merchant: 'Opening deposit', amount: m(25000), icon: 'fa-arrow-down', subLabel: 'Deposit', amountColor: '#000000' },
          ]
        : [],
  };

  const fixedAccount: DepositAccount = {
    id: `a-deposit-fixed-${sfx}`,
    type: 'depositAccount',
    name: 'Savings · Fixed term',
    number: '8480-22 556 7788',
    balance: m(fixedBalance),
    interestRate: 4.05,
    earnedThisYear: m(Math.round((fixedBalance * 4.05) / 100)),
    lockedUntil: '2027-03-14',
    transactions: [
      { id: `fx-int-${sfx}-1`, type: 'refund', date: d(-12), merchant: 'Interest payment', amount: m(338), icon: 'fa-percent', subLabel: 'Interest', amountColor: '#000000' },
      { id: `fx-int-${sfx}-2`, type: 'refund', date: d(-43), merchant: 'Interest payment', amount: m(338), icon: 'fa-percent', subLabel: 'Interest', amountColor: '#000000' },
      { id: `fx-int-${sfx}-3`, type: 'refund', date: d(-74), merchant: 'Interest payment', amount: m(338), icon: 'fa-percent', subLabel: 'Interest', amountColor: '#000000' },
      { id: `fx-dep-${sfx}-1`, type: 'refund', date: d(-105), merchant: 'Deposit', amount: m(20000), icon: 'fa-arrow-down', subLabel: 'Deposit', amountColor: '#000000' },
      { id: `fx-dep-${sfx}-2`, type: 'refund', date: d(-196), merchant: 'Deposit', amount: m(20000), icon: 'fa-arrow-down', subLabel: 'Deposit', amountColor: '#000000' },
      { id: `fx-dep-${sfx}-3`, type: 'refund', date: d(-280), merchant: 'Opening deposit', amount: m(60000), icon: 'fa-arrow-down', subLabel: 'Deposit', amountColor: '#000000' },
    ],
  };

  const accounts: Account[] = opts.includeFixed ? [flexAccount, fixedAccount] : [flexAccount];

  return {
    id: `p-deposit-${sfx}`,
    name: 'Segelbåten',
    origin: 'direct',
    type: 'savings',
    theme: themes.savings,
    primaryMetric: { label: 'Savings balance', value: m(42500), sentiment: 'positive' },
    secondaryMetrics: [
      { label: 'Interest rate', value: { amount: 4.05, currency: '%' } },
      { label: 'This year', value: m(1280) },
    ],
    accounts,
    purchases: [],
    invoices: [],
    paymentRequests: [],
    offers: [
      { type: 'offer', icon: 'fa-arrow-trend-up', title: 'Boost: +0.20% on top-up', desc: 'Add 25 000 SEK before Dec 31 to lock in' },
      { type: 'benefit', icon: 'fa-lock', title: 'Capital guarantee', desc: 'Covered by the deposit insurance scheme' },
    ],
  };
};

export const makeLoan = (sfx: string, dueOffset = 7, invoiceStatus: InvoiceStatus = 'unpaid'): Product => ({
  id: `p-privateloan-${sfx}`,
  name: 'Billån',
  origin: 'direct',
  type: 'loan',
  theme: themes.loan,
  primaryMetric: { label: 'Remaining balance', value: m(86200), sentiment: 'negative' },
  secondaryMetrics: [
    { label: 'Monthly payment', value: m(2150) },
    { label: 'Interest rate', value: { amount: 5.95, currency: '%' } },
  ],
  accounts: [
    {
      id: `a-privateloan-${sfx}`,
      type: 'loanAccount',
      name: 'Private loan',
      number: '8610-22 700 5512',
      ocr: '6600 5512 0022 8',
      bankgiro: '5827-9090',
      originalAmount: m(120000),
      remainingBalance: m(86200),
      interestRate: 5.95,
      termMonths: 60,
      monthlyPayment: m(2150),
      paymentsMade: 16,
    },
  ],
  purchases: [
    { id: `tloan1-${sfx}`, type: 'refund', date: d(-1), merchant: 'Loan payment', amount: m(2150), accountId: `a-privateloan-${sfx}`, icon: 'fa-money-bill-transfer', amountColor: '#000000', subLabel: '' },
    { id: `tloan2-${sfx}`, type: 'refund', date: d(-31), merchant: 'Loan payment', amount: m(2150), accountId: `a-privateloan-${sfx}`, icon: 'fa-money-bill-transfer', amountColor: '#000000', subLabel: '' },
    { id: `tloan3-${sfx}`, type: 'refund', date: d(-61), merchant: 'Loan payment', amount: m(2150), accountId: `a-privateloan-${sfx}`, icon: 'fa-money-bill-transfer', amountColor: '#000000', subLabel: '' },
    { id: `tloan4-${sfx}`, type: 'refund', date: d(-91), merchant: 'Loan payment', amount: m(2150), accountId: `a-privateloan-${sfx}`, icon: 'fa-money-bill-transfer', amountColor: '#000000', subLabel: '' },
    { id: `tloan5-${sfx}`, type: 'refund', date: d(-121), merchant: 'Loan payment', amount: m(2150), accountId: `a-privateloan-${sfx}`, icon: 'fa-money-bill-transfer', amountColor: '#000000', subLabel: '' },
    { id: `tloan6-${sfx}`, type: 'refund', date: d(-152), merchant: 'Loan payment', amount: m(2150), accountId: `a-privateloan-${sfx}`, icon: 'fa-money-bill-transfer', amountColor: '#000000', subLabel: '' },
  ],
  invoices: [
    { id: `i-ploan-nov-${sfx}`, accountId: `a-privateloan-${sfx}`, period: 'November 2025', amount: m(2150), date: d(-1), due: d(dueOffset), ocr: '6600 5512 0022 8', status: invoiceStatus, type: 'laneavi' },
    { id: `i-ploan-oct-${sfx}`, accountId: `a-privateloan-${sfx}`, period: 'October 2025', amount: m(2150), date: d(-31), due: d(-23), ocr: '6600 5512 0022 7', status: 'paid', type: 'laneavi' },
  ] as Invoice[],
  paymentRequests: [
    {
      id: `pr-ploan-nov-${sfx}`,
      invoiceId: `i-ploan-nov-${sfx}`,
      accountId: `a-privateloan-${sfx}`,
      productId: `p-privateloan-${sfx}`,
      kind: 'laneavi',
      title: 'Loan installment · November',
      description: 'This invoice relates to your 120 000 kr loan started in May 2025.',
      remainingAmount: m(2150),
      originalAmount: m(2150),
      dueDate: d(dueOffset),
      status: invoiceStatus,
      ocr: '6600 5512 0022 8',
      bankgiro: '5827-9090',
      principal: m(1720),
      interestPart: m(430),
      paymentNo: 17,
      paymentsTotal: 60,
    },
  ],
  offers: [
    { type: 'action', icon: 'fa-arrow-down', title: 'Pay extra to save interest', desc: 'Lower remaining term by paying ahead' },
    { type: 'benefit', icon: 'fa-calendar-check', title: 'Free payment break', desc: 'Pause one payment per 12 months' },
  ],
});

// ---------------------------------------------------------------------------
// Documents & messages — unified inbox ("My documents" + "Messages from the
// bank"). Fresh copies per persona so read/unread state never leaks across.
// ---------------------------------------------------------------------------

/** Newest first — sort by date descending so the most recent item is on top. */
export const byNewest = <T extends { date: string }>(a: T, b: T): number =>
  a.date < b.date ? 1 : a.date > b.date ? -1 : 0;

export const makeDocuments = (): RyDocument[] => [
  { id: 'doc-1', title: 'Account statement — November 2025', type: 'LEGAL/FINANCIAL', date: '2025-11-30', unread: true },
  { id: 'doc-2', title: 'Resurs Mastercard — updated terms', type: 'TERMS', date: '2025-11-22', unread: true },
  { id: 'doc-3', title: 'Payment reminder — invoice 4502', type: 'REMINDER', date: '2025-11-15', unread: false },
  { id: 'doc-12', title: 'Payment reminder — invoice 4488', type: 'REMINDER', date: '2025-10-12', unread: true },
  { id: 'doc-13', title: 'Payment reminder — invoice 4471', type: 'REMINDER', date: '2025-09-05', unread: false },
  { id: 'doc-4', title: 'Credit report copy', type: 'REQUEST', date: '2025-11-08', unread: true, requestedByYou: true },
  { id: 'doc-5', title: 'Loan agreement — Private loan', type: 'AGREEMENT', date: '2025-10-28', unread: true },
  { id: 'doc-8', title: 'Annual interest summary 2024', type: 'LEGAL/FINANCIAL', date: '2025-09-12', unread: false },
  { id: 'doc-9', title: 'Updated privacy policy', type: 'TERMS', date: '2025-08-30', unread: false },
  { id: 'doc-10', title: 'Superkonto agreement', type: 'AGREEMENT', date: '2025-08-15', unread: false },
  // Resurs document catalogue — examples of every document type
  { id: 'doc-20', title: 'Credit agreement — Resurs Mastercard', type: 'CREDIT_AGREEMENT', date: '2025-07-20', unread: false },
  { id: 'doc-21', title: 'Consumer loan agreement', type: 'CONSUMER_LOAN_AGREEMENT', date: '2025-07-02', unread: false },
  { id: 'doc-22', title: 'General terms and conditions', type: 'COMMON_TERMS', date: '2025-06-18', unread: false },
  { id: 'doc-23', title: 'Savings account — general terms', type: 'SAVINGS_COMMON_TERMS_NATURAL', date: '2025-06-05', unread: false },
  { id: 'doc-24', title: 'Savings account — general terms (business)', type: 'SAVINGS_COMMON_TERMS_LEGAL', date: '2025-05-22', unread: false },
  { id: 'doc-25', title: 'Savings account — special terms', type: 'SAVINGS_SPECIAL_TERMS', date: '2025-05-08', unread: false },
  { id: 'doc-26', title: 'Standard European Consumer Credit Information', type: 'DEFAULT_SEKKI', date: '2025-04-25', unread: false },
  { id: 'doc-27', title: 'Individual credit information', type: 'INDIVIDUAL_SEKKI', date: '2025-04-10', unread: false },
  { id: 'doc-28', title: 'Deposit insurance information', type: 'DEPOSIT_INSURANCE', date: '2025-03-28', unread: false },
  { id: 'doc-29', title: 'Payment protection insurance terms', type: 'PAYMENT_PROTECTION_INSURANCE', date: '2025-03-12', unread: false },
  { id: 'doc-30', title: 'Savings account application', type: 'SAVINGS_ACCOUNT_APPLICATION', date: '2025-02-26', unread: false },
  { id: 'doc-31', title: 'Annual statement — savings account 2024', type: 'ANNUAL_STATEMENT_SAVINGS_ACCOUNT', date: '2025-01-15', unread: false },
  { id: 'doc-32', title: 'Annual statement — private loan 2024', type: 'ANNUAL_STATEMENT_PRIVATE_LOAN_ACCOUNT', date: '2025-01-15', unread: false },
  { id: 'doc-33', title: 'Annual statement of fees 2024', type: 'ANNUAL_STATEMENT_OF_FEES', date: '2025-01-15', unread: false },
];

// Messages from the bank — sent via the Message Admin Portal by the
// Marketing / output teams. Free-text HTML bodies that may contain links and
// custom styling; rendered dark-mode-safe with distinct (blue) links.
export const makeMessages = (name: string): RyMessage[] => [
  {
    id: 'msg-approval',
    subject: 'Your savings account application is approved',
    preview: 'Welcome — your new savings account is ready to use.',
    sender: 'Resurs Bank',
    date: '2025-11-28',
    unread: true,
    bodyHtml: `
        <p>Hi ${name},</p>
        <p>Good news! Your application for a <strong>Resurs Savings Account</strong> has been approved and your account is now open.</p>
        <p>Your account number is <strong>9020-11 552 0034</strong> and your current rate is <strong>4.05%</strong>. You can start transferring money right away.</p>
        <p><a href="#">Log in to view your savings account</a></p>
        <p>Kind regards,<br>Resurs Bank</p>`,
  },
  {
    id: 'msg-precollection',
    subject: 'Important: your invoice is overdue',
    preview: 'Pay now to avoid debt collection and extra fees.',
    sender: 'Resurs Bank',
    date: '2025-11-20',
    unread: true,
    bodyHtml: `
        <p>Hi ${name},</p>
        <p>We have not yet received payment for invoice <strong>4502</strong>, which was due on <strong>2025-11-15</strong>.</p>
        <div style="background:#FFE2E2;color:#9F0712;border-radius:12px;padding:14px 16px;margin:14px 0;">
          Please pay <strong>329 SEK</strong> no later than <strong>2025-11-27</strong> to avoid your case being passed to debt collection, which adds extra fees.
        </div>
        <p><a href="#">Pay the invoice now</a></p>
        <p>If you have already paid, you can disregard this message.</p>
        <p>Kind regards,<br>Resurs Bank</p>`,
  },
  {
    id: 'msg-rate',
    subject: 'Updated interest rates',
    preview: 'New savings and lending rates apply from 1 Dec 2025.',
    sender: 'Resurs Bank',
    date: d(0),
    unread: true,
    bodyHtml: `
        <p>Hi ${name},</p>
        <p>From <strong>1 December 2025</strong> we are updating our savings and lending rates. The interest rate on your savings account will be <strong>4.05%</strong>.</p>
        <p>No action is needed — the new rates apply automatically.</p>
        <p><a href="#">Read the updated terms</a></p>
        <p>Kind regards,<br>Resurs Bank</p>`,
  },
  {
    id: 'msg-hours',
    subject: 'Holiday opening hours',
    preview: 'Customer service has reduced hours over the holidays.',
    sender: 'Resurs Bank',
    date: d(-2),
    unread: true,
    bodyHtml: `
        <p>Hi ${name},</p>
        <p>Over the holidays our customer service will have <strong>reduced opening hours</strong>.</p>
        <div style="background:#EAF4F0;color:#0C5D57;border-radius:12px;padding:14px 16px;margin:14px 0;">
          You can always manage your accounts, pay invoices and read messages here in the app, around the clock.
        </div>
        <p><a href="#">See full opening hours</a></p>
        <p>Kind regards,<br>Resurs Bank</p>`,
  },
  {
    id: 'msg-offer',
    subject: 'You are pre-approved for a higher credit limit',
    preview: 'Raise your Resurs Mastercard limit in a few taps.',
    sender: 'Resurs Bank',
    date: '2025-10-18',
    unread: false,
    bodyHtml: `
        <p>Hi ${name},</p>
        <p>Because you manage your account so well, you're <strong>pre-approved</strong> to raise your Resurs Mastercard credit limit to <strong>50 000 SEK</strong>.</p>
        <div style="background:#EAF4F0;color:#0C5D57;border-radius:12px;padding:14px 16px;margin:14px 0;">
          This offer is valid until <strong>2025-11-30</strong>.
        </div>
        <p><a href="#">Review the offer</a></p>
        <p>Kind regards,<br>Resurs Bank</p>`,
  },
  {
    id: 'msg-summary',
    subject: 'Your November summary is ready',
    preview: 'See your spending and payments for the month.',
    sender: 'Resurs Bank',
    date: '2025-11-25',
    unread: false,
    bodyHtml: `
        <p>Hi ${name},</p>
        <p>Your account summary for <strong>November</strong> is ready to view in the app.</p>
        <p><a href="#">Open your November summary</a></p>
        <p>Kind regards,<br>Resurs Bank</p>`,
  },
  {
    id: 'msg-campaign',
    subject: 'Autumn savings campaign',
    preview: 'Boost your savings with a limited-time bonus rate.',
    sender: 'Resurs Bank',
    date: '2025-10-20',
    unread: false,
    bodyHtml: `
        <p>Hi ${name},</p>
        <p>For a limited time, top up your savings account with <strong>25 000 SEK</strong> or more and earn a <strong>+0.20%</strong> bonus rate for six months.</p>
        <p><a href="#">See campaign details</a></p>
        <p>Kind regards,<br>Resurs Bank</p>`,
  },
  {
    id: 'msg-welcome',
    subject: 'Welcome to Resurs',
    preview: 'Everything you need to get started.',
    sender: 'Resurs Bank',
    date: '2025-09-30',
    unread: false,
    bodyHtml: `
        <p>Hi ${name},</p>
        <p>Welcome to Resurs! We're glad to have you. From here you can manage your accounts, pay invoices and track your savings.</p>
        <p><a href="#">Take a quick tour</a></p>
        <p>Kind regards,<br>Resurs Bank</p>`,
  },
];
