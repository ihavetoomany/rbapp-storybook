// InvoiceModelDetail — port of the design's invoice-model detail page
// (activity-invoice-model.jsx): one component whose hero, actions, banners
// and breakdown blocks adapt per card state. Includes the ImTransactions /
// ImItems / ImStatementBreakdown blocks and the transactions bottom sheet.

import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AlertBanner,
  BaseDialog,
  CompactHeader,
  HelpSupport,
  KvCopyRow,
  KvRow,
  RyButton,
  RyCard,
  RyCardHead,
  RyIcon,
  SectionTitle,
  ServiceRow,
  useCompactHeaderOffset,
  useStickyHeaderScroll,
} from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { rfmtDate } from '@/src/data';
import { useT } from '@/src/i18n';
import { radii, type SemanticColors } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

import {
  imFmt,
  type ImBreakdownRow,
  type ImCardData,
  type ImLineItem,
  type ImTransaction,
} from './invoiceModel';

// ── Transactions block (`.ry-kv` rows + subtle total) ───────────────────────

function ImTransactions({ transactions }: { transactions: ImTransaction[] }) {
  const { colors } = useRyTheme();
  const { t } = useT();
  const total = transactions.reduce((s, tx) => s + tx.amount, 0);
  return (
    <RyCard>
      {transactions.map((tx, i) => (
        <View key={i} style={[styles.kv, { borderBottomColor: colors.borderSubtle }]}>
          <View style={styles.kvTxLeft}>
            <Text style={[ryFont('400'), styles.kvText, { color: colors.fgSecondary, minWidth: 46 }]}>
              {tx.date}
            </Text>
            <Text style={[ryFont('400'), styles.kvText, { color: colors.fgPrimary }]}>
              {tx.name}
            </Text>
          </View>
          <Text style={[ryFont('400'), styles.kvNum, { color: colors.fgPrimary }]}>
            {imFmt(tx.amount)} kr
          </Text>
        </View>
      ))}
      <View style={[styles.kv, styles.kvTotal, { backgroundColor: colors.bgSubtle }]}>
        <Text style={[ryFont('700'), styles.kvText, { color: colors.fgPrimary }]}>
          {t('detail.total')}
        </Text>
        <Text style={[ryFont('700'), styles.kvNum, { color: colors.fgPrimary }]}>
          {imFmt(total)} kr
        </Text>
      </View>
    </RyCard>
  );
}

// ── Merchant line items (`.im-li`) ───────────────────────────────────────────

function ImItems({ items }: { items: ImLineItem[] }) {
  const { colors } = useRyTheme();
  const { t } = useT();
  const total = items.reduce((s, li) => s + li.qty * li.price, 0);
  return (
    <RyCard>
      {items.map((li, i) => (
        <View key={i} style={[styles.li, { borderBottomColor: colors.borderSubtle }]}>
          <Text style={[ryFont('400'), styles.liText, { color: colors.fgPrimary }]}>
            <Text style={{ color: colors.fgSecondary }}>{li.qty}× </Text>
            {li.name}
          </Text>
          <Text style={[ryFont('400'), styles.liNum, { color: colors.fgPrimary }]}>
            {imFmt(li.qty * li.price)} kr
          </Text>
        </View>
      ))}
      <View style={[styles.li, styles.liTotal, { backgroundColor: colors.bgSubtle }]}>
        <Text style={[ryFont('700'), styles.liText, { color: colors.fgPrimary }]}>
          {t('detail.total')}
        </Text>
        <Text style={[ryFont('700'), styles.liNum, { color: colors.fgPrimary }]}>
          {imFmt(total)} kr
        </Text>
      </View>
    </RyCard>
  );
}

// ── Statement breakdown with expandable purchase rows ───────────────────────

function ImStatementBreakdown({ breakdown }: { breakdown: ImBreakdownRow[] }) {
  const { colors } = useRyTheme();
  const { t } = useT();
  const [openRow, setOpenRow] = useState<number | null>(null);
  const total = breakdown.reduce((s, row) => s + row.amount, 0);
  const opened = openRow != null ? breakdown[openRow] : null;

  return (
    <>
      <RyCard>
        {breakdown.map((row, i) =>
          row.transactions ? (
            <Pressable
              key={i}
              onPress={() => setOpenRow(i)}
              style={({ pressed }) => [
                styles.kv,
                { borderBottomColor: colors.borderSubtle },
                pressed && { backgroundColor: colors.bgSubtle },
              ]}>
              <View style={styles.kvChevLeft}>
                <Text style={[ryFont('400'), styles.kvText, { color: colors.fgSecondary }]}>
                  {row.label}
                </Text>
                <RyIcon name="fa-chevron-right" size={10} color={colors.fgDisabled} />
              </View>
              <Text style={[ryFont('400'), styles.kvNum, { color: colors.fgPrimary }]}>
                {imFmt(row.amount)} kr
              </Text>
            </Pressable>
          ) : (
            <View key={i} style={[styles.kv, { borderBottomColor: colors.borderSubtle }]}>
              <Text style={[ryFont('400'), styles.kvText, { color: colors.fgSecondary }]}>
                {row.label}
              </Text>
              <Text style={[ryFont('400'), styles.kvNum, { color: colors.fgPrimary }]}>
                {imFmt(row.amount)} kr
              </Text>
            </View>
          ),
        )}
        <View style={[styles.kv, styles.kvTotal, { backgroundColor: colors.bgSubtle }]}>
          <Text style={[ryFont('700'), styles.kvText, { color: colors.fgPrimary }]}>
            {t('detail.this_payment')}
          </Text>
          <Text style={[ryFont('700'), styles.kvNum, { color: colors.fgPrimary }]}>
            {imFmt(total)} kr
          </Text>
        </View>
      </RyCard>

      <BaseDialog
        open={openRow != null}
        onClose={() => setOpenRow(null)}
        title={opened?.label}>
        {opened?.transactions ? <ImTransactions transactions={opened.transactions} /> : null}
      </BaseDialog>
    </>
  );
}

// ── Detail screen ────────────────────────────────────────────────────────────

export function InvoiceModelDetail({ card: c }: { card: ImCardData }) {
  const { colors, dark } = useRyTheme();
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const headerOffset = useCompactHeaderOffset();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();

  const s = c.state;
  const isReadOnly = s === 'cancelled';
  const fmtD = (iso?: string | null) => rfmtDate(iso);

  // Hero sub-line: text + colour by state.
  const sub = (() => {
    switch (s) {
      case 'topay':
        return {
          text: c.urgent ? t('sub.urgent', c.daysLeft) : t('sub.due', fmtD(c.dueDate)),
          cls: c.urgent ? 'urgent' : 'muted',
        };
      case 'overdue':
        return { text: t('sub.overdue', c.daysOverdue), cls: 'error' };
      case 'failed':
        return { text: t('sub.failed'), cls: 'error' };
      case 'snoozed':
        return { text: t('sub.due', fmtD(c.snooze?.newDue)), cls: 'muted' };
      case 'scheduled':
        return {
          text: t('sub.scheduled', imFmt(c.scheduled?.amount ?? 0), fmtD(c.scheduled?.date)),
          cls: 'info',
        };
      case 'paid-partial':
        return {
          text: t(
            'sub.paid_partial',
            imFmt(c.paid?.amount ?? 0),
            imFmt(c.paid?.of ?? 0),
            fmtD(c.paid?.date),
          ),
          cls: 'success',
        };
      case 'paid-full':
        return { text: t('sub.paid_full', fmtD(c.paid?.date)), cls: 'success' };
      case 'missed':
        return { text: t('sub.missed'), cls: 'error' };
      case 'cancelled':
        return { text: t('sub.cancelled', fmtD(c.cancelledDate)), cls: 'muted' };
      default:
        return { text: '', cls: 'muted' };
    }
  })();
  const subColor = {
    urgent: colors.warningDark,
    error: colors.errorMain,
    info: colors.infoMain,
    success: colors.successDark,
    muted: colors.fgSecondary,
  }[sub.cls as 'urgent' | 'error' | 'info' | 'success' | 'muted'];
  const heroLabel =
    s === 'topay' || s === 'overdue' || s === 'failed' || s === 'snoozed' || s === 'missed'
      ? t('detail.amount_due')
      : t('detail.inv_amount');
  const strikeAmount = s === 'cancelled' || s === 'paid-partial';

  const desc =
    c.billType === 'InstallmentBill' && c.loan
      ? t('desc.loan', imFmt(c.loan.amount))
      : c.billType === 'PartpaymentBill' && c.loan
        ? t('desc.partpay', imFmt(c.loan.amount), c.name)
        : c.billType === 'StatementBill'
          ? t('desc.statement', c.name)
          : c.billType === 'AccountBill'
            ? t('desc.account', c.name)
            : c.billType === 'InvoiceBill' && c.items
              ? t(
                  'desc.invoice',
                  imFmt(c.items.reduce((sum, li) => sum + li.qty * li.price, 0)),
                  c.name,
                )
              : c.desc;

  return (
    <View style={[styles.screen, { backgroundColor: colors.bgDefault }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: headerOffset,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 32,
        }}
        showsVerticalScrollIndicator={false}>
        {/* ── Hero ── */}
        <View
          style={[
            styles.hero,
            { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle },
          ]}>
          <Text style={[ryFont('400'), styles.heroLabel, { color: colors.fgSecondary }]}>
            {heroLabel}
          </Text>
          <Text
            style={[
              ryFont('700'),
              styles.heroValue,
              { color: c.strike || strikeAmount ? colors.fgSecondary : colors.fgPrimary },
              (c.strike || strikeAmount) && styles.strike,
            ]}>
            {imFmt(c.amount)}
            <Text style={[ryFont('700'), styles.heroCurrency]}> kr</Text>
          </Text>
          <Text
            style={[
              sub.cls === 'muted' ? ryFont('400') : ryFont('600'),
              styles.heroSub,
              { color: subColor },
            ]}>
            {sub.text}
          </Text>

          {s === 'topay' || s === 'snoozed' ? (
            <RyButton title={t('btn.pay')} icon="fa-bolt" block style={styles.heroBtn} />
          ) : null}
          {s === 'topay' && c.billType === 'InvoiceBill' ? (
            <RyButton
              title={t('svc.snooze')}
              icon="fa-bell-slash"
              variant="outlined"
              block
              style={styles.heroBtnTight}
            />
          ) : null}
          {s === 'overdue' || s === 'missed' ? (
            <RyButton
              title={t('btn.pay')}
              icon="fa-bolt"
              block
              style={[styles.heroBtn, { backgroundColor: colors.errorMain }]}
            />
          ) : null}
          {s === 'failed' ? (
            <RyButton
              title={t('btn.try_again')}
              icon="fa-rotate-right"
              block
              style={styles.heroBtn}
            />
          ) : null}
          {s === 'scheduled' ? (
            <RyButton
              title={t('btn.change_scheduled')}
              icon="fa-calendar-pen"
              variant="outlined"
              block
              style={styles.heroBtn}
            />
          ) : null}
          {s === 'paid-partial' ? (
            <RyButton
              title={t('btn.pay_more')}
              icon="fa-bolt"
              variant="outlined"
              block
              style={styles.heroBtn}
            />
          ) : null}
        </View>

        {/* ── State banners ── */}
        {s === 'topay' && c.partPay && c.billType !== 'AccountBill' ? (
          <AlertBanner variant="info" style={styles.banner}>
            <Text style={[ryFont('400'), styles.bannerText, { color: bannerFg(colors, dark) }]}>
              {t('banner.partpay_pre')}
              <Text style={ryFont('700')}>{t('banner.partpay_link')}</Text>
              {t('banner.partpay_post')}
            </Text>
          </AlertBanner>
        ) : null}
        {s === 'overdue' ? (
          <AlertBanner
            variant="error"
            title={t('banner.overdue.title')}
            body={t('banner.overdue.body')}
            style={styles.banner}
          />
        ) : null}
        {s === 'failed' ? (
          <AlertBanner
            variant="error"
            icon="fa-circle-exclamation"
            title={t('banner.failed.title')}
            body={t('banner.failed.body')}
            style={styles.banner}
          />
        ) : null}
        {s === 'scheduled' && c.initiated ? (
          <AlertBanner variant="info" body={t('banner.scheduled')} style={styles.banner} />
        ) : null}
        {s === 'paid-partial' ? (
          <AlertBanner variant="success" body={t('banner.paid_partial')} style={styles.banner} />
        ) : null}
        {s === 'paid-full' ? (
          <AlertBanner variant="success" body={t('banner.paid_full')} style={styles.banner} />
        ) : null}
        {s === 'missed' ? (
          <AlertBanner
            variant="error"
            title={t('banner.missed.title')}
            body={t('banner.missed.body')}
            style={styles.banner}
          />
        ) : null}
        {c.hasMissed && s !== 'missed' && s !== 'overdue' ? (
          <AlertBanner
            variant="error"
            title={t('banner.includes_missed.title')}
            body={t('banner.includes_missed.body')}
            style={styles.banner}
          />
        ) : null}
        {s === 'cancelled' ? (
          <AlertBanner variant="info" body={t('banner.cancelled')} style={styles.banner} />
        ) : null}

        {/* ── Snooze info box (snoozed only) ── */}
        {s === 'snoozed' && c.snooze ? (
          <>
            <AlertBanner
              variant="info"
              icon="fa-bell-slash"
              title={t('banner.snoozed.title')}
              body={t('banner.snoozed.body')}
              style={{ marginBottom: 12 }}
            />
            <RyCard style={{ marginBottom: 16 }}>
              <KvRow label={t('snooze.prev')} value={fmtD(c.snooze.prevDue)} />
              <KvRow label={t('snooze.new')} value={fmtD(c.snooze.newDue)} />
              <KvRow label={t('snooze.cost')} value={`${imFmt(c.snooze.cost)} kr`} />
              <KvRow label={t('snooze.length')} value={t('snooze.days', c.snooze.length)} last />
            </RyCard>
          </>
        ) : null}

        {/* ── Product / merchant section ── */}
        <SectionTitle>{c.name}</SectionTitle>
        <Text style={[ryFont('400'), styles.detailDesc, { color: colors.fgSecondary }]}>
          {desc}
        </Text>

        {c.kind === 'loan' && c.loan ? (
          <RyCard>
            <View style={[styles.loanProgress, { borderBottomColor: colors.borderSubtle }]}>
              <View style={styles.loanProgressHead}>
                <Text style={[ryFont('400'), styles.loanProgressLabel, { color: colors.fgSecondary }]}>
                  {t('detail.payment_n_of', c.loan.paymentNo, c.loan.paymentsTotal)}
                </Text>
                <Text style={[ryFont('400'), styles.loanProgressLabel, { color: colors.fgSecondary }]}>
                  {Math.round((c.loan.paymentNo / c.loan.paymentsTotal) * 100)}%
                </Text>
              </View>
              <View style={[styles.progress, { backgroundColor: colors.grey100 }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: colors.primaryMain,
                      width: `${(c.loan.paymentNo / c.loan.paymentsTotal) * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>
            <KvRow
              label={
                c.billType === 'PartpaymentBill'
                  ? t('detail.original_amount')
                  : t('detail.loan_amount')
              }
              value={`${imFmt(c.loan.amount)} kr`}
            />
            <KvRow
              label={
                c.billType === 'PartpaymentBill'
                  ? t('detail.remaining_debt')
                  : t('detail.remaining_balance')
              }
              value={`${imFmt(c.loan.remaining)} kr`}
              last={c.loan.principal == null}
            />
            {c.loan.principal != null ? (
              <KvRow
                label={t('detail.principal')}
                value={`${imFmt(c.loan.principal)} kr`}
                style={{ borderTopWidth: 2, borderTopColor: colors.borderSubtle }}
              />
            ) : null}
            {c.loan.interest != null ? (
              <KvRow label={t('detail.interest')} value={`${imFmt(c.loan.interest)} kr`} />
            ) : null}
            {c.loan.principal != null && c.loan.interest != null ? (
              <View style={[styles.kv, styles.kvTotal, { backgroundColor: colors.bgSubtle }]}>
                <Text style={[ryFont('700'), styles.kvText, { color: colors.fgPrimary }]}>
                  {t('detail.this_payment')}
                </Text>
                <Text style={[ryFont('700'), styles.kvNum, { color: colors.fgPrimary }]}>
                  {imFmt(c.loan.principal + c.loan.interest)} kr
                </Text>
              </View>
            ) : null}
          </RyCard>
        ) : c.transactions ? (
          <ImTransactions transactions={c.transactions} />
        ) : c.items ? (
          <ImItems items={c.items} />
        ) : c.kind === 'statement' && c.statementBreakdown ? (
          <ImStatementBreakdown breakdown={c.statementBreakdown} />
        ) : null}

        {/* ── Payment information ── */}
        <SectionTitle>{t('payinfo.title')}</SectionTitle>
        {s === 'purchase' ? (
          <RyCard style={{ padding: 16 }}>
            <Text style={[ryFont('400'), styles.awaiting, { color: colors.fgSecondary }]}>
              {t('detail.awaiting_invoice')}
            </Text>
          </RyCard>
        ) : (
          <RyCard>
            <KvCopyRow label={t('payinfo.ocr')} value={c.ocr} copy />
            <KvCopyRow label={t('payinfo.bankgiro')} value={c.bankgiro} copy />
            {c.dueDate ? <KvRow label={t('payinfo.due')} value={fmtD(c.dueDate)} /> : null}
            <Pressable
              style={({ pressed }) => [
                styles.pdfRow,
                pressed && { backgroundColor: colors.bgSubtle },
              ]}>
              <View style={[styles.pdfIcon, { backgroundColor: colors.bgSubtle }]}>
                <RyIcon name="fa-file-pdf" size={13} color={colors.primaryMain} />
              </View>
              <Text style={[ryFont('500'), styles.pdfTitle, { color: colors.fgPrimary }]}>
                {t('payinfo.pdf')}
              </Text>
              <RyIcon name="fa-chevron-right" size={12} color={colors.fgDisabled} />
            </Pressable>
          </RyCard>
        )}

        {/* ── Services ── */}
        {!isReadOnly ? (
          <>
            <RyCardHead label={t('svc.title')} style={styles.svcHead} />
            <RyCard>
              {s === 'topay' || s === 'snoozed' || s === 'overdue' || s === 'missed' || s === 'failed' ? (
                <ServiceRow icon="fa-bolt" title={t('btn.pay')} />
              ) : null}
              {s === 'scheduled' ? (
                <ServiceRow icon="fa-calendar-xmark" title={t('btn.cancel_scheduled')} />
              ) : null}
              {(s === 'topay' || s === 'snoozed') && c.billType === 'InvoiceBill' ? (
                <ServiceRow icon="fa-bell-slash" title={t('svc.snooze')} />
              ) : null}
              <ServiceRow icon="fa-house-chimney" title={t('svc.product')} />
              <ServiceRow icon="fa-flag" title={t('svc.report')} last />
            </RyCard>
          </>
        ) : null}

        <HelpSupport />
      </Animated.ScrollView>

      <CompactHeader
        title={t(c.typeKey || 'kind.' + c.kind)}
        onBack={() => router.back()}
        scrollY={scrollY}
      />
    </View>
  );
}

// AlertBanner children need the variant fg colour (info here).
function bannerFg(colors: SemanticColors, dark: boolean): string {
  return dark ? '#B8E6FE' : colors.infoDark;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  hero: {
    borderWidth: 1,
    borderRadius: radii.xl,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  heroLabel: {
    fontSize: 13,
    marginBottom: 4,
    textAlign: 'center',
  },
  heroValue: {
    fontSize: 44,
    letterSpacing: 44 * -0.02,
    lineHeight: 44 * 1.05,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  heroCurrency: { fontSize: 44, letterSpacing: 0 },
  strike: { textDecorationLine: 'line-through' },
  heroSub: {
    fontSize: 13,
    lineHeight: 13 * 1.4,
    marginTop: 10,
    textAlign: 'center',
  },
  heroBtn: { marginTop: 16 },
  heroBtnTight: { marginTop: 8 },
  banner: { marginBottom: 16 },
  bannerText: { fontSize: 13, lineHeight: 13 * 1.4 },
  detailDesc: {
    fontSize: 13,
    lineHeight: 13 * 1.5,
    marginHorizontal: 4,
    marginBottom: 10,
  },
  kv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  kvTotal: { borderBottomWidth: 0 },
  kvTxLeft: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'baseline',
    flex: 1,
    minWidth: 0,
  },
  kvChevLeft: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  kvText: { fontSize: 14 },
  kvNum: { fontSize: 14, fontVariant: ['tabular-nums'] },
  li: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  liTotal: { borderBottomWidth: 0 },
  liText: { fontSize: 14, flex: 1, minWidth: 0 },
  liNum: { fontSize: 14, fontVariant: ['tabular-nums'] },
  loanProgress: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  loanProgressHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  loanProgressLabel: { fontSize: 13 },
  progress: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: { height: '100%' },
  awaiting: { fontSize: 14, lineHeight: 14 * 1.5 },
  pdfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
  },
  pdfIcon: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pdfTitle: { flex: 1, minWidth: 0, fontSize: 15 },
  svcHead: { paddingTop: 20, paddingHorizontal: 4, paddingBottom: 8 },
});
