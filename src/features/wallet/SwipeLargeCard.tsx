// SwipeLargeCard — wraps ProductLargeCard with the design's swipe-left-to-
// hide gesture (components.jsx SwipeLargeCard + `.ry-plc-swipe-*` CSS):
// an 88px action column (Hide = #4d5d6b / Unhide = primary) revealed by a
// horizontal drag; vertical movement hands control back to the scroll view.
// Implemented with core PanResponder + Animated (self-contained — no
// gesture-handler root required).

import React, { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { RyIcon } from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import type { Product } from '@/src/data';
import { useT } from '@/src/i18n';
import { radii } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { ProductLargeCard } from './ProductLargeCard';

const ACTION_W = 88;

export type SwipeLargeCardProps = {
  product: Product;
  ongoing?: boolean;
  onPress?: () => void;
  isHidden?: boolean;
  onHide?: () => void;
  onUnhide?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function SwipeLargeCard({
  product,
  ongoing,
  onPress,
  isHidden = false,
  onHide,
  onUnhide,
  style,
}: SwipeLargeCardProps) {
  const { colors } = useRyTheme();
  const { t } = useT();

  const tx = useRef(new Animated.Value(0)).current;
  const txValue = useRef(0);
  const revealed = useRef(false);
  const didDrag = useRef(false);
  const [, forceRender] = useState(0);

  const snapTo = (val: number) => {
    txValue.current = val;
    revealed.current = val < 0;
    Animated.timing(tx, { toValue: val, duration: 260, useNativeDriver: true }).start();
    forceRender((n) => n + 1);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      // Claim the gesture only once the drag is clearly horizontal — the
      // scroll view keeps priority on vertical movement (design behaviour).
      onMoveShouldSetPanResponder: (_e, g) =>
        Math.abs(g.dx) > 6 && Math.abs(g.dx) > Math.abs(g.dy) + 2,
      onPanResponderGrant: () => {
        didDrag.current = true;
      },
      onPanResponderMove: (_e, g) => {
        const base = revealed.current ? -ACTION_W : 0;
        const next = Math.max(-ACTION_W, Math.min(0, base + g.dx));
        txValue.current = next;
        tx.setValue(next);
      },
      onPanResponderRelease: () => {
        if (revealed.current) {
          snapTo(txValue.current > -(ACTION_W * 0.6) ? 0 : -ACTION_W);
        } else {
          snapTo(txValue.current < -(ACTION_W * 0.4) ? -ACTION_W : 0);
        }
        // Let the press handler know this interaction was a drag.
        setTimeout(() => {
          didDrag.current = false;
        }, 0);
      },
      onPanResponderTerminate: () => {
        snapTo(revealed.current ? -ACTION_W : 0);
        setTimeout(() => {
          didDrag.current = false;
        }, 0);
      },
    }),
  ).current;

  const handleCardPress = () => {
    if (didDrag.current) return;
    if (revealed.current) {
      snapTo(0);
      return;
    }
    onPress?.();
  };

  const handleActionPress = () => {
    snapTo(0);
    setTimeout(() => (isHidden ? onUnhide?.() : onHide?.()), 210);
  };

  return (
    <View style={[styles.wrap, style]} {...panResponder.panHandlers}>
      <Pressable
        onPress={handleActionPress}
        style={[
          styles.action,
          { backgroundColor: isHidden ? colors.primaryMain : '#4D5D6B' },
        ]}>
        <RyIcon name={isHidden ? 'fa-eye' : 'fa-eye-slash'} size={22} color="#FFFFFF" />
        <Text style={[ryFont('600'), styles.actionText]}>
          {(isHidden ? t('wallet.unhide') : t('wallet.hide')).toUpperCase()}
        </Text>
      </Pressable>
      <Animated.View style={[styles.cardLayer, { transform: [{ translateX: tx }] }]}>
        <ProductLargeCard product={product} ongoing={ongoing} onPress={handleCardPress} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: radii.xl,
    marginBottom: 10,
  },
  action: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: ACTION_W,
    zIndex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderTopRightRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  actionText: {
    fontSize: 11,
    letterSpacing: 11 * 0.06,
    color: '#FFFFFF',
  },
  cardLayer: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
  },
});
