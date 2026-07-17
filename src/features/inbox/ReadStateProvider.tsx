// ReadStateProvider — shared read/unread state for the My Resurs inbox
// (messages + documents). Port of app.jsx's lifted `readItems` set
// (lines ~467-477): marking an item read updates every visibility level
// at once, and each persona has its own inbox so the set resets when the
// persona tweak changes.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useTweaks } from '@/src/tweaks/TweaksProvider';

type ReadStateValue = {
  readItems: Set<string>;
  markRead: (id: string) => void;
};

const ReadStateContext = createContext<ReadStateValue | null>(null);

export function ReadStateProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { tweaks } = useTweaks();
  const [readItems, setReadItems] = useState<Set<string>>(() => new Set());

  const markRead = useCallback((id: string) => {
    setReadItems((prev) => {
      if (prev.has(id)) return prev;
      const n = new Set(prev);
      n.add(id);
      return n;
    });
  }, []);

  // Each persona has its own inbox — reset read state when switching.
  useEffect(() => {
    setReadItems(new Set());
  }, [tweaks.persona]);

  const value = useMemo<ReadStateValue>(() => ({ readItems, markRead }), [readItems, markRead]);

  return <ReadStateContext.Provider value={value}>{children}</ReadStateContext.Provider>;
}

export function useReadState(): ReadStateValue {
  const ctx = useContext(ReadStateContext);
  if (!ctx) throw new Error('useReadState must be used within a ReadStateProvider');
  return ctx;
}
