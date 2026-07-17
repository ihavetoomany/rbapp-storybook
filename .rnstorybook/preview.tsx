import type { Preview } from '@storybook/react-native';

import { ResursThemeProvider } from '@/src/theme';
import { StoryCanvas } from '@/src/storybook/StoryCanvas';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ResursThemeProvider>
        <StoryCanvas>
          <Story />
        </StoryCanvas>
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
