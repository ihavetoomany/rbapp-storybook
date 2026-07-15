/**
 * TweaksProvider — prototype tweaks context, ported from the design
 * prototype's app.jsx TWEAK_DEFAULTS. Persists via AsyncStorage under
 * the key 'ry-tweaks'.
 *
 * Also hosts usePersona() (persona resolution: familyVersion filter,
 * Q3 devStates filter, autoSaveSeed monthly-deposit seed — app.jsx
 * lines ~482-509) and useStatusOverride() (STATUS_CODE map).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { RY_PERSONAS } from '@/src/data';
import type {
  MonthlyDepositConfig,
  PaymentRequestStatus,
  Persona,
  PersonaId,
} from '@/src/data';

export type Tweaks = {
  persona: 'John' | 'Bill' | 'Kim' | 'Eva' | 'Maja' | 'Alex' | 'Lena';
  invoiceStatus:
    | 'Default'
    | 'Unpaid'
    | 'Overdue'
    | 'Missed'
    | 'Scheduled'
    | 'Partially paid'
    | 'Paid';
  lang: 'English' | 'Svenska';
  darkTheme: boolean;
  familyVersion: 'Current' | "Bjarne's sandbox";
  sandboxActivity:
    | 'Current Activity'
    | 'Wallet Hero · Bjarne'
    | 'invoice card model - Sara'
    | 'Carousel';
  walletLayout: 'Product cards' | 'Large cards' | 'Account Cards';
  familyAppOnly: boolean;
  confirmPayVariant: 'Default' | 'PPI version';
  autoSaveSeed: boolean;
  loginLayout: 'Natt' | 'Dag';
};

export const TWEAK_DEFAULTS: Tweaks = {
  persona: 'John',
  invoiceStatus: 'Default',
  lang: 'English',
  darkTheme: false,
  familyVersion: 'Current',
  sandboxActivity: 'invoice card model - Sara',
  walletLayout: 'Product cards',
  familyAppOnly: false,
  confirmPayVariant: 'Default',
  autoSaveSeed: false,
  loginLayout: 'Natt',
};

const STORAGE_KEY = 'ry-tweaks';

type TweaksContextValue = {
  tweaks: Tweaks;
  setTweak: <K extends keyof Tweaks>(k: K, v: Tweaks[K]) => void;
  reset: () => void;
};

type SessionContextValue = {
  loggedIn: boolean;
  login: () => void;
  logout: () => void;
};

const TweaksContext = createContext<TweaksContextValue | null>(null);
const SessionContext = createContext<SessionContextValue | null>(null);

export function TweaksProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [tweaks, setTweaks] = useState<Tweaks>(TWEAK_DEFAULTS);
  // Matches the design prototype (app.jsx): the app starts logged in; the
  // Skymning login screen is reached via "Log out" / "Back to login".
  const [loggedIn, setLoggedIn] = useState(true);
  const hydrated = useRef(false);

  /* Hydrate persisted tweaks once on mount. */
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as Partial<Tweaks>;
            setTweaks({ ...TWEAK_DEFAULTS, ...parsed });
          } catch {
            /* corrupt payload — fall back to defaults */
          }
        }
        hydrated.current = true;
      })
      .catch(() => {
        hydrated.current = true;
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* Persist on change (after hydration). */
  useEffect(() => {
    if (!hydrated.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tweaks)).catch(() => {
      /* persistence is best-effort in the prototype */
    });
  }, [tweaks]);

  const setTweak = useCallback(<K extends keyof Tweaks>(k: K, v: Tweaks[K]) => {
    setTweaks((prev) => ({ ...prev, [k]: v }));
  }, []);

  const reset = useCallback(() => {
    setTweaks(TWEAK_DEFAULTS);
  }, []);

  const login = useCallback(() => setLoggedIn(true), []);
  const logout = useCallback(() => setLoggedIn(false), []);

  const tweaksValue = useMemo<TweaksContextValue>(
    () => ({ tweaks, setTweak, reset }),
    [tweaks, setTweak, reset],
  );
  const sessionValue = useMemo<SessionContextValue>(
    () => ({ loggedIn, login, logout }),
    [loggedIn, login, logout],
  );

  return (
    <TweaksContext.Provider value={tweaksValue}>
      <SessionContext.Provider value={sessionValue}>{children}</SessionContext.Provider>
    </TweaksContext.Provider>
  );
}

export function useTweaks(): TweaksContextValue {
  const ctx = useContext(TweaksContext);
  if (!ctx) throw new Error('useTweaks must be used within a TweaksProvider');
  return ctx;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within a TweaksProvider');
  return ctx;
}

/* ============================================================
 * Persona resolution — port of app.jsx lines ~482-509.
 * ============================================================ */

const PERSONA_BY_LABEL: Record<Tweaks['persona'], PersonaId> = {
  John: 'john',
  Bill: 'bill',
  Kim: 'kim',
  Eva: 'eva',
  Maja: 'maja',
  Alex: 'alex',
  Lena: 'lena',
};

/** The app is hardcoded to the Q3 timeline (see PORTING_GUIDE §Scope). */
const RY_MODE = 'Q3' as const;

/** Design's window.mdDepositSeed() (monthly-deposits.jsx). */
export const mdDepositSeed = (): MonthlyDepositConfig => ({
  amount: { amount: 1500, currency: 'SEK' },
  mode: 'day',
  day: 1,
  ordinalWeek: 0,
  weekday: 0,
});

/**
 * usePersona — resolves the active persona from the tweaks:
 *  · familyVersion filter ('Current' hides p-family-v2; "Bjarne's sandbox"
 *    hides p-family),
 *  · devStates filter for mode 'Q3',
 *  · autoSaveSeed: John's flexible savings gets a pre-existing monthly
 *    deposit so the edit/stop path is viewable without running setup.
 */
export function usePersona(): Persona {
  const { tweaks } = useTweaks();
  const { persona: personaLabel, familyVersion, autoSaveSeed } = tweaks;
  return useMemo(() => {
    const personaId = PERSONA_BY_LABEL[personaLabel] ?? 'john';
    const raw = RY_PERSONAS[personaId];
    const ver = familyVersion || 'Current';
    const products = raw.products
      .filter((p) => {
        if (ver === 'Current' && p.id === 'p-family-v2') return false;
        if (ver === "Bjarne's sandbox" && p.id === 'p-family') return false;
        return true;
      })
      .filter((p) => !p.devStates || p.devStates.includes(RY_MODE))
      .map((p) => {
        if (personaId === 'john' && autoSaveSeed && p.id === 'p-deposit-john') {
          return {
            ...p,
            accounts: p.accounts.map((acc) =>
              acc.type === 'depositAccount' && acc.id === 'a-deposit-john'
                ? { ...acc, monthlyDeposit: mdDepositSeed() }
                : acc,
            ),
          };
        }
        return p;
      });
    return { ...raw, products };
  }, [personaLabel, familyVersion, autoSaveSeed]);
}

/* ============================================================
 * Invoice-status override — STATUS_CODE map from app.jsx.
 * ============================================================ */

const STATUS_CODE: Record<Tweaks['invoiceStatus'], PaymentRequestStatus | null> = {
  Default: null,
  Unpaid: 'unpaid',
  Overdue: 'overdue',
  Missed: 'missed',
  Scheduled: 'scheduled',
  'Partially paid': 'partiallyPaid',
  Paid: 'paid',
};

/** The forced invoice status from the tweaks panel, or null for 'Default'. */
export function useStatusOverride(): PaymentRequestStatus | null {
  const { tweaks } = useTweaks();
  return STATUS_CODE[tweaks.invoiceStatus] ?? null;
}
