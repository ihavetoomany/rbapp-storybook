// src/data/personas/lena.ts — PERSONA: Lena — 2 products, 0 to pay, 2 handled.
// Ported 1:1 from the design prototype's data.js.

import { d, m } from '../format';
import { RY_MERCHANTS as merchants } from '../merchants';
import type { Persona } from '../types';
import { byNewest, makeDocuments, makeMessages, themes } from './shared';

export const lena: Persona = {
  id: 'lena',
  name: 'Lena Sjöberg',
  avatar: 'LS',
  products: [
    {
      id: 'p-family-lena',
      name: 'Resurs Family',
      origin: 'direct',
      type: 'credit',
      theme: themes.family,
      primaryMetric: { label: 'Available credit', value: m(54200), sentiment: 'positive' },
      secondaryMetrics: [
        { label: 'Credit limit', value: m(60000) },
        { label: 'Used credit', value: m(5800) },
      ],
      accounts: [
        {
          id: 'a-family-lena',
          type: 'creditAccount',
          subtype: 'superkonto',
          name: 'Superkonto',
          number: '8421-22 111 9988',
          ocr: '4500 9988 0001',
          bankgiro: '5827-9090',
          creditLimit: m(60000),
          usedCredit: m(5800),
          availableCredit: m(54200),
          hidden: true,
        },
      ],
      purchases: [
        { id: 'ln-t1', type: 'purchase', date: d(-20), merchant: 'Hemköp', amount: m(512), accountId: 'a-family-lena', icon: 'fa-basket-shopping' },
        { id: 'ln-t2', type: 'purchase', date: d(-28), merchant: 'Apotek Hjärtat', amount: m(289), accountId: 'a-family-lena', icon: 'fa-prescription-bottle' },
      ],
      invoices: [
        { id: 'i-fam-lena-oct', accountId: 'a-family-lena', period: 'October 2025', amount: m(980), date: d(-32), due: d(-22), ocr: '4500 9988 0001', status: 'paid', type: 'manadsavi' },
      ],
      paymentRequests: [
        {
          id: 'pr-fam-lena-oct',
          kind: 'manadsavi',
          displayName: 'Resurs Family',
          title: 'Monthly invoice · Superkonto',
          description: 'Monthly statement for Resurs Family Superkonto.',
          remainingAmount: m(980),
          originalAmount: m(980),
          dueDate: d(-22),
          paidDate: d(-20),
          status: 'paid',
          ocr: '4500 9988 0001',
          bankgiro: '5827-9090',
        },
      ],
      offers: [{ type: 'benefit', icon: 'fa-shield-halved', title: 'Free purchase insurance', desc: 'On every card purchase, up to 30 000 SEK' }],
    },
    {
      id: 'p-netonnet-lena',
      name: 'NetOnNet',
      origin: 'merchant',
      merchantId: 'netonnet',
      type: 'invoice',
      theme: { brandColor: merchants.netonnet.brandColor, brandColor2: merchants.netonnet.brandColor2, icon: 'fa-tv' },
      primaryMetric: { label: 'Available credit', value: m(25000), sentiment: 'positive' },
      secondaryMetrics: [{ label: 'Credit limit', value: m(25000) }],
      accounts: [
        {
          id: 'a-netonnet-lena',
          type: 'creditAccount',
          subtype: 'kort2000',
          name: 'NetOnNet account',
          number: '8311-22 500 7711',
          creditLimit: m(25000),
          usedCredit: m(0),
          availableCredit: m(25000),
          hidden: true,
        },
      ],
      purchases: [
        { id: 'ln-n1', type: 'purchase', date: d(-40), merchant: 'NetOnNet.se', amount: m(1899), accountId: 'a-netonnet-lena', icon: 'fa-tv' },
      ],
      invoices: [
        { id: 'i-non-lena-oct', accountId: 'a-netonnet-lena', period: 'October 2025', amount: m(1899), date: d(-35), due: d(-25), ocr: '5500 7711 0001', status: 'paid', type: 'faktura' },
      ],
      paymentRequests: [
        {
          id: 'pr-non-lena-oct',
          kind: 'faktura',
          displayName: 'NetOnNet',
          title: 'Invoice · NetOnNet',
          description: 'Invoice for your NetOnNet purchase.',
          remainingAmount: m(1899),
          originalAmount: m(1899),
          dueDate: d(-25),
          paidDate: d(-23),
          status: 'paid',
          ocr: '5500 7711 0001',
          bankgiro: '5827-9090',
        },
      ],
      offers: [],
    },
  ],
  profile: {
    legalName: 'Lena Kristina Sjöberg',
    address: ['Östra Hamngatan 11', '411 10 Göteborg', 'Sverige'],
    customerId: '93445678',
    preferredName: 'Lena',
    email: 'lena.sjoberg@gmail.com',
    phone: '+46 73 661 24 90',
  },
  documents: makeDocuments().sort(byNewest),
  messages: makeMessages('Lena').sort(byNewest),
};
