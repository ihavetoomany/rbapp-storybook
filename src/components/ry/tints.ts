// Theme-dependent brand tints — app.css hardcodes a handful of `--rs-*`
// tint overrides for dark mode (the `[data-theme="dark"]` block near the
// bottom of app.css) that are NOT part of the semantic token set:
//
//   --rs-sand-50:  #1E1C1A;   --rs-sand-100: #2A2623;
//   --rs-mint-100: #0D2B25;   --rs-mint-50:  #091A16;
//   --rs-green-50: #0D1F1C;   --rs-green-100:#122820;
//
// Components that used those CSS vars resolve them through this helper.

import { rsColors } from '@/src/theme/tokens';

export type RyTints = {
  green50: string;
  green100: string;
  mint50: string;
  mint100: string;
  sand50: string;
  sand100: string;
};

export function ryTints(dark: boolean): RyTints {
  return dark
    ? {
        green50: '#0D1F1C',
        green100: '#122820',
        mint50: '#091A16',
        mint100: '#0D2B25',
        sand50: '#1E1C1A',
        sand100: '#2A2623',
      }
    : {
        green50: rsColors.green50,
        green100: rsColors.green100,
        mint50: rsColors.mint50,
        mint100: rsColors.mint100,
        sand50: rsColors.sand50,
        sand100: rsColors.sand100,
      };
}
