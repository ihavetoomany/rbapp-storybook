// src/data/personas/alex.ts — PERSONA: Alex — 3 credit products, 2 to pay, 0 handled.
// Ported 1:1 from the design prototype's data.js.

import { d, m } from '../format';
import { RY_MERCHANTS as merchants } from '../merchants';
import type { Persona } from '../types';
import { byNewest, makeDocuments, makeMessages, themes } from './shared';

export const alex: Persona = {
  id: 'alex',
  name: 'Alex Bergman',
  avatar: 'AB',
  products: [
    {
      id: 'p-gold-alex',
      name: 'Resurs Gold',
      origin: 'direct',
      type: 'credit',
      theme: themes.family,
      primaryMetric: { label: 'Available credit', value: m(31500), sentiment: 'positive' },
      secondaryMetrics: [
        { label: 'Credit limit', value: m(40000) },
        { label: 'Used credit', value: m(8500) },
      ],
      accounts: [
        {
          id: 'a-gold-alex',
          type: 'creditAccount',
          subtype: 'kort2000',
          name: 'Resurs Gold',
          number: '8421-22 900 1122',
          ocr: '9100 1122 0001',
          bankgiro: '5827-9090',
          creditLimit: m(40000),
          usedCredit: m(8500),
          availableCredit: m(31500),
          hidden: true,
        },
      ],
      purchases: [
        { id: 'ax-t1', type: 'purchase', date: d(-4), merchant: 'ICA Maxi', amount: m(890), accountId: 'a-gold-alex', icon: 'fa-basket-shopping' },
        { id: 'ax-t2', type: 'purchase', date: d(-11), merchant: 'Elgiganten', amount: m(2499), accountId: 'a-gold-alex', icon: 'fa-laptop' },
      ],
      invoices: [
        { id: 'i-gold-alex-1', accountId: 'a-gold-alex', period: 'November 2025', amount: m(2150), date: d(-3), due: d(5), ocr: '9100 1122 0001', status: 'unpaid', type: 'manadsavi' },
      ],
      paymentRequests: [
        {
          id: 'pr-gold-alex-1',
          kind: 'manadsavi',
          displayName: 'Resurs Gold',
          title: 'Monthly invoice · Resurs Gold',
          description: 'Monthly statement for Resurs Gold credit account.',
          remainingAmount: m(2150),
          originalAmount: m(2150),
          dueDate: d(5),
          status: 'unpaid',
          ocr: '9100 1122 0001',
          bankgiro: '5827-9090',
        },
      ],
      offers: [],
    },
    {
      id: 'p-gekas-alex',
      name: 'Gekås',
      origin: 'merchant',
      merchantId: 'gekas',
      type: 'invoice',
      theme: { brandColor: merchants.gekas.brandColor, brandColor2: merchants.gekas.brandColor2, icon: 'fa-bag-shopping' },
      primaryMetric: { label: 'Available credit', value: m(22550), sentiment: 'positive' },
      secondaryMetrics: [{ label: 'Credit limit', value: m(30000) }],
      accounts: [
        {
          id: 'a-gekas-alex',
          type: 'creditAccount',
          subtype: 'kort2000',
          name: 'Gekås account',
          number: '8311-22 700 3344',
          creditLimit: m(30000),
          usedCredit: m(7450),
          availableCredit: m(22550),
          hidden: true,
        },
      ],
      purchases: [
        { id: 'ax-g1', type: 'purchase', date: d(-8), merchant: 'Gekås Ullared', amount: m(3290), accountId: 'a-gekas-alex', icon: 'fa-bag-shopping' },
      ],
      invoices: [
        { id: 'i-gekas-alex-1', accountId: 'a-gekas-alex', period: 'November 2025', amount: m(3290), date: d(-5), due: d(12), ocr: '7700 3344 0001', status: 'unpaid', type: 'faktura' },
      ],
      paymentRequests: [
        {
          id: 'pr-gekas-alex-1',
          kind: 'faktura',
          displayName: 'Gekås',
          title: 'Invoice · Gekås',
          description: 'Invoice for your Gekås purchase.',
          remainingAmount: m(3290),
          originalAmount: m(3290),
          dueDate: d(12),
          status: 'unpaid',
          ocr: '7700 3344 0001',
          bankgiro: '5827-9090',
        },
      ],
      offers: [{ type: 'benefit', icon: 'fa-truck', title: 'Free delivery on orders over 500 kr', desc: 'For Resurs Gekås card holders' }],
    },
    {
      id: 'p-ahlens-alex',
      name: 'Åhléns',
      origin: 'merchant',
      merchantId: 'ahlens',
      type: 'invoice',
      theme: { brandColor: merchants.ahlens.brandColor, brandColor2: merchants.ahlens.brandColor2, icon: 'fa-shirt' },
      primaryMetric: { label: 'Available credit', value: m(15000), sentiment: 'positive' },
      secondaryMetrics: [{ label: 'Credit limit', value: m(15000) }],
      accounts: [
        {
          id: 'a-ahlens-alex',
          type: 'creditAccount',
          subtype: 'kort2000',
          name: 'Åhléns account',
          number: '8311-22 800 5566',
          creditLimit: m(15000),
          usedCredit: m(0),
          availableCredit: m(15000),
          hidden: true,
        },
      ],
      purchases: [],
      invoices: [],
      paymentRequests: [],
      offers: [],
    },
  ],
  profile: {
    legalName: 'Alex Erik Bergman',
    address: ['Birger Jarlsgatan 54', '114 29 Stockholm', 'Sverige'],
    customerId: '82334567',
    preferredName: 'Alex',
    email: 'alex.bergman@gmail.com',
    phone: '+46 70 223 78 45',
  },
  documents: makeDocuments().sort(byNewest),
  messages: makeMessages('Alex').sort(byNewest),
};
