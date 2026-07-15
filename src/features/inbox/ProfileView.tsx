// ProfileView — port of tabs.jsx ProfileView (`My profile` detail page):
// CompactHeader + 34px page title, identity summary card (legal name,
// address lines, customer ID) and a Contact information card with
// `.ry-row.settings` rows.

import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';

import {
  CompactHeader,
  RyCard,
  RyPage,
  RyRow,
  SectionTitle,
  useCompactHeaderOffset,
  useStickyHeaderScroll,
} from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { usePersona } from '@/src/tweaks/TweaksProvider';

export function ProfileView(): React.JSX.Element {
  const { t } = useT();
  const { colors } = useRyTheme();
  const persona = usePersona();
  const router = useRouter();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();
  const topOffset = useCompactHeaderOffset();

  const pr = persona.profile;

  return (
    <Animated.View style={[styles.screen, { backgroundColor: colors.bgDefault }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: topOffset }}>
        <RyPage style={styles.page}>
          <Text style={[ryFont('700'), styles.pageTitle, { color: colors.fgPrimary }]}>
            {t('profile.title')}
          </Text>

          {/* Identity summary */}
          <RyCard style={styles.identityCard}>
            <Text style={[ryFont('700'), styles.profileName, { color: colors.fgPrimary }]}>
              {pr?.legalName || persona.name}
            </Text>
            {(pr?.address || []).map((line, i) => (
              <Text
                key={i}
                style={[ryFont('400'), styles.profileLine, { color: colors.fgSecondary }]}>
                {line}
              </Text>
            ))}
            {pr?.customerId ? (
              <>
                <Text style={[ryFont('700'), styles.profileLabel, { color: colors.fgPrimary }]}>
                  {t('profile.customer_id')}
                </Text>
                <Text style={[ryFont('400'), styles.profileLine, { color: colors.fgSecondary }]}>
                  {pr.customerId}
                </Text>
              </>
            ) : null}
          </RyCard>

          <SectionTitle mr>{t('profile.contact_section')}</SectionTitle>
          <RyCard>
            <RyRow
              variant="settings"
              icon="fa-user"
              iconRegular
              title={t('profile.preferred_name')}
              sub={pr?.preferredName}
              chevron
            />
            <RyRow
              variant="settings"
              icon="fa-envelope"
              iconRegular
              title={t('profile.email')}
              sub={pr?.email}
              chevron
            />
            <RyRow
              variant="settings"
              icon="fa-mobile-screen-button"
              title={t('profile.phone')}
              sub={pr?.phone}
              chevron
              last
            />
          </RyCard>
        </RyPage>
      </Animated.ScrollView>
      <CompactHeader title={t('profile.title')} onBack={() => router.back()} scrollY={scrollY} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  page: { paddingTop: 0 },
  // `.ry-page-title` — 34/700, -0.02em, margin-bottom 20.
  pageTitle: {
    fontSize: 34,
    lineHeight: 34 * 1.05,
    letterSpacing: 34 * -0.02,
    marginBottom: 20,
  },
  identityCard: { padding: 20 },
  profileName: { fontSize: 16, lineHeight: 24, marginBottom: 4 },
  profileLine: { fontSize: 14, lineHeight: 24 },
  profileLabel: { fontSize: 16, lineHeight: 24, marginTop: 16 },
});
