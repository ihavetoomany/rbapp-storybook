import { Card } from 'react-native-paper';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { ResursText } from '../typography/ResursText';

type ResursCardProps = {
  title?: string;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function ResursCard({
  title,
  subtitle,
  description,
  children,
  style,
}: ResursCardProps) {
  return (
    <Card mode="elevated" style={style}>
      {(title || subtitle) && (
        <Card.Title title={title} subtitle={subtitle} titleVariant="titleLarge" />
      )}
      <Card.Content>
        {description ? <ResursText variant="body2">{description}</ResursText> : null}
        {children}
      </Card.Content>
    </Card>
  );
}
