// SettingDetailView — port of tabs.jsx: the generic placeholder page for
// rows/flows that aren't part of the prototype yet.

import { router } from 'expo-router';
import React from 'react';

import { EmptyState } from '@/src/components/ry';
import { useT } from '@/src/i18n';

import { DetailScreen } from './DetailScreen';

export function SettingDetailView({ title }: { title: string }) {
  const { t, tCard } = useT();
  return (
    <DetailScreen title={tCard(title)}>
      <EmptyState
        icon="fa-screwdriver-wrench"
        title={tCard(title)}
        desc={t('setting.placeholder_desc')}
        cta={t('setting.back')}
        onCta={() => router.back()}
      />
    </DetailScreen>
  );
}
