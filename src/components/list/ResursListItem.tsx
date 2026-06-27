import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { List, type ListItemProps } from 'react-native-paper';

type ResursListItemProps = ListItemProps & {
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  showChevron?: boolean;
};

export function ResursListItem({
  icon,
  showChevron = false,
  right,
  ...props
}: ResursListItemProps) {
  return (
    <List.Item
      {...props}
      left={
        icon
          ? (iconProps) => <List.Icon {...iconProps} icon={icon} />
          : props.left
      }
      right={
        right ??
        (showChevron
          ? (iconProps) => <List.Icon {...iconProps} icon="chevron-right" />
          : undefined)
      }
    />
  );
}
