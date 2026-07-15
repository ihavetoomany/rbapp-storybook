import type { StorybookConfig } from '@storybook/react-native-web-vite';

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {
      pluginReactOptions: {
        babel: {
          plugins: ['react-native-reanimated/plugin'],
        },
      },
    },
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    const path = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    const storybookDir = path.dirname(fileURLToPath(import.meta.url));

    return mergeConfig(config, {
      resolve: {
        alias: {
          'expo-font': path.join(storybookDir, 'mocks/expo-font.ts'),
          'expo-modules-core': path.join(storybookDir, 'mocks/expo-modules-core.ts'),
        },
      },
      optimizeDeps: {
        exclude: ['expo-font', 'expo-modules-core', 'expo'],
      },
    });
  },
};

export default config;
