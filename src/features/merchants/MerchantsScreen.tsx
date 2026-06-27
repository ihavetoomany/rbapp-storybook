import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Searchbar } from 'react-native-paper';

import { ResursChip, ResursListItem, ScreenLayout } from '@/src/components';

const MERCHANTS = [
  { id: '1', name: 'Elgiganten', category: 'Electronics' },
  { id: '2', name: 'Jula', category: 'Tools & garden' },
  { id: '3', name: 'Boozt', category: 'Fashion' },
  { id: '4', name: 'Apoteket', category: 'Health & beauty' },
];

const FILTERS = ['All', 'Electronics', 'Fashion', 'Home'];

export function MerchantsScreen() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredMerchants = MERCHANTS.filter((merchant) => {
    const matchesQuery =
      merchant.name.toLowerCase().includes(query.toLowerCase()) ||
      merchant.category.toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      activeFilter === 'All' || merchant.category.includes(activeFilter);
    return matchesQuery && matchesFilter;
  });

  return (
    <ScreenLayout title="Merchants" subtitle="Shop with Resurs partners">
      <Searchbar placeholder="Search merchants" value={query} onChangeText={setQuery} />
      <View style={styles.filters}>
        {FILTERS.map((filter) => (
          <ResursChip
            key={filter}
            selected={activeFilter === filter}
            showSelectedOverlay
            onPress={() => setActiveFilter(filter)}>
            {filter}
          </ResursChip>
        ))}
      </View>
      <View style={styles.list}>
        {filteredMerchants.map((merchant, index) => (
          <View key={merchant.id}>
            {index > 0 ? <Divider /> : null}
            <ResursListItem
              title={merchant.name}
              description={merchant.category}
              icon="store"
              showChevron
              onPress={() => undefined}
            />
          </View>
        ))}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  list: {
    borderRadius: 8,
    overflow: 'hidden',
  },
});
