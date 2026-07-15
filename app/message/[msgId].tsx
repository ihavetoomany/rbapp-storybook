import { useLocalSearchParams } from 'expo-router';

import { MessageReadView } from '@/src/features/inbox';

export default function MessageRoute() {
  const { msgId } = useLocalSearchParams<{ msgId: string }>();
  return <MessageReadView msgId={msgId ?? ''} />;
}
