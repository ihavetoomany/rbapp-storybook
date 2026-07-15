// ProductDetailView — port of details.jsx (Q3 · App):
//  · Resurs Family (p-family): bespoke tabbed layout (Overview / Family)
//  · Resurs Family v2 (p-family-v2, Bjarne's sandbox): single-view layout
//  · every other product: hero (Gold bento / savings / loan / themed) +
//    quick actions + purchases + accounts + (Gold) cards + open invoices.
//
// Deviation: the design's pointer-driven swipe between the Family panes is
// approximated with the Segmented control only (no swipe gesture).

import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  HelpSupport,
  PaymentRequestRow,
  RyCard,
  RyIcon,
  RyRow,
  SectionTitle,
  Segmented,
  ServiceRow,
  TransactionRow,
} from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { rfmt, rfmtDate, type Account, type CreditAccount, type FamilyMember, type Product, type Purchase } from '@/src/data';
import { useT } from '@/src/i18n';
import { radii } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { AccountRow, CardRow, CashbackNote, InvoiceRow, LinkRow, SeeAllButton, SeeAllInline } from './rows';
import { CashbackInfoDialog, FamilyInsuranceDialog, PaymentProtectionDialog } from './dialogs';
import { DetailScreen } from './DetailScreen';
import { FamilyBentoHero, FamilyBentoHeroV2, GoldBentoHero, LoanProductHero, SavingsProductHero, ThemedProductHero } from './heroes';
import * as nav from './nav';
import { SpendingPatternCard } from './SpendingPatternCard';

const goldCardImg = require('@/assets/design/card.png');

/* ============================================================
 * Family purchase row — `.ry-row.ry-fam-purchase`.
 * ============================================================ */

function FamPurchaseRow({
  tx,
  holder,
  cashback = 0,
  v2 = false,
  last = false,
  onPress,
}: {
  tx: Purchase;
  holder?: string;
  cashback?: number;
  /** v2: bolt badge in the title + Reserved/Part pay labels on the right. */
  v2?: boolean;
  last?: boolean;
  onPress?: () => void;
}) {
  const { colors, dark } = useRyTheme();
  const { t, tCard } = useT();

  const rightSub = tx.preliminary ? (
    v2 ? (
      <View style={[styles.reservedLabel, { backgroundColor: colors.bgSubtle }]}>
        <Text style={[ryFont('500'), styles.reservedText, { color: colors.fgSecondary }]}>
          {tCard('Reserved')}
        </Text>
      </View>
    ) : (
      <Text style={[ryFont('400'), styles.rightSubText, { color: colors.fgSecondary }]}>
        {tCard('Reserved')}
      </Text>
    )
  ) : v2 ? (
    tx.amount && tx.amount.amount >= 1000 ? (
      <View style={[styles.partpayLabel, { backgroundColor: dark ? colors.bgSubtle : '#EDF7F3' }]}>
        <Text style={[ryFont('600'), styles.reservedText, { color: colors.primaryMain }]}>
          {t('tag.part_pay')}
        </Text>
      </View>
    ) : null
  ) : cashback > 0 ? (
    <View style={[styles.cashbackBadge, { backgroundColor: colors.cashbackBg }]}>
      <RyIcon name="fa-bolt" size={10} color="#1c1c1c" />
      <Text style={[ryFont('700'), styles.cashbackBadgeText]}>{cashback} kr</Text>
    </View>
  ) : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.famPurchase,
        { borderBottomColor: last ? 'transparent' : colors.borderSubtle },
        last && { borderBottomWidth: 0 },
        pressed && { backgroundColor: colors.bgSubtle },
      ]}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={styles.famTitleRow}>
          <Text style={[ryFont('600'), styles.famTitle, { color: colors.fgPrimary }]} numberOfLines={1}>
            {tx.merchant}
          </Text>
          {v2 && !tx.preliminary ? (
            <View style={[styles.cashbackDot, { backgroundColor: colors.cashbackBg }]}>
              <RyIcon name="fa-bolt" size={9} color="#1c1c1c" />
            </View>
          ) : null}
        </View>
        <Text style={[ryFont('400'), styles.famSub, { color: colors.fgSecondary }]}>
          {rfmtDate(tx.date)}
          {holder ? ` · ${holder}` : ''}
        </Text>
      </View>
      <View style={styles.famRight}>
        <Text style={[ryFont('700'), styles.famAmount, { color: colors.fgPrimary }]}>
          −{rfmt(tx.amount)} <Text style={[ryFont('500'), styles.famCur]}>{tx.amount.currency}</Text>
        </Text>
        {rightSub}
      </View>
    </Pressable>
  );
}

/* ============================================================
 * Family member rows — `.ry-fam-member` (+ add row).
 * ============================================================ */

function FamilyMemberRow({
  member: fm,
  showAge = false,
  showRole = false,
  last = false,
  onPress,
}: {
  member: FamilyMember;
  showAge?: boolean;
  showRole?: boolean;
  last?: boolean;
  onPress?: () => void;
}) {
  const { colors } = useRyTheme();
  const { t, tCard } = useT();
  const pillBg = fm.roleTone === 'info' ? colors.chipBlueBg : colors.chipGreenBg;
  const pillFg = fm.roleTone === 'info' ? colors.chipBlueText : colors.chipGreenText;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.famMember,
        { borderBottomColor: last ? 'transparent' : colors.borderSubtle },
        last && { borderBottomWidth: 0 },
        pressed && { backgroundColor: colors.bgSubtle },
      ]}>
      <View style={[styles.famAvatar, { backgroundColor: colors.bgSubtle }]}>
        <RyIcon name="fa-user" size={15} color={colors.iconMuted} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[ryFont('700'), styles.famMemberName, { color: colors.fgPrimary }]}>
          {fm.name}
        </Text>
        {showAge ? (
          <Text style={[ryFont('400'), styles.famMemberMeta, { color: colors.fgSecondary }]}>
            {t('fam.years_old', fm.age)}
          </Text>
        ) : null}
        <Text style={[ryFont('400'), styles.famMemberMeta, { color: colors.fgSecondary }]}>
          {tCard(fm.access)}
        </Text>
      </View>
      {showRole ? (
        <View style={[styles.famRolePill, { backgroundColor: pillBg }]}>
          <Text style={[ryFont('600'), styles.famRoleText, { color: pillFg }]}>{tCard(fm.role)}</Text>
        </View>
      ) : null}
      <RyIcon name="fa-chevron-right" size={12} color={colors.fgDisabled} />
    </Pressable>
  );
}

/* ============================================================
 * ProductDetailView
 * ============================================================ */

export function ProductDetailView({ product: p }: { product: Product }) {
  const { colors } = useRyTheme();
  const { t, tCard, tName } = useT();
  const [famTab, setFamTab] = useState<'overview' | 'family'>('overview');
  const [insuranceOpen, setInsuranceOpen] = useState(false);
  const [paymentProtOpen, setPaymentProtOpen] = useState(false);

  const visibleAccounts = (p.accounts || []).filter((a) => !a.hidden);
  const cred = (p.accounts || []).find((a): a is CreditAccount => a.type === 'creditAccount');
  const isFamilyOngoing = p.id === 'p-family' || p.id === 'p-family-v2';
  const isGold = p.id === 'p-gold';
  const cashbackOf = (tx: Purchase) => Math.floor((tx.amount.amount || 0) / 100);

  const openTxListPurchases = () => {
    const fc = (p.accounts || []).find((x) => x.type === 'creditAccount');
    if (fc) nav.openTxList(fc, p, { purchasesOnly: true });
  };

  /* ── Resurs Family (bespoke layouts) ── */
  if (isFamilyOngoing) {
    const latest = (p.purchases || []).filter((tx) => tx.type === 'purchase').slice(0, 5);
    const totalCashback = latest.reduce((s, tx) => s + cashbackOf(tx), 0);
    const famBuffer =
      (p.accounts || []).find((a) => a.id === 'a-fam-savings') ||
      (p.accounts || []).find((a) => a.id === 'a-fam-savings-v2');
    const famAcct = (p.accounts || []).find((x): x is CreditAccount => x.type === 'creditAccount');
    const famCards = (famAcct?.cards || []).filter(
      (c): c is { id: string; name: string } => 'id' in c && 'name' in c,
    );
    const mainHolder = famCards[0] ? famCards[0].name : '';
    const holderOf = (tx: Purchase) =>
      (tx.type === 'purchase' && tx.user && famCards.find((c) => c.id === tx.user)?.name) ||
      mainHolder;
    const prelim = latest.filter((tx) => tx.preliminary);
    const reg = latest.filter((tx) => !tx.preliminary);

    const dialogs = (
      <>
        <FamilyInsuranceDialog open={insuranceOpen} onClose={() => setInsuranceOpen(false)} />
        <PaymentProtectionDialog open={paymentProtOpen} onClose={() => setPaymentProtOpen(false)} />
      </>
    );

    const documentsCard = (
      <>
        <SectionTitle>{tCard('Documents and agreements')}</SectionTitle>
        <RyCard>
          <LinkRow
            icon="fa-file-contract"
            title="Account terms"
            sub="Resurs Family agreement"
            onPress={() => nav.openPlaceholder('Account terms')}
          />
          <LinkRow
            icon="fa-file-invoice"
            title="Price & fees"
            sub="Standardised information (SEKKI)"
            onPress={() => nav.openPlaceholder('Price & fees')}
          />
          <LinkRow
            icon="fa-file-lines"
            title="Statements"
            sub="Monthly invoices and receipts"
            last
            onPress={() => nav.openPlaceholder('Statements')}
          />
        </RyCard>
      </>
    );

    const myFamilyMembers = p.familyMembers || [];

    /* ── V2: single-view layout (Bjarne's sandbox) ── */
    if (p.id === 'p-family-v2') {
      return (
        <DetailScreen title="Resurs Family" overlay={dialogs}>
          <FamilyBentoHeroV2 product={p} onOpenAccount={(a, prod) => nav.openAccount(a, prod)} />

          {latest.length > 0 ? (
            <>
              <View style={styles.headRow}>
                <SectionTitle style={{ marginTop: 4 }}>{tCard('Transactions')}</SectionTitle>
                <SeeAllInline onPress={openTxListPurchases} />
              </View>
              <RyCard>
                {[...prelim, ...reg].map((tx, i, arr) => (
                  <FamPurchaseRow
                    key={tx.id}
                    tx={tx}
                    v2
                    holder={holderOf(tx)}
                    last={i === arr.length - 1}
                    onPress={() => nav.openTx(tx, p)}
                  />
                ))}
              </RyCard>
            </>
          ) : null}

          {myFamilyMembers.length > 0 ? (
            <>
              <View style={styles.headRow}>
                <SectionTitle>{tCard('My family')}</SectionTitle>
                <SeeAllInline label={t('common.edit')} onPress={() => nav.openPlaceholder('Edit family')} />
              </View>
              <RyCard>
                {myFamilyMembers.map((fm, i) => (
                  <FamilyMemberRow
                    key={fm.id}
                    member={fm}
                    last={i === myFamilyMembers.length - 1}
                    onPress={() => nav.openFamilyMember(fm, 'Bergström')}
                  />
                ))}
              </RyCard>
            </>
          ) : null}

          <SectionTitle>{tCard('Offers & Benefits')}</SectionTitle>
          <RyCard>
            <ServiceRow
              variant="explore"
              icon="fa-shield-halved"
              title="Family insurance"
              onPress={() => setInsuranceOpen(true)}
            />
            <ServiceRow
              variant="explore"
              icon="fa-shield-halved"
              title="Payment protection insurance"
              onPress={() => setPaymentProtOpen(true)}
            />
            {(p.offers || [])
              .filter((o) => o.type !== 'benefit' || o.icon !== 'fa-shield-halved')
              .map((o, i, arr) => (
                <ServiceRow
                  key={i}
                  icon={o.icon}
                  title={o.title}
                  sub={o.desc}
                  variant="offers"
                  last={i === arr.length - 1}
                  onPress={() => nav.openPlaceholder(o.title)}
                />
              ))}
          </RyCard>

          {documentsCard}
          <HelpSupport />
        </DetailScreen>
      );
    }

    /* ── Current: tabbed layout ── */
    return (
      <DetailScreen title="Resurs Family" overlay={dialogs}>
        <FamilyBentoHero product={p} />

        <Segmented
          options={[
            { id: 'overview', label: tCard('Overview') },
            { id: 'family', label: tCard('Family') },
          ]}
          value={famTab}
          onChange={(id) => setFamTab(id as 'overview' | 'family')}
          style={{ marginTop: 16 }}
        />

        {famTab === 'overview' ? (
          <>
            {latest.length > 0 ? (
              <>
                <SectionTitle style={{ marginTop: 4 }}>{tCard('Transactions')}</SectionTitle>
                <CashbackNote>
                  {`${tCard('Total cashback this month')}: ${totalCashback} kr`}
                </CashbackNote>
                <RyCard>
                  {[...prelim, ...reg].map((tx, i, arr) => (
                    <FamPurchaseRow
                      key={tx.id}
                      tx={tx}
                      holder={holderOf(tx)}
                      cashback={tx.preliminary ? 0 : cashbackOf(tx)}
                      onPress={() => nav.openTx(tx, p)}
                    />
                  ))}
                  <SeeAllButton onPress={openTxListPurchases} />
                </RyCard>
              </>
            ) : null}

            <SectionTitle>{tCard('Accounts')}</SectionTitle>
            <RyCard>
              {cred ? (
                <RyRow
                  icon="fa-credit-card"
                  iconBg={colors.primaryBackground}
                  iconColor={colors.primaryMain}
                  title={t('pd.family_credit')}
                  sub={`${tCard(p.primaryMetric.label)} ${rfmt(p.primaryMetric.value)} ${p.primaryMetric.value.currency}`}
                  chevron
                  last={!famBuffer}
                  onPress={() => nav.openAccount(cred, p)}
                />
              ) : null}
              {famBuffer && famBuffer.type === 'depositAccount' ? (
                <RyRow
                  icon="fa-piggy-bank"
                  iconBg={colors.primaryBackground}
                  iconColor={colors.primaryMain}
                  title={t('pd.family_buffer')}
                  sub={`${t('pd.total_saved')} ${rfmt(famBuffer.balance)} ${famBuffer.balance.currency}`}
                  chevron
                  last
                  onPress={() => nav.openAccount(famBuffer, p)}
                />
              ) : null}
            </RyCard>

            <SectionTitle>{tCard('Insurances')}</SectionTitle>
            <RyCard>
              <ServiceRow
                variant="explore"
                icon="fa-shield-halved"
                title="Family insurance"
                onPress={() => setInsuranceOpen(true)}
              />
              <ServiceRow
                variant="explore"
                icon="fa-shield-halved"
                title="Payment protection insurance"
                last
                onPress={() => setPaymentProtOpen(true)}
              />
            </RyCard>

            {(() => {
              const famInv = (p.invoices || []).filter((inv) => !cred || inv.accountId === cred.id);
              const invs = (famInv.length ? famInv : p.invoices || []).slice(0, 3);
              if (invs.length === 0) return null;
              return (
                <>
                  <SectionTitle>{tCard('Invoice history')}</SectionTitle>
                  <RyCard>
                    {invs.map((inv, i) => (
                      <InvoiceRow
                        key={inv.id}
                        inv={inv}
                        last={i === invs.length - 1}
                        onPress={() => nav.openInvoice(inv, p)}
                      />
                    ))}
                  </RyCard>
                </>
              );
            })()}

            {documentsCard}
            <HelpSupport />
          </>
        ) : (
          <>
            <SectionTitle style={{ marginTop: 4 }}>{tCard('Family spending overview')}</SectionTitle>
            <SpendingPatternCard />

            {myFamilyMembers.length > 0 ? (
              <>
                <SectionTitle>{tCard('My family')}</SectionTitle>
                <RyCard>
                  {myFamilyMembers.map((fm) => (
                    <FamilyMemberRow
                      key={fm.id}
                      member={fm}
                      showAge
                      showRole
                      onPress={() => nav.openFamilyMember(fm, 'Bergström')}
                    />
                  ))}
                  <Pressable
                    onPress={() => nav.openPlaceholder('Add family member')}
                    style={({ pressed }) => [
                      styles.famAdd,
                      pressed && { backgroundColor: colors.bgSubtle },
                    ]}>
                    <View style={[styles.famAvatar, { backgroundColor: colors.primaryBackground }]}>
                      <RyIcon name="fa-plus" size={14} color={colors.primaryMain} />
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={[ryFont('600'), styles.famMemberName, { color: colors.fgPrimary }]}>
                        {t('fam.add')}
                      </Text>
                      <Text style={[ryFont('400'), styles.famMemberMeta, { color: colors.fgSecondary }]}>
                        {t('fam.add_sub')}
                      </Text>
                    </View>
                    <RyIcon name="fa-chevron-right" size={12} color={colors.fgDisabled} />
                  </Pressable>
                </RyCard>
              </>
            ) : null}

            {(p.offers || []).length > 0 ? (
              <>
                <SectionTitle>{tCard('Offers & Benefits')}</SectionTitle>
                <RyCard>
                  {(p.offers || []).map((o, i, arr) => (
                    <ServiceRow
                      key={i}
                      icon={o.icon}
                      title={o.title}
                      sub={o.desc}
                      variant="offers"
                      last={i === arr.length - 1}
                      onPress={() => nav.openPlaceholder(o.title)}
                    />
                  ))}
                </RyCard>
              </>
            ) : (
              <RyCard style={{ padding: 20, alignItems: 'center' }}>
                <Text style={[ryFont('400'), { fontSize: 14, color: colors.fgSecondary }]}>
                  {t('pd.no_offers')}
                </Text>
              </RyCard>
            )}
            <HelpSupport />
          </>
        )}
      </DetailScreen>
    );
  }

  /* ── Generic product page ── */
  const quickActions = [
    { id: 'pay', label: t('pd.qa.pay'), icon: 'fa-bolt', title: 'Pay' },
    { id: 'move', label: t('pd.qa.move'), icon: 'fa-arrow-right-arrow-left', title: 'Move' },
    { id: 'card', label: t('pd.qa.card'), icon: 'fa-credit-card', title: 'Card' },
    { id: 'help', label: t('pd.qa.help'), icon: 'fa-headset', title: 'Help' },
  ];

  return (
    <DetailScreen title={tName(p.name)}>
      {/* Hero */}
      {isGold ? (
        <GoldBentoHero product={p} />
      ) : p.type === 'savings' ? (
        <SavingsProductHero product={p} />
      ) : p.type === 'loan' ? (
        <LoanProductHero product={p} />
      ) : (
        <ThemedProductHero product={p} />
      )}

      {/* Quick actions — hidden for Gold */}
      {!isGold ? (
        <View style={styles.qaGrid}>
          {quickActions.map((a) => (
            <Pressable
              key={a.id}
              onPress={() => nav.openPlaceholder(a.title)}
              style={({ pressed }) => [
                styles.qaBtn,
                { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle },
                pressed && { backgroundColor: colors.bgSubtle },
              ]}>
              <RyIcon name={a.icon} size={18} color={colors.primaryMain} />
              <Text style={[ryFont('600'), styles.qaLabel, { color: colors.fgPrimary }]}>
                {a.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {/* Purchases */}
      {p.purchases && p.purchases.length > 0 ? (
        <>
          <View style={styles.headRow}>
            <SectionTitle style={{ marginTop: 4 }}>{tCard('Recent purchases')}</SectionTitle>
          </View>
          <RyCard>
            {p.purchases.slice(0, 3).map((tx, i, arr) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                last={i === arr.length - 1}
                onPress={() => nav.openTx(tx, p)}
              />
            ))}
          </RyCard>
        </>
      ) : (
        <RyCard style={{ padding: 20, alignItems: 'center' }}>
          <Text style={[ryFont('400'), styles.emptyText, { color: colors.fgSecondary }]}>
            {p.origin === 'merchant' ? t('pd.empty.merchant', p.name) : t('pd.empty.generic')}
          </Text>
        </RyCard>
      )}

      {/* Accounts */}
      {visibleAccounts.length > 0 ? (
        <>
          <SectionTitle>{tCard('Accounts')}</SectionTitle>
          <RyCard>
            {visibleAccounts.map((a: Account, i) => (
              <AccountRow
                key={a.id}
                account={a}
                last={i === visibleAccounts.length - 1}
                onPress={() => nav.openAccount(a, p)}
              />
            ))}
          </RyCard>
        </>
      ) : null}

      {/* Cards — Gold only */}
      {isGold ? (
        <>
          <SectionTitle>{tCard('Cards')}</SectionTitle>
          <RyCard>
            {[
              { holder: 'John', last4: '9001', exp: '11/28', extra: false },
              { holder: 'Anna', last4: '9002', exp: '11/28', extra: true },
            ].map((c) => (
              <CardRow
                key={c.last4}
                img={goldCardImg}
                thumbVariant="landscape"
                title={`${c.holder} ····${c.last4}`}
                sub={`${tCard(c.extra ? 'Extra card' : 'Main card')} · ${tCard('Exp.')} ${c.exp}`}
                onPress={() => nav.openPlaceholder(c.extra ? 'Extra card settings' : 'Card settings')}
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
        </>
      ) : null}

      {/* Open invoices */}
      {p.paymentRequests && p.paymentRequests.length > 0 ? (
        <>
          <SectionTitle>{tCard('Open invoices')}</SectionTitle>
          <RyCard>
            {p.paymentRequests.map((pr, i, arr) => (
              <PaymentRequestRow
                key={pr.id}
                pr={pr}
                propName={pr.title}
                last={i === arr.length - 1}
                onPress={() => nav.openPR(pr)}
              />
            ))}
          </RyCard>
        </>
      ) : null}

      <HelpSupport />
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  headRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingRight: 4,
  },
  famPurchase: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
  famTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  famTitle: { fontSize: 16, lineHeight: 24, flexShrink: 1 },
  famSub: { fontSize: 14, lineHeight: 20 },
  famRight: { alignItems: 'flex-end', gap: 6, flexShrink: 0 },
  famAmount: { fontSize: 16, fontVariant: ['tabular-nums'] },
  famCur: { fontSize: 12 },
  rightSubText: { fontSize: 11, textAlign: 'right' },
  reservedLabel: { paddingVertical: 1, paddingHorizontal: 6, borderRadius: 4 },
  partpayLabel: { paddingVertical: 1, paddingHorizontal: 7, borderRadius: 4 },
  reservedText: { fontSize: 11 },
  cashbackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  cashbackBadgeText: { fontSize: 12, lineHeight: 12, color: '#1c1c1c' },
  cashbackDot: {
    width: 16,
    height: 16,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  famMember: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
  famAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  famAvatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  famMemberName: { fontSize: 16, lineHeight: 22 },
  famMemberMeta: { fontSize: 13, lineHeight: 17, marginTop: 1 },
  famRolePill: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 999,
    flexShrink: 0,
  },
  famRoleText: { fontSize: 12 },
  qaGrid: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  qaBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radii.xl,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 6,
  },
  qaLabel: { fontSize: 11 },
  emptyText: { fontSize: 14, textAlign: 'center' },
});
