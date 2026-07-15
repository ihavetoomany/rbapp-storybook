// RyIcon — renders the design's FontAwesome `fa-*` icon names via
// FontAwesome6 from @expo/vector-icons. Solid by default (the design's
// `fas`); pass `regular` for the design's `far` style. Unknown names
// render 'circle-question' instead of a missing glyph.

import { FontAwesome6 } from '@expo/vector-icons';
import React from 'react';
import type { StyleProp, TextStyle } from 'react-native';

// Legacy FA5-style aliases → FontAwesome 6 glyph names, for safety. The
// design's names are already FA6 in almost every case.
const ALIASES: Record<string, string> = {
  times: 'xmark',
  home: 'house',
  'sliders-h': 'sliders',
  'exclamation-triangle': 'triangle-exclamation',
  'exclamation-circle': 'circle-exclamation',
  'question-circle': 'circle-question',
  'info-circle': 'circle-info',
  'check-circle': 'circle-check',
  'external-link-alt': 'arrow-up-right-from-square',
  'shopping-basket': 'basket-shopping',
  'shopping-bag': 'bag-shopping',
  'mobile-alt': 'mobile-screen-button',
  'file-alt': 'file-lines',
  'money-bill-alt': 'money-bill-1',
};

const FA6 = FontAwesome6 as any;

function resolveGlyph(name: string): string {
  let glyph = name.startsWith('fa-') ? name.slice(3) : name;
  glyph = ALIASES[glyph] ?? glyph;
  const known =
    typeof FA6.hasIcon !== 'function' ||
    FA6.hasIcon(glyph, 'solid') ||
    FA6.hasIcon(glyph, 'regular') ||
    FA6.hasIcon(glyph, 'brand');
  return known ? glyph : 'circle-question';
}

export type RyIconProps = {
  /** Design icon name in the 'fa-*' form (bare FA6 names also accepted). */
  name: string;
  size?: number;
  color?: string;
  /** Render the FA "regular" (outline) style instead of solid. */
  regular?: boolean;
  style?: StyleProp<TextStyle>;
};

export function RyIcon({ name, size = 15, color, regular = false, style }: RyIconProps) {
  const glyph = resolveGlyph(name);
  return (
    <FA6
      name={glyph}
      size={size}
      color={color}
      solid={!regular}
      regular={regular}
      style={style}
    />
  );
}
