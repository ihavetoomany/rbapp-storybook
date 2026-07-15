// Root layout — mounts the prototype providers (tweaks / read-state /
// notifications / pay-sheet), wires the navigation + status bar to the
// dark-theme tweak, and gates the app behind the Skymning login
// (PHASE_C_CONTRACTS §Cross-feature providers).

import { DarkTheme, DefaultTheme, Redirect, Stack, ThemeProvider, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { ReadStateProvider } from '@/src/features/inbox/ReadStateProvider';
import { NotificationsProvider } from '@/src/features/notifications/NotificationsProvider';
import { PaySheetProvider } from '@/src/features/payment/PaySheetProvider';
import { ResursThemeProvider } from '@/src/theme';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { TweaksProvider, useSession } from '@/src/tweaks/TweaksProvider';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TweaksProvider>
        <RootInner />
      </TweaksProvider>
    </GestureHandlerRootView>
  );
}

function RootInner() {
  const { colors, dark } = useRyTheme();
  const { loggedIn } = useSession();
  const pathname = usePathname();

  // Navigation theme follows the dark-theme tweak (not the OS scheme).
  const navigationTheme = useMemo(() => {
    const base = dark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primaryMain,
        background: colors.bgDefault,
        card: colors.bgPaper,
        text: colors.fgPrimary,
        border: colors.borderSubtle,
      },
    };
  }, [dark, colors]);

  return (
    <ThemeProvider value={navigationTheme}>
      {/* ResursThemeProvider keeps Paper-based legacy components + fonts
          + SafeAreaProvider alive; forced to the tweaks theme. */}
      <ResursThemeProvider forceTheme={dark ? 'dark' : 'light'}>
        <ReadStateProvider>
          <NotificationsProvider>
            <PaySheetProvider>
              <StatusBar style={dark ? 'light' : 'dark'} />
              {/* Skymning login gate. */}
              {!loggedIn && pathname !== '/login' ? <Redirect href="/login" /> : null}
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: 'slide_from_right',
                  contentStyle: { backgroundColor: colors.bgDefault },
                }}
              />
            </PaySheetProvider>
          </NotificationsProvider>
        </ReadStateProvider>
      </ResursThemeProvider>
    </ThemeProvider>
  );
}
