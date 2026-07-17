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
  numberOfLines?: number;
  accessibilityElementsHidden?: boolean;
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
};

export function ResursText({ variant = 'body1', children, style, numberOfLines, ...rest }: ResursTextProps) {
  return (
    <Text variant={variantMap[variant]} style={style} numberOfLines={numberOfLines} {...rest}>
      {children}
    </Text>
  );
}
