import type { Preview } from '@storybook/react-native';

import { ResursThemeProvider } from '@/src/theme';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ResursThemeProvider>
        <Story />
      </ResursThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
