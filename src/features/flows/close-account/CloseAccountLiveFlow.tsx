// CloseAccountLiveFlow — the live "Close account / Terminate agreement" flow,
// ported from design-reference/close-account-flow.jsx (SBCloseAccountFlow with
// initialStep='info' + the CloseAccountLiveFlow wrapper + CAF_CSS).
//
// Steps: Information page → Verify email (tap Verify → 6-digit code →
// verified; "Change email" resets verification) → Reason for termination
// (reason + checkbox gate the CTA) → Success.
//
// Only the live flow is ported (Storybook section wrappers skipped). The live
// flow always uses the credit-account information page, with the product name
// and account rows injected by the caller — exactly like the design's wrapper.
//
// RN deviation: the design's native <select> for the termination reason opens
// a small option sheet (BaseDialog) instead of a browser dropdown.

import React, { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AlertBanner,
  BaseDialog,
  CompactHeader,
  RyButton,
  RyIcon,
  ryTints,
  useCompactHeaderOffset,
} from '@/src/components/ry';
import { RY_TODAY } from '@/src/data';
import { useT } from '@/src/i18n';
import { radii } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

const ryFont = (weight: '400' | '500' | '600' | '700') =>
  ({
    fontFamily: Number(weight) >= 600 ? 'Inter-Bold' : 'Inter-Regular',
    fontWeight: weight,
  }) as const;

const CA_EMAIL = 'pedri@barca.es';

// The live flow's (credit-account) information page — CA_PRODUCTS['credit'].
const CA_INFO = {
  title: 'ca.info.title',
  intro: 'ca.info.intro',
  footer: 'ca.info.footer',
  card: ['ca.info.happens.b1', 'ca.info.happens.b2'],
  sections: [
    { label: 'ca.info.oblig.title', bullets: ['ca.info.oblig.b1', 'ca.info.oblig.b2'] },
    {
      label: 'ca.info.before.title',
      sub: 'ca.info.before.sub',
      bullets: ['ca.info.before.b1', 'ca.info.before.b2'],
    },
  ],
};

const CA_REASONS = [
  'ca.reason.opt1',
  'ca.reason.opt2',
  'ca.reason.opt3',
  'ca.reason.opt4',
  'ca.reason.opt5',
  'ca.reason.opt6',
  'ca.reason.opt7',
];

const todayISO = (): string => {
  try {
    return new Date(RY_TODAY).toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
};

export type CloseAccountAcctRow = { l: string; v: string };

export type CloseAccountLiveFlowProps = {
  productName?: string;
  acct?: CloseAccountAcctRow[];
  onExit: () => void;
};

type CaStep = 'info' | 'verify' | 'reason' | 'success';
type CaVerifyView = 'verify' | 'code' | 'email';

// ── Shared step scaffold: header + scrollable body + fixed footer ──
function CafScreen({
  title,
  onBack,
  children,
  footer,
}: {
  title?: string;
  onBack?: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const { colors } = useRyTheme();
  const insets = useSafeAreaInsets();
  const headerOffset = useCompactHeaderOffset();
  return (
    <View style={[styles.screen, { backgroundColor: colors.bgDefault }]}>
      <ScrollView
        contentContainerStyle={[
          styles.body,
          { paddingTop: title ? headerOffset + 4 : insets.top + 28 },
        ]}>
        {children}
      </ScrollView>
      {footer ? (
        <View
          style={[
            styles.foot,
            {
              borderTopColor: colors.borderSubtle,
              backgroundColor: colors.bgDefault,
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}>
          {footer}
        </View>
      ) : null}
      {title ? <CompactHeader title={title} onBack={onBack} /> : null}
    </View>
  );
}

function Bullets({ items }: { items: string[] }) {
  const { colors } = useRyTheme();
  const { t } = useT();
  return (
    <View style={styles.list}>
      {items.map((k, i) => (
        <View key={i} style={styles.listItem}>
          <Text style={[ryFont('400'), styles.listBullet, { color: colors.fgPrimary }]}>•</Text>
          <Text style={[ryFont('400'), styles.listText, { color: colors.fgPrimary }]}>{t(k)}</Text>
        </View>
      ))}
    </View>
  );
}

export function CloseAccountLiveFlow({ productName, acct, onExit }: CloseAccountLiveFlowProps) {
  const { colors, dark } = useRyTheme();
  const tints = ryTints(dark);
  const { t, tName } = useT();

  const name = productName || 'Resurs World';
  const acctRows: CloseAccountAcctRow[] =
    acct && acct.length
      ? acct
      : [
          { l: 'ca.acct.debt', v: '0 kr' },
          { l: 'ca.acct.credit_limit', v: '40 000 kr' },
        ];

  // Live flow starts on the information page (the in-app Services list is the
  // entry point); cancel/close pops the nav stack via onExit.
  const [step, setStep] = useState<CaStep>('info');
  const [view, setView] = useState<CaVerifyView>('verify');
  const [email, setEmail] = useState(CA_EMAIL);
  const [emailDraft, setEmailDraft] = useState(CA_EMAIL);
  const [verified, setVerified] = useState(false);
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [reason, setReason] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [reasonOpen, setReasonOpen] = useState(false);
  const codeRefs = useRef<(TextInput | null)[]>([]);

  const emailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((e || '').trim());
  const saveEmail = () => {
    if (!emailValid(emailDraft)) return;
    setEmail(emailDraft.trim());
    setVerified(false);
    setCode(['', '', '', '', '', '']);
    setView('verify');
  };
  const leave = onExit;

  const onCodeChange = (i: number, val: string) => {
    const d = (val || '').replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[i] = d;
    setCode(next);
    if (d && i < 5) codeRefs.current[i + 1]?.focus();
    if (next.every((c) => c !== '')) {
      setVerified(true);
      setView('verify');
    }
  };
  const onCodeKey = (i: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && !code[i] && i > 0) codeRefs.current[i - 1]?.focus();
  };

  // ── Information page ──
  if (step === 'info') {
    const info = CA_INFO;
    return (
      <CafScreen
        title={t(info.title)}
        onBack={leave}
        footer={
          <>
            <RyButton title={t('ca.cancel')} variant="outlined" block onPress={leave} />
            <RyButton title={t('ca.info.cta')} variant="primary" block onPress={() => setStep('verify')} />
          </>
        }>
        <Text style={[ryFont('400'), styles.intro, { color: colors.fgSecondary }]}>
          {t(info.intro)}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle }]}>
          <Text style={[ryFont('700'), styles.cardTitle, { color: colors.fgPrimary }]}>
            {tName(name)}
          </Text>
          <Bullets items={info.card} />
        </View>
        {info.sections.map((s, i) => (
          <React.Fragment key={i}>
            <Text style={[ryFont('500'), styles.secLabel, { color: colors.fgPrimary }]}>
              {t(s.label)}
            </Text>
            {'sub' in s && s.sub ? (
              <Text style={[ryFont('400'), styles.secSub, { color: colors.fgSecondary }]}>
                {t(s.sub)}
              </Text>
            ) : null}
            <View style={[styles.card, { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle }]}>
              <Bullets items={s.bullets} />
            </View>
          </React.Fragment>
        ))}
        <Text style={[ryFont('400'), styles.footNote, { color: colors.fgSecondary }]}>
          {t(info.footer)}
        </Text>
      </CafScreen>
    );
  }

  // ── Verify email (+ 6-digit code / change-email sub-views) ──
  if (step === 'verify') {
    if (view === 'code') {
      return (
        <CafScreen title={t('ca.verify.title')} onBack={() => setView('verify')}>
          <Text style={[ryFont('700'), styles.codeTitle, { color: colors.fgPrimary }]}>
            {t('ca.code.title')}
          </Text>
          <Text style={[ryFont('400'), styles.intro, { color: colors.fgSecondary }]}>
            {t('ca.code.sub')}
          </Text>
          <View style={[styles.emailConfirm, { backgroundColor: colors.bgSubtle }]}>
            <RyIcon name="fa-envelope" regular size={16} color={colors.fgPrimary} />
            <Text style={[ryFont('400'), styles.emailConfirmText, { color: colors.fgPrimary }]}>
              {email}
            </Text>
          </View>
          <View style={styles.codeRow}>
            {code.map((c, i) => (
              <TextInput
                key={i}
                ref={(el) => {
                  codeRefs.current[i] = el;
                }}
                style={[
                  ryFont('700'),
                  styles.codeBox,
                  {
                    backgroundColor: colors.bgPaper,
                    borderColor: colors.borderSubtle,
                    color: colors.fgPrimary,
                  },
                ]}
                keyboardType="number-pad"
                value={c}
                maxLength={1}
                onChangeText={(v) => onCodeChange(i, v)}
                onKeyPress={(e) => onCodeKey(i, e)}
              />
            ))}
          </View>
          <Pressable onPress={() => setCode(['', '', '', '', '', ''])} hitSlop={6}>
            <Text style={[ryFont('600'), styles.link, { color: colors.primaryMain }]}>
              {t('ca.code.resend')}
            </Text>
          </Pressable>
        </CafScreen>
      );
    }
    if (view === 'email') {
      return (
        <CafScreen
          title={t('ca.email.title')}
          onBack={() => setView('verify')}
          footer={
            <>
              <RyButton title={t('ca.cancel')} variant="outlined" block onPress={() => setView('verify')} />
              <RyButton
                title={t('ca.email.save')}
                variant="primary"
                block
                disabled={!emailValid(emailDraft)}
                onPress={saveEmail}
              />
            </>
          }>
          <Text style={[ryFont('400'), styles.intro, { color: colors.fgSecondary }]}>
            {t('ca.email.sub')}
          </Text>
          <Text style={[ryFont('600'), styles.fieldLabel, { color: colors.fgSecondary }]}>
            {t('ca.email.label')}
          </Text>
          <TextInput
            style={[
              ryFont('400'),
              styles.textInput,
              {
                backgroundColor: colors.bgPaper,
                borderColor: colors.borderSubtle,
                color: colors.fgPrimary,
              },
            ]}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={emailDraft}
            onChangeText={setEmailDraft}
            placeholder="name@example.com"
            placeholderTextColor={colors.fgDisabled}
          />
          {emailDraft.trim() !== '' && !emailValid(emailDraft) ? (
            <Text style={[ryFont('400'), styles.fieldErr, { color: colors.errorMain }]}>
              {t('ca.email.invalid')}
            </Text>
          ) : null}
        </CafScreen>
      );
    }
    return (
      <CafScreen
        title={t('ca.verify.title')}
        onBack={() => setStep('info')}
        footer={
          <>
            <RyButton title={t('ca.cancel')} variant="outlined" block onPress={leave} />
            <RyButton
              title={t('ca.verify.continue')}
              variant="primary"
              block
              disabled={!verified}
              onPress={() => setStep('reason')}
            />
          </>
        }>
        <Text style={[ryFont('400'), styles.intro, { color: colors.fgSecondary }]}>
          {t('ca.verify.intro')}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle }]}>
          <Text style={[ryFont('700'), styles.cardTitle, { color: colors.fgPrimary }]}>
            {t('ca.verify.card.title')}
          </Text>
          <Text style={[ryFont('400'), styles.secSub, { color: colors.fgSecondary, marginTop: 2, marginBottom: 6 }]}>
            {t('ca.verify.card.sub')}
          </Text>
          <Pressable
            disabled={verified}
            onPress={() => setView('code')}
            style={styles.emailRow}>
            <RyIcon name="fa-envelope" regular size={18} color={colors.iconMuted} />
            <View style={styles.emailBody}>
              <Text style={[ryFont('400'), styles.emailK, { color: colors.fgSecondary }]}>
                {t('ca.verify.email_label')}
              </Text>
              <Text style={[ryFont('400'), styles.emailV, { color: colors.fgSecondary }]}>
                {email}
              </Text>
            </View>
            {verified ? (
              <View style={styles.verifiedWrap}>
                <RyIcon name="fa-circle-check" size={14} color={colors.successDark} />
                <Text style={[ryFont('700'), styles.verifyCta, { color: colors.successDark }]}>
                  {t('ca.verify.verified')}
                </Text>
              </View>
            ) : (
              <View style={styles.verifiedWrap}>
                <Text style={[ryFont('700'), styles.verifyCta, { color: colors.fgPrimary }]}>
                  {t('ca.verify.verify')}
                </Text>
                <RyIcon name="fa-chevron-right" size={12} color={colors.fgDisabled} />
              </View>
            )}
          </Pressable>
          <Pressable
            onPress={() => {
              setEmailDraft(email);
              setView('email');
            }}
            style={[styles.changeEmail, { borderTopColor: colors.borderSubtle }]}>
            <RyIcon name="fa-pen" size={12} color={colors.primaryMain} />
            <Text style={[ryFont('600'), styles.changeEmailText, { color: colors.primaryMain }]}>
              {t('ca.verify.change')}
            </Text>
          </Pressable>
        </View>
      </CafScreen>
    );
  }

  // ── Reason for termination ──
  if (step === 'reason') {
    const canSubmit = reason !== '' && confirm;
    return (
      <CafScreen
        title={t('ca.info.title')}
        onBack={() => setStep('verify')}
        footer={
          <>
            <RyButton title={t('ca.cancel')} variant="outlined" block onPress={leave} />
            <RyButton
              title={t('ca.reason.submit')}
              variant="primary"
              block
              disabled={!canSubmit}
              onPress={() => setStep('success')}
            />
          </>
        }>
        <Text style={[ryFont('400'), styles.intro, { color: colors.fgSecondary }]}>
          {t('ca.reason.intro')}
        </Text>
        <Text style={[ryFont('500'), styles.secLabel, { color: colors.fgPrimary }]}>
          {t('ca.reason.acct_title')}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle }]}>
          <Text style={[ryFont('600'), styles.acctName, { color: colors.fgPrimary, borderBottomColor: colors.borderSubtle }]}>
            {tName(name)}
          </Text>
          {acctRows.map((r, i) => (
            <View
              key={i}
              style={[
                styles.kv,
                { borderBottomColor: colors.borderSubtle },
                i === acctRows.length - 1 && styles.kvLast,
              ]}>
              <Text style={[ryFont('400'), styles.kvK, { color: colors.fgSecondary }]}>{t(r.l)}</Text>
              <Text style={[ryFont('600'), styles.kvV, { color: colors.fgPrimary }]}>{r.v}</Text>
            </View>
          ))}
        </View>
        <Text style={[ryFont('500'), styles.secLabel, { color: colors.fgPrimary }]}>
          {t('ca.reason.label')}
        </Text>
        <Pressable
          onPress={() => setReasonOpen(true)}
          style={[styles.selectField, { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle }]}>
          <Text
            style={[
              ryFont('400'),
              styles.selectText,
              { color: reason ? colors.fgPrimary : colors.fgSecondary },
            ]}
            numberOfLines={1}>
            {reason ? t(reason) : t('ca.reason.placeholder')}
          </Text>
          <RyIcon name="fa-chevron-down" size={13} color={colors.iconMuted} />
        </Pressable>
        <AlertBanner variant="info" body={t('ca.reason.processing')} style={styles.banner} />
        <Pressable onPress={() => setConfirm((v) => !v)} style={styles.checkRow}>
          <View
            style={[
              styles.check,
              confirm
                ? { backgroundColor: colors.primaryMain, borderColor: colors.primaryMain }
                : { borderColor: colors.iconMuted },
            ]}>
            {confirm ? <RyIcon name="fa-check" size={12} color="#FFFFFF" /> : null}
          </View>
          <Text style={[ryFont('400'), styles.checkLbl, { color: colors.fgPrimary }]}>
            {t('ca.reason.confirm')}
          </Text>
        </Pressable>

        {/* Reason option sheet (the design's native <select>) */}
        <BaseDialog
          open={reasonOpen}
          onClose={() => setReasonOpen(false)}
          title={t('ca.reason.label')}
          size="small">
          <View style={[styles.card, { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle, padding: 0 }]}>
            {CA_REASONS.map((r, i) => (
              <Pressable
                key={r}
                onPress={() => {
                  setReason(r);
                  setReasonOpen(false);
                }}
                style={({ pressed }) => [
                  styles.reasonRow,
                  { borderBottomColor: i === CA_REASONS.length - 1 ? 'transparent' : colors.borderSubtle },
                  i === CA_REASONS.length - 1 && { borderBottomWidth: 0 },
                  pressed && { backgroundColor: colors.bgSubtle },
                ]}>
                <Text style={[ryFont('400'), styles.reasonText, { color: colors.fgPrimary }]}>
                  {t(r)}
                </Text>
                {reason === r ? (
                  <RyIcon name="fa-check" size={14} color={colors.primaryMain} />
                ) : null}
              </Pressable>
            ))}
          </View>
        </BaseDialog>
      </CafScreen>
    );
  }

  // ── Success ──
  return (
    <CafScreen>
      <View style={styles.success}>
        {/* `.ry-result-badge` — dark-green disc, white glyph, mint halo */}
        <View style={[styles.badgeHalo, { backgroundColor: tints.mint100 }]}>
          <View style={[styles.badge, { backgroundColor: colors.primaryMain }]}>
            <RyIcon name="fa-check" size={28} color="#FFFFFF" />
          </View>
        </View>
        <Text style={[ryFont('700'), styles.successTitle, { color: colors.fgPrimary }]}>
          {t('ca.success.title')}
        </Text>
        <View
          style={[
            styles.card,
            styles.successCard,
            { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle },
          ]}>
          <View style={[styles.kv, { borderBottomColor: colors.borderSubtle }]}>
            <Text style={[ryFont('400'), styles.kvK, { color: colors.fgSecondary }]}>
              {t('ca.success.case')}
            </Text>
            <Text style={[ryFont('400'), styles.kvV, { color: colors.fgPrimary }]}>{todayISO()}</Text>
          </View>
          <View style={[styles.kv, { borderBottomColor: colors.borderSubtle }]}>
            <Text style={[ryFont('400'), styles.kvK, { color: colors.fgSecondary }]}>
              {t('ca.success.product')}
            </Text>
            <Text style={[ryFont('400'), styles.kvV, { color: colors.fgPrimary }]}>
              {tName(name).toUpperCase()}
            </Text>
          </View>
          <View style={[styles.kv, styles.kvLast, { borderBottomColor: colors.borderSubtle }]}>
            <Text style={[ryFont('400'), styles.kvK, { color: colors.fgSecondary }]}>
              {t('ca.success.processing')}
            </Text>
            <Text style={[ryFont('400'), styles.kvV, { color: colors.fgPrimary }]}>
              {t('ca.success.processing_val')}
            </Text>
          </View>
        </View>
        <Text style={[ryFont('400'), styles.successTrack, { color: colors.fgSecondary }]}>
          {t('ca.success.track')}
        </Text>
        <RyButton title={t('ca.success.close')} variant="primary" block onPress={leave} />
      </View>
    </CafScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  body: { paddingHorizontal: 16, paddingBottom: 18 },
  foot: {
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  intro: { fontSize: 14, lineHeight: 14 * 1.5, marginTop: 4, marginBottom: 16 },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  cardTitle: { fontSize: 15, marginBottom: 8 },
  list: { paddingLeft: 2 },
  listItem: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  listBullet: { fontSize: 14, lineHeight: 14 * 1.5 },
  listText: { flex: 1, fontSize: 14, lineHeight: 14 * 1.5 },
  secLabel: { fontSize: 14, marginTop: 18, marginBottom: 8 },
  secSub: { fontSize: 13, lineHeight: 13 * 1.4, marginBottom: 8 },
  footNote: { fontSize: 13, lineHeight: 13 * 1.5, marginTop: 16 },
  // verify
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    paddingBottom: 2,
  },
  emailBody: { flex: 1, minWidth: 0 },
  emailK: { fontSize: 13 },
  emailV: { fontSize: 14, fontStyle: 'italic' },
  verifiedWrap: { flexDirection: 'row', alignItems: 'center', gap: 7, flexShrink: 0 },
  verifyCta: { fontSize: 14 },
  changeEmail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    paddingBottom: 2,
    borderTopWidth: 1,
  },
  changeEmailText: { fontSize: 14 },
  // code
  codeTitle: { fontSize: 20, marginBottom: 8 },
  emailConfirm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: radii.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  emailConfirmText: { fontSize: 14 },
  codeRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 16,
  },
  codeBox: {
    flex: 1,
    maxWidth: 46,
    height: 54,
    textAlign: 'center',
    fontSize: 22,
    borderWidth: 1,
    borderRadius: radii.md,
  },
  link: { fontSize: 14 },
  // email edit
  fieldLabel: { fontSize: 13, marginTop: 6, marginBottom: 6 },
  textInput: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
  },
  fieldErr: { fontSize: 13, marginTop: 8 },
  // reason
  acctName: {
    fontSize: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  kv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 16,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  kvLast: { borderBottomWidth: 0, paddingBottom: 0 },
  kvK: { fontSize: 14, flexShrink: 0 },
  kvV: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  selectText: { flex: 1, fontSize: 15 },
  banner: { marginTop: 16, marginBottom: 4 },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingTop: 18,
  },
  check: {
    width: 22,
    height: 22,
    flexShrink: 0,
    borderWidth: 1.5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkLbl: { flex: 1, fontSize: 14, lineHeight: 14 * 1.45 },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  reasonText: { flex: 1, fontSize: 15, lineHeight: 20 },
  // success
  success: { alignItems: 'stretch', paddingTop: 20, paddingHorizontal: 4 },
  badgeHalo: {
    width: 84,
    height: 84,
    borderRadius: 999,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 20,
    lineHeight: 20 * 1.25,
    textAlign: 'center',
    marginBottom: 22,
  },
  successCard: { alignSelf: 'stretch' },
  successTrack: {
    fontSize: 13,
    lineHeight: 13 * 1.5,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 22,
  },
});
