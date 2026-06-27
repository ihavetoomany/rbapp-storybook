import { StyleSheet, View } from 'react-native';

import { ResursButton, ResursCard, ResursText, ScreenLayout } from '@/src/components';

export function WalletScreen() {
  return (
    <ScreenLayout title="Wallet" subtitle="Good morning">
      <ResursCard
        title="Resurs Gold"
        subtitle="Credit account"
        description="Available balance: 12 450 kr"
      />
      <ResursCard
        title="Resurs Flex"
        subtitle="Revolving credit"
        description="Available balance: 5 200 kr"
      />
      <View style={styles.actions}>
        <ResursButton mode="contained" icon="credit-card-outline" style={styles.actionButton}>
          Pay invoice
        </ResursButton>
        <ResursButton mode="outlined" icon="plus" style={styles.actionButton}>
          Add card
        </ResursButton>
      </View>
      <ResursText variant="caption">
        Manage your Resurs accounts and cards in one place.
      </ResursText>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
