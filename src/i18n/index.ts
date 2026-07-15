// i18n entry point — ported from design-reference/i18n.js (ryT / ryTName / ryTCard).
//
// t(lang, key, ...args): looks the key up in the selected dictionary, falling
// back to English and finally to the key itself. Function-valued messages are
// called with the trailing args (exact ryT semantics).

import { useTweaks } from '@/src/tweaks/TweaksProvider';

import { en, sv } from './translations';
import { CARD_SV, CTX_PREFIX_SV, NAMES_SV } from './translations.cards';

export type Lang = 'English' | 'Svenska';

export function t(lang: Lang, key: string, ...args: (string | number)[]): string {
  const dict = lang === 'Svenska' ? sv : en;
  const val = key in dict ? dict[key] : key in en ? en[key] : key;
  return typeof val === 'function' ? val(...args) : val;
}

// Translate product/invoice display names (e.g. "Private loan" → "Privatlån").
export function tName(lang: Lang, name: string): string {
  if (lang !== 'Svenska') return name;
  return NAMES_SV[name] ?? name;
}

// ── Wallet card labels (account cards + product cards) ──────────────────────
// Whole strings are looked up first; composed context (joined with " · ") is
// translated segment-by-segment, keeping the interpolated numbers/dates.
function tCardSeg(seg: string): string {
  if (CARD_SV[seg]) return CARD_SV[seg];
  const m = seg.match(/^(\d+) accounts?$/);
  if (m) return m[1] + (m[1] === '1' ? ' konto' : ' konton');
  const ma = seg.match(/^(\d+) active accounts?$/);
  if (ma) return ma[1] + (ma[1] === '1' ? ' aktivt konto' : ' aktiva konton');
  const na = seg.match(/^(\d+) needs attention$/);
  if (na) return na[1] + ' kräver åtgärd';
  let out = seg;
  for (const [enPrefix, svPrefix] of CTX_PREFIX_SV) {
    if (out.indexOf(enPrefix) === 0) {
      out = svPrefix + out.slice(enPrefix.length);
      break;
    }
  }
  out = out.replace('locked to', 'låst till');
  return out;
}

export function tCard(lang: Lang, s: string): string {
  if (s == null) return s;
  if (lang !== 'Svenska') return s;
  if (CARD_SV[s]) return CARD_SV[s];
  return String(s).split(' · ').map(tCardSeg).join(' · ');
}

// Hook: reads the current language from the tweaks context.
export function useT(): {
  t: (key: string, ...args: (string | number)[]) => string;
  tName: (n: string) => string;
  tCard: (s: string) => string;
  lang: Lang;
} {
  const { tweaks } = useTweaks();
  const lang: Lang = tweaks.lang;
  return {
    lang,
    t: (key: string, ...args: (string | number)[]) => t(lang, key, ...args),
    tName: (n: string) => tName(lang, n),
    tCard: (s: string) => tCard(lang, s),
  };
}
