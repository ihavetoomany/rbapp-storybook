import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Card, useTheme } from 'react-native-paper';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import {
  NEUMORPH_CARD_RADIUS,
  createNeumorphInsetStyle,
  createNeumorphRaisedStyle,
  getNeumorphSurfaceColor,
} from '@/src/theme/neumorphic';

import { ResursText } from '../typography/ResursText';

export type ResursCardAppearance = 'elevated' | 'neumorphic';

type ResursCardProps = {
  title?: string;
  subtitle?: string;
  description?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  appearance?: ResursCardAppearance;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function RoundedSquareIcon({
  icon,
  size,
  appearance,
  surfaceColor,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  size: number;
  appearance: ResursCardAppearance;
  surfaceColor?: string;
}) {
  const theme = useTheme();
  const radius = size * 0.25;
  const isNeumorphic = appearance === 'neumorphic';

  return (
    <View
      style={[
        styles.iconContainer,
        isNeumorphic
          ? createNeumorphInsetStyle(surfaceColor ?? theme.colors.background, radius)
          : { backgroundColor: theme.colors.primaryContainer, borderRadius: radius },
        { width: size, height: size },
      ]}
    >
      <MaterialCommunityIcons name={icon} size={size * 0.55} color={theme.colors.primary} />
    </View>
  );
}

export function ResursCard({
  title,
  subtitle,
  description,
  icon = 'credit-card-outline',
  appearance = 'neumorphic',
  children,
  style,
}: ResursCardProps) {
  const theme = useTheme();
  const isNeumorphic = appearance === 'neumorphic';
  const surfaceColor = isNeumorphic ? getNeumorphSurfaceColor(theme) : undefined;

  return (
    <Card
      mode="contained"
      elevation={0 as never}
      style={[
        !isNeumorphic && [
          styles.elevated,
          { backgroundColor: theme.colors.surface },
        ],
        isNeumorphic &&
          createNeumorphRaisedStyle(surfaceColor!, NEUMORPH_CARD_RADIUS, 'card'),
        style,
      ]}
    >
      {(title || subtitle) && (
        <Card.Title
          title={title}
          subtitle={subtitle}
          titleVariant="headlineSmall"
          left={(props) => (
            <RoundedSquareIcon
              icon={icon}
              size={props.size}
              appearance={appearance}
              surfaceColor={surfaceColor}
            />
          )}
        />
      )}
      <Card.Content style={title || subtitle ? styles.contentBelowTitle : undefined}>
        {description ? <ResursText variant="body2">{description}</ResursText> : null}
        {children}
      </Card.Content>
    </Card>
  );
}

const elevatedShadow = Platform.select<ViewStyle>({
  web: {
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
  },
  default: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});

const styles = StyleSheet.create({
  elevated: {
    borderWidth: 0,
    borderColor: 'transparent',
    ...elevatedShadow,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentBelowTitle: {
    paddingTop: 32,
  },
});
