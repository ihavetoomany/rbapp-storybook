import type { Preview } from '@storybook/react-native-web-vite';

import { BrowserThemeProvider } from './BrowserThemeProvider';
import { StoryCanvas } from '../src/storybook/StoryCanvas';

const preview: Preview = {
  decorators: [
    (Story) => (
      <BrowserThemeProvider>
        <StoryCanvas>
          <Story />
        </StoryCanvas>
      </BrowserThemeProvider>
    ),
  ],
  parameters: {
    a11y: {
      // Default: show violations in the Accessibility panel; use per-story `test: 'error'` for CI
      test: 'todo',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
