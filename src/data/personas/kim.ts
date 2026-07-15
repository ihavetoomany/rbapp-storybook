// src/data/personas/kim.ts — PERSONA: Kim — loan only.
// Ported 1:1 from the design prototype's data.js (empty product list +
// the standard loan factory product).

import type { Persona } from '../types';
import { byNewest, makeDocuments, makeLoan, makeMessages } from './shared';

export const kim: Persona = {
  id: 'kim',
  name: 'Kim Lindberg',
  avatar: 'KL',
  products: [makeLoan('kim')],
  profile: {
    legalName: 'Kim Alexander Lindberg',
    address: ['Sveavägen 102', '113 50 Stockholm', 'Sverige'],
    customerId: '47119083',
    preferredName: 'Kim',
    email: 'kim.lindberg@outlook.com',
    phone: '+46 76 220 41 87',
  },
  documents: makeDocuments().sort(byNewest),
  messages: makeMessages('Kim').sort(byNewest),
};
