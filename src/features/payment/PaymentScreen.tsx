// PaymentScreen — dial screen ("Select amount" / "Change amount").
// Port of PaymentScreen in design-reference/revolving-credit-pay.jsx:
// dial + tier explanation + Swedish consumer-credit warning box + CTA.

import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { RyIcon } from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';

import type { PayConfig } from './configFor';
import { formatSEK } from './constants';
import { PaymentDial } from './PaymentDial';
import { RcCtaZone, RcCtaButton } from './RcCta';
import { RcHeader } from './RcHeader';

export type PaymentScreenProps = {
  config: PayConfig;
  amount: number;
  setAmount: (v: number) => void;
  onPay: () => void;
  onClose: () => void;
  isFixed: boolean;
  onBack?: () => void;
};

export function PaymentScreen({
  config,
  amount,
  setAmount,
  onPay,
  onClose,
  isFixed,
  onBack,
}: PaymentScreenProps) {
  const { colors, dark } = useRyTheme();
  const { t } = useT();
  const [dialDragging, setDialDragging] = useState(false);

  const { balance, topCredit, minimum, interestRatePct, isPlan, planStops, dialMax } = config;
  const full = config.full ?? balance;

  // ── Tier explanation (title + body under the dial) ────────────────────
  let tier: { id: string; title: string; body: string };
  if (isPlan && planStops) {
    const lower = [...planStops].reverse().find((s) => amount >= s.value) || planStops[0];
    const id = lower.id;
    const rest = Math.max(0, full - amount);
    const planBody =
      id === 'full'
        ? t('rc.tier.plan.full', formatSEK(full))
        : id === 'min'
          ? t('rc.tier.plan.min', formatSEK(amount), formatSEK(rest), interestRatePct)
          : t(
              'rc.tier.plan.months',
              formatSEK(amount),
              formatSEK(rest),
              id === 'm3' ? 3 : id === 'm6' ? 6 : 12,
            );
    tier = { id, title: t(lower.labelKey), body: planBody };
  } else if (isFixed) {
    tier = {
      id: 'custom',
      title: t('rc.tier.custom.title'),
      body: t('rc.tier.fixed.body', formatSEK(config.fixedAmount ?? amount)),
    };
  } else {
    const sixmo = Math.ceil(balance / 6);
    if (amount <= minimum + 50) {
      tier = {
        id: 'min',
        title: t('rc.tier.min.title'),
        body: t('rc.tier.min.body', formatSEK(minimum), formatSEK(balance - minimum), interestRatePct),
      };
    } else if (amount < sixmo) {
      tier = {
        id: 'slow',
        title: t('rc.tier.custom.title'),
        body: t('rc.tier.slow.body', formatSEK(balance - amount), interestRatePct),
      };
    } else if (amount <= sixmo + 50) {
      tier = {
        id: 'sixmo',
        title: t('rc.tier.sixmo.title'),
        body: t('rc.tier.sixmo.body', formatSEK(sixmo)),
      };
    } else if (amount < balance - 1) {
      tier = {
        id: 'partial',
        title: t('rc.tier.sixmo.title'),
        body: t('rc.tier.partial.body', formatSEK(amount), formatSEK(balance - amount)),
      };
    } else if (amount <= balance + 1) {
      tier = {
        id: 'full',
        title: t('rc.tier.full.title'),
        body: t('rc.tier.full.body', formatSEK(balance)),
      };
    } else if (amount < topCredit) {
      tier = {
        id: 'topup',
        title: t('rc.tier.topup.title'),
        body: t('rc.tier.topup.body', formatSEK(amount - balance)),
      };
    } else {
      tier = {
        id: 'allused',
        title: t('rc.tier.allused.title'),
        body: t('rc.tier.allused.body', formatSEK(topCredit)),
      };
    }
  }

  const showWarning = !isFixed && (isPlan ? amount < full : amount < balance);

  return (
    <View style={styles.screen}>
      <RcHeader
        title={onBack ? t('rc.change_amount') : t('rc.select_amount')}
        onBack={onBack}
        onClose={onClose}
      />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        scrollEnabled={!dialDragging}
        showsVerticalScrollIndicator={false}>
        <PaymentDial
          balance={isPlan ? dialMax : topCredit}
          statement={isPlan ? full : balance}
          minimum={minimum}
          interestPortion={Math.round((balance * (interestRatePct / 100)) / 12)}
          amount={amount}
          onChange={setAmount}
          colorMode="teal"
          planStops={isPlan ? planStops : null}
          onDraggingChange={setDialDragging}
        />

        {/* Tier block (`.rc-tier`, tierFade on change) */}
        <Animated.View key={tier.id} entering={FadeIn.duration(250)} style={styles.tier}>
          <Text style={[ryFont('700'), styles.tierTitle, { color: colors.fgPrimary }]}>
            {tier.title}
          </Text>
          <Text style={[ryFont('400'), styles.tierBody, { color: colors.fgSecondary }]}>
            {tier.body}
          </Text>

          {showWarning ? (
            <View
              accessibilityRole="alert"
              style={[
                styles.warning,
                {
                  // The design hardcodes a white card; in dark mode we fall
                  // back to the paper surface so the copy stays readable.
                  backgroundColor: dark ? colors.bgPaper : '#FFFFFF',
                  borderColor: colors.errorLight,
                },
              ]}>
              <RyIcon
                name="fa-triangle-exclamation"
                size={32}
                color={colors.errorMain}
                style={styles.warningIcon}
              />
              <View style={styles.warningText}>
                <Text style={[ryFont('700'), styles.warningTitle, { color: colors.errorDark }]}>
                  {t('rc.warning.title')}
                </Text>
                <Text style={[ryFont('400'), styles.warningBody, { color: colors.fgPrimary }]}>
                  {t('rc.warning.body')}
                  <Text
                    style={[ryFont('600'), { color: colors.errorDark, textDecorationLine: 'underline' }]}
                    onPress={() => Linking.openURL('https://konsumentverket.se')}>
                    {t('rc.warning.link')}
                    <RyIcon
                      name="fa-arrow-up-right-from-square"
                      size={10}
                      color={colors.errorDark}
                      style={{ marginLeft: 4 }}
                    />
                  </Text>
                  .
                </Text>
              </View>
            </View>
          ) : null}
        </Animated.View>
      </ScrollView>

      <RcCtaZone>
        <RcCtaButton
          disabled={amount < minimum}
          onPress={onPay}
          title={
            amount < minimum
              ? t('rc.cta.minimum', formatSEK(minimum))
              : isFixed
                ? t('rc.cta.use', formatSEK(amount))
                : t('rc.cta.pay', formatSEK(amount))
          }
          trailingIcon={amount < minimum ? undefined : 'fa-arrow-right'}
        />
      </RcCtaZone>
    </View>
  );
}

const styles = StyleSheet.create({
  // .ry-rcsheet .rc-screen: padding-top 6px
  screen: {
    flex: 1,
    paddingTop: 6,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  // .rc-tier: text-align center, padding 18px 4px 6px
  tier: {
    paddingTop: 18,
    paddingHorizontal: 4,
    paddingBottom: 6,
  },
  tierTitle: {
    fontSize: 22,
    lineHeight: 22 * 1.15,
    letterSpacing: 22 * -0.02,
    textAlign: 'center',
    marginBottom: 7,
  },
  tierBody: {
    fontSize: 13,
    lineHeight: 13 * 1.4,
    textAlign: 'left',
  },
  // .rc-warning: margin 12px 0 0, padding 12px 14px, radius 10, error border
  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  warningIcon: {
    marginTop: 1,
    marginRight: 11,
  },
  warningText: {
    flex: 1,
    minWidth: 0,
  },
  warningTitle: {
    fontSize: 13,
    marginBottom: 2,
  },
  warningBody: {
    fontSize: 12,
    lineHeight: 12 * 1.4,
    textAlign: 'left',
  },
});
