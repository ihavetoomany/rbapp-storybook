import {
  configureFonts,
  MD3DarkTheme,
  MD3LightTheme,
  type MD3Theme,
} from 'react-native-paper';

import { paletteDark } from './paletteDark';
import { paletteLight } from './paletteLight';
import type { ResursPaletteColors } from './types';

const interRegular = 'Inter-Regular';
const interBold = 'Inter-Bold';

const fontConfig = {
  displayLarge: {
    fontFamily: interBold,
    fontSize: 36,
    fontWeight: '700' as const,
    lineHeight: 44,
    letterSpacing: 0,
  },
  displayMedium: {
    fontFamily: interBold,
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: 0,
  },
  displaySmall: {
    fontFamily: interBold,
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: 0,
  },
  headlineLarge: {
    fontFamily: interBold,
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontFamily: interRegular,
    fontSize: 22,
    fontWeight: '400' as const,
    lineHeight: 28,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontFamily: interBold,
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 28,
    letterSpacing: 0,
  },
  titleLarge: {
    fontFamily: interBold,
    fontSize: 16,
    fontWeight: '700' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  titleMedium: {
    fontFamily: interBold,
    fontSize: 14,
    fontWeight: '700' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
  titleSmall: {
    fontFamily: interBold,
    fontSize: 14,
    fontWeight: '700' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  bodyLarge: {
    fontFamily: interRegular,
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  bodyMedium: {
    fontFamily: interRegular,
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontFamily: interRegular,
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  labelLarge: {
    fontFamily: interBold,
    fontSize: 14,
    fontWeight: '700' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily: interBold,
    fontSize: 12,
    fontWeight: '700' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontFamily: interRegular,
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
};

function buildTheme(base: typeof MD3LightTheme, palette: ResursPaletteColors): MD3Theme {
  return {
    ...base,
    roundness: 8,
    fonts: configureFonts({ config: fontConfig }),
    colors: {
      ...base.colors,
      primary: palette.primary.main,
      onPrimary: palette.primary.contrastText,
      primaryContainer: palette.primary.background,
      onPrimaryContainer: palette.primary.dark,
      secondary: palette.secondary.main,
      onSecondary: palette.secondary.contrastText,
      secondaryContainer: palette.grey[200],
      onSecondaryContainer: palette.secondary.dark,
      tertiary: palette.info.main,
      onTertiary: palette.common.white,
      tertiaryContainer: palette.info.background,
      onTertiaryContainer: palette.info.dark,
      error: palette.error.main,
      onError: palette.common.white,
      errorContainer: palette.error.light,
      onErrorContainer: palette.error.dark,
      background: palette.background.default,
      onBackground: palette.text.primary,
      surface: palette.background.paper,
      onSurface: palette.text.primary,
      surfaceVariant: palette.grey[100],
      onSurfaceVariant: palette.text.secondary,
      outline: palette.divider.main,
      outlineVariant: palette.grey[300],
      inverseSurface: palette.secondary.dark,
      inverseOnSurface: palette.common.white,
      inversePrimary: palette.primary.light,
      elevation: {
        level0: 'transparent',
        level1: palette.background.paper,
        level2: palette.grey[50],
        level3: palette.grey[100],
        level4: palette.grey[200],
        level5: palette.grey[300],
      },
    },
  };
}

export const resursLightTheme = buildTheme(MD3LightTheme, paletteLight);
export const resursDarkTheme = buildTheme(MD3DarkTheme, paletteDark);

export const resursTabBarActiveTint = paletteLight.primary.main;
export const resursTabBarInactiveTint = paletteLight.grey[500];
