// Shared coverage/info sheets — ports of details.jsx PaymentProtectionDialog,
// CashbackInfoDialog and the Resurs Family insurance dialog.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BaseDialog, RyButton, RyCard, RyIcon } from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { useT } from '@/src/i18n';
import { radii } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

/* ============================================================
 * PaymentProtectionDialog — `.ry-ppi-dialog`.
 * ============================================================ */

export function PaymentProtectionDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { colors } = useRyTheme();
  const { t, tName } = useT();

  return (
    <BaseDialog open={open} onClose={onClose} size="medium">
      <View style={styles.heroWrap}>
        <View style={[styles.insHero, { backgroundColor: colors.primaryBackground }]}>
          <RyIcon name="fa-shield" size={42} color={colors.primaryMain} />
          <View style={styles.insHeroCk}>
            <RyIcon name="fa-check" size={17} color={colors.bgPaper} />
          </View>
        </View>
      </View>
      <Text style={[ryFont('700'), styles.title, { color: colors.fgPrimary }]}>
        {tName('Payment protection insurance')}
      </Text>

      <RyCard style={styles.kvCard}>
        <View style={styles.insKv}>
          <Text style={[ryFont('400'), styles.insKvText, { color: colors.fgPrimary }]}>
            {t('ppi.linked_to')}
          </Text>
          <Text style={[ryFont('400'), styles.insKvText, { color: colors.fgPrimary }]}>
            RESURS WORLD
          </Text>
        </View>
        <View style={[styles.insKv, { marginTop: 12 }]}>
          <Text style={[ryFont('400'), styles.insKvText, { color: colors.fgPrimary }]}>
            {t('ppi.insurer')}
          </Text>
          <Text style={[ryFont('400'), styles.insKvText, { color: colors.fgPrimary }]}>
            Solid Försäkring
          </Text>
        </View>
      </RyCard>

      <Text style={[ryFont('700'), styles.h3, { color: colors.fgPrimary }]}>{t('ppi.when_title')}</Text>
      <Text style={[ryFont('400'), styles.p, { color: colors.fgPrimary }]}>{t('ppi.when_intro')}</Text>

      <RyCard style={styles.listCard}>
        {[t('ppi.bullet1'), t('ppi.bullet2'), t('ppi.bullet3'), t('ppi.bullet4')].map((b, i, arr) => (
          <View key={i} style={[styles.li, i === arr.length - 1 && { marginBottom: 0 }]}>
            <Text style={[ryFont('400'), styles.liBullet, { color: colors.fgPrimary }]}>{'•'}</Text>
            <Text style={[ryFont('400'), styles.liText, { color: colors.fgPrimary }]}>{b}</Text>
          </View>
        ))}
      </RyCard>

      <Text style={[ryFont('400'), styles.p, { color: colors.fgPrimary, marginTop: 18 }]}>
        {t('ppi.compensation')}
      </Text>
      <Text style={[ryFont('400'), styles.p, { color: colors.fgPrimary, marginBottom: 4 }]}>
        {t('ppi.full_terms')}
      </Text>

      <View style={styles.actions}>
        <RyButton title={t('ppi.cancel_insurance')} variant="primary" block onPress={onClose} />
        <RyButton title={t('wd.success.close')} variant="outlined" block onPress={onClose} />
      </View>
    </BaseDialog>
  );
}

/* ============================================================
 * CashbackInfoDialog — "how cashback works" (strings via tCard/CARD_SV).
 * ============================================================ */

export function CashbackInfoDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { colors } = useRyTheme();
  const { tCard } = useT();

  const Fine = ({ children }: { children: string }) => (
    <Text style={[ryFont('400'), styles.fine, { color: colors.fgSecondary }]}>{children}</Text>
  );

  return (
    <BaseDialog open={open} onClose={onClose} title={tCard('Cashback')} size="medium">
      <View style={styles.heroWrap}>
        <View style={[styles.cbHero, { backgroundColor: colors.cashbackBg }]}>
          <RyIcon name="fa-bolt" size={24} color="#1c1c1c" />
        </View>
      </View>
      <Text style={[ryFont('700'), styles.title, { color: colors.fgPrimary, marginBottom: 14 }]}>
        {tCard('How cashback works')}
      </Text>
      <Text style={[ryFont('400'), styles.p, { color: colors.fgPrimary }]}>
        {tCard(
          'When you shop with your card, you can get part of the amount back. The money is automatically deposited into your savings account with 3% interest.',
        )}
      </Text>
      <View style={styles.cbList}>
        <View style={styles.li}>
          <Text style={[ryFont('400'), styles.liBullet, { color: colors.fgPrimary }]}>{'•'}</Text>
          <Text style={[ryFont('400'), styles.liText, { color: colors.fgPrimary }]}>
            <Text style={ryFont('700')}>{tCard('1% on most everyday purchases')}</Text>
            {tCard(
              ' – e.g. groceries, clothing, fuel, pharmacy, public transport, streaming, electricity and water.',
            )}
          </Text>
        </View>
        <View style={[styles.li, { marginBottom: 0 }]}>
          <Text style={[ryFont('400'), styles.liBullet, { color: colors.fgPrimary }]}>{'•'}</Text>
          <Text style={[ryFont('400'), styles.liText, { color: colors.fgPrimary }]}>
            <Text style={ryFont('700')}>{tCard('0.5% on most other purchases')}</Text>
            {tCard(' – e.g. building supplies and subscriptions.')}
          </Text>
        </View>
      </View>
      <Fine>
        {tCard(
          'The percentage a purchase earns depends on how the store is registered, not on what you buy – so it can sometimes differ from what you expect.',
        )}
      </Fine>
      <Fine>
        {tCard(
          'You can earn a maximum of 125 kr in cashback per month (1,500 kr/year). Cash withdrawals, currency exchange, bill payments, gambling and adult-content purchases earn no cashback. In the event of returns or complaints, the amount may be adjusted.',
        )}
      </Fine>
      <Fine>{tCard('In your card terms, cashback is referred to as “money back.”')}</Fine>
      <RyButton
        title={tCard('Close')}
        variant="outlined"
        block
        onPress={onClose}
        style={{ marginTop: 22 }}
      />
    </BaseDialog>
  );
}

/* ============================================================
 * FamilyInsuranceDialog — Resurs Family coverage overview.
 * ============================================================ */

export function FamilyInsuranceDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { colors } = useRyTheme();
  const { t, tCard } = useT();

  const cards = [
    { icon: 'fa-house', title: t('fins.home_title'), help: t('fins.home_help'), amount: t('fins.home_amount') },
    { icon: 'fa-bowl-food', title: t('fins.food_title'), help: t('fins.food_help'), amount: t('fins.food_amount') },
    { icon: 'fa-plane', title: t('fins.travel_title'), help: t('fins.travel_help'), amount: t('fins.travel_amount') },
  ];

  return (
    <BaseDialog open={open} onClose={onClose} title={tCard('Family insurance')} size="medium">
      <View style={{ marginBottom: 14 }}>
        <Text style={[ryFont('700'), styles.finsHead, { color: colors.fgPrimary }]}>
          {t('fins.headline')}
        </Text>
        <Text style={[ryFont('400'), styles.finsSub, { color: colors.fgSecondary }]}>
          {t('fins.intro')}
        </Text>
      </View>
      {cards.map((c, i) => (
        <View
          key={i}
          style={[
            styles.insCard,
            { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle },
          ]}>
          <View style={styles.insCardHead}>
            <RyIcon name={c.icon} size={20} color={colors.primaryMain} />
            <Text style={[ryFont('700'), styles.insCardTitle, { color: colors.primaryMain }]}>
              {c.title}
            </Text>
          </View>
          <Text style={[ryFont('400'), styles.insCardHelp, { color: colors.fgSecondary }]}>
            {c.help}
          </Text>
          <View style={styles.insCardFoot}>
            <Text style={[ryFont('400'), styles.insCardAmount, { color: colors.fgSecondary }]}>
              {'•'} {c.amount}
            </Text>
            <View style={styles.insIncluded}>
              <Text style={[ryFont('700'), styles.insIncludedText, { color: colors.primaryMain }]}>
                {t('fins.included')}
              </Text>
              <RyIcon name="fa-circle-check" size={13} color={colors.primaryMain} />
            </View>
          </View>
        </View>
      ))}
      <RyButton
        title={tCard('Close')}
        variant="outlined"
        block
        onPress={onClose}
        style={{ marginTop: 8 }}
      />
    </BaseDialog>
  );
}

const styles = StyleSheet.create({
  heroWrap: { alignItems: 'center', marginTop: 4, marginBottom: 16 },
  insHero: {
    width: 84,
    height: 84,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insHeroCk: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -8.5 }, { translateY: -10 }],
  },
  cbHero: {
    width: 56,
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { textAlign: 'center', fontSize: 22, marginBottom: 18 },
  kvCard: { paddingVertical: 16, paddingHorizontal: 18 },
  insKv: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  insKvText: { fontSize: 16 },
  h3: { fontSize: 17, lineHeight: 22, marginTop: 20, marginBottom: 12 },
  p: { fontSize: 15, lineHeight: 22, marginBottom: 16 },
  listCard: { paddingVertical: 16, paddingHorizontal: 20 },
  li: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  liBullet: { fontSize: 15, lineHeight: 22 },
  liText: { flex: 1, fontSize: 15, lineHeight: 22 },
  cbList: { marginBottom: 16 },
  fine: { fontSize: 13, lineHeight: 19, fontStyle: 'italic', marginBottom: 10 },
  actions: { gap: 10, marginTop: 22 },
  finsHead: { fontSize: 20, lineHeight: 25 },
  finsSub: { fontSize: 14, lineHeight: 20, marginTop: 6 },
  insCard: {
    borderWidth: 1,
    borderRadius: radii.xl,
    padding: 16,
    marginBottom: 12,
  },
  insCardHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  insCardTitle: { flex: 1, fontSize: 16 },
  insCardHelp: { fontSize: 14, lineHeight: 20, marginTop: 6, marginBottom: 10 },
  insCardFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  insCardAmount: { flex: 1, fontSize: 13, lineHeight: 18 },
  insIncluded: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 },
  insIncludedText: { fontSize: 13 },
});
