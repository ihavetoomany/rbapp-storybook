import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

type StoryCanvasProps = {
  children: ReactNode;
};

/** Matches ScreenLayout: app background + 16px content padding. */
export function StoryCanvas({ children }: StoryCanvasProps) {
  const theme = useTheme();

  return (
    <View style={[styles.canvas, { backgroundColor: theme.colors.background }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    padding: 16,
    minHeight: '100%',
  },
});
