// src/features/payment — the RevolvingCreditPaySheet payment flow.
// Mounted in app/_layout.tsx (SHELL agent) via PaySheetProvider; screens open
// the sheet with usePaySheet().open(pr).

export { configFor, type PayConfig, type PlanStop, type PlanStopId } from './configFor';
export { ConfirmScreenFixed, resolveProductName } from './ConfirmScreenFixed';
export { PaymentDial, type PaymentDialProps } from './PaymentDial';
export { PaymentScreen, type PaymentScreenProps } from './PaymentScreen';
export {
  PaySheetProvider,
  RevolvingCreditPaySheet,
  usePaySheet,
  type RevolvingCreditPaySheetProps,
} from './PaySheetProvider';
export { PPIPromoBox } from './PPIPromoBox';
export { SuccessScreen, type SuccessScreenProps } from './SuccessScreen';
