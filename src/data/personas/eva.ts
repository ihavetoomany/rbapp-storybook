// src/data/personas/eva.ts — PERSONA: Eva — brand new customer, no products.
// Ported 1:1 from the design prototype's data.js.

import type { Persona } from '../types';
import { byNewest, makeDocuments, makeMessages } from './shared';

export const eva: Persona = {
  id: 'eva',
  name: 'Eva Nyström',
  avatar: 'EN',
  products: [],
  profile: {
    legalName: 'Eva Maria Nyström',
    address: ['Nygatan 7', '903 27 Umeå', 'Sverige'],
    customerId: '60884215',
    preferredName: 'Eva',
    email: 'eva.nystrom@gmail.com',
    phone: '+46 70 559 33 02',
  },
  documents: makeDocuments().sort(byNewest),
  messages: makeMessages('Eva').sort(byNewest),
};
