import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ResursText } from '../typography/ResursText';

type ScreenLayoutProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  headerRight?: ReactNode;
  contentContainerStyle?: ViewStyle;
};

export function ScreenLayout({
  title,
  subtitle,
  children,
  headerRight,
  contentContainerStyle,
}: ScreenLayoutProps) {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={['top', 'left', 'right']}>
      {(title || subtitle || headerRight) && (
        <Surface style={styles.header} elevation={0}>
          <View style={styles.headerText}>
            {title ? <ResursText variant="h3">{title}</ResursText> : null}
            {subtitle ? (
              <ResursText variant="body2" style={{ color: theme.colors.onSurfaceVariant }}>
                {subtitle}
              </ResursText>
            ) : null}
          </View>
          {headerRight}
        </Surface>
      )}
      <ScrollView
        contentContainerStyle={[styles.content, contentContainerStyle]}
        keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
});
