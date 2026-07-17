// Shared constants + SEK formatter for the payment sheet screens.
// Port of the shared bits at the top of design-reference/revolving-credit-pay.jsx.

import { rfmt } from '@/src/data';

/** From-account options — ids map to i18n keys (design hardcoded the labels). */
export const FROM_OPTIONS = [
  { id: 'nordea', labelKey: 'rc.from.nordea' },
  { id: 'savings', labelKey: 'rc.from.savings' },
] as const;

export type FromOptionId = (typeof FROM_OPTIONS)[number]['id'];

export const DATE_OPTIONS = [
  { id: 'today', labelKey: 'rc.date.today' },
  { id: 'tomorrow', labelKey: 'rc.date.tomorrow' },
  { id: 'due', labelKey: 'rc.date.due' },
  { id: 'other', labelKey: 'rc.date.other' },
] as const;

export type DateOptionId = (typeof DATE_OPTIONS)[number]['id'];

/** Design's formatSEK — sv-SE grouping with regular spaces (rfmt does exactly this). */
export function formatSEK(n: number): string {
  return rfmt({ amount: Math.round(n), currency: 'SEK' });
}
