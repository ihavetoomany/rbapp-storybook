// MyResursScreen — port of tabs.jsx MyResursTab with mode="Expo MVP"
// (= sandbox.jsx MyResursSandboxExpoStyle), per the porting guide:
// StickyHeader title-only, account card (profile / messages / documents /
// knowledge / cancel-agreement), Support, Payment settings and General
// settings sections — then the prototype-tweaks section and the Log out
// button (user requirement, PORTING_GUIDE §My Resurs + Tweaks).
//
// Rows are the design's `.ry-row.settings` under `.ry-mr-aligned`
// (title 15/500, sub 12/1.35) and section headers match the Activity
// tab's `.ry-section-title` (uppercase 13/600) — hence the local MrRow
// instead of the stock RyRow settings variant.

import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  RyBadgeNew,
  RyButton,
  RyCard,
  RyIcon,
  RyPage,
  SectionTitle,
  StickyHeader,
  StickyHeaderHero,
  useStickyHeaderScroll,
} from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { useReadState } from '@/src/features/inbox/ReadStateProvider';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { usePersona, useSession } from '@/src/tweaks/TweaksProvider';

/* `.ry-mr-aligned .ry-row.settings` row. */
function MrRow({
  icon,
  reg = false,
  title,
  sub,
  badgeNew,
  ext = false,
  last = false,
  onPress,
}: {
  icon: string;
  reg?: boolean;
  title: string;
  sub?: string;
  badgeNew?: string;
  ext?: boolean;
  last?: boolean;
  onPress?: () => void;
}) {
  const { colors } = useRyTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.borderSubtle },
        last && styles.rowLast,
        pressed && { backgroundColor: colors.bgSubtle },
      ]}>
      <View style={styles.sIcon}>
        <RyIcon name={icon} size={19} color={colors.iconMuted} regular={reg} />
      </View>
      <View style={styles.body}>
        <Text style={[ryFont('500'), styles.title, { color: colors.fgPrimary }]} numberOfLines={1}>
          {title}
        </Text>
        {sub ? (
          <Text
            style={[ryFont('400'), styles.sub, { color: colors.fgSecondary }]}
            numberOfLines={2}>
            {sub}
          </Text>
        ) : null}
      </View>
      {badgeNew ? <RyBadgeNew label={badgeNew} /> : null}
      {ext ? (
        <RyIcon name="fa-arrow-up-right-from-square" size={15} color={colors.iconMuted} />
      ) : (
        <RyIcon name="fa-chevron-right" size={12} color={colors.fgDisabled} />
      )}
    </Pressable>
  );
}

export function MyResursScreen(): React.JSX.Element {
  const { t } = useT();
  const { colors } = useRyTheme();
  const persona = usePersona();
  const { logout } = useSession();
  const { readItems } = useReadState();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();

  // L2 badges — unread messages/documents net of the shared read state.
  const msgUnread = (persona.messages || []).filter((m) => m.unread && !readItems.has(m.id)).length;
  const docUnread = (persona.documents || []).filter((d) => d.unread && !readItems.has(d.id)).length;

  const openSetting = (title: string) => router.push({ pathname: '/setting', params: { title } });

  const onLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.bgDefault }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}>
        <StickyHeaderHero title={t('mr.title')} scrollY={scrollY} />
        <RyPage>
          {/* Account / profile group */}
          <RyCard>
            <MrRow
              icon="fa-user"
              reg
              title={persona.name}
              sub={t('mr.profile_sub')}
              onPress={() => router.push('/profile')}
            />
            <MrRow
              icon="fa-envelope"
              reg
              title={t('mr.messages')}
              sub={t('mr.messages_sub')}
              badgeNew={msgUnread ? t('mr.unread', msgUnread) : undefined}
              onPress={() => router.push('/messages')}
            />
            <MrRow
              icon="fa-file-lines"
              reg
              title={t('mr.documents')}
              sub={t('mr.documents_sub')}
              badgeNew={docUnread ? t('mr.new', docUnread) : undefined}
              onPress={() =>
                router.push({
                  pathname: '/documents',
                  params: { title: t('docs.title'), filter: 'all', chips: 'all,requested' },
                })
              }
            />
            <MrRow
              icon="fa-shield"
              title={t('mr.knowledge')}
              sub={t('mr.knowledge_sub')}
              onPress={() => openSetting(t('mr.knowledge'))}
            />
            <MrRow
              icon="fa-arrow-rotate-left"
              title={t('mr.cancel_agreement')}
              sub={t('mr.cancel_agreement_sub')}
              onPress={() => openSetting(t('mr.cancel_agreement'))}
              last
            />
          </RyCard>

          {/* Support */}
          <SectionTitle>{t('mr.section.support')}</SectionTitle>
          <Text style={[ryFont('400'), styles.mrDesc, { color: colors.fgSecondary }]}>
            {t('mr.support_desc')}
          </Text>
          <RyCard>
            <MrRow
              icon="fa-question"
              title={t('mr.faq')}
              sub={t('mr.faq_sub')}
              ext
              onPress={() => openSetting(t('mr.faq'))}
            />
            <MrRow
              icon="fa-envelope"
              reg
              title={t('mr.send_msg')}
              sub={t('mr.send_msg_sub')}
              ext
              onPress={() => openSetting(t('mr.send_msg'))}
            />
            <MrRow
              icon="fa-comments"
              reg
              title={t('mr.tickets')}
              sub={t('mr.tickets_sub')}
              ext
              onPress={() => openSetting(t('mr.tickets'))}
              last
            />
          </RyCard>

          {/* Payment settings */}
          <SectionTitle>{t('mr.section.payment')}</SectionTitle>
          <RyCard>
            <MrRow
              icon="fa-link"
              title={t('mr.connect_bank')}
              sub={t('mr.connect_bank_sub')}
              onPress={() => openSetting(t('mr.connect_bank'))}
              last
            />
          </RyCard>

          {/* General settings */}
          <SectionTitle>{t('mr.section.general')}</SectionTitle>
          <RyCard>
            <MrRow
              icon="fa-bell"
              reg
              title={t('mr.notifications')}
              sub={t('mr.notifications_sub')}
              onPress={() => openSetting(t('mr.notifications'))}
            />
            <MrRow
              icon="fa-palette"
              title={t('mr.theme')}
              sub={t('mr.theme_light')}
              onPress={() => openSetting(t('mr.theme'))}
            />
            <MrRow
              icon="fa-language"
              title={t('mr.language')}
              sub={t('mr.language_value')}
              onPress={() => openSetting(t('mr.language'))}
              last
            />
          </RyCard>

          {/* Prototype tweaks (user requirement — just above Log out) */}
          <SectionTitle>{t('mr.section.tweaks')}</SectionTitle>
          <RyCard>
            <MrRow
              icon="fa-sliders"
              title={t('mr.tweaks')}
              sub={t('mr.tweaks_sub')}
              onPress={() => router.push('/tweaks')}
              last
            />
          </RyCard>

          <RyButton
            title={t('mr.logout')}
            variant="logout"
            block
            icon="fa-arrow-right-from-bracket"
            onPress={onLogout}
            style={styles.logout}
          />
        </RyPage>
      </Animated.ScrollView>
      <StickyHeader title={t('mr.title')} scrollY={scrollY} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  // `.ry-mr-aligned .ry-row.settings`
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
  rowLast: { borderBottomWidth: 0 },
  sIcon: {
    width: 26,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, minWidth: 0 },
  title: { fontSize: 15, lineHeight: 15 * 1.3 },
  sub: { fontSize: 12, lineHeight: 12 * 1.35, marginTop: 2 },
  // `.ry-mr-desc`
  mrDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginHorizontal: 4,
    marginBottom: 12,
  },
  logout: { marginTop: 24 },
});
