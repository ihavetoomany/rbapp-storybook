import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFonts } from 'expo-font';
import { Fragment, type ReactNode } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { resursDarkTheme, resursLightTheme } from './paperTheme';

type ResursThemeProviderProps = {
  children: ReactNode;
  forceTheme?: 'light' | 'dark';
};

export function ResursThemeProvider({ children, forceTheme }: ResursThemeProviderProps) {
  const colorScheme = useColorScheme();
  const themeName = forceTheme ?? (colorScheme === 'dark' ? 'dark' : 'light');
  const theme = themeName === 'dark' ? resursDarkTheme : resursLightTheme;

  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
    'Inter-ExtraBold': require('../../assets/fonts/Inter-ExtraBold.ttf'),
    ...MaterialCommunityIcons.font,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        {Platform.OS === 'web' ? (
          <Fragment>
            <style>{`
              @font-face {
                font-family: 'MaterialCommunityIcons';
                src: url(${MaterialCommunityIcons.font['material-community']}) format('truetype');
              }
            `}</style>
            {children}
          </Fragment>
        ) : (
          children
        )}
      </PaperProvider>
    </SafeAreaProvider>
  );
}
