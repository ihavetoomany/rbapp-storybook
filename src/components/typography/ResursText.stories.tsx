import type { Meta, StoryObj } from '@storybook/react-native';

import { ResursText } from './ResursText';

const meta = {
  title: 'Typography/ResursText',
  component: ResursText,
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
  render: (args) => <ResursText {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Toggle system dark mode in the browser or simulator to preview dark theme tokens.',
      },
    },
  },
};
