// PaySheetProvider — RevolvingCreditPaySheet overlay + usePaySheet() hook.
// Port of the overlay shell in design-reference/revolving-credit-pay.jsx:
// a full-screen slide-up card (`.ry-rcsheet*`, 400ms cubic-bezier(.32,.72,0,1))
// over a dimmed scrim (tap = close), kept mounted through the slide-down.
//
// Flow per payment-request kind (configFor):
//   laneavi / delbetalning → opens on ConfirmScreenFixed ("Change" → dial)
//   faktura                → payment-plan dial → confirm
//   manadsavi / other      → continuous revolving dial → confirm
//
// Contract: usePaySheet(): { open(pr: PaymentRequest): void }. Reads
// confirmPayVariant from useTweaks() itself; mounted in app/_layout.tsx by
// the SHELL agent.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PaymentRequest } from '@/src/data';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { useTweaks } from '@/src/tweaks/TweaksProvider';

import { configFor } from './configFor';
import { ConfirmScreenFixed, resolveProductName } from './ConfirmScreenFixed';
import {
  DATE_OPTIONS,
  FROM_OPTIONS,
  type DateOptionId,
  type FromOptionId,
} from './constants';
import { PaymentScreen } from './PaymentScreen';
import { SuccessScreen } from './SuccessScreen';

// ─────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────

type PaySheetContextValue = {
  open: (pr: PaymentRequest) => void;
};

const PaySheetContext = createContext<PaySheetContextValue | null>(null);

export function usePaySheet(): PaySheetContextValue {
  const ctx = useContext(PaySheetContext);
  if (!ctx) throw new Error('usePaySheet must be used within a PaySheetProvider');
  return ctx;
}

export function PaySheetProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [pr, setPr] = useState<PaymentRequest | null>(null);
  const [open, setOpen] = useState(false);
  const { tweaks } = useTweaks();

  const openSheet = useCallback((next: PaymentRequest) => {
    setPr(next);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo<PaySheetContextValue>(() => ({ open: openSheet }), [openSheet]);

  return (
    <PaySheetContext.Provider value={value}>
      {children}
      <RevolvingCreditPaySheet
        open={open}
        pr={pr}
        onClose={close}
        confirmPayVariant={tweaks.confirmPayVariant}
      />
    </PaySheetContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
// Overlay shell — slides up over the whole app (tab bar included).
// ─────────────────────────────────────────────────────────────

type Step = 'pay' | 'confirm' | 'done';

export type RevolvingCreditPaySheetProps = {
  open: boolean;
  pr: PaymentRequest | null;
  onClose: () => void;
  confirmPayVariant?: 'Default' | 'PPI version';
};

export function RevolvingCreditPaySheet({
  open,
  pr,
  onClose,
  confirmPayVariant = 'Default',
}: RevolvingCreditPaySheetProps) {
  const { colors } = useRyTheme();
  const { t, tName } = useT();
  const insets = useSafeAreaInsets();
  const { height: winH } = useWindowDimensions();

  const [mounted, setMounted] = useState(open);
  const progress = useSharedValue(0);

  const config = useMemo(() => configFor(pr), [pr]);
  const interestPortion = Math.round((config.balance * (config.interestRatePct / 100)) / 12);
  const fullConfig = useMemo(
    () => ({ ...config, interestPortion }),
    [config, interestPortion],
  );

  // ── Fixed types open on confirm; all others open on the dial ──
  const [step, setStep] = useState<Step>(() => (config.isFixed ? 'confirm' : 'pay'));
  const [cameFromConfirm, setCameFromConfirm] = useState(false);

  // Lifted from ConfirmScreenFixed so SuccessScreen can read the choices.
  const [fromAccount, setFromAccount] = useState<FromOptionId>(FROM_OPTIONS[0].id);
  const [dateOption, setDateOption] = useState<DateOptionId>('today');
  const dateLabel = t(
    (DATE_OPTIONS.find((d) => d.id === dateOption) ?? DATE_OPTIONS[0]).labelKey,
  );
  const fromLabel = t(
    (FROM_OPTIONS.find((o) => o.id === fromAccount) ?? FROM_OPTIONS[0]).labelKey,
  );
  const productName = resolveProductName(pr, tName, t('rc.fallback_product'));

  const [amount, setAmount] = useState(() =>
    Math.max(config.minimum, Math.min(config.dialMax, config.defaultAmount)),
  );

  // Re-seed whenever a new invoice is opened.
  useEffect(() => {
    if (!open) return;
    const cfg = configFor(pr);
    setStep(cfg.isFixed ? 'confirm' : 'pay');
    setAmount(Math.max(cfg.minimum, Math.min(cfg.dialMax, cfg.defaultAmount)));
    setCameFromConfirm(false);
    setFromAccount(FROM_OPTIONS[0].id);
    setDateOption('today');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, config.isFixed, config.isPlan, config.defaultAmount, config.minimum, config.dialMax]);

  // Mount on open; keep mounted through the slide-down on close.
  // (`.ry-rcsheet` — transform/opacity .4s cubic-bezier(.32,.72,0,1))
  useEffect(() => {
    if (open) {
      setMounted(true);
      progress.value = withTiming(1, {
        duration: 400,
        easing: Easing.bezier(0.32, 0.72, 0, 1),
      });
    } else if (mounted) {
      progress.value = withTiming(
        0,
        { duration: 400, easing: Easing.bezier(0.32, 0.72, 0, 1) },
        (finished) => {
          if (finished) runOnJS(setMounted)(false);
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // The card's top edge tucks under the status bar / dynamic island
  // (design: top 54px in the iPhone frame).
  const topOffset = Math.max(insets.top, 24);
  const sheetHeight = winH - topOffset;

  const scrimStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * sheetHeight }],
  }));

  if (!mounted) return null;

  return (
    <Modal transparent visible statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.root}>
        {/* Scrim — tap to close (`.ry-rcsheet-scrim`) */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, scrimStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        </Animated.View>

        {/* The card (`.ry-rcsheet`) */}
        <Animated.View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            { top: topOffset, backgroundColor: colors.bgDefault },
            sheetStyle,
          ]}>
          {step === 'done' ? (
            <SuccessScreen
              amount={amount}
              onDone={onClose}
              productName={productName}
              fromAccount={fromLabel}
              dateLabel={dateLabel}
            />
          ) : step === 'confirm' ? (
            // ── Full-page confirm — all invoice types ─────────────────────
            <ConfirmScreenFixed
              amount={amount}
              config={fullConfig}
              onClose={onClose}
              variant={confirmPayVariant}
              onChange={() => {
                setCameFromConfirm(true);
                setStep('pay');
              }}
              onBack={
                !config.isFixed
                  ? () => {
                      setCameFromConfirm(true);
                      setStep('pay');
                    }
                  : undefined
              }
              onConfirm={() => setStep('done')}
              pr={pr}
              fromAccount={fromAccount}
              setFromAccount={setFromAccount}
              dateOption={dateOption}
              setDateOption={setDateOption}
            />
          ) : (
            // ── Dial / select amount ──────────────────────────────────────
            <PaymentScreen
              config={fullConfig}
              amount={amount}
              setAmount={setAmount}
              onPay={() => setStep('confirm')}
              onClose={onClose}
              isFixed={config.isFixed}
              onBack={
                config.isFixed || cameFromConfirm ? () => setStep('confirm') : undefined
              }
            />
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrim: {
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    // 0 -10px 44px rgba(0,0,0,0.22)
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 20,
  },
});
