import { Fragment, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { resursDarkTheme, resursLightTheme } from '../src/theme/paperTheme';

import interBold from '../assets/fonts/Inter-Bold.ttf?url';
import interRegular from '../assets/fonts/Inter-Regular.ttf?url';

type BrowserThemeProviderProps = {
  children: ReactNode;
};

/**
 * Web-only theme provider for browser Storybook (Vite).
 * Avoids expo-font / expo-modules-core which break Vite dependency optimization.
 */
export function BrowserThemeProvider({ children }: BrowserThemeProviderProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? resursDarkTheme : resursLightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <Fragment>
          <style>{`
            html, body, #storybook-root, #root {
              background-color: ${theme.colors.background};
              min-height: 100%;
            }
            @font-face {
              font-family: 'Inter-Regular';
              src: url('${interRegular}') format('truetype');
              font-weight: 400;
              font-style: normal;
            }
            @font-face {
              font-family: 'Inter-Bold';
              src: url('${interBold}') format('truetype');
              font-weight: 700;
              font-style: normal;
            }
          `}</style>
          {children}
        </Fragment>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
