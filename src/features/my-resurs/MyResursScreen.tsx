import { StyleSheet, View } from 'react-native';
import { Avatar, Divider, List } from 'react-native-paper';

import { ResursButton, ResursListItem, ResursText, ScreenLayout } from '@/src/components';

const SETTINGS_ITEMS = [
  { title: 'Personal details', icon: 'account-outline' as const },
  { title: 'Notifications', icon: 'bell-outline' as const },
  { title: 'Security', icon: 'shield-outline' as const },
  { title: 'Help & support', icon: 'help-circle-outline' as const },
];

export function MyResursScreen() {
  return (
    <ScreenLayout title="My Resurs" subtitle="Profile & settings">
      <View style={styles.profile}>
        <Avatar.Text size={64} label="RB" />
        <View style={styles.profileText}>
          <ResursText variant="h4">Anna Andersson</ResursText>
          <ResursText variant="body2">anna.andersson@email.com</ResursText>
        </View>
      </View>
      <List.Section>
        {SETTINGS_ITEMS.map((item, index) => (
          <View key={item.title}>
            {index > 0 ? <Divider /> : null}
            <ResursListItem
              title={item.title}
              icon={item.icon}
              showChevron
              onPress={() => undefined}
            />
          </View>
        ))}
      </List.Section>
      <ResursButton mode="outlined" icon="logout">
        Sign out
      </ResursButton>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileText: {
    flex: 1,
    gap: 4,
  },
});
