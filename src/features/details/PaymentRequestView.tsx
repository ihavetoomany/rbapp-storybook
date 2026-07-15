// PaymentRequestView — port of details.jsx (Q3 · App): the four invoice
// kinds (manadsavi / faktura / delbetalning / laneavi) with the status-
// override tweak, the tx-breakdown ("Last month") sheet and the purchase
// line-items sheet (both local, ported from app.jsx's Sheet overlays).
// Pay → usePaySheet().open(pr) (payment feature).

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
  ServiceRow,
  TransactionRow,
} from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import {
  rfmt,
  rfmtDate,
  RY_TODAY,
  type EcomItem,
  type Money,
  type PaymentRequest,
  type Product,
  type Purchase,
} from '@/src/data';
import { usePaySheet } from '@/src/features/payment/PaySheetProvider';
import { useT } from '@/src/i18n';
import { radii, shadowCard } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { useStatusOverride } from '@/src/tweaks/TweaksProvider';

import { DetailScreen } from './DetailScreen';
import * as nav from './nav';

type ItemsSheetData = { store: string; items: EcomItem[] };
type TxSheetData = { txs: Purchase[]; total: number };

export function PaymentRequestView({ pr, product: p }: { pr: PaymentRequest; product: Product }) {
  const { colors } = useRyTheme();
  const { t, tCard, tName } = useT();
  const override = useStatusOverride();
  const paySheet = usePaySheet();

  const [txSheet, setTxSheet] = useState<TxSheetData | null>(null);
  const [itemsSheet, setItemsSheet] = useState<ItemsSheetData | null>(null);

  const KIND_TITLE_KEYS: Partial<Record<typeof pr.kind, string>> = {
    manadsavi: 'inv.statement',
    faktura: 'inv.invoice',
    delbetalning: 'inv.partpayment',
    laneavi: 'inv.installment',
  };
  const kindTitle = t(KIND_TITLE_KEYS[pr.kind] || 'inv.invoice');

  const relatedInv = (p.invoices || []).find((inv) => inv.id === pr.invoiceId);
  const relatedTx = (p.purchases || []).filter((tx) => tx.accountId === pr.accountId);
  const ongoingPlan = (p.paymentRequests || []).find(
    (x) => x.kind === 'delbetalning' && x.id !== pr.id,
  );
  const txTotal = relatedTx.reduce((s, tx) => s + tx.amount.amount, 0);
  const lastMonthAmount: Money = {
    amount: pr.remainingAmount.amount - (ongoingPlan ? ongoingPlan.remainingAmount.amount : 0),
    currency: pr.remainingAmount.currency,
  };
  const lastMonthTx: Purchase[] = (() => {
    if (!txTotal) return relatedTx;
    let acc = 0;
    return relatedTx.map((tx, i) => {
      const amt =
        i === relatedTx.length - 1
          ? lastMonthAmount.amount - acc
          : Math.round((tx.amount.amount / txTotal) * lastMonthAmount.amount);
      if (i < relatedTx.length - 1) acc += amt;
      return { ...tx, amount: { ...tx.amount, amount: amt } };
    });
  })();

  // Effective status respects the dev status-override tweak.
  const eff: string = override || pr.status;
  const isScheduled = eff === 'scheduled';
  const isPaid = eff === 'paid';
  const isPartial = eff === 'partiallyPaid';
  const isOverdue = eff === 'overdue' || eff === 'missed';
  const isDueSoon = eff === 'dueSoon';
  const isHandled = isScheduled || isPaid || isPartial;
  const partialPaid: Money = {
    amount: Math.round(pr.remainingAmount.amount * 0.6),
    currency: pr.remainingAmount.currency,
  };
  let daysOverdue = Math.round(
    (new Date(RY_TODAY).getTime() - new Date(pr.dueDate).getTime()) / 86400000,
  );
  if (daysOverdue < 1) daysOverdue = 5;
  let daysToDue = Math.round(
    (new Date(pr.dueDate).getTime() - new Date(RY_TODAY).getTime()) / 86400000,
  );
  if (daysToDue < 1) daysToDue = 3;

  const subLine = isOverdue
    ? t('sub.overdue', daysOverdue)
    : isDueSoon
      ? t('sub.urgent', daysToDue)
      : isPartial
        ? t('pr.sub.partial', `${rfmt(partialPaid)} ${partialPaid.currency}`, rfmtDate(pr.dueDate))
        : isPaid
          ? t('pr.sub.paid', rfmtDate(pr.dueDate))
          : isScheduled
            ? t('pr.sub.scheduled', rfmtDate(pr.dueDate))
            : t('date.due', rfmtDate(pr.dueDate));

  const smallRow = (
    icon: string,
    title: string,
    sub: string | undefined,
    right: React.ReactNode,
    onPress?: () => void,
    chevron = false,
    last = false,
  ) => (
    <Pressable
      key={`${icon}-${title}`}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.smallRow,
        { borderBottomColor: last ? 'transparent' : colors.borderSubtle },
        last && { borderBottomWidth: 0 },
        pressed && { backgroundColor: colors.bgSubtle },
      ]}>
      <View style={[styles.smallIcon, { backgroundColor: colors.bgSubtle }]}>
        <RyIcon name={icon} size={13} color={colors.primaryMain} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[ryFont('500'), styles.smallTitle, { color: colors.fgPrimary }]}>{title}</Text>
        {sub ? (
          <Text style={[ryFont('400'), styles.smallSub, { color: colors.fgSecondary }]}>{sub}</Text>
        ) : null}
      </View>
      {right}
      {chevron ? <RyIcon name="fa-chevron-right" size={12} color={colors.fgDisabled} /> : null}
    </Pressable>
  );

  const amountText = (m: Money) => (
    <Text style={[ryFont('700'), styles.smallAmount, { color: colors.fgPrimary }]}>
      {rfmt(m)} <Text style={[ryFont('500'), styles.smallCur]}>{m.currency}</Text>
    </Text>
  );

  const sheets = (
    <>
      {/* Transaction-list sheet — "Last month" breakdown */}
      <BaseDialog open={!!txSheet} onClose={() => setTxSheet(null)} title={t('pr.last_month')} size="medium">
        {txSheet ? (
          <>
            <RyCard>
              {txSheet.txs.map((tx, i) => (
                <TransactionRow
                  key={tx.id}
                  tx={tx}
                  last={i === txSheet.txs.length - 1}
                  onPress={() => {
                    setTxSheet(null);
                    nav.openTx(tx, p);
                  }}
                />
              ))}
            </RyCard>
            <View style={styles.totalRow}>
              <Text style={[ryFont('600'), styles.totalK, { color: colors.fgSecondary }]}>
                {t('common.total')}
              </Text>
              <Text style={[ryFont('400'), styles.totalV, { color: colors.fgPrimary }]}>
                {rfmt({ amount: txSheet.total, currency: 'SEK' })} SEK
              </Text>
            </View>
          </>
        ) : null}
      </BaseDialog>

      {/* Purchase line-items sheet */}
      <BaseDialog
        open={!!itemsSheet}
        onClose={() => setItemsSheet(null)}
        title={itemsSheet ? itemsSheet.store : ''}
        size="small">
        {itemsSheet ? (
          <RyCard>
            {itemsSheet.items.map((li, i) => (
              <View
                key={i}
                style={[styles.lineItem, { borderBottomColor: colors.borderSubtle }]}>
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
                {rfmt({
                  amount: itemsSheet.items.reduce((s, li) => s + li.qty * li.price.amount, 0),
                  currency: 'SEK',
                })}{' '}
                SEK
              </Text>
            </View>
          </RyCard>
        ) : null}
      </BaseDialog>
    </>
  );

  return (
    <DetailScreen title={kindTitle} overlay={sheets}>
      {/* Hero — `.ry-hero.card` */}
      <View
        style={[
          styles.hero,
          shadowCard,
          { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle },
        ]}>
        <Text style={[ryFont('400'), styles.heroLabel, { color: colors.fgSecondary }]}>
          {t('detail.amount_due')}
        </Text>
        <Text
          style={[
            ryFont('700'),
            styles.heroValue,
            { color: isPartial ? colors.fgSecondary : colors.fgPrimary },
            isPartial && styles.strike,
          ]}>
          {rfmt(pr.remainingAmount)}
          <Text style={styles.heroCurrency}> kr</Text>
        </Text>
        <Text
          style={[
            isOverdue || isDueSoon ? ryFont('600') : ryFont('400'),
            styles.heroSub,
            {
              color: isOverdue
                ? colors.errorMain
                : isDueSoon
                  ? colors.warningDark
                  : colors.fgSecondary,
            },
          ]}>
          {subLine}
        </Text>
        {!isHandled ? (
          <RyButton
            title={t('btn.pay')}
            icon="fa-bolt"
            variant="primary"
            block
            style={[
              { marginTop: 16 },
              isOverdue ? { backgroundColor: colors.errorMain } : null,
              isDueSoon ? { backgroundColor: colors.warningMain } : null,
            ]}
            textStyle={isDueSoon ? { color: colors.fgPrimary } : undefined}
            onPress={() => paySheet.open(pr)}
          />
        ) : null}
      </View>

      {isPartial ? (
        <AlertBanner variant="warning" style={{ marginBottom: 16 }} body={t('pr.banner.partial')} />
      ) : null}
      {isPaid ? (
        <AlertBanner variant="success" style={{ marginBottom: 16 }} body={t('pr.banner.paid')} />
      ) : null}
      {isScheduled ? (
        <AlertBanner variant="warning" style={{ marginBottom: 16 }} body={t('pr.banner.scheduled')} />
      ) : null}

      {/* Type-specific section — part-payment plan */}
      {pr.kind === 'delbetalning' ? (
        <>
          <SectionTitle>{tName(pr.displayName || p.name)}</SectionTitle>
          <Text style={[ryFont('400'), styles.desc, { color: colors.fgSecondary }]}>
            {t('pr.desc.delbetalning')}
          </Text>
          <RyCard>
            <View style={[styles.progressBlock, { borderBottomColor: colors.borderSubtle }]}>
              <View style={styles.progressHead}>
                <Text style={[ryFont('400'), styles.progressLabel, { color: colors.fgSecondary }]}>
                  {t('detail.payment_n_of', pr.paymentNo ?? 0, pr.paymentsTotal ?? 0)}
                </Text>
                <Text style={[ryFont('400'), styles.progressLabel, { color: colors.fgSecondary }]}>
                  {Math.round(((pr.paymentNo ?? 0) / (pr.paymentsTotal || 1)) * 100)}%
                </Text>
              </View>
              <View style={[styles.progressTrack, { backgroundColor: colors.barTrack }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: colors.primaryMain,
                      width: `${((pr.paymentNo ?? 0) / (pr.paymentsTotal || 1)) * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>
            {pr.originalDebt ? (
              <KvRow
                label={t('pr.original_debt')}
                value={`${rfmt(pr.originalDebt)} ${pr.originalDebt.currency}`}
              />
            ) : null}
            {pr.remainingBalance ? (
              <KvRow
                label={tCard('Remaining balance')}
                value={`${rfmt(pr.remainingBalance)} ${pr.remainingBalance.currency}`}
              />
            ) : null}
            {pr.interestRate != null ? (
              <KvRow
                label={tCard('Interest rate')}
                value={`${String(pr.interestRate).replace('.', ',')} %`}
                last
              />
            ) : null}
          </RyCard>
        </>
      ) : null}

      {/* Type-specific section — loan installment */}
      {pr.kind === 'laneavi'
        ? (() => {
            const acct = (p.accounts || []).find((x) => x.id === pr.accountId);
            const original =
              acct && (acct.type === 'loanAccount' || acct.type === 'invoiceAccount')
                ? acct.originalAmount
                : undefined;
            const remaining =
              acct && (acct.type === 'loanAccount' || acct.type === 'invoiceAccount')
                ? acct.remainingBalance
                : undefined;
            return (
              <>
                <SectionTitle>{tName(p.name)}</SectionTitle>
                <Text style={[ryFont('400'), styles.desc, { color: colors.fgSecondary }]}>
                  {t('pr.desc.laneavi')}
                </Text>
                <RyCard>
                  <View style={[styles.progressBlock, { borderBottomColor: colors.borderSubtle }]}>
                    <View style={styles.progressHead}>
                      <Text style={[ryFont('400'), styles.progressLabel, { color: colors.fgSecondary }]}>
                        {t('detail.payment_n_of', pr.paymentNo ?? 0, pr.paymentsTotal ?? 0)}
                      </Text>
                      <Text style={[ryFont('400'), styles.progressLabel, { color: colors.fgSecondary }]}>
                        {Math.round(((pr.paymentNo ?? 0) / (pr.paymentsTotal || 1)) * 100)}%
                      </Text>
                    </View>
                    <View style={[styles.progressTrack, { backgroundColor: colors.barTrack }]}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            backgroundColor: colors.primaryMain,
                            width: `${((pr.paymentNo ?? 0) / (pr.paymentsTotal || 1)) * 100}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>
                  {original ? (
                    <KvRow label={t('detail.loan_amount')} value={`${rfmt(original)} ${original.currency}`} />
                  ) : null}
                  {remaining ? (
                    <KvRow
                      label={tCard('Remaining debt')}
                      value={`${rfmt(remaining)} ${remaining.currency}`}
                      last
                    />
                  ) : null}
                </RyCard>
              </>
            );
          })()
        : null}

      {/* Type-specific section — merchant invoice */}
      {pr.kind === 'faktura' ? (
        <>
          <SectionTitle>{tName(p.name)}</SectionTitle>
          <Text style={[ryFont('400'), styles.desc, { color: colors.fgSecondary }]}>
            {t('pr.desc.faktura', p.name)}
          </Text>
          {pr.purchase ? (
            <RyCard style={{ marginBottom: 16 }}>
              {smallRow(
                'fa-bag-shopping',
                pr.purchase.store,
                t('pr.items_count', pr.purchase.items.length),
                amountText({
                  amount: pr.purchase.items.reduce((s, li) => s + li.qty * li.price.amount, 0),
                  currency: 'SEK',
                }),
                () => setItemsSheet(pr.purchase!),
                false,
                true,
              )}
            </RyCard>
          ) : null}
        </>
      ) : null}

      {/* What I pay for */}
      {pr.kind === 'manadsavi' ? (
        <>
          <SectionTitle>{tName(p.name)}</SectionTitle>
          <Text style={[ryFont('400'), styles.desc, { color: colors.fgSecondary }]}>
            {t('pr.desc.manadsavi')}
          </Text>
          <RyCard>
            {smallRow(
              'fa-receipt',
              t('pr.last_month'),
              t('pr.purchases_count', relatedTx.length),
              amountText(lastMonthAmount),
              () => setTxSheet({ txs: lastMonthTx, total: lastMonthAmount.amount }),
              true,
              !ongoingPlan,
            )}
            {ongoingPlan
              ? smallRow(
                  'fa-arrows-rotate',
                  t('pr.july'),
                  t('detail.payment_n_of', ongoingPlan.paymentNo ?? 0, ongoingPlan.paymentsTotal ?? 0),
                  amountText(ongoingPlan.remainingAmount),
                  undefined,
                  false,
                  true,
                )
              : null}
          </RyCard>
        </>
      ) : pr.kind !== 'faktura' && pr.kind !== 'delbetalning' && pr.kind !== 'laneavi' && relatedTx.length > 0 ? (
        <RyCard>
          {relatedTx.map((tx, i) => (
            <TransactionRow
              key={tx.id}
              tx={tx}
              last={i === relatedTx.length - 1}
              onPress={() => nav.openTx(tx, p)}
            />
          ))}
        </RyCard>
      ) : null}

      {/* Merchant-invoice related purchases (line items per merchant) */}
      {pr.kind === 'faktura' && relatedTx.length > 0 ? (
        <RyCard>
          {relatedTx.map((tx, i) => {
            const items = tx.ecomDetail?.items || [];
            return smallRow(
              tx.icon || 'fa-bag-shopping',
              tx.merchant,
              t('pr.items_count', items.length),
              amountText(tx.amount),
              () => setItemsSheet({ store: tx.merchant, items }),
              false,
              i === relatedTx.length - 1,
            );
          })}
        </RyCard>
      ) : null}

      {/* Payment information */}
      <SectionTitle>{t('payinfo.title')}</SectionTitle>
      <RyCard>
        <KvRow label={t('payinfo.ocr')} value={pr.ocr} mono />
        <KvRow label={t('payinfo.bankgiro')} value={pr.bankgiro} mono />
        <KvRow label={t('payinfo.due')} value={rfmtDate(pr.dueDate)} last={!relatedInv} />
        {relatedInv
          ? smallRow(
              'fa-file-pdf',
              t('payinfo.pdf'),
              undefined,
              null,
              () => nav.openInvoice(relatedInv, p),
              true,
              true,
            )
          : null}
      </RyCard>

      {/* Services */}
      <SectionTitle>{t('svc.title')}</SectionTitle>
      <RyCard>
        {!isPaid && !isPartial && !isOverdue ? (
          <ServiceRow
            icon={isScheduled ? 'fa-calendar-xmark' : 'fa-bolt'}
            title={isScheduled ? t('btn.cancel_scheduled') : tCard('Pay invoice')}
            onPress={() => paySheet.open(pr)}
          />
        ) : null}
        {!isHandled && !isOverdue ? (
          <ServiceRow icon="fa-bell-slash" title={t('svc.snooze')} onPress={() => nav.openPlaceholder('Snooze')} />
        ) : null}
        <ServiceRow
          icon="fa-house-chimney"
          title={t('svc.product')}
          onPress={() => nav.openPlaceholder('Product page')}
        />
        <ServiceRow
          icon="fa-flag"
          title={t('svc.report')}
          last
          onPress={() => nav.openPlaceholder('Report a problem')}
        />
      </RyCard>

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
  heroCurrency: { fontSize: 44 },
  heroSub: { fontSize: 13, marginTop: 10, textAlign: 'center' },
  strike: { textDecorationLine: 'line-through' },
  desc: { fontSize: 13, lineHeight: 19, marginHorizontal: 4, marginBottom: 10 },
  progressBlock: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  progressHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  progressLabel: { fontSize: 13 },
  progressTrack: { height: 6, borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  smallRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
  smallIcon: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  smallTitle: { fontSize: 15, lineHeight: 20 },
  smallSub: { fontSize: 12, lineHeight: 16, marginTop: 2 },
  smallAmount: { fontSize: 15, fontVariant: ['tabular-nums'], textAlign: 'right' },
  smallCur: { fontSize: 12 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  totalK: { fontSize: 14 },
  totalV: { fontSize: 14, fontVariant: ['tabular-nums'] },
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
});
