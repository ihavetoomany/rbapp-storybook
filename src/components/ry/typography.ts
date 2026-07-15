// Internal font helper for the ry component library.
//
// The app bundles Inter-Regular (400) and Inter-Bold (700) only (see
// src/theme/ThemeProvider.tsx). The design's intermediate weights (500/600)
// map to the nearest bundled face and keep the numeric weight so platforms
// that can synthesize weights render closer to the CSS.

import type { TextStyle } from 'react-native';

export type RyFontWeight = '400' | '500' | '600' | '700' | '800';

export function ryFont(weight: RyFontWeight): TextStyle {
  return {
    fontFamily: Number(weight) >= 600 ? 'Inter-Bold' : 'Inter-Regular',
    fontWeight: weight,
  };
}
