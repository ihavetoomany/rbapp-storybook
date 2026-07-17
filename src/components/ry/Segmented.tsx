// Segmented — `.ry-segmented` pill control (Active/Used, Overview/
// Transactions…): grey-200 track, 4px padding, equal-width 13/600
// segments; the active segment gets a paper pill with a soft shadow.

import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useRyTheme } from '@/src/theme/useRyTheme';

import { ryFont } from './typography';

export type SegmentedOption = {
  id: string;
  label: string;
};

export type SegmentedProps = {
  options: SegmentedOption[];
  value: string;
  onChange: (id: string) => void;
  style?: StyleProp<ViewStyle>;
};

export function Segmented({ options, value, onChange, style }: SegmentedProps) {
  const { colors } = useRyTheme();
  return (
    <View style={[styles.track, { backgroundColor: colors.grey200 }, style]}>
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onChange(opt.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.segment, active && [styles.segmentActive, { backgroundColor: colors.bgPaper }]]}>
            <Text
              style={[
                ryFont('600'),
                styles.label,
                { color: active ? colors.fgPrimary : colors.fgSecondary },
              ]}
              numberOfLines={1}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: 999,
    padding: 4,
    marginBottom: 14,
  },
  segment: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    // 0 1px 3px rgba(0,0,0,0.08)
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1.5,
    elevation: 1,
  },
  label: { fontSize: 13 },
});
