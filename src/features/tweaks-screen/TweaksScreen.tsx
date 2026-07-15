// TweaksScreen — the design's TweaksPanel (app.jsx lines ~1040-1177)
// reborn as an in-app screen (PORTING_GUIDE §My Resurs + Tweaks).
// Q3-only: no Timeline, no Device, no Inspector, no White canvas.
//
// Controls: toggles are RN Switches, selects open a BaseDialog option
// list (checkmark on the selected entry), radios with ≤3 short options
// render as a Segmented pill.

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BaseDialog,
  CompactHeader,
  RyButton,
  RyCard,
  RyIcon,
  RyPage,
  SectionTitle,
  Segmented,
  useCompactHeaderOffset,
  useStickyHeaderScroll,
} from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { useSession, useTweaks, type Tweaks } from '@/src/tweaks/TweaksProvider';

type Option = { value: string; desc?: string };

/* ── Row shells ──────────────────────────────────────────────── */

function RowShell({
  label,
  last = false,
  onPress,
  children,
}: {
  label: string;
  last?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}) {
  const { colors } = useRyTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.borderSubtle },
        last && styles.rowLast,
        pressed && onPress != null && { backgroundColor: colors.bgSubtle },
      ]}>
      <Text style={[ryFont('500'), styles.rowLabel, { color: colors.fgPrimary }]} numberOfLines={1}>
        {label}
      </Text>
      {children}
    </Pressable>
  );
}

/** Select row — opens a BaseDialog listing the options. */
function SelectRow({
  label,
  value,
  options,
  onChange,
  last = false,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
  last?: boolean;
}) {
  const { colors } = useRyTheme();
  const [open, setOpen] = useState(false);
  return (
    <>
      <RowShell label={label} last={last} onPress={() => setOpen(true)}>
        <Text style={[ryFont('400'), styles.rowValue, { color: colors.fgSecondary }]} numberOfLines={1}>
          {value}
        </Text>
        <RyIcon name="fa-chevron-right" size={12} color={colors.fgDisabled} />
      </RowShell>
      <BaseDialog open={open} onClose={() => setOpen(false)} title={label}>
        <RyCard style={styles.optionCard}>
          {options.map((opt, i) => {
            const active = opt.value === value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={({ pressed }) => [
                  styles.option,
                  { borderBottomColor: colors.borderSubtle },
                  i === options.length - 1 && styles.rowLast,
                  pressed && { backgroundColor: colors.bgSubtle },
                ]}>
                <View style={styles.optionBody}>
                  <Text
                    style={[
                      ryFont(active ? '700' : '500'),
                      styles.optionTitle,
                      { color: colors.fgPrimary },
                    ]}>
                    {opt.value}
                  </Text>
                  {opt.desc ? (
                    <Text
                      style={[ryFont('400'), styles.optionDesc, { color: colors.fgSecondary }]}>
                      {opt.desc}
                    </Text>
                  ) : null}
                </View>
                {active ? <RyIcon name="fa-check" size={15} color={colors.primaryMain} /> : null}
              </Pressable>
            );
          })}
        </RyCard>
      </BaseDialog>
    </>
  );
}

/** Toggle row — RN Switch styled to the design palette. */
function ToggleRow({
  label,
  value,
  onChange,
  last = false,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  const { colors } = useRyTheme();
  return (
    <RowShell label={label} last={last}>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.grey300, true: colors.primaryMain }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={colors.grey300}
      />
    </RowShell>
  );
}

/** Radio row — Segmented pill on the right (≤3 short options). */
function RadioRow({
  label,
  value,
  options,
  onChange,
  last = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  last?: boolean;
}) {
  return (
    <RowShell label={label} last={last}>
      <Segmented
        options={options.map((o) => ({ id: o, label: o }))}
        value={value}
        onChange={onChange}
        style={styles.segmented}
      />
    </RowShell>
  );
}

/* ── Screen ──────────────────────────────────────────────────── */

const PERSONAS: Tweaks['persona'][] = ['John', 'Bill', 'Kim', 'Eva', 'Maja', 'Alex', 'Lena'];
const STATUS_OPTIONS: Tweaks['invoiceStatus'][] = [
  'Default',
  'Unpaid',
  'Overdue',
  'Missed',
  'Scheduled',
  'Partially paid',
  'Paid',
];
const ACTIVITY_OPTIONS: Tweaks['sandboxActivity'][] = [
  'Current Activity',
  'Wallet Hero · Bjarne',
  'invoice card model - Sara',
  'Carousel',
];
const WALLET_OPTIONS: Tweaks['walletLayout'][] = ['Product cards', 'Large cards', 'Account Cards'];
const FAMILY_OPTIONS: Tweaks['familyVersion'][] = ['Current', "Bjarne's sandbox"];

export function TweaksScreen(): React.JSX.Element {
  const { t } = useT();
  const { colors } = useRyTheme();
  const { tweaks, setTweak, reset } = useTweaks();
  const { logout } = useSession();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();
  const topOffset = useCompactHeaderOffset();

  const backToLogin = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.bgDefault }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: topOffset,
          paddingBottom: insets.bottom + 40,
        }}>
        <RyPage>
          {/* Prototype */}
          <SectionTitle style={styles.firstSection}>{t('tweaks.section.prototype')}</SectionTitle>
          <RyButton
            title={t('tweaks.reset')}
            variant="outlined"
            sm
            onPress={reset}
            style={styles.reset}
          />
          <RyCard>
            <SelectRow
              label={t('tweaks.persona')}
              value={tweaks.persona}
              options={PERSONAS.map((p) => ({ value: p, desc: t('tweaks.persona.' + p) }))}
              onChange={(v) => setTweak('persona', v as Tweaks['persona'])}
            />
            <SelectRow
              label={t('tweaks.invoice_status')}
              value={tweaks.invoiceStatus}
              options={STATUS_OPTIONS.map((s) => ({ value: s }))}
              onChange={(v) => setTweak('invoiceStatus', v as Tweaks['invoiceStatus'])}
            />
            <RadioRow
              label={t('tweaks.language')}
              value={tweaks.lang}
              options={['English', 'Svenska']}
              onChange={(v) => setTweak('lang', v as Tweaks['lang'])}
              last
            />
          </RyCard>

          {/* Sandbox */}
          <SectionTitle>{t('tweaks.section.sandbox')}</SectionTitle>
          <RyCard>
            <SelectRow
              label={t('tweaks.family_version')}
              value={tweaks.familyVersion}
              options={FAMILY_OPTIONS.map((f) => ({ value: f }))}
              onChange={(v) => setTweak('familyVersion', v as Tweaks['familyVersion'])}
            />
            <ToggleRow
              label={t('tweaks.dark_theme')}
              value={tweaks.darkTheme}
              onChange={(v) => setTweak('darkTheme', v)}
            />
            <ToggleRow
              label={t('tweaks.seed_deposit')}
              value={tweaks.autoSaveSeed}
              onChange={(v) => setTweak('autoSaveSeed', v)}
            />
            <RadioRow
              label={t('tweaks.confirm_pay')}
              value={tweaks.confirmPayVariant}
              options={['Default', 'PPI version']}
              onChange={(v) => setTweak('confirmPayVariant', v as Tweaks['confirmPayVariant'])}
            />
            <SelectRow
              label={t('tweaks.activity')}
              value={tweaks.sandboxActivity}
              options={ACTIVITY_OPTIONS.map((a) => ({ value: a }))}
              onChange={(v) => setTweak('sandboxActivity', v as Tweaks['sandboxActivity'])}
            />
            <SelectRow
              label={t('tweaks.wallet_layout')}
              value={tweaks.walletLayout}
              options={WALLET_OPTIONS.map((w) => ({ value: w }))}
              onChange={(v) => setTweak('walletLayout', v as Tweaks['walletLayout'])}
              last
            />
          </RyCard>

          {/* Session */}
          <SectionTitle>{t('tweaks.section.session')}</SectionTitle>
          <RyCard>
            <RadioRow
              label={t('tweaks.login_layout')}
              value={tweaks.loginLayout}
              options={['Natt', 'Dag']}
              onChange={(v) => setTweak('loginLayout', v as Tweaks['loginLayout'])}
              last
            />
          </RyCard>
          <RyButton
            title={t('tweaks.back_to_login')}
            variant="outlined"
            block
            onPress={backToLogin}
            style={styles.backToLogin}
          />
        </RyPage>
      </Animated.ScrollView>
      <CompactHeader title={t('tweaks.title')} onBack={() => router.back()} scrollY={scrollY} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  firstSection: { marginTop: 0 },
  reset: { marginBottom: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: { flex: 1, fontSize: 15, lineHeight: 20 },
  rowValue: { fontSize: 13, maxWidth: 160, textAlign: 'right' },
  segmented: { marginBottom: 0, flexShrink: 0, minWidth: 170 },
  optionCard: { marginBottom: 0 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionBody: { flex: 1, minWidth: 0 },
  optionTitle: { fontSize: 15, lineHeight: 20 },
  optionDesc: { fontSize: 12, lineHeight: 16, marginTop: 2 },
  backToLogin: { marginTop: 12 },
});
