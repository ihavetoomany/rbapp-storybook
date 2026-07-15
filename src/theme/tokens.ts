/**
 * Resurs UI 2.0 design tokens — ported 1:1 from the design prototype's
 * `ds/colors_and_type.css` (light = `:root`, dark = `[data-theme="dark"]`).
 *
 * Do NOT invent values here; every hex/number traces back to that file.
 */

import type { ViewStyle } from 'react-native';

/* ============================================================
 * BRAND scales (mode-independent raw palette)
 * ============================================================ */
export const rsColors = {
  /* Resurs Green scale (primary) */
  green50: '#E3ECEB',
  green100: '#C7DAD7',
  green200: '#ACC8C4',
  green300: '#90B6B1',
  green400: '#75A49E',
  green500: '#59928C',
  green600: '#3B817A',
  green700: '#117069', // BASE
  green800: '#0C5D57',
  green900: '#084A45',
  green950: '#053834',

  /* Resurs Mint (accent) */
  mint50: '#EAF4F0',
  mint100: '#D5E9E2',
  mint200: '#C0DED4',
  mint300: '#ABD3C6', // BASE
  mint400: '#93B6AF',
  mint500: '#7E9C96',
  mint600: '#69827D',
  mint700: '#546864',
  mint800: '#3F4E4B',
  mint900: '#2A3432',
  mint950: '#151A19',

  /* Resurs Sand (warm neutral) */
  sand50: '#FBF8F5',
  sand100: '#F7F0EB', // BASE
  sand200: '#E1D8D8',
  sand300: '#C8C0C0',
  sand400: '#AFA8A8',
  sand500: '#969090',
  sand600: '#7D7878',
  sand700: '#646060',
  sand800: '#4B4848',
  sand900: '#323030',
  sand950: '#191818',

  /* Resurs Night (cool neutral / grayscale) */
  night50: '#E9E9E8',
  night100: '#D4D4D3',
  night200: '#BFBFBE',
  night300: '#AAAAA9',
  night400: '#959594',
  night500: '#80807F',
  night600: '#6B6B6A',
  night700: '#565655',
  night800: '#414140',
  night900: '#2C2C2B', // BASE — body/brand black
  night950: '#161616',

  /* Accent-only */
  yellow: '#FFEC89',
  greige: '#E7DCD6',
  dusk: '#393838',
} as const;

/* ============================================================
 * Semantic colors — light & dark themes
 * ============================================================ */
export type SemanticColors = {
  bgDefault: string;
  bgPaper: string;
  bgSubtle: string;
  primaryBackground: string;
  iconMuted: string;

  primaryLight: string;
  primaryMain: string;
  primaryDark: string;
  primaryContrast: string;
  primaryDisabled: string;

  secondaryLight: string;
  secondaryMain: string;
  secondaryDark: string;
  secondaryBackground: string;
  secondaryContrast: string;
  secondaryDisabled: string;

  successLight: string;
  successMain: string;
  successDark: string;
  successBackground: string;
  successContrast: string;

  infoLight: string;
  infoMain: string;
  infoDark: string;
  infoBackground: string;
  infoContrast: string;

  warningLight: string;
  warningMain: string;
  warningDark: string;
  warningBackground: string;
  warningContrast: string;

  errorLight: string;
  errorMain: string;
  errorDark: string;
  errorBackground: string;
  errorContrast: string;

  grey50: string;
  grey100: string;
  grey200: string;
  grey300: string;
  grey400: string;
  grey500: string;
  grey600: string;
  grey700: string;
  grey800: string;
  grey900: string;
  grey950: string;

  cashbackBg: string;

  fgPrimary: string;
  fgSecondary: string;
  fgDisabled: string;

  borderSubtle: string;
  barTrack: string;
  borderDefault: string;
  borderStrong: string;
  borderHover: string;
  borderActive: string;
  borderDisabled: string;

  chipGreenBg: string;
  chipGreenText: string;
  chipBlueBg: string;
  chipBlueText: string;

  bandHighlight: string;
};

/* -------- Light theme (`:root`) -------- */
export const lightColors: SemanticColors = {
  bgDefault: '#F5F5F5',
  bgPaper: '#FFFFFF',
  bgSubtle: '#F1F3F5',
  primaryBackground: '#E3ECEB',
  iconMuted: '#A1A1A1',

  primaryLight: '#3B817A',
  primaryMain: '#117069',
  primaryDark: '#0C5D57',
  primaryContrast: '#FFFFFF',
  primaryDisabled: '#737373',

  secondaryLight: '#414140',
  secondaryMain: '#2C2C2B',
  secondaryDark: '#161616',
  secondaryBackground: '#E9E9E8',
  secondaryContrast: '#FFFFFF',
  secondaryDisabled: '#737373',

  successLight: '#248060',
  successMain: '#1D664D',
  successDark: '#17513E',
  successBackground: '#B0E2C7',
  successContrast: '#FFFFFF',

  infoLight: '#0084D1',
  infoMain: '#0069A8',
  infoDark: '#00598A',
  infoBackground: '#B8E6FE',
  infoContrast: '#FFFFFF',

  warningLight: '#E17100',
  warningMain: '#BB4D00',
  warningDark: '#973C00',
  warningBackground: '#FEE685',
  warningContrast: '#FFFFFF',

  errorLight: '#E7000B',
  errorMain: '#C10007',
  errorDark: '#9F0712',
  errorBackground: '#FFE2E2',
  errorContrast: '#FFFFFF',

  grey50: '#FAFAFA',
  grey100: '#F5F5F5',
  grey200: '#E5E5E5',
  grey300: '#D4D4D4',
  grey400: '#A1A1A1',
  grey500: '#737373',
  grey600: '#525252',
  grey700: '#404040',
  grey800: '#262626',
  grey900: '#171717',
  grey950: '#0A0A0A',

  cashbackBg: '#FEE685',

  fgPrimary: '#0A0A0A',
  fgSecondary: '#525252',
  fgDisabled: '#737373',

  borderSubtle: 'rgba(212, 212, 212, 0.6)',
  barTrack: '#909090',
  borderDefault: '#A1A1A1',
  borderStrong: '#A1A1A1',
  borderHover: '#737373',
  borderActive: '#525252',
  borderDisabled: '#D4D4D4',

  /* Chip & badge — fixed, same in both themes */
  chipGreenBg: '#E3ECEB',
  chipGreenText: '#0C5D57',
  chipBlueBg: '#B8E6FE',
  chipBlueText: '#00598A',

  bandHighlight: '#E3ECEB',
};

/* -------- Dark theme (`[data-theme="dark"]` overrides on top of light) -------- */
export const darkColors: SemanticColors = {
  ...lightColors,

  bgDefault: '#2C2C2B',
  bgPaper: '#393838',
  bgSubtle: '#343A40',

  bandHighlight: '#3F4D46',

  primaryLight: '#C0DED4',
  primaryMain: '#ABD3C6',
  primaryDark: '#93B6AF',
  primaryContrast: '#000000',
  primaryBackground: '#151A19',
  primaryDisabled: '#A1A1A1',

  secondaryLight: '#FBF8F5',
  secondaryMain: '#F7F0EB',
  secondaryDark: '#E1D8D8',
  secondaryBackground: '#AFA8A8',
  secondaryDisabled: '#A1A1A1',
  secondaryContrast: '#000000',

  successMain: '#80D0AA',
  infoMain: '#74D4FF',
  warningMain: '#FFD230',
  errorMain: '#FFA2A2',

  errorLight: '#FFC9C9',
  errorDark: '#FF6467',
  successLight: '#B0E2C7',
  successDark: '#50BB8B',
  infoLight: '#B8E6FE',
  infoDark: '#00BCFF',
  warningLight: '#FEE685',
  warningDark: '#FFB900',

  successBackground: '#082720',
  successContrast: '#000000',
  infoBackground: '#052F4A',
  infoContrast: '#000000',
  warningBackground: '#461901',
  warningContrast: '#000000',
  errorBackground: '#460809',
  errorContrast: '#000000',

  fgPrimary: '#FFFFFF',
  fgSecondary: '#D4D4D4',
  fgDisabled: '#A1A1A1',

  borderSubtle: 'rgba(115, 115, 115, 0.3)',
  borderDefault: '#D4D4D4',
  borderStrong: 'rgba(255,255,255,0.24)',
  borderHover: '#A1A1A1',
  borderActive: '#E5E5E5',
  borderDisabled: '#404040',

  /* Grey scale — explicitly INVERTED in dark mode */
  grey50: '#0A0A0A',
  grey100: '#171717',
  grey200: '#262626',
  grey300: '#404040',
  grey400: '#525252',
  grey500: '#737373',
  grey600: '#A1A1A1',
  grey700: '#D4D4D4',
  grey800: '#E5E5E5',
  grey900: '#F5F5F5',
  grey950: '#FAFAFA',

  cashbackBg: '#FFB900',
};

/* ============================================================
 * RADII — from --radius-*
 * ============================================================ */
export const radii = {
  xs: 4,
  sm: 8,
  md: 10,
  lg: 16,
  xl: 20,
  xxl: 40, // --radius-2xl
  pill: 999,
} as const;

/* ============================================================
 * SPACING — from --space-* (MUI base unit 8px)
 * ============================================================ */
export const spacing = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s8: 32,
  s10: 40,
  s12: 48,
  s16: 64,
  s20: 80,
  s30: 120,
} as const;

/* ============================================================
 * TYPE SCALE — from --text-*-size/lh/weight
 * ============================================================ */
export type TypeStyle = {
  size: number;
  lineHeight: number;
  weight: '400' | '500' | '700' | '900';
};

export const typeScale: Record<
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'button'
  | 'caption'
  | 'overline',
  TypeStyle
> = {
  h1: { size: 36, lineHeight: 48, weight: '700' },
  h2: { size: 32, lineHeight: 40, weight: '700' },
  h3: { size: 28, lineHeight: 40, weight: '700' },
  h4: { size: 24, lineHeight: 32, weight: '700' },
  h5: { size: 22, lineHeight: 32, weight: '400' },
  h6: { size: 20, lineHeight: 24, weight: '700' },
  subtitle1: { size: 16, lineHeight: 24, weight: '700' },
  subtitle2: { size: 14, lineHeight: 24, weight: '700' },
  body1: { size: 16, lineHeight: 24, weight: '400' },
  body2: { size: 14, lineHeight: 24, weight: '400' },
  button: { size: 14, lineHeight: 16, weight: '700' },
  caption: { size: 12, lineHeight: 16, weight: '400' },
  overline: { size: 11, lineHeight: 16, weight: '400' },
};

/* ============================================================
 * SHADOWS — from --shadow-* (RN-compatible style objects).
 * CSS `Xpx Ypx BLURpx rgba(...)` mapped to iOS shadow* props
 * (shadowRadius ≈ CSS blur / 2) + Android elevation.
 * ============================================================ */
type RyShadow = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

/* --shadow-card: 0px 2px 16px rgba(52, 58, 64, 0.10) */
export const shadowCard: RyShadow = {
  shadowColor: '#343A40',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 3,
};

/* --shadow-modal: 0px 2px 16px rgba(52, 58, 64, 0.10) — same flat ramp */
export const shadowModal: RyShadow = { ...shadowCard };

/* --shadow-drawer: -8px 0px 24px rgba(52, 58, 64, 0.10) */
export const shadowDrawer: RyShadow = {
  shadowColor: '#343A40',
  shadowOffset: { width: -8, height: 0 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 8,
};

/* --shadow-soft: 0px 4px 20px rgba(0, 0, 0, 0.04) */
export const shadowSoft: RyShadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.04,
  shadowRadius: 10,
  elevation: 2,
};

/* --shadow-none */
export const shadowNone: RyShadow = {
  shadowColor: 'transparent',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0,
  shadowRadius: 0,
  elevation: 0,
};

export const shadows = {
  none: shadowNone,
  card: shadowCard,
  modal: shadowModal,
  drawer: shadowDrawer,
  soft: shadowSoft,
} as const;
