import { Platform, type ViewStyle } from 'react-native';
import type { MD3Theme } from 'react-native-paper';

export type NeumorphIntensity = 'card' | 'button' | 'icon';

const NEUMORPH_INTENSITY = {
  card: { distance: 5, blur: 10, darkOpacity: 0.13 },
  button: { distance: 4, blur: 8, darkOpacity: 0.12 },
  icon: { distance: 3, blur: 6, darkOpacity: 0.09 },
} as const;

export function getNeumorphSurfaceColor(theme: MD3Theme) {
  return theme.colors.background;
}

export function createNeumorphRaisedStyle(
  surfaceColor: string,
  radius: number,
  intensity: NeumorphIntensity = 'card',
): ViewStyle {
  const { distance, blur, darkOpacity } = NEUMORPH_INTENSITY[intensity];

  if (Platform.OS === 'web') {
    return {
      backgroundColor: surfaceColor,
      borderRadius: radius,
      boxShadow: `${distance}px ${distance}px ${blur}px rgba(0, 0, 0, ${darkOpacity}), -${distance}px -${distance}px ${blur}px rgba(255, 255, 255, 0.9)`,
    };
  }

  return {
    backgroundColor: surfaceColor,
    borderRadius: radius,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.9)',
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomColor: `rgba(0, 0, 0, ${darkOpacity * 0.45})`,
    borderRightColor: `rgba(0, 0, 0, ${darkOpacity * 0.45})`,
    shadowColor: '#000000',
    shadowOffset: { width: distance * 0.65, height: distance * 0.65 },
    shadowOpacity: darkOpacity,
    shadowRadius: blur / 2,
    elevation: 0,
  };
}

export function createNeumorphInsetStyle(surfaceColor: string, radius: number): ViewStyle {
  if (Platform.OS === 'web') {
    return {
      backgroundColor: surfaceColor,
      borderRadius: radius,
      boxShadow:
        'inset 3px 3px 6px rgba(0, 0, 0, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.85)',
    };
  }

  return {
    backgroundColor: surfaceColor,
    borderRadius: radius,
    borderWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    borderLeftColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomColor: 'rgba(255, 255, 255, 0.85)',
    borderRightColor: 'rgba(255, 255, 255, 0.85)',
  };
}

export const NEUMORPH_CARD_RADIUS = 16;

export function getNeumorphButtonRadius(theme: MD3Theme) {
  return theme.roundness * 2.5;
}
