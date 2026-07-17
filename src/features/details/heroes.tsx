// Account/product heroes — 1:1 ports of details.jsx (`.ry-csh` card heroes,
// the `.ry-hero` themed/card heroes, GoldBentoHero's `.ry-fbh` bento grid,
// ryCreditFigures and the AccountDetailHero selector).
//
// Deviation: the CSS width grow-in transition on the usage bars is not
// animated (static widths) — visual values are otherwise traced 1:1.

import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { AlertBanner, RyIcon } from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import {
  rfmt,
  rfmtDate,
  RY_TODAY,
  type Account,
  type CreditAccount,
  type DepositAccount,
  type InvoiceAccount,
  type LoanAccount,
  type Money,
  type Product,
  type Purchase,
} from '@/src/data';
import { useT } from '@/src/i18n';
import { radii, shadowCard } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { CashbackInfoDialog } from './dialogs';

/* ============================================================
 * Formatting helpers
 * ============================================================ */

/** Two-decimal sv-SE grouping with regular spaces (FamilyBentoHero fmt2). */
export const fmt2 = (amt: number): string => {
  const sign = amt < 0 ? '−' : '';
  const v = Math.abs(amt);
  const [int, dec] = v.toFixed(2).split('.');
  const grouped = int!.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${sign}${grouped},${dec}`;
};

/** Whole-number sv-SE grouping with regular spaces. */
export const fmt0 = (amt: number): string => {
  const sign = amt < 0 ? '−' : '';
  const grouped = String(Math.round(Math.abs(amt))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${sign}${grouped}`;
};

/* ============================================================
 * ryCreditFigures — Resurs Family hero numbers derived from the ledger.
 * ============================================================ */

export type CreditFigures = {
  limit: number;
  billed: number;
  purchases: number;
  used: number;
  avail: number;
  cashback: number;
};

export function ryCreditFigures(cred: CreditAccount | undefined | null, p: Product): CreditFigures {
  if (!cred) return { limit: 1, billed: 0, purchases: 0, used: 0, avail: 1, cashback: 0 };
  const limit = cred.creditLimit ? cred.creditLimit.amount || 0 : 0;
  const rows: Purchase[] = (p.purchases || []).filter(
    (t) => t.accountId === cred.id && t.type === 'purchase',
  );

  const purchases = rows.reduce((s, t) => s + (t.amount?.amount || 0), 0);
  const SETTLED = ['paid', 'voided'];
  const statements = (p.paymentRequests || []).filter(
    (pr) => pr.accountId === cred.id && pr.kind === 'manadsavi' && !SETTLED.includes(pr.status),
  );
  const statementTotal = statements.reduce((s, pr) => s + (pr.remainingAmount?.amount || 0), 0);
  const statementPartPay = statements.reduce(
    (s, pr) =>
      s +
      (pr.statementBreakdown || [])
        .filter((b) => /part.?payment/i.test(b.label))
        .reduce((a, b) => a + (b.amount || 0), 0),
    0,
  );
  const partPayRemaining = (p.accounts || [])
    .filter(
      (a): a is InvoiceAccount =>
        a.type === 'invoiceAccount' && a.origin === 'superkontoBreakout' && !!a.remainingBalance,
    )
    .reduce((s, a) => s + (a.remainingBalance.amount || 0), 0);
  const billed = statementTotal - statementPartPay + partPayRemaining;
  const used = billed + purchases;
  const avail = Math.max(0, limit - used);
  const cashback = rows
    .filter((t) => !t.preliminary)
    .reduce((s, t) => s + Math.floor((t.amount?.amount || 0) / 100), 0);
  return { limit, billed, purchases, used, avail, cashback };
}

/* ============================================================
 * Csh building blocks — `.ry-csh` card + bar + legend + footer.
 * ============================================================ */

export function CshCard({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { colors } = useRyTheme();
  return (
    <View
      style={[
        styles.csh,
        shadowCard,
        { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle },
        style,
      ]}>
      {children}
    </View>
  );
}

function CshHead({ label, value, limit, sub }: { label: string; value: string; limit?: string; sub?: string }) {
  const { colors } = useRyTheme();
  return (
    <View style={styles.cshHead}>
      <Text style={[ryFont('400'), styles.cshLabel, { color: colors.fgPrimary }]}>{label}</Text>
      <Text style={[ryFont('800'), styles.cshValue, { color: colors.fgPrimary }]}>{value}</Text>
      {limit ? (
        <Text style={[ryFont('400'), styles.cshLimit, { color: colors.fgSecondary }]}>{limit}</Text>
      ) : null}
      {sub ? (
        <Text style={[ryFont('400'), styles.cshSub, { color: colors.fgSecondary }]}>{sub}</Text>
      ) : null}
    </View>
  );
}

type BarSegment = { flex: number; color: string };

function CshBar({ segments }: { segments: BarSegment[] }) {
  const { colors } = useRyTheme();
  return (
    <View style={[styles.cshBar, { backgroundColor: colors.grey200 }]}>
      {segments.map((s, i) => (
        <View
          key={i}
          style={[
            { flex: Math.max(0, s.flex), backgroundColor: s.color },
            i < segments.length - 1 && { borderRightWidth: 2, borderRightColor: colors.bgPaper },
          ]}
        />
      ))}
    </View>
  );
}

function CshLegendRow({ color, label, value }: { color: string; label: string; value: string }) {
  const { colors } = useRyTheme();
  return (
    <View style={styles.legendRow}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={[ryFont('400'), styles.legendLabel, { color: colors.fgPrimary }]}>{label}</Text>
      <Text style={[ryFont('700'), styles.legendValue, { color: colors.fgPrimary }]}>{value}</Text>
    </View>
  );
}

function CshFootRow({ k, v }: { k: string; v: string }) {
  const { colors } = useRyTheme();
  return (
    <View style={styles.footRow}>
      <Text style={[ryFont('400'), styles.footK, { color: colors.fgSecondary }]}>{k}</Text>
      <Text style={[ryFont('600'), styles.footV, { color: colors.fgPrimary }]}>{v}</Text>
    </View>
  );
}

/* ============================================================
 * FamilyBentoHero — Resurs Family credit hero (details.jsx).
 * ============================================================ */

export function FamilyBentoHero({ product: p }: { product: Product }) {
  const { colors } = useRyTheme();
  const { tCard } = useT();
  const [cashbackOpen, setCashbackOpen] = useState(false);
  const cred = (p.accounts || []).find((a): a is CreditAccount => a.type === 'creditAccount');
  const fig = ryCreditFigures(cred, p);
  const limit = fig.limit || 1;
  const cBilled = colors.infoDark;
  const cPurch = colors.infoLight;
  const cAvail = colors.barTrack;

  return (
    <CshCard style={{ marginTop: 8, marginBottom: 16 }}>
      <CshHead
        label={tCard(p.primaryMetric.label)}
        value={`${fmt2(fig.avail)} kr`}
        limit={`${tCard('Credit limit')} ${rfmt(cred ? cred.creditLimit : { amount: limit, currency: 'SEK' })} kr`}
      />
      <CshBar
        segments={[
          { flex: fig.billed / limit, color: cBilled },
          { flex: fig.purchases / limit, color: cPurch },
          { flex: Math.max(0, 1 - (fig.billed + fig.purchases) / limit), color: cAvail },
        ]}
      />
      <Text style={[ryFont('500'), styles.cshDebt, { color: colors.fgPrimary }]}>
        {tCard('Total debt')}: {fmt2(fig.used)} kr
      </Text>
      <View style={styles.legend}>
        <CshLegendRow color={cBilled} label={tCard('Billed this month')} value={`${fmt2(fig.billed)} kr`} />
        <CshLegendRow color={cPurch} label={tCard('This month’s purchases')} value={`${fmt2(fig.purchases)} kr`} />
        <CshLegendRow color={cAvail} label={tCard('Available credit')} value={`${fmt2(fig.avail)} kr`} />
      </View>
      <View style={[styles.cashbackRow, { borderTopColor: colors.borderSubtle }]}>
        <View style={[styles.cashbackDisc, { backgroundColor: colors.cashbackBg }]}>
          <RyIcon name="fa-bolt" size={13} color="#1c1c1c" />
        </View>
        <View style={styles.cashbackLabelWrap}>
          <Text style={[ryFont('400'), styles.cashbackLabel, { color: colors.fgSecondary }]}>
            {tCard('Cashback')}
          </Text>
          <Pressable accessibilityLabel="About Cashback" onPress={() => setCashbackOpen(true)} hitSlop={8}>
            <RyIcon name="fa-circle-info" size={15} color={colors.iconMuted} />
          </Pressable>
        </View>
        <Text style={[ryFont('400'), styles.cashbackValue, { color: colors.fgSecondary }]}>
          {rfmt({ amount: fig.cashback, currency: 'SEK' })} kr
        </Text>
      </View>
      <CashbackInfoDialog open={cashbackOpen} onClose={() => setCashbackOpen(false)} />
    </CshCard>
  );
}

/* ============================================================
 * FamilyBentoHeroV2 — Bjarne's sandbox family hero (`.ry-fh2`).
 * ============================================================ */

export function FamilyBentoHeroV2({
  product: p,
  onOpenAccount,
}: {
  product: Product;
  onOpenAccount?: (a: Account, p: Product) => void;
}) {
  const { colors } = useRyTheme();
  const { t, tCard } = useT();
  const [cashbackOpen, setCashbackOpen] = useState(false);
  const cred = (p.accounts || []).find((a): a is CreditAccount => a.type === 'creditAccount');
  const fig = ryCreditFigures(cred, p);
  const limit = fig.limit || 1;
  const famBuffer =
    (p.accounts || []).find((a) => a.id === 'a-fam-savings') ||
    (p.accounts || []).find((a) => a.id === 'a-fam-savings-v2');

  const AcctRow = ({
    icon,
    name,
    value,
    onPress,
    last = false,
  }: {
    icon: string;
    name: string;
    value: string;
    onPress?: () => void;
    last?: boolean;
  }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.fh2AcctRow,
        { borderTopColor: colors.borderSubtle },
        pressed && { backgroundColor: colors.bgSubtle },
      ]}>
      <RyIcon name={icon} size={14} color={colors.iconMuted} />
      <Text style={[ryFont('600'), styles.fh2AcctName, { color: colors.fgPrimary }]}>{name}</Text>
      <Text style={[ryFont('400'), styles.fh2AcctVal, { color: colors.fgSecondary }]}>{value}</Text>
      <RyIcon name="fa-chevron-right" size={11} color={colors.fgDisabled} />
    </Pressable>
  );

  return (
    <View style={{ marginTop: 8, marginBottom: 16 }}>
      <View
        style={[
          styles.fh2Credit,
          { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle },
        ]}>
        <View style={styles.fh2Head}>
          <Text style={[ryFont('500'), styles.fh2Label, { color: colors.fgSecondary }]}>
            {tCard('Available credit')}
          </Text>
          <Text style={[ryFont('800'), styles.fh2Value, { color: colors.fgPrimary }]}>
            {fmt0(fig.avail)} kr
          </Text>
          <View style={styles.fh2CashbackInline}>
            <View style={[styles.fh2CbIcon, { backgroundColor: colors.cashbackBg }]}>
              <RyIcon name="fa-bolt" size={10} color="#1c1c1c" />
            </View>
            <Text style={[ryFont('500'), styles.fh2CbText, { color: colors.fgSecondary }]}>
              {tCard('Cashback')} {fmt0(fig.cashback)} kr
            </Text>
            <Pressable accessibilityLabel="About Cashback" onPress={() => setCashbackOpen(true)} hitSlop={8}>
              <RyIcon name="fa-circle-info" size={13} color={colors.iconMuted} />
            </Pressable>
          </View>
        </View>
        <CshBar
          segments={[
            { flex: fig.billed / limit, color: colors.infoDark },
            { flex: fig.purchases / limit, color: colors.infoLight },
            { flex: Math.max(0, 1 - (fig.billed + fig.purchases) / limit), color: colors.barTrack },
          ]}
        />
        <View style={styles.fh2Accounts}>
          {cred ? (
            <AcctRow
              icon="fa-credit-card"
              name={t('hero.credit')}
              value={`${fmt0(fig.used)} kr ${t('hero.used')}`}
              onPress={onOpenAccount ? () => onOpenAccount(cred, p) : undefined}
            />
          ) : null}
          {famBuffer && famBuffer.type === 'depositAccount' ? (
            <AcctRow
              icon="fa-piggy-bank"
              name={t('hero.buffer')}
              value={`${fmt0(famBuffer.balance?.amount ?? 0)} kr ${t('hero.saved')}`}
              onPress={onOpenAccount ? () => onOpenAccount(famBuffer, p) : undefined}
              last
            />
          ) : null}
        </View>
      </View>
      <CashbackInfoDialog open={cashbackOpen} onClose={() => setCashbackOpen(false)} />
    </View>
  );
}

/* ============================================================
 * FamilyBufferHero — savings hero for the Family buffer.
 * ============================================================ */

export function FamilyBufferHero({ account: a }: { account: DepositAccount }) {
  const { colors } = useRyTheme();
  const { tCard } = useT();
  const balance = a.balance ? a.balance.amount : 0;
  const goal = a.goalAmount ? a.goalAmount.amount : 0;
  const remaining = Math.max(0, goal - balance);
  const cSaved = colors.infoDark;
  const cRemain = colors.barTrack;
  const rate = a.interestRate != null ? `${String(a.interestRate).replace('.', ',')}%` : '—';
  const hasEarned = a.earnedThisYear != null;

  return (
    <CshCard style={{ marginTop: 8, marginBottom: 16 }}>
      <CshHead
        label={tCard('Available balance')}
        value={`${rfmt({ amount: balance, currency: 'SEK' })} kr`}
        limit={goal > 0 ? `${tCard('Savings goal')} ${rfmt(a.goalAmount)} kr` : undefined}
      />
      {goal > 0 ? (
        <CshBar
          segments={[
            { flex: balance / goal, color: cSaved },
            { flex: remaining / goal, color: cRemain },
          ]}
        />
      ) : null}
      <View style={[styles.legend, goal <= 0 && { marginTop: 16 }]}>
        <CshLegendRow color={cSaved} label={tCard('Saved')} value={`${rfmt({ amount: balance, currency: 'SEK' })} kr`} />
        {goal > 0 ? (
          <CshLegendRow
            color={cRemain}
            label={tCard('Remaining to goal')}
            value={`${rfmt({ amount: remaining, currency: 'SEK' })} kr`}
          />
        ) : null}
      </View>
      <View style={[styles.foot, { borderTopColor: colors.borderSubtle }]}>
        <CshFootRow k={tCard('Interest rate')} v={rate} />
        {hasEarned ? <CshFootRow k={tCard('Earned this year')} v={`+ ${rfmt(a.earnedThisYear)} kr`} /> : null}
      </View>
    </CshCard>
  );
}

/* ============================================================
 * SavingsHero — standalone savings account.
 * ============================================================ */

export function SavingsHero({ account: a }: { account: DepositAccount }) {
  const { colors } = useRyTheme();
  const { tCard } = useT();
  const balance = a.balance ? a.balance.amount : 0;
  const rate = a.interestRate != null ? `${String(a.interestRate).replace('.', ',')}%` : '—';
  const earnedAmt = a.earnedThisYear
    ? a.earnedThisYear.amount
    : a.interestRate != null
      ? Math.round((balance * a.interestRate) / 100)
      : 0;

  return (
    <CshCard style={{ marginTop: 8, marginBottom: 16 }}>
      <CshHead label={tCard('Balance')} value={`${rfmt({ amount: balance, currency: 'SEK' })} kr`} />
      <View style={[styles.foot, { borderTopColor: colors.borderSubtle }]}>
        <CshFootRow k={tCard('Interest rate')} v={rate} />
        <CshFootRow k={tCard('Earned this year')} v={`+ ${rfmt({ amount: earnedAmt, currency: 'SEK' })} kr`} />
        {a.lockedUntil ? <CshFootRow k={tCard('Locked to')} v={rfmtDate(a.lockedUntil)} /> : null}
      </View>
    </CshCard>
  );
}

/* ============================================================
 * LoanHero — loan account (repayment progress).
 * ============================================================ */

export function LoanHero({ account: a }: { account: LoanAccount }) {
  const { colors } = useRyTheme();
  const { tCard } = useT();
  const original = a.originalAmount ? a.originalAmount.amount : 0;
  const remaining = a.remainingBalance ? a.remainingBalance.amount : 0;
  const paid = Math.max(0, original - remaining);
  const cFill = colors.infoDark;
  const cTrack = colors.barTrack;

  return (
    <CshCard style={{ marginTop: 8, marginBottom: 16 }}>
      <CshHead
        label={tCard('Current debt')}
        value={`${rfmt({ amount: remaining, currency: 'SEK' })} kr`}
        limit={original > 0 ? `${tCard('Original loan amount')} ${rfmt(a.originalAmount)} kr` : undefined}
      />
      <CshBar
        segments={[
          { flex: original > 0 ? paid / original : 0, color: cFill },
          { flex: original > 0 ? Math.max(0, 1 - paid / original) : 1, color: cTrack },
        ]}
      />
      <View style={styles.legend}>
        <CshLegendRow color={cFill} label={tCard('Paid off')} value={`${rfmt({ amount: paid, currency: 'SEK' })} kr`} />
        <CshLegendRow
          color={cTrack}
          label={tCard('Remaining debt')}
          value={`${rfmt({ amount: remaining, currency: 'SEK' })} kr`}
        />
      </View>
      {a.monthlyPayment ? (
        <View style={[styles.cashbackRow, { borderTopColor: colors.borderSubtle }]}>
          <RyIcon name="fa-calendar" size={16} color={colors.iconMuted} regular />
          <Text style={[ryFont('500'), styles.cashbackLabel, { color: colors.fgSecondary, flex: 1, marginLeft: 4 }]}>
            {tCard('Monthly installment')}
          </Text>
          <Text style={[ryFont('500'), styles.cashbackValue, { color: colors.fgSecondary }]}>
            {rfmt(a.monthlyPayment)} kr
          </Text>
        </View>
      ) : null}
    </CshCard>
  );
}

/* ============================================================
 * CreditHero — standalone credit account (Gold / World / store credit).
 * ============================================================ */

export function CreditHero({
  account: a,
  product: p,
  variant,
}: {
  account: CreditAccount;
  product?: Product;
  variant?: 'credit-card' | 'store-credit';
}) {
  const { colors } = useRyTheme();
  const { tCard } = useT();
  const limit = a.creditLimit ? a.creditLimit.amount : 0;
  const used = a.usedCredit ? a.usedCredit.amount : 0;
  const avail =
    a.availableCredit && a.availableCredit.amount != null
      ? a.availableCredit.amount
      : Math.max(0, limit - used);
  const cUsed = colors.infoDark;
  const cAvail = colors.barTrack;
  const isCard = variant === 'credit-card';
  const bonus = isCard
    ? p && p.bonusPoints != null
      ? p.bonusPoints
      : null
    : null;

  return (
    <CshCard style={{ marginTop: 8, marginBottom: 16 }}>
      <CshHead
        label={tCard('Available credit')}
        value={`${rfmt({ amount: avail, currency: 'SEK' })} kr`}
        limit={limit > 0 ? `${tCard('Credit limit')} ${rfmt(a.creditLimit)} kr` : undefined}
      />
      <CshBar
        segments={[
          { flex: limit > 0 ? used / limit : 0, color: cUsed },
          { flex: limit > 0 ? avail / limit : 1, color: cAvail },
        ]}
      />
      {isCard ? (
        <Text style={[ryFont('400'), styles.cshDebt, { color: colors.fgPrimary }]}>
          {tCard('Total debt')}: {rfmt({ amount: used, currency: 'SEK' })} kr
        </Text>
      ) : null}
      <View style={[styles.legend, !isCard && { marginTop: 8 }]}>
        <CshLegendRow color={cUsed} label={tCard('Used credit')} value={`${rfmt({ amount: used, currency: 'SEK' })} kr`} />
        <CshLegendRow color={cAvail} label={tCard('Available credit')} value={`${rfmt({ amount: avail, currency: 'SEK' })} kr`} />
      </View>
      {isCard && bonus != null ? (
        <View style={[styles.cashbackRow, { borderTopColor: colors.borderSubtle }]}>
          <RyIcon name="fa-star" size={16} color={colors.iconMuted} regular />
          <Text style={[ryFont('400'), styles.cashbackLabel, { color: colors.fgSecondary, flex: 1, marginLeft: 4 }]}>
            {tCard('Bonus points')}
          </Text>
          <Text style={[ryFont('400'), styles.cashbackValue, { color: colors.fgSecondary }]}>
            {fmt0(bonus)}
          </Text>
        </View>
      ) : null}
    </CshCard>
  );
}

/* ============================================================
 * OtcHero — one-time-credit purchase account (by invoice payability).
 * ============================================================ */

export type OtcState = 'otc-no-invoice' | 'otc-invoice' | 'otc-paid';

export function OtcHero({
  account: a,
  product: p,
  state,
}: {
  account: InvoiceAccount;
  product: Product;
  state: OtcState;
}) {
  const { colors } = useRyTheme();
  const { tCard, lang } = useT();
  const remaining = a.remainingBalance
    ? a.remainingBalance.amount
    : a.originalAmount
      ? a.originalAmount.amount
      : 0;
  const original = a.originalAmount ? a.originalAmount.amount : remaining;
  const invs = (p.invoices || []).filter((i) => i.accountId === a.id);
  const openInv = invs.find((i) => i.status !== 'paid');
  const paidInv = invs.find((i) => i.status === 'paid');
  const paid = state === 'otc-paid';
  const due = openInv ? openInv.due : undefined;
  const paidDate = paidInv ? paidInv.due : undefined;

  const shortDue = (iso?: string): string => {
    if (!iso) return '';
    const x = new Date(iso);
    const MM_EN = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const MM_SV = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
    const mm = (lang === 'Svenska' ? MM_SV : MM_EN)[x.getMonth()];
    return `${x.getDate()} ${mm}`;
  };
  const headVal = paid ? 0 : remaining;

  return (
    <CshCard style={{ marginTop: 8, marginBottom: 16 }}>
      <CshHead
        label={tCard(paid ? 'Left to pay' : 'To pay')}
        value={`${rfmt({ amount: headVal, currency: 'SEK' })} kr`}
        sub={
          paid
            ? `${tCard('Purchase')} ${rfmt({ amount: original, currency: 'SEK' })} kr`
            : `${tCard('Due')} ${shortDue(due)}`
        }
      />
      {paid ? (
        <AlertBanner
          variant="success"
          style={{ marginTop: 16 }}
          title={tCard('Payment successful')}
          body={paidDate ? rfmtDate(paidDate) : undefined}
        />
      ) : (
        <>
          <View style={[styles.otcDivider, { backgroundColor: colors.borderSubtle }]} />
          <View style={styles.otcBottom}>
            <View style={{ flex: 1, minWidth: 0 }}>
              {state === 'otc-invoice' ? (
                <>
                  <Text style={[ryFont('700'), styles.otcT, { color: colors.fgPrimary }]}>
                    {tCard('Invoice available')}
                  </Text>
                  <Text style={[ryFont('400'), styles.otcD, { color: colors.fgSecondary }]}>
                    {tCard('You can find it under Invoices.')}
                  </Text>
                </>
              ) : (
                <Text style={[ryFont('400'), styles.otcD, { color: colors.fgSecondary }]}>
                  {tCard('Waiting for invoice.')}
                </Text>
              )}
            </View>
            <View
              style={[
                styles.otcPay,
                state === 'otc-invoice'
                  ? { backgroundColor: colors.primaryMain }
                  : { backgroundColor: colors.grey200 },
              ]}>
              <Text
                style={[
                  ryFont('700'),
                  styles.otcPayText,
                  { color: state === 'otc-invoice' ? colors.primaryContrast : colors.grey500 },
                ]}>
                {tCard('Pay')}
              </Text>
            </View>
          </View>
        </>
      )}
    </CshCard>
  );
}

/* ============================================================
 * PartPaymentHero — a purchase paid in instalments.
 * ============================================================ */

export function PartPaymentHero({ account: a }: { account: InvoiceAccount }) {
  const { tCard } = useT();
  const remaining = a.remainingBalance ? a.remainingBalance.amount : 0;
  const original = a.originalAmount ? a.originalAmount.amount : remaining;
  return (
    <CshCard style={{ marginTop: 8, marginBottom: 16 }}>
      <CshHead
        label={tCard('Left to pay')}
        value={`${rfmt({ amount: remaining, currency: 'SEK' })} kr`}
        sub={`${tCard('Purchase')} ${rfmt({ amount: original, currency: 'SEK' })} kr`}
      />
    </CshCard>
  );
}

/* ============================================================
 * AccountDetailHero — canonical selector (Account-cards path).
 * ============================================================ */

export type RyHeroKind =
  | 'resurs-family'
  | 'credit-card'
  | 'store-credit'
  | 'loan'
  | 'deposit-goal'
  | 'deposit'
  | 'partpayment'
  | OtcState;

export function ryPickHero(a: Account, p: Product): RyHeroKind {
  if (p && (p.id === 'p-family' || p.id === 'p-family-v2') && a.type === 'creditAccount')
    return 'resurs-family';
  if (a.type === 'creditAccount') return a.storeCredit ? 'store-credit' : 'credit-card';
  if (a.type === 'loanAccount') return 'loan';
  if (a.type === 'depositAccount') return a.goalAmount ? 'deposit-goal' : 'deposit';
  if (a.type === 'invoiceAccount') {
    if (a.termMonths != null || a.monthlyPayment != null || a.paymentsMade != null)
      return 'partpayment';
    const invs = (p.invoices || []).filter((i) => i.accountId === a.id);
    if (invs.length === 0) return 'otc-no-invoice';
    if (invs.every((i) => i.status === 'paid')) return 'otc-paid';
    return 'otc-invoice';
  }
  return 'deposit';
}

export function AccountDetailHero({ account: a, product: p }: { account: Account; product: Product }) {
  const hero = ryPickHero(a, p);
  switch (hero) {
    case 'resurs-family':
      return <FamilyBentoHero product={p} />;
    case 'credit-card':
      return <CreditHero account={a as CreditAccount} product={p} variant="credit-card" />;
    case 'store-credit':
      return <CreditHero account={a as CreditAccount} product={p} variant="store-credit" />;
    case 'loan':
      return <LoanHero account={a as LoanAccount} />;
    case 'deposit-goal':
      return <FamilyBufferHero account={a as DepositAccount} />;
    case 'deposit':
      return <SavingsHero account={a as DepositAccount} />;
    case 'partpayment':
      return <PartPaymentHero account={a as InvoiceAccount} />;
    case 'otc-no-invoice':
    case 'otc-invoice':
    case 'otc-paid':
      return <OtcHero account={a as InvoiceAccount} product={p} state={hero} />;
    default:
      return <SavingsHero account={a as DepositAccount} />;
  }
}

/* ============================================================
 * Product-page heroes — SavingsProductHero / LoanProductHero /
 * GoldBentoHero / ThemedProductHero.
 * ============================================================ */

export function SavingsProductHero({ product: p }: { product: Product }) {
  const { colors } = useRyTheme();
  const { t } = useT();
  const accts = (p.accounts || []).filter((a): a is DepositAccount => a.type === 'depositAccount');
  const totalBalance = accts.reduce((s, a) => s + (a.balance ? a.balance.amount : 0), 0);
  const earnedAmt = accts.reduce(
    (s, a) =>
      s +
      (a.earnedThisYear
        ? a.earnedThisYear.amount
        : a.interestRate != null
          ? Math.round(((a.balance ? a.balance.amount : 0) * a.interestRate) / 100)
          : 0),
    0,
  );
  return (
    <CshCard style={{ marginBottom: 16 }}>
      <CshHead label={t('hero.total_savings')} value={`${rfmt({ amount: totalBalance, currency: 'SEK' })} kr`} />
      <View style={[styles.foot, { borderTopColor: colors.borderSubtle }]}>
        <CshFootRow k={t('hero.earned_this_year')} v={`+ ${rfmt({ amount: earnedAmt, currency: 'SEK' })} kr`} />
      </View>
    </CshCard>
  );
}

export function LoanProductHero({ product: p }: { product: Product }) {
  const { colors } = useRyTheme();
  const { tCard } = useT();
  const accts = (p.accounts || []).filter((a): a is LoanAccount => a.type === 'loanAccount');
  const totalDebt = accts.reduce((s, a) => s + (a.remainingBalance ? a.remainingBalance.amount : 0), 0);
  const totalMonthly = accts.reduce((s, a) => s + (a.monthlyPayment ? a.monthlyPayment.amount : 0), 0);
  return (
    <CshCard style={{ marginBottom: 16 }}>
      <CshHead label={tCard('Total debt')} value={`${rfmt({ amount: totalDebt, currency: 'SEK' })} kr`} />
      <View style={[styles.foot, { borderTopColor: colors.borderSubtle }]}>
        <CshFootRow k={tCard('Monthly installment')} v={`${rfmt({ amount: totalMonthly, currency: 'SEK' })} kr`} />
      </View>
    </CshCard>
  );
}

const goldCardImg = require('@/assets/design/card.png');

export function GoldBentoHero({ product: p }: { product: Product }) {
  const { colors } = useRyTheme();
  const { t, tCard } = useT();
  const cred = (p.accounts || []).find((a): a is CreditAccount => a.type === 'creditAccount');
  const limit = cred ? cred.creditLimit.amount || 1 : 1;
  const used = cred ? cred.usedCredit.amount || 0 : 0;
  const avail =
    cred && cred.availableCredit && cred.availableCredit.amount != null
      ? cred.availableCredit.amount
      : Math.max(0, limit - used);

  // Budget pace calculation (RY_TODAY-driven).
  const budget = p.monthlyBudget ? p.monthlyBudget.amount : null;
  const todayDate = new Date(RY_TODAY);
  const dayOfMonth = todayDate.getDate();
  const daysInMonth = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - dayOfMonth;
  const pacePct = dayOfMonth / daysInMonth;
  const monthStart = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
  const monthSpend = (p.purchases || [])
    .filter((tx) => new Date(tx.date) >= monthStart)
    .reduce((sum, tx) => sum + (tx.amount ? tx.amount.amount || 0 : 0), 0);
  const budgetPaceAmount = budget ? Math.round(budget * pacePct) : 0;
  const isOverPace = budget ? monthSpend > budgetPaceAmount : false;
  const diff = budget ? Math.abs(monthSpend - budgetPaceAmount) : 0;
  const spendPct = budget
    ? Math.min(100, (monthSpend / budget) * 100)
    : Math.min(100, (used / limit) * 100);

  return (
    <View style={{ position: 'relative', marginTop: 44, marginBottom: 16 }}>
      <Image source={goldCardImg} style={styles.goldCardImg} resizeMode="contain" />
      <View
        style={[
          styles.fbhCard,
          { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle },
        ]}>
        <View style={styles.fbhGrid}>
          <View style={[styles.fbhCell, styles.fbhCellFull, { borderBottomColor: colors.borderSubtle }]}>
            <Text style={[ryFont('500'), styles.fbhLbl, { color: colors.fgSecondary }]}>
              {tCard('Available credit').toUpperCase()}
            </Text>
            <Text style={[ryFont('700'), styles.fbhVal, { color: colors.fgPrimary }]}>
              {rfmt({ amount: avail, currency: 'SEK' })} <Text style={styles.fbhCur}>kr</Text>
            </Text>
          </View>
          <View style={[styles.fbhCell, { borderRightWidth: 1, borderRightColor: colors.borderSubtle }]}>
            <Text style={[ryFont('500'), styles.fbhLbl, { color: colors.fgSecondary }]}>
              {tCard('Bonus points').toUpperCase()}
            </Text>
            <Text style={[ryFont('700'), styles.fbhValSm, { color: colors.fgPrimary }]}>
              {fmt0(p.bonusPoints || 0)} <Text style={styles.fbhCur}>{t('hero.pts')}</Text>
            </Text>
          </View>
          <View style={styles.fbhCell}>
            <Text style={[ryFont('500'), styles.fbhLbl, { color: colors.fgSecondary }]}>
              {tCard('Used credit').toUpperCase()}
            </Text>
            <Text style={[ryFont('700'), styles.fbhValSm, { color: colors.fgPrimary }]}>
              {rfmt(cred ? cred.usedCredit : { amount: 0, currency: 'SEK' } as Money)}{' '}
              <Text style={styles.fbhCur}>kr</Text>
            </Text>
          </View>
        </View>

        {budget ? (
          <View style={styles.fbhBudget}>
            <View style={styles.fbhBudgetRow}>
              <Text
                style={[
                  isOverPace ? ryFont('600') : ryFont('400'),
                  styles.fbhBudgetText,
                  { color: isOverPace ? colors.warningLight : colors.fgSecondary },
                ]}>
                {isOverPace
                  ? t('pd.budget.over', rfmt({ amount: diff, currency: 'SEK' }))
                  : t('pd.budget.under', rfmt({ amount: diff, currency: 'SEK' }))}
              </Text>
              <Text style={[ryFont('400'), styles.fbhBudgetText, { color: colors.fgSecondary }]}>
                {t('pd.budget.days_left', daysLeft)}
              </Text>
            </View>
            <View style={styles.fbhTrack}>
              <View
                style={[
                  styles.fbhFill,
                  {
                    width: `${spendPct}%`,
                    backgroundColor: isOverPace ? colors.warningLight : colors.primaryMain,
                  },
                ]}
              />
              <View style={[styles.fbhTick, { left: `${pacePct * 100}%` }]} />
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

/** Generic themed product hero (`.ry-hero.themed`) with an SVG gradient. */
export function ThemedProductHero({ product: p }: { product: Product }) {
  const { colors } = useRyTheme();
  const { tCard } = useT();
  const cred = (p.accounts || []).find((a): a is CreditAccount => a.type === 'creditAccount');
  const c1 = p.theme?.brandColor ?? colors.primaryMain;
  const c2 = p.theme?.brandColor2 ?? p.theme?.brandColor ?? colors.primaryDark;

  return (
    <View style={styles.themedHero}>
      <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none" viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={c1} />
            <Stop offset="1" stopColor={c2} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="100" fill="url(#heroBg)" />
      </Svg>
      <View style={styles.themedInner}>
        <Text style={[ryFont('400'), styles.themedLabel]}>{tCard(p.primaryMetric.label)}</Text>
        <Text style={[ryFont('700'), styles.themedValue]}>
          {rfmt(p.primaryMetric.value)}
          <Text style={styles.themedCurrency}> {p.primaryMetric.value.currency}</Text>
        </Text>
        {cred ? (
          <View style={styles.themedMetrics}>
            <View>
              <Text style={[ryFont('400'), styles.themedMetricL]}>{tCard('Credit limit').toUpperCase()}</Text>
              <Text style={[ryFont('600'), styles.themedMetricV]}>
                {rfmt(cred.creditLimit)} {cred.creditLimit.currency}
              </Text>
            </View>
            <View>
              <Text style={[ryFont('400'), styles.themedMetricL]}>{tCard('Used credit').toUpperCase()}</Text>
              <Text style={[ryFont('600'), styles.themedMetricV]}>
                {rfmt(cred.usedCredit)} {cred.usedCredit.currency}
              </Text>
            </View>
          </View>
        ) : null}
        {p.secondaryMetrics && !cred ? (
          <View style={styles.themedMetrics}>
            {p.secondaryMetrics.slice(0, 2).map((m2, i) => (
              <View key={i}>
                <Text style={[ryFont('400'), styles.themedMetricL]}>{tCard(m2.label).toUpperCase()}</Text>
                <Text style={[ryFont('600'), styles.themedMetricV]}>
                  {rfmt(m2.value)}
                  {m2.value.currency === '%' ? '' : ` ${m2.value.currency}`}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
        {cred ? (
          <View style={styles.themedProgress}>
            <View
              style={[
                styles.themedProgressFill,
                { width: `${(cred.usedCredit.amount / cred.creditLimit.amount) * 100}%` },
              ]}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}

/* ============================================================
 * Styles
 * ============================================================ */

const styles = StyleSheet.create({
  csh: {
    borderWidth: 1,
    borderRadius: radii.xl,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 16,
    marginBottom: 12,
  },
  cshHead: { alignItems: 'center' },
  cshLabel: { fontSize: 16, textAlign: 'center' },
  cshValue: {
    fontSize: 38,
    letterSpacing: 38 * -0.02,
    lineHeight: 42,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  cshLimit: { fontSize: 14, marginTop: 2, textAlign: 'center' },
  cshSub: { fontSize: 14, marginTop: 4, textAlign: 'center' },
  cshBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 8,
  },
  cshDebt: { fontSize: 14, marginBottom: 16 },
  legend: { gap: 4 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  legendDot: { width: 12, height: 12, borderRadius: 999, flexShrink: 0 },
  legendLabel: { flex: 1, minWidth: 0, fontSize: 14 },
  legendValue: { fontSize: 14, fontVariant: ['tabular-nums'] },
  cashbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  cashbackDisc: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cashbackLabelWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  cashbackLabel: { fontSize: 14 },
  cashbackValue: { fontSize: 14, fontVariant: ['tabular-nums'] },
  foot: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    gap: 6,
  },
  footRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 },
  footK: { fontSize: 14 },
  footV: { fontSize: 14, fontVariant: ['tabular-nums'] },
  otcDivider: { height: 1, marginTop: 16, marginBottom: 8 },
  otcBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  otcT: { fontSize: 14 },
  otcD: { fontSize: 13, marginTop: 4 },
  otcPay: {
    flexShrink: 0,
    borderRadius: 999,
    paddingVertical: 11,
    paddingHorizontal: 26,
  },
  otcPayText: { fontSize: 14, letterSpacing: 14 * 0.01 },
  // fh2 — FamilyBentoHeroV2
  fh2Credit: {
    borderWidth: 1,
    borderRadius: radii.xl,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  fh2Head: { alignItems: 'center', marginBottom: 16 },
  fh2Label: { fontSize: 14 },
  fh2Value: {
    fontSize: 34,
    letterSpacing: 34 * -0.02,
    lineHeight: 39,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  fh2CashbackInline: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  fh2CbIcon: {
    width: 20,
    height: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  fh2CbText: { fontSize: 13 },
  fh2Accounts: { marginTop: 8 },
  fh2AcctRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  fh2AcctName: { fontSize: 14 },
  fh2AcctVal: { flex: 1, fontSize: 13, textAlign: 'right' },
  // GoldBentoHero
  goldCardImg: {
    position: 'absolute',
    top: -60,
    right: 80,
    height: 142,
    width: 90,
    transform: [{ rotate: '90deg' }],
    zIndex: 2,
  },
  fbhCard: {
    borderWidth: 1.5,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 4,
  },
  fbhGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  fbhCell: {
    width: '50%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 4,
  },
  fbhCellFull: {
    width: '100%',
    paddingRight: 100,
    borderBottomWidth: 1,
  },
  fbhLbl: { fontSize: 11, letterSpacing: 11 * 0.03 },
  fbhVal: { fontSize: 22, letterSpacing: 22 * -0.02, lineHeight: 24 },
  fbhValSm: { fontSize: 18, letterSpacing: 18 * -0.02, lineHeight: 20 },
  fbhCur: { fontSize: 12, opacity: 0.6 },
  fbhBudget: { paddingHorizontal: 16, paddingBottom: 12, paddingTop: 4, width: '100%' },
  fbhBudgetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  fbhBudgetText: { fontSize: 11 },
  fbhTrack: {
    position: 'relative',
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '100%',
    marginBottom: 8,
  },
  fbhFill: { position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: 3 },
  fbhTick: {
    position: 'absolute',
    top: -4,
    bottom: -4,
    width: 2,
    marginLeft: -1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 1,
  },
  // ThemedProductHero
  themedHero: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    padding: 0,
    marginBottom: 16,
  },
  themedInner: { paddingVertical: 24, paddingHorizontal: 20 },
  themedLabel: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 4 },
  themedValue: {
    fontSize: 44,
    letterSpacing: 44 * -0.02,
    lineHeight: 47,
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  themedCurrency: { fontSize: 44 * 0.5 },
  themedMetrics: { flexDirection: 'row', gap: 24, marginTop: 16 },
  themedMetricL: { fontSize: 11, color: 'rgba(255,255,255,0.8)', letterSpacing: 11 * 0.04 },
  themedMetricV: { fontSize: 15, color: '#FFFFFF', fontVariant: ['tabular-nums'], marginTop: 2 },
  themedProgress: {
    marginTop: 16,
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  themedProgressFill: { height: '100%', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.85)' },
});
