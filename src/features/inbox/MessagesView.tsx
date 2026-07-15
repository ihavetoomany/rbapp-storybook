// MessagesView — port of tabs.jsx MessagesView (Q3 heading "Messages from
// the bank"): CompactHeader + page title + `.ry-doc-row` message list with
// unread dots. Opening a message marks it read and pushes the reader.

import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import {
  CompactHeader,
  RyIcon,
  RyPage,
  useCompactHeaderOffset,
  useStickyHeaderScroll,
} from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import type { RyMessage } from '@/src/data';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { usePersona } from '@/src/tweaks/TweaksProvider';

import { useReadState } from './ReadStateProvider';

export function MessagesView(): React.JSX.Element {
  const { t } = useT();
  const { colors } = useRyTheme();
  const persona = usePersona();
  const router = useRouter();
  const { readItems, markRead } = useReadState();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();
  const topOffset = useCompactHeaderOffset();

  const msgs = persona.messages || [];
  const heading = t('mr.messages_q3');
  const isUnread = (m: RyMessage) => m.unread && !readItems.has(m.id);

  const open = (m: RyMessage) => {
    markRead(m.id);
    router.push({ pathname: '/message/[msgId]', params: { msgId: m.id } });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.bgDefault }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: topOffset }}>
        <RyPage style={styles.page}>
          <Text style={[ryFont('700'), styles.pageTitle, { color: colors.fgPrimary }]}>
            {heading}
          </Text>
          {msgs.length === 0 ? (
            <Text style={[ryFont('400'), styles.empty, { color: colors.fgSecondary }]}>
              {t('msgs.empty')}
            </Text>
          ) : (
            msgs.map((m, i) => {
              const unread = isUnread(m);
              return (
                <Pressable
                  key={m.id}
                  onPress={() => open(m)}
                  style={({ pressed }) => [
                    styles.row,
                    { borderBottomColor: colors.borderSubtle },
                    i === msgs.length - 1 && styles.rowLast,
                    pressed && { backgroundColor: colors.bgSubtle },
                  ]}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: unread ? colors.primaryMain : 'transparent' },
                    ]}
                  />
                  <View style={styles.body}>
                    <Text
                      style={[
                        ryFont(unread ? '700' : '400'),
                        styles.title,
                        { color: colors.fgPrimary },
                      ]}>
                      {m.subject}
                    </Text>
                    <Text style={[ryFont('400'), styles.meta, { color: colors.fgSecondary }]}>
                      {m.preview}
                    </Text>
                    <Text style={[ryFont('400'), styles.meta, { color: colors.fgSecondary }]}>
                      {m.date}
                    </Text>
                  </View>
                  <RyIcon
                    name="fa-chevron-right"
                    size={14}
                    color={colors.iconMuted}
                    style={styles.chev}
                  />
                </Pressable>
              );
            })
          )}
        </RyPage>
      </Animated.ScrollView>
      <CompactHeader title={heading} onBack={() => router.back()} scrollY={scrollY} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  page: { paddingTop: 0 },
  pageTitle: {
    fontSize: 34,
    lineHeight: 34 * 1.05,
    letterSpacing: 34 * -0.02,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLast: { borderBottomWidth: 0 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginTop: 7,
    flexShrink: 0,
  },
  body: { flex: 1, minWidth: 0 },
  title: { fontSize: 16, lineHeight: 24 },
  meta: { fontSize: 14, lineHeight: 24 },
  chev: { marginTop: 4 },
  empty: {
    paddingVertical: 48,
    paddingHorizontal: 8,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 24,
  },
});
