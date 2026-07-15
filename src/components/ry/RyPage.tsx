// RyPage — `.ry-page` content container: padding 8px 16px 24px.
// A plain View (screens own their scrolling).

import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

export type RyPageProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function RyPage({ children, style }: RyPageProps) {
  return <View style={[styles.page, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
