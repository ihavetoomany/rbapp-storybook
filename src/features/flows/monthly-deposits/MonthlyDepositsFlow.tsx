// MonthlyDepositsFlow — "Monthly deposits" automatic-savings flow, ported 1:1
// from design-reference/monthly-deposits.jsx (+ the `md-*` CSS in app.css).
//
// Presentational components + a thin controller (MonthlyDepositsFlow) that the
// savings AccountView mounts. State comes in via props; the controller owns the
// sheet/dialog navigation + form state.
//
// Ported deviations (RN):
//  · MdSelect (the design's native <select>) opens a small option sheet
//    (BaseDialog) instead of a browser dropdown.
//  · The day-of-month numpad slides up inside the sheet by growing from the
//    bottom of the form (the sheet hugs content), instead of overlaying the
//    footer with position:absolute.
//
// Design FLAGS preserved: Nordea + ****1234 are dummy placeholders; the
// "Direct deposit" bolt icon renders as a clearly-marked dashed placeholder
// tile; day-of-month range is 1–28.

import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import {
  AlertBanner,
  BaseDialog,
  KvCopyRow,
  RyButton,
  RyCard,
  RyIcon,
  ryTints,
} from '@/src/components/ry';
import type { MonthlyDepositConfig } from '@/src/data/types';
import { useT } from '@/src/i18n';
import { radii, shadowCard } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

import {
  mdDepositDate,
  mdEveryPhrase,
  mdFmt,
  mdFmtDate,
  mdMoney,
  mdOrdWeeks,
  mdRecur,
  mdWeekdays,
} from './mdFormat';

const ryFont = (weight: '400' | '500' | '600' | '700') =>
  ({
    fontFamily: Number(weight) >= 600 ? 'Inter-Bold' : 'Inter-Regular',
    fontWeight: weight,
  }) as const;

/** Sheet/dialog navigation state — design's `view` union. */
export type MdView = null | 'options' | 'setup' | 'edit' | 'success' | 'stop' | 'bank';

/** Minimal account shape the flow needs (`account.number` = bank reference). */
type MdAccountLike = { number?: string } | null | undefined;

// ── MdRadioDot ───────────────────────────────────────────────
function MdRadioDot({ checked }: { checked: boolean }) {
  const { colors } = useRyTheme();
  return (
    <View
      style={[
        styles.radio,
        { borderColor: checked ? colors.primaryMain : colors.borderDefault },
      ]}>
      {checked ? <View style={[styles.radioFill, { backgroundColor: colors.primaryMain }]} /> : null}
    </View>
  );
}

// ── MdDayField — tappable day-of-month field → opens the numpad ──
function MdDayField({
  value,
  active,
  disabled,
  onOpen,
}: {
  value: number;
  active: boolean;
  disabled: boolean;
  onOpen: () => void;
}) {
  const { colors, dark } = useRyTheme();
  const tints = ryTints(dark);
  const [caretOn, setCaretOn] = useState(true);

  // Blinking caret while the keypad is open (CSS `md-caret` steps animation).
  useEffect(() => {
    if (!active) return;
    setCaretOn(true);
    const id = setInterval(() => setCaretOn((v) => !v), 500);
    return () => clearInterval(id);
  }, [active]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Day of month"
      onPress={disabled ? undefined : onOpen}
      style={[
        styles.dayField,
        {
          backgroundColor: colors.bgPaper,
          borderColor: active ? colors.primaryMain : colors.borderDefault,
        },
        active && { shadowColor: tints.mint100, shadowOpacity: 1, shadowRadius: 3, shadowOffset: { width: 0, height: 0 } },
        disabled && { opacity: 0.45 },
      ]}>
      <Text style={[ryFont('700'), styles.dayFieldVal, { color: colors.fgPrimary }]}>{value}</Text>
      {active ? (
        <View
          style={[
            styles.dayFieldCaret,
            { backgroundColor: colors.primaryMain, opacity: caretOn ? 1 : 0 },
          ]}
        />
      ) : null}
    </Pressable>
  );
}

// ── MdNumPad — custom keypad sliding up inside the sheet ─────
const NUMPAD_H = 276;
const NUMPAD_KEYS: (number | 'blank' | 'del')[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  ['blank', 0, 'del'],
];

function MdNumPad({
  open,
  onDigit,
  onDelete,
  onDone,
}: {
  open: boolean;
  onDigit: (d: number) => void;
  onDelete: () => void;
  onDone: () => void;
}) {
  const { colors } = useRyTheme();
  const { t } = useT();
  const progress = useSharedValue(open ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(open ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.32, 0.72, 0, 1),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const wrapStyle = useAnimatedStyle(() => ({ height: progress.value * NUMPAD_H }));
  const padStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * NUMPAD_H }],
  }));

  return (
    <Animated.View style={[styles.numpadWrap, wrapStyle]} pointerEvents={open ? 'auto' : 'none'}>
      <Animated.View
        style={[
          styles.numpad,
          { backgroundColor: colors.grey100, borderTopColor: colors.borderSubtle },
          padStyle,
        ]}
        accessibilityLabel="Enter day of month">
        <View style={styles.numpadBar}>
          <Text style={[ryFont('600'), styles.numpadTitle, { color: colors.fgSecondary }]}>
            {t('md.day_of_month')}{' '}
            <Text style={[ryFont('400'), { color: colors.fgDisabled }]}>{t('md.range')}</Text>
          </Text>
          <Pressable onPress={onDone} hitSlop={6}>
            <Text style={[ryFont('700'), styles.numpadDone, { color: colors.primaryMain }]}>
              {t('md.done')}
            </Text>
          </Pressable>
        </View>
        {NUMPAD_KEYS.map((row, ri) => (
          <View key={ri} style={styles.numpadRow}>
            {row.map((k, ki) => {
              if (k === 'blank') return <View key={ki} style={styles.key} />;
              if (k === 'del') {
                return (
                  <Pressable
                    key={ki}
                    accessibilityLabel="Delete"
                    onPress={onDelete}
                    style={({ pressed }) => [
                      styles.key,
                      pressed && { backgroundColor: colors.grey200, borderRadius: 10 },
                    ]}>
                    <RyIcon name="fa-delete-left" size={20} color={colors.fgSecondary} />
                  </Pressable>
                );
              }
              return (
                <Pressable
                  key={ki}
                  onPress={() => onDigit(k)}
                  style={({ pressed }) => [
                    styles.key,
                    styles.keyDigit,
                    { backgroundColor: pressed ? colors.grey200 : colors.bgPaper },
                  ]}>
                  <Text style={[ryFont('500'), styles.keyText, { color: colors.fgPrimary }]}>
                    {k}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </Animated.View>
    </Animated.View>
  );
}

// ── MdSelect — pill select opening a small option sheet ──────
function MdSelect({
  value,
  options,
  onChange,
  disabled,
  label,
}: {
  value: number;
  options: string[];
  onChange: (i: number) => void;
  disabled?: boolean;
  label?: string;
}) {
  const { colors } = useRyTheme();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={[
          styles.select,
          { backgroundColor: colors.bgPaper, borderColor: colors.borderDefault },
          disabled && { opacity: 0.45 },
        ]}>
        <Text style={[ryFont('600'), styles.selectText, { color: colors.fgPrimary }]}>
          {options[value]}
        </Text>
        <RyIcon name="fa-chevron-down" size={11} color={colors.iconMuted} />
      </Pressable>
      <BaseDialog open={open} onClose={() => setOpen(false)} title={label} size="small">
        <RyCard>
          {options.map((o, i) => (
            <Pressable
              key={i}
              onPress={() => {
                onChange(i);
                setOpen(false);
              }}
              style={({ pressed }) => [
                styles.optRow,
                { borderBottomColor: i === options.length - 1 ? 'transparent' : colors.borderSubtle },
                pressed && { backgroundColor: colors.bgSubtle },
              ]}>
              <MdRadioDot checked={i === value} />
              <Text style={[ryFont('400'), styles.optText, { color: colors.fgPrimary }]}>{o}</Text>
            </Pressable>
          ))}
        </RyCard>
      </BaseDialog>
    </>
  );
}

// ── MonthlyDepositForm (setup | edit modes) ──────────────────
const MD_DAY_MAX = 28;

export function MonthlyDepositForm({
  mode,
  initial,
  onSubmit,
  onCancel,
  onStop,
}: {
  mode: 'setup' | 'edit';
  initial: MonthlyDepositConfig | null;
  onSubmit: (dep: MonthlyDepositConfig) => void;
  onCancel: () => void;
  onStop: () => void;
}) {
  const { colors } = useRyTheme();
  const { t, lang } = useT();
  const isEdit = mode === 'edit';

  const [amount, setAmount] = useState(initial && initial.amount ? String(initial.amount.amount) : '');
  // No default date selection on setup (design: null until the user picks).
  const [dateMode, setDateMode] = useState<'day' | 'weekday' | null>(
    initial ? initial.mode || 'day' : null,
  );
  const [day, setDay] = useState(initial && initial.day ? initial.day : 1);
  const [ordinalWeek, setOrdinalWeek] = useState(initial?.ordinalWeek != null ? initial.ordinalWeek : 0);
  const [weekday, setWeekday] = useState(initial?.weekday != null ? initial.weekday : 0);

  // Numeric keypad for manual day-of-month entry. A ref tracks the buffer
  // synchronously so rapid taps (before a re-render) accumulate correctly.
  const [padOpen, setPadOpen] = useState(false);
  const dayBufRef = useRef('');

  const openPad = () => {
    setDateMode('day');
    dayBufRef.current = '';
    setPadOpen(true);
  };
  const closePad = () => setPadOpen(false);
  const pressDigit = (d: number) => {
    let next = dayBufRef.current + String(d);
    if (next.length > 2) next = String(d); // only ever 2 digits
    next = next.replace(/^0+(?=\d)/, ''); // drop leading zero ('05' → '5')
    let n = parseInt(next || '0', 10);
    if (n > MD_DAY_MAX) {
      next = String(MD_DAY_MAX);
      n = MD_DAY_MAX;
    }
    dayBufRef.current = next;
    if (n >= 1) setDay(n);
  };
  const pressDelete = () => {
    const next = dayBufRef.current.slice(0, -1);
    dayBufRef.current = next;
    const n = parseInt(next || '0', 10);
    if (n >= 1) setDay(n);
  };

  const amountNum = parseInt(amount, 10);
  const dateChosen = dateMode === 'day' || dateMode === 'weekday';
  const valid = Number.isFinite(amountNum) && amountNum > 0 && dateChosen;
  const dep: MonthlyDepositConfig = {
    amount: mdMoney(Number.isFinite(amountNum) ? amountNum : 0),
    mode: dateMode ?? 'day',
    day,
    ordinalWeek,
    weekday,
  };

  return (
    <View>
      <Text style={[ryFont('400'), styles.formIntro, { color: colors.fgSecondary }]}>
        {t('md.funds_note')}
      </Text>

      {/* Amount */}
      <View style={styles.field}>
        <Text style={[ryFont('600'), styles.label, { color: colors.fgSecondary }]}>
          {t('md.deposit_amount').toUpperCase()}
        </Text>
        <View
          style={[
            styles.amount,
            { backgroundColor: colors.bgPaper, borderColor: colors.borderDefault },
          ]}>
          <TextInput
            style={[ryFont('700'), styles.amountInput, { color: colors.fgPrimary }]}
            keyboardType="number-pad"
            value={amount}
            onChangeText={(v) => setAmount(v.replace(/[^\d]/g, ''))}
            placeholder={t('md.amount_placeholder')}
            placeholderTextColor={colors.fgDisabled}
            onFocus={closePad}
          />
          <Text style={[ryFont('600'), styles.amountCur, { color: colors.fgSecondary }]}>kr</Text>
        </View>
      </View>

      {/* Date */}
      <View style={styles.field}>
        <Text style={[ryFont('600'), styles.label, { color: colors.fgSecondary }]}>
          {t('md.deposit_date').toUpperCase()}
        </Text>

        <Pressable
          onPress={() => setDateMode('day')}
          style={[
            styles.radioRow,
            { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle },
          ]}>
          <MdRadioDot checked={dateMode === 'day'} />
          <Text style={[ryFont('400'), styles.radioLabel, { color: colors.fgPrimary }]}>
            {t('md.day_of_month')}
          </Text>
          <View style={styles.radioControl}>
            <MdDayField value={day} active={padOpen} disabled={dateMode !== 'day'} onOpen={openPad} />
          </View>
        </Pressable>

        <Pressable
          onPress={() => {
            closePad();
            setDateMode('weekday');
          }}
          style={[
            styles.radioRow,
            { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle },
          ]}>
          <MdRadioDot checked={dateMode === 'weekday'} />
          <Text style={[ryFont('400'), styles.radioLabel, { color: colors.fgPrimary }]}>
            {t('md.on_the')}
          </Text>
          <View style={[styles.radioControl, styles.radioControlSelects]}>
            <MdSelect
              value={ordinalWeek}
              options={mdOrdWeeks(lang)}
              disabled={dateMode !== 'weekday'}
              onChange={setOrdinalWeek}
            />
            <MdSelect
              value={weekday}
              options={mdWeekdays(lang)}
              disabled={dateMode !== 'weekday'}
              onChange={setWeekday}
            />
          </View>
        </Pressable>
      </View>

      {valid ? (
        <>
          <Text style={[ryFont('400'), styles.helper, { color: colors.fgSecondary }]}>
            {t('md.repeat', mdRecur(lang, dep))}
          </Text>
          <AlertBanner
            variant="info"
            body={t('md.upcoming', mdFmtDate(lang, mdDepositDate(dep)))}
            style={{ marginTop: 4 }}
          />
        </>
      ) : null}

      {isEdit ? (
        <Pressable
          onPress={onStop}
          style={({ pressed }) => [
            styles.stopRow,
            { backgroundColor: pressed ? colors.bgSubtle : colors.bgPaper, borderColor: colors.borderSubtle },
          ]}>
          <View style={[styles.stopIcon, { borderColor: colors.errorMain }]}>
            <RyIcon name="fa-xmark" size={13} color={colors.errorMain} />
          </View>
          <Text style={[ryFont('600'), styles.stopTitle, { color: colors.errorMain }]}>
            {t('md.stop_row')}
          </Text>
          <RyIcon name="fa-chevron-right" size={14} color={colors.iconMuted} />
        </Pressable>
      ) : null}

      <View style={styles.footer}>
        <RyButton title={t('md.cancel')} variant="outlined" onPress={onCancel} style={styles.footerBtn} />
        <RyButton
          title={isEdit ? t('md.update') : t('md.set_up')}
          variant="primary"
          disabled={!isEdit && !valid}
          onPress={() => valid && onSubmit(dep)}
          style={styles.footerBtn}
        />
      </View>

      <MdNumPad open={padOpen} onDigit={pressDigit} onDelete={pressDelete} onDone={closePad} />
    </View>
  );
}

// ── MonthlyDepositOptions — options sheet rows ───────────────
export function MonthlyDepositOptions({
  onMonthly,
  onBank,
}: {
  onMonthly: () => void;
  onBank: () => void;
}) {
  const { colors } = useRyTheme();
  const { t } = useT();

  const Row = ({
    icon,
    title,
    sub,
    onPress,
    placeholder,
    last,
  }: {
    icon: string;
    title: string;
    sub: string;
    onPress?: () => void;
    placeholder?: boolean;
    last?: boolean;
  }) => (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.optionRow,
        { borderBottomColor: last ? 'transparent' : colors.borderSubtle },
        last && { borderBottomWidth: 0 },
        placeholder && { opacity: 0.85 },
        pressed && { backgroundColor: colors.bgSubtle },
      ]}>
      {placeholder ? (
        // Clearly-marked placeholder tile for the flagged bolt icon-set gap.
        <View style={[styles.optionIcon, styles.optionIconGap, { borderColor: colors.borderDefault }]}>
          <RyIcon name={icon} size={15} color={colors.iconMuted} />
        </View>
      ) : (
        <View style={[styles.optionIcon, { backgroundColor: colors.bgSubtle }]}>
          <RyIcon name={icon} size={15} color={colors.fgSecondary} />
        </View>
      )}
      <View style={styles.optionBody}>
        <Text style={[ryFont('500'), styles.optionTitle, { color: colors.fgPrimary }]}>{title}</Text>
        <Text style={[ryFont('400'), styles.optionSub, { color: colors.fgSecondary }]}>{sub}</Text>
      </View>
      <RyIcon name="fa-chevron-right" size={12} color={colors.fgDisabled} />
    </Pressable>
  );

  return (
    <RyCard>
      {/* Direct deposit — placeholder row, no flow. */}
      <Row icon="fa-bolt" title={t('md.opt.direct')} sub={t('md.opt.direct_sub')} placeholder />
      {/* Bank deposit — opens an account-info dialog for a manual transfer. */}
      <Row icon="fa-building-columns" title={t('md.opt.bank')} sub={t('md.opt.bank_sub')} onPress={onBank} />
      {/* Monthly deposits — wired. */}
      <Row icon="fa-calendar-day" title={t('md.opt.monthly')} sub={t('md.opt.monthly_sub')} onPress={onMonthly} last />
    </RyCard>
  );
}

// ── MonthlyDepositBankInfo — bank-deposit info sheet ─────────
const MD_BANKGIRO = '5827-4545';

export function MonthlyDepositBankInfo({
  account,
  onDone,
}: {
  account: MdAccountLike;
  onDone: () => void;
}) {
  const { colors } = useRyTheme();
  const { t } = useT();
  const reference = (account && account.number) || '';
  return (
    <View>
      <Text style={[ryFont('400'), styles.formIntro, { color: colors.fgSecondary }]}>
        {t('md.bank.intro')}
      </Text>
      <RyCard>
        <KvCopyRow label={t('md.bank.recipient')} value={t('md.bank.recipient_val')} mono={false} copy />
        <KvCopyRow label={t('md.bank.bankgiro')} value={MD_BANKGIRO} copy />
        <KvCopyRow label={t('md.bank.reference')} value={reference} copy last />
      </RyCard>
      <View style={[styles.footer, { marginTop: 20 }]}>
        <RyButton title={t('md.bank.done')} variant="primary" onPress={onDone} style={styles.footerBtn} />
      </View>
    </View>
  );
}

// ── MonthlyDepositSuccess — success sheet ────────────────────
export function MonthlyDepositSuccess({
  deposit,
  onDone,
}: {
  deposit: MonthlyDepositConfig;
  onDone: () => void;
}) {
  const { colors, dark } = useRyTheme();
  const tints = ryTints(dark);
  const { t, lang } = useT();
  const date = mdFmtDate(lang, mdDepositDate(deposit));
  return (
    <View style={styles.success}>
      <View style={[styles.successIco, { backgroundColor: tints.mint100 }]}>
        <RyIcon name="fa-circle-check" size={30} color={colors.successMain} />
      </View>
      <Text style={[ryFont('700'), styles.successHeading, { color: colors.fgPrimary }]}>
        {t('md.success.title')}
      </Text>
      <Text style={[ryFont('400'), styles.successBody, { color: colors.fgPrimary }]}>
        {t('md.success.body', mdFmt(deposit.amount), date, mdRecur(lang, deposit))}
      </Text>
      <Text style={[ryFont('400'), styles.successNote, { color: colors.fgSecondary }]}>
        {t('md.success.note')}
      </Text>
      <RyButton title={t('md.done')} variant="primary" block onPress={onDone} />
    </View>
  );
}

// ── MonthlyDepositSummaryCard — account-page summary card ────
export function MonthlyDepositSummaryCard({
  deposit,
  onClick,
  style,
}: {
  deposit: MonthlyDepositConfig;
  onClick?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, dark } = useRyTheme();
  const tints = ryTints(dark);
  const { t, lang } = useT();
  return (
    <View
      style={[
        styles.summary,
        { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle },
        shadowCard,
        style,
      ]}>
      <Pressable
        onPress={onClick}
        style={({ pressed }) => [styles.summaryRow, pressed && { backgroundColor: colors.bgSubtle }]}>
        <View style={[styles.optionIcon, { backgroundColor: tints.mint100 }]}>
          <RyIcon name="fa-calendar-day" size={15} color={colors.primaryMain} />
        </View>
        <View style={styles.optionBody}>
          <Text style={[ryFont('700'), styles.summaryTitle, { color: colors.fgPrimary }]}>
            {t('md.summary.permonth', mdFmt(deposit.amount))}
          </Text>
          <Text style={[ryFont('400'), styles.optionSub, { color: colors.fgSecondary }]}>
            {t('md.summary.every', mdEveryPhrase(lang, deposit))}
          </Text>
        </View>
        <RyIcon name="fa-chevron-right" size={12} color={colors.fgDisabled} />
      </Pressable>
      <AlertBanner
        variant="info"
        body={t('md.upcoming', mdFmtDate(lang, mdDepositDate(deposit)))}
        style={styles.summaryBanner}
      />
    </View>
  );
}

// ── MonthlyDepositStopBody — stop confirmation ───────────────
export function MonthlyDepositStopBody({
  deposit,
  onKeep,
  onStop,
}: {
  deposit: MonthlyDepositConfig;
  onKeep: () => void;
  onStop: () => void;
}) {
  const { colors } = useRyTheme();
  const { t, lang } = useT();
  return (
    <View style={styles.success}>
      <View style={[styles.successIco, { backgroundColor: colors.warningBackground }]}>
        <RyIcon name="fa-triangle-exclamation" size={28} color={colors.warningDark} />
      </View>
      <Text style={[ryFont('700'), styles.successHeading, { color: colors.fgPrimary }]}>
        {t('md.stop.title')}
      </Text>
      <Text style={[ryFont('400'), styles.stopBody, { color: colors.fgSecondary }]}>
        {t('md.stop.body', mdFmt(deposit.amount), mdRecur(lang, deposit))}
      </Text>
      <View style={styles.stopActions}>
        <RyButton title={t('md.stop.keep')} variant="outlined" block onPress={onKeep} />
        <RyButton title={t('md.stop.confirm')} variant="danger" block onPress={onStop} />
      </View>
    </View>
  );
}

// ── controller — owns sheet/dialog navigation ────────────────
export type MonthlyDepositsFlowProps = {
  view: MdView;
  setView: (v: MdView) => void;
  deposit: MonthlyDepositConfig | null | undefined;
  account: MdAccountLike;
  onSave: (dep: MonthlyDepositConfig) => void;
  onStop: () => void;
};

export function MonthlyDepositsFlow({
  view,
  setView,
  deposit,
  account,
  onSave,
  onStop,
}: MonthlyDepositsFlowProps) {
  const { t } = useT();
  const sheetOpen =
    view === 'options' || view === 'setup' || view === 'edit' || view === 'success' || view === 'bank';
  const sheetTitle =
    view === 'options'
      ? t('md.title.options')
      : view === 'setup'
        ? t('md.title.setup')
        : view === 'edit'
          ? t('md.title.edit')
          : view === 'bank'
            ? t('md.title.bank')
            : '';

  return (
    <>
      <BaseDialog
        open={sheetOpen}
        onClose={() => setView(null)}
        title={sheetTitle || undefined}
        size="medium">
        {view === 'options' ? (
          <MonthlyDepositOptions onMonthly={() => setView('setup')} onBank={() => setView('bank')} />
        ) : null}
        {view === 'bank' ? <MonthlyDepositBankInfo account={account} onDone={() => setView(null)} /> : null}
        {view === 'setup' || view === 'edit' ? (
          <MonthlyDepositForm
            mode={view}
            initial={view === 'edit' ? (deposit ?? null) : null}
            onCancel={() => setView(null)}
            onStop={() => setView('stop')}
            onSubmit={(dep) => {
              onSave(dep);
              setView(view === 'edit' ? null : 'success');
            }}
          />
        ) : null}
        {view === 'success' && deposit ? (
          <MonthlyDepositSuccess deposit={deposit} onDone={() => setView(null)} />
        ) : null}
      </BaseDialog>

      <BaseDialog open={view === 'stop'} onClose={() => setView('edit')} size="small">
        {view === 'stop' && deposit ? (
          <MonthlyDepositStopBody
            deposit={deposit}
            onKeep={() => setView('edit')}
            onStop={() => {
              onStop();
              setView(null);
            }}
          />
        ) : null}
      </BaseDialog>
    </>
  );
}

const styles = StyleSheet.create({
  // form
  formIntro: { fontSize: 14, lineHeight: 14 * 1.5, marginBottom: 18 },
  field: { marginBottom: 18 },
  label: { fontSize: 13, letterSpacing: 13 * 0.04, marginBottom: 8 },
  amount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingHorizontal: 16,
  },
  amountInput: { flex: 1, fontSize: 18, paddingVertical: 14, fontVariant: ['tabular-nums'] },
  amountCur: { fontSize: 15 },
  // radio rows
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  radio: {
    flexShrink: 0,
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioFill: { width: 10, height: 10, borderRadius: 999 },
  radioLabel: { fontSize: 15 },
  radioControl: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center' },
  radioControlSelects: { gap: 8 },
  // day field
  dayField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 76,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: radii.lg,
  },
  dayFieldVal: { fontSize: 17, lineHeight: 20, fontVariant: ['tabular-nums'] },
  dayFieldCaret: { width: 2, height: 20, borderRadius: 1, marginLeft: 3 },
  // numpad
  numpadWrap: { overflow: 'hidden', marginHorizontal: -16, marginTop: 8 },
  numpad: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: NUMPAD_H,
    borderTopWidth: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  numpadBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  numpadTitle: { fontSize: 13 },
  numpadDone: { fontSize: 16, paddingVertical: 4, paddingHorizontal: 6 },
  numpadRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  key: { flex: 1, height: 48, alignItems: 'center', justifyContent: 'center' },
  keyDigit: {
    borderRadius: 10,
    // 0 1px 2px rgba(20,30,28,0.12)
    shadowColor: '#141E1C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 1,
    elevation: 1,
  },
  keyText: { fontSize: 24, fontVariant: ['tabular-nums'] },
  // select
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 12,
  },
  selectText: { fontSize: 14 },
  optRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optText: { fontSize: 15 },
  // helper
  helper: { fontSize: 13, lineHeight: 13 * 1.45, marginTop: 2 },
  // stop row
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: radii.lg,
  },
  stopIcon: {
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stopTitle: { flex: 1, fontSize: 15 },
  // footer
  footer: { flexDirection: 'row', gap: 12, marginTop: 8 },
  footerBtn: { flex: 1 },
  // success / stop dialog
  success: { alignItems: 'center', paddingTop: 8, paddingHorizontal: 4, paddingBottom: 4 },
  successIco: {
    width: 64,
    height: 64,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successHeading: { fontSize: 20, marginBottom: 10, textAlign: 'center' },
  successBody: { fontSize: 15, lineHeight: 15 * 1.5, marginBottom: 12, textAlign: 'center' },
  successNote: { fontSize: 13, lineHeight: 13 * 1.5, marginBottom: 22, textAlign: 'center' },
  stopBody: { fontSize: 15, lineHeight: 15 * 1.5, marginBottom: 22, textAlign: 'center' },
  stopActions: { alignSelf: 'stretch', gap: 10 },
  // options rows
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optionIconGap: { backgroundColor: 'transparent', borderWidth: 1, borderStyle: 'dashed' },
  optionBody: { flex: 1, minWidth: 0 },
  optionTitle: { fontSize: 15, lineHeight: 20 },
  optionSub: { fontSize: 12, lineHeight: 16, marginTop: 2 },
  // summary card
  summary: {
    borderWidth: 1,
    borderRadius: radii.xl,
    overflow: 'hidden',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  summaryTitle: { fontSize: 16, lineHeight: 21 },
  summaryBanner: { marginHorizontal: 12, marginBottom: 12 },
});
