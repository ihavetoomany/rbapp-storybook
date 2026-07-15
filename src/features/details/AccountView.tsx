// AccountView — port of details.jsx (Q3 · App). Standalone account pages
// render their overview from the canonical spec structure (accountSpec.ts);
// the Resurs Family credit account and the Family buffer keep their bespoke
// layouts; the Gekås Mastercard keeps its bespoke bonus-check layout.
//
// The monthly-deposits flow state (view + deposit) is owned here and passed
// to MonthlyDepositsFlow (flows feature) per the Phase C contract.

import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  HelpSupport,
  KvCopyRow,
  KvRow,
  QuickActions,
  RyCard,
  RyIcon,
  RyRow,
  SectionTitle,
  Segmented,
  ServiceRow,
  TransactionRow,
} from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import {
  accountKind,
  rfmt,
  type Account,
  type AccountKind,
  type CreditAccount,
  type DepositAccount,
  type MonthlyDepositConfig,
  type Product,
  type Purchase,
  type ServiceAction,
} from '@/src/data';
import {
  MonthlyDepositsFlow,
  MonthlyDepositSummaryCard,
  type MdView,
} from '@/src/features/flows/monthly-deposits/MonthlyDepositsFlow';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { useTweaks } from '@/src/tweaks/TweaksProvider';

import { AccountOverviewSections, AcctInvoiceHistoryCard, AcctServicesCard } from './AccountOverviewSections';
import { CashbackInfoDialog, FamilyInsuranceDialog, PaymentProtectionDialog } from './dialogs';
import { DetailScreen } from './DetailScreen';
import {
  AccountDetailHero,
  CreditHero,
  FamilyBentoHero,
  FamilyBufferHero,
  LoanHero,
  SavingsHero,
} from './heroes';
import * as nav from './nav';
import { BonusCheckEntryRow, CardRow, CashbackNote, InvoiceRow, SeeAllButton } from './rows';
import { txTypeConfig } from './txTypeConfig';

const familyCardImg = require('@/assets/design/family-card.png');
const gekasLogoImg = require('@/assets/design/gekas-logo.png');

type AcctTab = 'account' | 'transactions';

const SPEC_KINDS: AccountKind[] = [
  'credit',
  'storecredit',
  'flexsavings',
  'fixedsavings',
  'loan',
  'invoice',
];

export function AccountView({ account: a, product: p }: { account: Account; product: Product }) {
  const { colors } = useRyTheme();
  const { t, tCard } = useT();
  const { tweaks } = useTweaks();
  const accountCards = tweaks.walletLayout === 'Account Cards';

  const isDeposit = a.type === 'depositAccount';
  const isLoan = a.type === 'loanAccount';
  const isFamCredit =
    (p.id === 'p-family' || p.id === 'p-family-v2') && a.type === 'creditAccount';
  const isFlexSavings = a.type === 'depositAccount' && !a.goalAmount && !!a.autoSave;
  const isFamBuffer = a.type === 'depositAccount' && !!a.goalAmount;
  const isCredit = a.type === 'creditAccount' && !isFamCredit;
  const isGekasCredit = isCredit && !!(a as CreditAccount).bonusChecks;
  const isGoldCredit = isCredit && p.id === 'p-gold';
  const isStoreCredit = isCredit && !!(a as CreditAccount).storeCredit;

  const [famAcctTab, setFamAcctTab] = useState<AcctTab>(isLoan ? 'account' : 'transactions');
  const [mdView, setMdView] = useState<MdView>(null);
  const [mdDeposit, setMdDeposit] = useState<MonthlyDepositConfig | null>(
    a.type === 'depositAccount' ? (a.monthlyDeposit ?? null) : null,
  );
  const [paymentProtOpen, setPaymentProtOpen] = useState(false);
  const [insuranceOpen, setInsuranceOpen] = useState(false);
  const [cashbackOpen, setCashbackOpen] = useState(false);

  const accountTx = useMemo(
    () => (p.purchases || []).filter((tx) => tx.accountId === a.id),
    [p, a.id],
  );
  let accountInvoices = (p.invoices || []).filter((inv) => inv.accountId === a.id);
  if (accountInvoices.length === 0 && p.id === 'p-gold' && a.type === 'creditAccount') {
    accountInvoices = p.invoices || [];
  }

  const acctKind = accountKind(a, p);
  const useSpecStructure = SPEC_KINDS.includes(acctKind);

  const runAcctAction = (action: ServiceAction | undefined, label: string) => {
    if (action === 'deposit') {
      if (isFlexSavings || isFamBuffer) {
        setMdView('options');
        return;
      }
      nav.openPlaceholder(label);
      return;
    }
    if (action === 'close') {
      nav.openCloseAccount(p, a);
      return;
    }
    nav.openPlaceholder(label); // 'withdraw' + servicing actions without a flow
  };

  const dialogs = (
    <>
      <PaymentProtectionDialog open={paymentProtOpen} onClose={() => setPaymentProtOpen(false)} />
      <FamilyInsuranceDialog open={insuranceOpen} onClose={() => setInsuranceOpen(false)} />
      <CashbackInfoDialog open={cashbackOpen} onClose={() => setCashbackOpen(false)} />
      {(isFlexSavings || isFamBuffer) && a.type === 'depositAccount' ? (
        <MonthlyDepositsFlow
          view={mdView}
          setView={setMdView}
          deposit={mdDeposit}
          account={a}
          onSave={(dep: MonthlyDepositConfig) => setMdDeposit(dep)}
          onStop={() => setMdDeposit(null)}
        />
      ) : null}
    </>
  );

  const noTxCard = (
    <RyCard style={{ padding: 20, alignItems: 'center', marginTop: 4 }}>
      <Text style={[ryFont('400'), styles.emptyText, { color: colors.fgSecondary }]}>
        {t('acct.no_tx')}
      </Text>
    </RyCard>
  );

  /* ── Gekås Mastercard (revolving credit + bonus checks) — bespoke ── */
  if (isGekasCredit && a.type === 'creditAccount') {
    const cards = (a.cards || []).filter(
      (c): c is { holder: string; last4: string; exp: string; main?: boolean } => 'holder' in c,
    );
    return (
      <DetailScreen title={tCard(a.name)} overlay={dialogs}>
        <CreditHero account={a} product={p} variant="credit-card" />

        <Segmented
          options={[
            { id: 'account', label: tCard('Account') },
            { id: 'transactions', label: tCard('Transactions') },
          ]}
          value={famAcctTab}
          onChange={(id) => setFamAcctTab(id as AcctTab)}
          style={{ marginTop: 16, marginBottom: 4 }}
        />

        {famAcctTab === 'account' ? (
          <>
            {cards.length > 0 ? (
              <>
                <SectionTitle style={{ marginTop: 16 }}>{tCard('Cards')}</SectionTitle>
                <RyCard>
                  {cards.map((c, i) => (
                    <CardRow
                      key={c.last4}
                      img={gekasLogoImg}
                      thumbVariant="landscape"
                      title={`${c.holder} ····${c.last4}`}
                      sub={`${tCard(c.main ? 'Main card' : 'Extra card')} · ${tCard('Exp.')} ${c.exp}`}
                      last={i === cards.length - 1}
                      onPress={() =>
                        nav.openCardSettings({ holder: c.holder, last4: c.last4, exp: c.exp, extra: !c.main }, a, p)
                      }
                    />
                  ))}
                </RyCard>
              </>
            ) : null}

            <SectionTitle style={{ marginTop: 16 }}>{tCard('Bonus checks')}</SectionTitle>
            <BonusCheckEntryRow
              count={(a.bonusChecks?.active || []).length}
              onPress={() => nav.openBonusChecks(a, p)}
            />

            <SectionTitle style={{ marginTop: 16 }}>{tCard('Account details')}</SectionTitle>
            <RyCard>
              <KvCopyRow label={tCard('Account number')} value={a.number} copy />
              {a.creditLimit ? (
                <KvRow label={tCard('Credit limit')} value={`${rfmt(a.creditLimit)} ${a.creditLimit.currency}`} />
              ) : null}
              {a.usedCredit ? (
                <KvRow label={tCard('Used credit')} value={`${rfmt(a.usedCredit)} ${a.usedCredit.currency}`} />
              ) : null}
              {a.availableCredit ? (
                <KvRow
                  label={tCard('Available credit')}
                  value={`${rfmt(a.availableCredit)} ${a.availableCredit.currency}`}
                  last
                />
              ) : null}
            </RyCard>

            {accountInvoices.length > 0 ? (
              <>
                <SectionTitle style={{ marginTop: 16 }}>{tCard('Invoice history')}</SectionTitle>
                <RyCard>
                  {accountInvoices.map((inv, i) => (
                    <InvoiceRow
                      key={inv.id}
                      inv={inv}
                      last={i === accountInvoices.length - 1}
                      onPress={() => nav.openInvoice(inv, p)}
                    />
                  ))}
                </RyCard>
              </>
            ) : null}

            <SectionTitle>{tCard('Services')}</SectionTitle>
            <RyCard>
              {[
                { label: 'Pay extra', icon: 'fa-bolt' },
                { label: 'Change credit limit', icon: 'fa-sliders' },
                { label: 'Close account', icon: 'fa-xmark', danger: true },
              ].map((act, i, arr) => (
                <ServiceRow
                  key={i}
                  icon={act.icon}
                  title={act.label}
                  danger={act.danger}
                  last={i === arr.length - 1}
                  onPress={() => nav.openPlaceholder(act.label)}
                />
              ))}
            </RyCard>
            <HelpSupport />
          </>
        ) : (
          <>
            <SectionTitle>{tCard('Transactions')}</SectionTitle>
            {accountTx.length > 0 ? (
              <RyCard style={{ marginTop: 4 }}>
                {accountTx.slice(0, 6).map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} hideIcon absDate onPress={() => nav.openTx(tx, p, true)} />
                ))}
                <SeeAllButton onPress={() => nav.openTxList(a, p)} />
              </RyCard>
            ) : (
              noTxCard
            )}
          </>
        )}
      </DetailScreen>
    );
  }

  /* ── Generic account page (spec-driven in Q3) ── */

  const famCoordName = (() => {
    const coord = (p.familyMembers || []).find((m) => m.role === 'Coordinator');
    return coord ? `${coord.name} Bergström` : 'John Bergström';
  })();

  return (
    <DetailScreen title={tCard(a.name)} overlay={dialogs}>
      {/* Family credit hero — same as the Resurs Family overview */}
      {isFamCredit ? <FamilyBentoHero product={p} /> : null}

      {/* Account / Transactions tabs — Family credit account */}
      {isFamCredit ? (
        <Segmented
          options={[
            { id: 'transactions', label: tCard('Transactions') },
            { id: 'account', label: tCard('Account') },
          ]}
          value={famAcctTab}
          onChange={(id) => setFamAcctTab(id as AcctTab)}
          style={{ marginTop: 16, marginBottom: 4 }}
        />
      ) : null}

      {/* Hero — Account-cards path uses the canonical selector */}
      {accountCards ? (
        !isFamCredit ? (
          <AccountDetailHero account={a} product={p} />
        ) : null
      ) : (
        <>
          {isDeposit && (a as DepositAccount).goalAmount ? (
            <FamilyBufferHero account={a as DepositAccount} />
          ) : null}
          {isDeposit && !(a as DepositAccount).goalAmount ? (
            <SavingsHero account={a as DepositAccount} />
          ) : null}
          {isLoan && a.type === 'loanAccount' ? <LoanHero account={a} /> : null}
          {isCredit && a.type === 'creditAccount' ? <CreditHero account={a} /> : null}
        </>
      )}

      {/* Tabs — savings / Gold / store-credit */}
      {isDeposit || isGoldCredit || isStoreCredit ? (
        <Segmented
          options={[
            { id: 'transactions', label: tCard('Transactions') },
            { id: 'account', label: tCard('Account') },
          ]}
          value={famAcctTab}
          onChange={(id) => setFamAcctTab(id as AcctTab)}
          style={{ marginTop: 16, marginBottom: 4 }}
        />
      ) : null}

      {/* Quick actions + tabs — loan accounts */}
      {isLoan ? (
        <>
          <QuickActions
            actions={[
              { label: tCard('Pay extra'), icon: 'fa-bolt', onPress: () => nav.openPlaceholder('Pay extra') },
              { label: tCard('Rename'), icon: 'fa-pen', onPress: () => nav.openPlaceholder('Rename') },
            ]}
          />
          <Segmented
            options={[
              { id: 'account', label: tCard('Account') },
              { id: 'transactions', label: tCard('Transactions') },
            ]}
            value={famAcctTab}
            onChange={(id) => setFamAcctTab(id as AcctTab)}
            style={{ marginTop: 24, marginBottom: 4 }}
          />
        </>
      ) : null}

      {/* Q3 spec-driven overview — single source of truth (accountSpec.ts) */}
      {useSpecStructure && famAcctTab === 'account' ? (
        <AccountOverviewSections
          kind={acctKind}
          account={a}
          product={p}
          onOpenInvoice={(inv, prod) => nav.openInvoice(inv, prod)}
          onOpenPlaceholder={(title) => nav.openPlaceholder(title)}
          runAcctAction={runAcctAction}
          onInsurance={(title) =>
            title === 'Family insurance' ? setInsuranceOpen(true) : setPaymentProtOpen(true)
          }
          onOpenBonusChecks={(acc, prod) => nav.openBonusChecks(acc, prod)}
          onOpenCard={(c, acc, prod) =>
            nav.openCardSettings({ holder: c.holder, last4: c.last4, exp: c.exp, extra: c.extra }, acc, prod)
          }
          onInfo={() => setCashbackOpen(true)}
          mdDeposit={mdDeposit}
          onEditDeposit={() => setMdView('edit')}
        />
      ) : null}

      {/* Monthly deposit summary — Family buffer legacy layout */}
      {isFamBuffer && mdDeposit && famAcctTab === 'account' ? (
        <MonthlyDepositSummaryCard deposit={mdDeposit} onClick={() => setMdView('edit')} />
      ) : null}

      {/* Family buffer — account information */}
      {!useSpecStructure && isFamBuffer && famAcctTab === 'account' && a.type === 'depositAccount'
        ? (() => {
            const accrued =
              a.interestRate != null ? Math.round((a.balance.amount * a.interestRate) / 100) : 0;
            return (
              <>
                <SectionTitle style={{ marginTop: 18, marginBottom: 10 }}>
                  {tCard('Account details')}
                </SectionTitle>
                <RyCard>
                  <KvCopyRow label={tCard('Account number')} value={a.number} copy />
                  <KvRow label={tCard('Account holder')} value={famCoordName} />
                  <KvRow label={t('acct.creation_date')} value={a.openedDate || '—'} />
                  <KvRow label={tCard('Account role')} value={t('acct.owner_val')} />
                  <KvRow label={t('acct.rate_type')} value={t('acct.rate_variable')} />
                  <KvRow label={t('acct.rate_date')} value={a.rateDate || '—'} />
                  <KvRow
                    label={tCard('Accrued interest')}
                    value={`${rfmt({ amount: accrued, currency: 'SEK' })} kr`}
                    last
                  />
                </RyCard>
              </>
            );
          })()
        : null}

      {/* Family credit — cards + account details */}
      {isFamCredit && famAcctTab === 'account' && a.type === 'creditAccount' ? (
        <>
          <SectionTitle style={{ marginTop: 16 }}>{tCard('Cards')}</SectionTitle>
          <RyCard>
            {[
              { holder: 'John', last4: '9001', exp: '11/28', extra: false },
              { holder: 'Anna', last4: '9002', exp: '11/28', extra: true },
            ].map((c) => (
              <CardRow
                key={c.last4}
                img={familyCardImg}
                thumbVariant="landscape"
                title={`${c.holder} ····${c.last4}`}
                sub={`${tCard(c.extra ? 'Extra card' : 'Main card')} · ${tCard('Exp.')} ${c.exp}`}
                onPress={() => nav.openCardSettings(c, a, p)}
              />
            ))}
            <RyRow
              icon="fa-plus"
              iconBg={colors.bgSubtle}
              iconColor={colors.primaryMain}
              title={tCard('Order extra card')}
              titleStyle={{ color: colors.primaryMain }}
              chevron
              last
              onPress={() => nav.openPlaceholder('Order extra card')}
            />
          </RyCard>

          <SectionTitle style={{ marginTop: 16 }}>{tCard('Account details')}</SectionTitle>
          <RyCard>
            <KvCopyRow label={tCard('Account number')} value={a.number} copy />
            {a.ocr ? <KvCopyRow label={t('payinfo.ocr')} value={a.ocr} copy /> : null}
            {a.bankgiro ? <KvCopyRow label={t('payinfo.bankgiro')} value={a.bankgiro} copy /> : null}
            <KvRow label={tCard('Account holder')} value={famCoordName} />
            <KvRow label={tCard('Product')} value={a.name} />
            {a.creditLimit ? (
              <KvRow label={t('acct.limit')} value={`${rfmt(a.creditLimit)} kr`} />
            ) : null}
            <View
              style={[
                styles.infoRow,
                { borderBottomWidth: 0 },
              ]}>
              <Text style={[ryFont('400'), styles.infoLabel, { color: colors.fgSecondary }]}>
                {tCard('Cashback')}
              </Text>
              <Text
                onPress={() => setCashbackOpen(true)}
                accessibilityLabel="About Cashback"
                style={{ paddingHorizontal: 4 }}>
                <RyIcon name="fa-circle-info" size={15} color={colors.iconMuted} />
              </Text>
            </View>
          </RyCard>
        </>
      ) : null}

      {/* Transactions — loan accounts */}
      {isLoan && famAcctTab === 'transactions' ? (
        <>
          <SectionTitle style={{ marginTop: 16 }}>{tCard('Transactions')}</SectionTitle>
          {accountTx.length > 0 ? (
            <RyCard>
              {accountTx.slice(0, 6).map((tx) => (
                <TransactionRow key={tx.id} tx={tx} hideIcon absDate onPress={() => nav.openTx(tx, p, true)} />
              ))}
              <SeeAllButton onPress={() => nav.openTxList(a, p)} />
            </RyCard>
          ) : (
            noTxCard
          )}
        </>
      ) : null}

      {/* Transactions — Resurs Gold */}
      {p.id === 'p-gold' && famAcctTab === 'transactions' && !isDeposit && accountTx.length > 0
        ? (() => {
            const byNewest = (x: Purchase, y: Purchase) =>
              new Date(y.date).getTime() - new Date(x.date).getTime();
            const prelim = accountTx.filter((tx) => tx.preliminary).sort(byNewest);
            const reg = accountTx.filter((tx) => !tx.preliminary).sort(byNewest);
            return (
              <>
                <SectionTitle style={{ marginTop: 16 }}>{tCard('Transactions')}</SectionTitle>
                <RyCard>
                  {prelim.map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} hideIcon absDate onPress={() => nav.openTx(tx, p, true)} />
                  ))}
                  {reg.slice(0, 6).map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} hideIcon absDate onPress={() => nav.openTx(tx, p, true)} />
                  ))}
                  <SeeAllButton onPress={() => nav.openTxList(a, p)} />
                </RyCard>
              </>
            );
          })()
        : null}

      {/* Transactions — savings accounts */}
      {isDeposit && famAcctTab === 'transactions' && a.type === 'depositAccount' ? (
        <>
          <SectionTitle style={{ marginTop: 16 }}>{tCard('Transactions')}</SectionTitle>
          {(() => {
            const credAcct = (p.accounts || []).find(
              (x): x is CreditAccount => x.type === 'creditAccount',
            );
            const hasCbTx = (a.transactions || []).some((tx) => tx.subLabel === 'Cashback');
            const cb =
              credAcct && hasCbTx
                ? (p.purchases || [])
                    .filter(
                      (tx) =>
                        tx.accountId === credAcct.id && tx.type === 'purchase' && !tx.preliminary,
                    )
                    .reduce((s, tx) => s + Math.floor((tx.amount?.amount || 0) / 100), 0)
                : (a.transactions || [])
                    .filter((tx) => tx.subLabel === 'Cashback')
                    .reduce((s, tx) => s + (tx.amount ? tx.amount.amount : 0), 0);
            return cb > 0 ? <CashbackNote>{`${tCard('Total cashback')}: ${cb} kr`}</CashbackNote> : null;
          })()}
          {(a.transactions || []).length > 0 ? (
            <RyCard>
              {(a.transactions || []).slice(0, 6).map((tx) => (
                <TransactionRow key={tx.id} tx={tx} hideIcon absDate onPress={() => nav.openTx(tx, p, true)} />
              ))}
              <SeeAllButton onPress={() => nav.openTxList(a, p)} />
            </RyCard>
          ) : (
            noTxCard
          )}
        </>
      ) : null}

      {/* Transactions — credit / store-credit / family credit / invoice */}
      {p.id !== 'p-gold' &&
      !isDeposit &&
      !isLoan &&
      accountTx.length > 0 &&
      ((!isFamCredit && !isStoreCredit) || famAcctTab === 'transactions') ? (
        <>
          <SectionTitle style={{ marginTop: 16 }}>{tCard('Transactions')}</SectionTitle>
          {isFamCredit && a.type === 'creditAccount'
            ? (() => {
                const byNewest = (x: Purchase, y: Purchase) =>
                  new Date(y.date).getTime() - new Date(x.date).getTime();
                const cfg = txTypeConfig(a);
                const famCards = (a.cards || []).filter(
                  (c): c is { id: string; name: string } => 'id' in c,
                );
                const mainHolder = famCards[0] ? famCards[0].name : '';
                const holderOf = (tx: Purchase) =>
                  (tx.type === 'purchase' && tx.user && famCards.find((c) => c.id === tx.user)?.name) ||
                  mainHolder;
                const prelim = accountTx.filter((tx) => tx.preliminary).sort(byNewest);
                const reg = accountTx.filter((tx) => !tx.preliminary).sort(byNewest);
                const totalCashback = accountTx.reduce((s, tx) => s + cfg.cashbackOf(tx), 0);
                return (
                  <>
                    {totalCashback > 0 ? (
                      <CashbackNote>{`${tCard('Total cashback')}: ${totalCashback} kr`}</CashbackNote>
                    ) : null}
                    <RyCard>
                      {prelim.map((tx) => (
                        <TransactionRow
                          key={tx.id}
                          tx={tx}
                          hideIcon
                          absDate
                          cashback={cfg.cashbackOf(tx)}
                          holder={holderOf(tx)}
                          onPress={() => nav.openTx(tx, p, true)}
                        />
                      ))}
                      {reg.slice(0, 6).map((tx) => (
                        <TransactionRow
                          key={tx.id}
                          tx={tx}
                          hideIcon
                          absDate
                          cashback={cfg.cashbackOf(tx)}
                          holder={holderOf(tx)}
                          onPress={() => nav.openTx(tx, p, true)}
                        />
                      ))}
                      <SeeAllButton onPress={() => nav.openTxList(a, p)} />
                    </RyCard>
                  </>
                );
              })()
            : (() => {
                const cfg = txTypeConfig(a);
                const list = isStoreCredit ? accountTx.slice(0, 6) : accountTx;
                return (
                  <RyCard>
                    {list.map((tx) => (
                      <TransactionRow
                        key={tx.id}
                        tx={tx}
                        hideIcon
                        absDate
                        cashback={cfg.cashbackOf(tx)}
                        onPress={() => nav.openTx(tx, p, true)}
                      />
                    ))}
                    <SeeAllButton
                      onPress={isStoreCredit ? () => nav.openTxList(a, p) : undefined}
                    />
                  </RyCard>
                );
              })()}
        </>
      ) : null}

      {/* Services — non-spec kinds (family credit / family buffer) */}
      {!useSpecStructure && famAcctTab === 'account' ? (
        <AcctServicesCard
          kind={acctKind}
          runAcctAction={runAcctAction}
          onOpenPlaceholder={(title) => nav.openPlaceholder(title)}
        />
      ) : null}

      {/* Invoice history — non-spec kinds */}
      {!useSpecStructure &&
      !isDeposit &&
      accountInvoices.length > 0 &&
      famAcctTab === 'account' ? (
        <AcctInvoiceHistoryCard
          invoices={accountInvoices}
          product={p}
          onOpenInvoice={(inv, prod) => nav.openInvoice(inv, prod)}
        />
      ) : null}

      {(!isFamCredit && !isFamBuffer && !isDeposit && !isGoldCredit && !isStoreCredit && !isLoan) ||
      famAcctTab === 'account' ? (
        <HelpSupport />
      ) : null}
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  emptyText: { fontSize: 14, textAlign: 'center' },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  infoLabel: { fontSize: 14 },
});
