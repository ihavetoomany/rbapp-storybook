import { Button, type ButtonProps, useTheme } from 'react-native-paper';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import {
  createNeumorphInsetStyle,
  getNeumorphButtonRadius,
  getNeumorphSurfaceColor,
} from '@/src/theme/neumorphic';

export type ResursButtonAppearance = 'elevated' | 'neumorphic';

export type ResursButtonProps = ButtonProps & {
  appearance?: ResursButtonAppearance;
};

export function ResursButton({
  appearance = 'neumorphic',
  mode = 'contained',
  style,
  buttonColor,
  textColor,
  contentStyle,
  disabled,
  ...props
}: ResursButtonProps) {
  const theme = useTheme();

  if (appearance === 'elevated' || disabled || mode === 'contained' || mode === 'elevated') {
    return (
      <Button
        mode={mode}
        style={style}
        buttonColor={buttonColor}
        textColor={textColor}
        contentStyle={contentStyle}
        disabled={disabled}
        {...props}
      />
    );
  }

  const radius = getNeumorphButtonRadius(theme);
  const surfaceColor = getNeumorphSurfaceColor(theme);

  if (mode === 'outlined') {
    return (
      <View
        style={[
          createNeumorphInsetStyle(surfaceColor, radius),
          styles.wrapper,
          style as StyleProp<ViewStyle>,
        ]}
      >
        <Button
          mode="text"
          textColor={textColor ?? theme.colors.primary}
          elevation={0}
          style={[styles.button, { borderRadius: radius }]}
          contentStyle={contentStyle}
          {...props}
        />
      </View>
    );
  }

  return (
    <Button
      mode={mode}
      style={style}
      textColor={textColor ?? theme.colors.primary}
      contentStyle={contentStyle}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
  },
  button: {
    backgroundColor: 'transparent',
  },
});
