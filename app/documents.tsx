import { useLocalSearchParams } from 'expo-router';

import { DocumentsView } from '@/src/features/inbox';

export default function DocumentsRoute() {
  const { title, filter, chips, highlightId } = useLocalSearchParams<{
    title?: string;
    filter?: string;
    chips?: string;
    highlightId?: string;
  }>();
  return (
    <DocumentsView
      title={title}
      initialFilter={filter || 'all'}
      chips={chips ? chips.split(',') : undefined}
      highlightId={highlightId}
    />
  );
}
