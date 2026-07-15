/**
 * useRyTheme — resolves the active semantic color set from the Tweaks
 * context (`darkTheme` tweak), NOT the OS color scheme.
 */

import { useTweaks } from '@/src/tweaks/TweaksProvider';
import { darkColors, lightColors, type SemanticColors } from './tokens';

export function useRyTheme(): { colors: SemanticColors; dark: boolean } {
  const { tweaks } = useTweaks();
  const dark = tweaks.darkTheme;
  return { colors: dark ? darkColors : lightColors, dark };
}
