// src/data/personas/bill.ts — PERSONA: Bill — savings only.
// Ported 1:1 from the design prototype's data.js (empty product list +
// the standard deposit factory product).

import type { Persona } from '../types';
import { byNewest, makeDeposit, makeDocuments, makeMessages } from './shared';

export const bill: Persona = {
  id: 'bill',
  name: 'Bill Karlsson',
  avatar: 'BK',
  products: [makeDeposit('bill', { includeFixed: true, flexBalance: 52000, fixedBalance: 200000 })],
  profile: {
    legalName: 'Bill Gustav Karlsson',
    address: ['Kungsgatan 48', '411 15 Göteborg', 'Sverige'],
    customerId: '19580712',
    preferredName: 'Bill',
    email: 'bill.karlsson@telia.com',
    phone: '+46 73 442 90 11',
  },
  documents: makeDocuments().sort(byNewest),
  messages: makeMessages('Bill').sort(byNewest),
};
