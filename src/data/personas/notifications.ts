// src/data/personas/notifications.ts — notification visibility model
// (RY_NOTIF), ported 1:1 from the design prototype's data.js.
//
// Each content type declares which of the three visibility levels it feeds:
//   L1 = global nav badge (urgency / genuinely new only)
//   L2 = My Resurs section badge ("Messages" / "Documents")
//   L3 = list-view unread dot
// Bank messages carry a 30-day recency gate for L1/L2.

import { today } from '../format';
import type { NotifContentType, NotifItem, NotifLevelSpec } from '../types';

const NOTIF_LEVELS: Record<string, NotifLevelSpec> = {
  // High — payment + binding agreements: all three levels
  REMINDER: { l1: true, l2: true, l3: true, tier: 'high' },
  AGREEMENT: { l1: true, l2: true, l3: true, tier: 'high' },
  CREDIT_AGREEMENT: { l1: true, l2: true, l3: true, tier: 'high' },
  CONSUMER_LOAN_AGREEMENT: { l1: true, l2: true, l3: true, tier: 'high' },
  // Requested sendouts — surfaced everywhere incl. the urgent bell (L1)
  REQUEST: { l1: true, l2: true, l3: true, tier: 'medium' },
  // Bank messages: section (within 30d) + list. Never global.
  MESSAGE: { l1: false, l2: true, l3: true, tier: 'medium', recencyDays: 30 },
  // Low / reference (terms, SEKKI, statements, insurance…): list dot only
  _DEFAULT: { l1: false, l2: false, l3: true, tier: 'low' },
};

export const RY_NOTIF = {
  levels: (type: NotifContentType | string): NotifLevelSpec => NOTIF_LEVELS[type] || NOTIF_LEVELS._DEFAULT,
  /**
   * Does `item` (a doc or message) count toward visibility `level` (1|2|3)?
   * `type` is the doc type, or 'MESSAGE' for bank messages. `readSet` is the
   * shared set of opened-item ids.
   */
  counts: (item: NotifItem, type: NotifContentType | string, level: 1 | 2 | 3, readSet?: Set<string> | null): boolean => {
    const lv = NOTIF_LEVELS[type] || NOTIF_LEVELS._DEFAULT;
    if (!lv[`l${level}`]) return false;
    const unread = !!item.unread && !(readSet && readSet.has(item.id));
    if (!unread) return false;
    if (lv.recencyDays) {
      const ageDays = Math.abs(today().getTime() - new Date(item.date).getTime()) / 86400000;
      if (ageDays > lv.recencyDays) return false;
    }
    return true;
  },
};
