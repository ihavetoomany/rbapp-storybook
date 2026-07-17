import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { requireOptionalNativeModule } from 'expo-modules-core';
import { type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ResursText } from '../typography/ResursText';

import { useContentBottomInset } from './useContentBottomInset';

type ScreenLayoutProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  headerRight?: ReactNode;
  showBackButton?: boolean;
  contentContainerStyle?: ViewStyle;
};

const NAV_BAR_HEIGHT = 44;
const COLLAPSE_DISTANCE = 56;
const hasExpoBlur = !!requireOptionalNativeModule('ExpoBlur');

export function ScreenLayout({
  title,
  subtitle,
  children,
  headerRight,
  showBackButton = false,
  contentContainerStyle,
}: ScreenLayoutProps) {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomInset = useContentBottomInset();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const largeTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, COLLAPSE_DISTANCE * 0.6], [1, 0], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, COLLAPSE_DISTANCE],
          [0, -12],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const compactTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [COLLAPSE_DISTANCE * 0.35, COLLAPSE_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const headerBackgroundStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [COLLAPSE_DISTANCE * 0.2, COLLAPSE_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  if (!title) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
        edges={['top', 'left', 'right']}>
        <Animated.ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: bottomInset },
            contentContainerStyle,
          ]}
          keyboardShouldPersistTaps="handled">
          {children}
        </Animated.ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + NAV_BAR_HEIGHT + 8,
            paddingBottom: bottomInset,
          },
          contentContainerStyle,
        ]}
        keyboardShouldPersistTaps="handled">
        <View style={styles.largeTitleSection}>
          <Animated.View style={largeTitleStyle} accessibilityRole="header">
            <ResursText variant="h3">{title}</ResursText>
          </Animated.View>
          {subtitle ? (
            <ResursText variant="body2" style={{ color: theme.colors.onSurfaceVariant }}>
              {subtitle}
            </ResursText>
          ) : null}
        </View>
        {children}
      </Animated.ScrollView>

      <View style={styles.headerOverlay} pointerEvents="box-none">
        <View style={{ paddingTop: insets.top }}>
          <View style={[styles.navBar, { height: NAV_BAR_HEIGHT }]}>
            <Animated.View
              style={[StyleSheet.absoluteFill, headerBackgroundStyle]}
              pointerEvents="none">
              {Platform.OS === 'ios' && hasExpoBlur ? (
                <BlurView
                  intensity={80}
                  tint="systemChromeMaterialLight"
                  style={StyleSheet.absoluteFill}
                />
              ) : (
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: theme.colors.background },
                  ]}
                />
              )}
            </Animated.View>

            <View style={styles.navBarContent}>
              {showBackButton ? (
                <View style={styles.navBarSideStart}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Back"
                    hitSlop={8}
                    onPress={() => router.back()}
                    style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}>
                    <MaterialCommunityIcons
                      name="chevron-left"
                      size={28}
                      color={theme.colors.primary}
                    />
                  </Pressable>
                </View>
              ) : null}
              <Animated.View
                style={[
                  styles.compactTitle,
                  showBackButton && styles.compactTitleWithBack,
                  compactTitleStyle,
                ]}
                accessibilityRole="header"
                accessibilityLabel={title}>
                <ResursText variant="h4" numberOfLines={1}>
                  {title}
                </ResursText>
              </Animated.View>
              <View style={styles.navBarSideEnd}>{headerRight}</View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFill,
  },
  navBar: {
    justifyContent: 'center',
  },
  navBarContent: {
    height: NAV_BAR_HEIGHT,
    justifyContent: 'center',
  },
  navBarSideStart: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 8,
    zIndex: 1,
  },
  navBarSideEnd: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    opacity: 0.6,
  },
  compactTitle: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 72,
  },
  compactTitleWithBack: {
    paddingLeft: 52,
  },
  largeTitleSection: {
    gap: 4,
    marginBottom: 16,
  },
  content: {
    padding: 16,
    gap: 16,
  },
});
