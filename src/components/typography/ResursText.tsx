import { Text } from 'react-native-paper';
import type { StyleProp, TextStyle } from 'react-native';

export type ResursTextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'button';

const variantMap = {
  h1: 'displayLarge',
  h2: 'displayMedium',
  h3: 'displaySmall',
  h4: 'headlineLarge',
  body1: 'bodyLarge',
  body2: 'bodyMedium',
  caption: 'bodySmall',
  button: 'labelLarge',
} as const;

type ResursTextProps = {
  variant?: ResursTextVariant;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

export function ResursText({ variant = 'body1', children, style }: ResursTextProps) {
  return (
    <Text variant={variantMap[variant]} style={style}>
      {children}
    </Text>
  );
}
