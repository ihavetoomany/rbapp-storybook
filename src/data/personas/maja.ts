// src/data/personas/maja.ts — PERSONA: Maja — Bauhaus, no invoices, 2 purchases.
// Ported 1:1 from the design prototype's data.js.

import { d, m } from '../format';
import { RY_MERCHANTS as merchants } from '../merchants';
import type { Persona } from '../types';
import { byNewest, makeDocuments, makeMessages } from './shared';

export const maja: Persona = {
  id: 'maja',
  name: 'Maja Lund',
  avatar: 'ML',
  products: [
    {
      id: 'p-bauhaus-maja',
      name: 'Bauhaus',
      origin: 'merchant',
      merchantId: 'bauhaus',
      type: 'invoice',
      theme: { brandColor: merchants.bauhaus.brandColor, brandColor2: merchants.bauhaus.brandColor2, icon: 'fa-hammer' },
      primaryMetric: { label: 'No outstanding invoices', value: m(0), sentiment: 'positive' },
      secondaryMetrics: [{ label: 'Latest purchase', value: m(1290) }],
      accounts: [
        {
          id: 'a-bauhaus-maja',
          type: 'creditAccount',
          subtype: 'kort2000',
          name: 'Bauhaus account',
          number: '8311-22 600 9900',
          creditLimit: m(20000),
          usedCredit: m(0),
          availableCredit: m(20000),
          hidden: true,
        },
      ],
      purchases: [
        { id: 'maja-bh1', type: 'purchase', date: d(-7), merchant: 'Bauhaus Göteborg', amount: m(1290), accountId: 'a-bauhaus-maja', icon: 'fa-screwdriver-wrench' },
        { id: 'maja-bh2', type: 'purchase', date: d(-14), merchant: 'Bauhaus.se', amount: m(600), accountId: 'a-bauhaus-maja', icon: 'fa-paint-roller' },
      ],
      invoices: [],
      paymentRequests: [],
      offers: [
        { type: 'action', icon: 'fa-clock', title: 'Convert to part payment', desc: 'Split a purchase over 3–24 months' },
        { type: 'benefit', icon: 'fa-truck', title: 'Free delivery on orders over 500 kr', desc: 'For Resurs Bauhaus card holders' },
      ],
    },
  ],
  profile: {
    legalName: 'Maja Sofia Lund',
    address: ['Vasagatan 21', '411 24 Göteborg', 'Sverige'],
    customerId: '71223456',
    preferredName: 'Maja',
    email: 'maja.lund@gmail.com',
    phone: '+46 70 884 51 09',
  },
  documents: makeDocuments().sort(byNewest),
  messages: makeMessages('Maja').sort(byNewest),
};
