import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { SettingDetailView } from '@/src/features/details';

export default function SettingRoute() {
  const { title } = useLocalSearchParams<{ title?: string }>();
  return <SettingDetailView title={title ?? ''} />;
}
