import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerRootComponent } from 'expo';

import { ResursThemeProvider } from '@/src/theme';

import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  shouldPersistSelection: true,
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

function StorybookRoot() {
  return (
    <ResursThemeProvider>
      <StorybookUIRoot />
    </ResursThemeProvider>
  );
}

registerRootComponent(StorybookRoot);
