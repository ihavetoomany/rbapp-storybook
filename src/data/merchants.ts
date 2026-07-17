// src/data/merchants.ts — RY_MERCHANTS, ported 1:1 from the design's data.js.

import { m } from './format';
import type { Merchant, MerchantId } from './types';

export const RY_MERCHANTS: Record<MerchantId, Merchant> = {
  bauhaus: {
    id: 'bauhaus',
    name: 'Bauhaus',
    brandColor: '#E2231A',
    brandColor2: '#FFD500',
    iconLetter: 'B',
    paymentPlanConfigs: [
      { months: 3, interestRate: 0, fee: m(0) },
      { months: 6, interestRate: 0, fee: m(35) },
      { months: 12, interestRate: 9.95, fee: m(45) },
      { months: 24, interestRate: 14.9, fee: m(45) },
    ],
  },
  netonnet: {
    id: 'netonnet',
    name: 'NetOnNet',
    brandColor: '#0050A0',
    brandColor2: '#FFCC00',
    iconLetter: 'N',
    paymentPlanConfigs: [
      { months: 6, interestRate: 0, fee: m(0) },
      { months: 12, interestRate: 0, fee: m(35) },
      { months: 24, interestRate: 14.9, fee: m(45) },
    ],
  },
  jula: {
    id: 'jula',
    name: 'Jula',
    brandColor: '#0052A0',
    brandColor2: '#F0B500',
    iconLetter: 'J',
    paymentPlanConfigs: [
      { months: 3, interestRate: 0, fee: m(0) },
      { months: 6, interestRate: 0, fee: m(35) },
      { months: 12, interestRate: 9.95, fee: m(45) },
    ],
  },
  ahlens: {
    id: 'ahlens',
    name: 'Åhléns',
    brandColor: '#E8002D',
    brandColor2: '#F5A623',
    iconLetter: 'Å',
    paymentPlanConfigs: [
      { months: 3, interestRate: 0, fee: m(0) },
      { months: 6, interestRate: 0, fee: m(35) },
      { months: 12, interestRate: 9.95, fee: m(45) },
    ],
  },
  gekas: {
    id: 'gekas',
    name: 'Gekås',
    brandColor: '#D40000',
    brandColor2: '#FFDD00',
    iconLetter: 'G',
    paymentPlanConfigs: [
      { months: 3, interestRate: 0, fee: m(0) },
      { months: 6, interestRate: 0, fee: m(35) },
      { months: 12, interestRate: 9.95, fee: m(45) },
      { months: 24, interestRate: 14.9, fee: m(45) },
    ],
  },
};
