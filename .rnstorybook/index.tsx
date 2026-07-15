import { registerRootComponent } from 'expo';

import { ResursThemeProvider } from '@/src/theme';

import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  shouldPersistSelection: false,
});

function StorybookRoot() {
  return (
    <ResursThemeProvider>
      <StorybookUIRoot />
    </ResursThemeProvider>
  );
}

registerRootComponent(StorybookRoot);
