// BaseDialog — port of the design's BaseDialog (`.ry-dialog-*`): a bottom
// sheet on a dimmed scrim. RN Modal + Reanimated slide-up/-down (280–300ms,
// matching the CSS keyframes), rounded 28px top corners, grabber, optional
// centered title, close button, body scrolls when it overflows. Height hugs
// content and caps at screen − 72px, like `max-height: calc(100% − 72px)`.
//
// `size` (small/medium/large) is part of the design API but only affects
// the desktop popup in the prototype — it is accepted and ignored here.

import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRyTheme } from '@/src/theme/useRyTheme';

import { RyIcon } from './RyIcon';
import { ryFont } from './typography';

export type BaseDialogSize = 'small' | 'medium' | 'large';

export type BaseDialogProps = {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  /** Centered dialog title (`.ry-dialog-head`). */
  title?: string;
  /** Design API compat — only affects the desktop popup in the prototype. */
  size?: BaseDialogSize;
  /** Extra style on the sheet container. */
  sheetStyle?: StyleProp<ViewStyle>;
  /** Extra style on the scrollable body's content container. */
  bodyStyle?: StyleProp<ViewStyle>;
};

export function BaseDialog({
  open,
  onClose,
  children,
  title,
  size = 'medium',
  sheetStyle,
  bodyStyle,
}: BaseDialogProps) {
  void size;
  const { colors, dark } = useRyTheme();
  const insets = useSafeAreaInsets();
  const { height: winH } = useWindowDimensions();

  const [mounted, setMounted] = useState(open);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (open) {
      setMounted(true);
      progress.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
    } else {
      progress.value = withTiming(
        0,
        { duration: 280, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(setMounted)(false);
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheetAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * winH }],
  }));

  if (!mounted) return null;

  return (
    <Modal transparent visible statusBarTranslucent onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.bgDefault,
              maxHeight: winH - 72 - insets.top,
            },
            sheetAnimStyle,
            sheetStyle,
          ]}
          accessibilityViewIsModal>
          <Pressable
            onPress={onClose}
            accessibilityLabel="Close"
            style={({ pressed }) => [
              styles.close,
              { backgroundColor: pressed ? colors.grey300 : colors.grey200 },
            ]}>
            <RyIcon name="fa-xmark" size={15} color={colors.iconMuted} />
          </Pressable>
          <View style={[styles.grabber, { backgroundColor: colors.grey300 }]} />
          {title ? (
            <View style={styles.head}>
              <Text style={[ryFont('700'), styles.headTitle, { color: colors.fgPrimary }]}>
                {title}
              </Text>
            </View>
          ) : null}
          <ScrollView
            style={styles.body}
            contentContainerStyle={[
              styles.bodyContent,
              { paddingBottom: Math.max(insets.bottom, 14) + 24 },
              bodyStyle,
            ]}
            showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    // 0 -8px 40px rgba(20,30,28,0.18)
    shadowColor: '#141E1C',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 16,
  },
  grabber: {
    width: 40,
    height: 5,
    borderRadius: 999,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  head: {
    minHeight: 36,
    paddingTop: 6,
    paddingBottom: 12,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headTitle: {
    fontSize: 18,
    lineHeight: 18 * 1.3,
    textAlign: 'center',
  },
  close: {
    position: 'absolute',
    top: 14,
    right: 16,
    zIndex: 2,
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flexGrow: 0,
  },
  bodyContent: {
    paddingHorizontal: 16,
  },
});
