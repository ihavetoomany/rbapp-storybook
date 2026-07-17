// ActivityBell — the Activity tabs' StickyHeader bell (`.ry-pill-btn.icon
// .ry-bell` with the plain unread dot; Q3 notifCount is always null).
// Opens the shared notifications sheet.

import React from 'react';

import { BellButton } from '@/src/components/ry';
import { useNotifications } from '@/src/features/notifications/NotificationsProvider';

export function ActivityBell() {
  const { openBell } = useNotifications();
  return <BellButton dot onPress={openBell} />;
}
