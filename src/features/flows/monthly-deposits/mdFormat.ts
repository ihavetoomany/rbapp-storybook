// mdFormat — locale helpers for the Monthly-deposits flow, ported 1:1 from
// design-reference/monthly-deposits.jsx (mdMoney/mdFmt/mdOrdinal/mdFmtDate/
// mdNextDayDate/mdNextWeekdayDate/mdDepositDate/mdRecur/mdEveryPhrase).
// The design read the language from window.RY_LANG; here every helper takes
// the `Lang` explicitly (callers pass `useT().lang`).

import { rfmt } from '@/src/data';
import type { Money, MonthlyDepositConfig } from '@/src/data/types';
import type { Lang } from '@/src/i18n';

export const mdMoney = (n: number): Money => ({ amount: n, currency: 'SEK' });
export const mdFmt = (money: Money): string => `${rfmt(money)} kr`;

// Always relative to the real current date (normalized to midnight) so upcoming
// deposit dates are computed in the future from "today", not a fixed demo date.
const MD_TODAY = (): Date => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const MD_MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MD_MONTHS_SV = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
const MD_WEEKDAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MD_WEEKDAYS_SV = ['måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag'];
const MD_ORDINAL_WEEKS_EN = ['first', 'second', 'third', 'fourth', 'last'];
const MD_ORDINAL_WEEKS_SV = ['första', 'andra', 'tredje', 'fjärde', 'sista'];

const isSv = (lang: Lang) => lang === 'Svenska';

export const mdMonths = (lang: Lang): string[] => (isSv(lang) ? MD_MONTHS_SV : MD_MONTHS_EN);
export const mdWeekdays = (lang: Lang): string[] => (isSv(lang) ? MD_WEEKDAYS_SV : MD_WEEKDAYS_EN);
export const mdOrdWeeks = (lang: Lang): string[] =>
  isSv(lang) ? MD_ORDINAL_WEEKS_SV : MD_ORDINAL_WEEKS_EN;

export const mdOrdinal = (lang: Lang, n: number): string => {
  if (isSv(lang)) {
    const v = n % 100;
    if (v === 11 || v === 12) return n + ':e';
    const d = n % 10;
    return n + (d === 1 || d === 2 ? ':a' : ':e');
  }
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const mdFmtDate = (lang: Lang, date: Date): string =>
  `${date.getDate()} ${mdMonths(lang)[date.getMonth()]} ${date.getFullYear()}`;

/** Next occurrence of a given day-of-month, from today (FE-derived). */
export const mdNextDayDate = (day: number): Date => {
  const t = MD_TODAY();
  let d = new Date(t.getFullYear(), t.getMonth(), day);
  if (d <= t) d = new Date(t.getFullYear(), t.getMonth() + 1, day);
  return d;
};

/** Next occurrence of the Nth (1–4 / 'last') weekday of the month, from today. */
export const mdNextWeekdayDate = (ordinalWeekIdx: number, weekdayIdx: number): Date => {
  // weekdayIdx: 0=Mon..6=Sun → JS getDay: 0=Sun..6=Sat
  const jsTarget = (weekdayIdx + 1) % 7;
  const t = MD_TODAY();
  const compute = (year: number, month: number): Date => {
    if (ordinalWeekIdx === 4) {
      // last
      const last = new Date(year, month + 1, 0);
      const back = (last.getDay() - jsTarget + 7) % 7;
      return new Date(year, month + 1, 0 - back);
    }
    const first = new Date(year, month, 1);
    const offset = (jsTarget - first.getDay() + 7) % 7;
    return new Date(year, month, 1 + offset + ordinalWeekIdx * 7);
  };
  let d = compute(t.getFullYear(), t.getMonth());
  if (d <= t) d = compute(t.getFullYear(), t.getMonth() + 1);
  return d;
};

/** The recurrence date for a deposit (FE-derived). */
export const mdDepositDate = (dep: MonthlyDepositConfig): Date =>
  dep.mode === 'weekday'
    ? mdNextWeekdayDate(dep.ordinalWeek, dep.weekday)
    : mdNextDayDate(dep.day);

/** Human "repeat" phrase ("on the 5th of each month" / "den 5:e varje månad"). */
export const mdRecur = (lang: Lang, dep: MonthlyDepositConfig): string => {
  if (dep.mode === 'weekday') {
    const w = `${mdOrdWeeks(lang)[dep.ordinalWeek]} ${mdWeekdays(lang)[dep.weekday]}`;
    return isSv(lang) ? `den ${w} varje månad` : `on the ${w}`;
  }
  const o = mdOrdinal(lang, dep.day);
  return isSv(lang) ? `den ${o} varje månad` : `on the ${o} of each month`;
};

/** Short "every …" phrase for the summary card sub line. */
export const mdEveryPhrase = (lang: Lang, dep: MonthlyDepositConfig): string =>
  dep.mode === 'weekday'
    ? `${mdOrdWeeks(lang)[dep.ordinalWeek]} ${mdWeekdays(lang)[dep.weekday]}`
    : mdOrdinal(lang, dep.day);
