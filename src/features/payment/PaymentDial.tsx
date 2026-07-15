// PaymentDial — Apple Card-style circular payment dial, Resurs-flavored.
// Port of design-reference/payment-dial.jsx (window.RCPaymentDial) to
// react-native-svg + PanResponder. Geometry constants traced exactly:
// arc -140°..+140°, RADIUS 122, STROKE 32, CENTER 160, viewBox '-56 -30 432 396',
// container 358×328 with -28/-70 vertical margins.
//
// Q3 uses colorMode="teal"; the 'zones' color mode is ported too for parity.
// Haptic snap feedback is omitted (expo-haptics is not installed) — the
// visual pulse + knob snap animation are kept.

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { RyIcon } from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { useT } from '@/src/i18n';

import type { PlanStop } from './configFor';
import { formatSEK } from './constants';

// The dial spans from angle START to END (in degrees, 0 = top, clockwise).
// We leave a gap at the bottom so start/end feel like a gauge.
const DIAL_START = -140; // degrees from top
const DIAL_END = 140; // degrees from top
const DIAL_SWEEP = DIAL_END - DIAL_START; // 280°

const RADIUS = 122;
const STROKE = 32;
const CENTER = 160;

// viewBox '-56 -30 432 396' rendered into a 358×328 container.
const VB_X = -56;
const VB_Y = -30;
const VB_W = 432;
const VB_H = 396;
const DIAL_W = 358;
const DIAL_H = 328;

// Convert angle (deg, 0=top) to point on circle
function polar(angle: number, r = RADIUS, cx = CENTER, cy = CENTER) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// SVG arc path from angleA to angleB (degrees, 0=top)
function arcPath(a: number, b: number, r = RADIUS) {
  const p1 = polar(a, r);
  const p2 = polar(b, r);
  const large = Math.abs(b - a) > 180 ? 1 : 0;
  const sweep = b > a ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} ${sweep} ${p2.x} ${p2.y}`;
}

// SVG coords → container px
function toPx(sx: number, sy: number) {
  return { x: ((sx - VB_X) / VB_W) * DIAL_W, y: ((sy - VB_Y) / VB_H) * DIAL_H };
}

// Interpolate color between two hex colors
function lerpColor(a: string, b: string, t: number) {
  const pa = [
    parseInt(a.slice(1, 3), 16),
    parseInt(a.slice(3, 5), 16),
    parseInt(a.slice(5, 7), 16),
  ];
  const pb = [
    parseInt(b.slice(1, 3), 16),
    parseInt(b.slice(3, 5), 16),
    parseInt(b.slice(5, 7), 16),
  ];
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `#${c.map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

// Colors for zones, Resurs semantic (traced from payment-dial.jsx)
const Z = {
  slow: { main: '#BB4D00', light: '#FEE685', dark: '#973C00' },
  plan: { main: '#1D664D', light: '#B0E2C7', dark: '#17513E' },
  topup: { main: '#0F5F1C', light: '#A8D1AE', dark: '#063B10' },
} as const;

const TEAL = '#117069';

// Snap tolerance as fraction of the dial range (2%)
const SNAP_TOL = 0.02;

type SnapPoint = { id: string; value: number; frac: number };
type SnapPulse = { id: string; seq: number };

export type PaymentDialProps = {
  /** Dial max (top credit / full invoice). */
  balance: number;
  /** Statement / full amount (defaults to balance). */
  statement?: number;
  minimum: number;
  /** Accepted for design-API parity; not rendered. */
  interestPortion?: number;
  amount: number;
  onChange: (v: number) => void;
  colorMode?: 'zones' | 'teal';
  planStops?: PlanStop[] | null;
  /** Lets the parent ScrollView disable scrolling while dragging. */
  onDraggingChange?: (dragging: boolean) => void;
};

// Expanding ring at a snapped tick (`@keyframes rcSnapPulse`).
function SnapPulseRing({ x, y, color }: { x: number; y: number; color: string }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(1, { duration: 450, easing: Easing.out(Easing.quad) });
  }, [p]);
  const style = useAnimatedStyle(() => ({
    opacity: 0.9 * (1 - p.value),
    transform: [{ scale: 1 + 0.9 * p.value }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: x - STROKE / 2,
          top: y - STROKE / 2,
          width: STROKE,
          height: STROKE,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: color,
        },
        style,
      ]}
    />
  );
}

export function PaymentDial({
  balance,
  statement,
  minimum,
  interestPortion: _interestPortion,
  amount,
  onChange,
  colorMode = 'zones',
  planStops = null,
  onDraggingChange,
}: PaymentDialProps) {
  const { colors } = useRyTheme();
  const { t } = useT();

  const stmt = statement ?? balance;
  const [dragging, setDragging] = useState(false);
  const [snapPulse, setSnapPulse] = useState<SnapPulse | null>(null);
  const lastSnapRef = useRef<string | null>(null);
  const pulseSeqRef = useRef(0);
  const [animAmount, setAnimAmount] = useState<number | null>(null);
  const animRef = useRef<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typedValue, setTypedValue] = useState('');
  const typingInputRef = useRef<TextInput>(null);

  useEffect(() => {
    onDraggingChange?.(dragging);
  }, [dragging, onDraggingChange]);

  const confirmTyped = useCallback(() => {
    const n = parseInt(typedValue.replace(/\D/g, ''), 10);
    if (!isNaN(n)) {
      const clamped = Math.max(minimum, Math.min(balance, n));
      onChange(clamped);
    }
    setIsTyping(false);
    setTypedValue('');
  }, [typedValue, minimum, balance, onChange]);

  const openTyping = useCallback(() => {
    setTypedValue(String(Math.round(amount)));
    setIsTyping(true);
  }, [amount]);

  // Animate the knob along the arc when stepping between stops
  const animateTo = useCallback(
    (targetValue: number, currentAmount: number) => {
      if (animRef.current != null) cancelAnimationFrame(animRef.current);
      const startVal = currentAmount;
      const startTime = Date.now();
      const duration = 280;
      const step = () => {
        const t01 = Math.min(1, (Date.now() - startTime) / duration);
        const eased = t01 < 0.5 ? 2 * t01 * t01 : -1 + (4 - 2 * t01) * t01;
        setAnimAmount(startVal + (targetValue - startVal) * eased);
        if (t01 < 1) {
          animRef.current = requestAnimationFrame(step);
        } else {
          animRef.current = null;
          setAnimAmount(null);
          onChange(targetValue);
        }
      };
      animRef.current = requestAnimationFrame(step);
    },
    [onChange],
  );

  useEffect(
    () => () => {
      if (animRef.current != null) cancelAnimationFrame(animRef.current);
    },
    [],
  );

  // Dial range: minimum → balance (top credit). The dial floor IS minimum.
  const range = Math.max(1, balance - minimum);

  // In planStops mode each stop occupies an equal slice of the arc; values
  // BETWEEN stops map piecewise-linearly from one stop's value to the next.
  const planFracs = useMemo(() => {
    if (!planStops) return null;
    const n = planStops.length;
    return planStops.map((s, i) => ({ ...s, frac: n > 1 ? i / (n - 1) : 0 }));
  }, [planStops]);

  const planValueAtFrac = useCallback(
    (f: number): number => {
      const ps = planFracs!;
      if (f <= ps[0].frac) return ps[0].value;
      if (f >= ps[ps.length - 1].frac) return ps[ps.length - 1].value;
      for (let i = 0; i < ps.length - 1; i++) {
        if (f >= ps[i].frac && f <= ps[i + 1].frac) {
          const t01 = (f - ps[i].frac) / (ps[i + 1].frac - ps[i].frac || 1);
          return Math.round(ps[i].value + t01 * (ps[i + 1].value - ps[i].value));
        }
      }
      return ps[ps.length - 1].value;
    },
    [planFracs],
  );

  const planFracAtValue = useCallback(
    (v: number): number => {
      const ps = planFracs!;
      if (v <= ps[0].value) return ps[0].frac;
      if (v >= ps[ps.length - 1].value) return ps[ps.length - 1].frac;
      for (let i = 0; i < ps.length - 1; i++) {
        if (v >= ps[i].value && v <= ps[i + 1].value) {
          const t01 = (v - ps[i].value) / (ps[i + 1].value - ps[i].value || 1);
          return ps[i].frac + t01 * (ps[i + 1].frac - ps[i].frac);
        }
      }
      return ps[ps.length - 1].frac;
    },
    [planFracs],
  );

  // Use animAmount for visuals during step animation, typed value while typing
  const typedNumeric = isTyping ? parseInt(typedValue.replace(/\D/g, ''), 10) : NaN;
  const typedClamped = !isNaN(typedNumeric)
    ? Math.max(minimum, Math.min(balance, typedNumeric))
    : null;
  const dispAmount =
    animAmount !== null ? animAmount : isTyping && typedClamped !== null ? typedClamped : amount;

  // amount → fraction along the arc
  const frac = planFracs
    ? planFracAtValue(dispAmount)
    : Math.max(0, Math.min(1, (dispAmount - minimum) / range));
  const angle = DIAL_START + frac * DIAL_SWEEP;

  const minFrac = 0;
  const sixMo = Math.ceil(stmt / 6);
  const sixMoFrac = Math.min(1, Math.max(0, (sixMo - minimum) / range));
  const stmtFrac = Math.min(1, Math.max(0, (stmt - minimum) / range));

  // Snap points — plan stops in planStops mode, else the revolving defaults.
  const snapPoints = useMemo<SnapPoint[]>(() => {
    if (planFracs) {
      return planFracs.map((s) => ({ id: s.id, value: s.value, frac: s.frac }));
    }
    return [
      { id: 'min', frac: minFrac, value: minimum },
      { id: 'sixmo', frac: sixMoFrac, value: sixMo },
      { id: 'stmt', frac: stmtFrac, value: stmt },
      { id: 'top', frac: 1, value: balance },
    ];
  }, [planFracs, minFrac, sixMoFrac, stmtFrac, minimum, sixMo, stmt, balance]);

  // Given a raw fraction, return { value, snapId }.
  const resolveSnap = useCallback(
    (rawFrac: number): { value: number; snapId: string | null } => {
      let best: (SnapPoint & { d: number }) | null = null;
      for (const sp of snapPoints) {
        const d = Math.abs(rawFrac - sp.frac);
        if (d <= SNAP_TOL && (!best || d < best.d)) best = { ...sp, d };
      }
      if (best) return { value: best.value, snapId: best.id };
      if (planFracs) return { value: planValueAtFrac(rawFrac), snapId: null };
      return { value: Math.round(minimum + rawFrac * range), snapId: null };
    },
    [planFracs, planValueAtFrac, snapPoints, minimum, range],
  );

  // Trigger a visual pulse when we land on a new snap point.
  // (The design also vibrated via navigator.vibrate — expo-haptics is not
  // installed in this repo, so the vibration is intentionally skipped.)
  const fireSnapFeedback = useCallback((snapId: string | null) => {
    if (snapId && snapId !== lastSnapRef.current) {
      pulseSeqRef.current += 1;
      const pulse = { id: snapId, seq: pulseSeqRef.current };
      setSnapPulse(pulse);
      setTimeout(
        () => setSnapPulse((p) => (p && p.id === snapId && p.seq === pulse.seq ? null : p)),
        280,
      );
    }
    lastSnapRef.current = snapId;
  }, []);

  // Dominant color for the knob & progress of the currently-selected range
  const activeColor = useMemo(() => {
    if (colorMode === 'teal') return colors.primaryMain;
    if (dispAmount < sixMo) return Z.slow.main;
    if (dispAmount < stmt) return Z.plan.main;
    return Z.topup.main;
  }, [dispAmount, sixMo, stmt, colorMode, colors.primaryMain]);

  // Calculate knob position
  const knobPt = polar(angle);
  const knobPx = toPx(knobPt.x, knobPt.y);

  // drag handling — translate pointer coords → angle → amount
  const rectRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const dialRef = useRef<View>(null);

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const rect = rectRef.current;
      if (!rect) return;
      // Map SVG center (160,160) to window coords using the viewBox:
      // ((160 - -56) / 432) along the width, ((160 - -30) / 396) along the height
      const cx = rect.x + rect.w * (216 / 432);
      const cy = rect.y + rect.h * (190 / 396);
      const dx = clientX - cx;
      const dy = clientY - cy;
      // angle from top, clockwise
      let a = (Math.atan2(dx, -dy) * 180) / Math.PI;
      // Unwrap a so it's in [DIAL_START, DIAL_START + 360).
      while (a < DIAL_START) a += 360;
      while (a >= DIAL_START + 360) a -= 360;

      let newFrac: number;
      if (a <= DIAL_END) {
        newFrac = (a - DIAL_START) / DIAL_SWEEP;
      } else {
        // in the gap; snap to nearer end
        const distToEnd = a - DIAL_END;
        const distToStart = DIAL_START + 360 - a;
        newFrac = distToEnd < distToStart ? 1 : 0;
      }
      newFrac = Math.max(0, Math.min(1, newFrac));
      const { value, snapId } = resolveSnap(newFrac);
      fireSnapFeedback(snapId);
      onChange(value);
    },
    [onChange, resolveSnap, fireSnapFeedback],
  );

  // Keep latest callbacks reachable from the (stable) PanResponder.
  const updateRef = useRef(updateFromPointer);
  updateRef.current = updateFromPointer;
  const typingRef = useRef(isTyping);
  typingRef.current = isTyping;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !typingRef.current,
        onMoveShouldSetPanResponder: () => !typingRef.current,
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
        onPanResponderGrant: (evt) => {
          const { pageX, pageY } = evt.nativeEvent;
          lastSnapRef.current = null; // allow re-firing on new gesture
          setDragging(true);
          dialRef.current?.measureInWindow((x, y, w, h) => {
            rectRef.current = { x, y, w: w || DIAL_W, h: h || DIAL_H };
            updateRef.current(pageX, pageY);
          });
        },
        onPanResponderMove: (evt) => {
          updateRef.current(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        },
        onPanResponderRelease: () => setDragging(false),
        onPanResponderTerminate: () => setDragging(false),
      }),
    [],
  );

  // Pulse when amount lands exactly on a snap point from an external source
  useEffect(() => {
    if (dragging) return;
    const hit = snapPoints.find((sp) => sp.value === amount);
    if (hit) {
      pulseSeqRef.current += 1;
      const pulse = { id: hit.id, seq: pulseSeqRef.current };
      setSnapPulse(pulse);
      const t01 = setTimeout(
        () => setSnapPulse((p) => (p && p.seq === pulse.seq ? null : p)),
        280,
      );
      return () => clearTimeout(t01);
    }
  }, [amount, dragging, snapPoints]);

  // Knob snap animation (`@keyframes rcKnobSnap` — scale 1 → 1.22 → 1).
  const knobScale = useSharedValue(1);
  useEffect(() => {
    if (snapPulse) {
      knobScale.value = withSequence(
        withTiming(1.22, { duration: 145, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 175, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }),
      );
    }
  }, [snapPulse, knobScale]);
  const knobAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: knobScale.value }],
  }));

  // Halo (visible while dragging)
  const halo = useSharedValue(0);
  useEffect(() => {
    halo.value = withTiming(dragging ? 1 : 0, { duration: 150, easing: Easing.ease });
  }, [dragging, halo]);
  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.16 * halo.value,
    transform: [{ scale: 0.6 + 0.4 * halo.value }],
  }));

  // Colored progress arc. Teal mode is a single uniform-color arc; zones mode
  // subdivides into small arcs so the color blends through each boundary
  // (ported 1:1 from the design's 120-step loop).
  const progressArcs = useMemo(() => {
    if (frac <= 0) return [];
    if (colorMode === 'teal') {
      return [
        {
          key: 'teal',
          d: arcPath(DIAL_START, DIAL_START + frac * DIAL_SWEEP),
          color: TEAL,
          cap: 'round' as const,
        },
      ];
    }
    const stops = [
      { frac: 0, color: Z.slow.main },
      { frac: Math.max(0.0001, sixMoFrac - 0.015), color: Z.slow.main },
      { frac: Math.min(0.9999, sixMoFrac + 0.015), color: Z.plan.main },
      { frac: Math.max(0.0001, stmtFrac - 0.015), color: Z.plan.main },
      { frac: Math.min(0.9999, stmtFrac + 0.015), color: Z.topup.main },
      { frac: 1, color: Z.topup.main },
    ];
    const STEPS = 120;
    const arcs: { key: string; d: string; color: string; cap: 'round' | 'butt' }[] = [];
    for (let k = 0; k < STEPS; k++) {
      const f0 = k / STEPS;
      const f1 = (k + 1) / STEPS;
      if (f0 >= frac) break;
      const fStart = f0;
      const fEnd = Math.min(f1, frac);
      const fMid = (fStart + fEnd) / 2;
      let col: string = stops[0].color;
      for (let s = 0; s < stops.length - 1; s++) {
        const a = stops[s];
        const b = stops[s + 1];
        if (fMid >= a.frac && fMid <= b.frac) {
          const t01 = b.frac === a.frac ? 0 : (fMid - a.frac) / (b.frac - a.frac);
          col = lerpColor(a.color, b.color, Math.max(0, Math.min(1, t01)));
          break;
        }
      }
      const aFrom = DIAL_START + fStart * DIAL_SWEEP;
      const aTo = DIAL_START + fEnd * DIAL_SWEEP;
      if (aTo <= aFrom + 0.01) continue;
      arcs.push({
        key: String(k),
        d: arcPath(aFrom, aTo),
        color: col,
        cap: k === 0 ? 'round' : 'butt',
      });
    }
    return arcs;
  }, [frac, colorMode, sixMoFrac, stmtFrac]);

  // Tick marks — the plan stops in planStops mode, else min/6mo/statement/top
  const ticks = (
    planFracs
      ? planFracs.map((s) => ({ id: s.id, frac: s.frac }))
      : [
          { id: 'min', frac: minFrac },
          { id: 'sixmo', frac: sixMoFrac },
          { id: 'stmt', frac: stmtFrac },
          { id: 'top', frac: 1 },
        ]
  ).filter((tk) =>
    planStops
      ? tk.frac >= 0 && tk.frac <= 1
      : (tk.frac > 0.02 && tk.frac < 0.98) || tk.frac === 1 || Math.abs(tk.frac - stmtFrac) < 0.01,
  );

  const stepDown = useCallback(() => {
    if (animRef.current != null) return;
    const idx = snapPoints.findIndex((sp) => sp.value === amount);
    const target =
      idx > 0
        ? snapPoints[idx - 1]
        : idx === -1
          ? [...snapPoints].reverse().find((sp) => sp.value < amount)
          : null;
    if (target) {
      fireSnapFeedback(target.id);
      animateTo(target.value, amount);
    }
  }, [amount, snapPoints, animateTo, fireSnapFeedback]);

  const stepUp = useCallback(() => {
    if (animRef.current != null) return;
    const idx = snapPoints.findIndex((sp) => sp.value === amount);
    const target =
      idx >= 0 && idx < snapPoints.length - 1
        ? snapPoints[idx + 1]
        : idx === -1
          ? snapPoints.find((sp) => sp.value > amount)
          : null;
    if (target) {
      fireSnapFeedback(target.id);
      animateTo(target.value, amount);
    }
  }, [amount, snapPoints, animateTo, fireSnapFeedback]);

  const isAtMin = amount <= (snapPoints[0]?.value ?? amount);
  const isAtMax = amount >= (snapPoints[snapPoints.length - 1]?.value ?? amount);

  const pulsingTickPx = snapPulse
    ? (() => {
        const tk = ticks.find((x) => x.id === snapPulse.id);
        if (!tk) return null;
        const c = polar(DIAL_START + tk.frac * DIAL_SWEEP, RADIUS);
        return toPx(c.x, c.y);
      })()
    : null;

  return (
    <View style={styles.wrap}>
      {/* − step button */}
      <Pressable
        onPress={stepDown}
        disabled={isAtMin}
        accessibilityLabel="Decrease amount"
        style={({ pressed }) => [
          styles.stepBtn,
          {
            left: 0,
            borderColor: colors.borderSubtle,
            backgroundColor: pressed && !isAtMin ? colors.grey200 : colors.bgSubtle,
            opacity: isAtMin ? 0.25 : 1,
          },
        ]}>
        <RyIcon name="fa-minus" size={16} color={colors.fgPrimary} />
      </Pressable>

      {/* Dial */}
      <View ref={dialRef} collapsable={false} style={styles.dial} {...panResponder.panHandlers}>
        <Svg width={DIAL_W} height={DIAL_H} viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}>
          {/* Background track */}
          <Path
            d={arcPath(DIAL_START, DIAL_END)}
            fill="none"
            stroke={colors.grey200}
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
          {/* Outline of the full scale — outer + inner edges of the track */}
          <Path
            d={arcPath(DIAL_START, DIAL_END, RADIUS + STROKE / 2)}
            fill="none"
            stroke={colors.grey300}
            strokeWidth={1}
            strokeLinecap="round"
          />
          <Path
            d={arcPath(DIAL_START, DIAL_END, RADIUS - STROKE / 2)}
            fill="none"
            stroke={colors.grey300}
            strokeWidth={1}
            strokeLinecap="round"
          />
          {/* End caps of the outline */}
          {[DIAL_START, DIAL_END].map((ang) => {
            const outer = polar(ang, RADIUS + STROKE / 2);
            const inner = polar(ang, RADIUS - STROKE / 2);
            const r = STROKE / 2;
            const sweep = ang === DIAL_START ? 0 : 1;
            return (
              <Path
                key={`cap-${ang}`}
                d={`M ${outer.x} ${outer.y} A ${r} ${r} 0 0 ${sweep} ${inner.x} ${inner.y}`}
                fill="none"
                stroke={colors.grey300}
                strokeWidth={1}
              />
            );
          })}

          {/* Colored arc up to current amount */}
          {progressArcs.map((a) => (
            <Path
              key={a.key}
              d={a.d}
              fill="none"
              stroke={a.color}
              strokeWidth={STROKE}
              strokeLinecap={a.cap}
            />
          ))}

          {/* Tick marks */}
          {ticks.map((tk, i) => {
            const c = polar(DIAL_START + tk.frac * DIAL_SWEEP, RADIUS);
            const pulsing = snapPulse?.id === tk.id;
            return (
              <Circle
                key={i}
                cx={c.x}
                cy={c.y}
                r={pulsing ? 6 : 5}
                fill={pulsing ? activeColor : colors.grey400}
                fillOpacity={pulsing ? 1 : 0.8}
              />
            );
          })}
        </Svg>

        {/* Snap pulse ring (rcSnapPulse keyframes) */}
        {snapPulse && pulsingTickPx ? (
          <SnapPulseRing
            key={`pulse-${snapPulse.id}-${snapPulse.seq}`}
            x={pulsingTickPx.x}
            y={pulsingTickPx.y}
            color={activeColor}
          />
        ) : null}

        {/* Knob with halo (the halo becomes visible while dragging) */}
        <View pointerEvents="none" style={[styles.knobWrap, { left: knobPx.x, top: knobPx.y }]}>
          <Animated.View
            style={[styles.knobHalo, { backgroundColor: colors.primaryMain }, haloStyle]}
          />
          <Animated.View style={[styles.knob, knobAnimStyle]} />
        </View>

        {/* Center content — SEK label, amount, then Type pill */}
        <View pointerEvents="box-none" style={styles.center}>
          {isTyping ? (
            <>
              <Text
                style={[
                  ryFont('500'),
                  { fontSize: 13, letterSpacing: 13 * 0.04, opacity: 0.7, color: activeColor },
                ]}>
                SEK
              </Text>
              <TextInput
                ref={typingInputRef}
                keyboardType="number-pad"
                style={[
                  ryFont('700'),
                  styles.typeInput,
                  { color: colors.fgPrimary, borderBottomColor: colors.primaryMain },
                ]}
                value={typedValue}
                onChangeText={setTypedValue}
                onBlur={confirmTyped}
                onSubmitEditing={confirmTyped}
                autoFocus
                selectTextOnFocus
              />
              <Pressable
                onPress={confirmTyped}
                style={({ pressed }) => [
                  styles.typePill,
                  { backgroundColor: pressed ? colors.grey300 : colors.grey200 },
                ]}>
                <RyIcon name="fa-check" size={10} color={colors.fgSecondary} />
                <Text style={[ryFont('600'), styles.typePillText, { color: colors.fgSecondary }]}>
                  {t('rc.dial.done')}
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text
                style={[
                  ryFont('500'),
                  { fontSize: 13, letterSpacing: 13 * 0.04, opacity: 0.7, color: activeColor },
                ]}>
                SEK
              </Text>
              <Text
                style={[
                  ryFont('700'),
                  styles.amt,
                  { color: colors.fgPrimary },
                ]}>
                {formatSEK(dispAmount)}
              </Text>
              <Pressable
                onPress={openTyping}
                style={({ pressed }) => [
                  styles.typePill,
                  { backgroundColor: pressed ? colors.grey300 : colors.grey200 },
                ]}>
                <Text style={[ryFont('600'), styles.typePillText, { color: colors.fgSecondary }]}>
                  {t('rc.dial.type')}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      {/* + step button */}
      <Pressable
        onPress={stepUp}
        disabled={isAtMax}
        accessibilityLabel="Increase amount"
        style={({ pressed }) => [
          styles.stepBtn,
          {
            right: 0,
            borderColor: colors.borderSubtle,
            backgroundColor: pressed && !isAtMax ? colors.grey200 : colors.bgSubtle,
            opacity: isAtMax ? 0.25 : 1,
          },
        ]}>
        <RyIcon name="fa-plus" size={16} color={colors.fgPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtn: {
    position: 'absolute',
    top: '50%',
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  // .rc-dial: 358×328, margin -28 auto -70
  dial: {
    width: DIAL_W,
    height: DIAL_H,
    marginTop: -28,
    marginBottom: -70,
  },
  knobWrap: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
  knobHalo: {
    position: 'absolute',
    left: -27,
    top: -27,
    width: 54,
    height: 54,
    borderRadius: 999,
  },
  knob: {
    position: 'absolute',
    left: -17,
    top: -17,
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    // 0 2px 16px rgba(52,58,64,0.18)
    shadowColor: '#343A40',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  center: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amt: {
    fontSize: 36,
    lineHeight: 36,
    marginTop: 10,
    letterSpacing: 36 * -0.03,
    fontVariant: ['tabular-nums'],
  },
  typeInput: {
    width: 160,
    marginTop: 10,
    borderBottomWidth: 2,
    fontSize: 36,
    textAlign: 'center',
    paddingVertical: 0,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 16,
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  typePillText: {
    fontSize: 12,
    letterSpacing: 12 * 0.03,
  },
});
