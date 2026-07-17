import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme, type MD3Theme } from 'react-native-paper';
import { Platform, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { ResursText } from '../typography/ResursText';

const QUICKLINK_RADIUS = 12;
const ICON_SIZE = 24;
const ICON_CONTAINER_SIZE = 40;
const ICON_CHIP_RADIUS_COLLAPSED = ICON_CONTAINER_SIZE * 0.25;
const ICON_CHIP_RADIUS_EXPANDED = ICON_CONTAINER_SIZE / 2;

export type QuickLinkTrend = 'up' | 'down' | 'flat';

export type ResursQuickLinkProps = {
  label: string;
  /** Count shown in parentheses (expanded: inline after title; collapsed: second row). */
  metadata?: number;
  /** Savings trend indicator for budget links (expanded: inline; collapsed: second row). */
  trend?: QuickLinkTrend;
  detail?: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  /** Shown inside the icon chip when expanded (e.g. invoices "Pay"). */
  iconActionLabel?: string;
  expanded?: boolean;
  onPress?: () => void;
  accessibilityHint?: string;
  style?: ViewStyle;
};

const TREND_ICON: Record<
  QuickLinkTrend,
  keyof typeof MaterialCommunityIcons.glyphMap
> = {
  up: 'arrow-up',
  down: 'arrow-down',
  flat: 'arrow-right',
};

function getTrendColor(trend: QuickLinkTrend, colors: MD3Theme['colors']) {
  switch (trend) {
    case 'up':
      return colors.primary;
    case 'down':
      return colors.error;
    case 'flat':
      return colors.onSurfaceVariant;
  }
}

function buildAccessibilityLabel(
  label: string,
  metadata?: number,
  trend?: QuickLinkTrend,
  detail?: string,
  iconActionLabel?: string,
) {
  const parts = [label];
  if (metadata != null) {
    parts.push(String(metadata));
  } else if (trend) {
    parts.push(trend === 'up' ? 'Trending up' : trend === 'down' ? 'Trending down' : 'Unchanged');
  }
  if (detail) {
    parts.push(detail);
  }
  if (iconActionLabel) {
    parts.push(iconActionLabel.replace('>', '').trim());
  }
  return parts.join(', ');
}

export function ResursQuickLink({
  label,
  metadata,
  trend,
  detail,
  icon,
  iconActionLabel,
  expanded = false,
  onPress,
  accessibilityHint,
  style,
}: ResursQuickLinkProps) {
  const theme = useTheme();
  const showMetadataCount = metadata != null;
  const showTrend = trend != null;
  const showDetail = expanded && detail;
  const showIconAction = expanded && iconActionLabel != null;
  const titleLineLimit = expanded ? 1 : 2;
  const accessibilityLabel = buildAccessibilityLabel(
    label,
    metadata,
    trend,
    expanded ? detail : undefined,
    showIconAction ? iconActionLabel : undefined,
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ selected: expanded }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        !expanded && styles.elevated,
        {
          backgroundColor: expanded ? theme.colors.primaryContainer : theme.colors.surface,
          borderRadius: QUICKLINK_RADIUS,
        },
        style,
        pressed && styles.pressed,
      ]}
    >
      <Animated.View
        layout={LinearTransition.springify().damping(26).stiffness(130)}
        style={[
          styles.iconContainer,
          showIconAction ? styles.iconContainerExpanded : styles.iconContainerCollapsed,
          {
            backgroundColor: expanded ? theme.colors.primary : theme.colors.primaryContainer,
            borderRadius: showIconAction ? ICON_CHIP_RADIUS_EXPANDED : ICON_CHIP_RADIUS_COLLAPSED,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={ICON_SIZE}
          color={expanded ? theme.colors.onPrimary : theme.colors.primary}
        />
        {showIconAction ? (
          <ResursText
            variant="caption"
            numberOfLines={1}
            style={[styles.iconActionLabel, { color: theme.colors.onPrimary }]}
            accessibilityElementsHidden
            importantForAccessibility="no">
            {iconActionLabel}
          </ResursText>
        ) : null}
      </Animated.View>
      <View style={styles.textBlock}>
        {expanded ? (
          <>
            <View style={styles.titleRow}>
              <ResursText
                variant="caption"
                style={[styles.label, { color: theme.colors.onPrimaryContainer }]}
                numberOfLines={titleLineLimit}>
                {showMetadataCount ? `${label} (${metadata})` : label}
              </ResursText>
              {showTrend ? (
                <MaterialCommunityIcons
                  name={TREND_ICON[trend]}
                  size={14}
                  color={getTrendColor(trend, theme.colors)}
                  style={styles.trendIcon}
                  accessibilityElementsHidden
                  importantForAccessibility="no"
                />
              ) : null}
            </View>
            {showDetail ? (
              <ResursText
                variant="caption"
                numberOfLines={1}
                style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center' }}>
                {detail}
              </ResursText>
            ) : null}
          </>
        ) : (
          <>
            <ResursText variant="caption" style={styles.label} numberOfLines={titleLineLimit}>
              {label}
            </ResursText>
            {showMetadataCount || showTrend ? (
              <View style={styles.metadataRow}>
                {showMetadataCount ? (
                  <ResursText variant="caption" style={styles.metadata}>
                    ({metadata})
                  </ResursText>
                ) : null}
                {showTrend ? (
                  <MaterialCommunityIcons
                    name={TREND_ICON[trend]}
                    size={14}
                    color={getTrendColor(trend, theme.colors)}
                    accessibilityElementsHidden
                    importantForAccessibility="no"
                  />
                ) : null}
              </View>
            ) : null}
          </>
        )}
      </View>
    </Pressable>
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 8,
  },
  elevated: {
    borderWidth: 0,
    borderColor: 'transparent',
    ...elevatedShadow,
  },
  pressed: {
    opacity: 0.9,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerCollapsed: {
    width: ICON_CONTAINER_SIZE,
    height: ICON_CONTAINER_SIZE,
  },
  iconContainerExpanded: {
    flexDirection: 'row',
    alignSelf: 'center',
    height: ICON_CONTAINER_SIZE,
    paddingHorizontal: 14,
    gap: 4,
  },
  iconActionLabel: {
    fontWeight: '600',
    flexShrink: 0,
  },
  textBlock: {
    alignItems: 'center',
    gap: 2,
    width: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexWrap: 'wrap',
  },
  label: {
    textAlign: 'center',
    fontWeight: '600',
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  metadata: {
    textAlign: 'center',
    fontWeight: '600',
  },
  trendIcon: {
    marginLeft: 4,
  },
});
