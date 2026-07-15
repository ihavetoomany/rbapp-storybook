// src/data/personas/john.ts — PERSONA: John, the standard customer.
//   - Resurs Family (Superkonto credit, direct) + editable "v2" clone
//   - Resurs Gold (direct Mastercard)
//   - NetOnNet merchant product (ecom invoices)
//   - Bauhaus merchant product (part-payment plan)
//   - Åhléns merchant product (store credit revolving)
//   - Gekås (direct revolving Mastercard with bonus checks)
//   - Segelbåten savings (flex 0 kr + fixed 100 000 kr, auto-save enabled)
//   - Billån private loan
// Ported 1:1 from the design prototype's data.js.

import type { ImageSourcePropType } from 'react-native';

import { d, m } from '../format';
import { RY_MERCHANTS as merchants } from '../merchants';
import type { Persona, Product } from '../types';
import { byNewest, makeDeposit, makeDocuments, makeLoan, makeMessages, themes } from './shared';

// Partner-branded round logo on the wallet card (design: window.__r('gekasLogo')).
const gekasLogo = require('@/assets/design/gekas-logo.png') as ImageSourcePropType;

// ---------- DIRECT: RESURS FAMILY (Superkonto + Mastercard) ----------
const family: Product = {
  id: 'p-family',
  name: 'Resurs Family',
  origin: 'direct',
  type: 'credit',
  monthlyBudget: m(12000),
  theme: themes.family,
  primaryMetric: { label: 'Available credit', value: m(38400), sentiment: 'positive' },
  secondaryMetrics: [
    { label: 'Credit limit', value: m(60000) },
    { label: 'Used credit', value: m(21600) },
  ],
  accounts: [
    {
      id: 'a-super',
      type: 'creditAccount',
      subtype: 'superkonto',
      name: 'Superkonto',
      number: '8421-22 123 4567',
      ocr: '4500 1234 0009',
      bankgiro: '5827-9090',
      creditLimit: m(60000),
      usedCredit: m(21600),
      availableCredit: m(38400),
      debtThisMonth: m(8600), // "Purchase to handle this month"
      debtNextMonth: m(13000), // "Purchase to handle next month" (8600 + 13000 = 21600 used)
      billedThisMonth: m(5000), // already billed; remainder of usedCredit is this month's purchases (5000 + 16600 = 21600)
      hidden: true, // not listed in ProductDetailView
      // Cardholders on this family account — drives the "Users" filter.
      cards: [
        { id: 'john', name: 'John B' },
        { id: 'anna', name: 'Anna B' },
      ],
    },
    {
      id: 'a-super-inv-nov',
      type: 'invoiceAccount',
      origin: 'superkontoBreakout',
      status: 'active',
      name: 'Sony WH-1000XM5 · part payment',
      number: '8421-22 555 0011',
      ocr: '4500 5500 0011 7',
      bankgiro: '5827-9090',
      originalAmount: m(3490),
      remainingBalance: m(2326),
      interestRate: 9.95,
      termMonths: 12,
      monthlyPayment: m(305),
      paymentsMade: 4,
    },
    {
      // "Family buffer" — a dedicated savings account that exists ONLY for
      // the Resurs Family product (reachable solely via the Family buffer
      // button). Its budget figures feed the Family budget overview.
      id: 'a-fam-savings',
      type: 'depositAccount',
      name: 'Family buffer',
      number: '8480-22 770 2200',
      balance: m(14200),
      interestRate: 2.75,
      goalAmount: m(20000),
      earnedThisYear: m(640),
      openedDate: '2021-03-15',
      rateDate: '2025-01-01',
      transactions: [
        { id: 'fb1', type: 'refund', date: d(-2), merchant: 'Cashback · Hemköp', amount: m(4), icon: 'fa-bolt', subLabel: 'Cashback', amountColor: '#000000' },
        { id: 'fb2', type: 'refund', date: d(-6), merchant: 'Cashback · Statoil Circle K', amount: m(10), icon: 'fa-bolt', subLabel: 'Cashback', amountColor: '#000000' },
        { id: 'fb3', type: 'refund', date: d(-12), merchant: 'Monthly transfer', amount: m(1000), icon: 'fa-arrow-down', subLabel: 'Deposit', amountColor: '#000000' },
        { id: 'fb4', type: 'refund', date: d(-25), merchant: 'Interest', amount: m(65), icon: 'fa-percent', subLabel: 'Interest', amountColor: '#000000' },
        { id: 'fb5', type: 'refund', date: d(-31), merchant: 'Cashback · Clas Ohlson', amount: m(5), icon: 'fa-bolt', subLabel: 'Cashback', amountColor: '#000000' },
      ],
      budget: {
        // Cashback model: 1 kr saved per 100 kr spent on the Family card,
        // deposited straight into this savings account. Figures below are
        // cashback (= savings), kept internally consistent:
        //   avgPerDay (4) × days elapsed this month (6) = thisMonth (24)
        //   thisMonth (24) = sum of cashback on this month's purchases
        thisMonth: m(24),
        prevMonth: m(116),
        saved: m(24),
        daysLeft: 24,
        avgPerDay: m(4),
      },
      hidden: true, // surfaced via the bespoke Family layout, not the default list
    },
  ],
  purchases: [
    { id: 't-prelim1', type: 'purchase', preliminary: true, date: d(0), merchant: 'Willys', amount: m(642), accountId: 'a-super', icon: 'fa-basket-shopping', user: 'john' },
    { id: 't-prelim2', type: 'purchase', preliminary: true, date: d(-1), merchant: 'Coop', amount: m(318), accountId: 'a-super', icon: 'fa-basket-shopping', user: 'anna' },
    // Non-purchase ledger entries — one per backend transaction tag. Kept as the
    // newest registered rows and within the last month so each is visible in the
    // default (unfiltered) Registered list.
    { id: 't-interest', type: 'fee', date: d(-2), merchant: 'Interest', amount: m(89), accountId: 'a-super', icon: 'fa-percent', subLabel: 'Interest', user: 'john' }, // INTEREST_APPLIED
    { id: 't-fee', type: 'fee', date: d(-3), merchant: 'Account fee', amount: m(29), accountId: 'a-super', icon: 'fa-file-invoice-dollar', subLabel: 'Fee', user: 'john' }, // FEE_APPLIED
    { id: 't-tax', type: 'fee', date: d(-4), merchant: 'Withheld tax', amount: m(54), accountId: 'a-super', icon: 'fa-building-columns', subLabel: 'Tax', user: 'john' }, // WITHHELD_TAX
    { id: 't-unknown', type: 'other', date: d(-5), merchant: 'Other transaction', amount: m(120), accountId: 'a-super', icon: 'fa-circle-question', subLabel: 'Other', user: 'john' }, // UNKNOWN
    { id: 't1', type: 'purchase', date: d(-6), merchant: 'Hemköp', amount: m(2400), accountId: 'a-super', icon: 'fa-basket-shopping', user: 'john' },
    { id: 't2', type: 'purchase', date: d(-8), merchant: 'Apoteket', amount: m(1300), accountId: 'a-super', icon: 'fa-prescription-bottle', user: 'anna' },
    { id: 't6', type: 'purchase', date: d(-9), merchant: 'Elgiganten', amount: m(10000), accountId: 'a-super', icon: 'fa-tv', user: 'anna' },
    { id: 't3', type: 'purchase', date: d(-11), merchant: 'Statoil Circle K', amount: m(1500), accountId: 'a-super', icon: 'fa-gas-pump', user: 'john' },
    { id: 't4', type: 'purchase', date: d(-15), merchant: 'SF Bio', amount: m(500), accountId: 'a-super', icon: 'fa-film', user: 'anna' },
    { id: 't5', type: 'purchase', date: d(-19), merchant: 'Clas Ohlson', amount: m(900), accountId: 'a-super', icon: 'fa-basket-shopping', user: 'john' },
    { id: 'tpay1', type: 'refund', date: d(-7), merchant: 'Invoice payment', amount: m(1180), accountId: 'a-super', icon: 'fa-money-bill-transfer', subLabel: 'Payment', amountColor: '#000000', user: 'john' },
    { id: 'tpay2', type: 'refund', date: d(-37), merchant: 'Invoice payment', amount: m(1640), accountId: 'a-super', icon: 'fa-money-bill-transfer', subLabel: 'Payment', amountColor: '#000000', user: 'anna' },
  ],
  familyMembers: [
    { id: 'fm-anna', name: 'John', age: 36, role: 'Coordinator', roleTone: 'primary', access: 'Full account access', ssn: '19800102-1234', avatar: 0 },
    { id: 'fm-anders', name: 'Anna', age: 37, role: 'Partner', roleTone: 'primary', access: 'Full account access', ssn: '19830615-4567', avatar: 1 },
    { id: 'fm-agnes', name: 'Agnes', age: 13, role: 'Little sister', roleTone: 'info', access: 'Monthly limit: 450 kr / 1 000 kr', dob: '2013-05-22', avatar: 2 },
    { id: 'fm-alex', name: 'Alex', age: 2, role: 'Little brother', roleTone: 'info', access: 'Monthly limit: N.A', dob: '2024-03-10', avatar: 3 },
  ],
  invoices: [
    { id: 'i-fam-nov', accountId: 'a-super', period: 'November 2025', amount: m(1240), date: d(-2), due: d(8), ocr: '4500 1234 0009', status: 'unpaid', type: 'manadsavi' },
    { id: 'i-fam-oct', accountId: 'a-super', period: 'October 2025', amount: m(1180), date: d(-32), due: d(-22), ocr: '4500 1234 0008', status: 'paid', type: 'manadsavi' },
    { id: 'i-fam-sep', accountId: 'a-super', period: 'September 2025', amount: m(1640), date: d(-62), due: d(-52), ocr: '4500 1234 0007', status: 'paid', type: 'manadsavi' },
  ],
  paymentRequests: [
    {
      id: 'pr-fam-nov',
      invoiceId: 'i-fam-nov',
      accountId: 'a-super',
      productId: 'p-family',
      kind: 'manadsavi',
      title: 'Monthly invoice · Superkonto',
      description: "This invoice relates to last month's purchases with Resurs Family and the monthly amount of any ongoing part payment plans from previous statements.",
      statementBreakdown: [
        { label: 'New purchases · October', amount: 935 },
        { label: 'Part payment · Sony WH-1000XM5', amount: 305 },
      ],
      remainingAmount: m(1240),
      originalAmount: m(1240),
      dueDate: d(8),
      status: 'unpaid',
      ocr: '4500 1234 0009',
      bankgiro: '5827-9090',
      tiers: [
        { id: 'min', label: 'Minimum', desc: 'Total debt converted to 17% plan', amount: m(1080) },
        { id: '6m', label: '6 months interest-free', desc: '1/6 of purchases + ongoing plans', amount: m(1240), recommended: true },
        { id: 'full', label: 'Full invoice', desc: 'Pay this month’s purchases + plans', amount: m(2710) },
        { id: 'max', label: 'Maximize credit', desc: 'Pay all used credit including uninvoiced', amount: m(21600) },
      ],
    },
    {
      id: 'pr-super-loan',
      invoiceId: 'i-super-loan-nov',
      accountId: 'a-super-inv-nov',
      productId: 'p-family',
      kind: 'delbetalning',
      title: 'Part payment · Sony WH-1000XM5',
      displayName: 'Resurs Family Flex',
      description: 'This invoice relates to your Sony WH-1000XM5 part payment plan.',
      loanAmount: m(3490),
      loanRemaining: m(2326),
      remainingAmount: m(305),
      originalAmount: m(305),
      dueDate: d(5),
      status: 'unpaid',
      ocr: '4500 5500 0011 7',
      bankgiro: '5827-9090',
      paymentNo: 5,
      paymentsTotal: 12,
      thirdLineOverride: 'inv.invoice',
      remainingBalance: m(2326),
      originalDebt: m(3490),
      interestRate: 9.95,
      principal: m(286),
      interestPart: m(19),
    },
    {
      id: 'pr-fam-oct',
      invoiceId: 'i-fam-oct',
      accountId: 'a-super',
      productId: 'p-family',
      kind: 'manadsavi',
      title: 'Monthly invoice · Superkonto',
      description: "This invoice relates to last month's purchases with Resurs Family and the monthly amount of any ongoing part payment plans from previous statements.",
      statementBreakdown: [
        { label: 'New purchases · September', amount: 890 },
        { label: 'Part payment · Sony WH-1000XM5', amount: 290 },
      ],
      remainingAmount: m(1180),
      originalAmount: m(1180),
      dueDate: d(-22),
      paidDate: d(-24),
      status: 'paid',
      ocr: '4500 1234 0008',
      bankgiro: '5827-9090',
    },
    {
      id: 'pr-fam-sched',
      invoiceId: 'i-fam-sep',
      accountId: 'a-super',
      productId: 'p-family',
      kind: 'manadsavi',
      title: 'Monthly invoice · Superkonto',
      description: "This invoice relates to last month's purchases with Resurs Family and the monthly amount of any ongoing part payment plans from previous statements.",
      statementBreakdown: [
        { label: 'New purchases · August', amount: 1360 },
        { label: 'Part payment · Sony WH-1000XM5', amount: 280 },
      ],
      remainingAmount: m(1640),
      originalAmount: m(1640),
      dueDate: d(4),
      status: 'scheduled',
      ocr: '4500 1234 0007',
      bankgiro: '5827-9090',
    },
  ],
  offers: [
    { type: 'benefit', icon: 'fa-shield-halved', title: 'Free purchase insurance', desc: 'On every card purchase, up to 30 000 SEK' },
    { type: 'benefit', icon: 'fa-percent', title: '0.5% cashback', desc: 'On groceries, gas, and pharmacy' },
    { type: 'offer', icon: 'fa-gift', title: 'Welcome bonus', desc: '300 SEK after first 3 000 SEK spent · 12 days left' },
  ],
};

// ---------- DIRECT: RESURS GOLD (Mastercard credit card) ----------
const gold: Product = {
  id: 'p-gold',
  name: 'Resurs Gold',
  origin: 'direct',
  type: 'credit',
  bonusPoints: 1240000,
  monthlyBudget: m(10000),
  devStates: ['Q3', 'Q4'], // shown in the Ongoing and Next IAs
  theme: { brandColor: '#0C5D57', brandColor2: '#3B817A', icon: 'fa-credit-card' },
  primaryMetric: { label: 'Available credit', value: m(31500), sentiment: 'positive' },
  secondaryMetrics: [
    { label: 'Credit limit', value: m(40000) },
    { label: 'Available credit', value: m(31500) },
  ],
  accounts: [
    {
      id: 'a-gold-credit',
      type: 'creditAccount',
      subtype: 'kort2000',
      name: 'Main credit account',
      number: '8501-22 778 9001',
      ocr: '4500 7789 0011',
      bankgiro: '5827-4545',
      creditLimit: m(40000),
      usedCredit: m(8500),
      availableCredit: m(31500),
    },
    {
      id: 'a-gold-inv-nov',
      type: 'invoiceAccount',
      origin: 'kort2000',
      status: 'active',
      name: 'November',
      number: '8501-22 778 9002',
      ocr: '4500 7789 0021 3',
      bankgiro: '5827-4545',
      originalAmount: m(8500),
      remainingBalance: m(1290),
      interestRate: 0,
      termMonths: 12,
      monthlyPayment: m(350),
      paymentsMade: 0,
    },
  ],
  purchases: [
    { id: 'tg-prelim1', type: 'purchase', preliminary: true, date: d(0), merchant: 'Willys', amount: m(536), accountId: 'a-gold-credit', icon: 'fa-basket-shopping' },
    { id: 'tg-prelim2', type: 'purchase', preliminary: true, date: d(-1), merchant: 'Espresso House', amount: m(78), accountId: 'a-gold-credit', icon: 'fa-mug-hot' },
    { id: 'tg1', type: 'purchase', date: d(-1), merchant: 'Coop', amount: m(842), accountId: 'a-gold-credit', icon: 'fa-basket-shopping' },
    { id: 'tg2', type: 'purchase', date: d(-4), merchant: 'Circle K', amount: m(615), accountId: 'a-gold-credit', icon: 'fa-gas-pump' },
    { id: 'tg3', type: 'purchase', date: d(-11), merchant: 'Elgiganten', amount: m(2990), accountId: 'a-gold-credit', icon: 'fa-basket-shopping' },
    { id: 'tg4', type: 'purchase', date: d(-15), merchant: 'IKEA', amount: m(1340), accountId: 'a-gold-credit', icon: 'fa-couch' },
    { id: 'tg5', type: 'purchase', date: d(-22), merchant: 'Apoteket', amount: m(289), accountId: 'a-gold-credit', icon: 'fa-prescription-bottle-medical' },
    { id: 'tg6', type: 'purchase', date: d(-27), merchant: 'Systembolaget', amount: m(412), accountId: 'a-gold-credit', icon: 'fa-wine-bottle' },
    { id: 'tg7', type: 'purchase', date: d(-34), merchant: 'Hemköp', amount: m(523), accountId: 'a-gold-credit', icon: 'fa-basket-shopping' },
    { id: 'tg8', type: 'purchase', date: d(-41), merchant: 'H&M', amount: m(799), accountId: 'a-gold-credit', icon: 'fa-shirt' },
    { id: 'tg9', type: 'purchase', date: d(-48), merchant: 'Circle K', amount: m(640), accountId: 'a-gold-credit', icon: 'fa-gas-pump' },
    { id: 'tg10', type: 'purchase', date: d(-55), merchant: 'Coop', amount: m(1120), accountId: 'a-gold-credit', icon: 'fa-basket-shopping' },
    { id: 'tg11', type: 'purchase', date: d(-63), merchant: 'Elgiganten', amount: m(4490), accountId: 'a-gold-credit', icon: 'fa-tv' },
    { id: 'tg12', type: 'purchase', date: d(-71), merchant: 'Apoteket', amount: m(215), accountId: 'a-gold-credit', icon: 'fa-prescription-bottle-medical' },
  ],
  invoices: [
    { id: 'i-gold-nov', accountId: 'a-gold-inv-nov', period: 'November 2025', amount: m(1290), date: d(-1), due: d(12), ocr: '4500 7789 0021 3', status: 'unpaid', type: 'manadsavi' },
    { id: 'i-gold-oct', accountId: 'a-gold-inv-nov', period: 'October 2025', amount: m(1190), date: d(-31), due: d(-21), ocr: '4500 7789 0021 2', status: 'paid', type: 'manadsavi' },
  ],
  paymentRequests: [
    {
      id: 'pr-gold-nov',
      invoiceId: 'i-gold-nov',
      accountId: 'a-gold-inv-nov',
      productId: 'p-gold',
      kind: 'manadsavi',
      title: 'Monthly invoice · Resurs Gold',
      displayName: 'Resurs Gold',
      description: "This invoice relates to last month's purchases with Resurs Gold.",
      statementBreakdown: [{ label: 'Purchases · October', amount: 1290 }],
      remainingAmount: m(1290),
      originalAmount: m(1290),
      dueDate: d(12),
      status: 'unpaid',
      ocr: '4500 7789 0021 3',
      bankgiro: '5827-4545',
    },
    {
      id: 'pr-gold-oct',
      invoiceId: 'i-gold-oct',
      accountId: 'a-gold-inv-nov',
      productId: 'p-gold',
      kind: 'manadsavi',
      title: 'Monthly invoice · Resurs Gold',
      displayName: 'Resurs Gold',
      description: "This invoice relates to last month's purchases with Resurs Gold.",
      statementBreakdown: [{ label: 'Purchases · September', amount: 1190 }],
      remainingAmount: m(1190),
      originalAmount: m(1190),
      dueDate: d(-21),
      paidDate: d(-23),
      status: 'paid',
      ocr: '4500 7789 0021 2',
      bankgiro: '5827-4545',
    },
  ],
  offers: [
    { type: 'benefit', icon: 'fa-shield-halved', title: 'Free purchase insurance', desc: 'On every card purchase, up to 30 000 SEK' },
    { type: 'benefit', icon: 'fa-clock-rotate-left', title: 'Pay now or pay later', desc: 'Split any purchase into flexible part payments' },
    { type: 'action', icon: 'fa-pen-to-square', title: 'Update direct debit', desc: 'Set up autopay so you never miss an invoice' },
  ],
};

// ---------- MERCHANT: NETONNET (one-time-credit purchases) ----------
const netonnet: Product = {
  id: 'p-netonnet-john',
  name: 'NetOnNet',
  origin: 'merchant',
  merchantId: 'netonnet',
  type: 'credit',
  theme: { brandColor: merchants.netonnet.brandColor, brandColor2: merchants.netonnet.brandColor2, icon: 'fa-basket-shopping' },
  primaryMetric: { label: 'To pay this month', value: m(3700), sentiment: 'negative' },
  secondaryMetrics: [
    { label: 'Credit limit', value: m(25000) },
    { label: 'Available credit', value: m(21300) },
  ],
  accounts: [
    {
      id: 'a-non-john',
      type: 'creditAccount',
      subtype: 'kort2000',
      name: 'NetOnNet account',
      number: '8311-22 410 7700',
      creditLimit: m(25000),
      usedCredit: m(3700),
      availableCredit: m(21300),
      hidden: true,
    },
  ],
  purchases: [
    {
      id: 'tnj1',
      type: 'purchase',
      date: '2026-06-12',
      merchant: 'NetOnNet.se',
      amount: m(2500),
      accountId: 'a-non-john',
      icon: 'fa-tv',
      ecomDetail: {
        items: [{ name: 'Samsung 55" 4K UHD TV', qty: 1, price: m(2500) }],
        shipping: 'Home delivery',
      },
    },
    {
      id: 'tnj2',
      type: 'purchase',
      date: '2026-06-18',
      merchant: 'NetOnNet.se',
      amount: m(1200),
      accountId: 'a-non-john',
      icon: 'fa-headphones',
      ecomDetail: {
        items: [{ name: 'Sony WH-1000XM5 headphones', qty: 1, price: m(1200) }],
        shipping: 'Pickup at store',
      },
    },
  ],
  invoices: [
    { id: 'i-nonj-jun', accountId: 'a-non-john', period: 'June 2026', amount: m(3700), date: '2026-06-18', due: '2026-07-25', ocr: '4400 4100 7700 2', status: 'unpaid', type: 'faktura' },
  ],
  paymentRequests: [
    {
      id: 'pr-nonj-jun',
      invoiceId: 'i-nonj-jun',
      accountId: 'a-non-john',
      productId: 'p-netonnet-john',
      kind: 'faktura',
      title: 'NetOnNet · part payment',
      description: 'This invoice relates to your recent NetOnNet purchases.',
      remainingAmount: m(3700),
      purchase: {
        store: 'NetOnNet.se',
        items: [
          { name: 'Samsung 55" 4K UHD TV', qty: 1, price: m(2500) },
          { name: 'Sony WH-1000XM5 headphones', qty: 1, price: m(1200) },
        ],
      },
      originalAmount: m(3700),
      dueDate: '2026-07-25',
      status: 'unpaid',
      ocr: '4400 4100 7700 2',
      bankgiro: '5827-3434',
    },
  ],
  offers: [
    { type: 'benefit', icon: 'fa-shield-halved', title: '3-year warranty', desc: 'On all electronics paid with Resurs' },
    { type: 'action', icon: 'fa-clock', title: 'Convert to part payment', desc: 'Split a purchase over up to 24 months' },
  ],
};

// ---------- MERCHANT: BAUHAUS (part-payment plan) ----------
const bauhaus: Product = {
  id: 'p-bauhaus-john',
  name: 'Bauhaus',
  origin: 'merchant',
  merchantId: 'bauhaus',
  type: 'credit',
  theme: { brandColor: merchants.bauhaus.brandColor, brandColor2: merchants.bauhaus.brandColor2, icon: 'fa-hammer' },
  primaryMetric: { label: 'Monthly payment', value: m(305), sentiment: 'negative' },
  secondaryMetrics: [
    { label: 'Remaining debt', value: m(2326) },
    { label: 'Original purchase', value: m(3490) },
  ],
  accounts: [
    {
      id: 'a-bauhaus-john',
      type: 'invoiceAccount',
      origin: 'flexibleInvoice',
      status: 'active',
      name: 'Garden furniture set · part payment',
      number: '8311-22 500 1234',
      ocr: '4500 5500 0011 1',
      bankgiro: '5827-9090',
      originalAmount: m(3490),
      remainingBalance: m(2326),
      interestRate: 9.95,
      termMonths: 12,
      monthlyPayment: m(305),
      paymentsMade: 4,
    },
  ],
  purchases: [
    { id: 'tbj1', type: 'purchase', date: d(-120), merchant: 'Bauhaus Malmö', amount: m(3490), accountId: 'a-bauhaus-john', icon: 'fa-tree' },
    { id: 'tbj2', type: 'purchase', date: d(-8), merchant: 'Bauhaus.se', amount: m(249), accountId: 'a-bauhaus-john-2', icon: 'fa-paint-roller' },
  ],
  invoices: [
    { id: 'i-bauhaus-john-nov', accountId: 'a-bauhaus-john', period: 'November 2025', amount: m(305), date: d(-2), due: d(12), ocr: '4500 5500 0011 1', status: 'unpaid', type: 'delbetalning' },
  ],
  paymentRequests: [
    {
      id: 'pr-bauhaus-john-2',
      invoiceId: 'i-bauhaus-john-2',
      accountId: 'a-bauhaus-john-2',
      productId: 'p-bauhaus-john',
      kind: 'faktura',
      title: 'Bauhaus · purchase',
      displayName: 'Bauhaus',
      remainingAmount: m(249),
      originalAmount: m(249),
      dueDate: d(-15),
      paidDate: d(-12),
      status: 'paid',
      ocr: '4500 5500 0011 2',
      bankgiro: '5827-9090',
    },
    {
      id: 'pr-bauhaus-john-nov',
      invoiceId: 'i-bauhaus-john-nov',
      accountId: 'a-bauhaus-john',
      productId: 'p-bauhaus-john',
      kind: 'delbetalning',
      title: 'Bauhaus · part payment',
      displayName: 'Bauhaus',
      description: 'This invoice relates to your garden furniture set, purchased at Bauhaus in July 2025.',
      loanAmount: m(3490),
      loanRemaining: m(2326),
      remainingAmount: m(305),
      originalAmount: m(305),
      dueDate: d(12),
      status: 'unpaid',
      ocr: '4500 5500 0011 1',
      bankgiro: '5827-9090',
      paymentNo: 5,
      paymentsTotal: 12,
      remainingBalance: m(2326),
      originalDebt: m(3490),
      interestRate: 9.95,
      principal: m(286),
      interestPart: m(19),
    },
  ],
  offers: [
    { type: 'benefit', icon: 'fa-truck', title: 'Free delivery on orders over 500 kr', desc: 'For Resurs Bauhaus card holders' },
    { type: 'action', icon: 'fa-plus-circle', title: 'New purchase with 0% for 3 months', desc: 'Interest-free on your next Bauhaus purchase' },
  ],
};

// ---------- MERCHANT: ÅHLÉNS (store credit revolving) ----------
const ahlens: Product = {
  id: 'p-ahlens-john',
  name: 'Åhléns',
  origin: 'merchant',
  merchantId: 'ahlens',
  type: 'credit',
  theme: { brandColor: merchants.ahlens.brandColor, brandColor2: merchants.ahlens.brandColor2, icon: 'fa-bag-shopping' },
  primaryMetric: { label: 'Available credit', value: m(27650), sentiment: 'positive' },
  secondaryMetrics: [
    { label: 'Credit limit', value: m(30000) },
    { label: 'Available credit', value: m(27650) },
  ],
  accounts: [
    {
      id: 'a-ahlens-john',
      type: 'creditAccount',
      storeCredit: true,
      name: 'Åhléns store credit',
      number: '8190-22 200 4411',
      ocr: '4488 2200 0044 1',
      bankgiro: '5827-2233',
      creditLimit: m(30000),
      usedCredit: m(0),
      availableCredit: m(30000),
    },
  ],
  purchases: [
    { id: 'taj1', type: 'purchase', date: d(-3), merchant: 'Åhléns City', amount: m(899), accountId: 'a-ahlens-john', icon: 'fa-shirt' },
    { id: 'taj2', type: 'purchase', date: d(-17), merchant: 'Åhléns.com', amount: m(1451), accountId: 'a-ahlens-john', icon: 'fa-couch' },
    { id: 'taj3', type: 'purchase', date: d(-24), merchant: 'Åhléns City', amount: m(349), accountId: 'a-ahlens-john', icon: 'fa-mug-hot' },
    { id: 'taj4', type: 'purchase', date: d(-38), merchant: 'Åhléns.com', amount: m(629), accountId: 'a-ahlens-john', icon: 'fa-shirt' },
    { id: 'taj5', type: 'purchase', date: d(-52), merchant: 'Åhléns City', amount: m(1199), accountId: 'a-ahlens-john', icon: 'fa-blender' },
  ],
  invoices: [
    { id: 'i-ahlens-john-nov', accountId: 'a-ahlens-john', period: 'November 2025', amount: m(480), date: d(-1), due: d(14), ocr: '4488 2200 0044 1', status: 'unpaid', type: 'kontoavi' },
  ],
  paymentRequests: [
    {
      id: 'pr-ahlens-john-nov',
      invoiceId: 'i-ahlens-john-nov',
      accountId: 'a-ahlens-john',
      productId: 'p-ahlens-john',
      kind: 'kontoavi',
      title: 'Account invoice · Åhléns',
      description: 'This invoice relates to your recent purchases at Åhléns.',
      purchase: {
        store: 'Åhléns',
        items: [
          { name: 'Winter jacket — Åhléns City', qty: 1, price: m(899) },
          { name: 'Cushion set, 4 pcs — Åhléns.com', qty: 1, price: m(1451) },
        ],
      },
      remainingAmount: m(2350),
      originalAmount: m(2350),
      dueDate: d(14),
      status: 'unpaid',
      ocr: '4488 2200 0044 1',
      bankgiro: '5827-2233',
    },
  ],
  offers: [
    { type: 'benefit', icon: 'fa-percent', title: 'Interest-free 60 days', desc: 'On every purchase at Åhléns with this account' },
    { type: 'offer', icon: 'fa-tag', title: 'Winter sale — extra 10%', desc: 'For card holders · valid until Dec 31' },
  ],
};

// ---------- DIRECT: GEKÅS (general-purpose Mastercard — revolving credit) ----------
// John-only. Behaves like Resurs Gold: a standalone revolving credit account
// usable everywhere (NOT a store-credit / OTC account). Carries an additive
// Bonus checks section tied to partner Gekås.
// FLAG: display name "Gekås" is a placeholder — could become "Gekås
// Mastercard" or "Resurs Gold".
const gekasCredit: Product = {
  id: 'p-gekas-credit-john',
  name: 'Gekås', // FLAG: unconfirmed display name
  origin: 'direct',
  type: 'credit',
  devStates: ['Q3'],
  theme: { brandColor: '#0C5D57', brandColor2: '#3B817A', icon: 'fa-credit-card' },
  partnerLogo: gekasLogo, // partner-branded round logo on the wallet card
  primaryMetric: { label: 'Available credit', value: m(22550), sentiment: 'positive' },
  secondaryMetrics: [
    { label: 'Credit limit', value: m(30000) },
    { label: 'Available credit', value: m(22550) },
  ],
  accounts: [
    {
      id: 'a-gekas-credit-john',
      type: 'creditAccount',
      subtype: 'kort2000',
      name: 'Gekås', // FLAG: unconfirmed display name
      number: '8602-31 904 5512',
      ocr: '4490 6612 0044',
      bankgiro: '5921-3380',
      creditLimit: m(30000),
      usedCredit: m(7450),
      availableCredit: m(22550),
      // Cards section data — John's cardholder name + masked number.
      cards: [{ holder: 'John Andersson', last4: '4471', exp: '09/29', maskedNumber: '5412 •••• •••• 4471', main: true }],
      // Partner-logo for the active bonus-check card.
      partnerLogo: gekasLogo,
      // Additive Bonus checks section (partner: Gekås). Every check has a
      // distinct amount, date and reference number.
      bonusChecks: {
        active: [
          { id: 'bc-a1', amount: m(100), expires: '2026-09-30', reference: '5325 5435 4545 1001' },
          { id: 'bc-a2', amount: m(250), expires: '2026-11-14', reference: '8841 2093 7766 3120' },
          { id: 'bc-a3', amount: m(500), expires: '2027-02-28', reference: '1190 6647 2231 0508' },
        ],
        used: [
          { id: 'bc-u1', amount: m(100), used: '2025-12-18', reference: '7012 3398 1180 4420' },
          { id: 'bc-u2', amount: m(75), used: '2025-11-03', reference: '2204 9981 5567 0033' },
        ],
      },
    },
  ],
  purchases: [
    { id: 'tgk1', type: 'purchase', date: d(-2), merchant: 'Gekås Ullared', amount: m(1245), accountId: 'a-gekas-credit-john', icon: 'fa-basket-shopping' },
    { id: 'tgk2', type: 'purchase', date: d(-6), merchant: 'ICA Maxi', amount: m(742), accountId: 'a-gekas-credit-john', icon: 'fa-basket-shopping' },
    { id: 'tgk3', type: 'purchase', date: d(-13), merchant: 'Circle K', amount: m(560), accountId: 'a-gekas-credit-john', icon: 'fa-gas-pump' },
    { id: 'tgk4', type: 'purchase', date: d(-19), merchant: 'Willys', amount: m(688), accountId: 'a-gekas-credit-john', icon: 'fa-basket-shopping' },
    { id: 'tgk5', type: 'purchase', date: d(-26), merchant: 'Clas Ohlson', amount: m(459), accountId: 'a-gekas-credit-john', icon: 'fa-screwdriver-wrench' },
  ],
  invoices: [
    { id: 'i-gekascr-nov', accountId: 'a-gekas-credit-john', period: 'November 2025', amount: m(1290), date: d(-1), due: d(12), ocr: '4490 6612 0044 3', status: 'unpaid', type: 'manadsavi' },
    { id: 'i-gekascr-oct', accountId: 'a-gekas-credit-john', period: 'October 2025', amount: m(980), date: d(-31), due: d(-21), ocr: '4490 6612 0044 2', status: 'paid', type: 'manadsavi' },
  ],
  paymentRequests: [
    {
      id: 'pr-gekascr-nov',
      invoiceId: 'i-gekascr-nov',
      accountId: 'a-gekas-credit-john',
      productId: 'p-gekas-credit-john',
      kind: 'manadsavi',
      title: 'Monthly invoice · Gekås',
      displayName: 'Gekås',
      description: "This invoice relates to last month's purchases with your Gekås card.",
      statementBreakdown: [{ label: 'Purchases · October', amount: 1290 }],
      remainingAmount: m(1290),
      originalAmount: m(1290),
      dueDate: d(12),
      status: 'unpaid',
      ocr: '4490 6612 0044 3',
      bankgiro: '5921-3380',
    },
  ],
  offers: [{ type: 'benefit', icon: 'fa-tag', title: 'Bonus checks from Gekås', desc: 'Earn bonus checks to use on your next purchase' }],
};

// ── Clone Resurs Family → p-family-v2 (editable copy) ──────────────
const cloneFamilyV2 = (orig: Product): Product => {
  const clone = JSON.parse(JSON.stringify(orig)) as Product;
  clone.id = 'p-family-v2';
  clone.name = 'Resurs Family v2';
  // Remap all internal IDs to avoid collisions
  const remap = (s: string) => s + '-v2';
  clone.accounts.forEach((a) => {
    a.id = remap(a.id);
  });
  clone.purchases.forEach((t) => {
    t.id = remap(t.id);
    if (t.accountId) t.accountId = remap(t.accountId);
  });
  clone.invoices.forEach((inv) => {
    inv.id = remap(inv.id);
    inv.accountId = remap(inv.accountId);
  });
  clone.paymentRequests.forEach((pr) => {
    pr.id = remap(pr.id);
    if (pr.invoiceId) pr.invoiceId = remap(pr.invoiceId);
    if (pr.accountId) pr.accountId = remap(pr.accountId);
    pr.productId = 'p-family-v2';
  });
  clone.familyMembers?.forEach((fm) => {
    fm.id = remap(fm.id);
  });
  // Card ids inside accounts are user refs — kept as-is.
  return clone;
};

// Final product order matches the design after all pushes + the v2 splice:
// family, family-v2, gold, netonnet, bauhaus, ahlens, gekås credit,
// deposit factory, loan factory.
const products: Product[] = [
  family,
  cloneFamilyV2(family),
  gold,
  netonnet,
  bauhaus,
  ahlens,
  gekasCredit,
  makeDeposit('john', { includeFixed: true, flexBalance: 0, fixedBalance: 100000, autoSave: true }),
  makeLoan('john'),
];

export const john: Persona = {
  id: 'john',
  name: 'John Andersson',
  avatar: 'JA',
  products,
  profile: {
    legalName: 'John Erik Andersson',
    address: ['Storgatan 12', '211 24 Malmö', 'Sverige'],
    customerId: '32423432',
    preferredName: 'John',
    email: 'john.andersson@gmail.com',
    phone: '+46 70 781 22 34',
  },
  documents: makeDocuments().sort(byNewest),
  messages: makeMessages('John').sort(byNewest),
};
