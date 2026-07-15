// src/data/index.ts — demo-data layer barrel.
// Ported from the design prototype's data.js + account-spec.js
// (window.RY_PERSONAS / RY_MERCHANTS / RY_TODAY / rfmt / RY_ACCOUNT_SPEC / RY_NOTIF).

export * from './types';
export * from './format';
export * from './merchants';
export * from './accountSpec';
export {
  RY_PERSONAS,
  RY_NOTIF,
  john,
  bill,
  kim,
  eva,
  maja,
  alex,
  lena,
  themes,
  makeDeposit,
  makeLoan,
  makeDocuments,
  makeMessages,
  byNewest,
} from './personas';
export type { MakeDepositOpts } from './personas';
