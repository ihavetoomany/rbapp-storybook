import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { ResursThemeProvider } from '@/src/theme';
import { ResursText } from './ResursText';

const meta = {
  title: 'Typography/ResursText',
  component: ResursText,
  decorators: [
    (Story) => (
      <ResursThemeProvider>
        <View style={{ padding: 16, gap: 8 }}>
          <Story />
        </View>
      </ResursThemeProvider>
    ),
  ],
} satisfies Meta<typeof ResursText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: { children: '' },
  render: () => (
    <>
      <ResursText variant="h1">Heading 1</ResursText>
      <ResursText variant="h2">Heading 2</ResursText>
      <ResursText variant="h3">Heading 3</ResursText>
      <ResursText variant="h4">Heading 4</ResursText>
      <ResursText variant="body1">Body text — primary content</ResursText>
      <ResursText variant="body2">Body text — secondary content</ResursText>
      <ResursText variant="caption">Caption text</ResursText>
      <ResursText variant="button">Button label</ResursText>
    </>
  ),
};

export const DarkTheme: Story = {
  args: { children: 'Dark mode heading', variant: 'h3' },
  decorators: [
    (Story) => (
      <ResursThemeProvider forceTheme="dark">
        <View style={{ padding: 16 }}>
          <Story />
        </View>
      </ResursThemeProvider>
    ),
  ],
  render: (args) => <ResursText {...args} />,
};
