// TransactionView — port of details.jsx (Q3 · App): transaction-type-aware
// detail model (fromAccount path), line items, linked part-payment account,
// and the Part Pay plan-selection + confirmation sheets.

import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AlertBanner,
  BaseDialog,
  HelpSupport,
  KvRow,
  RyButton,
  RyCard,
  RyIcon,
  SectionTitle,
} from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { rfmt, rfmtDate, rfmtRel, type Product, type Purchase } from '@/src/data';
import { useT } from '@/src/i18n';
import { radii, shadowCard } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { AccountRow } from './rows';
import { DetailScreen } from './DetailScreen';
import * as nav from './nav';

type PartPayPlan = { months: number; interestRate: number; fee: { amount: number; currency: 'SEK' } };

const PART_PAY_PLANS: PartPayPlan[] = [
  { months: 3, interestRate: 0, fee: { amount: 0, currency: 'SEK' } },
  { months: 6, interestRate: 0, fee: { amount: 29, currency: 'SEK' } },
  { months: 12, interestRate: 9.95, fee: { amount: 29, currency: 'SEK' } },
];

export function TransactionView({
  tx,
  product: p,
  fromAccount = false,
}: {
  tx: Purchase;
  product: Product;
  fromAccount?: boolean;
}) {
  const { colors } = useRyTheme();
  const { t, tCard, tName } = useT();

  const linkedAccount = (p.accounts || []).find((a) => a.id === tx.accountId);
  // Family credit: which card made the purchase (main vs extra cardholder).
  const famCards =
    p.id === 'p-family'
      ? ((p.accounts || []).find((a) => a.type === 'creditAccount') as
          | { cards?: { id: string; name: string }[] }
          | undefined
        )?.cards?.filter((c) => 'id' in c) || null
      : null;
  const cardInfo =
    famCards && tx.type === 'purchase' && tx.user
      ? (() => {
          const idx = famCards.findIndex((c) => c.id === tx.user);
          const card = idx >= 0 ? famCards[idx] : famCards[0];
          return { name: card ? card.name : '', roleKey: idx <= 0 ? 'Main card' : 'Extra card' };
        })()
      : null;

  const useNewTx = fromAccount; // Q3 wallet-account path
  const txKind = (() => {
    if (tx.type === 'purchase') return 'Purchase';
    const sl = tx.subLabel;
    if (sl === 'Payment') return 'Payment';
    if (sl === 'Deposit') return 'Deposit';
    if (sl === 'Interest') return 'Interest';
    if (sl === 'Cashback') return 'Cashback';
    if (sl === 'Fee') return 'Fee';
    if (sl === 'Tax') return 'Withheld tax';
    if (sl === 'Other') return 'Other';
    if (sl === 'Withdrawal' || tx.type === 'withdrawal') return 'Withdrawal';
    if (/loan payment|invoice payment/i.test(tx.merchant || '')) return 'Payment';
    if (/interest/i.test(tx.merchant || '')) return 'Interest';
    if (tx.type === 'refund') return 'Refund';
    return 'Transaction';
  })();
  const headerLabel = useNewTx ? txKind : 'Purchase';
  const statusLabel = tx.preliminary ? 'Reserved' : 'Completed';
  const statusColor = tx.preliminary ? colors.warningDark : colors.successDark;
  const heroChannel = txKind === 'Purchase' ? (tx.ecomDetail ? 'Online' : 'In store') : null;
  const showTxnId = txKind === 'Purchase';
  const canConvert =
    tx.type !== 'refund' &&
    tx.amount.amount > 1000 &&
    !(linkedAccount && linkedAccount.type === 'invoiceAccount' && linkedAccount.status === 'active');

  const [planSheet, setPlanSheet] = useState(false);
  const [confirmSheet, setConfirmSheet] = useState(false);
  const [selectedPP, setSelectedPP] = useState(0);
  const [activated, setActivated] = useState(false);

  const ppMonthly = (plan: PartPayPlan) =>
    Math.round(
      tx.amount.amount / plan.months + plan.fee.amount + (plan.interestRate * tx.amount.amount) / 100 / 12,
    );
  const confirmPartPay = () => {
    setPlanSheet(false);
    setActivated(true);
    setTimeout(() => setConfirmSheet(true), 320);
  };

  const sheets = (
    <>
      {/* Part Pay — choose a plan */}
      <BaseDialog open={planSheet} onClose={() => setPlanSheet(false)} title={t('tx.pp.title')} size="medium">
        <Text style={[ryFont('400'), styles.ppDesc, { color: colors.fgSecondary }]}>
          {t('tx.pp.desc', `${rfmt(tx.amount)} ${tx.amount.currency}`, tx.merchant)}
        </Text>
        {PART_PAY_PLANS.map((plan, i) => {
          const selected = selectedPP === i;
          return (
            <Pressable
              key={i}
              onPress={() => setSelectedPP(i)}
              style={[
                styles.option,
                {
                  borderColor: selected ? colors.primaryMain : colors.borderSubtle,
                  backgroundColor: colors.bgPaper,
                },
              ]}>
              <View
                style={[
                  styles.radio,
                  { borderColor: selected ? colors.primaryMain : colors.borderStrong },
                ]}>
                {selected ? <View style={[styles.radioDot, { backgroundColor: colors.primaryMain }]} /> : null}
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[ryFont('700'), styles.optionTitle, { color: colors.fgPrimary }]}>
                  {t('tx.pp.months', plan.months)}
                </Text>
                <Text style={[ryFont('400'), styles.optionDesc, { color: colors.fgSecondary }]}>
                  {plan.interestRate === 0
                    ? t('tx.pp.interest_free')
                    : t('tx.pp.interest', String(plan.interestRate).replace('.', ','))}
                  {plan.fee.amount > 0 ? ` · ${t('tx.pp.fee', `${rfmt(plan.fee)} ${plan.fee.currency}`)}` : ''}
                </Text>
              </View>
              <Text style={[ryFont('700'), styles.optionPrice, { color: colors.fgPrimary }]}>
                {t('tx.pp.per_month', rfmt({ amount: ppMonthly(plan), currency: 'SEK' }), tx.amount.currency)}
              </Text>
            </Pressable>
          );
        })}
        <RyButton
          title={t('tx.pp.confirm')}
          variant="primary"
          block
          style={{ marginTop: 14 }}
          onPress={confirmPartPay}
        />
      </BaseDialog>

      {/* Part Pay — confirmation */}
      <BaseDialog open={confirmSheet} onClose={() => setConfirmSheet(false)} size="small">
        <View style={styles.confirmWrap}>
          <View style={[styles.confirmDisc, { backgroundColor: colors.successLight }]}>
            <RyIcon name="fa-check" size={24} color={colors.successDark} />
          </View>
          <Text style={[ryFont('700'), styles.confirmTitle, { color: colors.fgPrimary }]}>
            {t('tx.pp.done_title')}
          </Text>
          <Text style={[ryFont('400'), styles.confirmBody, { color: colors.fgSecondary }]}>
            {t(
              'tx.pp.done_body',
              `${rfmt(tx.amount)} ${tx.amount.currency}`,
              tx.merchant,
              PART_PAY_PLANS[selectedPP]!.months,
            )}
          </Text>
          <RyButton title={t('md.done')} variant="primary" block onPress={() => setConfirmSheet(false)} />
        </View>
      </BaseDialog>
    </>
  );

  return (
    <DetailScreen title={tCard(headerLabel)} overlay={sheets}>
      {/* Hero — `.ry-hero.card` */}
      <View
        style={[
          styles.hero,
          shadowCard,
          { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle },
        ]}>
        <Text style={[ryFont('400'), styles.heroLabel, { color: colors.fgSecondary }]}>
          {tx.merchant}
        </Text>
        <Text style={[ryFont('700'), styles.heroValue, { color: colors.fgPrimary }]}>
          {rfmt(tx.amount)}
          <Text> kr</Text>
        </Text>
        <Text style={[ryFont('400'), styles.heroSub, { color: colors.fgSecondary }]}>
          {useNewTx
            ? `${rfmtRel(tx.date)}${heroChannel ? ` · ${tCard(heroChannel)}` : ''}`
            : `${rfmtDate(tx.date)} · ${tCard(tx.ecomDetail ? 'Online' : 'In store')}`}
        </Text>
        {canConvert && !activated ? (
          <>
            <RyButton
              title={t('tag.part_pay')}
              variant="primary"
              block
              style={{ marginTop: 16 }}
              onPress={() => {
                setSelectedPP(0);
                setPlanSheet(true);
              }}
            />
            <Text style={[ryFont('400'), styles.pitch, { color: colors.fgSecondary }]}>
              {t('tx.resursone_pitch')}
            </Text>
          </>
        ) : null}
        {canConvert && activated ? (
          <AlertBanner
            variant="info"
            style={{ marginTop: 16, alignSelf: 'stretch' }}
            body={t('tx.partpay_active', PART_PAY_PLANS[selectedPP]!.months)}
          />
        ) : null}
      </View>

      {/* Transaction details */}
      {useNewTx ? (
        <>
          <SectionTitle style={{ marginTop: 4 }}>{tCard('Transaction details')}</SectionTitle>
          <RyCard>
            <View style={[styles.kvTx, { borderBottomColor: colors.borderSubtle }]}>
              <Text style={[ryFont('400'), styles.kvTxK, { color: colors.fgSecondary }]}>
                {tCard('Status')}
              </Text>
              <Text style={[ryFont('400'), styles.kvTxV, { color: statusColor }]}>
                {tCard(statusLabel)}
              </Text>
            </View>
            <KvRow label={tCard('Transaction date')} value={rfmtDate(tx.date)} tx />
            <KvRow label={tCard('Type')} value={tCard(txKind)} tx />
            {p.name ? <KvRow label={tCard('Product')} value={tName(p.name)} tx last={!cardInfo && !showTxnId} /> : null}
            {cardInfo ? (
              <KvRow
                label={tCard('Card')}
                value={`${cardInfo.name} · ${tCard(cardInfo.roleKey)}`}
                tx
                last={!showTxnId}
              />
            ) : null}
            {showTxnId ? (
              <KvRow
                label={tCard('Transaction ID')}
                value={`TXN-${tx.id.toUpperCase()}-${tx.date.replace(/-/g, '')}`}
                mono
                tx
                last
              />
            ) : null}
          </RyCard>
        </>
      ) : (
        <>
          <SectionTitle style={{ marginTop: 4 }}>{tCard('Transaction details')}</SectionTitle>
          <RyCard>
            <KvRow label={tCard('Merchant')} value={tx.merchant} />
            <KvRow label={t('tx.date_time')} value={`${rfmtDate(tx.date)} 14:32`} />
            <KvRow
              label={tCard('Transaction ID')}
              value={`TXN-${tx.id.toUpperCase()}-${tx.date.replace(/-/g, '')}`}
              mono
            />
            <View style={[styles.kvTx, { borderBottomColor: colors.borderSubtle }]}>
              <Text style={[ryFont('400'), styles.kvTxK, { color: colors.fgSecondary }]}>
                {tCard('Status')}
              </Text>
              <Text style={[ryFont('400'), styles.kvTxV, { color: colors.successDark }]}>
                {tCard('Completed')}
              </Text>
            </View>
            <KvRow
              label={tCard('Type')}
              value={tx.ecomDetail ? t('tx.type_ecom') : t('tx.type_instore')}
              last
            />
          </RyCard>
        </>
      )}

      {/* Line items */}
      {tx.ecomDetail && tx.ecomDetail.items ? (
        <>
          <SectionTitle style={{ marginTop: 16 }}>{tCard('Items')}</SectionTitle>
          <RyCard>
            {tx.ecomDetail.items.map((li, i) => (
              <View key={i} style={[styles.lineItem, { borderBottomColor: colors.borderSubtle }]}>
                <Text style={[ryFont('400'), styles.lineItemName, { color: colors.fgPrimary }]}>
                  <Text style={{ color: colors.fgSecondary }}>{li.qty}× </Text>
                  {li.name}
                </Text>
                <Text style={[ryFont('600'), styles.lineItemPrice, { color: colors.fgPrimary }]}>
                  {rfmt({ amount: li.qty * li.price.amount, currency: li.price.currency })}{' '}
                  {li.price.currency}
                </Text>
              </View>
            ))}
            <View style={[styles.lineItem, { backgroundColor: colors.bgSubtle, borderBottomWidth: 0 }]}>
              <Text style={[ryFont('700'), styles.lineItemName, { color: colors.fgPrimary }]}>
                {t('common.total')}
              </Text>
              <Text style={[ryFont('700'), styles.lineItemPrice, { color: colors.fgPrimary }]}>
                {rfmt(tx.amount)} {tx.amount.currency}
              </Text>
            </View>
          </RyCard>
        </>
      ) : null}

      {/* Linked InvoiceAccount — the purchase is being paid off */}
      {linkedAccount &&
      linkedAccount.type === 'invoiceAccount' &&
      linkedAccount.status === 'active' ? (
        <>
          <SectionTitle style={{ marginTop: 16 }}>
            {tCard('This purchase is being paid off')}
          </SectionTitle>
          <RyCard>
            <AccountRow account={linkedAccount} last onPress={() => nav.openAccount(linkedAccount, p)} />
          </RyCard>
        </>
      ) : null}

      <HelpSupport />
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderWidth: 1,
    borderRadius: radii.xl,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  heroLabel: { fontSize: 13, marginBottom: 4, textAlign: 'center' },
  heroValue: {
    fontSize: 44,
    letterSpacing: 44 * -0.02,
    lineHeight: 47,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  heroSub: { fontSize: 13, marginTop: 8, textAlign: 'center' },
  pitch: { fontSize: 13, lineHeight: 19, marginTop: 10, textAlign: 'center' },
  kvTx: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  kvTxK: { fontSize: 14 },
  kvTxV: { fontSize: 14, fontVariant: ['tabular-nums'] },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lineItemName: { flex: 1, fontSize: 14, lineHeight: 19 },
  lineItemPrice: { fontSize: 14, fontVariant: ['tabular-nums'] },
  ppDesc: { fontSize: 13, lineHeight: 19, marginHorizontal: 4, marginBottom: 12 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioDot: { width: 10, height: 10, borderRadius: 999 },
  optionTitle: { fontSize: 15 },
  optionDesc: { fontSize: 12, marginTop: 2 },
  optionPrice: { fontSize: 13, fontVariant: ['tabular-nums'], flexShrink: 0 },
  confirmWrap: { alignItems: 'center', paddingVertical: 4, paddingHorizontal: 4 },
  confirmDisc: {
    width: 56,
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  confirmTitle: { fontSize: 20, marginBottom: 8, textAlign: 'center' },
  confirmBody: {
    fontSize: 14,
    lineHeight: 21,
    marginHorizontal: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmBtn: { alignSelf: 'stretch' },
});
