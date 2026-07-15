// src/data/format.ts — "today" reference + money/date formatting helpers.
// Ported from the design prototype (data.js fmtMoney/fmtDate/fmtRelative,
// exported to window as rfmt/rfmtDate/rfmtRel, plus RY_TODAY and the d()
// offset helper).

import type { Money } from './types';

// ---------------------------------------------------------------------------
// "Today" — follows the real current date so the prototype never looks stale.
// ---------------------------------------------------------------------------

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

/**
 * Today at local midnight as a full ISO string. Screens use it in
 * `new Date(RY_TODAY)` arithmetic (same instant as the design's Date value).
 */
export const RY_TODAY: string = TODAY.toISOString();

/** Today at local midnight as a fresh Date instance. */
export function today(): Date {
  return new Date(TODAY);
}

/**
 * Date-offset helper: today + offsetDays as ISO `YYYY-MM-DD`.
 * (Same `toISOString().slice(0, 10)` approach as the design's d() helper.)
 */
export const d = (offsetDays: number): string => {
  const x = new Date(TODAY);
  x.setDate(x.getDate() + offsetDays);
  return x.toISOString().slice(0, 10);
};

// ---------------------------------------------------------------------------
// Money
// ---------------------------------------------------------------------------

/** Money helper: store as integer SEK (no decimals — Resurs rule). */
export const m = (amount: number): Money => ({ amount, currency: 'SEK' });

/**
 * Format money for display: sv-SE digit grouping with REGULAR spaces
 * (e.g. `12 450`), minus sign for negatives, no currency suffix.
 * '%' money renders as e.g. `4,05 %`.
 *
 * Note: grouping is done manually instead of `toLocaleString('sv-SE')` so the
 * output is identical on Hermes/JSC regardless of Intl support, and always
 * uses regular spaces (the design normalised comma-grouping the same way).
 */
export const rfmt = (money?: Money | null): string => {
  if (!money) return '';
  if (money.currency === '%') {
    return String(money.amount).replace('.', ',') + ' %';
  }
  const v = Math.abs(money.amount);
  const s = String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (money.amount < 0 ? '-' : '') + s;
};

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

const MONTHS_SV = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

/** Format an ISO date as e.g. `14 nov`. */
export const rfmtDate = (iso?: string | null): string => {
  if (!iso) return '';
  const x = new Date(iso);
  return `${x.getDate()} ${MONTHS_SV[x.getMonth()]}`;
};

/** Relative date label: Today / Tomorrow / Yesterday / In N days / N days ago / `14 nov`. */
export const rfmtRel = (iso?: string | null): string => {
  if (!iso) return '';
  const x = new Date(iso);
  const now = today();
  const diffMs = x.getTime() - now.getTime();
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  if (days > 1 && days <= 7) return `In ${days} days`;
  if (days < -1 && days >= -7) return `${-days} days ago`;
  return rfmtDate(iso);
};
