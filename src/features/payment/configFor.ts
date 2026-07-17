// configFor — derive dial + confirm config from the tapped payment request.
// Port of design-reference/revolving-credit-pay.jsx configFor(pr):
//   · laneavi / delbetalning (fixed installment) → confirm-first flow
//   · faktura (one-time invoice)                 → payment-plan dial
//   · manadsavi / anything else                  → continuous revolving dial
//
// Plan-stop labels are i18n keys (the design hardcoded English labels).

import type { PaymentRequest } from '@/src/data';

export type PlanStopId = 'min' | 'm12' | 'm6' | 'm3' | 'full';

export type PlanStop = {
  id: PlanStopId;
  value: number;
  /** i18n key — 'Minimum' / '12 months' / '6 months' / '3 months' / 'Full amount'. */
  labelKey: string;
};

export type PayConfig = {
  isFixed: boolean;
  isPlan: boolean;
  /** Account/statement balance (dial max + breakdown for fixed types). */
  balance: number;
  topCredit: number;
  dialMax: number;
  minimum: number;
  defaultAmount: number;
  interestRatePct: number;
  /** Fixed installment amount (laneavi / delbetalning only). */
  fixedAmount?: number;
  /** Explicit principal / interest (laneavi only — delbetalning derives these). */
  knownPrincipal?: number | null;
  knownInterest?: number | null;
  /** Full invoice amount (faktura plan mode only). */
  full?: number;
  planStops?: PlanStop[];
  /** Derived by the sheet: balance × rate ÷ 12 (design's interestPortion). */
  interestPortion?: number;
};

export function configFor(pr: PaymentRequest | null | undefined): PayConfig {
  // ── Fixed installment types ──────────────────────────────────────────
  // laneavi  = loan installment   (amount pre-agreed, explicit principal/interest)
  // delbetalning = part-payment   (amount pre-agreed, derived breakdown)
  // Flow: confirm first → dial second (via Change button).
  if (pr && (pr.kind === 'laneavi' || pr.kind === 'delbetalning') && pr.remainingAmount) {
    const fixed = Math.round(pr.remainingAmount.amount);
    const remaining =
      pr.remainingBalance && pr.remainingBalance.amount != null
        ? Math.round(pr.remainingBalance.amount)
        : fixed * Math.max(1, (pr.paymentsTotal || 1) - (pr.paymentNo || 0));
    const minimum = Math.max(50, Math.round(fixed * 0.1));
    return {
      isFixed: true,
      isPlan: false,
      fixedAmount: fixed,
      balance: remaining, // account remaining balance (dial max + breakdown)
      topCredit: remaining,
      dialMax: remaining,
      minimum,
      defaultAmount: fixed,
      interestRatePct: pr.interestRate || 0,
      knownPrincipal: pr.principal ? Math.round(pr.principal.amount) : null,
      knownInterest: pr.interestPart ? Math.round(pr.interestPart.amount) : null,
    };
  }

  // ── Invoice type: faktura — payment plan dial ────────────────────────
  if (pr && pr.kind === 'faktura' && pr.remainingAmount) {
    const full = Math.max(300, Math.round(pr.remainingAmount.amount));
    const v3 = Math.round(full / 3);
    const v6 = Math.round(full / 6);
    const v12 = Math.round(full / 12);
    let vmin = Math.max(50, Math.round(full * 0.05));
    if (vmin >= v12) vmin = Math.max(20, v12 - Math.max(10, Math.round(v12 * 0.3)));
    const planStops: PlanStop[] = [
      { id: 'min', value: vmin, labelKey: 'rc.stop.min' },
      { id: 'm12', value: v12, labelKey: 'rc.stop.m12' },
      { id: 'm6', value: v6, labelKey: 'rc.stop.m6' },
      { id: 'm3', value: v3, labelKey: 'rc.stop.m3' },
      { id: 'full', value: full, labelKey: 'rc.stop.full' },
    ];
    return {
      isPlan: true,
      isFixed: false,
      full,
      planStops,
      balance: full,
      topCredit: full,
      dialMax: full,
      minimum: vmin,
      defaultAmount: full,
      interestRatePct: 22,
    };
  }

  // ── Revolving credit / statement (manadsavi) — continuous dial ───────
  const fallback: PayConfig = {
    isPlan: false,
    isFixed: false,
    balance: 12480,
    topCredit: 14200,
    dialMax: 14200,
    minimum: 520,
    defaultAmount: 4368,
    interestRatePct: 22,
  };
  if (!pr || !pr.remainingAmount) return fallback;
  const balance = Math.max(800, Math.round(pr.remainingAmount.amount));
  const minimum = Math.max(200, Math.round((balance * 0.04) / 10) * 10);
  const topCredit = Math.round((balance * 1.14) / 10) * 10;
  return {
    isPlan: false,
    isFixed: false,
    balance,
    topCredit,
    dialMax: topCredit,
    minimum,
    defaultAmount: Math.round(balance * 0.35),
    interestRatePct: 22,
  };
}
