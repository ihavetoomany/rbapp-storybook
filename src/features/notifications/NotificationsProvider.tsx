// NotificationsProvider — the app-level notifications bell + sheet.
//
// Port of app.jsx's buildBellItems (Q3 branch: two static info notices,
// lines ~594-598) and NotifSheetContent (lines ~279-384), rendered in a
// BaseDialog like the design's `Sheet open title="Notifications"`.
//
// Q3 semantics:
//  · the bell shows a plain unread dot until "Mark all as read" is tapped
//    (design: notifCount === null → dot; notifsSeen → hidden);
//  · info notices map to real bank messages (INFO_MSG) so tapping one
//    opens the right message via the Messages stack;
//  · the sheet's local read state resets every time the bell is opened
//    (the design rebuilds the item list per open);
//  · everything resets when the persona changes.

import { useRouter } from 'expo-router';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BaseDialog, RyButton, RyCard, RyIcon } from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { rfmtRel, RY_TODAY } from '@/src/data';
import { useReadState } from '@/src/features/inbox/ReadStateProvider';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { usePersona, useTweaks } from '@/src/tweaks/TweaksProvider';

type NotificationsValue = {
  /** Open the notifications sheet (the design's bell tap). */
  openBell: () => void;
  /** Whether the bell should show its unread dot (Q3: until "mark all"). */
  bellDot: boolean;
};

const NotificationsContext = createContext<NotificationsValue | null>(null);

/** Info/news notifications map to a real bank message (app.jsx INFO_MSG). */
const INFO_MSG: Record<string, string> = {
  'info-rates': 'msg-rate',
  'info-hours': 'msg-hours',
};

type BellItem = {
  id: string;
  title: string;
  desc: string;
  when: string;
};

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const { t } = useT();
  const { colors } = useRyTheme();
  const { tweaks } = useTweaks();
  const persona = usePersona();
  const { markRead } = useReadState();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  // "Mark as read" in the bell sheet — hides the static dot (notifsSeen).
  const [seen, setSeen] = useState(false);
  // Sheet-local read state — resets on every open, like the design's
  // NotifSheetContent (its items prop is rebuilt per bell tap).
  const [localRead, setLocalRead] = useState<Set<string>>(() => new Set());

  // Persona switch resets the notification state (app.jsx ~477).
  useEffect(() => {
    setSeen(false);
    setOpen(false);
  }, [tweaks.persona]);

  // buildBellItems — Q3 branch: two static info notices, no offers.
  const items: BellItem[] = [
    {
      id: 'info-rates',
      title: t('notif.rates_title'),
      desc: t('notif.rates_desc'),
      when: rfmtRel(RY_TODAY),
    },
    {
      id: 'info-hours',
      title: t('notif.hours_title'),
      desc: t('notif.hours_desc'),
      when: t('notif.hours_when'),
    },
  ];

  const openBell = useCallback(() => {
    setLocalRead(new Set());
    setOpen(true);
  }, []);

  const isUnread = (n: BellItem) => !localRead.has(n.id);
  const hasUnread = items.some(isUnread);

  const openItem = (n: BellItem) => {
    setLocalRead((prev) => {
      const s = new Set(prev);
      s.add(n.id);
      return s;
    });
    setOpen(false);
    const mid = INFO_MSG[n.id];
    const msg = mid ? (persona.messages || []).find((m) => m.id === mid) : undefined;
    router.push('/messages');
    if (msg) {
      markRead(msg.id);
      router.push({ pathname: '/message/[msgId]', params: { msgId: msg.id } });
    }
  };

  const markAllRead = () => {
    setLocalRead(new Set(items.map((n) => n.id)));
    setSeen(true);
  };

  const value = useMemo<NotificationsValue>(
    () => ({ openBell, bellDot: !seen }),
    [openBell, seen],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      <BaseDialog open={open} onClose={() => setOpen(false)} title={t('notif.title')}>
        <RyCard style={styles.card}>
          {items.map((n, i) => (
            <Pressable
              key={n.id}
              onPress={() => openItem(n)}
              style={({ pressed }) => [
                styles.row,
                { borderBottomColor: colors.borderSubtle },
                i === items.length - 1 && styles.rowLast,
                pressed && { backgroundColor: colors.bgSubtle },
              ]}>
              <View style={styles.body}>
                <View style={styles.titleRow}>
                  {isUnread(n) ? (
                    <View style={[styles.dot, { backgroundColor: colors.errorMain }]} />
                  ) : null}
                  <Text style={[ryFont('500'), styles.title, { color: colors.fgPrimary }]}>
                    {n.title}
                  </Text>
                </View>
                <Text style={[ryFont('400'), styles.sub, { color: colors.fgSecondary }]}>
                  {n.desc}
                </Text>
              </View>
              <View style={styles.right}>
                <Text style={[ryFont('400'), styles.when, { color: colors.fgSecondary }]}>
                  {n.when}
                </Text>
              </View>
              <RyIcon name="fa-chevron-right" size={12} color={colors.iconMuted} />
            </Pressable>
          ))}
        </RyCard>
        {hasUnread ? (
          <RyButton
            title={t('notif.mark_all')}
            variant="outlined"
            block
            onPress={markAllRead}
            style={styles.markAll}
          />
        ) : null}
      </BaseDialog>
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within a NotificationsProvider');
  return ctx;
}

const styles = StyleSheet.create({
  card: { marginBottom: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLast: { borderBottomWidth: 0 },
  body: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  // `.ry-notif-dot` — 7px error dot before the unread title.
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    marginRight: 5,
  },
  title: { fontSize: 15, lineHeight: 20 },
  sub: { fontSize: 12, lineHeight: 16, marginTop: 2 },
  right: { flexShrink: 0, alignItems: 'flex-end' },
  when: { fontSize: 11 },
  markAll: { marginTop: 12 },
});
